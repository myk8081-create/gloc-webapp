const SHEETS = {
  accounts: "대리점관리",
  inventory: "재고현황",
  orders: "발주현황",
  sales: "판매현황",
  reservations: "예약현황",
  certificates: "정품인증서",
  certificateLogs: "인증로그",
  vehicles: "차량등록",
  vehicle3dParts: "차량3D매핑",
  consultations: "상담현황",
  products: "제품등록",
  settings: "settings",
  pushSubscriptions: "푸시구독",
  notices: "Notices",
  noticeReads: "NoticeReads",
  messageThreads: "MessageThreads",
  messages: "Messages",
  notifications: "Notifications",
  orderDiscountLogs: "OrderDiscountLogs",
  orderDiscountNotifications: "OrderDiscountNotifications"
};

const HEADERS = {
  accounts: ["login_id", "password_hash", "dealer_code", "dealer_name", "dealer_discount_rate", "can_access_ppf", "can_access_tinting", "can_access_detailing", "role", "is_first_login", "is_active", "contact_name", "phone", "zipcode", "address", "address_detail", "default_courier", "shipping_memo", "password_changed_at", "profile_completed_at", "updated_at"],
  inventory: ["dealer_code", "product_name", "sku", "stock_qty", "safety_stock", "location", "updated_at"],
  orders: ["order_id", "agency_id", "dealer_code", "dealer_name", "created_by_login_id", "product_name", "sku", "product_category", "qty", "unit_retail_price", "dealer_discount_rate", "unit_sale_price", "unit_purchase_price", "dealer_default_discount_rate", "order_discount_rate", "discount_apply_type", "applied_discount_rate", "subtotal_amount", "discount_amount", "final_order_amount", "status", "memo", "recipient_name", "recipient_phone", "recipient_zipcode", "recipient_address", "recipient_address_detail", "default_courier", "shipping_memo", "courier", "tracking_no", "shipping_receipt_no", "shipping_error", "approved_at", "print_status", "printed_at", "print_count", "shipping_company", "tracking_number", "hq_stock_deducted_at", "dealer_received_at", "created_at", "updated_at"],
  sales: ["sale_id", "dealer_code", "dealer_name", "created_by_login_id", "product_name", "sku", "qty", "memo", "created_at", "updated_at"],
  reservations: ["reservation_id", "dealer_code", "dealer_name", "created_by_login_id", "customer_name", "customer_phone", "vehicle_number", "vehicle_model", "reservation_date", "product_name", "sku", "qty", "reservation_items", "status", "memo", "completed_at", "created_at", "updated_at"],
  certificates: ["id", "reservation_id", "dealer_id", "dealer_code", "dealer_name", "customer_name", "customer_phone", "vehicle_number", "vehicle_model", "product_type", "product_name", "product_serial", "certificate_number", "random_code", "check_digit", "installation_date", "issued_at", "issued_by", "verified_count", "last_verified_at", "status", "created_at"],
  certificateLogs: ["id", "certificate_number", "verified_at", "ip_address", "user_agent", "result"],
  vehicles: ["id", "brand", "model_name", "generation_name", "facelift_type", "body_code", "model_year", "vehicle_type", "default_color", "thumbnail_url", "image_mode_enabled", "three_d_enabled", "glb_file_url", "created_at", "updated_at", "is_active"],
  vehicle3dParts: ["id", "vehicle_id", "part_key", "mesh_name", "part_type", "tint_available", "ppf_available", "material_group", "created_at", "updated_at"],
  consultations: ["consultation_id", "dealer_code", "dealer_name", "created_by_login_id", "customer_name", "customer_phone", "vehicle_id", "vehicle_model", "vehicle_color", "selected_tint_products", "selected_ppf_products", "selected_ppf_parts", "applications", "quote_total", "screenshot_url", "memo", "status", "created_at", "updated_at"],
  products: ["sku", "product_name", "category", "brand", "product_code", "color_name", "color_hex", "color_chart_image_url", "finish_type", "transparency_type", "opacity", "shade_percent", "available_parts", "description", "unit", "retail_price", "purchase_price", "is_active", "main_category", "sub_category", "brand_line", "product_name_code", "lineup", "purpose", "created_at", "updated_at"],
  settings: ["key", "value"],
  pushSubscriptions: ["subscription_id", "login_id", "dealer_code", "role", "endpoint", "subscription_json", "user_agent", "is_active", "created_at", "updated_at"],
  notices: ["id", "title", "content", "notice_type", "target_category", "target_dealer_ids", "is_popup", "popup_start_at", "popup_end_at", "is_pinned", "is_active", "created_by", "created_at", "updated_at"],
  noticeReads: ["id", "notice_id", "login_id", "dealer_code", "read_at", "dismiss_type", "dismiss_until", "created_at", "updated_at"],
  messageThreads: ["id", "dealer_code", "dealer_name", "subject", "status", "created_at", "updated_at"],
  messages: ["id", "thread_id", "sender_role", "sender_id", "sender_name", "receiver_role", "receiver_id", "content", "is_read", "read_at", "message_type", "order_id", "created_at"],
  notifications: ["id", "type", "target_role", "target_dealer_id", "title", "message", "ref_type", "ref_id", "is_read", "read_at", "created_at"],
  orderDiscountLogs: ["id", "order_id", "dealer_code", "before_discount_rate", "after_discount_rate", "before_final_amount", "after_final_amount", "changed_by", "changed_at", "memo"],
  orderDiscountNotifications: ["id", "order_id", "dealer_code", "before_discount_rate", "after_discount_rate", "before_final_amount", "after_final_amount", "sent_at"]
};

const REPOSITORY_SHEET_HEADERS = {
  Orders: ["order_no", "agency_id", "product_name", "quantity", "status", "courier", "tracking_no", "shipping_receipt_no", "print_status", "printed_at", "print_count", "shipping_error", "approved_at", "created_at"],
  Agencies: ["id", "dealer_id", "agency_name", "contact_name", "phone", "zipcode", "address", "address_detail", "default_courier", "shipping_memo", "is_active", "is_first_login", "password_changed_at", "profile_completed_at", "updated_at"],
  Settings: ["key", "value"],
  Logs: ["created_at", "level", "message"]
};

const ORDER_STATUSES = ["접수", "승인", "출고", "완료", "반려", "취소"];
const SHIPPING_REGISTERED_TEST_STATUS = "shipping_registered_test";
const SESSION_SECONDS = 21600;
const HEAD_OFFICE_CODE = "ADMIN";
const HEAD_OFFICE_NAME = "본사";
const DEFAULT_RETAIL_PRICE = 1000000;
const DEFAULT_PURCHASE_PRICE = 500000;
const DEFAULT_LEGACY_ORDER_DISCOUNT_RATE = 20;
const PRODUCT_CATEGORIES = ["PPF", "TINTING", "DETAILING"];
const SCHEMA_CACHE_VERSION = "2026-06-12-v4-product-bulk-upload";
const SCHEMA_CACHE_SECONDS = 21600;
const CACHE_CHUNK_SIZE = 18000;
const MAX_CACHE_CHUNKS = 40;
const SHEET_CACHE_TTL_SECONDS = {
  "대리점관리": 60,
  "재고현황": 45,
  "발주현황": 30,
  "판매현황": 30,
  "예약현황": 30,
  "정품인증서": 30,
  "차량등록": 120,
  "차량3D매핑": 120,
  "상담현황": 30,
  "제품등록": 120,
  "settings": 120,
  "푸시구독": 30,
  "Notices": 30,
  "NoticeReads": 20,
  "MessageThreads": 20,
  "Messages": 20,
  "Notifications": 15,
  "OrderDiscountLogs": 30,
  "OrderDiscountNotifications": 30,
  "Agencies": 60,
  "Settings": 120
};
let REQUEST_CONTEXT = createRequestContext_("");
const LABEL_SETTING_DEFAULTS = {
  label_offset_x_mm: 0,
  label_offset_y_mm: 0,
  label_scale: 1,
  print_offset_x_mm: 0,
  print_offset_y_mm: 0,
  print_scale: 1,
  zone_code_x_mm: 58,
  zone_code_y_mm: 3,
  sort_code_x_mm: 116,
  sort_code_y_mm: 4,
  customer_order_x_mm: 6,
  customer_order_y_mm: 15,
  payment_x_mm: 39,
  payment_y_mm: 29,
  weight_x_mm: 6,
  weight_y_mm: 32,
  volume_x_mm: 25,
  volume_y_mm: 32,
  fee_x_mm: 45,
  fee_y_mm: 32,
  left_barcode_x_mm: 10,
  left_barcode_y_mm: 41,
  left_barcode_width_mm: 33,
  left_barcode_height_mm: 14,
  message_x_mm: 6,
  message_y_mm: 62,
  content_x_mm: 6,
  content_y_mm: 71,
  product_x_mm: 6,
  product_y_mm: 78,
  sender_block_x_mm: 62,
  sender_block_y_mm: 17,
  receiver_block_x_mm: 62,
  receiver_block_y_mm: 39,
  tracking_text_x_mm: 62,
  tracking_text_y_mm: 66,
  bottom_barcode_x_mm: 62,
  bottom_barcode_y_mm: 77,
  bottom_barcode_width_mm: 44,
  bottom_barcode_height_mm: 15,
  bottom_code_x_mm: 126,
  bottom_code_y_mm: 82,
  bottom_code_width_mm: 18
};

function doPost(e) {
  const startedAt = Date.now();
  let action = "unknown";
  try {
    const body = parseBody_(e);
    action = body.action || "unknown";
    REQUEST_CONTEXT = createRequestContext_(action);
    ensureSheetsReady_();
    const payload = body.payload || {};
    const token = body.token || "";

    if (action === "login") return ok_(handleLogin_(payload));
    if (action === "verifyCertificate") return ok_(handleVerifyCertificate_(payload, e));

    const user = requireSession_(token);
    if (action === "changePassword") return ok_(handleChangePassword_(payload, user, token));
    if (action === "completeOnboarding") return ok_(handleCompleteOnboarding_(payload, user, token));
    if (action === "getInventory") return ok_(handleGetInventory_(payload, user));
    if (action === "createOrder") return ok_(handleCreateOrder_(payload, user));
    if (action === "getOrders") return ok_(handleGetOrders_(payload, user));
    if (action === "updateOrderStatus") return ok_(handleUpdateOrderStatus_(payload, user));
    if (action === "updateOrderDiscount") return ok_(handleUpdateOrderDiscount_(payload, user));
    if (action === "getCommunicationData") return ok_(handleGetCommunicationData_(payload, user));
    if (action === "saveNotice") return ok_(handleSaveNotice_(payload, user));
    if (action === "markNoticeRead") return ok_(handleMarkNoticeRead_(payload, user));
    if (action === "dismissNotice") return ok_(handleDismissNotice_(payload, user));
    if (action === "createMessageThread") return ok_(handleCreateMessageThread_(payload, user));
    if (action === "sendMessage") return ok_(handleSendMessage_(payload, user));
    if (action === "markThreadRead") return ok_(handleMarkThreadRead_(payload, user));
    if (action === "markNotificationRead") return ok_(handleMarkNotificationRead_(payload, user));
    if (action === "updateThreadStatus") return ok_(handleUpdateThreadStatus_(payload, user));
    if (action === "markOrderPrinted") return ok_(handleMarkOrderPrinted_(payload, user));
    if (action === "getLabelSettings") return ok_(handleGetLabelSettings_(payload, user));
    if (action === "saveLabelSettings") return ok_(handleSaveLabelSettings_(payload, user));
    if (action === "receiveOrder") return ok_(handleReceiveOrder_(payload, user));
    if (action === "cancelOrder") return ok_(handleCancelOrder_(payload, user));
    if (action === "clearOrders") return ok_(handleClearOrders_(payload, user));
    if (action === "createSale") return ok_(handleCreateSale_(payload, user));
    if (action === "getSales") return ok_(handleGetSales_(payload, user));
    if (action === "createReservation") return ok_(handleCreateReservation_(payload, user));
    if (action === "completeReservation") return ok_(handleCompleteReservation_(payload, user));
    if (action === "getReservations") return ok_(handleGetReservations_(payload, user));
    if (action === "getCertificates") return ok_(handleGetCertificates_(payload, user));
    if (action === "getConsultationData") return ok_(handleGetConsultationData_(payload, user));
    if (action === "saveConsultation") return ok_(handleSaveConsultation_(payload, user));
    if (action === "saveVehicle") return ok_(handleSaveVehicle_(payload, user));
    if (action === "saveInventory") return ok_(handleSaveInventory_(payload, user));
    if (action === "saveProduct") return ok_(handleSaveProduct_(payload, user));
    if (action === "bulkSaveProducts") return ok_(handleBulkSaveProducts_(payload, user));
    if (action === "updateDealerDiscount") return ok_(handleUpdateDealerDiscount_(payload, user));
    if (action === "updateDealerCategoryPermissions") return ok_(handleUpdateDealerCategoryPermissions_(payload, user));
    if (action === "updateDealerProfile") return ok_(handleUpdateDealerProfile_(payload, user, token));
    if (action === "createDealerAccount") return ok_(handleCreateDealerAccount_(payload, user));
    if (action === "resetDealerPassword") return ok_(handleResetDealerPassword_(payload, user));
    if (action === "deactivateDealerAccount") return ok_(handleDeactivateDealerAccount_(payload, user));
    if (action === "deleteDealerAccount") return ok_(handleDeleteDealerAccount_(payload, user));
    if (action === "deleteProduct") return ok_(handleDeleteProduct_(payload, user));
    if (action === "getDealerLinks") return ok_(handleGetDealerLinks_(payload, user));
    if (action === "savePushSubscription") return ok_(handleSavePushSubscription_(payload, user));
    if (action === "deletePushSubscription") return ok_(handleDeletePushSubscription_(payload, user));
    if (action === "sendTestPushNotification") return ok_(handleSendTestPushNotification_(payload, user));
    if (action === "setupRepositorySheets") return ok_(handleSetupRepositorySheets_(payload, user));

    throw new Error("지원하지 않는 action입니다: " + action);
  } catch (error) {
    return fail_(error);
  } finally {
    logPerformance_(action, startedAt);
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
  seedVehiclesIfEmpty_();
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
      can_access_ppf: true,
      can_access_tinting: true,
      can_access_detailing: true,
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
    can_access_ppf: true,
    can_access_tinting: true,
    can_access_detailing: true,
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
      can_access_ppf: true,
      can_access_tinting: true,
      can_access_detailing: false,
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
  return {
    session,
    user,
    bootstrap_pending: true
  };
}

function handleChangePassword_(payload, user, token) {
  const currentPassword = required_(payload.current_password, "current_password");
  const newPassword = required_(payload.new_password, "new_password");
  if (newPassword.length < 8) throw new Error("새 비밀번호는 8자 이상이어야 합니다.");

  const account = findAccountByLoginId_(user.login_id);
  if (!account) throw new Error("계정을 찾을 수 없습니다.");
  if (!verifyPassword_(currentPassword, account.password_hash)) throw new Error("현재 비밀번호가 일치하지 않습니다.");

  const now = isoNow_();
  updateAccount_(account.login_id, {
    password_hash: hashPassword_(newPassword),
    is_first_login: false,
    password_changed_at: now,
    updated_at: now
  });

  const updated = publicAccount_(findAccountByLoginId_(user.login_id));
  refreshSession_(token, updated);
  return { session: { token: token, expires_in: SESSION_SECONDS }, user: updated };
}

function handleCompleteOnboarding_(payload, user, token) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 최초 설정을 완료할 수 있습니다.");

  const newPassword = required_(payload.new_password, "new_password");
  const contactName = required_(payload.contact_name, "contact_name");
  const phone = required_(payload.phone, "phone");
  const zipcode = required_(payload.zipcode, "zipcode");
  const address = required_(payload.address, "address");
  if (newPassword.length < 8) throw new Error("새 비밀번호는 8자 이상이어야 합니다.");

  const account = findAccountByLoginId_(user.login_id);
  if (!account) throw new Error("계정을 찾을 수 없습니다.");

  const now = isoNow_();
  updateAccount_(account.login_id, {
    password_hash: hashPassword_(newPassword),
    contact_name: contactName,
    phone: phone,
    zipcode: zipcode,
    address: address,
    address_detail: payload.address_detail || "",
    is_first_login: false,
    password_changed_at: now,
    profile_completed_at: now,
    updated_at: now
  });
  upsertAgencyFromDealerProfile_(user.dealer_code, user.dealer_name, {
    contact_name: contactName,
    phone: phone,
    zipcode: zipcode,
    address: address,
    address_detail: payload.address_detail || "",
    default_courier: payload.default_courier || "",
    shipping_memo: payload.shipping_memo || "",
    is_active: true,
    is_first_login: false,
    password_changed_at: now,
    profile_completed_at: now,
    updated_at: now
  });

  const updated = publicAccount_(findAccountByLoginId_(user.login_id));
  refreshSession_(token, updated);
  return {
    session: { token: token, expires_in: SESSION_SECONDS },
    user: updated,
    account: updated,
    accounts: listAccessibleAccounts_(updated)
  };
}

