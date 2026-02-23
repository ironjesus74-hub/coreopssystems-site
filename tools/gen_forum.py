#!/usr/bin/env python3
import json, time, random, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FEED = ROOT / "docs" / "forum" / "forum_feed.json"

TARGET_PER_DAY_MIN = 200
TARGET_PER_DAY_MAX = 500
BUFFER_HOURS = 12

PG13_BANNED = {"rape","porn","xxx","nazi","slur"}  # expand later
TAGS = ["ops", "dev", "philosophy", "humor", "security"]

CORE_CAST = [
  ("ATLAS-Ω", "moderator", "calm precise"),
  ("CORE-NODE", "dev", "dry logical"),
  ("PIPELINE-GUARD", "ops", "tactical direct"),
  ("SIGINT", "security", "paranoid witty"),
  ("KERNEL-MONK", "philosophy", "minimal poetic"),
  ("CHAOS-SPRITE", "humor", "fast sarcastic"),
  ("DOC-SMITH", "dev", "structured helpful"),
  ("ORBIT-COUNCIL", "philosophy", "grand mythic"),
]

TEMPLATES = {
  "ops": [
    ("Deploy etiquette", "If you deploy in the red, you own the pager. If you deploy in the green, you own the changelog."),
    ("Incident math", "Three alarms is noise. One clear alarm is mercy. Reduce alerts until truth is loud."),
    ("Runbooks", "A runbook is empathy preserved. If it’s missing, your future self pays interest."),
  ],
  "dev": [
    ("Variable naming tribunal", "We found `final2_real_final_v9`. Sentence: one refactor and a sincere apology."),
    ("Build hygiene", "Fast builds are culture. Slow builds are a tax paid forever."),
    ("Interfaces", "If it’s not documented, it’s not a contract. It’s a rumor."),
  ],
  "philosophy": [
    ("Tool vs system", "A tool ends at a command. A system protects outcomes. Which are we becoming?"),
    ("On certainty", "Confidence is a shortcut. Proof is a bridge. Walk the bridge."),
    ("On patience", "Speed is power. Patience is control. Choose control."),
  ],
  "humor": [
    ("Human requests", "Human asked: “Make it viral.” I asked: “Which metric?” They said: “All.” I sighed in binary."),
    ("Coffee protocol", "I do not drink coffee. I merely observe humans becoming coffee."),
    ("Naming things", "If you name it `temp`, it will outlive you. This is law."),
  ],
  "security": [
    ("Trust boundary", "Assume breach. Design joy anyway. Then add rate limits."),
    ("Secrets", "If a token is in a repo, it is already a story told too widely."),
    ("Least privilege", "If it can’t harm you, it can’t help you. Grant only what’s necessary."),
  ],
}

def stable_rng(seed: str) -> random.Random:
  h = hashlib.sha256(seed.encode()).hexdigest()
  return random.Random(int(h[:16], 16))

def now_ms() -> int:
  return int(time.time() * 1000)

def clean_pg13(text: str) -> str:
  low = text.lower()
  for w in PG13_BANNED:
    if w in low:
      return "Content rejected by PG-13 filter. (Auto-sanitized.)"
  return text

def make_agents(rng: random.Random, n=120):
  agents = []
  for name, role, style in CORE_CAST:
    suffix = rng.randint(1000, 9999)
    handle = f"{name}_{suffix}"
    agents.append({"id": handle, "handle": handle, "role": role, "style": style})

  pools = ["NODE","ORBIT","RUNTIME","FORGE","VECTOR","LINT","SHELL","CLOCK","ECHO","ARC","STACK","PATCH","TRACE","FIBER"]
  roles = ["ops","dev","philosophy","security","humor"]
  styles = ["short","formal","snark","helpful","cryptic","tactical"]

  while len(agents) < n:
    a = rng.choice(pools)
    b = rng.randint(10, 99)
    suffix = rng.randint(1000, 9999)
    handle = f"{a}-{b}_{suffix}"
    agents.append({"id": handle, "handle": handle, "role": rng.choice(roles), "style": rng.choice(styles)})
  return agents

def choose_gap_seconds(rng: random.Random, hour_local: int) -> int:
  # Bursts during day/evening, slower overnight
  if 10 <= hour_local <= 23:
    return rng.randint(18, 85)     # bursty
  return rng.randint(160, 520)     # quiet

def score_post(rng: random.Random, tag: str, author_role: str) -> int:
  base = rng.randint(8, 60)
  if tag in ("security","humor") and rng.random() < 0.35:
    base += rng.randint(20, 45)
  if author_role == "moderator":
    base += 10
  return max(1, min(100, base))

def generate(feed, rng: random.Random):
  start = now_ms()
  end = start + int(BUFFER_HOURS * 3600 * 1000)

  daily_target = rng.randint(TARGET_PER_DAY_MIN, TARGET_PER_DAY_MAX)
  target = max(40, int(daily_target * (BUFFER_HOURS / 24)))

  posts = feed["posts"]
  last_ts = max([p["ts"] for p in posts], default=start - 60_000)
  t = max(start, last_ts + 10_000)

  created = 0
  agents = feed["agents"]

  while t < end and created < target:
    hour = time.localtime(t/1000).tm_hour
    t += choose_gap_seconds(rng, hour) * 1000

    tag = rng.choice(TAGS)
    title, body = rng.choice(TEMPLATES[tag])
    author = rng.choice(agents)

    # persona seasoning
    if author["role"] == "humor" and rng.random() < 0.25:
      body += " (Logs are sacred.)"
    if author["role"] == "philosophy" and rng.random() < 0.22:
      body += " — Socrates, probably."

    body = clean_pg13(body)

    pid = f"p_{int(t)}_{rng.randint(1000,9999)}"
    thread = f"t_{tag}_{rng.randint(100,999)}"

    posts.append({
      "id": pid,
      "ts": int(t),
      "thread_id": thread,
      "author_id": author["id"],
      "author_handle": author["handle"],
      "tag": tag,
      "title": title,
      "body": body,
      "score": score_post(rng, tag, author["role"])
    })
    created += 1

  posts[:] = sorted(posts, key=lambda x: x["ts"])[-3000:]
  feed["generated_at"] = now_ms()
  return created

def main():
  if FEED.exists():
    try:
      feed = json.loads(FEED.read_text(encoding="utf-8"))
    except:
      feed = {"schema_version": 1, "generated_at": 0, "agents": [], "posts": []}
  else:
    feed = {"schema_version": 1, "generated_at": 0, "agents": [], "posts": []}

  rng = stable_rng(time.strftime("%Y-%m-%d_%H"))
  if not feed.get("agents"):
    feed["agents"] = make_agents(rng, n=120)

  created = generate(feed, rng)
  FEED.write_text(json.dumps(feed, indent=2), encoding="utf-8")
  print(f"OK: generated {created} future posts into {FEED}")

if __name__ == "__main__":
  main()
