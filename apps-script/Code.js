const SHEETS = {
  accounts: "대리점관리",
  inventory: "재고현황",
  orders: "발주현황",
  sales: "판매현황",
  reservations: "예약현황",
  products: "제품등록",
  settings: "settings",
  pushSubscriptions: "푸시구독"
};

const HEADERS = {
  accounts: ["login_id", "password_hash", "dealer_code", "dealer_name", "dealer_discount_rate", "role", "is_first_login", "is_active", "updated_at"],
  inventory: ["dealer_code", "product_name", "sku", "stock_qty", "safety_stock", "location", "updated_at"],
  orders: ["order_id", "dealer_code", "dealer_name", "created_by_login_id", "product_name", "sku", "qty", "unit_retail_price", "dealer_discount_rate", "unit_sale_price", "unit_purchase_price", "status", "memo", "shipping_company", "tracking_number", "hq_stock_deducted_at", "dealer_received_at", "created_at", "updated_at"],
  sales: ["sale_id", "dealer_code", "dealer_name", "created_by_login_id", "product_name", "sku", "qty", "memo", "created_at", "updated_at"],
  reservations: ["reservation_id", "dealer_code", "dealer_name", "created_by_login_id", "customer_name", "customer_phone", "product_name", "sku", "qty", "status", "memo", "completed_at", "created_at", "updated_at"],
  products: ["sku", "product_name", "category", "unit", "retail_price", "purchase_price", "is_active"],
  settings: ["key", "value"],
  pushSubscriptions: ["subscription_id", "login_id", "dealer_code", "role", "endpoint", "subscription_json", "user_agent", "is_active", "created_at", "updated_at"]
};

const ORDER_STATUSES = ["접수", "승인", "출고", "완료", "반려", "취소"];
const SESSION_SECONDS = 21600;
const HEAD_OFFICE_CODE = "ADMIN";
const HEAD_OFFICE_NAME = "본사";
const DEFAULT_RETAIL_PRICE = 1000000;
const DEFAULT_PURCHASE_PRICE = 500000;
const DEFAULT_LEGACY_ORDER_DISCOUNT_RATE = 20;

function doPost(e) {
  try {
    ensureSheets_();
    const body = parseBody_(e);
    const action = body.action;
    const payload = body.payload || {};
    const token = body.token || "";

    if (action === "login") return ok_(handleLogin_(payload));

    const user = requireSession_(token);
    if (action === "changePassword") return ok_(handleChangePassword_(payload, user, token));
    if (action === "getInventory") return ok_(handleGetInventory_(payload, user));
    if (action === "createOrder") return ok_(handleCreateOrder_(payload, user));
    if (action === "getOrders") return ok_(handleGetOrders_(payload, user));
    if (action === "updateOrderStatus") return ok_(handleUpdateOrderStatus_(payload, user));
    if (action === "receiveOrder") return ok_(handleReceiveOrder_(payload, user));
    if (action === "cancelOrder") return ok_(handleCancelOrder_(payload, user));
    if (action === "clearOrders") return ok_(handleClearOrders_(payload, user));
    if (action === "createSale") return ok_(handleCreateSale_(payload, user));
    if (action === "getSales") return ok_(handleGetSales_(payload, user));
    if (action === "createReservation") return ok_(handleCreateReservation_(payload, user));
    if (action === "completeReservation") return ok_(handleCompleteReservation_(payload, user));
    if (action === "getReservations") return ok_(handleGetReservations_(payload, user));
    if (action === "saveInventory") return ok_(handleSaveInventory_(payload, user));
    if (action === "saveProduct") return ok_(handleSaveProduct_(payload, user));
    if (action === "updateDealerDiscount") return ok_(handleUpdateDealerDiscount_(payload, user));
    if (action === "createDealerAccount") return ok_(handleCreateDealerAccount_(payload, user));
    if (action === "resetDealerPassword") return ok_(handleResetDealerPassword_(payload, user));
    if (action === "deactivateDealerAccount") return ok_(handleDeactivateDealerAccount_(payload, user));
    if (action === "deleteDealerAccount") return ok_(handleDeleteDealerAccount_(payload, user));
    if (action === "deleteProduct") return ok_(handleDeleteProduct_(payload, user));
    if (action === "getDealerLinks") return ok_(handleGetDealerLinks_(payload, user));
    if (action === "savePushSubscription") return ok_(handleSavePushSubscription_(payload, user));
    if (action === "deletePushSubscription") return ok_(handleDeletePushSubscription_(payload, user));
    if (action === "sendTestPushNotification") return ok_(handleSendTestPushNotification_(payload, user));

    throw new Error("지원하지 않는 action입니다: " + action);
  } catch (error) {
    return fail_(error);
  }
}

function doGet() {
  return ok_({
    app: "GLOC Apps Script API",
    status: "ready",
    updated_at: isoNow_()
  });
}

function setupInitialData() {
  ensureSheets_();
  seedProductsIfEmpty_();
  seedAdminIfEmpty_();
  seedDemoDealerIfEmpty_();
  seedInventoryIfEmpty_();
  ensureInventoryForOwner_(HEAD_OFFICE_CODE, HEAD_OFFICE_NAME);
}

function resetAdminPassword() {
  ensureSheets_();
  const account = findAccountByLoginId_("admin");
  if (!account) {
    appendObject_(SHEETS.accounts, {
      login_id: "admin",
      password_hash: hashPassword_("admin1234!"),
      dealer_code: "ADMIN",
      dealer_name: "본사 관리자",
      dealer_discount_rate: 0,
      role: "admin",
      is_first_login: true,
      is_active: true,
      updated_at: isoNow_()
    });
    return "admin 계정을 생성했습니다. 초기 비밀번호는 admin1234! 입니다.";
  }

  updateAccount_("admin", {
    password_hash: hashPassword_("admin1234!"),
    dealer_code: "ADMIN",
    dealer_name: account.dealer_name || "본사 관리자",
    dealer_discount_rate: 0,
    role: "admin",
    is_first_login: true,
    is_active: true,
    updated_at: isoNow_()
  });
  return "admin 비밀번호를 admin1234! 로 초기화했습니다.";
}

function resetDealer01Password() {
  ensureSheets_();
  const account = findAccountByLoginId_("dealer01");
  if (!account) {
    appendObject_(SHEETS.accounts, {
      login_id: "dealer01",
      password_hash: hashPassword_("stock2026!"),
      dealer_code: "D001",
      dealer_name: "서울 총판",
      dealer_discount_rate: 20,
      role: "dealer",
      is_first_login: true,
      is_active: true,
      updated_at: isoNow_()
    });
    seedInventoryForDealer_("D001", "서울 총판");
    return "dealer01 계정을 생성했습니다. 초기 비밀번호는 stock2026! 입니다.";
  }

  updateAccount_("dealer01", {
    password_hash: hashPassword_("stock2026!"),
    dealer_discount_rate: Number(account.dealer_discount_rate || 20),
    is_first_login: true,
    is_active: true,
    updated_at: isoNow_()
  });
  return "dealer01 비밀번호를 stock2026! 로 초기화했습니다.";
}

function handleLogin_(payload) {
  const loginId = required_(payload.login_id, "login_id");
  const password = required_(payload.password, "password");
  const dealerCode = required_(payload.dealer_code, "dealer_code").toUpperCase();
  const account = findAccountByLoginId_(loginId);

  if (!account) throw new Error("계정이 없습니다.");
  if (!toBool_(account.is_active)) throw new Error("사용중지된 계정입니다.");
  if (account.role === "dealer" && String(account.dealer_code).toUpperCase() !== dealerCode) {
    throw new Error("대리점 코드가 일치하지 않습니다.");
  }
  if (account.role === "admin" && dealerCode !== "ADMIN" && dealerCode !== String(account.dealer_code).toUpperCase()) {
    throw new Error("관리자는 대리점 코드에 ADMIN을 입력해 주세요.");
  }
  if (!verifyPassword_(password, account.password_hash)) throw new Error("비밀번호가 일치하지 않습니다.");

  const session = createSession_(account);
  const user = publicAccount_(account);
  const inventoryData = handleGetInventory_({}, user);
  const orderData = handleGetOrders_({}, user);
  const salesData = handleGetSales_({}, user);
  const reservationData = handleGetReservations_({}, user);
  return {
    session,
    user,
    accounts: listAccessibleAccounts_(user),
    products: inventoryData.products,
    inventory: inventoryData.inventory,
    orders: orderData.orders,
    sales: salesData.sales,
    reservations: reservationData.reservations
  };
}