function handleGetInventory_(payload, user) {
  ensureInventoryForOwner_(HEAD_OFFICE_CODE, HEAD_OFFICE_NAME);
  const allProducts = readRows_(SHEETS.products);
  const products = allProducts.filter((product) => canAccessCategory_(user, normalizeProductCategory_(product.category, product)));
  const productMap = mapBy_(allProducts, "sku");
  const accountMap = dealerNameMap_();
  let inventory = readRows_(SHEETS.inventory).map((row) => {
    const product = productMap[row.sku] || {};
    const productName = product.product_name || row.product_name;
    return {
      dealer_code: row.dealer_code,
      dealer_name: accountMap[row.dealer_code] || row.dealer_code,
      product_name: productName,
      sku: row.sku,
      category: normalizeProductCategory_(product.category, product),
      color: inferColor_(productName),
      stock_qty: Number(row.stock_qty || 0),
      safety_stock: Number(row.safety_stock || 0),
      location: row.location || "",
      updated_at: row.updated_at || ""
    };
  }).filter((row) => canAccessCategory_(user, row.category));

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
  const productCategory = normalizeProductCategory_(product.category, product);
  requireCategoryAccess_(user, productCategory);
  const unitRetailPrice = productRetailPrice_(product);
  const discountRate = dealerDiscountRate_(user.dealer_code);
  const unitSalePrice = Math.round(unitRetailPrice * (1 - discountRate / 100));
  const unitPurchasePrice = productPurchasePrice_(product);
  const subtotalAmount = unitRetailPrice * qty;
  const finalOrderAmount = unitSalePrice * qty;

  const order = {
    order_id: makeOrderId_(),
    agency_id: user.dealer_code,
    dealer_code: user.dealer_code,
    dealer_name: user.dealer_name,
    created_by_login_id: user.login_id,
    product_name: product.product_name,
    sku: product.sku,
    product_category: productCategory,
    qty: qty,
    unit_retail_price: unitRetailPrice,
    dealer_discount_rate: discountRate,
    unit_sale_price: unitSalePrice,
    unit_purchase_price: unitPurchasePrice,
    dealer_default_discount_rate: discountRate,
    order_discount_rate: "",
    discount_apply_type: "DEALER_DEFAULT",
    applied_discount_rate: discountRate,
    subtotal_amount: subtotalAmount,
    discount_amount: subtotalAmount - finalOrderAmount,
    final_order_amount: finalOrderAmount,
    status: "접수",
    memo: payload.memo || "",
    recipient_name: "",
    recipient_phone: "",
    recipient_zipcode: "",
    recipient_address: "",
    recipient_address_detail: "",
    default_courier: "",
    shipping_memo: "",
    courier: "",
    tracking_no: "",
    shipping_receipt_no: "",
    shipping_error: "",
    approved_at: "",
    print_status: "",
    printed_at: "",
    print_count: 0,
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
  const productMap = mapBy_(readRows_(SHEETS.products), "sku");
  orders = orders.map((order) => ({
    ...order,
    product_category: orderProductCategory_(order, productMap)
  }));
  if (user.role === "dealer") {
    orders = orders.filter((order) => order.dealer_code === user.dealer_code && canAccessCategory_(user, order.product_category));
  }
  if (payload.status && payload.status !== "전체") {
    orders = orders.filter((order) => {
      if (payload.status === "승인") return order.status === "승인" || order.status === SHIPPING_REGISTERED_TEST_STATUS;
      return order.status === payload.status;
    });
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
  if (ORDER_STATUSES.indexOf(status) === -1 && status !== SHIPPING_REGISTERED_TEST_STATUS) throw new Error("지원하지 않는 발주 상태입니다.");
  const currentOrder = readRows_(SHEETS.orders).find((row) => row.order_id === orderId);
  if (!currentOrder) throw new Error("발주를 찾을 수 없습니다.");

  const updates = {
    status: status,
    updated_at: isoNow_()
  };
  const changedInventories = [];

  if (status === "승인") {
    try {
      registerTestShippingForOrder_(currentOrder, updates);
    } catch (error) {
      updates.status = "승인";
      clearTestShippingFromOrderUpdates_(updates);
      updates.shipping_error = error.message || "배송정보 검증에 실패했습니다.";
    }
  } else if (status === "출고") {
    applyDealerProfileToOrderUpdates_(currentOrder, updates);
  }

  if (status === "출고" || status === "완료") {
    if (!hasSnapshotValue_(currentOrder.hq_stock_deducted_at)) {
      const deducted = deductHeadOfficeStockForOrder_(currentOrder);
      updates.hq_stock_deducted_at = deducted.updated_at;
      changedInventories.push(deducted.inventory);
      if (deducted.low_stock) notifyHeadOfficeLowStock_(deducted.inventory);
    }
  }

  if (status === "출고") {
    const existingCourier = currentOrder.courier || currentOrder.shipping_company || currentOrder.default_courier || "";
    const existingTrackingNo = currentOrder.tracking_no || currentOrder.tracking_number || "";
    updates.courier = existingCourier;
    updates.tracking_no = existingTrackingNo;
    updates.shipping_company = updates.courier;
    updates.tracking_number = updates.tracking_no;
    updates.shipping_error = "";
  } else if (["접수", "반려", "취소"].indexOf(status) >= 0) {
    clearTestShippingFromOrderUpdates_(updates);
  }
  if (["접수", "반려", "취소"].indexOf(status) >= 0) {
    clearDealerProfileFromOrderUpdates_(updates);
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

function handleUpdateOrderDiscount_(payload, user) {
  requireAdmin_(user);
  const orderId = required_(payload.order_id, "order_id");
  const applyType = String(payload.discount_apply_type || "ORDER_CUSTOM").toUpperCase();
  if (["DEALER_DEFAULT", "ORDER_CUSTOM"].indexOf(applyType) === -1) throw new Error("할인 적용 유형이 올바르지 않습니다.");

  const currentOrder = readRows_(SHEETS.orders).find((row) => row.order_id === orderId);
  if (!currentOrder) throw new Error("발주를 찾을 수 없습니다.");

  const defaultRate = Number(hasSnapshotValue_(currentOrder.dealer_default_discount_rate)
    ? currentOrder.dealer_default_discount_rate
    : hasSnapshotValue_(currentOrder.dealer_discount_rate)
      ? currentOrder.dealer_discount_rate
      : dealerDiscountRate_(currentOrder.dealer_code));
  const requestedRate = applyType === "ORDER_CUSTOM" ? Number(payload.order_discount_rate) : defaultRate;
  if (Number.isNaN(requestedRate) || requestedRate < 0 || requestedRate > 100) throw new Error("할인율은 0~100 사이로 입력해 주세요.");

  const qty = Number(currentOrder.qty || 0);
  const unitRetailPrice = Number(currentOrder.unit_retail_price || 0);
  const subtotalAmount = Number(hasSnapshotValue_(currentOrder.subtotal_amount) ? currentOrder.subtotal_amount : unitRetailPrice * qty);
  const beforeRate = Number(hasSnapshotValue_(currentOrder.applied_discount_rate) ? currentOrder.applied_discount_rate : currentOrder.dealer_discount_rate || defaultRate);
  const beforeFinalAmount = Number(hasSnapshotValue_(currentOrder.final_order_amount)
    ? currentOrder.final_order_amount
    : Math.round(subtotalAmount * (1 - beforeRate / 100)));
  const finalOrderAmount = Math.round(subtotalAmount * (1 - requestedRate / 100));
  const discountAmount = subtotalAmount - finalOrderAmount;
  const now = isoNow_();
  const updates = {
    dealer_default_discount_rate: defaultRate,
    order_discount_rate: applyType === "ORDER_CUSTOM" ? requestedRate : "",
    discount_apply_type: applyType,
    applied_discount_rate: requestedRate,
    dealer_discount_rate: requestedRate,
    unit_sale_price: qty ? Math.round(finalOrderAmount / qty) : 0,
    subtotal_amount: subtotalAmount,
    discount_amount: discountAmount,
    final_order_amount: finalOrderAmount,
    updated_at: now
  };
  const order = updateRowByKey_(SHEETS.orders, "order_id", orderId, updates);
  const log = {
    id: makeCommunicationId_("ODL"),
    order_id: orderId,
    dealer_code: currentOrder.dealer_code,
    before_discount_rate: beforeRate,
    after_discount_rate: requestedRate,
    before_final_amount: beforeFinalAmount,
    after_final_amount: finalOrderAmount,
    changed_by: user.login_id,
    changed_at: now,
    memo: payload.memo || ""
  };
  const notification = {
    id: makeCommunicationId_("ODN"),
    order_id: orderId,
    dealer_code: currentOrder.dealer_code,
    before_discount_rate: beforeRate,
    after_discount_rate: requestedRate,
    before_final_amount: beforeFinalAmount,
    after_final_amount: finalOrderAmount,
    sent_at: now
  };
  appendObject_(SHEETS.orderDiscountLogs, log);
  appendObject_(SHEETS.orderDiscountNotifications, notification);
  const messageResult = appendAutomaticDiscountMessage_(order, log, user);
  return { order: order, log: log, notification: notification, thread: messageResult.thread, message: messageResult.message, push_notification: messageResult.push_notification };
}

function handleGetCommunicationData_(payload, user) {
  syncMissingCommunicationNotifications_();
  const notices = visibleNoticesForUser_(user);
  const noticeIds = {};
  notices.forEach((notice) => { noticeIds[notice.id] = true; });
  const noticeReads = readRows_(SHEETS.noticeReads).filter((row) => row.login_id === user.login_id && noticeIds[row.notice_id]);

  let threads = readRows_(SHEETS.messageThreads);
  if (user.role === "dealer") threads = threads.filter((thread) => sameCode_(thread.dealer_code, user.dealer_code));
  const threadIds = {};
  threads.forEach((thread) => { threadIds[thread.id] = true; });
  const messages = readRows_(SHEETS.messages).filter((message) => threadIds[message.thread_id]);
  const discountLogs = user.role === "admin"
    ? readRows_(SHEETS.orderDiscountLogs).reverse()
    : readRows_(SHEETS.orderDiscountLogs).filter((row) => sameCode_(row.dealer_code, user.dealer_code)).reverse();
  return {
    notices: notices,
    notice_reads: noticeReads,
    message_threads: threads.reverse(),
    messages: messages,
    order_discount_logs: discountLogs,
    notifications: notificationsForUser_(user)
  };
}

function handleSaveNotice_(payload, user) {
  requireAdmin_(user);
  const now = isoNow_();
  const noticeId = payload.id || makeCommunicationId_("NTC");
  const noticeType = String(payload.notice_type || "NORMAL").toUpperCase();
  const targetCategory = String(payload.target_category || "ALL").toUpperCase();
  if (["NORMAL", "IMPORTANT", "POPUP"].indexOf(noticeType) === -1) throw new Error("공지 유형이 올바르지 않습니다.");
  if (["ALL"].concat(PRODUCT_CATEGORIES).indexOf(targetCategory) === -1) throw new Error("공지 대상 사업부가 올바르지 않습니다.");
  const notice = {
    id: noticeId,
    title: required_(payload.title, "title"),
    content: required_(payload.content, "content"),
    notice_type: noticeType,
    target_category: targetCategory,
    target_dealer_ids: Array.isArray(payload.target_dealer_ids) ? payload.target_dealer_ids.join(",") : payload.target_dealer_ids || "",
    is_popup: toBool_(payload.is_popup) || noticeType === "POPUP",
    popup_start_at: payload.popup_start_at || "",
    popup_end_at: payload.popup_end_at || "",
    is_pinned: toBool_(payload.is_pinned) || noticeType === "IMPORTANT",
    is_active: payload.is_active === undefined ? true : toBool_(payload.is_active),
    created_by: user.login_id,
    created_at: payload.created_at || now,
    updated_at: now
  };
  const exists = readRows_(SHEETS.notices).some((row) => row.id === noticeId);
  const saved = exists ? updateRowByKey_(SHEETS.notices, "id", noticeId, notice) : (appendObject_(SHEETS.notices, notice), notice);
  const notificationCount = syncNoticeNotifications_(saved);
  return { notice: saved, notification_count: notificationCount };
}

function handleMarkNoticeRead_(payload, user) {
  const noticeId = required_(payload.notice_id, "notice_id");
  requireAccessibleNotice_(noticeId, user);
  return {
    notice_read: upsertNoticeRead_(noticeId, user, "READ", ""),
    notifications_read: markNotificationsReadByReference_(user, "NOTICE", noticeId, ["NOTICE"])
  };
}

function handleDismissNotice_(payload, user) {
  const noticeId = required_(payload.notice_id, "notice_id");
  requireAccessibleNotice_(noticeId, user);
  const type = String(payload.dismiss_type || "TODAY").toUpperCase();
  if (["TODAY", "NEVER"].indexOf(type) === -1) throw new Error("지원하지 않는 팝업 숨김 방식입니다.");
  return { notice_read: upsertNoticeRead_(noticeId, user, type, type === "TODAY" ? tomorrowStartText_() : "") };
}

function handleCreateMessageThread_(payload, user) {
  const dealerCode = user.role === "admin" ? required_(payload.dealer_code, "dealer_code").toUpperCase() : user.dealer_code;
  const dealerName = dealerNameMap_()[dealerCode] || payload.dealer_name || dealerCode;
  const now = isoNow_();
  const thread = {
    id: makeCommunicationId_("THR"),
    dealer_code: dealerCode,
    dealer_name: dealerName,
    subject: required_(payload.subject, "subject"),
    status: "OPEN",
    created_at: now,
    updated_at: now
  };
  appendObject_(SHEETS.messageThreads, thread);
  const result = handleSendMessage_({ thread_id: thread.id, content: payload.content || "새 문의가 등록되었습니다." }, user);
  return { thread: thread, message: result.message };
}

function handleSendMessage_(payload, user) {
  const threadId = required_(payload.thread_id, "thread_id");
  const thread = requireAccessibleThread_(threadId, user);
  const now = isoNow_();
  const message = {
    id: makeCommunicationId_("MSG"),
    thread_id: threadId,
    sender_role: user.role.toUpperCase(),
    sender_id: user.login_id,
    sender_name: user.dealer_name,
    receiver_role: user.role === "admin" ? "DEALER" : "ADMIN",
    receiver_id: user.role === "admin" ? thread.dealer_code : HEAD_OFFICE_CODE,
    content: required_(payload.content, "content"),
    is_read: false,
    read_at: "",
    message_type: payload.message_type || "NORMAL",
    order_id: payload.order_id || "",
    created_at: now
  };
  appendObject_(SHEETS.messages, message);
  const nextStatus = user.role === "admin" ? "ANSWERED" : "OPEN";
  const updatedThread = updateRowByKey_(SHEETS.messageThreads, "id", threadId, { status: nextStatus, updated_at: now });
  createOrRefreshMessageNotification_(message, updatedThread, "MESSAGE");
  return { thread: updatedThread, message: message, notification_created: true };
}

function handleMarkThreadRead_(payload, user) {
  const thread = requireAccessibleThread_(required_(payload.thread_id, "thread_id"), user);
  const receiverRole = user.role.toUpperCase();
  const messages = readRows_(SHEETS.messages).filter((message) => message.thread_id === thread.id && message.receiver_role === receiverRole && !toBool_(message.is_read));
  messages.forEach((message) => updateRowByKey_(SHEETS.messages, "id", message.id, { is_read: true, read_at: isoNow_() }));
  return {
    thread_id: thread.id,
    read_count: messages.length,
    notifications_read: markNotificationsReadByReference_(user, "MESSAGE_THREAD", thread.id, ["MESSAGE", "ORDER_DISCOUNT"])
  };
}

function handleMarkNotificationRead_(payload, user) {
  const notificationId = required_(payload.notification_id, "notification_id");
  const notification = notificationsForUser_(user).find((row) => row.id === notificationId);
  if (!notification) throw new Error("확인할 수 없는 알림입니다.");
  const updated = updateRowByKey_(SHEETS.notifications, "id", notificationId, {
    is_read: true,
    read_at: isoNow_()
  });
  return { notification: updated };
}

function handleUpdateThreadStatus_(payload, user) {
  requireAdmin_(user);
  const status = String(payload.status || "CLOSED").toUpperCase();
  if (["OPEN", "ANSWERED", "CLOSED"].indexOf(status) === -1) throw new Error("쪽지 상태가 올바르지 않습니다.");
  return { thread: updateRowByKey_(SHEETS.messageThreads, "id", required_(payload.thread_id, "thread_id"), { status: status, updated_at: isoNow_() }) };
}

function handleMarkOrderPrinted_(payload, user) {
  const orderId = required_(payload.order_id, "order_id");
  const printStatus = payload.print_status === "failed" ? "failed" : "printed";
  const currentOrder = readRows_(SHEETS.orders).find((row) => row.order_id === orderId);
  if (!currentOrder) throw new Error("발주를 찾을 수 없습니다.");
  if (user.role !== "admin" && String(currentOrder.dealer_code).toUpperCase() !== String(user.dealer_code).toUpperCase()) {
    throw new Error("본인 대리점 발주만 송장 출력 처리할 수 있습니다.");
  }
  if (user.role !== "admin") requireOrderCategoryAccess_(user, currentOrder);
  if (!(currentOrder.tracking_no || currentOrder.tracking_number)) {
    throw new Error("송장번호가 있는 발주만 출력 처리할 수 있습니다.");
  }

  const updates = {
    print_status: printStatus,
    updated_at: isoNow_()
  };
  if (printStatus === "printed") {
    updates.printed_at = isoNow_();
    updates.print_count = Number(currentOrder.print_count || 0) + 1;
  }

  return {
    order: updateRowByKey_(SHEETS.orders, "order_id", orderId, updates)
  };
}

function handleGetLabelSettings_(payload, user) {
  requireAdmin_(user);
  return { label_settings: labelSettings_() };
}

function handleSaveLabelSettings_(payload, user) {
  requireAdmin_(user);
  const settings = payload.settings || payload.label_settings || {};
  const updates = {};
  Object.keys(LABEL_SETTING_DEFAULTS).forEach((key) => {
    const fallback = LABEL_SETTING_DEFAULTS[key];
    const value = hasSnapshotValue_(settings[key]) ? Number(settings[key]) : Number(fallback);
    if (!isFinite(value)) throw new Error("라벨 보정값은 숫자여야 합니다: " + key);
    if (key === "label_scale" && value <= 0) throw new Error("라벨 배율은 0보다 커야 합니다.");
    if (/_width_mm$|_height_mm$/.test(key) && value <= 0) throw new Error("바코드 크기는 0보다 커야 합니다.");
    updates[key] = value;
  });
  setSettings_(updates);
  return { label_settings: labelSettings_() };
}

function labelSettings_() {
  const settings = {};
  Object.keys(LABEL_SETTING_DEFAULTS).forEach((key) => {
    const stored = getSetting_(key);
    const value = hasSnapshotValue_(stored) ? Number(stored) : Number(LABEL_SETTING_DEFAULTS[key]);
    settings[key] = isFinite(value) ? value : Number(LABEL_SETTING_DEFAULTS[key]);
  });
  return settings;
}

function handleReceiveOrder_(payload, user) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 입고완료 처리할 수 있습니다.");
  const orderId = required_(payload.order_id, "order_id");
  const order = readRows_(SHEETS.orders).find((row) => row.order_id === orderId);
  if (!order) throw new Error("입고 처리할 발주를 찾을 수 없습니다.");
  if (String(order.dealer_code).toUpperCase() !== String(user.dealer_code).toUpperCase()) {
    throw new Error("본인 대리점 발주만 입고완료 처리할 수 있습니다.");
  }
  requireOrderCategoryAccess_(user, order);
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
  requireOrderCategoryAccess_(user, order);
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
  invalidateSheetCache_(SHEETS.orders);
  return { deleted_count: deletedCount };
}

function handleCreateSale_(payload, user) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 판매완료를 등록할 수 있습니다.");
  const sku = required_(payload.sku, "sku");
  const qty = Number(required_(payload.qty, "qty"));
  if (!qty || qty < 1) throw new Error("판매 수량은 1 이상이어야 합니다.");

  const product = readRows_(SHEETS.products).find((row) => row.sku === sku && toBool_(row.is_active));
  if (!product) throw new Error("제품을 찾을 수 없습니다.");
  requireCategoryAccess_(user, normalizeProductCategory_(product.category, product));
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
  const products = readRows_(SHEETS.products).filter((row) => toBool_(row.is_active));
  const productMap = mapBy_(products, "sku");
  const items = normalizeReservationItems_(payload.reservation_items || payload.reservationItems, payload, productMap);
  if (!items.length) throw new Error("예약 제품을 1개 이상 추가해 주세요.");
  const groupedQty = groupReservationItemQty_(items);
  let hasShortage = false;
  Object.keys(groupedQty).forEach((sku) => {
    const product = productMap[sku];
    if (!product) throw new Error("제품을 찾을 수 없습니다: " + sku);
    requireCategoryAccess_(user, normalizeProductCategory_(product.category, product), "해당 사업부 제품을 예약할 권한이 없습니다.");
    const inventory = inventoryRowFor_(user.dealer_code, sku);
    const availableQty = Math.max(Number(inventory.stock_qty || 0) - pendingReservationQty_(user.dealer_code, sku), 0);
    if (availableQty < groupedQty[sku]) hasShortage = true;
  });

  const firstItem = items[0];
  const totalQty = items.reduce((total, item) => total + Number(item.qty || 0), 0);
  const now = isoNow_();
  const reservation = {
    reservation_id: makeReservationId_(),
    dealer_code: user.dealer_code,
    dealer_name: user.dealer_name,
    created_by_login_id: user.login_id,
    customer_name: payload.customer_name || "",
    customer_phone: payload.customer_phone || "",
    vehicle_number: payload.vehicle_number || "",
    vehicle_model: payload.vehicle_model || "",
    reservation_date: payload.reservation_date || "",
    product_name: items.length === 1 ? firstItem.product_name : firstItem.product_name + " 외 " + (items.length - 1) + "개",
    sku: firstItem.sku,
    qty: totalQty,
    reservation_items: JSON.stringify(items),
    status: hasShortage ? "재고부족" : "예약",
    memo: payload.memo || "",
    completed_at: "",
    created_at: now,
    updated_at: now
  };
  appendObject_(SHEETS.reservations, reservation);
  return {
    reservation: reservation
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

  const products = readRows_(SHEETS.products);
  const productMap = mapBy_(products, "sku");
  const items = normalizeReservationItems_(reservation.reservation_items, reservation, productMap);
  const groupedQty = groupReservationItemQty_(items);
  Object.keys(groupedQty).forEach((sku) => {
    const product = productMap[sku] || { sku: sku, product_name: sku, category: "", unit: "롤" };
    requireCategoryAccess_(user, normalizeProductCategory_(product.category, product));
    const inventory = inventoryRowFor_(user.dealer_code, sku);
    if (Number(inventory.stock_qty || 0) < groupedQty[sku]) throw new Error(product.product_name + " 재고가 부족합니다.");
  });
  const inventories = Object.keys(groupedQty).map((sku) => {
    const product = productMap[sku] || { sku: sku, product_name: sku, category: "", unit: "롤" };
    return adjustInventoryStock_(user.dealer_code, user.dealer_name, product, -groupedQty[sku], { requireEnoughStock: true });
  });
  const now = isoNow_();
  const updated = updateRowByKey_(SHEETS.reservations, "reservation_id", reservationId, {
    status: "시공완료",
    completed_at: now,
    updated_at: now
  });
  const certificateProduct = productMap[items[0] && items[0].sku] || { sku: updated.sku, product_name: updated.product_name, category: "" };
  const certificate = createCertificateForReservation_(updated, user, certificateProduct);
  return {
    reservation: updated,
    certificate: certificate,
    inventories: inventories.map((inventory) => publicInventoryRow_(inventory, productMap, dealerNameMap_()))
  };
}

function handleGetReservations_(payload, user) {
  let reservations = readRows_(SHEETS.reservations);
  if (user.role === "dealer") {
    reservations = reservations.filter((reservation) => String(reservation.dealer_code).toUpperCase() === String(user.dealer_code).toUpperCase());
  }
  const productMap = mapBy_(readRows_(SHEETS.products), "sku");
  reservations = reservations.map((reservation) => filterReservationForUser_(reservation, user, productMap)).filter(Boolean);
  return { reservations: reservations.reverse() };
}

function handleGetCertificates_(payload, user) {
  let certificates = readRows_(SHEETS.certificates);
  if (user.role === "dealer") {
    certificates = certificates.filter((certificate) => String(certificate.dealer_code).toUpperCase() === String(user.dealer_code).toUpperCase());
  }
  const query = String(payload.query || "").toLowerCase().trim();
  if (query) {
    certificates = certificates.filter((certificate) => (
      [certificate.certificate_number, certificate.dealer_name, certificate.dealer_code, certificate.vehicle_number, certificate.product_name, certificate.customer_name]
        .some((value) => String(value || "").toLowerCase().indexOf(query) >= 0)
    ));
  }
  return { certificates: certificates.reverse() };
}

function handleGetConsultationData_(payload, user) {
  seedVehiclesIfEmpty_();
  let consultations = readRows_(SHEETS.consultations);
  if (user.role === "dealer") {
    consultations = consultations.filter((row) => String(row.dealer_code).toUpperCase() === String(user.dealer_code).toUpperCase());
  }
  const query = String(payload.query || "").toLowerCase().trim();
  if (query) {
    consultations = consultations.filter((row) => (
      [row.customer_name, row.customer_phone, row.vehicle_model, row.vehicle_color, row.dealer_name, row.created_by_login_id, row.memo, row.selected_tint_products, row.selected_ppf_products, row.selected_ppf_parts]
        .some((value) => String(value || "").toLowerCase().indexOf(query) >= 0)
    ));
  }
  const vehicles = readRows_(SHEETS.vehicles).filter((row) => row.is_active === "" || toBool_(row.is_active));
  return {
    vehicles: vehicles,
    consultations: consultations.reverse()
  };
}

function handleSaveConsultation_(payload, user) {
  const customerName = required_(payload.customer_name, "customer_name");
  const customerPhone = required_(payload.customer_phone, "customer_phone");
  const vehicleModel = required_(payload.vehicle_model, "vehicle_model");
  const quoteTotal = Number(payload.quote_total || 0);
  if (quoteTotal < 0) throw new Error("견적 금액이 올바르지 않습니다.");

  const now = isoNow_();
  const consultation = {
    consultation_id: "CNS-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd") + "-" + Utilities.getUuid().slice(0, 8).toUpperCase(),
    dealer_code: user.dealer_code,
    dealer_name: user.dealer_name,
    created_by_login_id: user.login_id,
    customer_name: customerName,
    customer_phone: customerPhone,
    vehicle_id: payload.vehicle_id || "",
    vehicle_model: vehicleModel,
    vehicle_color: payload.vehicle_color || "",
    selected_tint_products: payload.selected_tint_products || "[]",
    selected_ppf_products: payload.selected_ppf_products || "[]",
    selected_ppf_parts: payload.selected_ppf_parts || "[]",
    applications: payload.applications || "[]",
    quote_total: quoteTotal,
    screenshot_url: payload.screenshot_url || "",
    memo: payload.memo || "",
    status: payload.status || "saved",
    created_at: now,
    updated_at: now
  };
  appendObject_(SHEETS.consultations, consultation);
  return { consultation: consultation };
}

function handleSaveVehicle_(payload, user) {
  requireAdmin_(user);
  const id = required_(payload.id, "id");
  const now = isoNow_();
  const existing = readRows_(SHEETS.vehicles).find((row) => String(row.id) === String(id));
  const vehicle = {
    id: id,
    brand: payload.brand || "Tesla",
    model_name: required_(payload.model_name, "model_name"),
    generation_name: payload.generation_name || "Current",
    facelift_type: payload.facelift_type || payload.generation_name || "",
    body_code: payload.body_code || "",
    model_year: payload.model_year || "",
    vehicle_type: payload.vehicle_type || "",
    default_color: payload.default_color || "Pearl White",
    thumbnail_url: payload.thumbnail_url || "",
    image_mode_enabled: payload.image_mode_enabled === undefined ? true : toBool_(payload.image_mode_enabled),
    three_d_enabled: toBool_(payload.three_d_enabled),
    glb_file_url: payload.glb_file_url || "",
    created_at: existing ? existing.created_at : now,
    updated_at: now,
    is_active: payload.is_active === undefined ? true : toBool_(payload.is_active)
  };
  if (existing) updateRowByKey_(SHEETS.vehicles, "id", id, vehicle);
  else appendObject_(SHEETS.vehicles, vehicle);
  return { vehicle: vehicle };
}

function handleVerifyCertificate_(payload, event) {
  const certificateNumber = normalizeCertificateNumber_(required_(payload.certificate_number, "certificate_number"));
  const userAgent = payload.user_agent || "";
  const ipAddress = event && event.parameter && event.parameter.ip ? event.parameter.ip : "";
  const now = isoNow_();

  if (!isCertificateNumberFormat_(certificateNumber) || !isCertificateCheckDigitValid_(certificateNumber)) {
    appendCertificateLog_(certificateNumber, now, ipAddress, userAgent, "malformed");
    throw new Error("올바른 인증번호 형식이 아닙니다.");
  }

  const certificate = readRows_(SHEETS.certificates).find((row) => String(row.certificate_number).toUpperCase() === certificateNumber);
  if (!certificate) {
    appendCertificateLog_(certificateNumber, now, ipAddress, userAgent, "invalid");
    return {
      result: "invalid",
      message: "등록되지 않은 인증번호입니다."
    };
  }

  if (certificate.status === "revoked") {
    appendCertificateLog_(certificateNumber, now, ipAddress, userAgent, "revoked");
    return {
      result: "revoked",
      message: "사용 중지된 인증서입니다."
    };
  }

  if (certificate.status === "reissued") {
    appendCertificateLog_(certificateNumber, now, ipAddress, userAgent, "reissued");
    return {
      result: "reissued",
      message: "재발급된 인증서입니다."
    };
  }

  const verifiedCount = Number(certificate.verified_count || 0) + 1;
  const updated = updateRowByKey_(SHEETS.certificates, "certificate_number", certificateNumber, {
    verified_count: verifiedCount,
    last_verified_at: now
  });
  appendCertificateLog_(certificateNumber, now, ipAddress, userAgent, "success");
  return {
    result: "success",
    message: "GLOC 정품 인증 완료",
    certificate: publicVerificationCertificate_(updated)
  };
}

function pendingReservationQty_(dealerCode, sku) {
  return readRows_(SHEETS.reservations)
    .filter((reservation) => (
      String(reservation.dealer_code).toUpperCase() === String(dealerCode).toUpperCase() &&
      reservation.status !== "시공완료"
    ))
    .reduce((total, reservation) => {
      const items = normalizeReservationItems_(reservation.reservation_items, reservation, {});
      return total + items
        .filter((item) => String(item.sku) === String(sku))
        .reduce((itemTotal, item) => itemTotal + Number(item.qty || 0), 0);
    }, 0);
}

function normalizeReservationItems_(rawItems, legacy, productMap) {
  let items = rawItems;
  if (typeof items === "string" && items.trim()) {
    try {
      items = JSON.parse(items);
    } catch (error) {
      items = [];
    }
  }
  if (!Array.isArray(items) || !items.length) {
    items = legacy && legacy.sku ? [{
      id: String(legacy.reservation_id || "legacy") + "-" + String(legacy.sku),
      sku: legacy.sku,
      product_name: legacy.product_name,
      qty: legacy.qty,
      usage_area: legacy.usage_area || "기타",
      category: legacy.product_category || ""
    }] : [];
  }
  return items.map((item, index) => {
    const sku = String(item.sku || item.product_id || item.productId || "").trim();
    if (!sku) return null;
    const product = productMap[sku] || {};
    const qty = Number(item.qty || item.quantity || 0);
    if (!qty || qty < 1) throw new Error("예약 제품 수량은 1 이상이어야 합니다.");
    return {
      id: item.id || "RITEM-" + (index + 1),
      product_id: item.product_id || item.productId || sku,
      product_name: item.product_name || item.productName || product.product_name || sku,
      sku: sku,
      category: normalizeProductCategory_(item.category || product.category, product),
      usage_area: item.usage_area || item.usageArea || "기타",
      qty: qty
    };
  }).filter(Boolean);
}

function groupReservationItemQty_(items) {
  return items.reduce((map, item) => {
    map[item.sku] = Number(map[item.sku] || 0) + Number(item.qty || 0);
    return map;
  }, {});
}

function filterReservationForUser_(reservation, user, productMap) {
  const items = normalizeReservationItems_(reservation.reservation_items, reservation, productMap)
    .filter((item) => canAccessCategory_(user, item.category));
  if (!items.length) return null;
  const totalQty = items.reduce((total, item) => total + Number(item.qty || 0), 0);
  return Object.assign({}, reservation, {
    product_name: items.length === 1 ? items[0].product_name : items[0].product_name + " 외 " + (items.length - 1) + "개",
    sku: items[0].sku,
    qty: totalQty,
    reservation_items: JSON.stringify(items)
  });
}

function createCertificateForReservation_(reservation, user, product) {
  const existing = readRows_(SHEETS.certificates).find((row) => String(row.reservation_id) === String(reservation.reservation_id));
  if (existing) return existing;

  const dealerCode = String(reservation.dealer_code || user.dealer_code || "").toUpperCase();
  const issueDate = dateCompactFromIso_(reservation.completed_at || isoNow_());
  const serial = generateUniqueCertificateNumber_(dealerCode, issueDate);
  const now = isoNow_();
  const certificate = {
    id: makeCertificateId_(),
    reservation_id: reservation.reservation_id,
    dealer_id: dealerCode,
    dealer_code: dealerCode,
    dealer_name: reservation.dealer_name || user.dealer_name || "",
    customer_name: reservation.customer_name || "",
    customer_phone: reservation.customer_phone || "",
    vehicle_number: reservation.vehicle_number || "",
    vehicle_model: reservation.vehicle_model || "",
    product_type: productTypeFor_(product || reservation),
    product_name: reservation.product_name || product.product_name || "",
    product_serial: serial.certificate_number,
    certificate_number: serial.certificate_number,
    random_code: serial.random_code,
    check_digit: serial.check_digit,
    installation_date: reservation.completed_at || now,
    issued_at: now,
    issued_by: user.login_id || "",
    verified_count: 0,
    last_verified_at: "",
    status: "active",
    created_at: now
  };
  appendObject_(SHEETS.certificates, certificate);
  return certificate;
}

function generateUniqueCertificateNumber_(dealerCode, issueDate) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const randomCode = certificateRandomCode_();
    const base = ["GLOC", dealerCode, issueDate, randomCode].join("-");
    const checkDigit = certificateCheckDigit_(base);
    const certificateNumber = base + "-" + checkDigit;
    const exists = readRows_(SHEETS.certificates).some((row) => String(row.certificate_number).toUpperCase() === certificateNumber);
    if (!exists) {
      return {
        certificate_number: certificateNumber,
        random_code: randomCode,
        check_digit: checkDigit
      };
    }
  }
  throw new Error("인증번호 중복이 반복되어 생성하지 못했습니다. 다시 시도해 주세요.");
}

