from pathlib import Path
import base64, json, re, urllib.parse

root = Path(".")
index = (root/"index.html").read_text(encoding="utf-8")
css   = (root/"style.css").read_text(encoding="utf-8")
js    = (root/"script.js").read_text(encoding="utf-8")

# Embed noise.png into CSS if present
noise_path = root/"assets/noise.png"
if noise_path.exists():
    b64 = base64.b64encode(noise_path.read_bytes()).decode("ascii")
    data_uri = f"data:image/png;base64,{b64}"
    css = re.sub(r'url\((["\']?)(?:\./)?assets/noise\.png\1\)', f'url("{data_uri}")', css)

# Embed favicon.svg as data URI if present
fav_path = root/"assets/favicon.svg"
fav_data_uri = None
if fav_path.exists():
    svg = fav_path.read_text(encoding="utf-8")
    fav_data_uri = "data:image/svg+xml," + urllib.parse.quote(svg)

# Embed quotes.json for fetch interception
quotes_path = root/"data/quotes.json"
quotes_json = "[]"
if quotes_path.exists():
    try:
        quotes_json = json.dumps(json.loads(quotes_path.read_text(encoding="utf-8")))
    except Exception:
        quotes_json = "[]"

shim = f"""
<script>
(() => {{
  // Single-file demo shim: serve quotes.json from memory so the existing JS keeps working.
  const QUOTES = {quotes_json};
  const origFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = (input, init) => {{
    const url = (typeof input === "string") ? input : (input && input.url) || "";
    if (url.endsWith("data/quotes.json")) {{
      return Promise.resolve(new Response(JSON.stringify(QUOTES), {{
        headers: {{ "Content-Type": "application/json" }}
      }}));
    }}
    return origFetch ? origFetch(input, init) : Promise.reject(new Error("fetch unavailable"));
  }};
}})();
</script>
"""

# Inline CSS and JS
index = re.sub(r'<link[^>]+href=["\']style\.css["\'][^>]*>', f"<style>\n{css}\n</style>", index, flags=re.I)

# Replace external JS include(s)
index = re.sub(r'<script[^>]+src=["\']script\.js["\'][^>]*>\s*</script>', f"<script>\n{js}\n</script>", index, flags=re.I)

# Insert shim before the main script (best effort: put right before </body>)
if "</body>" in index:
    index = index.replace("</body>", shim + "\n</body>")
else:
    index += shim

# Swap favicon href to data URI if we found it
if fav_data_uri:
    index = re.sub(r'href=["\'](?:\./)?assets/favicon\.svg["\']', f'href="{fav_data_uri}"', index)

out = root/"dist/forge-atlas-demo.html"
out.write_text(index, encoding="utf-8")
print(f"OK: wrote {out}")