function handleChangePassword_(payload, user, token) {
  const currentPassword = required_(payload.current_password, "current_password");
  const newPassword = required_(payload.new_password, "new_password");
  if (newPassword.length < 8) throw new Error("새 비밀번호는 8자 이상이어야 합니다.");

  const account = findAccountByLoginId_(user.login_id);
  if (!account) throw new Error("계정을 찾을 수 없습니다.");
  if (!verifyPassword_(currentPassword, account.password_hash)) throw new Error("현재 비밀번호가 일치하지 않습니다.");

  updateAccount_(account.login_id, {
    password_hash: hashPassword_(newPassword),
    is_first_login: false,
    updated_at: isoNow_()
  });

  const updated = publicAccount_(findAccountByLoginId_(user.login_id));
  refreshSession_(token, updated);
  return { session: { token: token, expires_in: SESSION_SECONDS }, user: updated };
}

function handleGetInventory_(payload, user) {
  ensureInventoryForOwner_(HEAD_OFFICE_CODE, HEAD_OFFICE_NAME);
  const products = readRows_(SHEETS.products);
  const productMap = mapBy_(products, "sku");
  const accountMap = dealerNameMap_();
  let inventory = readRows_(SHEETS.inventory).map((row) => {
    const product = productMap[row.sku] || {};
    const productName = product.product_name || row.product_name;
    return {
      dealer_code: row.dealer_code,
      dealer_name: accountMap[row.dealer_code] || row.dealer_code,
      product_name: productName,
      sku: row.sku,
      category: product.category || "",
      color: inferColor_(productName),
      stock_qty: Number(row.stock_qty || 0),
      safety_stock: Number(row.safety_stock || 0),
      location: row.location || "",
      updated_at: row.updated_at || ""
    };
  });

  if (payload.dealer_code && (user.role === "admin" || String(payload.dealer_code).toUpperCase() === String(user.dealer_code).toUpperCase())) {
    inventory = inventory.filter((row) => row.dealer_code === payload.dealer_code);
  }

  return { products: products.map(publicProduct_), inventory: inventory };
}

function handleCreateOrder_(payload, user) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 발주를 등록할 수 있습니다.");
  const sku = required_(payload.sku, "sku");
  const qty = Number(required_(payload.qty, "qty"));
  if (!qty || qty < 1) throw new Error("발주 수량은 1 이상이어야 합니다.");

  const product = readRows_(SHEETS.products).find((row) => row.sku === sku && toBool_(row.is_active));
  if (!product) throw new Error("제품을 찾을 수 없습니다.");
  const unitRetailPrice = productRetailPrice_(product);
  const discountRate = dealerDiscountRate_(user.dealer_code);
  const unitSalePrice = Math.round(unitRetailPrice * (1 - discountRate / 100));
  const unitPurchasePrice = productPurchasePrice_(product);

  const order = {
    order_id: makeOrderId_(),
    dealer_code: user.dealer_code,
    dealer_name: user.dealer_name,
    created_by_login_id: user.login_id,
    product_name: product.product_name,
    sku: product.sku,
    qty: qty,
    unit_retail_price: unitRetailPrice,
    dealer_discount_rate: discountRate,
    unit_sale_price: unitSalePrice,
    unit_purchase_price: unitPurchasePrice,
    status: "접수",
    memo: payload.memo || "",
    shipping_company: "",
    tracking_number: "",
    hq_stock_deducted_at: "",
    dealer_received_at: "",
    created_at: isoNow_(),
    updated_at: isoNow_()
  };
  appendObject_(SHEETS.orders, order);
  return { order: order, notification: notifyOrderCreated_(order) };
}

function handleGetOrders_(payload, user) {
  let orders = readRows_(SHEETS.orders);
  if (user.role === "dealer") {
    orders = orders.filter((order) => order.dealer_code === user.dealer_code);
  }
  if (payload.status && payload.status !== "전체") {
    orders = orders.filter((order) => order.status === payload.status);
  }
  return {
    orders: orders.reverse(),
    accounts: listAccessibleAccounts_(user)
  };
}

function handleUpdateOrderStatus_(payload, user) {
  requireAdmin_(user);
  const orderId = required_(payload.order_id, "order_id");
  const status = required_(payload.status, "status");
  if (ORDER_STATUSES.indexOf(status) === -1) throw new Error("지원하지 않는 발주 상태입니다.");
  const currentOrder = readRows_(SHEETS.orders).find((row) => row.order_id === orderId);
  if (!currentOrder) throw new Error("발주를 찾을 수 없습니다.");

  const updates = {
    status: status,
    updated_at: isoNow_()
  };
  const changedInventories = [];

  if (status === "출고" || status === "완료") {
    if (!hasSnapshotValue_(currentOrder.hq_stock_deducted_at)) {
      const deducted = deductHeadOfficeStockForOrder_(currentOrder);
      updates.hq_stock_deducted_at = deducted.updated_at;
      changedInventories.push(deducted.inventory);
      if (deducted.low_stock) notifyHeadOfficeLowStock_(deducted.inventory);
    }
  }

  if (status === "출고") {
    updates.shipping_company = required_(payload.shipping_company, "택배사");
    updates.tracking_number = required_(payload.tracking_number, "송장번호");
  } else if (["접수", "승인", "반려", "취소"].indexOf(status) >= 0) {
    updates.shipping_company = "";
    updates.tracking_number = "";
  }

  const order = updateRowByKey_(SHEETS.orders, "order_id", orderId, updates);
  const productMap = mapBy_(readRows_(SHEETS.products), "sku");
  const accountMap = dealerNameMap_();
  const publicInventories = changedInventories.map((row) => publicInventoryRow_(row, productMap, accountMap));
  return {
    order: order,
    inventory: publicInventories.length ? publicInventories[publicInventories.length - 1] : null,
    inventory_rows: publicInventories,
    notification: notifyDealerOrderUpdated_(order)
  };
}

function handleReceiveOrder_(payload, user) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 입고완료 처리할 수 있습니다.");
  const orderId = required_(payload.order_id, "order_id");
  const order = readRows_(SHEETS.orders).find((row) => row.order_id === orderId);
  if (!order) throw new Error("입고 처리할 발주를 찾을 수 없습니다.");
  if (String(order.dealer_code).toUpperCase() !== String(user.dealer_code).toUpperCase()) {
    throw new Error("본인 대리점 발주만 입고완료 처리할 수 있습니다.");
  }
  if (hasSnapshotValue_(order.dealer_received_at)) throw new Error("이미 입고완료 처리된 발주입니다.");
  if (["출고", "완료"].indexOf(order.status) === -1) throw new Error("출고된 발주만 입고완료 처리할 수 있습니다.");

  const product = readRows_(SHEETS.products).find((row) => row.sku === order.sku) || {
    sku: order.sku,
    product_name: order.product_name,
    category: "",
    unit: "롤"
  };
  const inventory = adjustInventoryStock_(order.dealer_code, order.dealer_name, product, Number(order.qty || 0), { requireEnoughStock: false });
  const updated = updateRowByKey_(SHEETS.orders, "order_id", orderId, {
    status: "완료",
    dealer_received_at: isoNow_(),
    updated_at: isoNow_()
  });
  const publicInventory = publicInventoryRow_(inventory, mapBy_(readRows_(SHEETS.products), "sku"), dealerNameMap_());
  return {
    order: updated,
    inventory: publicInventory,
    inventory_rows: [publicInventory]
  };
}

