import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { petIdPattern, petsDir, repoRoot } from "./common";

const id = process.argv[2]?.trim();

if (!id || !petIdPattern.test(id)) {
  console.error("usage: npm run new-pet my-cute-cat");
  console.error("pet id must be lowercase kebab-case, for example my-cute-cat");
  process.exit(1);
}

const targetDir = path.join(petsDir, id);
const templateDir = path.join(repoRoot, "templates", "pet");
const today = new Date().toISOString().slice(0, 10);

const manifest = {
  id,
  name: id
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" "),
  version: "1.0.0",
  author: "your-name",
  description: "Describe what this desktop pet does.",
  tags: ["cute"],
  license: "CC-BY-4.0",
  preview: "preview.gif",
  previewImage: "preview.png",
  format: "hatch-pet-compatible",
  resolution: "1x",
  createdAt: today,
  spritesheetPath: "spritesheet.webp",
  spritesheets: {
    "1x": "spritesheet.webp"
  },
  cellSize: {
    width: 192,
    height: 208
  },
  sourceScale: 1
};

await mkdir(targetDir, { recursive: true });
await writeFile(path.join(targetDir, "pet.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
await writeFile(
  path.join(targetDir, "README.md"),
  `# ${manifest.name}\n\n${manifest.description}\n\n## License\n\n${manifest.license}\n`,
  "utf8",
);
await writeFile(
  path.join(targetDir, "LICENSE"),
  "Replace this file with the full license text for your pet package.\n",
  "utf8",
);
await copyFile(path.join(templateDir, "preview.png"), path.join(targetDir, "preview.png"));
await copyFile(path.join(templateDir, "preview.gif"), path.join(targetDir, "preview.gif"));

console.log(`created pets/${id}`);

