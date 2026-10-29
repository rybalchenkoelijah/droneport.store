# Deploying to Coolify

Production runs on Coolify (https://coolify.droneport.store) at https://droneport.store,
built from the `master` branch.

Everything needed for a deploy lives in this repository:

| File | What it defines |
|---|---|
| `docker-compose.prod.yml` | Services, build targets, volumes, healthchecks. Coolify reads it on every deploy. |
| `docker/*/Dockerfile` (`production` target) | Images with the code baked in. |
| `.coolify/app.json` | Coolify-side settings: repo, branch, compose path, domain, non-secret env. |
| `scripts/coolify-sync.py` | Applies `.coolify/app.json` via the Coolify API, optionally deploys. |

Secrets (`OPENCART_PASSWORD`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`) are kept only in Coolify's
environment variables. The sync script generates any that are missing and never prints them.

## Deploy

```bash
scripts/coolify-sync.py --deploy
```

Needs `COOLIFY_TOKEN` in the environment (a Coolify API token with deploy rights).

## Persistent data

Named volumes survive redeploys: `mysql-data` (database), `opencart-state` (generated
`config.php`, `admin/config.php`, `install.lock`, `.htaccess`), `opencart-image` (uploaded images),
`opencart-storage` (`system/storage`). The installer runs only on the very first start.

Local development is unchanged: `docker compose up` uses `docker-compose.yml` with bind mounts.