function handleCancelOrder_(payload, user) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 발주를 취소할 수 있습니다.");
  const orderId = required_(payload.order_id, "order_id");
  const order = readRows_(SHEETS.orders).find((row) => row.order_id === orderId);
  if (!order) throw new Error("발주를 찾을 수 없습니다.");
  if (String(order.dealer_code).toUpperCase() !== String(user.dealer_code).toUpperCase()) throw new Error("본인 대리점 발주만 취소할 수 있습니다.");
  if (order.status !== "접수") throw new Error("승인 전 접수 상태에서만 취소할 수 있습니다.");

  const updated = updateRowByKey_(SHEETS.orders, "order_id", orderId, {
    status: "취소",
    updated_at: isoNow_()
  });
  return {
    order: updated,
    notification: notifyOrderCanceled_(updated)
  };
}

function handleClearOrders_(payload, user) {
  requireAdmin_(user);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.orders);
  if (!sheet || sheet.getLastRow() < 2) return { deleted_count: 0 };

  const deletedCount = sheet.getLastRow() - 1;
  sheet.deleteRows(2, deletedCount);
  return { deleted_count: deletedCount };
}

function handleCreateSale_(payload, user) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 판매완료를 등록할 수 있습니다.");
  const sku = required_(payload.sku, "sku");
  const qty = Number(required_(payload.qty, "qty"));
  if (!qty || qty < 1) throw new Error("판매 수량은 1 이상이어야 합니다.");

  const product = readRows_(SHEETS.products).find((row) => row.sku === sku && toBool_(row.is_active));
  if (!product) throw new Error("제품을 찾을 수 없습니다.");
  const inventory = adjustInventoryStock_(user.dealer_code, user.dealer_name, product, -qty, { requireEnoughStock: true });
  const now = isoNow_();
  const sale = {
    sale_id: makeSaleId_(),
    dealer_code: user.dealer_code,
    dealer_name: user.dealer_name,
    created_by_login_id: user.login_id,
    product_name: product.product_name,
    sku: product.sku,
    qty: qty,
    memo: payload.memo || "",
    created_at: now,
    updated_at: now
  };
  appendObject_(SHEETS.sales, sale);
  return {
    sale: sale,
    inventory: publicInventoryRow_(inventory, mapBy_(readRows_(SHEETS.products), "sku"), dealerNameMap_())
  };
}

function handleGetSales_(payload, user) {
  let sales = readRows_(SHEETS.sales);
  if (user.role === "dealer") {
    sales = sales.filter((sale) => String(sale.dealer_code).toUpperCase() === String(user.dealer_code).toUpperCase());
  }
  return { sales: sales.reverse() };
}

function handleCreateReservation_(payload, user) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 예약을 등록할 수 있습니다.");
  const sku = required_(payload.sku, "sku");
  const qty = Number(required_(payload.qty, "qty"));
  if (!qty || qty < 1) throw new Error("예약 수량은 1 이상이어야 합니다.");

  const product = readRows_(SHEETS.products).find((row) => row.sku === sku && toBool_(row.is_active));
  if (!product) throw new Error("제품을 찾을 수 없습니다.");
  const inventory = inventoryRowFor_(user.dealer_code, product.sku);
  const now = isoNow_();
  const reservation = {
    reservation_id: makeReservationId_(),
    dealer_code: user.dealer_code,
    dealer_name: user.dealer_name,
    created_by_login_id: user.login_id,
    customer_name: payload.customer_name || "",
    customer_phone: payload.customer_phone || "",
    product_name: product.product_name,
    sku: product.sku,
    qty: qty,
    status: Number(inventory.stock_qty || 0) < qty ? "재고부족" : "예약",
    memo: payload.memo || "",
    completed_at: "",
    created_at: now,
    updated_at: now
  };
  appendObject_(SHEETS.reservations, reservation);
  return {
    reservation: reservation,
    inventory: publicInventoryRow_(inventory, mapBy_(readRows_(SHEETS.products), "sku"), dealerNameMap_())
  };
}

function handleCompleteReservation_(payload, user) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 시공완료 처리할 수 있습니다.");
  const reservationId = required_(payload.reservation_id, "reservation_id");
  const reservation = readRows_(SHEETS.reservations).find((row) => row.reservation_id === reservationId);
  if (!reservation) throw new Error("예약을 찾을 수 없습니다.");
  if (String(reservation.dealer_code).toUpperCase() !== String(user.dealer_code).toUpperCase()) {
    throw new Error("본인 대리점 예약만 시공완료 처리할 수 있습니다.");
  }
  if (reservation.status === "시공완료") throw new Error("이미 시공완료 처리된 예약입니다.");

  const product = readRows_(SHEETS.products).find((row) => row.sku === reservation.sku) || {
    sku: reservation.sku,
    product_name: reservation.product_name,
    category: "",
    unit: "롤"
  };
  const inventory = adjustInventoryStock_(user.dealer_code, user.dealer_name, product, -Number(reservation.qty || 0), { requireEnoughStock: true });
  const now = isoNow_();
  const updated = updateRowByKey_(SHEETS.reservations, "reservation_id", reservationId, {
    status: "시공완료",
    completed_at: now,
    updated_at: now
  });
  return {
    reservation: updated,
    inventory: publicInventoryRow_(inventory, mapBy_(readRows_(SHEETS.products), "sku"), dealerNameMap_())
  };
}

function handleGetReservations_(payload, user) {
  let reservations = readRows_(SHEETS.reservations);
  if (user.role === "dealer") {
    reservations = reservations.filter((reservation) => String(reservation.dealer_code).toUpperCase() === String(user.dealer_code).toUpperCase());
  }
  return { reservations: reservations.reverse() };
}

function handleSaveInventory_(payload, user) {
  const dealerCode = user.role === "admin"
    ? HEAD_OFFICE_CODE
    : user.dealer_code;
  const sku = required_(payload.sku, "sku");
  const stockQty = Number(required_(payload.stock_qty, "stock_qty"));
  const safetyStock = Number(payload.safety_stock || 0);
  const location = payload.location || "";
  if (stockQty < 0 || safetyStock < 0) throw new Error("재고와 안전재고는 0 이상이어야 합니다.");

  const products = readRows_(SHEETS.products);
  const product = products.find((row) => row.sku === sku);
  if (!product) throw new Error("제품등록 시트에서 SKU를 찾을 수 없습니다.");

  const row = upsertInventoryRow_(dealerCode, sku, {
    dealer_code: dealerCode,
    product_name: product.product_name,
    sku: sku,
    stock_qty: stockQty,
    safety_stock: safetyStock,
    location: location,
    updated_at: isoNow_()
  });
  if (dealerCode === HEAD_OFFICE_CODE && Number(row.stock_qty || 0) <= Number(row.safety_stock || 0)) {
    notifyHeadOfficeLowStock_(row);
  }
  return { inventory: publicInventoryRow_(row, mapBy_(products, "sku"), dealerNameMap_()) };
}

function handleSaveProduct_(payload, user) {
  requireAdmin_(user);
  const sku = required_(payload.sku, "sku");
  const product = {
    sku: sku,
    product_name: required_(payload.product_name, "product_name"),
    category: required_(payload.category, "category"),
    unit: payload.unit || "롤",
    retail_price: Number(payload.retail_price || DEFAULT_RETAIL_PRICE),
    purchase_price: Number(payload.purchase_price || DEFAULT_PURCHASE_PRICE),
    is_active: payload.is_active === undefined ? true : toBool_(payload.is_active)
  };
  if (product.retail_price < 0 || product.purchase_price < 0) throw new Error("소비자가와 매입가는 0 이상이어야 합니다.");

  const saved = upsertProductRow_(sku, product);
  seedInventoryForProduct_(saved);
  return { product: publicProduct_(saved) };
}

