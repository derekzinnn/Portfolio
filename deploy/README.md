# Deploy — CI/CD (merge to `main` → build on GitHub → run on the VPS)

Flow: **push/merge to `main`** → GitHub Actions builds a Docker image and pushes it to **GHCR** → it SSHes into the VPS and runs `docker compose pull && up -d`. The heavy Next build runs on GitHub's runner, so the VPS never risks an OOM.

Files involved: [`Dockerfile`](../Dockerfile), [`.dockerignore`](../.dockerignore), [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml), and this folder's [`docker-compose.yml`](./docker-compose.yml).

---

## One-time setup

### 1. Dedicated SSH deploy key

On your machine, create a key **just for CI** (no passphrase):

```bash
ssh-keygen -t ed25519 -C "gha-deploy-portfolio" -f gha_deploy -N ""
```

- Put the **public** key on the VPS (append to the deploy user's `~/.ssh/authorized_keys`):
  ```bash
  ssh-copy-id -i gha_deploy.pub <user>@<vps-host>
  # or: cat gha_deploy.pub | ssh <user>@<vps-host> 'cat >> ~/.ssh/authorized_keys'
  ```
- The **private** key file (`gha_deploy`) goes into the GitHub secret `VPS_SSH_KEY` (full contents, including the BEGIN/END lines).

### 2. GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret        | Value                                                              |
| ------------- | ------------------------------------------------------------------ |
| `VPS_HOST`    | VPS IP / hostname                                                  |
| `VPS_USER`    | SSH user (e.g. `ubuntu`, `opc`)                                    |
| `VPS_SSH_KEY` | contents of the **private** `gha_deploy` file                      |
| `DEPLOY_PATH` | folder on the VPS holding the compose file (e.g. `/srv/portfolio`) |
| `VPS_PORT`    | _(optional)_ SSH port, only if not `22`                            |

> `GITHUB_TOKEN` is provided automatically — it's what pushes the image to GHCR. You don't create it.

### 3. Put the compose file on the VPS

```bash
ssh <user>@<vps-host>
sudo mkdir -p /srv/portfolio && sudo chown $USER /srv/portfolio
# copy deploy/docker-compose.yml into /srv/portfolio/docker-compose.yml
```

Wire Caddy to it (pick the option matching your compose):

- **Caddy on the host** (compose Option A, `127.0.0.1:3000`):
  ```
  derek.dev.br {
      reverse_proxy 127.0.0.1:3000
  }
  ```
- **Caddy in Docker** (compose Option B, shared `web` network):
  ```
  derek.dev.br {
      reverse_proxy portfolio:3000
  }
  ```

### 4. Make the GHCR image pullable

After the **first** successful workflow run, the image exists at
`ghcr.io/derekzinnn/portfolio`. Simplest: make it **public** so the VPS pulls with no login —
GitHub → your profile → **Packages → portfolio → Package settings → Change visibility → Public**.

> Prefer to keep it private? Create a PAT with `read:packages`, add secrets `GHCR_USER` +
> `GHCR_TOKEN`, and uncomment the `docker login` line in `.github/workflows/deploy.yml`.

---

## Day-to-day

Just **merge your branch into `main`**. The `Deploy` workflow builds, pushes, and rolls the
container. Watch it under the repo's **Actions** tab. Manual re-deploy: Actions →
**Deploy → Run workflow**.

First run only: the deploy step needs the compose file already on the VPS (step 3) and the
image pullable (step 4).
