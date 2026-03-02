#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Windows Secure Rebuild — Forge Atlas
    Hardens a Windows 10/11 machine against MITM attacks, resets the network stack,
    enforces a password change on next logon, activates Windows Defender, and removes
    common persistence vectors (suspicious startup entries, run keys, scheduled tasks).

.DESCRIPTION
    Run this from an elevated PowerShell prompt (right-click > Run as Administrator).
    Safe to run multiple times.  All major actions are logged to C:\ForgeAtlas\secure-rebuild.log.

.NOTES
    Version : 1.0.0
    Author  : Forge Atlas (ironjesus74@gmail.com)
    License : MIT
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Bootstrap logging
# ---------------------------------------------------------------------------
$LogDir  = "C:\ForgeAtlas"
$LogFile = "$LogDir\secure-rebuild.log"
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force | Out-Null }

function Write-Log {
    param([string]$Msg, [string]$Level = "INFO")
    $ts   = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $line = "[$ts][$Level] $Msg"
    Add-Content -Path $LogFile -Value $line
    switch ($Level) {
        "OK"   { Write-Host $line -ForegroundColor Green }
        "WARN" { Write-Host $line -ForegroundColor Yellow }
        "ERR"  { Write-Host $line -ForegroundColor Red }
        default{ Write-Host $line }
    }
}

Write-Log "=== Forge Atlas — Windows Secure Rebuild started ==="

# ---------------------------------------------------------------------------
# STEP 1 — Force current user to change password at next logon
# ---------------------------------------------------------------------------
Write-Log "STEP 1: Enforcing password change for current user..."
try {
    $user = $env:USERNAME
    # Local accounts: use net user; catches both SAM and domain
    $result = net user $user /logonpasswordchg:yes 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Log "net user returned exit code $LASTEXITCODE — may require domain admin rights: $result" "WARN"
    } else {
        Write-Log "net user output: $result" "OK"
    }
} catch {
    Write-Log "Password-change enforcement failed (may require domain admin): $_" "WARN"
}

# ---------------------------------------------------------------------------
# STEP 2 — Network stack reset (clears MITM-injected routes/ARP cache)
# ---------------------------------------------------------------------------
Write-Log "STEP 2: Resetting network stack..."
try {
    netsh int ip reset          | Out-Null
    netsh int ipv6 reset        | Out-Null
    netsh winsock reset         | Out-Null
    netsh winhttp reset proxy   | Out-Null
    ipconfig /flushdns          | Out-Null
    arp -d *                    2>$null | Out-Null
    Write-Log "Network stack reset complete." "OK"
} catch {
    Write-Log "Network reset error: $_" "WARN"
}

# Remove suspicious DNS overrides (restore DHCP-assigned DNS)
Write-Log "STEP 2b: Restoring DNS to DHCP on all adapters..."
Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | ForEach-Object {
    try {
        Set-DnsClientServerAddress -InterfaceAlias $_.Name -ResetServerAddresses
        Write-Log "  DNS reset on adapter: $($_.Name)" "OK"
    } catch {
        Write-Log "  Could not reset DNS on $($_.Name): $_" "WARN"
    }
}

# ---------------------------------------------------------------------------
# STEP 3 — Disable LLMNR and NetBIOS (common MITM pivot protocols)
# ---------------------------------------------------------------------------
Write-Log "STEP 3: Disabling LLMNR and NetBIOS over TCP/IP..."
try {
    # Disable LLMNR via registry
    $llmnrPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient"
    if (-not (Test-Path $llmnrPath)) { New-Item -Path $llmnrPath -Force | Out-Null }
    Set-ItemProperty -Path $llmnrPath -Name "EnableMulticast" -Value 0 -Type DWord
    Write-Log "LLMNR disabled." "OK"
} catch {
    Write-Log "Could not disable LLMNR: $_" "WARN"
}