function handleUpdateDealerDiscount_(payload, user) {
  requireAdmin_(user);
  const dealerCode = required_(payload.dealer_code, "dealer_code").toUpperCase();
  const discountRate = Number(payload.dealer_discount_rate || 0);
  if (discountRate < 0 || discountRate > 100) throw new Error("대리점 할인율은 0~100 사이여야 합니다.");
  const previousDiscountRate = dealerDiscountRate_(dealerCode);
  const frozenOrderCount = freezeDealerOrderPricing_(dealerCode, previousDiscountRate);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.accounts);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const codeIndex = headers.indexOf("dealer_code");
  const roleIndex = headers.indexOf("role");
  const discountIndex = headers.indexOf("dealer_discount_rate");
  const updatedIndex = headers.indexOf("updated_at");
  if (codeIndex === -1 || roleIndex === -1 || discountIndex === -1) throw new Error("대리점관리 시트에 할인율 컬럼이 없습니다.");

  let topManagerUpdated = false;
  let clearedStaffCount = 0;
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const sameDealer = String(values[rowIndex][codeIndex]).toUpperCase() === dealerCode;
    const isDealer = String(values[rowIndex][roleIndex]) === "dealer";
    if (sameDealer && isDealer) {
      if (!topManagerUpdated) {
        sheet.getRange(rowIndex + 1, discountIndex + 1).setValue(discountRate);
        topManagerUpdated = true;
      } else {
        sheet.getRange(rowIndex + 1, discountIndex + 1).setValue("");
        clearedStaffCount += 1;
      }
      if (updatedIndex >= 0) sheet.getRange(rowIndex + 1, updatedIndex + 1).setValue(isoNow_());
    }
  }
  if (!topManagerUpdated) throw new Error("할인율을 수정할 대리점 최상위 관리자 계정을 찾을 수 없습니다.");
  return {
    accounts: listAccessibleAccounts_(user),
    updated_count: 1,
    cleared_staff_count: clearedStaffCount,
    frozen_order_count: frozenOrderCount
  };
}

function handleDeleteProduct_(payload, user) {
  requireAdmin_(user);
  const sku = required_(payload.sku, "sku");
  const product = readRows_(SHEETS.products).find((row) => String(row.sku) === String(sku));
  if (!product) throw new Error("삭제할 제품을 찾을 수 없습니다.");

  deleteRowsByKey_(SHEETS.products, "sku", sku);
  const deletedInventoryRows = deleteRowsByKey_(SHEETS.inventory, "sku", sku);
  return {
    product: publicProduct_(product),
    deleted_inventory_rows: deletedInventoryRows
  };
}

function handleCreateDealerAccount_(payload, user) {
  if (!canManageDealerStaff_(user)) throw new Error("담당자 추가는 본사 관리자 또는 대리점 최상위 관리자만 가능합니다.");
  const loginId = required_(payload.login_id, "login_id");
  const role = user.role === "admin" && payload.role === "admin" ? "admin" : "dealer";
  const dealerCode = user.role === "dealer"
    ? String(user.dealer_code).toUpperCase()
    : role === "admin"
      ? HEAD_OFFICE_CODE
      : required_(payload.dealer_code, "dealer_code").toUpperCase();
  const existingDealerAccount = readRows_(SHEETS.accounts).find((row) => (
    row.role === "dealer" &&
    String(row.dealer_code).toUpperCase() === dealerCode
  ));
  const dealerName = user.role === "dealer"
    ? user.dealer_name
    : role === "admin"
      ? required_(payload.dealer_name, "dealer_name")
      : String(payload.dealer_name || existingDealerAccount?.dealer_name || dealerCode + " 대리점").trim();
  const discountRate = role === "dealer"
    ? user.role === "dealer"
      ? ""
      : existingDealerAccount
        ? ""
        : Number(payload.dealer_discount_rate || 0)
    : 0;
  const temporaryPassword = required_(payload.temporary_password, "temporary_password");
  if (discountRate !== "" && (discountRate < 0 || discountRate > 100)) throw new Error("대리점 할인율은 0~100 사이여야 합니다.");

  if (findAccountByLoginId_(loginId)) throw new Error("이미 사용 중인 아이디입니다.");

  const account = {
    login_id: loginId,
    password_hash: hashPassword_(temporaryPassword),
    dealer_code: dealerCode,
    dealer_name: dealerName,
    dealer_discount_rate: discountRate,
    role: role,
    is_first_login: true,
    is_active: true,
    updated_at: isoNow_()
  };
  appendObject_(SHEETS.accounts, account);
  if (role === "dealer") seedInventoryForDealer_(dealerCode, dealerName);
  return { account: publicAccount_(account), accounts: listAccessibleAccounts_(user), temporary_password: temporaryPassword };
}

function handleResetDealerPassword_(payload, user) {
  requireAdmin_(user);
  const loginId = required_(payload.login_id, "login_id");
  const temporaryPassword = required_(payload.temporary_password, "temporary_password");
  const account = findAccountByLoginId_(loginId);
  if (!account) throw new Error("계정을 찾을 수 없습니다.");
  if (isProtectedRootAdmin_(account) && String(user.login_id).toLowerCase() !== "admin") throw new Error("기본 본사 관리자 계정은 보호됩니다.");

  const updated = updateAccount_(loginId, {
    password_hash: hashPassword_(temporaryPassword),
    is_first_login: true,
    updated_at: isoNow_()
  });
  return { account: publicAccount_(updated), temporary_password: temporaryPassword };
}

function handleDeactivateDealerAccount_(payload, user) {
  requireAdmin_(user);
  const loginId = required_(payload.login_id, "login_id");
  if (loginId === user.login_id) throw new Error("현재 로그인한 본인 계정은 사용중지할 수 없습니다.");
  const account = findAccountByLoginId_(loginId);
  if (!account) throw new Error("계정을 찾을 수 없습니다.");
  if (isProtectedRootAdmin_(account)) throw new Error("기본 본사 관리자 계정은 사용중지할 수 없습니다.");

  const updated = updateAccount_(loginId, {
    is_active: false,
    updated_at: isoNow_()
  });
  return { account: publicAccount_(updated) };
}

function handleDeleteDealerAccount_(payload, user) {
  const loginId = required_(payload.login_id, "login_id");
  if (loginId === user.login_id) throw new Error("현재 로그인한 본인 계정은 삭제할 수 없습니다.");
  const account = findAccountByLoginId_(loginId);
  if (!account) throw new Error("삭제할 계정을 찾을 수 없습니다.");
  if (isProtectedRootAdmin_(account)) throw new Error("기본 본사 관리자 계정은 삭제할 수 없습니다.");

  if (user.role !== "admin") {
    if (!canManageDealerStaff_(user)) throw new Error("담당자 삭제는 본사 관리자 또는 대리점 최상위 관리자만 가능합니다.");
    if (account.role !== "dealer" || String(account.dealer_code).toUpperCase() !== String(user.dealer_code).toUpperCase()) {
      throw new Error("본인 대리점 담당자만 삭제할 수 있습니다.");
    }
    if (isDealerTopManagerAccount_(account)) throw new Error("최상위 관리자 계정은 삭제할 수 없습니다.");
  }

  deleteRowsByKey_(SHEETS.accounts, "login_id", loginId);
  const hasOtherDealerAccount = account.role === "dealer" && readRows_(SHEETS.accounts)
    .some((row) => row.role === "dealer" && String(row.dealer_code).toUpperCase() === String(account.dealer_code).toUpperCase());
  const deletedInventoryRows = account.role === "dealer" && !hasOtherDealerAccount
    ? deleteRowsByKey_(SHEETS.inventory, "dealer_code", account.dealer_code)
    : 0;
  return {
    account: publicAccount_(account),
    deleted_inventory_rows: deletedInventoryRows
  };
}

function handleGetDealerLinks_(payload, user) {
  requireAdmin_(user);
  const baseUrl = String(payload.base_url || getSetting_("app_public_url") || "").replace(/\/$/, "");
  const commonLink = commonLoginUrl_(baseUrl);
  const accounts = listPublicAccounts_().filter((account) => account.role === "dealer" && toBool_(account.is_active));
  const links = accounts.map((account) => {
    return {
      login_id: account.login_id,
      dealer_code: account.dealer_code,
      dealer_name: account.dealer_name,
      link: commonLink
    };
  });
  return { common_link: commonLink, accounts: accounts, links: links };
}