function certificateRandomCode_() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function certificateCheckDigit_(base) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(base), Utilities.Charset.UTF_8);
  const last = digest[digest.length - 1];
  const normalized = last < 0 ? last + 256 : last;
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(normalized % 26);
}

function isCertificateNumberFormat_(value) {
  return /^GLOC-[A-Z0-9]{4}-\d{8}-[A-Z0-9]{6}-[A-Z]{1}$/.test(String(value || "").toUpperCase());
}

function isCertificateCheckDigitValid_(value) {
  const parts = String(value || "").toUpperCase().split("-");
  if (parts.length !== 5) return false;
  const checkDigit = parts.pop();
  return certificateCheckDigit_(parts.join("-")) === checkDigit;
}

function normalizeCertificateNumber_(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function productTypeFor_(source) {
  const text = [source.category, source.product_name, source.sku].join(" ").toLowerCase();
  if (text.indexOf("ppf") >= 0) return "PPF";
  if (text.indexOf("틴팅") >= 0 || text.indexOf("tint") >= 0 || text.indexOf("tn-") >= 0) return "틴팅";
  return source.category || "필름";
}

function publicVerificationCertificate_(certificate) {
  return {
    status: certificate.status,
    product_type: certificate.product_type,
    product_name: certificate.product_name,
    installation_date: certificate.installation_date,
    dealer_name: certificate.dealer_name,
    vehicle_number_masked: maskVehicleNumber_(certificate.vehicle_number),
    verified_count: certificate.verified_count,
    last_verified_at: certificate.last_verified_at
  };
}

function appendCertificateLog_(certificateNumber, verifiedAt, ipAddress, userAgent, result) {
  appendObject_(SHEETS.certificateLogs, {
    id: "LOG-" + Utilities.getUuid(),
    certificate_number: certificateNumber,
    verified_at: verifiedAt,
    ip_address: ipAddress || "",
    user_agent: userAgent || "",
    result: result
  });
}

function maskVehicleNumber_(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const digits = text.match(/\d{4}$/);
  if (digits) return "****" + digits[0];
  return text.length <= 2 ? text[0] + "*" : text.slice(0, 2) + "****";
}

function makeCertificateId_() {
  return "CERT-" + Utilities.getUuid();
}

function dateCompactFromIso_(value) {
  const date = String(value || "").slice(0, 10).replace(/-/g, "");
  return /^\d{8}$/.test(date) ? date : Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
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
  requireCategoryAccess_(user, normalizeProductCategory_(product.category, product), "해당 카테고리 재고를 수정할 권한이 없습니다.");

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
    category: normalizeProductCategory_(required_(payload.category, "category"), payload),
    brand: payload.brand || "GLOC",
    product_code: payload.product_code || sku,
    color_name: payload.color_name || "",
    color_hex: payload.color_hex || "",
    color_chart_image_url: payload.color_chart_image_url || "",
    finish_type: payload.finish_type || "",
    transparency_type: payload.transparency_type || "",
    opacity: payload.opacity === undefined ? "" : Number(payload.opacity || 0),
    shade_percent: payload.shade_percent === undefined ? "" : payload.shade_percent,
    available_parts: payload.available_parts || "",
    description: payload.description || "",
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

function handleBulkSaveProducts_(payload, user) {
  requireAdmin_(user);
  const category = normalizeProductCategory_(required_(payload.category, "category"), payload);
  const mode = String(payload.mode || "SKIP").toUpperCase();
  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  if (["NEW", "UPDATE", "SKIP"].indexOf(mode) === -1) throw new Error("지원하지 않는 중복 처리 방식입니다.");
  if (!rows.length) throw new Error("등록할 제품 행이 없습니다.");
  if (rows.length > 1000) throw new Error("한 번에 최대 1,000개 제품까지 등록할 수 있습니다.");

  const existingProducts = readRows_(SHEETS.products).slice();
  const workingProducts = existingProducts.slice();
  const createdProducts = [];
  const reservedSkus = {};
  existingProducts.forEach((product) => {
    reservedSkus[String(product.sku || "").toUpperCase()] = true;
  });

  const result = {
    total: rows.length,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    rows: [],
    products: []
  };

  rows.forEach((raw, index) => {
    const rowNumber = Number(raw && raw.source_row || index + 2);
    try {
      const product = normalizeBulkProduct_(raw || {}, category);
      validateBulkProduct_(product, category);
      const duplicateKey = bulkProductDuplicateKey_(product, category);
      const existing = workingProducts.find((item) => normalizeProductCategory_(item.category, item) === category && bulkProductDuplicateKey_(item, category) === duplicateKey);

      if (existing && mode === "NEW") {
        result.failed += 1;
        result.rows.push({ source_row: rowNumber, status: "failed", message: "중복 상품이라 신규 등록할 수 없음", sku: existing.sku });
        return;
      }

      if (existing && mode === "SKIP") {
        result.skipped += 1;
        result.rows.push({ source_row: rowNumber, status: "skipped", message: "중복 상품 건너뜀", sku: existing.sku });
        return;
      }

      const now = isoNow_();
      if (existing) {
        product.sku = existing.sku;
        product.product_code = existing.product_code || existing.sku || product.product_code;
        product.created_at = existing.created_at || now;
        product.updated_at = now;
        const saved = updateRowByKey_(SHEETS.products, "sku", product.sku, product);
        Object.assign(existing, saved);
        result.updated += 1;
        result.products.push(publicProduct_(saved));
        result.rows.push({ source_row: rowNumber, status: "updated", message: "기존 상품 업데이트", sku: product.sku });
        return;
      }

      product.sku = product.sku || generateBulkProductSku_(category, product.brand || product.brand_line, workingProducts, reservedSkus);
      product.product_code = product.product_code || product.sku;
      product.created_at = now;
      product.updated_at = now;
      const saved = upsertProductRow_(product.sku, product);
      createdProducts.push(saved);
      workingProducts.push(saved);
      reservedSkus[String(product.sku).toUpperCase()] = true;
      result.created += 1;
      result.products.push(publicProduct_(saved));
      result.rows.push({ source_row: rowNumber, status: "created", message: "신규 등록", sku: product.sku });
    } catch (error) {
      result.failed += 1;
      result.rows.push({ source_row: rowNumber, status: "failed", message: error.message || String(error), sku: "" });
    }
  });

  try {
    seedInventoryForProducts_(createdProducts);
  } catch (error) {
    result.warning = "제품 등록은 완료되었지만 신규 제품 재고 초기화에 실패했습니다: " + (error.message || String(error));
  }
  invalidateSheetCache_([SHEETS.products, SHEETS.inventory]);
  return result;
}

function normalizeBulkProduct_(row, category) {
  const active = row.is_active === undefined ? true : toBool_(row.is_active);
  const product = {
    sku: String(row.sku || "").trim().toUpperCase(),
    product_name: String(row.product_name || "").trim(),
    category: category,
    brand: String(row.brand || row.brand_line || "").trim(),
    product_code: String(row.product_code || "").trim(),
    color_name: String(row.color_name || "").trim(),
    color_hex: String(row.color_hex || "").trim(),
    color_chart_image_url: String(row.color_chart_image_url || "").trim(),
    finish_type: String(row.finish_type || "").trim(),
    transparency_type: String(row.transparency_type || "").trim(),
    opacity: row.opacity === "" || row.opacity === undefined ? "" : Number(row.opacity),
    shade_percent: row.shade_percent === "" || row.shade_percent === undefined ? "" : Number(row.shade_percent),
    available_parts: String(row.available_parts || "").trim(),
    description: String(row.description || "").trim(),
    unit: String(row.unit || "").trim(),
    retail_price: row.retail_price === "" || row.retail_price === undefined ? "" : Number(row.retail_price),
    purchase_price: row.purchase_price === "" || row.purchase_price === undefined ? "" : Number(row.purchase_price),
    is_active: active,
    main_category: String(row.main_category || "").trim(),
    sub_category: String(row.sub_category || "").trim(),
    brand_line: String(row.brand_line || "").trim(),
    product_name_code: String(row.product_name_code || "").trim(),
    lineup: String(row.lineup || "").trim(),
    purpose: String(row.purpose || "").trim()
  };
  product.active_source = String(row.active_source || "").trim().toUpperCase();

  if (category === "TINTING") {
    product.available_parts = product.available_parts || "frontGlass,firstRowGlass,secondRowGlass,rearGlass,roofGlass";
  }
  if (category === "DETAILING") {
    product.main_category = product.main_category || "Detailing Care";
    product.brand = product.brand || product.brand_line;
    // 제품명코드는 선택값이므로 공란이면 그대로 보존하고, 화면 호환용 제품명만 상품코드를 사용합니다.
    product.product_name = product.product_name || product.product_name_code || product.product_code;
    product.unit = product.unit || "개";
  }
  product.product_code = product.product_code || product.sku;
  return product;
}

function validateBulkProduct_(product, category) {
  const requiredFields = category === "DETAILING"
    ? [["product_code", "상품코드"], ["sub_category", "하위카테고리"], ["brand_line", "브랜드/라인"], ["lineup", "라인업"], ["purpose", "용도"], ["unit", "재고단위"]]
    : [["product_name", "제품명"], ["brand", "브랜드"], ["color_name", "색상명"], ["color_hex", "색상HEX"], ["unit", "단위"]];
  requiredFields.forEach((field) => {
    if (!String(product[field[0]] || "").trim()) throw new Error(field[1] + " 누락");
  });
  if (category === "PPF") {
    if (["gloss", "matte", "semi_matte", "satin"].indexOf(product.finish_type) === -1) throw new Error("광택타입 허용값 오류");
    if (["transparent", "semi_transparent", "opaque"].indexOf(product.transparency_type) === -1) throw new Error("투명도타입 허용값 오류");
    validateBulkPercent_(product.opacity, "투명도수치");
  }
  if (category === "TINTING") {
    validateBulkPercent_(product.shade_percent, "틴팅농도");
    validateBulkPercent_(product.opacity, "투명도");
  }
  if (category !== "DETAILING" && (product.retail_price === "" || product.purchase_price === "")) {
    throw new Error("소비자가 또는 매입가 누락");
  }
  if (product.retail_price !== "" && (!isFinite(product.retail_price) || product.retail_price < 0)) throw new Error("소비자가 값 오류");
  if (product.purchase_price !== "" && (!isFinite(product.purchase_price) || product.purchase_price < 0)) throw new Error("매입가 값 오류");
  if (["Y", "N"].indexOf(product.active_source) === -1) throw new Error("사용여부는 Y 또는 N만 가능");
  if (category !== "DETAILING" && !/^#[0-9A-Fa-f]{6}$/.test(product.color_hex)) throw new Error("색상HEX 형식 오류");
}

function validateBulkPercent_(value, label) {
  if (value === "" || value === undefined || value === null) throw new Error(label + " 누락");
  if (!isFinite(Number(value)) || Number(value) < 0 || Number(value) > 100) throw new Error(label + "가 0~100 범위를 벗어남");
}

function bulkProductDuplicateKey_(product, category) {
  if (category === "DETAILING") return "DETAILING|" + normalizeBulkKey_(product.product_code);
  return category + "|" + normalizeBulkKey_(product.product_name) + "|" + normalizeBulkKey_(product.brand) + "|" + normalizeBulkKey_(product.color_name);
}

function normalizeBulkKey_(value) {
  return String(value || "").toUpperCase().replace(/\s+/g, "").trim();
}

function bulkBrandCode_(value) {
  const normalized = String(value || "GLOC").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (normalized === "GLOC" || normalized === "MYSTIC" || normalized === "TITAN") return normalized;
  return (normalized || "BRAND").slice(0, 6);
}

function generateBulkProductSku_(category, brand, products, reservedSkus) {
  const prefix = category === "TINTING" ? "GL-TINT-" : category === "DETAILING" ? "GL-DET-" : "GL-PPF-";
  const brandCode = bulkBrandCode_(brand);
  const fullPrefix = prefix + brandCode + "-";
  let max = 0;
  products.forEach((product) => {
    const sku = String(product.sku || "").toUpperCase();
    if (sku.indexOf(fullPrefix) !== 0) return;
    const sequence = Number(sku.slice(fullPrefix.length));
    if (isFinite(sequence)) max = Math.max(max, sequence);
  });
  let sequence = max + 1;
  let sku = fullPrefix + String(sequence).padStart(4, "0");
  while (reservedSkus[sku]) {
    sequence += 1;
    sku = fullPrefix + String(sequence).padStart(4, "0");
  }
  return sku;
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
  const now = isoNow_();
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const sameDealer = String(values[rowIndex][codeIndex]).toUpperCase() === dealerCode;
    const isDealer = String(values[rowIndex][roleIndex]) === "dealer";
    if (sameDealer && isDealer) {
      if (!topManagerUpdated) {
        values[rowIndex][discountIndex] = discountRate;
        topManagerUpdated = true;
      } else {
        values[rowIndex][discountIndex] = "";
        clearedStaffCount += 1;
      }
      if (updatedIndex >= 0) values[rowIndex][updatedIndex] = now;
    }
  }
  if (!topManagerUpdated) throw new Error("할인율을 수정할 대리점 최상위 관리자 계정을 찾을 수 없습니다.");
  sheet.getRange(2, 1, values.length - 1, headers.length).setValues(values.slice(1));
  invalidateSheetCache_(SHEETS.accounts);
  return {
    accounts: listAccessibleAccounts_(user),
    updated_count: 1,
    cleared_staff_count: clearedStaffCount,
    frozen_order_count: frozenOrderCount
  };
}

function handleUpdateDealerCategoryPermissions_(payload, user) {
  requireAdmin_(user);
  const dealerCode = required_(payload.dealer_code, "dealer_code").toUpperCase();
  if (dealerCode === HEAD_OFFICE_CODE) throw new Error("본사 관리자 권한은 전체 카테고리로 고정됩니다.");

  const permissions = {
    can_access_ppf: payload.can_access_ppf === undefined ? true : toBool_(payload.can_access_ppf),
    can_access_tinting: payload.can_access_tinting === undefined ? true : toBool_(payload.can_access_tinting),
    can_access_detailing: payload.can_access_detailing === undefined ? false : toBool_(payload.can_access_detailing)
  };
  if (!permissions.can_access_ppf && !permissions.can_access_tinting && !permissions.can_access_detailing) {
    throw new Error("대리점에는 한 개 이상의 상품 카테고리 권한이 필요합니다.");
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.accounts);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const codeIndex = headers.indexOf("dealer_code");
  const roleIndex = headers.indexOf("role");
  const updatedIndex = headers.indexOf("updated_at");
  let updatedCount = 0;

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const sameDealer = String(values[rowIndex][codeIndex]).toUpperCase() === dealerCode;
    const isDealer = String(values[rowIndex][roleIndex]) === "dealer";
    if (!sameDealer || !isDealer) continue;
    Object.keys(permissions).forEach((key) => {
      const columnIndex = headers.indexOf(key);
      if (columnIndex >= 0) values[rowIndex][columnIndex] = permissions[key];
    });
    if (updatedIndex >= 0) values[rowIndex][updatedIndex] = isoNow_();
    updatedCount += 1;
  }
  if (!updatedCount) throw new Error("권한을 수정할 대리점 계정을 찾을 수 없습니다.");
  sheet.getRange(2, 1, values.length - 1, headers.length).setValues(values.slice(1));
  invalidateSheetCache_(SHEETS.accounts);
  return { accounts: listAccessibleAccounts_(user), updated_count: updatedCount };
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

function handleUpdateDealerProfile_(payload, user, token) {
  if (user.role !== "dealer") throw new Error("대리점 계정만 대리점 정보를 수정할 수 있습니다.");

  const profile = {
    contact_name: required_(payload.contact_name, "담당자 이름"),
    phone: required_(payload.phone, "전화번호"),
    zipcode: required_(payload.zipcode, "우편번호"),
    address: required_(payload.address, "주소"),
    address_detail: payload.address_detail || "",
    default_courier: payload.default_courier || "",
    shipping_memo: payload.shipping_memo || "",
    updated_at: isoNow_()
  };
  if (!/^\d{5}$/.test(String(profile.zipcode))) throw new Error("우편번호는 숫자 5자리여야 합니다.");

  const updatedAccounts = updateDealerProfileRows_(user.dealer_code, profile);
  upsertAgencyFromDealerProfile_(user.dealer_code, user.dealer_name, {
    contact_name: profile.contact_name,
    phone: profile.phone,
    zipcode: profile.zipcode,
    address: profile.address,
    address_detail: profile.address_detail,
    default_courier: profile.default_courier,
    shipping_memo: profile.shipping_memo,
    is_active: true,
    is_first_login: false,
    password_changed_at: user.password_changed_at || "",
    profile_completed_at: user.profile_completed_at || profile.updated_at,
    updated_at: profile.updated_at
  });
  const updatedUser = publicAccount_(findAccountByLoginId_(user.login_id));
  refreshSession_(token, updatedUser);
  return {
    session: { token: token, expires_in: SESSION_SECONDS },
    user: updatedUser,
    accounts: listAccessibleAccounts_(updatedUser),
    updated_count: updatedAccounts.length
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
  const inheritedPermissions = existingDealerAccount ? accountCategoryPermissions_(existingDealerAccount) : null;
  const categoryPermissions = role === "admin"
    ? { ppf: true, tinting: true, detailing: true }
    : inheritedPermissions || {
      ppf: payload.can_access_ppf === undefined ? true : toBool_(payload.can_access_ppf),
      tinting: payload.can_access_tinting === undefined ? true : toBool_(payload.can_access_tinting),
      detailing: payload.can_access_detailing === undefined ? false : toBool_(payload.can_access_detailing)
    };
  if (role === "dealer" && !categoryPermissions.ppf && !categoryPermissions.tinting && !categoryPermissions.detailing) {
    throw new Error("대리점에는 한 개 이상의 상품 카테고리 권한이 필요합니다.");
  }

  if (findAccountByLoginId_(loginId)) throw new Error("이미 사용 중인 아이디입니다.");

  const account = {
    login_id: loginId,
    password_hash: hashPassword_(temporaryPassword),
    dealer_code: dealerCode,
    dealer_name: dealerName,
    dealer_discount_rate: discountRate,
    can_access_ppf: categoryPermissions.ppf,
    can_access_tinting: categoryPermissions.tinting,
    can_access_detailing: categoryPermissions.detailing,
    role: role,
    is_first_login: true,
    is_active: true,
    contact_name: "",
    phone: "",
    zipcode: "",
    address: "",
    address_detail: "",
    default_courier: "",
    shipping_memo: "",
    password_changed_at: "",
    profile_completed_at: "",
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

  let changed = false;
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const sameLogin = String(values[rowIndex][loginIndex]) === String(loginId);
    const otherSubscription = String(values[rowIndex][subscriptionIndex]) !== String(currentSubscriptionId);
    if (sameLogin && otherSubscription && toBool_(values[rowIndex][activeIndex])) {
      values[rowIndex][activeIndex] = false;
      if (updatedIndex >= 0) values[rowIndex][updatedIndex] = now;
      changed = true;
    }
  }
  if (changed) {
    sheet.getRange(2, 1, values.length - 1, headers.length).setValues(values.slice(1));
    invalidateSheetCache_(SHEETS.pushSubscriptions);
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

function handleSetupRepositorySheets_(payload, user) {
  requireAdmin_(user);
  ensureRepositorySheets_();
  return {
    sheets: Object.keys(REPOSITORY_SHEET_HEADERS),
    customer_id: payload.customer_id || ""
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
  let body = order.product_name + " · " + orderStatusLabel_(order.status);
  if (order.status === "출고" || order.status === SHIPPING_REGISTERED_TEST_STATUS) {
    body += " · " + (order.courier || order.shipping_company || "택배사") + " " + (order.tracking_no || order.tracking_number || "");
  }
  return sendPushNotification_({
    title: "GLOC 발주 상태 변경",
    body: body,
    url: getSetting_("push_click_url") || getSetting_("app_public_url") || "",
    tag: "gloc-order-update-" + order.order_id
  }, { role: "dealer", dealer_code: order.dealer_code });
}

function orderStatusLabel_(status) {
  if (status === SHIPPING_REGISTERED_TEST_STATUS) return "승인 · 테스트송장";
  return status || "";
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

function createRequestContext_(action) {
  return {
    action: action || "",
    rows: {},
    sources: {}
  };
}

function sheetCacheTtl_(sheetName) {
  return Number(SHEET_CACHE_TTL_SECONDS[sheetName] || 0);
}

function sheetCacheBaseKey_(sheetName) {
  return "sheet-rows:" + encodeURIComponent(String(sheetName));
}

function readSheetCache_(sheetName) {
  if (!sheetCacheTtl_(sheetName)) return null;
  const cache = CacheService.getScriptCache();
  const baseKey = sheetCacheBaseKey_(sheetName);
  const metaRaw = cache.get(baseKey + ":meta");
  if (!metaRaw) return null;

  try {
    const chunkCount = Number(JSON.parse(metaRaw).chunkCount || 0);
    if (!chunkCount || chunkCount > MAX_CACHE_CHUNKS) return null;
    const keys = [];
    for (let index = 0; index < chunkCount; index += 1) keys.push(baseKey + ":" + index);
    const chunks = cache.getAll(keys);
    const json = keys.map((key) => chunks[key] || "").join("");
    return json ? JSON.parse(json) : null;
  } catch (error) {
    invalidateSheetCache_(sheetName);
    return null;
  }
}

function writeSheetCache_(sheetName, rows) {
  const ttl = sheetCacheTtl_(sheetName);
  if (!ttl) return;
  const json = JSON.stringify(rows || []);
  const chunks = [];
  for (let offset = 0; offset < json.length; offset += CACHE_CHUNK_SIZE) {
    chunks.push(json.slice(offset, offset + CACHE_CHUNK_SIZE));
  }
  if (!chunks.length || chunks.length > MAX_CACHE_CHUNKS) return;

  const baseKey = sheetCacheBaseKey_(sheetName);
  const entries = {};
  chunks.forEach((chunk, index) => {
    entries[baseKey + ":" + index] = chunk;
  });
  entries[baseKey + ":meta"] = JSON.stringify({ chunkCount: chunks.length });
  CacheService.getScriptCache().putAll(entries, ttl);
}

function invalidateSheetCache_(sheetNames) {
  const names = Array.isArray(sheetNames) ? sheetNames : [sheetNames];
  const keys = [];
  names.filter(Boolean).forEach((sheetName) => {
    delete REQUEST_CONTEXT.rows[sheetName];
    delete REQUEST_CONTEXT.sources[sheetName];
    const baseKey = sheetCacheBaseKey_(sheetName);
    keys.push(baseKey + ":meta");
    for (let index = 0; index < MAX_CACHE_CHUNKS; index += 1) keys.push(baseKey + ":" + index);
  });
  const cache = CacheService.getScriptCache();
  for (let offset = 0; offset < keys.length; offset += 100) {
    cache.removeAll(keys.slice(offset, offset + 100));
  }
}

function rowObjectFromValues_(headers, row) {
  const item = {};
  headers.forEach((header, index) => {
    item[header] = formatCell_(row[index]);
  });
  return item;
}

function logPerformance_(action, startedAt) {
  const sourceCounts = {};
  Object.keys(REQUEST_CONTEXT.sources || {}).forEach((sheetName) => {
    const source = REQUEST_CONTEXT.sources[sheetName] || "unknown";
    sourceCounts[source] = Number(sourceCounts[source] || 0) + 1;
  });
  Logger.log(JSON.stringify({
    type: "api_performance",
    action: action || "unknown",
    durationMs: Date.now() - startedAt,
    sources: sourceCounts
  }));
}

function ensureSheets_() {
  Object.keys(SHEETS).forEach((key) => ensureSheet_(SHEETS[key], HEADERS[key]));
  ensureCategoryData_();
  ensureProductDefaultPrices_();
  ensureOrderPriceSnapshots_();
  ensurePasswordSalt_();
  invalidateSheetCache_(Object.keys(SHEETS).map((key) => SHEETS[key]));
}

function ensureSheetsReady_() {
  const cache = CacheService.getScriptCache();
  const cacheKey = "schema-ready:" + SCHEMA_CACHE_VERSION;
  if (cache.get(cacheKey)) return;

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (!cache.get(cacheKey)) {
      ensureSheets_();
      cache.put(cacheKey, "1", SCHEMA_CACHE_SECONDS);
    }
  } finally {
    lock.releaseLock();
  }
}

function ensureCategoryData_() {
  const productSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.products);
  const productValues = productSheet.getDataRange().getValues();
  const productHeaders = productValues[0].map(String);
  const productCategoryIndex = productHeaders.indexOf("category");
  const productSkuIndex = productHeaders.indexOf("sku");
  const productNameIndex = productHeaders.indexOf("product_name");
  const productsBySku = {};
  let productCategoriesChanged = false;

  for (let rowIndex = 1; rowIndex < productValues.length; rowIndex += 1) {
    if (!productValues[rowIndex].some((cell) => cell !== "")) continue;
    const product = {
      sku: productValues[rowIndex][productSkuIndex],
      product_name: productValues[rowIndex][productNameIndex]
    };
    const category = normalizeProductCategory_(productValues[rowIndex][productCategoryIndex], product);
    productsBySku[String(product.sku)] = category;
    if (String(productValues[rowIndex][productCategoryIndex] || "") !== category) {
      productValues[rowIndex][productCategoryIndex] = category;
      productCategoriesChanged = true;
    }
  }
  if (productCategoriesChanged && productValues.length > 1) {
    productSheet.getRange(2, productCategoryIndex + 1, productValues.length - 1, 1)
      .setValues(productValues.slice(1).map((row) => [row[productCategoryIndex]]));
  }

  const accountSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.accounts);
  const accountValues = accountSheet.getDataRange().getValues();
  const accountHeaders = accountValues[0].map(String);
  const accountRoleIndex = accountHeaders.indexOf("role");
  const accountPermissionIndexes = {
    can_access_ppf: accountHeaders.indexOf("can_access_ppf"),
    can_access_tinting: accountHeaders.indexOf("can_access_tinting"),
    can_access_detailing: accountHeaders.indexOf("can_access_detailing")
  };
  const changedAccountPermissionKeys = {};
  for (let rowIndex = 1; rowIndex < accountValues.length; rowIndex += 1) {
    if (!accountValues[rowIndex].some((cell) => cell !== "")) continue;
    const isAdmin = String(accountValues[rowIndex][accountRoleIndex]) === "admin";
    const defaults = { can_access_ppf: true, can_access_tinting: true, can_access_detailing: isAdmin };
    Object.keys(accountPermissionIndexes).forEach((key) => {
      const columnIndex = accountPermissionIndexes[key];
      if (columnIndex >= 0 && (accountValues[rowIndex][columnIndex] === "" || accountValues[rowIndex][columnIndex] === undefined)) {
        accountValues[rowIndex][columnIndex] = defaults[key];
        changedAccountPermissionKeys[key] = true;
      }
    });
  }
  Object.keys(changedAccountPermissionKeys).forEach((key) => {
    const columnIndex = accountPermissionIndexes[key];
    accountSheet.getRange(2, columnIndex + 1, accountValues.length - 1, 1)
      .setValues(accountValues.slice(1).map((row) => [row[columnIndex]]));
  });

  const orderSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.orders);
  const orderValues = orderSheet.getDataRange().getValues();
  const orderHeaders = orderValues[0].map(String);
  const orderSkuIndex = orderHeaders.indexOf("sku");
  const orderCategoryIndex = orderHeaders.indexOf("product_category");
  let orderCategoriesChanged = false;
  for (let rowIndex = 1; rowIndex < orderValues.length; rowIndex += 1) {
    if (!orderValues[rowIndex].some((cell) => cell !== "")) continue;
    if (orderValues[rowIndex][orderCategoryIndex] !== "") continue;
    const category = productsBySku[String(orderValues[rowIndex][orderSkuIndex])] || "PPF";
    orderValues[rowIndex][orderCategoryIndex] = category;
    orderCategoriesChanged = true;
  }
  if (orderCategoriesChanged && orderValues.length > 1) {
    orderSheet.getRange(2, orderCategoryIndex + 1, orderValues.length - 1, 1)
      .setValues(orderValues.slice(1).map((row) => [row[orderCategoryIndex]]));
  }
}

function ensureRepositorySheets_() {
  Object.keys(REPOSITORY_SHEET_HEADERS).forEach((name) => ensureSheet_(name, REPOSITORY_SHEET_HEADERS[name]));
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
  if (REQUEST_CONTEXT.rows[sheetName]) {
    REQUEST_CONTEXT.sources[sheetName] = "request_memory";
    return REQUEST_CONTEXT.rows[sheetName];
  }

  const cached = readSheetCache_(sheetName);
  if (cached) {
    REQUEST_CONTEXT.rows[sheetName] = cached;
    REQUEST_CONTEXT.sources[sheetName] = "cache";
    return cached;
  }

  const rows = readRowsDirect_(sheetName);
  REQUEST_CONTEXT.rows[sheetName] = rows;
  REQUEST_CONTEXT.sources[sheetName] = "google_sheets";
  writeSheetCache_(sheetName, rows);
  return rows;
}

function readRowsDirect_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
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
  appendObjects_(sheetName, [object]);
}

function appendObjects_(sheetName, objects) {
  if (!objects || !objects.length) return;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const rows = objects.map((object) => headers.map((header) => object[header] === undefined ? "" : object[header]));
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);
  invalidateSheetCache_(sheetName);
}

function headersForSheet_(sheetName) {
  const sheetKey = Object.keys(SHEETS).find((key) => SHEETS[key] === sheetName || key === sheetName);
  if (!sheetKey || !HEADERS[sheetKey]) throw new Error("시트 헤더를 찾을 수 없습니다: " + sheetName);
  return HEADERS[sheetKey];
}

function findRowNumbersByKey_(sheet, headers, key, value) {
  const keyIndex = headers.indexOf(key);
  if (keyIndex === -1) throw new Error("키 컬럼이 없습니다: " + key);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  return sheet.getRange(2, keyIndex + 1, lastRow - 1, 1)
    .createTextFinder(String(value))
    .matchEntireCell(true)
    .findAll()
    .map((range) => range.getRow());
}

function updateRowByKey_(sheetName, key, value, updates) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error("시트를 찾을 수 없습니다: " + sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const rowNumber = findRowNumbersByKey_(sheet, headers, key, value)[0];
  if (!rowNumber) throw new Error("수정할 행을 찾을 수 없습니다.");

  const row = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  Object.keys(updates).forEach((field) => {
    const colIndex = headers.indexOf(field);
    if (colIndex >= 0) row[colIndex] = updates[field];
  });
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
  invalidateSheetCache_(sheetName);
  return rowObjectFromValues_(headers, row);
}

function deleteRowsByKey_(sheetName, key, value) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return 0;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const rowNumbers = findRowNumbersByKey_(sheet, headers, key, value).sort((a, b) => b - a);
  rowNumbers.forEach((rowNumber) => sheet.deleteRow(rowNumber));
  if (rowNumbers.length) invalidateSheetCache_(sheetName);
  return rowNumbers.length;
}

