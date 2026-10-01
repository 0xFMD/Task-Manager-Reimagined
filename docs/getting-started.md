# Getting Started

Start the daemon first then the app.

## Requirements

- Linux
- Python with `pip`
- Node.js with `npm`

## 1. Start the daemon

```sh
cd daemon
python -m venv .venv
source .venv/bin/activate
pip install .
python daemon.py
```

The daemon runs in the background and listens on `$XDG_RUNTIME_DIR/process-manager.sock`.

## 2. Start the app

In a new terminal:

```sh
cd app
npm install
npm run dev
```

On X11, or if the window doesn't show up, use `npm run x11_dev` instead.

## NixOS

For nix users run `nix-shell` before step 2. It provides the deps and setup the environment.
