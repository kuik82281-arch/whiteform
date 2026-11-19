# Whiteform · 白物

Offline, no-API tools for turning a photo of an object into soft pastel / pearl / halftone material, laying it out, and converting it to fuse-bead (拼豆) patterns. Everything runs in the browser with Canvas: no server, no account, no npm dependencies, no network requests.

纯浏览器本地的物品素材工具:把一张物品照片处理成粉彩珠光 / 网点 / 白描等质感,排版多张素材,并转成拼豆图纸逐格编辑。不用 API、不联网、不上传图片。

## Three tools · 三个工具

Download the repo and keep the three HTML files in the same folder (they are self-contained):

| File | What it does |
| --- | --- |
| `白物-离线版.html` | Effects (pearl, pastel, halftone, line art, ASCII, icy, CRT, X-ray …), auto/manual cut-out (flood remove, magic wand, eraser, restore brush), PNG export with transparency |
| `素材排版-离线版.html` | Multi-image layout: move, proportional scale, rotate, flip, layers, duplicate, undo, layout JSON and PNG export |
| `拼豆编辑-离线版.html` | Image → pixel bead grid, grid restore / chart sampling, per-cell paint, fill, eyedropper, palette, export (see `dist/beads/README.md`) |

Open in a current Chrome or Edge. Click "试试苹果示例" to try the bundled sample (`examples/apple.jpg`, drawn for this repo). Cross-page hand-off may be limited under `file://`; if so, download the PNG and import it. Or run a local server (needs Python): double-click `启动白物.cmd` / `python launch.py` → http://127.0.0.1:8766/

## Develop · 开发

Sources are in `dist/` (main tool: `index.html`, `app.js`, `filter-v2.js`, `effects-extra.js`; layout: `editor.html`; beads: `dist/beads/`). After editing:

```bash
node build-beads.cjs
node package-offline.cjs
cp dist/editor.html 素材排版-离线版.html
```

The filter is a plain script exposing `window.WhiteFilter`:

```js
const prepared = WhiteFilter.prepare(rgba, width, height, smooth);
const out = WhiteFilter.render(prepared, { style: 'pearl', body: 80, line: 12, shade: 45, smooth: 55, color: 55, glow: 45 });
```

## Limits · 限制

- Filters recolor and extract edges; they cannot invent real glass or metal from a plain photo. Scan / X-ray / detection-box styles are visual simulations, not real inference.
- Processing runs on the main thread; very large images are downscaled to 2400 px.
- Bead colour codes are extracted from the image and are not brand colour numbers.

## License

MIT. The bundled sample image is original to this repo.