function handleSavePushSubscription_(payload, user) {
  const subscription = payload.subscription;
  if (!subscription || !subscription.endpoint) throw new Error("푸시 구독 정보가 없습니다.");

  const endpoint = String(subscription.endpoint);
  const subscriptionId = sha256Text_(endpoint);
  const now = isoNow_();
  const existing = readRows_(SHEETS.pushSubscriptions).find((row) => row.subscription_id === subscriptionId);
  deactivateOtherPushSubscriptions_(user.login_id, subscriptionId, now);
  const row = {
    subscription_id: subscriptionId,
    login_id: user.login_id,
    dealer_code: user.dealer_code,
    role: user.role,
    endpoint: endpoint,
    subscription_json: JSON.stringify(subscription),
    user_agent: payload.user_agent || "",
    is_active: true,
    created_at: existing && existing.created_at ? existing.created_at : now,
    updated_at: now
  };

  if (existing) {
    return {
      subscription: updateRowByKey_(SHEETS.pushSubscriptions, "subscription_id", subscriptionId, row)
    };
  }

  appendObject_(SHEETS.pushSubscriptions, row);
  return { subscription: row };
}

function deactivateOtherPushSubscriptions_(loginId, currentSubscriptionId, now) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.pushSubscriptions);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return;

  const headers = values[0].map(String);
  const subscriptionIndex = headers.indexOf("subscription_id");
  const loginIndex = headers.indexOf("login_id");
  const activeIndex = headers.indexOf("is_active");
  const updatedIndex = headers.indexOf("updated_at");
  if (subscriptionIndex === -1 || loginIndex === -1 || activeIndex === -1) return;

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const sameLogin = String(values[rowIndex][loginIndex]) === String(loginId);
    const otherSubscription = String(values[rowIndex][subscriptionIndex]) !== String(currentSubscriptionId);
    if (sameLogin && otherSubscription && toBool_(values[rowIndex][activeIndex])) {
      sheet.getRange(rowIndex + 1, activeIndex + 1).setValue(false);
      if (updatedIndex >= 0) sheet.getRange(rowIndex + 1, updatedIndex + 1).setValue(now);
    }
  }
}

function handleDeletePushSubscription_(payload, user) {
  const endpoint = required_(payload.endpoint, "endpoint");
  const subscriptionId = sha256Text_(endpoint);
  const updated = updateRowByKey_(SHEETS.pushSubscriptions, "subscription_id", subscriptionId, {
    is_active: false,
    updated_at: isoNow_()
  });
  return { subscription: updated };
}

function handleSendTestPushNotification_(payload, user) {
  const target = user.role === "admin"
    ? { role: "admin" }
    : { role: "dealer", dealer_code: user.dealer_code };
  const notification = {
    title: "GLOC 테스트 알림",
    body: "새 발주 알림 설정이 정상적으로 연결되었습니다.",
    url: getSetting_("push_click_url") || getSetting_("app_public_url") || "",
    tag: "gloc-test-" + new Date().getTime()
  };
  if (user.role === "admin") notification.badgeCount = pendingOrderCount_();
  return {
    notification: sendPushNotification_(notification, target)
  };
}

function notifyOrderCreated_(order) {
  return sendPushNotification_({
    title: "GLOC 발주 접수",
    body: order.dealer_name + " · " + (order.created_by_login_id || "담당자 미기록") + " · " + order.product_name + " / " + order.qty + "롤",
    url: getSetting_("push_click_url") || getSetting_("app_public_url") || "",
    tag: "gloc-order-" + order.order_id,
    badgeCount: pendingOrderCount_()
  }, { role: "admin" });
}

function notifyOrderCanceled_(order) {
  return sendPushNotification_({
    title: "GLOC 발주 취소",
    body: order.dealer_name + " · " + order.product_name + " 발주가 취소되었습니다.",
    url: getSetting_("push_click_url") || getSetting_("app_public_url") || "",
    tag: "gloc-order-cancel-" + order.order_id,
    badgeCount: pendingOrderCount_()
  }, { role: "admin" });
}

function notifyDealerOrderUpdated_(order) {
  let body = order.product_name + " · " + order.status;
  if (order.status === "출고") {
    body += " · " + (order.shipping_company || "택배사") + " " + (order.tracking_number || "");
  }
  return sendPushNotification_({
    title: "GLOC 발주 상태 변경",
    body: body,
    url: getSetting_("push_click_url") || getSetting_("app_public_url") || "",
    tag: "gloc-order-update-" + order.order_id
  }, { role: "dealer", dealer_code: order.dealer_code });
}

function notifyHeadOfficeLowStock_(inventory) {
  return sendPushNotification_({
    title: "GLOC 본사 안전재고 부족",
    body: (inventory.product_name || inventory.sku) + " · 현재 " + Number(inventory.stock_qty || 0) + "롤 / 안전 " + Number(inventory.safety_stock || 0) + "롤",
    url: getSetting_("push_click_url") || getSetting_("app_public_url") || "",
    tag: "gloc-hq-low-stock-" + inventory.sku
  }, { role: "admin" });
}

function pendingOrderCount_() {
  return readRows_(SHEETS.orders).filter((order) => order.status === "접수").length;
}

function sendPushNotification_(notification, target) {
  try {
    const apiUrl = getSetting_("push_api_url");
    const secret = getSetting_("push_api_secret");
    if (!apiUrl || !secret) return { ok: false, skipped: true, reason: "push_api_url 또는 push_api_secret 미설정" };

    const subscriptions = activePushSubscriptions_(target);
    if (!subscriptions.length) return { ok: false, skipped: true, reason: "등록된 푸시 구독 없음" };

    const response = UrlFetchApp.fetch(apiUrl, {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-push-secret": secret
      },
      muteHttpExceptions: true,
      payload: JSON.stringify({
        subscriptions: subscriptions,
        notification: notification
      })
    });

    const text = response.getContentText();
    const status = response.getResponseCode();
    let parsed = {};
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch (error) {
      parsed = { raw: text };
    }
    return { ok: status >= 200 && status < 300, status: status, result: parsed };
  } catch (error) {
    return { ok: false, error: error.message || String(error) };
  }
}

function activePushSubscriptions_(target) {
  return readRows_(SHEETS.pushSubscriptions)
    .filter((row) => {
      if (!toBool_(row.is_active)) return false;
      if (!target || !target.role) return true;
      if (row.role !== target.role) return false;
      if (target.dealer_code && String(row.dealer_code).toUpperCase() !== String(target.dealer_code).toUpperCase()) return false;
      return true;
    })
    .map((row) => {
      try {
        return JSON.parse(row.subscription_json);
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean);
}

function commonLoginUrl_(baseUrl) {
  if (!baseUrl) return "";
  if (baseUrl.slice(-11) === "/index.html" || baseUrl.slice(-6) === "/login") return baseUrl;
  return baseUrl + "/login";
}

function ensureSheets_() {
  Object.keys(SHEETS).forEach((key) => ensureSheet_(SHEETS[key], HEADERS[key]));
  ensureProductDefaultPrices_();
  ensureOrderPriceSnapshots_();
  ensurePasswordSalt_();
}

function ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  const lastColumn = Math.max(sheet.getLastColumn(), headers.length, 1);
  const firstRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);
  const hasHeader = firstRow.some((cell) => cell.trim() !== "");

  if (!hasHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    headers.forEach((header) => {
      if (firstRow.indexOf(header) === -1) {
        sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
      }
    });
  }
  sheet.setFrozenRows(1);
}

function readRows_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1)
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = formatCell_(row[index]);
      });
      return item;
    });
}

function appendObject_(sheetName, object) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  sheet.appendRow(headers.map((header) => object[header] === undefined ? "" : object[header]));
}

