import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Precedence order (first loaded sets the env, subsequent ones do not overwrite existing values):
// 1. Process environment (already in process.env)
// 2. .env.local in current working directory
// 3. .env in current working directory
// 4. .env.local in project root
// 5. .env in project root
// 6. ~/.flow-mcp/.env (user global fallback)

const projectRoot = resolve(__dirname, "..");
const cwd = process.cwd();

const candidatePaths = [
  resolve(cwd, ".env.local"),
  resolve(cwd, ".env"),
  resolve(projectRoot, ".env.local"),
  resolve(projectRoot, ".env"),
  join(homedir(), ".flow-mcp", ".env"),
];

const loadedFiles = new Set<string>();
const normalizedSeen = new Set<string>();

for (const candidate of candidatePaths) {
  const normalized = candidate.toLowerCase();
  if (!normalizedSeen.has(normalized) && existsSync(candidate)) {
    normalizedSeen.add(normalized);
    dotenv.config({ path: candidate });
    loadedFiles.add(candidate);
  }
}

export const loadedEnvFiles = Array.from(loadedFiles);
