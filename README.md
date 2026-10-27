# cdnjs

静态 JS 资源 CDN，仓库根目录整体部署到 GitHub Pages。

## leantrace/ 目录

`leantrace/` 目录的内容来自 [AinzRimuru/LeanTrace](https://github.com/AinzRimuru/LeanTrace) 仓库的 `front/dist`，由 [sync-leantrace.yml](.github/workflows/sync-leantrace.yml) 自动同步，请勿手动修改。

访问路径：`<Pages 域名>/leantrace/index.js`、`<Pages 域名>/leantrace/index.min.js`

### 同步机制

同步由 [sync-leantrace.yml](.github/workflows/sync-leantrace.yml) 定时触发，每天 UTC 04:00（北京时间 12:00）自动执行一次；也可在 Actions 页面手动触发（Sync LeanTrace dist → Run workflow）。
