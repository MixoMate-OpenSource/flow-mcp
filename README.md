# flow-mcp

Drive **Google Flow** ([flow.google.com](https://flow.google.com)) directly from **Claude**, **Codex**, **Antigravity**, or any Model Context Protocol (MCP) client — or use the built-in **Flow Studio** control panel — using the credits included in your Google AI subscription (Pro or Ultra) instead of a pay-per-use video API.

`flow-mcp` runs locally on your computer. It drives a dedicated Google Chrome instance via the Chrome DevTools Protocol (CDP), clicks the native Flow interface at human pace, and bypasses bot-detection issues with zero extensions or external proxies.

```text
┌──────────────────────────────────────────────┐
│  Claude / Codex / Antigravity / MCP Client   │
└──────────────────────┬───────────────────────┘
                       │ stdio (JSON-RPC)
                       ▼
┌──────────────────────────────────────────────┐
│                  flow-mcp                    │
│   • 17 Native MCP Tools                      │
│   • Director Continuity Engine (Skill/Prompt)│
│   • Local Job Queue & Credit Protection      │
│   • Flow Studio Web Panel (Port 8787)        │
└──────────────────────┬───────────────────────┘
                       │ Chrome DevTools Protocol (CDP: 9333)
                       ▼
┌──────────────────────────────────────────────┐
│         Chrome (Dedicated Profile)           │
│        ──► Google Flow (Real UI)             │
└──────────────────────────────────────────────┘
```

---

## Key Features

- **Credit Protection**: Every generation inspects Flow's live credit quote and automatically aborts if it exceeds your defined credit limit (`max_credits`, default 25).
- **Free Keyframing**: Generates unlimited free image stills (Nano Banana 2, 0 credits) to lock the visual look before rendering videos.
- **Shot-to-Shot Continuity**: Supports `chain_previous` (seamless multi-clip continuous takes), `first_frame` + `last_frame` interpolation, and multi-asset reference injection (`reference_images`).
- **Director Continuity Engine (Packaged Skill & Prompt)**: Enforces real-world biomechanics, character identity vectors (CIV), authentic camera optics (focal lengths, depth of field, 180° vector lock), and speech respiration constraints.
- **Character Studio**: Creates, edits, and lists persistent characters (`flow_characters`, `flow_character`), usable across scenes as `asset:<name>`.
- **Narration & Audio Stitching**: Free text-to-speech with Google AI Studio (`flow_narrate` via Gemini) or system voices, combined with local FFmpeg assembling (`flow_assemble`) to join clips, voiceovers, and background music into a single MP4.
- **Flow Studio Web UI**: Full-featured standalone visual studio at `http://127.0.0.1:8787` for managing characters, shots, transitions, audio, and project media.

---

## Requirements

| Requirement | Details |
|---|---|
| **Operating System** | macOS or Windows 10/11 |
| **Node.js** | Node.js 22 or newer (`node --version`) |
| **Package Manager** | `pnpm` (recommended) or `npm` |
| **Google Chrome** | Latest stable release |
| **Google AI Subscription** | Pro or Ultra (supplies Flow generation credits) |
| **FFmpeg** *(Optional)* | Required for stitching, mixing, or audio assembly (`winget install Gyan.FFmpeg` on Windows, `brew install ffmpeg` on macOS) |
| **Google AI Studio Key** *(Optional)* | Free key from [Google AI Studio](https://aistudio.google.com/apikey) for Google's native narration voices |

> **Directory Placement**:
> - **macOS**: Do not clone into `~/Desktop`, `~/Documents`, or `~/Downloads` due to macOS App Sandbox permissions (`EPERM`). Use `~/flow-mcp` or your home directory.
> - **Windows**: Avoid folders synced with OneDrive (e.g. cloud-synced Documents or Desktop). Use `C:\Users\<you>\flow-mcp` or a dedicated workspace folder.

---

## Installation & Initial Setup

### 1. Clone & Build

```bash
git clone https://github.com/MixoMate-OpenSource/flow-mcp.git
cd flow-mcp
pnpm install
pnpm run build
```

### 2. Authenticate Once

```bash
pnpm run login
```

This launches a dedicated Chrome instance using an isolated profile stored in `~/.flow-mcp/chrome-profile`:
1. Sign into your Google Account in the opened Chrome window.
2. Navigate to [flow.google.com](https://flow.google.com) and create or open a project.
3. Keep the Chrome window open (or let `flow-mcp` manage it). `flow-mcp` never accesses or handles your credentials directly.

---

## How to Use

### 1. With Antigravity (Google DeepMind IDE & CLI)

`flow-mcp` includes a complete `.agents/` plugin bundle out of the box with zero manual JSON configuration required.

#### Automatic Workspace Discovery
When you open this repository in Antigravity:
1. The **`flow-mcp` plugin** located at `.agents/plugins/flow-mcp` is discovered automatically.
2. The **Director Skill** (`director`) is automatically registered to guide scene construction and prevent AI drift.
3. The **MCP Server** (`dist/index.js`) is launched automatically through `.agents/plugins/flow-mcp/mcp_config.json`.

#### Global Configuration (All Projects)
To use `flow-mcp` and the Director skill in any Antigravity workspace, add it to your global config (`~/.gemini/config/mcp_config.json`):

```json
{
  "mcpServers": {
    "flow-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/flow-mcp/dist/index.js"]
    }
  }
}
```

Copy the Director skill into your global skills folder if you want it globally available:
```bash
# Windows
mkdir -p "$env:USERPROFILE\.gemini\config\skills\director"
Copy-Item -Recurse ".agents\plugins\flow-mcp\skills\director\*" "$env:USERPROFILE\.gemini\config\skills\director"

# macOS / Linux
mkdir -p ~/.gemini/config/skills/director
cp -r .agents/plugins/flow-mcp/skills/director/* ~/.gemini/config/skills/director/
```

**In Chat with Antigravity:**
> *"Check my Flow session and list my project characters."*  
> *"Direct a 3-scene cyberpunk alley chase using the Director skill rules. Lock our character Pip, keep camera on an 85mm lens with handheld sway, and generate the shots with chaining."*

---

### 2. With Claude

#### Claude Desktop
Add `flow-mcp` to your `claude_desktop_config.json`:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "flow": {
      "command": "node",
      "args": ["/absolute/path/to/flow-mcp/dist/index.js"]
    }
  }
}
```
*(On Windows, escape backslashes: `"C:\\Users\\you\\flow-mcp\\dist\\index.js"`).*

#### Claude Code (CLI)
Register the server in Claude Code:

```bash
claude mcp add flow -- node /absolute/path/to/flow-mcp/dist/index.js
```

**Using the Director Prompt in Claude:**
Claude will discover the native MCP prompt `flow_director`:
> Select `/flow_director` from the prompt menu or ask:  
> *"Use the flow_director prompt to format a cinematic sequence for a detective entering a neon-lit diner."*

---

### 3. With Codex

Add `flow-mcp` to your Codex configuration file (`~/.codex/config.toml` or `%USERPROFILE%\.codex\config.toml`):

```toml
[mcp_servers.flow]
command = "node"
args = ["/absolute/path/to/flow-mcp/dist/index.js"]
```

Or add it via CLI:
```bash
codex mcp add flow -- node /absolute/path/to/flow-mcp/dist/index.js
```

> **Note on Timeouts:** Codex defaults to a 60-second MCP tool execution timeout. `flow-mcp` has built-in patience management: operations taking longer than 45 seconds (such as generating characters or downloading high-res renders) immediately return an active task ID, continuing work in the background. Codex will poll `flow_wait` until finished.

---

### 4. With Cursor, Zed, & Other MCP Clients

For any editor supporting standard stdio MCP:
- **Command**: `node`
- **Args**: `["/absolute/path/to/flow-mcp/dist/index.js"]`

---

## The Locked-State Director Skill

When generating video sequences, AI models frequently suffer from **AI drift**: character faces morph, clothes change between cuts, impossible physics occur, and camera angles jump erratically.

The **Director Engine** (`director`) enforces strict continuity laws:
1. **Master Anchor Document Layer**: Compiles a persistent **Character Identity Vector (CIV)** (height, build, clothing layers, scars) and **Art & Graphical Manifest (AGM)** (lens sensor, noise grain) before generation.
2. **Biomechanical & Physical State Machine**: Enforces human kinesthetics. Forbids simultaneous speaking and swallowing; enforces weight transfer and deceleration; inserts autonomic breathing and ocular saccades.
3. **Voice & Audio Architecture**: Injects authentic respiratory pauses (`[sharp breath]`, `[0.3s cognitive pause]`) and acoustic occlusion (muffled rooms, distance drop-off).
4. **Authentic Lens Optics**: Forbids impossible floating CGI pans. Requires real-world focal lengths (24mm wide, 50mm normal, 85mm portrait), aperture depth-of-field, and strict enforcement of the **180-Degree Vector Rule**.
5. **Toolchain Integration**: Directly maps planned shots into `flow_techniques`, `flow_characters`, and `flow_generate` with `chain_previous: true`.

---

## Standalone Web Control Panel: Flow Studio

Prefer a graphical user interface without an AI chat assistant? Run the included local web application:

```bash
pnpm run studio
```
Or double-click `Flow Studio.cmd` (Windows) / `Flow Studio.command` (macOS). Then navigate to:
```
http://127.0.0.1:8787
```

Flow Studio provides seven dedicated workspaces:
- **Cast**: Create, preview, and edit reusable character assets.
- **Frames**: Render free stills (Nano Banana 2) with "Match previous frame" continuity.
- **Shots**: Render video clips with duration/resolution controls, live credit quotes, and last-frame continuation.
- **Voice**: Record voiceovers using Google AI Studio or system voices, with speech speed and style modulation.
- **Restyle**: Video-to-video editing (change weather, relight, or modify scene elements).
- **Cut**: Multi-track video stitching with voiceover mix, background music loops, and custom volume levels.
- **Library**: Browse, download upscaled renders, or organize Flow project media.

---

## MCP Tools Reference

| Tool | Type | Description |
|---|---|---|
| `flow_status` | Read | Inspects Flow connection, active project, account plan, credits remaining, and prompt playbook. |
| `flow_generate` | Write | Submits generation jobs: text-to-video, image-to-video, aspect ratios, durations, resolutions, variants, and `chain_previous`. |
| `flow_wait` | Read | Polls asynchronous generation jobs or long-running tasks until finished. |
| `flow_cancel` | Write | Cancels a queued job before it starts processing. |
| `flow_retry` | Write | Retries failed scene renders using identical settings. |
| `flow_assets` | Read | Lists images, videos, and media items currently in the active project. |
| `flow_download` | Write | Downloads project media locally (including free 1080p / 2K upscales) without re-spending credits. |
| `flow_trash` | Write | Moves a media item to Flow's recoverable Trash folder. |
| `flow_agent_images` | Write | High-throughput batch generator: renders up to 50 images in parallel using Flow's Agent mode (0 credits). |
| `flow_edit` | Write | Video-to-video editing on an existing clip (relighting, atmosphere, object adjustments). |
| `flow_continue` | Write | Extends a finished video from its last frame while keeping attached character identities locked. |
| `flow_character` | Write | Generates a persistent, reusable character portrait from description or image. |
| `flow_character_edit`| Write | Modifies or restyles an existing character's portrait while preserving identity. |
| `flow_characters` | Read | Lists all reusable characters (`asset:<name>`) in the active project. |
| `flow_techniques` | Read | Lists 39 cinematography and prompt technique presets (dolly zoom, crash zoom, FPV drone, hero rotation, etc.). |
| `flow_narrate` | Write | Generates narration audio files using Google Gemini TTS or native OS voices. |
| `flow_voices` | Read | Lists all available speech voices and verifies Google AI Studio API key configuration. |
| `flow_assemble` | Write | Stitches video scenes, background audio, and narration into an MP4 using local FFmpeg. |

### MCP Prompts & Resources

| Identifier | Type | Description |
|---|---|---|
| `flow_director` | Prompt | MCP prompt template applying the Locked-State Director engine to any story or scene concept. |
| `flow://skills/director` | Resource | Read-only MCP resource containing the full Director engine system specification. |

---

## Workflow Recipes

### 1. Zero-Cost Scene Exploration
1. Check credits and status: `flow_status`
2. Create your protagonist: `flow_character` with name and visual traits.
3. Generate multiple scene stills using free images (Nano Banana 2, 0 credits): `flow_generate` with `type: "image"`.
4. Review image outputs in `~/flow-mcp-out/<project>/`.

### 2. Seamless Continuous Sequence
1. Submit a multi-scene batch to `flow_generate`:
   - Scene 1: Establishes character and starting action.
   - Scene 2: Sets `chain_previous: true` (begins exactly on the last frame of Scene 1).
   - Scene 3: Sets `chain_previous: true` (continues action without jump-cuts).
2. Call `flow_wait` until finished.
3. Record narration: `flow_narrate` with voice ID and script lines.
4. Assemble into a single video: `flow_assemble` with clips in sequence, voiceover, and background music.

---

## Configuration (`.env`)

Copy `.env.example` to `.env` to customize settings:

```bash
cp .env.example .env
```

| Variable | Default | Purpose |
|---|---|---|
| `FLOW_MCP_PORT` | `8787` | Local HTTP API and Flow Studio UI port |
| `FLOW_MCP_CDP_PORT` | `9333` | Chrome DevTools Protocol debugging port |
| `FLOW_MCP_OUTPUT` | `~/flow-mcp-out` | Local directory for downloaded media and assembled videos |
| `FLOW_MCP_HOME` | `~/.flow-mcp` | Directory for Chrome profile, auth tokens, and session data |
| `FLOW_MCP_PAUSE_MIN_S` | `25` | Minimum pause between generation requests (anti-throttling) |
| `FLOW_MCP_PAUSE_MAX_S` | `70` | Maximum pause between generation requests |
| `FLOW_MCP_PATIENCE_MS` | `45000` | Max duration a tool call blocks before returning a task ID |
| `GEMINI_API_KEY` | - | Optional Google AI Studio key for Google narration voices |

---

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| *"Not signed in"* or *"no project open"* | Dedicated Chrome instance is closed or unauthenticated. | Run `pnpm run login`, sign in, open a Flow project, and leave Chrome running. |
| `EPERM: operation not permitted` (macOS) | Cloned inside protected folder (`Desktop`, `Documents`). | Move the project to `~/flow-mcp` and re-link your MCP config. |
| Request timed out in client | Operation took longer than client's tool timeout limit. | `flow-mcp` automatically converts calls >45s into background tasks. Run `flow_wait` with the task ID. |
| Clip rendered in Flow but file not saved locally | Network interruption or timeout before download. | Call `flow_download` with the media title — Flow retains completed renders for free re-download. |
| Video assembly fails | FFmpeg is not found in system `PATH`. | Install FFmpeg (`winget install Gyan.FFmpeg` on Windows, `brew install ffmpeg` on macOS) or set `FLOW_MCP_FFMPEG` in `.env`. |

---

## License & Disclaimer

This project automates the web interface of Google Flow for personal convenience using your own existing subscription credits. It is not affiliated with, endorsed by, or sponsored by Google. Use responsibly and in accordance with applicable platform terms.
