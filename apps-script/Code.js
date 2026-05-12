const SHEETS = {
  accounts: "대리점관리",
  inventory: "재고현황",
  orders: "발주현황",
  products: "제품등록",
  settings: "settings"
};

const HEADERS = {
  accounts: ["login_id", "password_hash", "dealer_code", "dealer_name", "role", "is_first_login", "is_active", "updated_at"],
  inventory: ["dealer_code", "product_name", "sku", "stock_qty", "safety_stock", "location", "updated_at"],
  orders: ["order_id", "dealer_code", "dealer_name", "product_name", "sku", "qty", "status", "memo", "created_at", "updated_at"],
  products: ["sku", "product_name", "category", "unit", "is_active"],
  settings: ["key", "value"]
};

const ORDER_STATUSES = ["접수", "승인", "출고", "완료", "반려"];
const SESSION_SECONDS = 21600;

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
    if (action === "saveInventory") return ok_(handleSaveInventory_(payload, user));
    if (action === "saveProduct") return ok_(handleSaveProduct_(payload, user));
    if (action === "createDealerAccount") return ok_(handleCreateDealerAccount_(payload, user));
    if (action === "resetDealerPassword") return ok_(handleResetDealerPassword_(payload, user));
    if (action === "deactivateDealerAccount") return ok_(handleDeactivateDealerAccount_(payload, user));
    if (action === "getDealerLinks") return ok_(handleGetDealerLinks_(payload, user));

    throw new Error("지원하지 않는 action입니다: " + action);
  } catch (error) {
    return fail_(error);
  }
}

function doGet() {
  return ok_({
    app: "Film Stock Apps Script API",
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
  return {
    session,
    user,
    accounts: user.role === "admin" ? listPublicAccounts_() : [user],
    products: inventoryData.products,
    inventory: inventoryData.inventory,
    orders: orderData.orders
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

  const order = {
    order_id: makeOrderId_(),
    dealer_code: user.dealer_code,
    dealer_name: user.dealer_name,
    product_name: product.product_name,
    sku: product.sku,
    qty: qty,
    status: "접수",
    memo: payload.memo || "",
    created_at: isoNow_(),
    updated_at: isoNow_()
  };
  appendObject_(SHEETS.orders, order);
  return { order: order };
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
    accounts: user.role === "admin" ? listPublicAccounts_() : undefined
  };
}

function handleUpdateOrderStatus_(payload, user) {
  requireAdmin_(user);
  const orderId = required_(payload.order_id, "order_id");
  const status = required_(payload.status, "status");
  if (ORDER_STATUSES.indexOf(status) === -1) throw new Error("지원하지 않는 발주 상태입니다.");

  const order = updateRowByKey_(SHEETS.orders, "order_id", orderId, {
    status: status,
    updated_at: isoNow_()
  });
  return { order: order };
}

function handleSaveInventory_(payload, user) {
  const dealerCode = user.role === "admin"
    ? required_(payload.dealer_code, "dealer_code").toUpperCase()
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
    is_active: payload.is_active === undefined ? true : toBool_(payload.is_active)
  };

  const saved = upsertProductRow_(sku, product);
  seedInventoryForProduct_(saved);
  return { product: publicProduct_(saved) };
}

function handleCreateDealerAccount_(payload, user) {
  requireAdmin_(user);
  const loginId = required_(payload.login_id, "login_id");
  const dealerCode = required_(payload.dealer_code, "dealer_code").toUpperCase();
  const dealerName = required_(payload.dealer_name, "dealer_name");
  const temporaryPassword = required_(payload.temporary_password, "temporary_password");

  if (findAccountByLoginId_(loginId)) throw new Error("이미 사용 중인 아이디입니다.");

  const account = {
    login_id: loginId,
    password_hash: hashPassword_(temporaryPassword),
    dealer_code: dealerCode,
    dealer_name: dealerName,
    role: "dealer",
    is_first_login: true,
    is_active: true,
    updated_at: isoNow_()
  };
  appendObject_(SHEETS.accounts, account);
  seedInventoryForDealer_(dealerCode, dealerName);
  return { account: publicAccount_(account), temporary_password: temporaryPassword };
}

function handleResetDealerPassword_(payload, user) {
  requireAdmin_(user);
  const loginId = required_(payload.login_id, "login_id");
  const temporaryPassword = required_(payload.temporary_password, "temporary_password");
  const account = findAccountByLoginId_(loginId);
  if (!account || account.role !== "dealer") throw new Error("대리점 계정을 찾을 수 없습니다.");

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
  const account = findAccountByLoginId_(loginId);
  if (!account || account.role !== "dealer") throw new Error("대리점 계정을 찾을 수 없습니다.");

  const updated = updateAccount_(loginId, {
    is_active: false,
    updated_at: isoNow_()
  });
  return { account: publicAccount_(updated) };
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

function commonLoginUrl_(baseUrl) {
  if (!baseUrl) return "";
  if (baseUrl.slice(-11) === "/index.html" || baseUrl.slice(-6) === "/login") return baseUrl;
  return baseUrl + "/login";
}

function ensureSheets_() {
  Object.keys(SHEETS).forEach((key) => ensureSheet_(SHEETS[key], HEADERS[key]));
  ensurePasswordSalt_();
}

function ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const missingHeader = headers.some((header, index) => firstRow[index] !== header);
  if (missingHeader) {
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
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
  const headers = headersForSheet_(sheetName);
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

function upsertProductRow_(sku, object) {
  const existing = readRows_(SHEETS.products).find((row) => String(row.sku) === String(sku));
  if (existing) {
    return updateRowByKey_(SHEETS.products, "sku", sku, object);
  }
  appendObject_(SHEETS.products, object);
  return object;
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

function publicAccount_(account) {
  return {
    login_id: account.login_id,
    dealer_code: account.dealer_code,
    dealer_name: account.dealer_name,
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
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    salt + ":" + password,
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
  return row ? row.value : "";
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
  const accounts = readRows_(SHEETS.accounts).filter((account) => account.role === "dealer" && toBool_(account.is_active));
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
  const map = {};
  readRows_(SHEETS.accounts)
    .filter((account) => account.role === "dealer")
    .forEach((account) => {
      map[account.dealer_code] = account.dealer_name;
    });
  return map;
}

function mapBy_(rows, key) {
  const map = {};
  rows.forEach((row) => {
    map[row[key]] = row;
  });
  return map;
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
