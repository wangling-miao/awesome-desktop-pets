import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  downloadsDir,
  fileSize,
  listPetRecords,
  petZipName,
  publicDir,
  publicPetsDir,
  sha256File,
  toPosixPath,
} from "./common";

interface GalleryIndexPet {
  id: string;
  name: string;
  displayName: string;
  version: string;
  author: string;
  description: string;
  tags: string[];
  license: string;
  preview: string;
  previewImage: string;
  manifest: string;
  download: string;
  downloadSize: number;
  downloadSha256: string;
  format: string;
  resolution: string;
  createdAt: string;
  homepage?: string;
  repository?: string;
}

function relativeUrl(...parts: string[]) {
  return parts.map((part) => toPosixPath(part).replace(/^\/+|\/+$/g, "")).join("/");
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  await rm(publicPetsDir, { recursive: true, force: true });
  await mkdir(publicPetsDir, { recursive: true });

  const records = await listPetRecords();
  const pets: GalleryIndexPet[] = [];

  for (const record of records) {
    const { manifest } = record;
    const publicPetDir = path.join(publicPetsDir, manifest.id);
    await mkdir(publicPetDir, { recursive: true });
    await copyFile(path.join(record.dirPath, "preview.png"), path.join(publicPetDir, "preview.png"));
    await copyFile(path.join(record.dirPath, "preview.gif"), path.join(publicPetDir, "preview.gif"));
    await copyFile(path.join(record.dirPath, "pet.json"), path.join(publicPetDir, "pet.json"));

    const zipName = petZipName(manifest);
    const zipPath = path.join(downloadsDir, zipName);
    const download = manifest.download ?? relativeUrl("downloads", zipName);

    pets.push({
      id: manifest.id,
      name: manifest.name,
      displayName: manifest.displayName ?? manifest.name,
      version: manifest.version,
      author: manifest.author,
      description: manifest.description,
      tags: manifest.tags,
      license: manifest.license,
      preview: relativeUrl("pets", manifest.id, "preview.gif"),
      previewImage: relativeUrl("pets", manifest.id, "preview.png"),
      manifest: relativeUrl("pets", manifest.id, "pet.json"),
      download,
      downloadSize: await fileSize(zipPath),
      downloadSha256: await sha256File(zipPath),
      format: manifest.format,
      resolution: manifest.resolution,
      createdAt: manifest.createdAt,
      homepage: manifest.homepage,
      repository: manifest.repository,
    });
  }

  const index = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    repository: "https://github.com/wangling-miao/awesome-desktop-pets",
    pets,
  };

  await writeFile(path.join(publicDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");
  console.log(`wrote public/index.json with ${pets.length} pet(s)`);
}

void main();

