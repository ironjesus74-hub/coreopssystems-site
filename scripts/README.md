# Forge Atlas — Free Scripts

Free PowerShell / Bash scripts from Forge Atlas.
Use them as-is or adapt them for your environment.

---

## windows-secure-rebuild.ps1

Hardens a Windows 10/11 machine quickly when you suspect a MITM attack or account
compromise.  Designed to run in one shot from an elevated PowerShell window.

### What it does

| Step | Action |
|------|--------|
| 1 | Forces the current user to change their password at next logon |
| 2 | Full network-stack reset (`netsh int ip reset`, `winsock reset`, `flushdns`, ARP cache clear) |
| 2b | Restores DNS to DHCP on all live adapters (removes injected DNS servers) |
| 3 | Disables LLMNR and NetBIOS over TCP/IP (common MITM pivot protocols) |
| 4 | Enables Windows Firewall on all profiles, sets inbound default to **Block**, blocks inbound SMB (TCP 445) |
| 5 | Enables Defender real-time + behavior monitoring, starts a quick scan in the background |
| 6 | Audits startup Run keys and removes entries with suspicious patterns (temp paths, encoded PowerShell, mshta, etc.) |
| 7 | Audits scheduled tasks outside `\Microsoft\` and removes suspicious ones |
| 8 | Clears IE/WinHTTP proxy settings (MITM attacks often inject a proxy) |
| 9 | Re-enables Windows Update auto-download so you can patch immediately |
| 10 | Enables key security audit policies so you have event logs going forward |

All actions are logged to `C:\ForgeAtlas\secure-rebuild.log`.

### How to run

> ⚠️ Must be run as **Administrator**.

**Option A — one-liner (download + run)**

```powershell
# Open PowerShell as Administrator, then:
Set-ExecutionPolicy Bypass -Scope Process -Force
irm https://raw.githubusercontent.com/ironjesus74-hub/coreopssystems-site/main/scripts/windows-secure-rebuild.ps1 | iex
```

**Option B — download first, inspect, then run**

```powershell
# Download
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/ironjesus74-hub/coreopssystems-site/main/scripts/windows-secure-rebuild.ps1" -OutFile "$env:USERPROFILE\Desktop\windows-secure-rebuild.ps1"

# Review the script before running it (always good practice!)
notepad "$env:USERPROFILE\Desktop\windows-secure-rebuild.ps1"

# Run (as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force
& "$env:USERPROFILE\Desktop\windows-secure-rebuild.ps1"
```

**After the script completes, reboot immediately.**

### What to do next (after reboot)

1. Log in — you will be prompted to set a new password.
2. Check `C:\ForgeAtlas\secure-rebuild.log` for any `[WARN]` or `[ERR]` lines.
3. Open Windows Update and install all pending patches.
4. Run a full Defender scan: `Start-MpScan -ScanType FullScan`.
5. If you still suspect active compromise, consider a clean Windows reinstall from USB
   (download the official Media Creation Tool from microsoft.com).

---

Need a custom hardening script or full security automation pack?
Email **ironjesus74@gmail.com** or visit [Forge Atlas](https://ironjesus74-hub.github.io/coreopssystems-site/).
