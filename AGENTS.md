# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

**PUP Fitness Calendar** is a single-process Python/Tkinter desktop app (not a web app). The canonical source lived in `SOURCE CODE.pdf`; runnable code is generated as `main.py` via `python3 scripts/extract_from_pdf.py "SOURCE CODE.pdf" main.py`.

### Services

| Service | Required? | Notes |
|---------|-----------|-------|
| Python GUI (`main.py`) | **Yes** | Only runtime process |
| X11 display (`DISPLAY`) | **Yes** | Already available in Cloud Agent VMs (`:1`) |
| SQLite (`users.db`) | **Yes** | Created automatically by `init_db()` on startup |
| Internet / browser | Optional | Calendar dates open YouTube links via `webbrowser` |

There is no Docker, API server, or `docker-compose` stack.

### Standard commands

See `requirements.txt` for dependencies. Typical workflow:

- **Install deps:** `pip install -r requirements.txt` (also needs system package `python3-tk`)
- **Regenerate source from PDF (if needed):** `python3 scripts/extract_from_pdf.py "SOURCE CODE.pdf" main.py`
- **Run app:** `python3 main.py`
- **Tests:** `python3 -m unittest discover -s tests -v`

### Non-obvious caveats

- Logo path is `assets/PUP.png` (relative to repo root); the original PDF used a hardcoded Windows path.
- Registration requires `@iskolarngbayan.pup.edu.ph` email addresses.
- The app window defaults to 1610×900; use the desktop pane to interact with it.
- `users.db` is created in the working directory when the app starts.