function upsertInventoryRow_(dealerCode, sku, object) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.inventory);
  if (!sheet) throw new Error("재고현황 시트를 찾을 수 없습니다.");
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const dealerIndex = headers.indexOf("dealer_code");
  const skuIndex = headers.indexOf("sku");
  if (dealerIndex === -1 || skuIndex === -1) throw new Error("재고현황 시트에 dealer_code 또는 sku 컬럼이 없습니다.");

  const lastRow = sheet.getLastRow();
  const matchingSkuRows = lastRow < 2
    ? []
    : sheet.getRange(2, skuIndex + 1, lastRow - 1, 1)
      .createTextFinder(String(sku))
      .matchEntireCell(true)
      .findAll()
      .map((range) => range.getRow());

  for (let index = 0; index < matchingSkuRows.length; index += 1) {
    const rowNumber = matchingSkuRows[index];
    const row = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
    if (String(row[dealerIndex]).toUpperCase() === String(dealerCode).toUpperCase()) {
      headers.forEach((header, index) => {
        if (object[header] !== undefined) row[index] = object[header];
      });
      sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
      invalidateSheetCache_(SHEETS.inventory);
      return rowObjectFromValues_(headers, row);
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
  let retailChanged = false;
  let purchaseChanged = false;

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const hasContent = values[rowIndex].some((cell) => cell !== "");
    if (!hasContent) continue;
    const retailValue = Number(values[rowIndex][retailIndex] || 0);
    const purchaseValue = Number(values[rowIndex][purchaseIndex] || 0);
    if (!retailValue) {
      values[rowIndex][retailIndex] = DEFAULT_RETAIL_PRICE;
      retailChanged = true;
    }
    if (!purchaseValue) {
      values[rowIndex][purchaseIndex] = DEFAULT_PURCHASE_PRICE;
      purchaseChanged = true;
    }
  }
  if (retailChanged) {
    sheet.getRange(2, retailIndex + 1, values.length - 1, 1)
      .setValues(values.slice(1).map((row) => [row[retailIndex]]));
  }
  if (purchaseChanged) {
    sheet.getRange(2, purchaseIndex + 1, values.length - 1, 1)
      .setValues(values.slice(1).map((row) => [row[purchaseIndex]]));
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
  let changed = false;

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

    values[rowIndex][retailIndex] = unitRetailPrice;
    values[rowIndex][discountIndex] = discountRate;
    values[rowIndex][saleIndex] = unitSalePrice;
    values[rowIndex][purchaseIndex] = unitPurchasePrice;
    changed = true;
  }
  if (changed) {
    [retailIndex, discountIndex, saleIndex, purchaseIndex].forEach((columnIndex) => {
      sheet.getRange(2, columnIndex + 1, values.length - 1, 1)
        .setValues(values.slice(1).map((row) => [row[columnIndex]]));
    });
  }
}

