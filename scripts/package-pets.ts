import archiver from "archiver";
import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { downloadsDir, listPetRecords, petZipName } from "./common";

async function zipDirectory(sourceDir: string, outputPath: string) {
  await new Promise<void>((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const output = createWriteStream(outputPath);

    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    void archive.finalize();
  });
}

async function main() {
  await rm(downloadsDir, { recursive: true, force: true });
  await mkdir(downloadsDir, { recursive: true });

  const records = await listPetRecords();
  for (const record of records) {
    const zipPath = path.join(downloadsDir, petZipName(record.manifest));
    await zipDirectory(record.dirPath, zipPath);
    console.log(`packaged ${record.manifest.id} -> ${path.relative(process.cwd(), zipPath)}`);
  }
}

void main();

