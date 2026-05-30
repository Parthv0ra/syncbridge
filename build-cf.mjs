import { writeFileSync, readdirSync } from "fs";
import { join } from "path";

const clientDir = "dist/client";
const assetsDir = join(clientDir, "assets");

const files = readdirSync(assetsDir);
const js = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
const css = files.filter((f) => f.endsWith(".css"));

const cssLinks = css.map((f) => `    <link rel="stylesheet" crossorigin href="/assets/${f}" />`).join("\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SyncBridge — Connect Your Business Tools. Automate Everything.</title>
    <script type="module" crossorigin src="/assets/${js}"></script>
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

writeFileSync(join(clientDir, "index.html"), html);
console.log(`✓ index.html written — js: ${js}, css: ${css.join(", ")}`);
