const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const files = [
  "index.html",
  "manual.html",
  "styles.css",
  "api.js",
  "app.js",
  "service-worker.js",
  "gloc-logo.png",
  "gloc-logo-banner.png",
  "favicon.ico",
  "favicon-32.png",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
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

const manualFiles = [
  ["docs/manual-admin.html", "manual-admin.html"],
  ["docs/manual-dealer.html", "manual-dealer.html"],
  ["docs/manual-book.html", "manual-book.html"]
];

manualFiles.forEach(([source, target]) => {
  const from = path.join(root, source);
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, path.join(dist, target));
  }
});

const dataMode = process.env.DATA_MODE || "mock";
const appsScriptUrl = process.env.APPS_SCRIPT_API_URL || "";
const appPublicUrl = process.env.APP_PUBLIC_URL || "";
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "";

// 정적 배포 환경에서는 런타임 환경변수를 직접 읽을 수 없어서 빌드 시 config.js를 생성합니다.
const config = `window.FILM_STOCK_CONFIG = {
  dataMode: ${JSON.stringify(dataMode)},
  appsScriptUrl: ${JSON.stringify(appsScriptUrl)},
  appPublicUrl: ${JSON.stringify(appPublicUrl)},
  vapidPublicKey: ${JSON.stringify(vapidPublicKey)}
};
`;

fs.writeFileSync(path.join(dist, "config.js"), config, "utf8");
console.log("Build complete: dist/");