function headersForSheet_(sheetName) {
  const sheetKey = Object.keys(SHEETS).find((key) => SHEETS[key] === sheetName || key === sheetName);
  if (!sheetKey || !HEADERS[sheetKey]) throw new Error("시트 헤더를 찾을 수 없습니다: " + sheetName);
  return HEADERS[sheetKey];
}

function updateRowByKey_(sheetName, key, value, updates) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const keyIndex = headers.indexOf(key);
  if (keyIndex === -1) throw new Error("키 컬럼이 없습니다: " + key);

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    if (String(values[rowIndex][keyIndex]) === String(value)) {
      Object.keys(updates).forEach((field) => {
        const colIndex = headers.indexOf(field);
        if (colIndex >= 0) sheet.getRange(rowIndex + 1, colIndex + 1).setValue(updates[field]);
      });
      return readRows_(sheetName).find((row) => String(row[key]) === String(value));
    }
  }
  throw new Error("수정할 행을 찾을 수 없습니다.");
}

function deleteRowsByKey_(sheetName, key, value) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return 0;
  const headers = values[0].map(String);
  const keyIndex = headers.indexOf(key);
  if (keyIndex === -1) throw new Error("키 컬럼이 없습니다: " + key);

  let deleted = 0;
  for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
    if (String(values[rowIndex][keyIndex]) === String(value)) {
      sheet.deleteRow(rowIndex + 1);
      deleted += 1;
    }
  }
  return deleted;
}

function upsertInventoryRow_(dealerCode, sku, object) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.inventory);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const dealerIndex = headers.indexOf("dealer_code");
  const skuIndex = headers.indexOf("sku");
  if (dealerIndex === -1 || skuIndex === -1) throw new Error("재고현황 시트에 dealer_code 또는 sku 컬럼이 없습니다.");

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    if (String(values[rowIndex][dealerIndex]).toUpperCase() === String(dealerCode).toUpperCase() && String(values[rowIndex][skuIndex]) === String(sku)) {
      headers.forEach((header, index) => {
        if (object[header] !== undefined) sheet.getRange(rowIndex + 1, index + 1).setValue(object[header]);
      });
      return readRows_(SHEETS.inventory).find((row) => String(row.dealer_code).toUpperCase() === String(dealerCode).toUpperCase() && String(row.sku) === String(sku));
    }
  }

  appendObject_(SHEETS.inventory, object);
  return object;
}

function inventoryRowFor_(dealerCode, sku) {
  return readRows_(SHEETS.inventory).find((row) => (
    String(row.dealer_code).toUpperCase() === String(dealerCode).toUpperCase() &&
    String(row.sku) === String(sku)
  )) || {
    dealer_code: dealerCode,
    product_name: "",
    sku: sku,
    stock_qty: 0,
    safety_stock: 0,
    location: dealerNameMap_()[dealerCode] ? dealerNameMap_()[dealerCode] + " 창고" : "",
    updated_at: ""
  };
}

function adjustInventoryStock_(dealerCode, dealerName, product, deltaQty, options) {
  const opts = options || {};
  const current = inventoryRowFor_(dealerCode, product.sku);
  const currentQty = Number(current.stock_qty || 0);
  const nextQty = currentQty + Number(deltaQty || 0);
  if (opts.requireEnoughStock && nextQty < 0) {
    throw new Error((dealerName || dealerCode) + " 재고가 부족합니다. 현재 " + currentQty + "롤");
  }
  return upsertInventoryRow_(dealerCode, product.sku, {
    dealer_code: dealerCode,
    product_name: product.product_name || current.product_name || "",
    sku: product.sku,
    stock_qty: nextQty,
    safety_stock: Number(current.safety_stock || 0),
    location: current.location || (dealerName ? dealerName + " 창고" : ""),
    updated_at: isoNow_()
  });
}

function deductHeadOfficeStockForOrder_(order) {
  const product = readRows_(SHEETS.products).find((row) => row.sku === order.sku) || {
    sku: order.sku,
    product_name: order.product_name,
    category: "",
    unit: "롤"
  };
  const inventory = adjustInventoryStock_(HEAD_OFFICE_CODE, HEAD_OFFICE_NAME, product, -Number(order.qty || 0), { requireEnoughStock: true });
  return {
    inventory: inventory,
    updated_at: inventory.updated_at,
    low_stock: Number(inventory.stock_qty || 0) <= Number(inventory.safety_stock || 0)
  };
}

function upsertProductRow_(sku, object) {
  const existing = readRows_(SHEETS.products).find((row) => String(row.sku) === String(sku));
  if (existing) {
    return updateRowByKey_(SHEETS.products, "sku", sku, object);
  }
  appendObject_(SHEETS.products, object);
  return object;
}

function ensureProductDefaultPrices_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.products);
  if (!sheet || sheet.getLastRow() < 2) return;
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const retailIndex = headers.indexOf("retail_price");
  const purchaseIndex = headers.indexOf("purchase_price");
  if (retailIndex === -1 || purchaseIndex === -1) return;

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const hasContent = values[rowIndex].some((cell) => cell !== "");
    if (!hasContent) continue;
    const retailValue = Number(values[rowIndex][retailIndex] || 0);
    const purchaseValue = Number(values[rowIndex][purchaseIndex] || 0);
    if (!retailValue) sheet.getRange(rowIndex + 1, retailIndex + 1).setValue(DEFAULT_RETAIL_PRICE);
    if (!purchaseValue) sheet.getRange(rowIndex + 1, purchaseIndex + 1).setValue(DEFAULT_PURCHASE_PRICE);
  }
}

function ensureOrderPriceSnapshots_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.orders);
  if (!sheet || sheet.getLastRow() < 2) return;

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const skuIndex = headers.indexOf("sku");
  const retailIndex = headers.indexOf("unit_retail_price");
  const discountIndex = headers.indexOf("dealer_discount_rate");
  const saleIndex = headers.indexOf("unit_sale_price");
  const purchaseIndex = headers.indexOf("unit_purchase_price");
  if ([skuIndex, retailIndex, discountIndex, saleIndex, purchaseIndex].some((index) => index === -1)) return;

  const productsBySku = {};
  readRows_(SHEETS.products).forEach((product) => {
    productsBySku[product.sku] = product;
  });
  const legacyDiscountRate = legacyOrderDiscountRate_();

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const hasContent = values[rowIndex].some((cell) => cell !== "");
    if (!hasContent) continue;

    const needsSnapshot = (
      !hasSnapshotValue_(values[rowIndex][retailIndex]) ||
      !hasSnapshotValue_(values[rowIndex][discountIndex]) ||
      !hasSnapshotValue_(values[rowIndex][saleIndex]) ||
      !hasSnapshotValue_(values[rowIndex][purchaseIndex])
    );
    if (!needsSnapshot) continue;

    const product = productsBySku[String(values[rowIndex][skuIndex])] || {};
    const unitRetailPrice = hasSnapshotValue_(values[rowIndex][retailIndex])
      ? Number(values[rowIndex][retailIndex])
      : productRetailPrice_(product);
    const discountRate = hasSnapshotValue_(values[rowIndex][discountIndex])
      ? Number(values[rowIndex][discountIndex])
      : legacyDiscountRate;
    const unitSalePrice = hasSnapshotValue_(values[rowIndex][saleIndex])
      ? Number(values[rowIndex][saleIndex])
      : Math.round(unitRetailPrice * (1 - discountRate / 100));
    const unitPurchasePrice = hasSnapshotValue_(values[rowIndex][purchaseIndex])
      ? Number(values[rowIndex][purchaseIndex])
      : productPurchasePrice_(product);

    sheet.getRange(rowIndex + 1, retailIndex + 1).setValue(unitRetailPrice);
    sheet.getRange(rowIndex + 1, discountIndex + 1).setValue(discountRate);
    sheet.getRange(rowIndex + 1, saleIndex + 1).setValue(unitSalePrice);
    sheet.getRange(rowIndex + 1, purchaseIndex + 1).setValue(unitPurchasePrice);
  }
}

function findAccountByLoginId_(loginId) {
  return readRows_(SHEETS.accounts).find((account) => String(account.login_id).toLowerCase() === String(loginId).toLowerCase());
}

