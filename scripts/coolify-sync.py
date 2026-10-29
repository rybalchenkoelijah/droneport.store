#!/usr/bin/env python3
"""Apply .coolify/app.json to the Coolify application and optionally deploy it.

Usage:
    COOLIFY_TOKEN=... scripts/coolify-sync.py            # sync settings only
    COOLIFY_TOKEN=... scripts/coolify-sync.py --deploy   # sync, deploy and wait for the result

Missing secrets listed in "required_secrets" are generated once and stored in Coolify;
existing secret values are never overwritten or printed.
"""
import json
import os
import secrets
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = json.load(open(os.path.join(ROOT, ".coolify", "app.json")))

TOKEN = os.environ.get("COOLIFY_TOKEN")
if not TOKEN:
    sys.exit("COOLIFY_TOKEN is not set")

API = os.environ.get("COOLIFY_URL", CONFIG["coolify_url"]).rstrip("/") + "/api/v1"
APP = CONFIG["application_uuid"]


def call(method, path, body=None):
    req = urllib.request.Request(
        API + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": "Bearer " + TOKEN, "Content-Type": "application/json", "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read() or "null")
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{method} {path} -> {e.code}: {e.read().decode()[:500]}") from None


def sync():
    call("PATCH", f"/applications/{APP}", CONFIG["settings"])
    print("settings: ok")

    envs = call("GET", f"/applications/{APP}/envs")
    existing = {e["key"]: e for e in envs if not e.get("is_preview")}

    # Includes preview copies: Coolify passes every variable to the build as a build arg
    for e in envs:
        if e["key"] in CONFIG.get("obsolete_env", []):
            call("DELETE", f"/applications/{APP}/envs/{e['uuid']}")
            print(f"env: removed {e['key']}" + (" (preview)" if e.get("is_preview") else ""))

    data = [{"key": k, "value": v} for k, v in CONFIG.get("env", {}).items()]
    for key in CONFIG.get("required_secrets", []):
        if key not in existing:
            # 16 chars: OpenCart admin passwords must be 5-20 characters
            data.append({"key": key, "value": secrets.token_hex(8)})
            print(f"env: generated secret {key}")
    if data:
        call("PATCH", f"/applications/{APP}/envs/bulk", {"data": data})
    print("env: ok")

    domains = [{"name": n, "domain": d} for n, d in CONFIG.get("domains", {}).items()]
    try:
        call("PATCH", f"/applications/{APP}", {"docker_compose_domains": domains})
        print("domains: ok")
        return True
    except RuntimeError as e:
        # Coolify accepts domains only after it has loaded the compose file (i.e. after a deploy)
        print(f"domains: deferred ({e})")
        return False


def deploy():
    res = call("POST", f"/deploy?uuid={APP}&force=false")
    dep = res["deployments"][0]["deployment_uuid"]
    print(f"deploy: queued {dep}")
    while True:
        time.sleep(10)
        d = call("GET", f"/deployments/{dep}")
        if d["status"] not in ("queued", "in_progress"):
            break
    print(f"deploy: {d['status']}")
    if d["status"] != "finished":
        for line in json.loads(d.get("logs") or "[]")[-25:]:
            if not line.get("hidden"):
                print("  " + line["output"][:300])
    return d["status"] == "finished"


if __name__ == "__main__":
    domains_ok = sync()
    if "--deploy" in sys.argv:
        ok = deploy()
        if not domains_ok:
            # Retry now that the compose file is loaded, then redeploy so the domain takes effect
            if sync():
                ok = deploy()
        sys.exit(0 if ok else 1)