try {
    # Disable NetBIOS over TCP/IP on all adapters
    $adapters = Get-WmiObject -Class Win32_NetworkAdapterConfiguration -Filter "IPEnabled=True"
    foreach ($a in $adapters) {
        $a.SetTcpipNetbios(2) | Out-Null   # 2 = Disable NetBIOS
    }
    Write-Log "NetBIOS over TCP/IP disabled on all adapters." "OK"
} catch {
    Write-Log "Could not disable NetBIOS: $_" "WARN"
}

# ---------------------------------------------------------------------------
# STEP 4 — Windows Firewall: enable all profiles, block unsolicited inbound
# ---------------------------------------------------------------------------
Write-Log "STEP 4: Hardening Windows Firewall..."
try {
    Set-NetFirewallProfile -All -Enabled True
    Set-NetFirewallProfile -All -DefaultInboundAction Block -DefaultOutboundAction Allow
    Write-Log "Firewall enabled on all profiles; inbound default = Block." "OK"
} catch {
    Write-Log "Firewall hardening error: $_" "WARN"
}

# Block SMB inbound (TCP 445) — common lateral-movement / MITM vector
try {
    if (-not (Get-NetFirewallRule -DisplayName "ForgeAtlas-Block-SMB-In" -ErrorAction SilentlyContinue)) {
        New-NetFirewallRule -DisplayName "ForgeAtlas-Block-SMB-In" `
            -Direction Inbound -Protocol TCP -LocalPort 445 `
            -Action Block -Profile Any | Out-Null
        Write-Log "Inbound SMB (TCP 445) blocked." "OK"
    } else {
        Write-Log "Inbound SMB rule already present." "OK"
    }
} catch {
    Write-Log "Could not add SMB block rule: $_" "WARN"
}

# ---------------------------------------------------------------------------
# STEP 5 — Windows Defender: ensure real-time protection is on, run quick scan
# ---------------------------------------------------------------------------
Write-Log "STEP 5: Activating Windows Defender real-time protection..."
try {
    Set-MpPreference -DisableRealtimeMonitoring $false
    Set-MpPreference -DisableBehaviorMonitoring $false
    Set-MpPreference -DisableIOAVProtection $false
    Write-Log "Real-time and behavior monitoring enabled." "OK"
} catch {
    Write-Log "Defender preference update failed: $_" "WARN"
}

Write-Log "STEP 5b: Starting Windows Defender quick scan (background)..."
try {
    Start-MpScan -ScanType QuickScan -AsJob | Out-Null
    Write-Log "Quick scan started in background." "OK"
} catch {
    Write-Log "Could not start Defender scan: $_" "WARN"
}

# ---------------------------------------------------------------------------
# STEP 6 — Remove suspicious startup / persistence entries
# ---------------------------------------------------------------------------
Write-Log "STEP 6: Auditing startup registry run keys for anomalies..."

$RunKeys = @(
    "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run",
    "HKCU:\Software\Microsoft\Windows\CurrentVersion\RunOnce",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce"
)

# Paths that should never appear in Run keys — clear indicators of malware persistence
$SuspiciousPatterns = @(
    "\\Temp\\",
    "\\AppData\\Local\\Temp\\",
    "\\Users\\Public\\",
    "\\ProgramData\\(?!Microsoft).*",      # Anything in ProgramData not under Microsoft\
    "powershell.*-enc",
    "powershell.*-e ",
    "cmd.*\/c.*start",
    "wscript",
    "cscript",
    "mshta",
    "regsvr32.*scrobj",
    "rundll32.*javascript"
)

foreach ($key in $RunKeys) {
    if (Test-Path $key) {
        $entries = Get-ItemProperty -Path $key
        $entries.PSObject.Properties | Where-Object {
            $_.Name -notmatch "^PS" -and $_.Value -is [string]
        } | ForEach-Object {
            $name = $_.Name
            $val  = $_.Value
            $hit  = $SuspiciousPatterns | Where-Object { $val -imatch $_ }
            if ($hit) {
                Write-Log "  [SUSPICIOUS] $key\$name = $val" "WARN"
                Write-Log "  Removing suspicious run entry: $name" "WARN"
                try {
                    Remove-ItemProperty -Path $key -Name $name -Force
                    Write-Log "  Removed: $name" "OK"
                } catch {
                    Write-Log "  Could not remove $name : $_" "ERR"
                }
            } else {
                Write-Log "  [OK] $key\$name = $val"
            }
        }
    }
}

