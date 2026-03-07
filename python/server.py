#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORT = 8000
ROOT = Path(__file__).resolve().parent.parent


class AtlasHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def run() -> None:
    server = ThreadingHTTPServer(("0.0.0.0", PORT), AtlasHandler)
    print(f"Atlas local server running at http://127.0.0.1:{PORT}")
    print("Press Ctrl+C to stop.")
    try:
      server.serve_forever()
    except KeyboardInterrupt:
      print("\nStopping Atlas server...")
    finally:
      server.server_close()


if __name__ == "__main__":
    run()
