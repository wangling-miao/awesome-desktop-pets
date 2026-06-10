# Awesome Desktop Pets

Desktop Pet Launcher 的社区桌宠图鉴仓库。这里负责投稿、校验、打包和版本管理；官网和启动器只读取生成后的 `index.json` 来浏览和下载。

## 图鉴地址

- GitHub Pages index: `https://wangling-miao.github.io/awesome-desktop-pets/index.json`
- 仓库: `https://github.com/wangling-miao/awesome-desktop-pets`

## 仓库结构

```text
pets/
  venti-bard/
    pet.json
    preview.png
    preview.gif
    README.md
    LICENSE
schemas/
  pet.schema.json
scripts/
  validate-pets.ts
  package-pets.ts
  build-index.ts
  new-pet.ts
public/
  index.json
```

## 本地命令

```bash
npm install
npm run validate
npm run package:pets
npm run build:index
npm run build
npm run new-pet my-cute-cat
```

`npm run build` 会完成三件事：

1. 校验每个 `pets/*/pet.json` 和必需文件。
2. 把每个桌宠目录打包成 `public/downloads/*.zip`。
3. 生成 `public/index.json`，供官网和启动器读取。

## 投稿

技术用户通过 Pull Request 投稿。普通用户不需要碰 GitHub，只需要在官网或启动器里打开“桌宠图鉴”下载。

详细流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。
