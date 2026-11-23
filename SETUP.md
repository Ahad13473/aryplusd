# StreamSnapper (ARY Plus Video Downloader) - Linux Setup & Test Guide

A self-hosted web app that downloads videos from ARY Plus / ARY ZAP
(aryplus.tv, aryzap.com) and any direct MP4 / HLS (.m3u8) URL. Segments
are fetched in parallel and merged into a clean, playable MP4.

## 0. Grab the code

Two ways to get the project onto your machine:

- **From the running app:** click the **"Download code"** button in the
  header (or open `http://<host>:3000/api/source` directly). It packages
  the full source into `streamsnapper-source-<date>.tar.gz` - no secrets,
  no node_modules, no downloaded videos. Then:

  ```bash
  tar -xzf streamsnapper-source-<date>.tar.gz -C streamsnapper
  cd streamsnapper
  ```

- **Or copy the project folder** you already have (skip `node_modules`,
  `.next`, `storage/` and `db/` - they are regenerated locally).


## 1. Prerequisites (Linux)

```bash
# Node.js 20.9+ (Next.js 16 requirement) - check with:
node -v

# OR Bun 1.2+ (faster installs)
bun -v

# ffmpeg - REQUIRED for MPEG-TS -> MP4 remux and thumbnail generation
sudo apt update && sudo apt install -y ffmpeg    # Debian / Ubuntu
# sudo dnf install -y ffmpeg                     # Fedora
# sudo pacman -S ffmpeg                          # Arch

ffmpeg -version   # verify
```

Without ffmpeg the downloader still works (files stay as `.ts`, no thumbnails).
With ffmpeg installed, HLS downloads are automatically remuxed to MP4.

## 2. Install

```bash
cd <project-folder>

# With Bun (recommended)
bun install

# OR with npm
npm install
```

## 3. Configure the database (SQLite, zero setup)

Create a `.env` file in the project root:

```bash
echo 'DATABASE_URL="file:../db/custom.db"' > .env
```

(The path is relative to `prisma/schema.prisma`, so the DB lands in
`<project>/db/custom.db`.)

Then push the schema:

```bash
bun run db:push      # or: npm run db:push
```

## 4. Run

```bash
bun run dev          # or: npm run dev
```

Open http://localhost:3000

- The default `dev` script uses **webpack** (stable on low-RAM machines).
- If your machine has 8 GB+ RAM and you want faster compiles:
  `bun run dev:turbo` (Turbopack).

### Production mode (optional)

```bash
bun run build
bun run start        # serves the standalone build on port 3000
```

## 5. Test it

### A. ARY Plus flow (the main feature)

1. Open http://localhost:3000
2. Tab **"Search ARY Plus"**: type a drama name (e.g. `Meray Paas Tum Ho`)
   and hit Search. Click a result card.
   - OR tab **"Paste a link"**: paste a series link such as
     `https://aryplus.tv/series/v1/<id>` (also supports `watch/v1/...`,
     `sharer/series/...`, `video/v2/...` and legacy aryzap.com links).
3. The series panel shows poster, description and every episode.
4. Expand an episode, pick a quality (1080p / 720p / 480p / 240p), press
   **Download** - or press **Download all** to queue every episode at best
   quality.
5. Watch live progress (speed, ETA, segments) in the **Downloads** tab.
6. Finished jobs appear in the **Library** tab with a thumbnail; use the
   download button to save the MP4 to your machine.

### B. Generic URLs (no ARY needed)

Paste into "Paste a link":

- Direct file: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
- HLS stream: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

### C. API smoke tests (terminal)

```bash
curl -s localhost:3000/api/downloads | head -c 300

curl -s -X POST localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}'

curl -s -X POST localhost:3000/api/aryplus/search \
  -H 'Content-Type: application/json' -d '{"query":"jaan"}'
```

## 6. Where files are saved

- Final videos + thumbnails: `<project>/storage/<jobId>.mp4` / `.jpg`
- In-progress segment parts: `<project>/storage/tmp/<jobId>/` (auto-cleaned)
- Download metadata: SQLite database in `db/`

## 7. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Port 3000 busy | Change `-p 3000` in the `dev` script of `package.json` |
| Downloads stuck at 98-99% | Fixed: the engine now has a 30s stall watchdog and auto-retries stalled segments. Restart the dev server to load it. |
| "publish url does not display anything" | Fixed: ARY resolution is verified working (search -> episodes -> 4 qualities). If a specific link errors with "does not recognize this content (404)", the title was removed or the link expired - use Search instead. |
| Premium / DRM titles | Detected and refused - DRM-protected streams cannot be downloaded. |
| Thumbnails missing | Install ffmpeg (see step 1). |
| Out of memory during dev compile | Use the default webpack dev script instead of `dev:turbo`. |
| Reset database | Stop the server, delete `db/custom.db`, run `bun run db:push` again. |

## Notes

- Downloads from ARY Plus use the public web-app API of aryplus.tv; only
  non-DRM content is supported, for personal/offline use.
- The server binds `0.0.0.0:3000`, so other devices on your LAN can use it
  via `http://<your-linux-ip>:3000`.
