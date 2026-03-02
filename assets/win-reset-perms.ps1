#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Forge Atlas — Windows Permission Reset
    Reclaims file ownership, resets ACLs, and strips hidden/system/read-only
    attributes on a target path so you can rebuild from a clean baseline.

.DESCRIPTION
    Three-stage sweep:
      1. takeown  — take NTFS ownership of every file and folder
      2. icacls   — reset ACL entries to inherited defaults
      3. attrib   — remove Hidden (-H), System (-S), and Read-Only (-R) flags

    Safe to run over C:\, a specific drive, or any sub-path.
    Requires an elevated (Administrator) PowerShell session.

.PARAMETER Path
    Root path to reset.  Defaults to the current drive root (e.g. C:\).

.PARAMETER WhatIf
    Dry-run — show commands without executing them.

.EXAMPLE
    .\win-reset-perms.ps1
    .\win-reset-perms.ps1 -Path D:\Projects
    .\win-reset-perms.ps1 -WhatIf
#>
param(
    [string]$Path   = "$env:SystemDrive\",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"   # log errors, keep going

function Invoke-Step {
    param([string]$Label, [scriptblock]$Action)
    Write-Host "`n[$Label]" -ForegroundColor Cyan
    if ($WhatIf) {
        Write-Host "  WhatIf: would run — $($Action.ToString().Trim())" -ForegroundColor DarkYellow
    } else {
        & $Action
    }
}

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  Forge Atlas — Windows Permission Reset" -ForegroundColor Magenta
Write-Host "  Target : $Path"
Write-Host "  WhatIf : $($WhatIf.IsPresent)"
Write-Host "========================================" -ForegroundColor Magenta

# ── 1. TAKEOWN ────────────────────────────────────────────────────────────────
Invoke-Step "takeown" {
    & takeown /F $Path /R /D Y 2>&1 | ForEach-Object {
        if ($_ -match "SUCCESS|ERROR|FAILED") { Write-Host "  $_" }
    }
}

# ── 2. ICACLS RESET ───────────────────────────────────────────────────────────
Invoke-Step "icacls" {
    & icacls $Path /reset /T /C /Q
}

# ── 3. ATTRIB — strip Hidden, System, Read-Only ───────────────────────────────
Invoke-Step "attrib" {
    & attrib -H -S -R "$Path*" /S /D
}

Write-Host "`n[DONE] Permission reset complete on: $Path" -ForegroundColor Green
Write-Host "       You can now rebuild, copy files, or re-image from this state." -ForegroundColor Green