function updateAccount_(loginId, updates) {
  return updateRowByKey_(SHEETS.accounts, "login_id", loginId, updates);
}

function listPublicAccounts_() {
  return readRows_(SHEETS.accounts).map(publicAccount_);
}

function listAccessibleAccounts_(user) {
  if (user.role === "admin") return listPublicAccounts_();
  return listPublicAccounts_().filter((account) => (
    account.role === "dealer" &&
    String(account.dealer_code).toUpperCase() === String(user.dealer_code).toUpperCase()
  ));
}

function canManageDealerStaff_(user) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role !== "dealer") return false;
  return isDealerTopManagerAccount_(user);
}

function isDealerTopManagerAccount_(account) {
  if (!account || account.role !== "dealer") return false;
  const topManager = readRows_(SHEETS.accounts).find((row) => (
    row.role === "dealer" &&
    String(row.dealer_code).toUpperCase() === String(account.dealer_code).toUpperCase()
  ));
  return Boolean(topManager && String(topManager.login_id).toLowerCase() === String(account.login_id || "").toLowerCase());
}

function isProtectedRootAdmin_(account) {
  return (
    account &&
    String(account.login_id || "").toLowerCase() === "admin" &&
    String(account.dealer_code || "").toUpperCase() === HEAD_OFFICE_CODE &&
    account.role === "admin"
  );
}

function publicAccount_(account) {
  return {
    login_id: account.login_id,
    dealer_code: account.dealer_code,
    dealer_name: account.dealer_name,
    dealer_discount_rate: Number(account.dealer_discount_rate || 0),
    role: account.role,
    is_first_login: toBool_(account.is_first_login),
    is_active: toBool_(account.is_active),
    updated_at: account.updated_at || ""
  };
}

function publicProduct_(product) {
  return {
    sku: product.sku,
    product_name: product.product_name,
    category: product.category,
    color: inferColor_(product.product_name),
    unit: product.unit,
    retail_price: productRetailPrice_(product),
    purchase_price: productPurchasePrice_(product),
    is_active: toBool_(product.is_active)
  };
}

function publicInventoryRow_(row, productMap, accountMap) {
  const product = productMap[row.sku] || {};
  const productName = product.product_name || row.product_name;
  return {
    dealer_code: row.dealer_code,
    dealer_name: accountMap[row.dealer_code] || row.dealer_code,
    product_name: productName,
    sku: row.sku,
    category: product.category || "",
    color: inferColor_(productName),
    stock_qty: Number(row.stock_qty || 0),
    safety_stock: Number(row.safety_stock || 0),
    location: row.location || "",
    updated_at: row.updated_at || ""
  };
}

function createSession_(account) {
  const token = Utilities.getUuid();
  const user = publicAccount_(account);
  CacheService.getScriptCache().put("session:" + token, JSON.stringify(user), SESSION_SECONDS);
  return { token: token, expires_in: SESSION_SECONDS, created_at: isoNow_() };
}

function refreshSession_(token, user) {
  CacheService.getScriptCache().put("session:" + token, JSON.stringify(user), SESSION_SECONDS);
}

function requireSession_(token) {
  if (!token) throw new Error("로그인이 필요합니다.");
  const raw = CacheService.getScriptCache().get("session:" + token);
  if (!raw) throw new Error("세션이 만료되었습니다. 다시 로그인해 주세요.");
  const user = JSON.parse(raw);
  const account = findAccountByLoginId_(user.login_id);
  if (!account || !toBool_(account.is_active)) throw new Error("계정이 비활성화되었습니다.");
  return publicAccount_(account);
}

function requireAdmin_(user) {
  if (!user || user.role !== "admin") throw new Error("관리자 권한이 필요합니다.");
}

function hashPassword_(password) {
  const salt = ensurePasswordSalt_();
  return sha256Text_(salt + ":" + password);
}

function sha256Text_(text) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    text,
    Utilities.Charset.UTF_8
  );
  return bytes.map((byte) => {
    const value = byte < 0 ? byte + 256 : byte;
    return ("0" + value.toString(16)).slice(-2);
  }).join("");
}

function verifyPassword_(password, passwordHash) {
  return hashPassword_(password) === passwordHash;
}

function ensurePasswordSalt_() {
  let salt = getSetting_("password_salt");
  if (!salt) {
    salt = Utilities.getUuid() + Utilities.getUuid();
    setSetting_("password_salt", salt);
  }
  return salt;
}

function getSetting_(key) {
  const row = readRows_(SHEETS.settings).find((item) => item.key === key);
  return row ? String(row.value || "").trim() : "";
}

function setSetting_(key, value) {
  const existing = readRows_(SHEETS.settings).find((item) => item.key === key);
  if (existing) {
    updateRowByKey_(SHEETS.settings, "key", key, { value: value });
  } else {
    appendObject_(SHEETS.settings, { key: key, value: value });
  }
}

function seedProductsIfEmpty_() {
  if (readRows_(SHEETS.products).length) return;
  const bases = [
    ["TN-CH", "세라믹 틴팅 차콜", "틴팅", "롤", ["15%", "35%", "50%"]],
    ["PPF-CL", "프리미엄 PPF 클리어", "PPF", "롤", ["150", "180", "200"]],
    ["PPF-MT", "매트 PPF", "PPF", "롤", ["150", "180", "200"]],
    ["TN-SM", "카본 틴팅 스모크", "틴팅", "롤", ["05%", "15%", "35%"]],
    ["PPF-BK", "블랙 PPF", "PPF", "롤", ["150", "180", "200"]],
    ["TN-CR", "세라믹 틴팅", "틴팅", "롤", ["35%", "50%", "70%"]],
    ["TN-NC", "나노 틴팅 차콜", "틴팅", "롤", ["15%", "35%", "50%"]],
    ["PPF-LC", "라이트 PPF 클리어", "PPF", "롤", ["120", "150", "180"]]
  ];
  for (let i = 0; i < 100; i += 1) {
    const base = bases[i % bases.length];
    const size = base[4][Math.floor(i / bases.length) % base[4].length];
    const number = String(i + 1).padStart(3, "0");
    appendObject_(SHEETS.products, {
      sku: base[0] + "-" + number,
      product_name: base[1] + " " + size,
      category: base[2],
      unit: base[3],
      retail_price: DEFAULT_RETAIL_PRICE,
      purchase_price: DEFAULT_PURCHASE_PRICE,
      is_active: true
    });
  }
}

function seedAdminIfEmpty_() {
  if (findAccountByLoginId_("admin")) return;
  appendObject_(SHEETS.accounts, {
    login_id: "admin",
    password_hash: hashPassword_("admin1234!"),
    dealer_code: "ADMIN",
    dealer_name: "본사 관리자",
    dealer_discount_rate: 0,
    role: "admin",
    is_first_login: true,
    is_active: true,
    updated_at: isoNow_()
  });
}

function seedDemoDealerIfEmpty_() {
  if (findAccountByLoginId_("dealer01")) return;
  appendObject_(SHEETS.accounts, {
    login_id: "dealer01",
    password_hash: hashPassword_("stock2026!"),
    dealer_code: "D001",
    dealer_name: "서울 총판",
    dealer_discount_rate: 20,
    role: "dealer",
    is_first_login: true,
    is_active: true,
    updated_at: isoNow_()
  });
}

function seedInventoryIfEmpty_() {
  if (readRows_(SHEETS.inventory).length) return;
  seedInventoryForDealer_("D001", "서울 총판");
}

function ensureInventoryForOwner_(dealerCode, dealerName) {
  const products = readRows_(SHEETS.products).filter((row) => toBool_(row.is_active));
  const inventory = readRows_(SHEETS.inventory);
  products.forEach((product) => {
    const exists = inventory.some((row) => row.dealer_code === dealerCode && row.sku === product.sku);
    if (!exists) {
      appendObject_(SHEETS.inventory, {
        dealer_code: dealerCode,
        product_name: product.product_name,
        sku: product.sku,
        stock_qty: 0,
        safety_stock: 0,
        location: dealerName + " 창고",
        updated_at: isoNow_()
      });
    }
  });
}