# ---------------------------------------------------------------------------
# STEP 7 — Audit scheduled tasks for suspicious entries
# ---------------------------------------------------------------------------
Write-Log "STEP 7: Auditing scheduled tasks..."
try {
    $tasks = Get-ScheduledTask | Where-Object { $_.TaskPath -notmatch "\\Microsoft\\" }
    foreach ($t in $tasks) {
        $actions = $t.Actions | ForEach-Object { "$($_.Execute) $($_.Arguments)" }
        $hit = $SuspiciousPatterns | Where-Object { $actions -imatch $_ }
        if ($hit) {
            Write-Log "  [SUSPICIOUS TASK] $($t.TaskName): $actions" "WARN"
            try {
                Unregister-ScheduledTask -TaskName $t.TaskName -Confirm:$false
                Write-Log "  Removed task: $($t.TaskName)" "OK"
            } catch {
                Write-Log "  Could not remove task $($t.TaskName): $_" "ERR"
            }
        }
    }
    Write-Log "Scheduled task audit complete." "OK"
} catch {
    Write-Log "Scheduled task audit error: $_" "WARN"
}

# ---------------------------------------------------------------------------
# STEP 8 — Flush browser proxy / IE proxy settings (MITM often sets a proxy)
# ---------------------------------------------------------------------------
Write-Log "STEP 8: Clearing proxy settings..."
try {
    $proxyPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
    Set-ItemProperty -Path $proxyPath -Name "ProxyEnable"  -Value 0
    Set-ItemProperty -Path $proxyPath -Name "ProxyServer"  -Value "" -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $proxyPath -Name "AutoConfigURL" -Value "" -ErrorAction SilentlyContinue
    # Also flush via netsh
    netsh winhttp reset proxy | Out-Null
    Write-Log "Proxy settings cleared." "OK"
} catch {
    Write-Log "Proxy reset error: $_" "WARN"
}

# ---------------------------------------------------------------------------
# STEP 9 — Enable Windows Update auto-download (patch quickly)
# ---------------------------------------------------------------------------
Write-Log "STEP 9: Ensuring Windows Update auto-download is active..."
try {
    $wuPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU"
    if (-not (Test-Path $wuPath)) { New-Item -Path $wuPath -Force | Out-Null }
    Set-ItemProperty -Path $wuPath -Name "NoAutoUpdate" -Value 0 -Type DWord
    Set-ItemProperty -Path $wuPath -Name "AUOptions"    -Value 3 -Type DWord   # Auto download, prompt to install
    Write-Log "Windows Update auto-download enabled." "OK"
} catch {
    Write-Log "Windows Update policy error: $_" "WARN"
}

# ---------------------------------------------------------------------------
# STEP 10 — Enable audit policies (so you have logs if this happens again)
# ---------------------------------------------------------------------------
Write-Log "STEP 10: Enabling security audit policies..."
$auditCategories = @(
    "Logon"
    "Logoff"
    "Account Logon"
    "Account Management"
    "Process Creation"
    "Network Policy Server"
)
foreach ($cat in $auditCategories) {
    try {
        auditpol /set /category:"$cat" /success:enable /failure:enable | Out-Null
        Write-Log "  Audit enabled: $cat" "OK"
    } catch {
        Write-Log "  Could not set audit for '$cat': $_" "WARN"
    }
}

# ---------------------------------------------------------------------------
# DONE
# ---------------------------------------------------------------------------
Write-Log "=== Secure Rebuild complete.  A REBOOT is required to apply all changes. ==="
Write-Log "=== Log saved to: $LogFile ==="

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Forge Atlas — Secure Rebuild COMPLETE" -ForegroundColor Cyan
Write-Host "  Log: $LogFile" -ForegroundColor Cyan
Write-Host "  PLEASE REBOOT NOW to apply all network/registry changes." -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan
