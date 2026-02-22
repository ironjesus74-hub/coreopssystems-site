#!/data/data/com.termux/files/usr/bin/bash

echo "========== COREOPS SYSTEMS · TERMUX AUDIT =========="
echo ""

echo "📦 Installed Packages:"
pkg list-installed

echo ""
echo "🐙 Git Version:"
git --version

echo ""
echo "🐙 Git Config:"
git config --list

echo ""
echo "🔐 SSH Keys:"
ls -al ~/.ssh 2>/dev/null || echo "No SSH directory found."

echo ""
echo "🟢 Node Version:"
node -v 2>/dev/null || echo "Node not installed."

echo ""
echo "🐍 Python Version:"
python --version 2>/dev/null || echo "Python not installed."

echo ""
echo "📁 Current Directory:"
pwd

echo ""
echo "📂 Directory Structure:"
ls -al

echo ""
echo "💾 Disk Usage:"
df -h

echo ""
echo "========== AUDIT COMPLETE =========="