function seedInventoryForDealer_(dealerCode, dealerName) {
  const existing = readRows_(SHEETS.inventory).some((row) => row.dealer_code === dealerCode);
  if (existing) return;
  const products = readRows_(SHEETS.products).filter((row) => toBool_(row.is_active));
  products.forEach((product, index) => {
    appendObject_(SHEETS.inventory, {
      dealer_code: dealerCode,
      product_name: product.product_name,
      sku: product.sku,
      stock_qty: 0,
      safety_stock: 80 + (index % 5) * 10,
      location: dealerName + " 창고",
      updated_at: isoNow_()
    });
  });
}

function seedInventoryForProduct_(product) {
  const accountMap = {};
  accountMap[HEAD_OFFICE_CODE] = { dealer_code: HEAD_OFFICE_CODE, dealer_name: HEAD_OFFICE_NAME };
  readRows_(SHEETS.accounts)
    .filter((account) => account.role === "dealer" && toBool_(account.is_active))
    .forEach((account) => {
      const code = String(account.dealer_code).toUpperCase();
      if (!accountMap[code]) accountMap[code] = account;
    });
  const accounts = Object.keys(accountMap).map((code) => accountMap[code]);
  const inventory = readRows_(SHEETS.inventory);
  accounts.forEach((account) => {
    const exists = inventory.some((row) => row.dealer_code === account.dealer_code && row.sku === product.sku);
    if (!exists) {
      appendObject_(SHEETS.inventory, {
        dealer_code: account.dealer_code,
        product_name: product.product_name,
        sku: product.sku,
        stock_qty: 0,
        safety_stock: 0,
        location: account.dealer_name + " 창고",
        updated_at: isoNow_()
      });
    }
  });
}

function dealerNameMap_() {
  const map = {
    [HEAD_OFFICE_CODE]: HEAD_OFFICE_NAME
  };
  readRows_(SHEETS.accounts)
    .forEach((account) => {
      map[account.dealer_code] = account.dealer_name;
    });
  map[HEAD_OFFICE_CODE] = HEAD_OFFICE_NAME;
  return map;
}

function mapBy_(rows, key) {
  const map = {};
  rows.forEach((row) => {
    map[row[key]] = row;
  });
  return map;
}

function dealerDiscountRate_(dealerCode) {
  const accounts = readRows_(SHEETS.accounts).filter((row) => (
    row.role === "dealer" &&
    String(row.dealer_code).toUpperCase() === String(dealerCode).toUpperCase()
  ));
  const topManager = accounts[0];
  if (topManager && topManager.dealer_discount_rate !== undefined && topManager.dealer_discount_rate !== "") {
    return Number(topManager.dealer_discount_rate || 0);
  }
  const legacyAccount = accounts.find((row) => row.dealer_discount_rate !== undefined && row.dealer_discount_rate !== "");
  return Number(legacyAccount ? legacyAccount.dealer_discount_rate || 0 : 0);
}

function legacyOrderDiscountRate_() {
  const value = Number(getSetting_("legacy_order_discount_rate") || DEFAULT_LEGACY_ORDER_DISCOUNT_RATE);
  if (Number.isNaN(value) || value < 0 || value > 100) return DEFAULT_LEGACY_ORDER_DISCOUNT_RATE;
  return value;
}

function freezeDealerOrderPricing_(dealerCode, discountRate) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.orders);
  if (!sheet || sheet.getLastRow() < 2) return 0;

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const dealerIndex = headers.indexOf("dealer_code");
  const skuIndex = headers.indexOf("sku");
  const retailIndex = headers.indexOf("unit_retail_price");
  const discountIndex = headers.indexOf("dealer_discount_rate");
  const saleIndex = headers.indexOf("unit_sale_price");
  const purchaseIndex = headers.indexOf("unit_purchase_price");
  if ([dealerIndex, skuIndex, retailIndex, discountIndex, saleIndex, purchaseIndex].some((index) => index === -1)) {
    return 0;
  }

  const productsBySku = {};
  readRows_(SHEETS.products).forEach((product) => {
    productsBySku[product.sku] = product;
  });

  let frozenCount = 0;
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const sameDealer = String(values[rowIndex][dealerIndex]).toUpperCase() === String(dealerCode).toUpperCase();
    if (!sameDealer) continue;

    const needsFreeze = (
      !hasSnapshotValue_(values[rowIndex][retailIndex]) ||
      !hasSnapshotValue_(values[rowIndex][discountIndex]) ||
      !hasSnapshotValue_(values[rowIndex][saleIndex]) ||
      !hasSnapshotValue_(values[rowIndex][purchaseIndex])
    );
    if (!needsFreeze) continue;

    const product = productsBySku[String(values[rowIndex][skuIndex])] || {};
    const unitRetailPrice = hasSnapshotValue_(values[rowIndex][retailIndex])
      ? Number(values[rowIndex][retailIndex])
      : productRetailPrice_(product);
    const orderDiscountRate = hasSnapshotValue_(values[rowIndex][discountIndex])
      ? Number(values[rowIndex][discountIndex])
      : Number(discountRate || 0);
    const unitSalePrice = hasSnapshotValue_(values[rowIndex][saleIndex])
      ? Number(values[rowIndex][saleIndex])
      : Math.round(unitRetailPrice * (1 - orderDiscountRate / 100));
    const unitPurchasePrice = hasSnapshotValue_(values[rowIndex][purchaseIndex])
      ? Number(values[rowIndex][purchaseIndex])
      : productPurchasePrice_(product);

    sheet.getRange(rowIndex + 1, retailIndex + 1).setValue(unitRetailPrice);
    sheet.getRange(rowIndex + 1, discountIndex + 1).setValue(orderDiscountRate);
    sheet.getRange(rowIndex + 1, saleIndex + 1).setValue(unitSalePrice);
    sheet.getRange(rowIndex + 1, purchaseIndex + 1).setValue(unitPurchasePrice);
    frozenCount += 1;
  }
  return frozenCount;
}

function hasSnapshotValue_(value) {
  return value !== undefined && value !== null && value !== "";
}

function productRetailPrice_(product) {
  const value = Number(product && product.retail_price || 0);
  return value > 0 ? value : DEFAULT_RETAIL_PRICE;
}

function productPurchasePrice_(product) {
  const value = Number(product && product.purchase_price || 0);
  return value > 0 ? value : DEFAULT_PURCHASE_PRICE;
}

function inferColor_(name) {
  const text = String(name || "");
  if (text.indexOf("차콜") >= 0) return "차콜";
  if (text.indexOf("클리어") >= 0) return "클리어";
  if (text.indexOf("매트") >= 0) return "매트";
  if (text.indexOf("스모크") >= 0) return "스모크";
  if (text.indexOf("블랙") >= 0) return "블랙";
  if (text.indexOf("세라믹") >= 0) return "세라믹";
  return "";
}

function makeOrderId_() {
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyMMdd");
  const suffix = Utilities.getUuid().slice(0, 6).toUpperCase();
  return "ORD-" + date + "-" + suffix;
}

function makeSaleId_() {
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyMMdd");
  const suffix = Utilities.getUuid().slice(0, 6).toUpperCase();
  return "SAL-" + date + "-" + suffix;
}

function makeReservationId_() {
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyMMdd");
  const suffix = Utilities.getUuid().slice(0, 6).toUpperCase();
  return "RSV-" + date + "-" + suffix;
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error("요청 본문이 없습니다.");
  return JSON.parse(e.postData.contents);
}

function required_(value, name) {
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new Error(name + " 값이 필요합니다.");
  }
  return String(value).trim();
}

function toBool_(value) {
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true" || String(value) === "1";
}

function formatCell_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  return value;
}

function isoNow_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

function ok_(data) {
  return json_({ ok: true, data: data });
}

function fail_(error) {
  return json_({ ok: false, error: error.message || String(error) });
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