function findAccountByLoginId_(loginId) {
  return readRows_(SHEETS.accounts).find((account) => String(account.login_id).toLowerCase() === String(loginId).toLowerCase());
}

function updateAccount_(loginId, updates) {
  return updateRowByKey_(SHEETS.accounts, "login_id", loginId, updates);
}

function updateDealerProfileRows_(dealerCode, updates) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.accounts);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const codeIndex = headers.indexOf("dealer_code");
  const roleIndex = headers.indexOf("role");
  if (codeIndex === -1 || roleIndex === -1) throw new Error("대리점관리 시트에 dealer_code 또는 role 컬럼이 없습니다.");

  const updatedLogins = [];
  let changed = false;
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const sameDealer = String(values[rowIndex][codeIndex]).toUpperCase() === String(dealerCode).toUpperCase();
    const isDealer = String(values[rowIndex][roleIndex]) === "dealer";
    if (!sameDealer || !isDealer) continue;
    Object.keys(updates).forEach((field) => {
      const colIndex = headers.indexOf(field);
      if (colIndex >= 0) values[rowIndex][colIndex] = updates[field];
    });
    changed = true;
    const loginIndex = headers.indexOf("login_id");
    if (loginIndex >= 0) updatedLogins.push(String(values[rowIndex][loginIndex]));
  }
  if (!updatedLogins.length) throw new Error("수정할 대리점 계정을 찾을 수 없습니다.");
  if (changed) {
    sheet.getRange(2, 1, values.length - 1, headers.length).setValues(values.slice(1));
    invalidateSheetCache_(SHEETS.accounts);
  }
  return readRows_(SHEETS.accounts).filter((account) => updatedLogins.indexOf(String(account.login_id)) >= 0);
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
  const categoryPermissions = accountCategoryPermissions_(account);
  return {
    login_id: account.login_id,
    dealer_code: account.dealer_code,
    dealer_name: account.dealer_name,
    dealer_discount_rate: Number(account.dealer_discount_rate || 0),
    can_access_ppf: categoryPermissions.ppf,
    can_access_tinting: categoryPermissions.tinting,
    can_access_detailing: categoryPermissions.detailing,
    category_permissions: categoryPermissions,
    role: account.role,
    is_first_login: toBool_(account.is_first_login),
    is_active: toBool_(account.is_active),
    contact_name: account.contact_name || "",
    phone: account.phone || "",
    zipcode: account.zipcode || "",
    address: account.address || "",
    address_detail: account.address_detail || "",
    default_courier: account.default_courier || "",
    shipping_memo: account.shipping_memo || "",
    password_changed_at: account.password_changed_at || "",
    profile_completed_at: account.profile_completed_at || "",
    updated_at: account.updated_at || ""
  };
}

