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

const publicDir = path.join(root, "public");

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(target, { recursive: true });
  fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
    const entrySource = path.join(source, entry.name);
    const entryTarget = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(entrySource, entryTarget);
    } else {
      fs.copyFileSync(entrySource, entryTarget);
    }
  });
}

copyDirectory(publicDir, dist);

const dataMode = process.env.DATA_MODE || "mock";
const appsScriptUrl = process.env.APPS_SCRIPT_API_URL || "";
const appPublicUrl = process.env.APP_PUBLIC_URL || "";
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "";
const labelMode = process.env.LABEL_PRINT_MODE || "test";
const shippingMode = process.env.SHIPPING_MODE || (labelMode === "production" ? "production" : "mock");
const labelPrivacyMasking = process.env.LABEL_PRIVACY_MASKING || "true";
const apiBaseUrl = process.env.API_BASE_URL || (appsScriptUrl ? "/api/gloc" : "");
const exposeAppsScriptUrl = process.env.EXPOSE_APPS_SCRIPT_URL === "true";
const buildVersion = process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_VERSION || String(Date.now());

const indexPath = path.join(dist, "index.html");
if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  fs.writeFileSync(indexPath, indexHtml.replace(/__BUILD_VERSION__/g, buildVersion), "utf8");
}

// 정적 배포 환경에서는 런타임 환경변수를 직접 읽을 수 없어서 빌드 시 config.js를 생성합니다.
const config = `window.FILM_STOCK_CONFIG = {
  dataMode: ${JSON.stringify(dataMode)},
  apiBaseUrl: ${JSON.stringify(apiBaseUrl)},
  appsScriptUrl: ${JSON.stringify(exposeAppsScriptUrl ? appsScriptUrl : "")},
  appPublicUrl: ${JSON.stringify(appPublicUrl)},
  vapidPublicKey: ${JSON.stringify(vapidPublicKey)},
  labelMode: ${JSON.stringify(labelMode)},
  shippingMode: ${JSON.stringify(shippingMode)},
  labelPrivacyMasking: ${JSON.stringify(labelPrivacyMasking)},
  buildVersion: ${JSON.stringify(buildVersion)}
};
`;

fs.writeFileSync(path.join(dist, "config.js"), config, "utf8");
console.log("Build complete: dist/");
