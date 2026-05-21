# WingUI

A modern graphical interface for [Windows Package Manager (winget)](https://learn.microsoft.com/en-us/windows/package-manager/winget/). Browse, search, install, update, and uninstall apps without using the terminal.

Built with **Tauri 2**, **React**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **TanStack Query**.

## Features

- App catalog with virtualized grid and search (Ctrl+K)
- One-click install with progress events (no terminal window)
- Installed apps, updates, and “Update all”
- Favorites, batch install selection, import/export
- SQLite cache for packages, settings, and icons
- Dark / light / system theme
- Glassmorphism UI with Framer Motion animations

## Requirements

- Windows 10/11 with [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) installed
- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)
- [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually preinstalled on Windows 11)

## Development

```bash
cd wingui
npm install
npm run tauri dev
```

## Production build

```bash
npm run tauri build
```

Installer output is under `src-tauri/target/release/bundle/`.

## Project structure

```
wingui/
├── src/                 # React frontend
│   ├── components/      # UI, layout, app cards
│   ├── pages/           # Home, Discover, Installed, etc.
│   ├── hooks/           # TanStack Query hooks
│   ├── services/        # Tauri invoke API
│   ├── store/           # Zustand stores
│   └── types/
└── src-tauri/           # Rust backend
    └── src/
        ├── winget.rs    # winget CLI integration
        ├── database.rs  # SQLite
        └── cache.rs     # Icon caching
```

## Notes

- Package IDs are validated before any winget command runs.
- Commands use `CREATE_NO_WINDOW` on Windows so no console flashes.
- Icons are fetched from Clearbit / Google favicon APIs and cached locally.

## License

MIT
