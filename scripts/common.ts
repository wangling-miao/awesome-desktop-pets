import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const petsDir = path.join(repoRoot, "pets");
export const publicDir = path.join(repoRoot, "public");
export const downloadsDir = path.join(publicDir, "downloads");
export const publicPetsDir = path.join(publicDir, "pets");

export const petIdPattern = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;
export const semverPattern = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;
export const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export type PetFormat = "desktop-pet" | "hatch-pet-compatible";
export type PetResolution = "1x" | "2x" | "4x";

export interface PetManifest {
  id: string;
  name: string;
  displayName?: string;
  version: string;
  author: string;
  description: string;
  tags: string[];
  license: string;
  preview: "preview.gif";
  previewImage?: "preview.png";
  download?: string;
  format: PetFormat;
  resolution: PetResolution;
  createdAt: string;
  homepage?: string;
  repository?: string;
  spritesheetPath: string;
  spritesheets?: {
    "1x"?: string;
    "2x"?: string;
    "4x"?: string;
  };
  cellSize?: {
    width: number;
    height: number;
  };
  sourceScale?: number;
  pixelated?: boolean;
}

export interface PetRecord {
  dirName: string;
  dirPath: string;
  manifestPath: string;
  manifest: PetManifest;
}

export async function listPetRecords(): Promise<PetRecord[]> {
  const entries = await readdir(petsDir, { withFileTypes: true }).catch(() => []);
  const records: PetRecord[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const dirPath = path.join(petsDir, entry.name);
    const manifestPath = path.join(dirPath, "pet.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as PetManifest;
    records.push({ dirName: entry.name, dirPath, manifestPath, manifest });
  }

  return records.sort((left, right) => left.manifest.id.localeCompare(right.manifest.id));
}

export function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

export function petZipName(manifest: PetManifest): string {
  return `${manifest.id}-v${manifest.version}.zip`;
}

export async function sha256File(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  await new Promise<void>((resolve, reject) => {
    createReadStream(filePath)
      .on("data", (chunk) => hash.update(chunk))
      .on("error", reject)
      .on("end", resolve);
  });
  return hash.digest("hex");
}

export async function fileSize(filePath: string): Promise<number> {
  return (await stat(filePath)).size;
}

