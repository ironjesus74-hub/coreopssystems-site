#!/usr/bin/env bash
set -euo pipefail

echo "[1] Creating structure..."
mkdir -p css js assets

echo "[2] Writing index.html..."
printf '%s\n' \
'<!DOCTYPE html>' \
'<html lang="en">' \
'<head>' \
'  <meta charset="UTF-8">' \
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">' \
'  <title>Forge Atlas | Automation Infrastructure</title>' \
'  <link rel="stylesheet" href="css/style.css">' \
'</head>' \
'<body>' \
'  <nav class="nav">' \
'    <div class="logo">Forge Atlas</div>' \
'    <a href="#services">Services</a>' \
'    <a href="#contact">Contact</a>' \
'  </nav>' \
'  <section class="hero">' \
'    <h1>Automation Built From Day One</h1>' \
'    <p>DevOps, AI Workflows, Supervisors, Multi-Platform Automation.</p>' \
'    <a class="cta" href="#contact">Start Building</a>' \
'  </section>' \
'  <section id="services" class="section">' \
'    <h2>What We Build</h2>' \
'    <ul>' \
'      <li>CI/CD Infrastructure</li>' \
'      <li>Automation Bots & Supervisors</li>' \
'      <li>Dev Toolkits & CLI Wrappers</li>' \
'      <li>Cross-Platform Scripting</li>' \
'    </ul>' \
'  </section>' \
'  <section id="contact" class="section">' \
'    <h2>Work With Forge Atlas</h2>' \
'    <p>Email: ironjesus74@gmail.com</p>' \
'  </section>' \
'  <footer class="footer">' \
'    <p>Built from Android. Engineered for Scale.</p>' \
'  </footer>' \
'  <script src="js/main.js"></script>' \
'</body>' \
'</html>' \
> index.html

echo "[3] Writing CSS..."
printf '%s\n' \
'body { margin:0; font-family:system-ui; background:#0f172a; color:#e2e8f0; }' \
'.nav { display:flex; justify-content:space-between; padding:20px; background:#020617; }' \
'.nav a { color:#38bdf8; text-decoration:none; margin-left:20px; }' \
'.hero { padding:100px 20px; text-align:center; }' \
'.hero h1 { font-size:2.5rem; margin-bottom:20px; }' \
'.cta { background:#38bdf8; padding:12px 24px; color:#020617; text-decoration:none; border-radius:6px; }' \
'.section { padding:60px 20px; max-width:800px; margin:auto; }' \
'.section ul { list-style:none; padding:0; }' \
'.section li { padding:10px 0; border-bottom:1px solid #1e293b; }' \
'.footer { text-align:center; padding:30px; background:#020617; font-size:0.9rem; }' \
> css/style.css

echo "[4] Writing JS..."
printf '%s\n' \
'console.log("Forge Atlas site initialized.");' \
> js/main.js

echo "[5] Creating favicon..."
printf '%s' '🛠️' > assets/favicon.txt

echo "[6] Validating..."
[ -f index.html ] || { echo "index.html missing"; exit 1; }
[ -f css/style.css ] || { echo "CSS missing"; exit 1; }

echo "[✓] Site build complete."
