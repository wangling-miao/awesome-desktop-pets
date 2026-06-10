# 投稿指南

这个仓库是 Desktop Pet Launcher 的桌宠图鉴数据源。它不做账号系统，也不做评论区；投稿通过 GitHub Pull Request 完成，合并后会自动出现在图鉴索引里。

## 投稿流程

1. Fork 这个仓库。
2. 执行 `npm install`。
3. 执行 `npm run new-pet my-cute-cat` 生成模板。
4. 把你的 `pet.json`、预览图、说明和授权文件补完整。
5. 执行 `npm run build`，确认校验、打包、索引生成都通过。
6. 提交 Pull Request。

## 每个宠物目录必须包含

- `pet.json`：桌宠元数据，也是启动器导入后读取的 manifest。
- `preview.png`：静态预览图。
- `preview.gif`：动态预览图。
- `preview.webp`：可选，推荐作为网页动图预览，透明边缘比 GIF 更稳定。
- `README.md`：桌宠说明、来源、使用备注。
- `LICENSE`：明确授权。没有授权的图片、角色、商标素材不会被合并。
- 至少一个可运行的 `spritesheet.webp`。

## pet.json 重点字段

- `id` 必须和目录名一致，只用小写字母、数字和短横线。
- `name` 是展示名，中文名可以直接写。
- `format` 可选 `desktop-pet` 或 `hatch-pet-compatible`。
- `resolution` 可选 `1x`、`2x`、`4x`。
- `spritesheetPath` 必须指向兼容 1x 的 `spritesheet.webp`。
- 高清包建议额外提供 `spritesheet@4x.webp`，并在 `spritesheets["4x"]` 中声明。

## 授权要求

请只提交你有权发布的素材。建议使用 `CC-BY-4.0`、`CC0-1.0`、`MIT` 或自定义但清楚允许分发的授权。二创角色需要在 README 里说明来源和授权边界。