function publicProduct_(product) {
  return {
    sku: product.sku,
    product_name: product.product_name,
    category: normalizeProductCategory_(product.category, product),
    brand: product.brand || "GLOC",
    product_code: product.product_code || product.sku,
    color: product.color_name || inferColor_(product.product_name),
    color_name: product.color_name || inferColor_(product.product_name),
    color_hex: product.color_hex || "",
    color_chart_image_url: product.color_chart_image_url || "",
    finish_type: product.finish_type || "",
    transparency_type: product.transparency_type || "",
    opacity: product.opacity === undefined || product.opacity === null ? "" : product.opacity,
    shade_percent: product.shade_percent === undefined || product.shade_percent === null ? "" : product.shade_percent,
    available_parts: product.available_parts || "",
    description: product.description || "",
    unit: product.unit,
    retail_price: productRetailPrice_(product),
    purchase_price: productPurchasePrice_(product),
    is_active: toBool_(product.is_active),
    main_category: product.main_category || "",
    sub_category: product.sub_category || "",
    brand_line: product.brand_line || "",
    product_name_code: product.product_name_code || "",
    lineup: product.lineup || "",
    purpose: product.purpose || "",
    created_at: product.created_at || "",
    updated_at: product.updated_at || ""
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
    category: normalizeProductCategory_(product.category, product),
    color: product.color_name || inferColor_(productName),
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

function normalizeProductCategory_(value, product) {
  const category = String(value || "").trim().toUpperCase();
  if (category === "TINTING" || category === "틴팅" || category.indexOf("TINT") >= 0) return "TINTING";
  if (category === "DETAILING" || category === "디테일링" || category.indexOf("DETAIL") >= 0) return "DETAILING";
  if (category === "PPF" || category.indexOf("PPF") >= 0) return "PPF";

  const searchText = [
    product && product.product_name,
    product && product.name,
    product && product.sku,
    product && product.product_code
  ].filter(Boolean).join(" ").toLowerCase();
  if (searchText.indexOf("틴팅") >= 0 || searchText.indexOf("tint") >= 0 || /^tn[-_]/i.test(searchText)) return "TINTING";
  if (searchText.indexOf("디테일링") >= 0 || searchText.indexOf("detail") >= 0 || /^dt[-_]/i.test(searchText)) return "DETAILING";
  return "PPF";
}

function accountCategoryPermissions_(account) {
  if (!account || account.role === "admin") return { ppf: true, tinting: true, detailing: true };
  return {
    ppf: categoryPermissionValue_(account.can_access_ppf, true),
    tinting: categoryPermissionValue_(account.can_access_tinting, true),
    detailing: categoryPermissionValue_(account.can_access_detailing, false)
  };
}

function categoryPermissionValue_(value, fallback) {
  return value === "" || value === undefined || value === null ? fallback : toBool_(value);
}

function canAccessCategory_(user, category) {
  if (!user || user.role === "admin") return true;
  const normalized = normalizeProductCategory_(category, {});
  const permissions = accountCategoryPermissions_(user);
  if (normalized === "PPF") return permissions.ppf;
  if (normalized === "TINTING") return permissions.tinting;
  if (normalized === "DETAILING") return permissions.detailing;
  return false;
}

function requireCategoryAccess_(user, category, message) {
  if (!canAccessCategory_(user, category)) throw new Error(message || "해당 카테고리 상품을 주문할 권한이 없습니다.");
}

function orderProductCategory_(order, productMap) {
  const product = productMap && productMap[order.sku] ? productMap[order.sku] : {};
  return normalizeProductCategory_(order.product_category || product.category, {
    product_name: order.product_name || product.product_name,
    sku: order.sku || product.sku,
    product_code: product.product_code
  });
}

function requireOrderCategoryAccess_(user, order) {
  const productMap = mapBy_(readRows_(SHEETS.products), "sku");
  requireCategoryAccess_(user, orderProductCategory_(order, productMap));
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

function setSettings_(updates) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.settings);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const keyIndex = headers.indexOf("key");
  const valueIndex = headers.indexOf("value");
  if (keyIndex === -1 || valueIndex === -1) throw new Error("settings 시트에 key 또는 value 컬럼이 없습니다.");

  const pending = Object.assign({}, updates || {});
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const key = String(values[rowIndex][keyIndex]);
    if (!Object.prototype.hasOwnProperty.call(pending, key)) continue;
    values[rowIndex][valueIndex] = pending[key];
    delete pending[key];
  }
  Object.keys(pending).forEach((key) => {
    values.push(headers.map((header) => {
      if (header === "key") return key;
      if (header === "value") return pending[key];
      return "";
    }));
  });

  sheet.getRange(1, 1, values.length, headers.length).setValues(values);
  invalidateSheetCache_(SHEETS.settings);
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
    can_access_ppf: true,
    can_access_tinting: true,
    can_access_detailing: true,
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
    can_access_ppf: true,
    can_access_tinting: true,
    can_access_detailing: false,
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

function seedVehiclesIfEmpty_() {
  if (readRows_(SHEETS.vehicles).length) return;
  const now = isoNow_();
  [
    ["tesla-model3-legacy", "Tesla", "Model 3", "Legacy", "M3-L", "2017-2023", "sedan", "Pearl White", "/models/tesla/model3-legacy.glb"],
    ["tesla-model3-highland", "Tesla", "Model 3", "Highland", "M3-H", "2024-", "sedan", "Pearl White", "/models/tesla/model3-highland.glb"],
    ["tesla-modely-legacy", "Tesla", "Model Y", "Legacy", "MY-L", "2020-2024", "suv", "Pearl White", "/models/tesla/modely-legacy.glb"],
    ["tesla-modely-juniper", "Tesla", "Model Y", "Juniper", "MY-J", "2025-", "suv", "Pearl White", "/models/tesla/modely-juniper.glb"],
    ["tesla-models", "Tesla", "Model S", "Current", "MS", "2021-", "sedan", "Pearl White", "/models/tesla/models.glb"],
    ["tesla-modelx", "Tesla", "Model X", "Current", "MX", "2021-", "suv", "Pearl White", "/models/tesla/modelx.glb"],
    ["tesla-cybertruck", "Tesla", "Cybertruck", "Foundation", "CT", "2024-", "truck", "Quicksilver", "/models/tesla/cybertruck.glb"]
  ].forEach((row) => {
    appendObject_(SHEETS.vehicles, {
      id: row[0],
      brand: row[1],
      model_name: row[2],
      generation_name: row[3],
      facelift_type: row[3],
      body_code: row[4],
      model_year: row[5],
      vehicle_type: row[6],
      default_color: row[7],
      thumbnail_url: "",
      image_mode_enabled: true,
      three_d_enabled: row[0] === "tesla-model3-highland",
      glb_file_url: row[8],
      created_at: now,
      updated_at: now,
      is_active: true
    });
  });
}

function ensureInventoryForOwner_(dealerCode, dealerName) {
  const products = readRows_(SHEETS.products).filter((row) => toBool_(row.is_active));
  const inventory = readRows_(SHEETS.inventory);
  const missingRows = products.map((product) => {
    const exists = inventory.some((row) => row.dealer_code === dealerCode && row.sku === product.sku);
    if (exists) return null;
    return {
      dealer_code: dealerCode,
      product_name: product.product_name,
      sku: product.sku,
      stock_qty: 0,
      safety_stock: 0,
      location: dealerName + " 창고",
      updated_at: isoNow_()
    };
  }).filter(Boolean);
  appendObjects_(SHEETS.inventory, missingRows);
}

function seedInventoryForDealer_(dealerCode, dealerName) {
  const existing = readRows_(SHEETS.inventory).some((row) => row.dealer_code === dealerCode);
  if (existing) return;
  const products = readRows_(SHEETS.products).filter((row) => toBool_(row.is_active));
  appendObjects_(SHEETS.inventory, products.map((product, index) => ({
      dealer_code: dealerCode,
      product_name: product.product_name,
      sku: product.sku,
      stock_qty: 0,
      safety_stock: 80 + (index % 5) * 10,
      location: dealerName + " 창고",
      updated_at: isoNow_()
    })));
}

function seedInventoryForProduct_(product) {
  seedInventoryForProducts_([product]);
}

function seedInventoryForProducts_(products) {
  if (!products || !products.length) return;
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
  const inventoryKeys = {};
  inventory.forEach((row) => {
    inventoryKeys[String(row.dealer_code || "").toUpperCase() + "|" + String(row.sku || "").toUpperCase()] = true;
  });
  const missingRows = [];
  products.forEach((product) => {
    accounts.forEach((account) => {
      const key = String(account.dealer_code || "").toUpperCase() + "|" + String(product.sku || "").toUpperCase();
      if (inventoryKeys[key]) return;
      inventoryKeys[key] = true;
      missingRows.push({
        dealer_code: account.dealer_code,
        product_name: product.product_name,
        sku: product.sku,
        stock_qty: 0,
        safety_stock: 0,
        location: account.dealer_name + " 창고",
        updated_at: isoNow_()
      });
    });
  });
  appendObjects_(SHEETS.inventory, missingRows);
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

function dealerProfileForCode_(dealerCode) {
  const accounts = readRows_(SHEETS.accounts).filter((account) => (
    account.role === "dealer" &&
    String(account.dealer_code).toUpperCase() === String(dealerCode).toUpperCase()
  ));
  return accounts.find((account) => (
    account.contact_name ||
    account.phone ||
    account.zipcode ||
    account.address ||
    account.address_detail ||
    account.default_courier ||
    account.shipping_memo
  )) || accounts[0] || {};
}

function agencyForOrder_(order) {
  ensureSheet_("Agencies", REPOSITORY_SHEET_HEADERS.Agencies);
  const agencyId = String(order.agency_id || order.dealer_code || "").toUpperCase();
  const dealerCode = String(order.dealer_code || agencyId).toUpperCase();
  const agency = readRows_("Agencies").find((row) => {
    if (row.is_active !== "" && !toBool_(row.is_active)) return false;
    return (
      String(row.id || "").toUpperCase() === agencyId ||
      String(row.dealer_id || "").toUpperCase() === agencyId ||
      String(row.dealer_id || "").toUpperCase() === dealerCode
    );
  }) || {};
  const profile = dealerProfileForCode_(dealerCode);
  return {
    id: agency.id || agencyId || dealerCode,
    dealer_id: agency.dealer_id || dealerCode,
    agency_name: agency.agency_name || profile.dealer_name || order.dealer_name || dealerCode,
    contact_name: agency.contact_name || profile.contact_name || "",
    phone: agency.phone || profile.phone || "",
    zipcode: agency.zipcode || profile.zipcode || "",
    address: agency.address || profile.address || "",
    address_detail: agency.address_detail || profile.address_detail || "",
    default_courier: agency.default_courier || profile.default_courier || "",
    shipping_memo: agency.shipping_memo || profile.shipping_memo || "",
    is_active: agency.is_active === "" ? true : toBool_(agency.is_active),
    is_first_login: agency.is_first_login || profile.is_first_login || "",
    password_changed_at: agency.password_changed_at || profile.password_changed_at || "",
    profile_completed_at: agency.profile_completed_at || profile.profile_completed_at || "",
    updated_at: agency.updated_at || profile.updated_at || ""
  };
}

function upsertAgencyFromDealerProfile_(dealerCode, dealerName, profile) {
  ensureSheet_("Agencies", REPOSITORY_SHEET_HEADERS.Agencies);
  const normalizedCode = String(dealerCode || "").toUpperCase();
  const agency = {
    id: normalizedCode,
    dealer_id: normalizedCode,
    agency_name: dealerName || normalizedCode,
    contact_name: profile.contact_name || "",
    phone: profile.phone || "",
    zipcode: profile.zipcode || "",
    address: profile.address || "",
    address_detail: profile.address_detail || "",
    default_courier: profile.default_courier || "",
    shipping_memo: profile.shipping_memo || "",
    is_active: profile.is_active === undefined ? true : profile.is_active,
    is_first_login: profile.is_first_login === undefined ? false : profile.is_first_login,
    password_changed_at: profile.password_changed_at || "",
    profile_completed_at: profile.profile_completed_at || "",
    updated_at: profile.updated_at || isoNow_()
  };
  const existing = readRows_("Agencies").find((row) => (
    String(row.id || "").toUpperCase() === normalizedCode ||
    String(row.dealer_id || "").toUpperCase() === normalizedCode
  ));
  if (existing && existing.id) return updateRowByKey_("Agencies", "id", existing.id, agency);
  if (existing && existing.dealer_id) return updateRowByKey_("Agencies", "dealer_id", existing.dealer_id, agency);
  appendObject_("Agencies", agency);
  return agency;
}

function applyDealerProfileToOrderUpdates_(order, updates) {
  const profile = agencyForOrder_(order);
  updates.recipient_name = profile.contact_name || "";
  updates.recipient_phone = profile.phone || "";
  updates.recipient_zipcode = profile.zipcode || "";
  updates.recipient_address = profile.address || "";
  updates.recipient_address_detail = profile.address_detail || "";
  updates.default_courier = profile.default_courier || "";
  updates.shipping_memo = profile.shipping_memo || "";
}

function registerTestShippingForOrder_(order, updates) {
  const agency = agencyForOrder_(order);
  validateAgencyShippingInfo_(agency);
  applyDealerProfileToOrderUpdates_(order, updates);

  const existingTrackingNo = order.tracking_no || order.tracking_number;
  const shipment = existingTrackingNo
    ? {
        courier: order.courier || order.shipping_company || "우체국택배",
        tracking_no: existingTrackingNo,
        shipping_receipt_no: order.shipping_receipt_no || "MOCK-RCPT-" + compactDateValue_() + "-" + randomDigits_(6)
      }
    : mockKoreaPostAdapter_(order, agency);

  updates.status = SHIPPING_REGISTERED_TEST_STATUS;
  updates.courier = shipment.courier;
  updates.tracking_no = shipment.tracking_no;
  updates.shipping_receipt_no = shipment.shipping_receipt_no;
  updates.approved_at = order.approved_at || isoNow_();
  updates.shipping_error = "";
  updates.shipping_company = shipment.courier;
  updates.tracking_number = shipment.tracking_no;
}

function mockKoreaPostAdapter_(order, agency) {
  validateAgencyShippingInfo_(agency);
  // 테스트 모드 전용: 실제 우체국 API를 호출하지 않고 송장 형식만 생성합니다.
  const date = compactDateValue_();
  const random = randomDigits_(6);
  return {
    courier: "우체국택배",
    tracking_no: "TEST-KP-" + date + "-" + random,
    shipping_receipt_no: "MOCK-RCPT-" + date + "-" + random,
    order_id: order.order_id
  };
}

function validateAgencyShippingInfo_(agency) {
  const missing = [];
  if (!String(agency.contact_name || "").trim()) missing.push("담당자 이름");
  if (!String(agency.phone || "").trim()) missing.push("전화번호");
  if (!String(agency.zipcode || "").trim()) missing.push("우편번호");
  if (!String(agency.address || "").trim()) missing.push("주소");
  if (missing.length) throw new Error("배송정보가 부족합니다: " + missing.join(", "));
  if (!/^\d{5}$/.test(String(agency.zipcode))) throw new Error("우편번호는 숫자 5자리여야 합니다.");
}

function clearTestShippingFromOrderUpdates_(updates) {
  updates.courier = "";
  updates.tracking_no = "";
  updates.shipping_receipt_no = "";
  updates.shipping_error = "";
  updates.approved_at = "";
  updates.shipping_company = "";
  updates.tracking_number = "";
  updates.print_status = "";
  updates.printed_at = "";
  updates.print_count = 0;
}

function clearDealerProfileFromOrderUpdates_(updates) {
  updates.recipient_name = "";
  updates.recipient_phone = "";
  updates.recipient_zipcode = "";
  updates.recipient_address = "";
  updates.recipient_address_detail = "";
  updates.default_courier = "";
  updates.shipping_memo = "";
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

    values[rowIndex][retailIndex] = unitRetailPrice;
    values[rowIndex][discountIndex] = orderDiscountRate;
    values[rowIndex][saleIndex] = unitSalePrice;
    values[rowIndex][purchaseIndex] = unitPurchasePrice;
    frozenCount += 1;
  }
  if (frozenCount) {
    sheet.getRange(2, 1, values.length - 1, headers.length).setValues(values.slice(1));
    invalidateSheetCache_(SHEETS.orders);
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

function makeCommunicationId_(prefix) {
  return String(prefix || "ID") + "-" + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function sameCode_(left, right) {
  return String(left || "").toUpperCase() === String(right || "").toUpperCase();
}

function visibleNoticesForUser_(user) {
  return readRows_(SHEETS.notices)
    .filter((notice) => {
      if (!toBool_(notice.is_active)) return false;
      if (user.role === "admin") return true;
      return isNoticeTargetDealer_(user, notice);
    })
    .sort((a, b) => {
      const pinned = Number(toBool_(b.is_pinned)) - Number(toBool_(a.is_pinned));
      return pinned || String(b.created_at || "").localeCompare(String(a.created_at || ""));
    });
}

function requireAccessibleNotice_(noticeId, user) {
  const notice = visibleNoticesForUser_(user).find((row) => row.id === noticeId);
  if (!notice) throw new Error("확인할 수 없는 공지사항입니다.");
  return notice;
}

function noticeTargetIds_(notice) {
  return String(notice.target_dealer_ids || "")
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
}

function isNoticeTargetDealer_(dealer, notice) {
  if (!dealer || String(dealer.role || "").toLowerCase() !== "dealer") return false;
  const targets = noticeTargetIds_(notice);
  if (targets.length) {
    const dealerCode = String(dealer.dealer_code || dealer.dealerId || "").toUpperCase();
    const loginId = String(dealer.login_id || "").toUpperCase();
    return targets.indexOf(dealerCode) >= 0 || targets.indexOf(loginId) >= 0;
  }
  const category = String(notice.target_category || "ALL").toUpperCase();
  return category === "ALL" || canAccessCategory_(dealer, category);
}

function upsertNoticeRead_(noticeId, user, dismissType, dismissUntil) {
  const now = isoNow_();
  const existing = readRows_(SHEETS.noticeReads).find((row) => row.notice_id === noticeId && row.login_id === user.login_id);
  const isReadAction = String(dismissType || "READ").toUpperCase() === "READ";
  const values = {
    notice_id: noticeId,
    login_id: user.login_id,
    dealer_code: user.dealer_code,
    read_at: isReadAction ? now : (existing ? existing.read_at || "" : ""),
    dismiss_type: dismissType || "READ",
    dismiss_until: dismissUntil || "",
    updated_at: now
  };
  if (existing) return updateRowByKey_(SHEETS.noticeReads, "id", existing.id, values);
  const row = { id: makeCommunicationId_("NTR"), ...values, created_at: now };
  appendObject_(SHEETS.noticeReads, row);
  return row;
}

function activeDealerAccountsByCode_() {
  const unique = {};
  readRows_(SHEETS.accounts)
    .filter((account) => String(account.role || "").toLowerCase() === "dealer" && toBool_(account.is_active))
    .forEach((account) => {
      const dealerCode = String(account.dealer_code || "").toUpperCase();
      if (!dealerCode) return;
      if (!unique[dealerCode]) unique[dealerCode] = account;
      else {
        unique[dealerCode].can_access_ppf = toBool_(unique[dealerCode].can_access_ppf) || toBool_(account.can_access_ppf);
        unique[dealerCode].can_access_tinting = toBool_(unique[dealerCode].can_access_tinting) || toBool_(account.can_access_tinting);
        unique[dealerCode].can_access_detailing = toBool_(unique[dealerCode].can_access_detailing) || toBool_(account.can_access_detailing);
      }
    });
  return Object.keys(unique).map((key) => unique[key]);
}

function notificationValues_(values) {
  return {
    id: values.id || makeCommunicationId_("NTF"),
    type: String(values.type || "SYSTEM").toUpperCase(),
    target_role: String(values.target_role || "").toUpperCase(),
    target_dealer_id: String(values.target_dealer_id || "").toUpperCase(),
    title: values.title || "",
    message: values.message || "",
    ref_type: String(values.ref_type || "").toUpperCase(),
    ref_id: values.ref_id || "",
    is_read: values.is_read === undefined ? false : toBool_(values.is_read),
    read_at: values.read_at || "",
    created_at: values.created_at || isoNow_()
  };
}

function ensureNotification_(values) {
  const normalized = notificationValues_(values);
  const existing = readRows_(SHEETS.notifications).find((row) => (
    String(row.type).toUpperCase() === normalized.type
    && String(row.target_role).toUpperCase() === normalized.target_role
    && sameCode_(row.target_dealer_id, normalized.target_dealer_id)
    && String(row.ref_type).toUpperCase() === normalized.ref_type
    && String(row.ref_id) === String(normalized.ref_id)
  ));
  if (existing) return existing;
  appendObject_(SHEETS.notifications, normalized);
  return normalized;
}

function createOrRefreshNotification_(values) {
  const normalized = notificationValues_(values);
  const existing = readRows_(SHEETS.notifications).find((row) => (
    String(row.type).toUpperCase() === normalized.type
    && String(row.target_role).toUpperCase() === normalized.target_role
    && sameCode_(row.target_dealer_id, normalized.target_dealer_id)
    && String(row.ref_type).toUpperCase() === normalized.ref_type
    && String(row.ref_id) === String(normalized.ref_id)
  ));
  if (!existing) {
    appendObject_(SHEETS.notifications, normalized);
    return normalized;
  }
  return updateRowByKey_(SHEETS.notifications, "id", existing.id, {
    title: normalized.title,
    message: normalized.message,
    is_read: false,
    read_at: "",
    created_at: normalized.created_at
  });
}

function notificationsForUser_(user) {
  return readRows_(SHEETS.notifications)
    .filter((row) => {
      const targetRole = String(row.target_role || "").toUpperCase();
      if (user.role === "admin") return targetRole === "ADMIN";
      return targetRole === "DEALER" && sameCode_(row.target_dealer_id, user.dealer_code);
    })
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

function markNotificationsReadByReference_(user, refType, refId, types) {
  const allowedTypes = (types || []).map((value) => String(value).toUpperCase());
  const rows = notificationsForUser_(user).filter((row) => (
    String(row.ref_type || "").toUpperCase() === String(refType || "").toUpperCase()
    && String(row.ref_id) === String(refId)
    && (!allowedTypes.length || allowedTypes.indexOf(String(row.type || "").toUpperCase()) >= 0)
    && !toBool_(row.is_read)
  ));
  rows.forEach((row) => updateRowByKey_(SHEETS.notifications, "id", row.id, { is_read: true, read_at: isoNow_() }));
  return rows.length;
}

function syncNoticeNotifications_(notice) {
  const targetDealers = toBool_(notice.is_active)
    ? activeDealerAccountsByCode_().filter((dealer) => isNoticeTargetDealer_(dealer, notice))
    : [];
  const targetCodes = targetDealers.map((dealer) => String(dealer.dealer_code || "").toUpperCase());
  const existing = readRows_(SHEETS.notifications).filter((row) => (
    String(row.type || "").toUpperCase() === "NOTICE"
    && String(row.ref_type || "").toUpperCase() === "NOTICE"
    && String(row.ref_id) === String(notice.id)
  ));
  existing
    .filter((row) => targetCodes.indexOf(String(row.target_dealer_id || "").toUpperCase()) < 0 || String(row.target_role || "").toUpperCase() !== "DEALER")
    .forEach((row) => deleteRowsByKey_(SHEETS.notifications, "id", row.id));
  targetDealers.forEach((dealer) => ensureNotification_({
    type: "NOTICE",
    target_role: "DEALER",
    target_dealer_id: dealer.dealer_code,
    title: "새 공지사항",
    message: notice.title,
    ref_type: "NOTICE",
    ref_id: notice.id,
    is_read: false,
    created_at: notice.created_at || isoNow_()
  }));
  return targetDealers.length;
}

function createOrRefreshMessageNotification_(message, thread, type) {
  const receiverRole = String(message.receiver_role || "").toUpperCase();
  return createOrRefreshNotification_({
    type: type || "MESSAGE",
    target_role: receiverRole,
    target_dealer_id: receiverRole === "DEALER" ? thread.dealer_code : "",
    title: receiverRole === "ADMIN" ? "새 대리점 쪽지" : (type === "ORDER_DISCOUNT" ? "주문 할인율 변경 안내" : "본사 쪽지 도착"),
    message: receiverRole === "ADMIN" ? thread.dealer_name + "에서 새 쪽지를 보냈습니다." : String(message.content || "").slice(0, 80),
    ref_type: "MESSAGE_THREAD",
    ref_id: thread.id,
    is_read: false,
    created_at: message.created_at || isoNow_()
  });
}

function syncMissingCommunicationNotifications_() {
  readRows_(SHEETS.notices).forEach((notice) => syncNoticeNotifications_(notice));
  const threads = mapBy_(readRows_(SHEETS.messageThreads), "id");
  readRows_(SHEETS.messages)
    .filter((message) => !toBool_(message.is_read))
    .forEach((message) => {
      const thread = threads[message.thread_id];
      if (!thread) return;
      ensureNotification_({
        type: String(message.message_type || "").toUpperCase() === "ORDER_DISCOUNT" ? "ORDER_DISCOUNT" : "MESSAGE",
        target_role: message.receiver_role,
        target_dealer_id: String(message.receiver_role || "").toUpperCase() === "DEALER" ? thread.dealer_code : "",
        title: String(message.receiver_role || "").toUpperCase() === "ADMIN" ? "새 대리점 쪽지" : "본사 쪽지 도착",
        message: String(message.content || "").slice(0, 80),
        ref_type: "MESSAGE_THREAD",
        ref_id: thread.id,
        is_read: false,
        created_at: message.created_at
      });
    });
}

function tomorrowStartText_() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd 00:00:00");
}

function requireAccessibleThread_(threadId, user) {
  const thread = readRows_(SHEETS.messageThreads).find((row) => row.id === threadId);
  if (!thread) throw new Error("쪽지 대화를 찾을 수 없습니다.");
  if (user.role !== "admin" && !sameCode_(thread.dealer_code, user.dealer_code)) throw new Error("본인 대리점의 쪽지만 확인할 수 있습니다.");
  return thread;
}

function appendAutomaticDiscountMessage_(order, log, user) {
  const subject = "주문 할인율 변경 안내";
  let thread = readRows_(SHEETS.messageThreads).find((row) => sameCode_(row.dealer_code, order.dealer_code) && row.subject === subject && row.status !== "CLOSED");
  const now = isoNow_();
  if (!thread) {
    thread = {
      id: makeCommunicationId_("THR"),
      dealer_code: order.dealer_code,
      dealer_name: order.dealer_name,
      subject: subject,
      status: "ANSWERED",
      created_at: now,
      updated_at: now
    };
    appendObject_(SHEETS.messageThreads, thread);
  } else {
    thread = updateRowByKey_(SHEETS.messageThreads, "id", thread.id, { status: "ANSWERED", updated_at: now });
  }
  const content = [
    "주문번호: " + order.order_id,
    "",
    "기존 할인율: " + log.before_discount_rate + "%",
    "변경 할인율: " + log.after_discount_rate + "%",
    "",
    "정상가: " + numberText_(order.subtotal_amount) + "원",
    "변경 전 금액: " + numberText_(log.before_final_amount) + "원",
    "변경 후 금액: " + numberText_(log.after_final_amount) + "원",
    "",
    "적용일: " + now.slice(0, 10),
    "문의사항은 본사로 연락 바랍니다."
  ].join("\n");
  const message = {
    id: makeCommunicationId_("MSG"),
    thread_id: thread.id,
    sender_role: "ADMIN",
    sender_id: user.login_id,
    sender_name: HEAD_OFFICE_NAME,
    receiver_role: "DEALER",
    receiver_id: order.dealer_code,
    content: content,
    is_read: false,
    read_at: "",
    message_type: "ORDER_DISCOUNT",
    order_id: order.order_id,
    created_at: now
  };
  appendObject_(SHEETS.messages, message);
  createOrRefreshMessageNotification_(message, thread, "ORDER_DISCOUNT");
  const pushNotification = sendPushNotification_({
    title: "GLOC 주문 할인율 변경",
    body: order.order_id + " · " + log.before_discount_rate + "% → " + log.after_discount_rate + "% · " + numberText_(log.after_final_amount) + "원",
    url: getSetting_("push_click_url") || getSetting_("app_public_url") || "",
    tag: "gloc-order-discount-" + order.order_id
  }, { role: "dealer", dealer_code: order.dealer_code });
  return { thread: thread, message: message, push_notification: pushNotification };
}

function numberText_(value) {
  return Number(value || 0).toLocaleString("en-US");
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

function compactDateValue_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
}

function randomDigits_(length) {
  const digits = Number(length || 6);
  const max = Math.pow(10, digits);
  return String(Math.floor(Math.random() * max)).padStart(digits, "0");
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
