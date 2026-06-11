(function () {
  const config = window.FILM_STOCK_CONFIG || {};
  const storageKey = "film_stock_apps_script_session";
  const retryableActions = new Set([
    "getInventory",
    "getOrders",
    "getSales",
    "getReservations",
    "getCertificates",
    "getConsultationData",
    "getLabelSettings",
    "getDealerLinks",
    "getCommunicationData"
  ]);

  function apiUrl() {
    return String(config.apiBaseUrl || config.appsScriptUrl || "").trim();
  }

  function isEnabled() {
    const url = apiUrl();
    return Boolean(config.dataMode === "appsScript" && url && !url.includes("YOUR_APPS_SCRIPT"));
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setSession(session) {
    if (!session) {
      localStorage.removeItem(storageKey);
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(session));
  }

  async function request(action, payload = {}, options = {}) {
    if (!isEnabled()) return null;

    const session = options.session === undefined ? getSession() : options.session;
    const startedAt = performance.now();
    const attempts = retryableActions.has(action) ? 2 : 1;
    let completedAttempts = 0;
    let response = null;
    let lastError = null;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      completedAttempts = attempt + 1;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 30000);
      try {
        response = await fetch(apiUrl(), {
          method: "POST",
          redirect: "follow",
          signal: controller.signal,
          // Apps Script와 브라우저 CORS 충돌을 줄이기 위해 단순 요청 형식으로 보냅니다.
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action,
            token: session?.token || "",
            payload
          })
        });
        if (response.ok || response.status < 500 || attempt === attempts - 1) break;
      } catch (error) {
        lastError = error;
        if (attempt === attempts - 1) throw new Error(error?.name === "AbortError" ? "요청 시간이 초과되었습니다. 다시 시도해 주세요." : "네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
      } finally {
        window.clearTimeout(timeout);
      }
      await new Promise((resolve) => window.setTimeout(resolve, 400));
    }
    if (!response) throw lastError || new Error("API 요청에 실패했습니다.");

    const text = await response.text();
    let result = null;
    try {
      result = text ? JSON.parse(text) : null;
    } catch {
      throw new Error("Apps Script 응답을 JSON으로 읽을 수 없습니다.");
    }

    if (!response.ok || result?.ok === false) {
      throw new Error(result?.error || response.statusText || "API 요청에 실패했습니다.");
    }
    if (config.dataMode === "appsScript") {
      console.info("[GLOC API]", {
        action,
        durationMs: Math.round(performance.now() - startedAt),
        attempts: completedAttempts,
        retried: completedAttempts > 1
      });
    }
    return result?.data ?? result;
  }

  async function login({ loginId, password, dealerCode }) {
    const data = await request(
      "login",
      { login_id: loginId, password, dealer_code: dealerCode },
      { session: null }
    );
    if (data?.session) setSession(data.session);
    return data;
  }

  async function changePassword({ currentPassword, newPassword }) {
    const data = await request("changePassword", {
      current_password: currentPassword,
      new_password: newPassword
    });
    if (data?.session) setSession(data.session);
    return data;
  }

  async function completeOnboarding(profile) {
    const data = await request("completeOnboarding", profile);
    if (data?.session) setSession(data.session);
    return data;
  }

  async function getInventory(filters = {}) {
    return request("getInventory", filters);
  }

  async function createOrder(order) {
    return request("createOrder", order);
  }

  async function getOrders(filters = {}) {
    return request("getOrders", filters);
  }

  async function updateOrderStatus({ orderId, status }) {
    return request("updateOrderStatus", { order_id: orderId, status });
  }

  async function updateOrderStatusWithShipping({ orderId, status, shippingCompany, trackingNumber }) {
    return request("updateOrderStatus", {
      order_id: orderId,
      status,
      shipping_company: shippingCompany,
      tracking_number: trackingNumber
    });
  }

  async function updateOrderDiscount({ orderId, discountRate, applyType, memo }) {
    return request("updateOrderDiscount", {
      order_id: orderId,
      order_discount_rate: discountRate,
      discount_apply_type: applyType || "ORDER_CUSTOM",
      memo: memo || ""
    });
  }

  async function getCommunicationData() {
    return request("getCommunicationData", {});
  }

  async function saveNotice(notice) {
    return request("saveNotice", notice);
  }

  async function markNoticeRead({ noticeId }) {
    return request("markNoticeRead", { notice_id: noticeId });
  }

  async function dismissNotice({ noticeId, dismissType }) {
    return request("dismissNotice", { notice_id: noticeId, dismiss_type: dismissType });
  }

  async function createMessageThread(thread) {
    return request("createMessageThread", thread);
  }

  async function sendMessage({ threadId, content }) {
    return request("sendMessage", { thread_id: threadId, content });
  }

  async function markThreadRead({ threadId }) {
    return request("markThreadRead", { thread_id: threadId });
  }

  async function markNotificationRead({ notificationId }) {
    return request("markNotificationRead", { notification_id: notificationId });
  }

  async function updateThreadStatus({ threadId, status }) {
    return request("updateThreadStatus", { thread_id: threadId, status });
  }

  async function markOrderPrinted({ orderId, printStatus, labelSize }) {
    return request("markOrderPrinted", {
      order_id: orderId,
      print_status: printStatus,
      label_size: labelSize || ""
    });
  }

  async function getLabelSettings() {
    return request("getLabelSettings", {});
  }

  async function saveLabelSettings(settings) {
    return request("saveLabelSettings", { settings });
  }

  async function receiveOrder({ orderId }) {
    return request("receiveOrder", { order_id: orderId });
  }

  async function cancelOrder({ orderId }) {
    return request("cancelOrder", { order_id: orderId });
  }

  async function clearOrders() {
    return request("clearOrders", {});
  }

  async function saveInventory(row) {
    return request("saveInventory", row);
  }

  async function saveProduct(product) {
    return request("saveProduct", product);
  }

  async function createSale(sale) {
    return request("createSale", sale);
  }

  async function getSales(filters = {}) {
    return request("getSales", filters);
  }

  async function createReservation(reservation) {
    return request("createReservation", reservation);
  }

  async function completeReservation({ reservationId }) {
    return request("completeReservation", { reservation_id: reservationId });
  }

  async function getReservations(filters = {}) {
    return request("getReservations", filters);
  }

  async function getCertificates(filters = {}) {
    return request("getCertificates", filters);
  }

  async function getConsultationData(filters = {}) {
    return request("getConsultationData", filters);
  }

  async function saveConsultation(consultation) {
    return request("saveConsultation", consultation);
  }

  async function saveVehicle(vehicle) {
    return request("saveVehicle", vehicle);
  }

  async function verifyCertificate({ certificateNumber, userAgent }) {
    return request(
      "verifyCertificate",
      {
        certificate_number: certificateNumber,
        user_agent: userAgent || ""
      },
      { session: null }
    );
  }

  async function updateDealerDiscount({ dealerCode, discountRate }) {
    return request("updateDealerDiscount", {
      dealer_code: dealerCode,
      dealer_discount_rate: discountRate
    });
  }

  async function updateDealerCategoryPermissions({ dealerCode, canAccessPpf, canAccessTinting, canAccessDetailing }) {
    return request("updateDealerCategoryPermissions", {
      dealer_code: dealerCode,
      can_access_ppf: canAccessPpf,
      can_access_tinting: canAccessTinting,
      can_access_detailing: canAccessDetailing
    });
  }

  async function updateDealerProfile(profile) {
    return request("updateDealerProfile", profile);
  }

  async function createDealerAccount(account) {
    return request("createDealerAccount", account);
  }

  async function resetDealerPassword({ loginId, temporaryPassword }) {
    return request("resetDealerPassword", {
      login_id: loginId,
      temporary_password: temporaryPassword
    });
  }

  async function deactivateDealerAccount({ loginId }) {
    return request("deactivateDealerAccount", { login_id: loginId });
  }

  async function deleteDealerAccount({ loginId }) {
    return request("deleteDealerAccount", { login_id: loginId });
  }

  async function deleteProduct({ sku }) {
    return request("deleteProduct", { sku });
  }

  async function getDealerLinks({ baseUrl }) {
    return request("getDealerLinks", { base_url: baseUrl });
  }

  async function savePushSubscription({ subscription, userAgent }) {
    return request("savePushSubscription", {
      subscription,
      user_agent: userAgent || ""
    });
  }

  async function deletePushSubscription({ endpoint }) {
    return request("deletePushSubscription", { endpoint });
  }

  async function sendTestPushNotification() {
    return request("sendTestPushNotification", {});
  }

  function signOut() {
    setSession(null);
  }

  window.FilmStockApi = {
    isEnabled,
    getSession,
    login,
    changePassword,
    completeOnboarding,
    getInventory,
    createOrder,
    getOrders,
    updateOrderStatus,
    updateOrderStatusWithShipping,
    updateOrderDiscount,
    getCommunicationData,
    saveNotice,
    markNoticeRead,
    dismissNotice,
    createMessageThread,
    sendMessage,
    markThreadRead,
    markNotificationRead,
    updateThreadStatus,
    markOrderPrinted,
    getLabelSettings,
    saveLabelSettings,
    receiveOrder,
    cancelOrder,
    clearOrders,
    saveInventory,
    saveProduct,
    createSale,
    getSales,
    createReservation,
    completeReservation,
    getReservations,
    getCertificates,
    getConsultationData,
    saveConsultation,
    saveVehicle,
    verifyCertificate,
    updateDealerDiscount,
    updateDealerCategoryPermissions,
    updateDealerProfile,
    createDealerAccount,
    resetDealerPassword,
    deactivateDealerAccount,
    deleteDealerAccount,
    deleteProduct,
    getDealerLinks,
    savePushSubscription,
    deletePushSubscription,
    sendTestPushNotification,
    signOut
  };
})();
