const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const files = [
  "index.html",
  "styles.css",
  "api.js",
  "app.js",
  "manifest.webmanifest",
  "mobile-test-qr.png"
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

files.forEach((file) => {
  const from = path.join(root, file);
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, path.join(dist, file));
  }
});

const dataMode = process.env.DATA_MODE || "mock";
const appsScriptUrl = process.env.APPS_SCRIPT_API_URL || "";
const appPublicUrl = process.env.APP_PUBLIC_URL || "";

// 정적 배포 환경에서는 런타임 환경변수를 직접 읽을 수 없어서 빌드 시 config.js를 생성합니다.
const config = `window.FILM_STOCK_CONFIG = {
  dataMode: ${JSON.stringify(dataMode)},
  appsScriptUrl: ${JSON.stringify(appsScriptUrl)},
  appPublicUrl: ${JSON.stringify(appPublicUrl)}
};
`;

fs.writeFileSync(path.join(dist, "config.js"), config, "utf8");
console.log("Build complete: dist/");
