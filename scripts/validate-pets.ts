import { access, readFile } from "node:fs/promises";
import path from "node:path";
import {
  datePattern,
  listPetRecords,
  petIdPattern,
  semverPattern,
  type PetManifest,
} from "./common";

const requiredFiles = ["pet.json", "preview.png", "preview.gif", "README.md", "LICENSE"];
const formats = new Set(["desktop-pet", "hatch-pet-compatible"]);
const resolutions = new Set(["1x", "2x", "4x"]);

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function validateManifest(recordDir: string, manifest: PetManifest) {
  assert(petIdPattern.test(manifest.id), "id must be kebab-case, 3-64 characters");
  assert(manifest.id === recordDir, "id must match its directory name");
  assert(typeof manifest.name === "string" && manifest.name.trim().length > 0, "name is required");
  assert(
    semverPattern.test(manifest.version),
    "version must be semver-like, for example 1.0.0",
  );
  assert(
    typeof manifest.author === "string" && manifest.author.trim().length > 0,
    "author is required",
  );
  assert(
    typeof manifest.description === "string" && manifest.description.trim().length > 0,
    "description is required",
  );
  assert(Array.isArray(manifest.tags) && manifest.tags.length > 0, "tags must not be empty");
  assert(
    manifest.tags.every((tag) => /^[a-z0-9][a-z0-9-]{0,31}$/.test(tag)),
    "tags must be lowercase kebab-case",
  );
  assert(typeof manifest.license === "string" && manifest.license.length > 0, "license is required");
  assert(manifest.preview === "preview.gif", "preview must be preview.gif");
  assert(formats.has(manifest.format), "format must be desktop-pet or hatch-pet-compatible");
  assert(resolutions.has(manifest.resolution), "resolution must be 1x, 2x, or 4x");
  assert(datePattern.test(manifest.createdAt), "createdAt must be YYYY-MM-DD");
  assert(
    typeof manifest.spritesheetPath === "string" && manifest.spritesheetPath.trim().length > 0,
    "spritesheetPath is required so launcher imports can run",
  );

  if (manifest.cellSize) {
    assert(
      Number.isInteger(manifest.cellSize.width) && manifest.cellSize.width > 0,
      "cellSize.width must be a positive integer",
    );
    assert(
      Number.isInteger(manifest.cellSize.height) && manifest.cellSize.height > 0,
      "cellSize.height must be a positive integer",
    );
  }

  if (manifest.sourceScale !== undefined) {
    assert(
      Number.isInteger(manifest.sourceScale) && manifest.sourceScale >= 1 && manifest.sourceScale <= 4,
      "sourceScale must be an integer from 1 to 4",
    );
  }
}

async function validatePet(recordDir: string, dirPath: string) {
  for (const fileName of requiredFiles) {
    const filePath = path.join(dirPath, fileName);
    assert(await exists(filePath), `missing ${fileName}`);
  }

  const manifest = JSON.parse(await readFile(path.join(dirPath, "pet.json"), "utf8")) as PetManifest;
  await validateManifest(recordDir, manifest);

  const spritesheets = new Set<string>([
    manifest.spritesheetPath,
    ...(manifest.spritesheets ? Object.values(manifest.spritesheets).filter(Boolean) : []),
  ]);

  for (const spritesheet of spritesheets) {
    assert(await exists(path.join(dirPath, spritesheet)), `missing spritesheet ${spritesheet}`);
  }
}

async function main() {
  const records = await listPetRecords();
  const errors: string[] = [];

  for (const record of records) {
    try {
      await validatePet(record.dirName, record.dirPath);
      console.log(`ok ${record.manifest.id}`);
    } catch (error) {
      errors.push(`${record.dirName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (errors.length > 0) {
    console.error(errors.map((error) => `error ${error}`).join("\n"));
    process.exit(1);
  }

  console.log(`validated ${records.length} pet package(s)`);
}

void main();

