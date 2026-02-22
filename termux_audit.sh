#!/data/data/com.termux/files/usr/bin/bash

echo "=============================="
echo " Termux Environment Audit"
echo "=============================="
echo ""

echo "[1/7] BASIC INFO"
echo "User: $(whoami 2>/dev/null)"
echo "Home: $HOME"
echo "PWD : $(pwd)"
echo "Date: $(date 2>/dev/null)"
echo ""

echo "[2/7] TERMUX PACKAGES (first 200 lines)"
if command -v pkg >/dev/null 2>&1; then
  pkg list-installed 2>/dev/null | head -n 200
else
  echo "pkg not found (unexpected in Termux)."
fi
echo ""

echo "[3/7] GIT STATUS"
if command -v git >/dev/null 2>&1; then
  echo "git version: $(git --version 2>/dev/null)"
  echo ""
  echo "git config --global --list:"
  git config --global --list 2>/dev/null || echo "(no global git config found)"
  echo ""
  echo "SSH keys:"
  ls -la "$HOME/.ssh" 2>/dev/null || echo "(no ~/.ssh directory yet)"
else
  echo "git not installed."
fi
echo ""

echo "[4/7] NODE / NPM / PYTHON"
if command -v node >/dev/null 2>&1; then
  echo "node: $(node -v 2>/dev/null)"
else
  echo "node: not installed"
fi

if command -v npm >/dev/null 2>&1; then
  echo "npm : $(npm -v 2>/dev/null)"
else
  echo "npm : not installed"
fi

if command -v python >/dev/null 2>&1; then
  echo "python: $(python --version 2>/dev/null)"
else
  echo "python: not installed"
fi

if command -v python3 >/dev/null 2>&1; then
  echo "python3: $(python3 --version 2>/dev/null)"
else
  echo "python3: not installed"
fi
echo ""

echo "[5/7] DIRECTORY SNAPSHOT (HOME top level)"
ls -la "$HOME" 2>/dev/null
echo ""

echo "[6/7] FIND WEBSITE PROJECTS (common markers)"
echo "Searching for: index.html, package.json, .git (this may take a moment)"
echo "----------------------------------------"
find "$HOME" -maxdepth 6 \( -name "index.html" -o -name "package.json" -o -name ".git" \) 2>/dev/null | head -n 200
echo "----------------------------------------"
echo ""

echo "[7/7] DISK USAGE"
df -h 2>/dev/null || echo "df not available"
echo ""
echo "DONE."
