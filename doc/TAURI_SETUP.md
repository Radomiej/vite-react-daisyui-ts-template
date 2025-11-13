# Tauri Desktop App Setup Guide

## Overview

This document describes how to set up and use the Tauri desktop application version of this project.

**Tauri** is a modern framework for building desktop applications using web technologies. It was chosen over Electron for the following reasons:

### Why Tauri?

- **Smaller Bundle Size**: 2.5-3 MB vs 80-120 MB (Electron)
- **Better Performance**: Uses native OS webview (WebView2 on Windows)
- **Lower Memory Usage**: ~50% less RAM consumption
- **Enhanced Security**: Rust backend with explicit permissions
- **Native System Access**: Secure command execution via Rust

## Prerequisites

**IMPORTANT**: Rust and C++ Build Tools are **REQUIRED** to build and run Tauri desktop apps. You cannot skip these steps.

### What Works WITHOUT Rust:
- ✅ Installing Tauri CLI (`yarn add -D @tauri-apps/cli`)
- ✅ Initializing project (`yarn tauri init`)
- ✅ Building frontend (`yarn build`)

### What REQUIRES Rust + C++ Build Tools:
- ❌ Running desktop app (`yarn tauri dev`)
- ❌ Building .exe (`yarn tauri build`)

### 1. Install Rust (REQUIRED)

Tauri compiles a Rust backend, so Rust toolchain is mandatory.

**Windows Installation:**

1. Download and run [rustup-init.exe](https://rustup.rs/)
2. Follow the installation wizard (accept defaults)
3. **Restart your terminal/IDE** after installation
4. Verify installation:
   ```powershell
   rustc --version
   cargo --version
   ```

Expected output:
```
rustc 1.xx.x (xxxxx 20xx-xx-xx)
cargo 1.xx.x (xxxxx 20xx-xx-xx)
```

### 2. Install Visual Studio C++ Build Tools (REQUIRED for Windows)

Rust needs C++ compiler to build native Windows apps.

1. Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)
2. Run installer and select **"Desktop development with C++"** workload
3. Install (requires ~7GB disk space)
4. **Restart your computer**

## Installation

Once Rust is installed, install Tauri dependencies:

```bash
yarn add -D @tauri-apps/cli
yarn add @tauri-apps/api
```

## Initialize Tauri

Initialize Tauri in the project:

```bash
yarn tauri init
```

When prompted:
- **App name**: vite-react-daisyui-ts
- **Window title**: Vite React DaisyUI App
- **Web assets location**: ../dist
- **Dev server URL**: http://localhost:5173
- **Frontend dev command**: yarn dev
- **Frontend build command**: yarn build

## Project Structure

After initialization, the project structure will include:

```
vite-react-daisyui-ts/
├── src/                    # React frontend
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/
│   │   └── main.rs        # Main Rust file
│   ├── Cargo.toml         # Rust dependencies
│   ├── tauri.conf.json    # Tauri configuration
│   └── icons/             # App icons
└── package.json
```

## Development

### Run in Development Mode

```bash
yarn tauri dev
```

This will:
1. Start the Vite dev server
2. Launch the Tauri desktop app
3. Enable hot-reload for both frontend and backend

### Build for Production

```bash
yarn tauri build
```

The built application will be in `src-tauri/target/release/`.

## Features

### Command Execution

The Tauri app includes secure command execution capabilities:

- Execute CMD commands from the frontend
- Rust backend validates and executes commands
- Results are returned to the frontend
- Configurable command whitelist for security

### Example Usage

```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Execute a command
const result = await invoke('execute_command', {
  command: 'dir',
  args: []
});

console.log(result);
```

## Security Considerations

1. **Command Whitelist**: Only approved commands can be executed
2. **Explicit Permissions**: All system access must be declared in `tauri.conf.json`
3. **Rust Backend**: Type-safe command handling
4. **CSP Headers**: Content Security Policy enabled by default

## Troubleshooting

### Rust Not Found

If you get "rustc not found" error:
1. Ensure Rust is installed: `rustc --version`
2. Restart your terminal/IDE
3. Check PATH environment variable includes Cargo bin directory

### Build Errors

If you encounter build errors:
1. Update Rust: `rustup update`
2. Clean build: `yarn tauri build --clean`
3. Check Visual Studio Build Tools are installed

### WebView2 Missing (Windows)

Windows 10/11 should have WebView2 pre-installed. If not:
1. Download [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)
2. Install and restart

## Resources

- [Tauri Documentation](https://tauri.app/)
- [Tauri API Reference](https://tauri.app/v1/api/js/)
- [Rust Documentation](https://doc.rust-lang.org/)
