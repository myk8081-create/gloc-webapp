self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {
      title: "GLOC 발주 알림",
      body: event.data ? event.data.text() : "새 발주가 등록되었습니다."
    };
  }

  const title = payload.title || "GLOC 발주 알림";
  const options = {
    body: payload.body || "새 발주가 등록되었습니다.",
    icon: payload.icon || "./icon-192.png",
    badge: payload.badge || "./icon-192.png",
    tag: payload.tag || "gloc-order",
    renotify: true,
    data: {
      url: payload.url || "./index.html"
    }
  };

  event.waitUntil(Promise.all([
    self.registration.showNotification(title, options),
    updateAppBadge(payload.badgeCount)
  ]));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "./index.html", self.location.origin).href;

  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = clientList.find((client) => client.url === targetUrl);
    if (existing) return existing.focus();
    return self.clients.openWindow(targetUrl);
  })());
});

async function updateAppBadge(value) {
  const count = Number(value);
  if (!Number.isFinite(count)) return;

  try {
    if (count > 0) {
      if (self.registration && typeof self.registration.setAppBadge === "function") {
        await self.registration.setAppBadge(count);
      } else if (self.navigator && typeof self.navigator.setAppBadge === "function") {
        await self.navigator.setAppBadge(count);
      }
      return;
    }

    if (self.registration && typeof self.registration.clearAppBadge === "function") {
      await self.registration.clearAppBadge();
    } else if (self.navigator && typeof self.navigator.clearAppBadge === "function") {
      await self.navigator.clearAppBadge();
    }
  } catch (error) {
    console.warn("앱 배지 업데이트 실패", error);
  }
}
