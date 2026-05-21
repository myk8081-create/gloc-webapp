const app = document.querySelector("#app");
const config = window.FILM_STOCK_CONFIG || {};

const orderStatuses = ["접수", "승인", "출고", "완료", "반려", "취소"];
const shippingRegisteredTestStatus = "shipping_registered_test";
const headOfficeCode = "ADMIN";
const headOfficeName = "본사";
const defaultRetailPrice = 1000000;
const defaultPurchasePrice = 500000;
const defaultLegacyOrderDiscountRate = 20;
const inventoryPageSize = 10;
const koreaPostOverlay = {
  PAGE_WIDTH_MM: 150,
  PAGE_HEIGHT_MM: 100,
  OFFSET_X_MM: 0,
  OFFSET_Y_MM: 0,
  SCALE: 1,
  PRINT_ROTATION_DEG: 180,
  CUSTOMER_ORDER_X_MM: 7,
  CUSTOMER_ORDER_Y_MM: 15,
  CUSTOMER_ORDER_WIDTH_MM: 61,
  PAYMENT_X_MM: 36,
  PAYMENT_Y_MM: 25,
  BARCODE_X_MM: 7,
  BARCODE_Y_MM: 39,
  BARCODE_WIDTH_MM: 49,
  BARCODE_HEIGHT_MM: 17,
  MESSAGE_X_MM: 7,
  MESSAGE_Y_MM: 60,
  MESSAGE_WIDTH_MM: 62,
  CONTENT_X_MM: 7,
  CONTENT_Y_MM: 71,
  CONTENT_WIDTH_MM: 63,
  PROMO_X_MM: 24,
  PROMO_Y_MM: 88,
  PROMO_WIDTH_MM: 43,
  SENDER_X_MM: 78,
  SENDER_Y_MM: 20,
  SENDER_WIDTH_MM: 62,
  RECIPIENT_X_MM: 78,
  RECIPIENT_Y_MM: 36,
  RECIPIENT_WIDTH_MM: 61,
  RECIPIENT_BARCODE_X_MM: 118,
  RECIPIENT_BARCODE_Y_MM: 35,
  RECIPIENT_BARCODE_WIDTH_MM: 19,
  RECIPIENT_BARCODE_HEIGHT_MM: 22,
  REGISTRATION_X_MM: 91,
  REGISTRATION_Y_MM: 76,
  REGISTRATION_WIDTH_MM: 50,
  BOTTOM_BARCODE_X_MM: 89,
  BOTTOM_BARCODE_Y_MM: 82,
  BOTTOM_BARCODE_WIDTH_MM: 49,
  BOTTOM_BARCODE_HEIGHT_MM: 12,
  WATERMARK_X_MM: 75,
  WATERMARK_Y_MM: 50
};

const colorOptions = [
  { name: "전체", value: "전체", hex: "#cf4e42" },
  { name: "차콜", value: "차콜", hex: "#2f3d3d" },
  { name: "클리어", value: "클리어", hex: "#f7fbf9" },
  { name: "매트", value: "매트", hex: "#c9cac2" },
  { name: "스모크", value: "스모크", hex: "#202b30" },
  { name: "블랙", value: "블랙", hex: "#0b1113" },
  { name: "세라믹", value: "세라믹", hex: "#5d6b70" }
];

const baseProducts = [
  { category: "틴팅", color: "차콜", product_name: "세라믹 틴팅 차콜", sku: "TN-CH", sizes: ["15%", "35%", "50%"], unit: "롤" },
  { category: "PPF", color: "클리어", product_name: "프리미엄 PPF 클리어", sku: "PPF-CL", sizes: ["150", "180", "200"], unit: "롤" },
  { category: "PPF", color: "매트", product_name: "매트 PPF", sku: "PPF-MT", sizes: ["150", "180", "200"], unit: "롤" },
  { category: "틴팅", color: "스모크", product_name: "카본 틴팅 스모크", sku: "TN-SM", sizes: ["05%", "15%", "35%"], unit: "롤" },
  { category: "PPF", color: "블랙", product_name: "블랙 PPF", sku: "PPF-BK", sizes: ["150", "180", "200"], unit: "롤" },
  { category: "틴팅", color: "세라믹", product_name: "세라믹 틴팅", sku: "TN-CR", sizes: ["35%", "50%", "70%"], unit: "롤" },
  { category: "틴팅", color: "차콜", product_name: "나노 틴팅 차콜", sku: "TN-NC", sizes: ["15%", "35%", "50%"], unit: "롤" },
  { category: "PPF", color: "클리어", product_name: "라이트 PPF 클리어", sku: "PPF-LC", sizes: ["120", "150", "180"], unit: "롤" }
];

const mockDealers = [
  { dealer_code: "D001", dealer_name: "서울 총판", region: "서울" }
];

const mockInventoryOwners = [
  { dealer_code: headOfficeCode, dealer_name: headOfficeName, region: headOfficeName },
  ...mockDealers
];

function createMockProducts() {
  const products = [];
  for (let i = 0; i < 100; i += 1) {
    const base = baseProducts[i % baseProducts.length];
    const size = base.sizes[Math.floor(i / baseProducts.length) % base.sizes.length];
    const number = String(i + 1).padStart(3, "0");
    products.push({
      sku: `${base.sku}-${number}`,
      product_name: `${base.product_name} ${size}`,
      category: base.category,
      color: base.color,
      unit: base.unit,
      retail_price: defaultRetailPrice,
      purchase_price: defaultPurchasePrice,
      is_active: true
    });
  }

  products[0].product_name = "세라믹 틴팅 차콜 35%";
  products[0].sku = "TN-CH-035";
  products[1].product_name = "프리미엄 PPF 클리어";
  products[1].sku = "PPF-CL-150";
  products[2].product_name = "매트 PPF 블랙";
  products[2].sku = "PPF-MB-200";
  products[3].product_name = "카본 틴팅 스모크 15%";
  products[3].sku = "TN-SM-015";
  return products;
}

function createMockAccounts() {
  return [
    {
      login_id: "admin",
      dealer_code: "ADMIN",
      dealer_name: "본사 관리자",
      role: "admin",
      dealer_discount_rate: 0,
      is_first_login: false,
      is_active: true,
      contact_name: "본사",
      phone: "",
      zipcode: "",
      address: "",
      address_detail: "",
      default_courier: "",
      shipping_memo: "",
      password_changed_at: nowText(),
      profile_completed_at: nowText(),
      updated_at: nowText()
    },
    ...mockDealers.map((dealer, index) => ({
      login_id: `dealer${String(index + 1).padStart(2, "0")}`,
      dealer_code: dealer.dealer_code,
      dealer_name: dealer.dealer_name,
      role: "dealer",
      dealer_discount_rate: 20,
      is_first_login: index === 1,
      is_active: true,
      contact_name: index === 0 ? "서울 담당자" : "",
      phone: index === 0 ? "010-0000-0000" : "",
      zipcode: index === 0 ? "00000" : "",
      address: index === 0 ? "서울시" : "",
      address_detail: index === 0 ? "본점" : "",
      default_courier: index === 0 ? "CJ대한통운" : "",
      shipping_memo: "",
      password_changed_at: index === 0 ? nowText() : "",
      profile_completed_at: index === 0 ? nowText() : "",
      updated_at: nowText()
    }))
  ];
}

function createMockInventory(products) {
  const rows = [];
  mockInventoryOwners.forEach((dealer, dealerIndex) => {
    products.forEach((product, productIndex) => {
      const isHeadOffice = dealer.dealer_code === headOfficeCode;
      const stock = isHeadOffice
        ? 260 + ((productIndex * 23) % 680)
        : 38 + ((productIndex * 17 + dealerIndex * 29) % 420);
      const safety = 70 + (productIndex % 5) * 10;
      rows.push({
        dealer_code: dealer.dealer_code,
        dealer_name: dealer.dealer_name,
        product_name: product.product_name,
        sku: product.sku,
        category: product.category,
        color: product.color,
        stock_qty: productIndex === 0 && isHeadOffice ? 980 : stock,
        safety_stock: safety,
        location: `${dealer.region} 창고`,
        updated_at: nowText()
      });
    });
  });
  return rows;
}

function createMockOrders(products) {
  return [
    {
      order_id: "ORD-260511-001",
      agency_id: "D001",
      dealer_code: "D001",
      dealer_name: "서울 총판",
      created_by_login_id: "dealer01",
      product_name: products[0].product_name,
      sku: products[0].sku,
      qty: 40,
      unit_retail_price: Number(products[0].retail_price || 0),
      dealer_discount_rate: 20,
      unit_sale_price: Math.round(Number(products[0].retail_price || 0) * 0.8),
      unit_purchase_price: Number(products[0].purchase_price || 0),
      status: "접수",
      memo: "이번 주 내 출고 요청",
      recipient_name: "",
      recipient_phone: "",
      recipient_zipcode: "",
      recipient_address: "",
      recipient_address_detail: "",
      courier: "",
      tracking_no: "",
      shipping_receipt_no: "",
      shipping_error: "",
      approved_at: "",
      shipping_company: "",
      tracking_number: "",
      print_status: "",
      printed_at: "",
      print_count: 0,
      created_at: nowText(),
      updated_at: nowText()
    },
    {
      order_id: "ORD-260511-000",
      agency_id: "D001",
      dealer_code: "D001",
      dealer_name: "서울 총판",
      created_by_login_id: "dealer01",
      product_name: products[1].product_name,
      sku: products[1].sku,
      qty: 12,
      unit_retail_price: Number(products[1].retail_price || 0),
      dealer_discount_rate: 20,
      unit_sale_price: Math.round(Number(products[1].retail_price || 0) * 0.8),
      unit_purchase_price: Number(products[1].purchase_price || 0),
      status: "완료",
      memo: "샘플 매출 데이터",
      recipient_name: "서울 담당자",
      recipient_phone: "010-0000-0000",
      recipient_zipcode: "00000",
      recipient_address: "서울시",
      recipient_address_detail: "본점",
      courier: "우체국택배",
      tracking_no: "TEST-KP-20260511-123456",
      shipping_receipt_no: "TEST-RCPT-20260511-123456",
      shipping_error: "",
      approved_at: nowText(),
      shipping_company: "우체국택배",
      tracking_number: "TEST-KP-20260511-123456",
      print_status: "",
      printed_at: "",
      print_count: 0,
      created_at: nowText(),
      updated_at: nowText()
    }
  ];
}

const mockProducts = createMockProducts();

const state = {
  screen: "login",
  dataMode: window.FilmStockApi?.isEnabled() ? "appsScript" : "mock",
  session: null,
  accounts: createMockAccounts(),
  products: mockProducts,
  inventory: createMockInventory(mockProducts),
  orders: createMockOrders(mockProducts),
  retailSales: [],
  reservations: [],
  selectedColor: "전체",
  selectedSku: mockProducts[0].sku,
  filters: {
    inventoryQuery: "",
    inventoryScope: "mine",
    inventoryDealerCode: "전체",
    inventoryPage: 1,
    orderQuery: "",
    orderStatus: "전체",
    dealerCode: "전체",
    orderPeriod: "전체",
    orderDate: dateInputValue(),
    orderMonth: monthInputValue(),
    salesQuery: "",
    salesDealerCode: "전체",
    salesPeriod: "월별",
    salesDate: dateInputValue(),
    salesMonth: monthInputValue()
  },
  forms: {
    loginRole: "dealer",
    loginId: "",
    password: "",
    dealerCode: "",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
    onboardingPassword: "",
    onboardingPasswordConfirm: "",
    onboardingContactName: "",
    onboardingPhone: "",
    onboardingZipcode: "",
    onboardingAddress: "",
    onboardingAddressDetail: "",
    dealerInfoContactName: "",
    dealerInfoPhone: "",
    dealerInfoZipcode: "",
    dealerInfoAddress: "",
    dealerInfoAddressDetail: "",
    dealerInfoDefaultCourier: "",
    dealerInfoShippingMemo: "",
    accountLoginId: "",
    accountRole: "dealer",
    accountDealerCode: "",
    accountDealerName: "",
    accountDiscountRate: 0,
    accountTemporaryPassword: "",
    inventoryDealerCode: "",
    inventorySku: "",
    inventoryStockQty: 0,
    inventorySafetyStock: 0,
    inventoryLocation: "",
    orderQty: 10,
    orderMemo: "",
    saleQty: 1,
    saleMemo: "",
    reservationCustomerName: "",
    reservationCustomerPhone: "",
    reservationDate: dateInputValue(),
    reservationQty: 1,
    reservationMemo: "",
    labelSize: "post-overlay-150x100",
    productSku: "",
    productName: "",
    productCategory: "PPF",
    productUnit: "롤",
    productRetailPrice: defaultRetailPrice,
    productPurchasePrice: defaultPurchasePrice,
    productIsActive: true,
    resetPassword: ""
  },
  tempPasswords: {},
  lastKakaoText: "",
  push: {
    supported: false,
    permission: "default",
    subscribed: false,
    checking: false,
    message: "이 기기에서 발주 알림을 받을 수 있는지 확인 중입니다."
  }
};

let searchRefreshTimer = null;
let accountFormRefreshTimer = null;
let daumPostcodeLoading = null;

function initFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const dealerCode = params.get("dealer") || params.get("code");
  if (dealerCode) {
    state.forms.loginRole = "dealer";
    state.forms.dealerCode = dealerCode;
    const account = state.accounts.find((item) => item.dealer_code === dealerCode && item.role === "dealer");
    if (account) state.forms.loginId = account.login_id;
  }
}

function render() {
  app.innerHTML = `
    <div class="app-shell ${state.session?.role === "admin" ? "admin-shell" : ""}">
      ${renderTopbar()}
      ${renderLogin()}
      ${renderPasswordChange()}
      ${renderOnboarding()}
      ${renderAdminDashboard()}
      ${renderDealerManagement()}
      ${renderDealerInfo()}
      ${renderInventory()}
      ${renderInventoryManage()}
      ${renderProductManage()}
      ${renderOrders()}
      ${renderSales()}
      ${renderOrderCreate()}
      ${renderReservations()}
      ${renderDealerLinks()}
      ${renderNotifications()}
      ${renderBottomNav()}
      <div id="toast" class="toast" role="status"></div>
    </div>
  `;
  bindEvents();
}

function renderTopbar() {
  const isLoggedIn = Boolean(state.session);
  const subtitle = isLoggedIn ? `${state.session.dealer_name} · ${roleLabel(state.session.role)} · ${state.session.login_id}` : "PPF · 틴팅 재고관리";
  const chip = isLoggedIn ? "로그인됨" : state.dataMode === "appsScript" ? "실데이터 모드" : "샘플 모드";
  return `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">
          <img src="gloc-logo.png" alt="GLOC" />
        </div>
        <div class="brand-copy">
          <div class="brand-title">GLOC</div>
          <div class="brand-subtitle">${escapeHtml(subtitle)}</div>
        </div>
      </div>
      <div class="account-chip">${escapeHtml(chip)}</div>
    </header>
  `;
}

function renderLogin() {
  return `
    <main class="screen ${state.screen === "login" ? "active" : ""}" data-screen="login">
      <section class="login-direct">
        <section class="panel login-card">
          <img class="login-logo" src="gloc-logo-banner.png" alt="GLOC" />
          <div class="login-intro">
            <p class="eyebrow">대리점 재고관리</p>
            <h1>로그인</h1>
            <p class="lead">QR 또는 카카오톡 링크로 접속한 뒤 대리점 계정으로 재고조회와 발주를 진행합니다.</p>
          </div>
          <div class="form-grid">
            <div class="segmented" aria-label="계정 유형">
              <button type="button" class="${state.forms.loginRole === "dealer" ? "active" : ""}" data-login-role="dealer">대리점</button>
              <button type="button" class="${state.forms.loginRole === "admin" ? "active" : ""}" data-login-role="admin">관리자</button>
            </div>
            <label class="field">
              <span>아이디</span>
              <input id="loginId" type="text" value="${escapeAttr(state.forms.loginId)}" autocomplete="username" placeholder="예: dealer01" />
            </label>
            <label class="field">
              <span>비밀번호</span>
              <input id="loginPassword" type="password" value="${escapeAttr(state.forms.password)}" autocomplete="current-password" placeholder="발급받은 초기 비밀번호" />
            </label>
            <label class="field">
              <span>대리점 코드</span>
              <input id="dealerCode" type="text" value="${escapeAttr(state.forms.dealerCode)}" placeholder="${state.forms.loginRole === "admin" ? "관리자는 ADMIN 입력 가능" : "예: D001"}" />
            </label>
            <p class="product-meta">${dataModeText()}</p>
            <button type="button" class="primary-button" data-action="login">로그인 후 이동</button>
          </div>
        </section>
      </section>
    </main>
  `;
}

function renderPasswordChange() {
  return `
    <main class="screen ${state.screen === "passwordChange" ? "active" : ""}" data-screen="passwordChange">
      <section class="login-direct">
        <section class="panel login-card">
          <div class="login-intro">
            <p class="eyebrow">최초 로그인</p>
            <h1>비밀번호 변경</h1>
            <p class="lead">초기 비밀번호로 로그인했습니다. 계속 사용하기 전에 새 비밀번호로 변경해 주세요.</p>
          </div>
          <div class="form-grid">
            <label class="field">
              <span>현재 비밀번호</span>
              <input id="currentPassword" type="password" value="${escapeAttr(state.forms.currentPassword)}" autocomplete="current-password" />
            </label>
            <label class="field">
              <span>새 비밀번호</span>
              <input id="newPassword" type="password" value="${escapeAttr(state.forms.newPassword)}" autocomplete="new-password" />
            </label>
            <label class="field">
              <span>새 비밀번호 확인</span>
              <input id="newPasswordConfirm" type="password" value="${escapeAttr(state.forms.newPasswordConfirm)}" autocomplete="new-password" />
            </label>
            <button type="button" class="primary-button" data-action="changePassword">비밀번호 변경 후 시작</button>
            <button type="button" class="secondary-button" data-action="logout">로그아웃</button>
          </div>
        </section>
      </section>
    </main>
  `;
}

function renderOnboarding() {
  return `
    <main class="screen ${state.screen === "onboarding" ? "active" : ""}" data-screen="onboarding">
      <section class="login-direct onboarding-direct">
        <section class="panel login-card onboarding-card">
          <img class="login-logo" src="gloc-logo-banner.png" alt="GLOC" />
          <div class="login-intro">
            <p class="eyebrow">최초 설정</p>
            <h1>비밀번호와 배송정보 입력</h1>
            <p class="lead">처음 로그인한 대리점 계정은 새 비밀번호와 배송 받을 주소를 먼저 저장해야 재고관리 화면으로 이동합니다.</p>
          </div>
          <div class="form-grid">
            <div class="two-col">
              <label class="field">
                <span>새 비밀번호</span>
                <input id="onboardingPassword" type="password" value="${escapeAttr(state.forms.onboardingPassword)}" autocomplete="new-password" placeholder="8자 이상" />
              </label>
              <label class="field">
                <span>새 비밀번호 확인</span>
                <input id="onboardingPasswordConfirm" type="password" value="${escapeAttr(state.forms.onboardingPasswordConfirm)}" autocomplete="new-password" placeholder="새 비밀번호 재입력" />
              </label>
            </div>
            <div class="two-col">
              <label class="field">
                <span>담당자 이름</span>
                <input id="onboardingContactName" type="text" value="${escapeAttr(state.forms.onboardingContactName)}" autocomplete="name" placeholder="예: 홍길동" />
              </label>
              <label class="field">
                <span>전화번호</span>
                <input id="onboardingPhone" type="tel" inputmode="numeric" maxlength="13" value="${escapeAttr(state.forms.onboardingPhone)}" autocomplete="tel" placeholder="예: 010-0000-0000" />
              </label>
            </div>
            <div class="address-search-row">
              <label class="field">
                <span>우편번호</span>
                <input id="onboardingZipcode" type="text" value="${escapeAttr(state.forms.onboardingZipcode)}" readonly placeholder="주소찾기로 입력" />
              </label>
              <button type="button" class="secondary-button" data-action="openPostcode">주소찾기</button>
            </div>
            <label class="field">
              <span>주소</span>
              <input id="onboardingAddress" type="text" value="${escapeAttr(state.forms.onboardingAddress)}" readonly placeholder="주소찾기로 입력" />
            </label>
            <label class="field">
              <span>상세주소</span>
              <input id="onboardingAddressDetail" type="text" value="${escapeAttr(state.forms.onboardingAddressDetail)}" autocomplete="address-line2" placeholder="예: 101호, 창고명" />
            </label>
            <button type="button" class="primary-button" data-action="completeOnboarding">저장 후 시작</button>
            <button type="button" class="secondary-button" data-action="logout">로그아웃</button>
          </div>
        </section>
      </section>
    </main>
  `;
}

function renderAdminDashboard() {
  const stats = dashboardStats();
  return `
    <main class="screen ${state.screen === "admin" ? "active" : ""}" data-screen="admin">
      <section class="page-head">
        <p class="eyebrow">관리자 대시보드</p>
        <h1>전체 재고와 발주 현황</h1>
        <p class="lead">본사 재고, 전체 대리점/샵 재고, 안전재고 미달 제품, 발주 상태를 한곳에서 확인합니다.</p>
        <div class="page-actions">
          <button class="primary-button" type="button" data-nav="inventoryManage">재고 수정</button>
          <button class="secondary-button" type="button" data-nav="productManage">제품 등록</button>
          <button class="secondary-button" type="button" data-nav="sales">매출현황</button>
          <button class="primary-button" type="button" data-nav="dealers">대리점 계정 관리</button>
          <button class="secondary-button" type="button" data-nav="links">QR/카카오톡 안내문</button>
        </div>
      </section>

      <section class="stats-grid">
        <div class="metric">
          <div class="metric-label">활성 대리점</div>
          <div class="metric-value">${stats.activeDealers}개</div>
          <div class="metric-note">사용 가능한 dealer 계정</div>
        </div>
        <div class="metric blue">
          <div class="metric-label">총 재고</div>
          <div class="metric-value">${roll(stats.totalStock)}</div>
          <div class="metric-note">본사와 대리점/샵 합산</div>
        </div>
        <div class="metric danger">
          <div class="metric-label">안전재고 이하</div>
          <div class="metric-value">${stats.lowStock}개</div>
          <div class="metric-note">즉시 확인 필요</div>
        </div>
        <div class="metric warn">
          <div class="metric-label">접수 발주</div>
          <div class="metric-value">${stats.openOrders}건</div>
          <div class="metric-note">승인 전 요청</div>
        </div>
      </section>

      <section class="admin-grid">
        <article class="panel summary-panel">
          <h3>빠른 이동</h3>
          <div class="quick-grid">
            <button class="quick-card" type="button" data-nav="inventory">
              <strong>재고조회</strong>
              <span>제품명, SKU, 대리점명, 수량 검색</span>
            </button>
            <button class="quick-card" type="button" data-nav="inventoryManage">
              <strong>재고수정</strong>
              <span>본사 재고, 안전재고, 위치 수정</span>
            </button>
            <button class="quick-card" type="button" data-nav="productManage">
              <strong>제품등록</strong>
              <span>PPF/틴팅 SKU 생성 및 수정</span>
            </button>
            <button class="quick-card" type="button" data-nav="orders">
              <strong>발주관리</strong>
              <span>접수, 승인, 출고, 완료, 반려 변경</span>
            </button>
            <button class="quick-card" type="button" data-nav="sales">
              <strong>매출현황</strong>
              <span>일별/월별 대리점별 매출과 이익 확인</span>
            </button>
            <button class="quick-card" type="button" data-nav="dealers">
              <strong>계정관리</strong>
              <span>대리점 생성, 초기화, 사용중지</span>
            </button>
            <button class="quick-card" type="button" data-nav="dealerInfo">
              <strong>대리점 정보</strong>
              <span>배송지, 담당자, 기본 택배사 조회</span>
            </button>
            <button class="quick-card" type="button" data-nav="links">
              <strong>QR/안내문</strong>
              <span>공통 QR과 대리점별 안내문 생성</span>
            </button>
            <button class="quick-card" type="button" data-nav="notifications">
              <strong>알림설정</strong>
              <span>이 기기 푸시 알림 등록과 테스트</span>
            </button>
          </div>
        </article>
        <article class="panel summary-panel">
          <h3>최근 발주</h3>
          <div class="history-list">
            ${visibleOrders().slice(0, 5).map(renderOrderMini).join("") || `<div class="empty">발주 내역이 없습니다.</div>`}
          </div>
        </article>
      </section>
    </main>
  `;
}

function renderNotifications() {
  if (!state.session) return "";
  const admin = state.session.role === "admin";
  return `
    <main class="screen ${state.screen === "notifications" ? "active" : ""}" data-screen="notifications">
      <section class="page-head">
        <p class="eyebrow">${admin ? "관리자" : currentDealerName()}</p>
        <h1>알림 설정</h1>
        <p class="lead">${admin ? "새 발주가 들어오면 이 기기에서 푸시 알림을 받을 수 있습니다." : "발주 상태 변경과 출고 정보를 이 기기에서 푸시 알림으로 받을 수 있습니다."}</p>
      </section>
      ${renderPushNotificationPanel()}
      <section class="panel summary-panel">
        <h3>알림 안내</h3>
        <div class="history-list">
          <div class="history-item">
            <div class="history-time">1</div>
            <div>
              <div class="product-name">이 기기 알림 등록</div>
              <div class="product-meta">휴대폰 또는 PC마다 한 번씩 눌러야 해당 기기로 알림이 갑니다.</div>
            </div>
          </div>
          <div class="history-item">
            <div class="history-time">2</div>
            <div>
              <div class="product-name">테스트 알림 확인</div>
              <div class="product-meta">등록 후 테스트 알림을 보내서 실제 알림 수신 여부를 확인합니다.</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderPushNotificationPanel() {
  if (!state.session) return "";
  const canSubscribe = pushCanSubscribe();
  const buttonText = state.push.subscribed ? "이 기기 알림 다시 등록" : "이 기기에서 발주 알림 받기";
  const admin = state.session.role === "admin";
  return `
    <article class="panel summary-panel history-panel push-panel">
      <div class="panel-head-row">
        <div>
          <p class="eyebrow">${admin ? "관리자 알림" : "대리점 알림"}</p>
          <h3>${admin ? "새 발주 푸시 알림" : "발주 처리 푸시 알림"}</h3>
        </div>
        <span class="badge ${state.push.subscribed ? "" : "warn"}">${state.push.subscribed ? "등록됨" : "대기"}</span>
      </div>
      <p class="lead compact-lead">${escapeHtml(pushStatusText())}</p>
      <div class="page-actions">
        <button class="primary-button" type="button" data-action="enablePushNotifications" ${canSubscribe ? "" : "disabled"}>${buttonText}</button>
        <button class="secondary-button" type="button" data-action="checkPushNotifications">상태 확인</button>
        <button class="secondary-button" type="button" data-action="sendTestPushNotification" ${state.push.subscribed && window.FilmStockApi?.isEnabled() ? "" : "disabled"}>테스트 알림 보내기</button>
      </div>
    </article>
  `;
}

function renderDealerManagement() {
  const isAdminSession = state.session?.role === "admin";
  const canManageStaff = canManageDealerStaff();
  const accounts = managedAccounts();
  const accountRole = isAdminSession ? state.forms.accountRole || "dealer" : "dealer";
  const isAdminAccount = isAdminSession && accountRole === "admin";
  const dealerCodeValue = isAdminSession
    ? isAdminAccount ? "ADMIN" : state.forms.accountDealerCode
    : state.session?.dealer_code || "";
  const dealerNameValue = isAdminSession ? state.forms.accountDealerName : state.session?.dealer_name || "";
  const hasTopDealerManager = Boolean(topDealerAccountByCode(dealerCodeValue));
  const showDiscountInput = !isAdminAccount && isAdminSession && !hasTopDealerManager;
  const inheritedDiscountText = !isAdminAccount && hasTopDealerManager
    ? `최상위 관리자 기준 할인율 ${percent(dealerDiscountRate(dealerCodeValue))}이 자동 적용됩니다.`
    : "담당자는 대리점 최상위 관리자 할인율을 자동 적용합니다.";
  return `
    <main class="screen ${state.screen === "dealers" ? "active" : ""}" data-screen="dealers">
      <section class="page-head">
        <p class="eyebrow">${isAdminSession ? "계정 관리" : "담당자 관리"}</p>
        <h1>${isAdminSession ? "계정 생성 및 상태 관리" : "대리점 담당자 ID 생성"}</h1>
        <p class="lead">${isAdminSession ? "대리점과 관리자 계정을 생성하고, 비밀번호 초기화 또는 사용중지를 처리합니다." : "같은 대리점 코드를 사용하는 추가 담당자 계정을 생성합니다."}</p>
      </section>

      <section class="work-layout">
        <div class="panel form-panel">
          ${canManageStaff ? `
            <h3>${isAdminSession ? isAdminAccount ? "관리자 계정 생성" : "대리점 계정 생성" : "담당자 ID 생성"}</h3>
            <div class="form-grid">
              ${isAdminSession ? `
                <label class="field">
                  <span>계정 유형</span>
                  <select id="accountRole">
                    <option value="dealer" ${accountRole === "dealer" ? "selected" : ""}>대리점</option>
                    <option value="admin" ${accountRole === "admin" ? "selected" : ""}>관리자</option>
                  </select>
                </label>
              ` : ""}
              <label class="field">
                <span>${isAdminAccount ? "관리자 코드" : "대리점 코드"}</span>
                <input id="accountDealerCode" type="text" value="${escapeAttr(dealerCodeValue)}" placeholder="${isAdminAccount ? "ADMIN" : "예: D013"}" ${isAdminAccount || !isAdminSession ? "readonly" : ""} />
              </label>
              <label class="field">
                <span>${isAdminAccount ? "관리자명" : "대리점명"}</span>
                <input id="accountDealerName" type="text" value="${escapeAttr(dealerNameValue)}" placeholder="${isAdminAccount ? "예: 본사 관리자 2" : "예: 강남 대리점"}" ${!isAdminSession ? "readonly" : ""} />
              </label>
              ${showDiscountInput ? `
                <label class="field">
                  <span>대리점 공통 할인율(%)</span>
                  <input id="accountDiscountRate" type="number" min="0" max="100" step="0.1" inputmode="decimal" value="${escapeAttr(state.forms.accountDiscountRate)}" />
                </label>
              ` : !isAdminAccount ? `
                <div class="form-note">
                  ${escapeHtml(inheritedDiscountText)}
                </div>
              ` : ""}
              <label class="field">
                <span>초기 아이디</span>
                <input id="accountLoginId" type="text" value="${escapeAttr(state.forms.accountLoginId)}" placeholder="${isAdminAccount ? "예: admin02" : "예: seoul-staff02"}" />
              </label>
              <label class="field">
                <span>초기 비밀번호</span>
                <input id="accountTemporaryPassword" type="text" value="${escapeAttr(state.forms.accountTemporaryPassword)}" placeholder="관리자가 전달할 임시 비밀번호" />
              </label>
              <button type="button" class="primary-button" data-action="createAccount">${isAdminSession ? isAdminAccount ? "관리자 계정 생성" : "대리점 계정 생성" : "담당자 ID 생성"}</button>
            </div>
          ` : `
            <h3>담당자 관리 권한 없음</h3>
            <p class="lead compact-lead">담당자 추가와 삭제는 본사 관리자 또는 이 대리점의 최상위 관리자만 가능합니다.</p>
          `}
        </div>

        <div class="panel list-panel">
          <h3>${isAdminSession ? "계정 목록" : "우리 대리점 담당자"}</h3>
          <div class="account-list">
            ${accounts.map(renderAccountRow).join("") || `<div class="empty">등록된 계정이 없습니다.</div>`}
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderDealerInfo() {
  if (!state.session) return "";
  if (state.session.role === "admin") return renderDealerInfoAdmin();
  const profile = currentDealerProfile();
  return `
    <main class="screen ${state.screen === "dealerInfo" ? "active" : ""}" data-screen="dealerInfo">
      <section class="page-head">
        <p class="eyebrow">${escapeHtml(currentDealerName())}</p>
        <h1>대리점 정보</h1>
        <p class="lead">발주 승인과 출고 처리 시 사용할 담당자, 배송지, 기본 택배사 정보를 관리합니다.</p>
      </section>

      <section class="panel form-panel dealer-info-panel">
        <div class="form-grid">
          <label class="field">
            <span>대리점명</span>
            <input type="text" value="${escapeAttr(profile.dealer_name || state.session.dealer_name)}" readonly />
          </label>
          <div class="two-col">
            <label class="field">
              <span>담당자 이름</span>
              <input id="dealerInfoContactName" type="text" value="${escapeAttr(state.forms.dealerInfoContactName)}" autocomplete="name" placeholder="예: 홍길동" />
            </label>
            <label class="field">
              <span>전화번호</span>
              <input id="dealerInfoPhone" type="tel" inputmode="numeric" maxlength="13" value="${escapeAttr(state.forms.dealerInfoPhone)}" autocomplete="tel" placeholder="예: 010-0000-0000" />
            </label>
          </div>
          <div class="address-search-row">
            <label class="field">
              <span>우편번호</span>
              <input id="dealerInfoZipcode" type="text" inputmode="numeric" maxlength="5" value="${escapeAttr(state.forms.dealerInfoZipcode)}" placeholder="주소찾기로 입력" />
            </label>
            <button type="button" class="secondary-button" data-action="openDealerInfoPostcode">주소찾기</button>
          </div>
          <label class="field">
            <span>주소</span>
            <input id="dealerInfoAddress" type="text" value="${escapeAttr(state.forms.dealerInfoAddress)}" placeholder="주소찾기로 입력" />
          </label>
          <label class="field">
            <span>상세주소</span>
            <input id="dealerInfoAddressDetail" type="text" value="${escapeAttr(state.forms.dealerInfoAddressDetail)}" autocomplete="address-line2" placeholder="예: 101호, 창고명" />
          </label>
          <label class="field">
            <span>기본 택배사</span>
            <input id="dealerInfoDefaultCourier" type="text" value="${escapeAttr(state.forms.dealerInfoDefaultCourier)}" placeholder="예: CJ대한통운" />
          </label>
          <label class="field">
            <span>배송 메모</span>
            <textarea id="dealerInfoShippingMemo" placeholder="예: 출고 전 연락, 지게차 하차 가능 등">${escapeHtml(state.forms.dealerInfoShippingMemo)}</textarea>
          </label>
          <button type="button" class="primary-button" data-action="saveDealerInfo">대리점 정보 저장</button>
        </div>
      </section>
    </main>
  `;
}

function renderDealerInfoAdmin() {
  const profiles = uniqueDealerProfiles();
  return `
    <main class="screen ${state.screen === "dealerInfo" ? "active" : ""}" data-screen="dealerInfo">
      <section class="page-head">
        <p class="eyebrow">관리자 조회</p>
        <h1>전체 대리점 정보</h1>
        <p class="lead">대리점별 담당자, 배송지, 기본 택배사, 배송 메모를 조회합니다. 정보 수정은 각 대리점 계정에서 진행합니다.</p>
        <div class="page-actions">
          <button class="secondary-button" type="button" data-action="refresh">새로고침</button>
        </div>
      </section>

      <section class="dealer-info-grid">
        ${profiles.map(renderDealerInfoCard).join("") || `<article class="panel summary-panel"><div class="empty">등록된 대리점 정보가 없습니다.</div></article>`}
      </section>
    </main>
  `;
}

function renderDealerInfoCard(account) {
  const address = [account.zipcode ? `(${account.zipcode})` : "", account.address, account.address_detail].filter(Boolean).join(" ");
  return `
    <article class="panel dealer-info-card">
      <div class="panel-head-row">
        <div>
          <p class="eyebrow">${escapeHtml(account.dealer_code)}</p>
          <h3>${escapeHtml(account.dealer_name || account.dealer_code)}</h3>
        </div>
        <span class="badge ${toBool(account.is_active) ? "" : "danger"}">${toBool(account.is_active) ? "사용중" : "중지"}</span>
      </div>
      <dl class="info-list">
        <div><dt>담당자</dt><dd>${escapeHtml(account.contact_name || "-")}</dd></div>
        <div><dt>전화번호</dt><dd>${escapeHtml(account.phone || "-")}</dd></div>
        <div><dt>주소</dt><dd>${escapeHtml(address || "-")}</dd></div>
        <div><dt>기본 택배사</dt><dd>${escapeHtml(account.default_courier || "-")}</dd></div>
        <div><dt>배송 메모</dt><dd>${escapeHtml(account.shipping_memo || "-")}</dd></div>
        <div><dt>수정일</dt><dd>${escapeHtml(account.updated_at || "-")}</dd></div>
      </dl>
    </article>
  `;
}

function renderInventory() {
  const rows = visibleInventory();
  const scope = currentInventoryScope();
  const pageRows = paginatedInventoryRows(rows);
  return `
    <main class="screen ${state.screen === "inventory" ? "active" : ""}" data-screen="inventory">
      <section class="page-head">
        <p class="eyebrow">${escapeHtml(currentDealerName())}</p>
        <h1>재고조회</h1>
        <p class="lead">${state.session?.role === "admin" ? "본사 재고와 전체 대리점/샵 재고를 분리해서 조회합니다." : "내 대리점/샵 재고, 본사 재고, 전체 대리점/샵 재고를 분리해서 조회합니다."}</p>
        <div class="page-actions">
          <button class="primary-button" type="button" data-nav="inventoryManage">재고 수정</button>
          ${state.session?.role === "admin" ? `<button class="secondary-button" type="button" data-nav="productManage">제품 등록</button>` : ""}
          ${state.session?.role === "dealer" ? `<button class="primary-button" type="button" data-nav="orderCreate">발주 신청</button>` : `<button class="primary-button" type="button" data-nav="orders">발주관리</button>`}
          <button class="secondary-button" type="button" data-action="refresh">새로고침</button>
        </div>
      </section>

      ${renderInventoryScopeSwitch(scope)}
      ${renderInventoryDealerTabs(scope)}

      <section class="stats-grid" id="inventoryStats">
        ${renderInventoryStatsCards(rows)}
      </section>

      <section class="toolbar">
        <input class="search-input" id="inventoryQuery" type="search" placeholder="제품명, SKU, 대리점명, 재고수량 검색" value="${escapeAttr(state.filters.inventoryQuery)}" />
        <div class="toolbar-actions">
          ${renderDealerFilter()}
        </div>
        <div class="chip-row">
          ${colorOptions.map((option) => `<button type="button" class="chip ${state.selectedColor === option.value ? "active" : ""}" data-color="${option.value}">${option.name}</button>`).join("")}
        </div>
      </section>

      <section class="panel list-panel">
        <h3>${inventoryScopeTitle(scope)}</h3>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>제품</th>
                <th>SKU</th>
                <th>재고</th>
                <th>안전재고</th>
                <th>위치</th>
              </tr>
            </thead>
            <tbody id="inventoryRows">
              ${pageRows.map(renderInventoryRow).join("") || `<tr><td colspan="6" class="empty-cell">조회 결과가 없습니다.</td></tr>`}
            </tbody>
          </table>
        </div>
        <div id="inventoryPager">
          ${renderInventoryPager(rows)}
        </div>
      </section>
    </main>
  `;
}

function renderInventoryStatsCards(rows) {
  const stats = inventoryStats(rows);
  return `
    <div class="metric">
      <div class="metric-label">조회 결과</div>
      <div class="metric-value">${rows.length}개</div>
      <div class="metric-note">현재 필터 기준</div>
    </div>
    <div class="metric blue">
      <div class="metric-label">보유 재고</div>
      <div class="metric-value">${roll(stats.totalStock)}</div>
      <div class="metric-note">검색 결과 합산</div>
    </div>
    <div class="metric danger">
      <div class="metric-label">안전재고 이하</div>
      <div class="metric-value">${stats.lowStock}개</div>
      <div class="metric-note">강조 표시 대상</div>
    </div>
    <div class="metric warn">
      <div class="metric-label">제품 종류</div>
      <div class="metric-value">${activeProducts().length}개</div>
      <div class="metric-note">판매중 PPF/틴팅 SKU</div>
    </div>
  `;
}

function renderInventoryDealerTabs(scope) {
  if (scope !== "dealerAll") return "";
  return `
    <section class="dealer-order-tabs" id="inventoryDealerTabs" aria-label="대리점별 재고현황">
      ${renderInventoryDealerTabButtons()}
    </section>
  `;
}

function renderInventoryDealerTabButtons() {
  const options = inventoryDealerOptions();
  const totalRows = visibleInventory({ includeDealerFilter: false });
  const totalStock = inventoryStats(totalRows).totalStock;
  return `
    <button type="button" class="${state.filters.inventoryDealerCode === "전체" ? "active" : ""}" data-inventory-dealer="전체">
      <span>전체 대리점/샵</span>
      <strong>${roll(totalStock)}</strong>
    </button>
    ${options.map((dealer) => `
      <button type="button" class="${state.filters.inventoryDealerCode === dealer.dealer_code ? "active" : ""}" data-inventory-dealer="${escapeAttr(dealer.dealer_code)}">
        <span>${escapeHtml(dealer.dealer_name)}</span>
        <strong>${roll(dealer.totalStock)}</strong>
      </button>
    `).join("")}
  `;
}

function renderInventoryPager(rows) {
  const totalPages = inventoryTotalPages(rows);
  if (totalPages <= 1) {
    return `<div class="pager muted-pager">총 ${rows.length}개</div>`;
  }
  const page = currentInventoryPage(rows);
  return `
    <div class="pager" aria-label="재고 페이지 이동">
      <button type="button" class="secondary-button small-button" data-inventory-page="${page - 1}" ${page <= 1 ? "disabled" : ""}>이전</button>
      <span>${page} / ${totalPages} 페이지 · 총 ${rows.length}개</span>
      <button type="button" class="secondary-button small-button" data-inventory-page="${page + 1}" ${page >= totalPages ? "disabled" : ""}>다음</button>
    </div>
  `;
}

function renderInventoryManage() {
  ensureInventoryForm();
  const rows = editableInventoryRows();
  const selectedProductName = state.products.find((product) => product.sku === state.forms.inventorySku)?.product_name || "";
  const ownerLabel = state.session?.role === "admin"
    ? `${headOfficeCode} · ${headOfficeName} 재고`
    : `${state.session?.dealer_code || ""} · ${state.session?.dealer_name || ""}`;
  return `
    <main class="screen ${state.screen === "inventoryManage" ? "active" : ""}" data-screen="inventoryManage">
      <section class="page-head">
        <p class="eyebrow">${escapeHtml(currentDealerName())}</p>
        <h1>재고수정</h1>
        <p class="lead">${state.session?.role === "admin" ? "관리자는 본사 재고만 수정합니다." : "대리점/샵은 본인 재고만 수정합니다."}</p>
        <div class="page-actions">
          <button class="secondary-button" type="button" data-nav="inventory">재고조회</button>
          ${state.session?.role === "admin" ? `<button class="secondary-button" type="button" data-nav="productManage">제품 등록</button>` : ""}
        </div>
      </section>

      <section class="work-layout">
        <div class="panel list-panel">
          <h3>수정할 재고 선택</h3>
          <input class="search-input" id="inventoryQuery" type="search" placeholder="구분, 제품명, SKU 검색" value="${escapeAttr(state.filters.inventoryQuery)}" />
          <div class="product-list" id="inventoryEditList">
            ${rows.slice(0, 16).map(renderInventoryEditRow).join("") || `<div class="empty">수정할 재고가 없습니다.</div>`}
          </div>
        </div>

        <div class="panel form-panel">
          <h3>재고 입력</h3>
          <div class="form-grid">
            <label class="field">
              <span>${state.session?.role === "admin" ? "관리 구분" : "대리점/샵"}</span>
              <input type="text" value="${escapeAttr(ownerLabel)}" disabled />
            </label>
            <label class="field">
              <span>제품 SKU</span>
              <select id="inventorySku">
                ${state.products.map((product) => `<option value="${escapeAttr(product.sku)}" ${state.forms.inventorySku === product.sku ? "selected" : ""}>${escapeHtml(product.sku)} · ${escapeHtml(product.product_name)}</option>`).join("")}
              </select>
            </label>
            <label class="field">
              <span>제품명</span>
              <input type="text" value="${escapeAttr(selectedProductName)}" disabled />
            </label>
            <label class="field">
              <span>현재 재고</span>
              <input id="inventoryStockQty" type="number" min="0" inputmode="numeric" value="${escapeAttr(state.forms.inventoryStockQty)}" />
            </label>
            <label class="field">
              <span>안전재고</span>
              <input id="inventorySafetyStock" type="number" min="0" inputmode="numeric" value="${escapeAttr(state.forms.inventorySafetyStock)}" />
            </label>
            <label class="field">
              <span>보관 위치</span>
              <input id="inventoryLocation" type="text" value="${escapeAttr(state.forms.inventoryLocation)}" placeholder="예: 서울 창고 A-1" />
            </label>
            <button type="button" class="primary-button" data-action="saveInventory">재고 저장</button>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderProductManage() {
  if (state.session?.role !== "admin") return "";
  return `
    <main class="screen ${state.screen === "productManage" ? "active" : ""}" data-screen="productManage">
      <section class="page-head">
        <p class="eyebrow">제품 관리</p>
        <h1>제품등록 및 수정</h1>
        <p class="lead">PPF/틴팅 제품 SKU를 웹에서 등록하고 수정합니다. 새 제품은 각 활성 대리점 재고에 0개로 자동 생성됩니다.</p>
        <div class="page-actions">
          <button class="secondary-button" type="button" data-nav="inventoryManage">재고 수정</button>
          <button class="secondary-button" type="button" data-nav="inventory">재고조회</button>
        </div>
      </section>

      <section class="work-layout">
        <div class="panel form-panel">
          <h3>제품 정보</h3>
          <div class="form-grid">
            <label class="field">
              <span>SKU</span>
              <input id="productSku" type="text" value="${escapeAttr(state.forms.productSku)}" placeholder="예: PPF-CL-150" />
            </label>
            <label class="field">
              <span>제품명</span>
              <input id="productName" type="text" value="${escapeAttr(state.forms.productName)}" placeholder="예: 프리미엄 PPF 클리어 150" />
            </label>
            <label class="field">
              <span>카테고리</span>
              <select id="productCategory">
                ${["PPF", "틴팅"].map((category) => `<option value="${category}" ${state.forms.productCategory === category ? "selected" : ""}>${category}</option>`).join("")}
              </select>
            </label>
            <label class="field">
              <span>단위</span>
              <input id="productUnit" type="text" value="${escapeAttr(state.forms.productUnit)}" placeholder="예: 롤" />
            </label>
            <label class="field">
              <span>소비자가</span>
              <input id="productRetailPrice" type="number" min="0" inputmode="numeric" value="${escapeAttr(state.forms.productRetailPrice)}" placeholder="예: 1000000" />
            </label>
            <label class="field">
              <span>매입가</span>
              <input id="productPurchasePrice" type="number" min="0" inputmode="numeric" value="${escapeAttr(state.forms.productPurchasePrice)}" placeholder="예: 500000" />
            </label>
            <label class="checkbox-row inline-check">
              <input id="productIsActive" type="checkbox" ${state.forms.productIsActive ? "checked" : ""} />
              <span>판매중</span>
            </label>
            <button type="button" class="primary-button" data-action="saveProduct">제품 저장</button>
          </div>
        </div>

        <div class="panel list-panel">
          <h3>제품 목록</h3>
          <div class="product-list">
            ${state.products.slice(0, 40).map(renderProductManageRow).join("") || `<div class="empty">등록된 제품이 없습니다.</div>`}
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderOrders() {
  const rows = visibleOrders();
  const stats = orderReportStats(rows);
  return `
    <main class="screen ${state.screen === "orders" ? "active" : ""}" data-screen="orders">
      <section class="page-head">
        <p class="eyebrow">${state.session?.role === "admin" ? "관리자" : currentDealerName()}</p>
        <h1>발주관리</h1>
        <p class="lead">${state.session?.role === "admin" ? "전체/대리점별 발주를 일별 또는 월별로 확인하고 상태를 변경합니다." : "내 대리점 발주 내역을 일별 또는 월별로 확인합니다."}</p>
        <div class="page-actions">
          ${state.session?.role === "dealer" ? `<button class="primary-button" type="button" data-nav="orderCreate">발주 신청</button>` : ""}
          ${state.session?.role === "admin" ? `<button class="secondary-button danger-button" type="button" data-action="clearTestOrders">테스트 발주 전체삭제</button>` : ""}
          <button class="secondary-button" type="button" data-action="refresh">새로고침</button>
        </div>
      </section>

      ${state.session?.role === "admin" ? renderOrderDealerTabs() : ""}
      ${renderOrderCalendarPanel()}

      <section class="toolbar">
        <input class="search-input" id="orderQuery" type="search" placeholder="주문번호, 제품명, SKU, 대리점명 검색" value="${escapeAttr(state.filters.orderQuery)}" />
        <select class="search-input compact-select" id="orderStatus">
          ${["전체", ...orderStatuses].map((status) => `<option value="${status}" ${state.filters.orderStatus === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
        ${state.session?.role === "admin" ? `
          <select class="search-input compact-select label-size-select" id="labelSize" aria-label="송장 라벨 크기">
            ${labelSizeOptions().map((option) => `<option value="${option.value}" ${state.forms.labelSize === option.value ? "selected" : ""}>${option.label}</option>`).join("")}
          </select>
        ` : ""}
      </section>

      <section class="stats-grid order-report-grid" id="orderStats">
        ${renderOrderStatsCards(rows, stats)}
      </section>

      <section class="panel list-panel">
        <h3>발주 내역</h3>
        <div class="order-list" id="orderList">
          ${rows.map(renderOrderCard).join("") || `<div class="empty">발주 내역이 없습니다.</div>`}
        </div>
      </section>
    </main>
  `;
}

function renderSales() {
  if (state.session?.role !== "admin") return "";
  const rows = visibleSalesRows();
  const stats = salesReportStats(rows);
  return `
    <main class="screen ${state.screen === "sales" ? "active" : ""}" data-screen="sales">
      <section class="page-head">
        <p class="eyebrow">관리자 매출현황</p>
        <h1>대리점별 매출과 이익</h1>
        <p class="lead">완료 처리된 발주를 기준으로 소비자가, 대리점 할인율, 매입가를 계산해 일별/월별 매출을 확인합니다.</p>
        <div class="page-actions">
          <button class="secondary-button" type="button" data-nav="orders">발주관리</button>
          <button class="secondary-button" type="button" data-nav="productManage">제품 가격 관리</button>
          <button class="secondary-button" type="button" data-nav="dealers">대리점 할인율 관리</button>
          <button class="secondary-button" type="button" data-action="refresh">새로고침</button>
        </div>
      </section>

      ${renderSalesDealerTabs()}
      ${renderSalesCalendarPanel()}

      <section class="toolbar">
        <input class="search-input" id="salesQuery" type="search" placeholder="주문번호, 제품명, SKU, 대리점명, 담당자 ID 검색" value="${escapeAttr(state.filters.salesQuery)}" />
      </section>

      <section class="stats-grid sales-report-grid" id="salesStats">
        ${renderSalesStatsCards(rows, stats)}
      </section>

      <section class="panel list-panel">
        <div class="panel-head-row">
          <div>
            <h3>매출 내역</h3>
            <p class="product-meta">계산식: 판매가=소비자가×(1-할인율/100), 이익=판매가-매입가, 수량 반영</p>
          </div>
          <span class="badge warn">${escapeHtml(salesPeriodLabel())}</span>
        </div>
        <div class="table-scroll">
          <table class="data-table sales-table">
            <thead>
              <tr>
                <th>일자</th>
                <th>대리점</th>
                <th>제품</th>
                <th>수량</th>
                <th>소비자가</th>
                <th>할인</th>
                <th>매출</th>
                <th>매입</th>
                <th>이익</th>
              </tr>
            </thead>
            <tbody id="salesRows">
              ${rows.map(renderSalesRow).join("") || `<tr><td colspan="9" class="empty-cell">완료된 매출 내역이 없습니다.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  `;
}

function renderSalesStatsCards(rows, stats = salesReportStats(rows)) {
  return `
    <article class="stat-card">
      <span>완료 발주</span>
      <strong>${stats.count}건</strong>
      <small>${state.filters.salesDealerCode === "전체" ? "통합 기준" : "대리점 기준"}</small>
    </article>
    <article class="stat-card">
      <span>총 매출</span>
      <strong>${money(stats.revenue)}</strong>
      <small>할인 적용 판매가</small>
    </article>
    <article class="stat-card">
      <span>총 매입</span>
      <strong>${money(stats.cost)}</strong>
      <small>제품 매입가 합산</small>
    </article>
    <article class="stat-card">
      <span>매출 이익</span>
      <strong>${money(stats.profit)}</strong>
      <small>마진율 ${percent(stats.marginRate)}</small>
    </article>
  `;
}

function renderSalesDealerTabs() {
  const options = salesDealerOptions();
  const total = salesRowsBase();
  const totalRevenue = total.reduce((sum, row) => sum + row.revenue, 0);
  return `
    <section class="dealer-order-tabs" aria-label="대리점별 매출현황">
      <button type="button" class="${state.filters.salesDealerCode === "전체" ? "active" : ""}" data-sales-dealer="전체">
        <span>통합 매출현황</span>
        <strong>${money(totalRevenue)}</strong>
      </button>
      ${options.map((dealer) => `
        <button type="button" class="${state.filters.salesDealerCode === dealer.dealer_code ? "active" : ""}" data-sales-dealer="${escapeAttr(dealer.dealer_code)}">
          <span>${escapeHtml(dealer.dealer_name)}</span>
          <strong>${money(dealer.revenue)}</strong>
        </button>
      `).join("")}
    </section>
  `;
}

function renderSalesCalendarPanel() {
  const period = state.filters.salesPeriod;
  const picker = period === "일별" ? renderSalesDayCalendarPicker() : period === "월별" ? renderSalesMonthCalendarPicker() : "";
  return `
    <section class="order-calendar-panel sales-calendar-panel" aria-label="매출 기간 선택">
      <div class="period-toggle">
        ${[
          ["전체", "전체 기간"],
          ["일별", "일별"],
          ["월별", "월별"]
        ].map(([value, label]) => `<button type="button" class="${period === value ? "active" : ""}" data-sales-period="${value}">${label}</button>`).join("")}
      </div>
      ${period === "전체" ? `
        <div class="calendar-summary">
          <span>기간 제한 없음</span>
          <strong>완료된 전체 매출을 확인합니다</strong>
        </div>
      ` : `
        <div class="calendar-card ${period === "월별" ? "month-mode" : "day-mode"}">
          ${period === "월별" ? `<button type="button" class="year-step-button" data-sales-year-step="-1" aria-label="이전 연도">작년</button>` : ""}
          <button type="button" class="date-step-button" data-sales-date-step="-1" aria-label="이전 ${period === "일별" ? "날짜" : "월"}">&lt;</button>
          <div class="calendar-display" aria-live="polite">
            <span>${period === "일별" ? "일별 매출 날짜" : "월별 매출"}</span>
            <strong>${escapeHtml(salesCalendarLabel())}</strong>
          </div>
          <button type="button" class="date-step-button" data-sales-date-step="1" aria-label="다음 ${period === "일별" ? "날짜" : "월"}">&gt;</button>
          ${period === "월별" ? `<button type="button" class="year-step-button" data-sales-year-step="1" aria-label="다음 연도">내년</button>` : ""}
          <button type="button" class="calendar-current-button" data-sales-date-current>${period === "일별" ? "오늘" : "이번 달"}</button>
        </div>
        ${picker}
      `}
    </section>
  `;
}

function renderSalesDayCalendarPicker() {
  const selectedDate = parseDateInput(state.filters.salesDate);
  const selectedValue = dateInputValue(selectedDate);
  const todayValue = dateInputValue();
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstOfMonth.getDay());
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const value = dateInputValue(date);
    const classes = [
      "calendar-day",
      date.getMonth() !== month ? "is-muted" : "",
      value === selectedValue ? "active" : "",
      value === todayValue ? "is-today" : ""
    ].filter(Boolean).join(" ");
    return `
      <button type="button" class="${classes}" data-sales-day="${value}" aria-label="${escapeAttr(value)} 매출 조회">
        <span>${date.getDate()}</span>
      </button>
    `;
  }).join("");

  return `
    <div class="calendar-picker-shell day-picker" aria-label="매출 일별 달력">
      <div class="calendar-board-head">
        <span>날짜 선택</span>
        <strong>${year}년 ${month + 1}월</strong>
      </div>
      <div class="calendar-weekdays">
        ${weekdays.map((day) => `<span>${day}</span>`).join("")}
      </div>
      <div class="day-calendar-grid">
        ${cells}
      </div>
    </div>
  `;
}

function renderSalesMonthCalendarPicker() {
  const selectedDate = parseMonthInput(state.filters.salesMonth);
  const selectedValue = monthInputValue(selectedDate);
  const currentValue = monthInputValue();
  const year = selectedDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, index) => {
    const value = `${year}-${String(index + 1).padStart(2, "0")}`;
    const classes = [
      "month-picker-button",
      value === selectedValue ? "active" : "",
      value === currentValue ? "is-current" : ""
    ].filter(Boolean).join(" ");
    return `
      <button type="button" class="${classes}" data-sales-month-value="${value}" aria-label="${escapeAttr(`${year}년 ${index + 1}월 매출 조회`)}">
        <span>${index + 1}월</span>
        <small>${year}</small>
      </button>
    `;
  }).join("");

  return `
    <div class="calendar-picker-shell month-picker" aria-label="매출 월별 선택">
      <div class="calendar-board-head">
        <span>월 선택</span>
        <strong>${year}년</strong>
      </div>
      <div class="month-picker-grid">
        ${months}
      </div>
    </div>
  `;
}

function renderSalesRow(row) {
  return `
    <tr>
      <td>
        <strong>${escapeHtml(orderDatePart(row.created_at) || "-")}</strong>
        <div class="product-meta">${escapeHtml(row.order_id)}</div>
      </td>
      <td>
        <strong>${escapeHtml(row.dealer_name || row.dealer_code)}</strong>
        <div class="product-meta">${escapeHtml(row.dealer_code)} · ${escapeHtml(row.created_by_login_id || "담당자 미기록")}</div>
      </td>
      <td>
        <strong>${escapeHtml(row.product_name)}</strong>
        <div class="product-meta">${escapeHtml(row.sku)}</div>
      </td>
      <td>${roll(row.qty)}</td>
      <td>${money(row.unitRetailPrice)}</td>
      <td>${percent(row.discountRate)}</td>
      <td><strong>${money(row.revenue)}</strong></td>
      <td>${money(row.cost)}</td>
      <td><strong class="${row.profit < 0 ? "negative-profit" : "positive-profit"}">${money(row.profit)}</strong></td>
    </tr>
  `;
}

function renderOrderCreate() {
  const product = selectedProduct();
  const dealerInventory = state.inventory.find((row) => row.sku === product?.sku && row.dealer_code === state.session?.dealer_code);
  const staffId = state.session?.login_id || "";
  const discountRate = dealerDiscountRate(state.session?.dealer_code);
  return `
    <main class="screen ${state.screen === "orderCreate" ? "active" : ""}" data-screen="orderCreate">
      <section class="page-head">
        <p class="eyebrow">${escapeHtml(currentDealerName())}</p>
        <h1>발주신청</h1>
        <p class="lead">필요한 PPF/틴팅 제품과 수량을 입력하면 발주 상태가 “접수”로 등록됩니다.</p>
      </section>

      <section class="work-layout">
        <div class="panel list-panel">
          <h3>제품 선택</h3>
          <input class="search-input" id="inventoryQuery" type="search" placeholder="제품명, SKU, 컬러 검색" value="${escapeAttr(state.filters.inventoryQuery)}" />
          <div class="product-list" id="orderProductList">
            ${filteredProducts().slice(0, 12).map(renderProductRow).join("") || `<div class="empty">판매중 제품이 없습니다.</div>`}
          </div>
        </div>

        <div class="panel form-panel">
          <h3>발주 정보</h3>
          <div class="detail-card">
            <h2>${escapeHtml(product?.product_name || "제품 선택")}</h2>
            <p class="muted">${escapeHtml(product?.sku || "-")} · ${escapeHtml(product?.category || "-")}</p>
            <p class="muted">담당자 ID: ${escapeHtml(staffId || "-")}</p>
            <p class="muted">소비자가 ${money(productRetailPrice(product))} · 내 적용가 ${money(dealerSalePrice(product, state.session?.dealer_code))} · 할인율 ${percent(discountRate)}</p>
          </div>
          <div class="stock-grid">
            <div class="stock-box">
              <span>현재 재고</span>
              <strong>${roll(Number(dealerInventory?.stock_qty || 0))}</strong>
            </div>
            <div class="stock-box">
              <span>안전재고</span>
              <strong>${roll(Number(dealerInventory?.safety_stock || 0))}</strong>
            </div>
            <div class="stock-box">
              <span>상태</span>
              <strong>${dealerInventory && Number(dealerInventory.stock_qty) <= Number(dealerInventory.safety_stock) ? "부족" : "정상"}</strong>
            </div>
          </div>
          <div class="form-grid">
            <label class="field">
              <span>발주 수량</span>
              <input id="orderQty" type="number" min="1" inputmode="numeric" value="${escapeAttr(state.forms.orderQty)}" />
            </label>
            <label class="field">
              <span>메모</span>
              <textarea id="orderMemo" placeholder="배송 요청사항 또는 참고사항">${escapeHtml(state.forms.orderMemo)}</textarea>
            </label>
            <button type="button" class="primary-button" data-action="createOrder">발주 등록</button>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderReservations() {
  if (state.session?.role !== "dealer") return "";
  const product = selectedProduct();
  return `
    <main class="screen ${state.screen === "reservations" ? "active" : ""}" data-screen="reservations">
      <section class="page-head">
        <p class="eyebrow">${escapeHtml(currentDealerName())}</p>
        <h1>예약관리</h1>
        <p class="lead">예약 제품을 입력하면 현재 재고를 바로 확인하고, 부족 시 재고부족으로 표시합니다.</p>
        <div class="page-actions">
          <button class="secondary-button" type="button" data-nav="inventory">재고조회</button>
          <button class="secondary-button" type="button" data-action="refresh">새로고침</button>
        </div>
      </section>

      <section class="work-layout">
        <div class="panel list-panel">
          <h3>예약 제품 선택</h3>
          <input class="search-input" id="inventoryQuery" type="search" placeholder="제품명, SKU, 컬러 검색" value="${escapeAttr(state.filters.inventoryQuery)}" />
          <div class="product-list" id="reservationProductList">
            ${filteredProducts().slice(0, 12).map(renderProductRow).join("") || `<div class="empty">판매중 제품이 없습니다.</div>`}
          </div>
        </div>

        <div class="panel form-panel">
          <h3>예약 입력</h3>
          <div id="reservationStockPanel">
            ${renderReservationStockPanel(product)}
          </div>
          <div class="form-grid">
            <label class="field">
              <span>고객명</span>
              <input id="reservationCustomerName" type="text" value="${escapeAttr(state.forms.reservationCustomerName)}" placeholder="예: 홍길동" />
            </label>
            <label class="field">
              <span>연락처</span>
              <input id="reservationCustomerPhone" type="tel" inputmode="numeric" maxlength="13" value="${escapeAttr(state.forms.reservationCustomerPhone)}" placeholder="예: 010-0000-0000" />
            </label>
            <label class="field">
              <span>예약 날짜</span>
              <input id="reservationDate" type="date" value="${escapeAttr(state.forms.reservationDate || dateInputValue())}" />
            </label>
            <label class="field">
              <span>예약 수량</span>
              <input id="reservationQty" type="number" min="1" inputmode="numeric" value="${escapeAttr(state.forms.reservationQty)}" />
            </label>
            <label class="field">
              <span>메모</span>
              <textarea id="reservationMemo" placeholder="시공일, 차량정보 등">${escapeHtml(state.forms.reservationMemo)}</textarea>
            </label>
            <button type="button" class="primary-button" data-action="createReservation">예약 저장</button>
          </div>
        </div>
      </section>

      <section class="panel list-panel">
        <h3>예약 내역</h3>
        <div class="order-list">
          ${visibleReservations().slice(0, 12).map(renderReservationCard).join("") || `<div class="empty">예약 내역이 없습니다.</div>`}
        </div>
      </section>
    </main>
  `;
}

function renderReservationStockPanel(product, summary = reservationStockSummary(product?.sku)) {
  const qty = Number(state.forms.reservationQty || 0);
  const afterAvailable = Math.max(summary.availableStock - qty, 0);
  const isShort = qty > summary.availableStock;
  return `
    <div class="detail-card ${isShort ? "is-low" : ""}">
      <h2>${escapeHtml(product?.product_name || "제품 선택")}</h2>
      <p class="muted">${escapeHtml(product?.sku || "-")} · 현재 재고 ${roll(summary.currentStock)} · 시공 전 예약 ${roll(summary.pendingQty)} · 예약 가능 ${roll(summary.availableStock)}</p>
      <div class="stock-grid reservation-stock-grid">
        <div class="stock-box">
          <span>현재 재고</span>
          <strong>${roll(summary.currentStock)}</strong>
        </div>
        <div class="stock-box warn-box">
          <span>시공 전 예약</span>
          <strong>${roll(summary.pendingQty)}</strong>
        </div>
        <div class="stock-box ${summary.availableStock <= 0 ? "danger-box" : ""}">
          <span>예약 가능</span>
          <strong>${roll(summary.availableStock)}</strong>
        </div>
        <div class="stock-box ${isShort ? "danger-box" : ""}">
          <span>예약 후 가능</span>
          <strong>${roll(afterAvailable)}</strong>
        </div>
      </div>
      ${isShort ? `<p class="form-note danger-text">현재 재고에서 시공 전 예약을 제외하면 재고가 부족합니다. 발주 또는 입고 확인이 필요합니다.</p>` : `<p class="form-note">현재 재고와 시공 전 예약을 반영해 예약 대응이 가능합니다.</p>`}
    </div>
  `;
}

function renderOrderDealerTabs() {
  const options = orderDealerOptions();
  const totalCount = state.orders.length;
  return `
    <section class="dealer-order-tabs" aria-label="대리점별 발주현황">
      <button type="button" class="${state.filters.dealerCode === "전체" ? "active" : ""}" data-order-dealer="전체">
        <span>통합 발주현황</span>
        <strong>${totalCount}건</strong>
      </button>
      ${options.map((dealer) => `
        <button type="button" class="${state.filters.dealerCode === dealer.dealer_code ? "active" : ""}" data-order-dealer="${escapeAttr(dealer.dealer_code)}">
          <span>${escapeHtml(dealer.dealer_name)}</span>
          <strong>${dealer.count}건</strong>
        </button>
      `).join("")}
    </section>
  `;
}

function renderOrderStatsCards(rows, stats = orderReportStats(rows)) {
  if (state.session?.role === "dealer") {
    const amountStats = orderAmountStats(rows);
    return `
      <article class="stat-card">
        <span>전체 발주</span>
        <strong>${stats.count}건</strong>
        <small>내 대리점 조회 기준</small>
      </article>
      <article class="stat-card">
        <span>진행중 발주</span>
        <strong>${stats.inProgress}건</strong>
        <small>접수 · 승인 · 출고</small>
      </article>
      <article class="stat-card">
        <span>완료 발주</span>
        <strong>${stats.done}건</strong>
        <small>처리 완료</small>
      </article>
      <article class="stat-card">
        <span>총 발주금액</span>
        <strong>${money(amountStats.orderAmount)}</strong>
        <small>취소 · 반려 제외</small>
      </article>
    `;
  }
  return `
    <article class="stat-card">
      <span>조회 발주</span>
      <strong>${stats.count}건</strong>
      <small>${state.filters.dealerCode === "전체" ? "통합 기준" : "선택 기준"}</small>
    </article>
    <article class="stat-card">
      <span>총 수량</span>
      <strong>${roll(stats.qty)}</strong>
      <small>조회 결과 합산</small>
    </article>
    <article class="stat-card">
      <span>접수</span>
      <strong>${stats.received}건</strong>
      <small>처리 전 발주</small>
    </article>
    <article class="stat-card">
      <span>완료</span>
      <strong>${stats.done}건</strong>
      <small>완료 처리</small>
    </article>
  `;
}

function renderOrderCalendarPanel() {
  const period = state.filters.orderPeriod;
  const picker = period === "일별" ? renderDayCalendarPicker() : period === "월별" ? renderMonthCalendarPicker() : "";
  return `
    <section class="order-calendar-panel" aria-label="발주 기간 선택">
      <div class="period-toggle">
        ${[
          ["전체", "전체 기간"],
          ["일별", "일별"],
          ["월별", "월별"]
        ].map(([value, label]) => `<button type="button" class="${period === value ? "active" : ""}" data-order-period="${value}">${label}</button>`).join("")}
      </div>
      ${period === "전체" ? `
        <div class="calendar-summary">
          <span>기간 제한 없음</span>
          <strong>전체 발주를 확인합니다</strong>
        </div>
      ` : `
        <div class="calendar-card ${period === "월별" ? "month-mode" : "day-mode"}">
          ${period === "월별" ? `<button type="button" class="year-step-button" data-order-year-step="-1" aria-label="이전 연도">작년</button>` : ""}
          <button type="button" class="date-step-button" data-order-date-step="-1" aria-label="이전 ${period === "일별" ? "날짜" : "월"}">&lt;</button>
          <div class="calendar-display" aria-live="polite">
            <span>${period === "일별" ? "일별 조회 날짜" : "월별 조회"}</span>
            <strong>${escapeHtml(orderCalendarLabel())}</strong>
          </div>
          <button type="button" class="date-step-button" data-order-date-step="1" aria-label="다음 ${period === "일별" ? "날짜" : "월"}">&gt;</button>
          ${period === "월별" ? `<button type="button" class="year-step-button" data-order-year-step="1" aria-label="다음 연도">내년</button>` : ""}
          <button type="button" class="calendar-current-button" data-order-date-current>${period === "일별" ? "오늘" : "이번 달"}</button>
        </div>
        ${picker}
      `}
    </section>
  `;
}

function renderDayCalendarPicker() {
  const selectedDate = parseDateInput(state.filters.orderDate);
  const selectedValue = dateInputValue(selectedDate);
  const todayValue = dateInputValue();
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstOfMonth.getDay());
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const value = dateInputValue(date);
    const classes = [
      "calendar-day",
      date.getMonth() !== month ? "is-muted" : "",
      value === selectedValue ? "active" : "",
      value === todayValue ? "is-today" : ""
    ].filter(Boolean).join(" ");
    return `
      <button type="button" class="${classes}" data-order-day="${value}" aria-label="${escapeAttr(value)} 발주 조회">
        <span>${date.getDate()}</span>
      </button>
    `;
  }).join("");

  return `
    <div class="calendar-picker-shell day-picker" aria-label="일별 달력">
      <div class="calendar-board-head">
        <span>날짜 선택</span>
        <strong>${year}년 ${month + 1}월</strong>
      </div>
      <div class="calendar-weekdays">
        ${weekdays.map((day) => `<span>${day}</span>`).join("")}
      </div>
      <div class="day-calendar-grid">
        ${cells}
      </div>
    </div>
  `;
}

function renderMonthCalendarPicker() {
  const selectedDate = parseMonthInput(state.filters.orderMonth);
  const selectedValue = monthInputValue(selectedDate);
  const currentValue = monthInputValue();
  const year = selectedDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, index) => {
    const value = `${year}-${String(index + 1).padStart(2, "0")}`;
    const classes = [
      "month-picker-button",
      value === selectedValue ? "active" : "",
      value === currentValue ? "is-current" : ""
    ].filter(Boolean).join(" ");
    return `
      <button type="button" class="${classes}" data-order-month-value="${value}" aria-label="${escapeAttr(`${year}년 ${index + 1}월 발주 조회`)}">
        <span>${index + 1}월</span>
        <small>${year}</small>
      </button>
    `;
  }).join("");

  return `
    <div class="calendar-picker-shell month-picker" aria-label="월별 선택">
      <div class="calendar-board-head">
        <span>월 선택</span>
        <strong>${year}년</strong>
      </div>
      <div class="month-picker-grid">
        ${months}
      </div>
    </div>
  `;
}

function renderDealerLinks() {
  const dealerAccounts = state.accounts.filter((account) => account.role === "dealer" && toBool(account.is_active));
  const commonUrl = commonLoginUrl();
  return `
    <main class="screen ${state.screen === "links" ? "active" : ""}" data-screen="links">
      <section class="page-head">
        <p class="eyebrow">QR / 카카오톡 안내문</p>
        <h1>공통 접속 링크와 QR</h1>
        <p class="lead">모든 대리점은 동일한 링크와 QR로 접속하고, 로그인할 때 대리점별 아이디와 대리점 코드를 입력합니다.</p>
        <div class="page-actions">
          <button class="secondary-button" type="button" data-action="refreshLinks">링크 새로고침</button>
        </div>
      </section>

      <section class="link-grid">
        ${renderCommonLinkCard(commonUrl)}
      </section>

      <section class="panel list-panel message-panel">
        <h3>대리점별 카카오톡 안내문</h3>
        <p class="product-meta">접속 링크는 모두 같고, 로그인 정보만 대리점별로 다르게 안내합니다.</p>
        <div class="account-list">
          ${dealerAccounts.map(renderDealerLinkCard).join("") || `<div class="empty">활성 대리점 계정이 없습니다.</div>`}
        </div>
      </section>
    </main>
  `;
}

function renderDealerFilter() {
  return "";
}

function renderInventoryScopeSwitch(scope) {
  const options = state.session?.role === "admin"
    ? [
        ["headOffice", "본사 재고"],
        ["dealerAll", "전체 대리점/샵 재고"]
      ]
    : [
        ["mine", "내 대리점/샵 재고"],
        ["headOffice", "본사 재고"],
        ["dealerAll", "전체 대리점/샵 재고"]
      ];
  return `
    <section class="scope-switch" aria-label="재고 조회 범위">
      ${options.map(([value, label]) => `<button type="button" class="${scope === value ? "active" : ""}" data-inventory-scope="${value}">${label}</button>`).join("")}
    </section>
  `;
}

function renderInventoryOwnerName(row) {
  if (row.dealer_code === headOfficeCode) return headOfficeName;
  return row.dealer_name || row.dealer_code;
}

function renderInventoryOwnerMeta(row) {
  if (row.dealer_code === headOfficeCode) return `${headOfficeCode} · 본사 재고`;
  const isMine = state.session?.role === "dealer" && row.dealer_code === state.session.dealer_code;
  return `${row.dealer_code}${isMine ? " · 내 대리점/샵" : ""}`;
}

function renderInventoryRow(row) {
  const isLow = Number(row.stock_qty || 0) <= Number(row.safety_stock || 0);
  return `
    <tr class="${isLow ? "is-low" : ""}">
      <td>
        <strong>${escapeHtml(renderInventoryOwnerName(row))}</strong>
        <div class="product-meta">${escapeHtml(renderInventoryOwnerMeta(row))}</div>
      </td>
      <td>
        <strong>${escapeHtml(row.product_name)}</strong>
        <div class="product-meta">${escapeHtml(row.category || "")} ${row.color ? `· ${escapeHtml(row.color)}` : ""}</div>
      </td>
      <td>${escapeHtml(row.sku)}</td>
      <td><strong>${roll(Number(row.stock_qty || 0))}</strong></td>
      <td>${roll(Number(row.safety_stock || 0))}</td>
      <td>${escapeHtml(row.location || "-")}</td>
    </tr>
  `;
}

function renderInventoryEditRow(row) {
  const isLow = Number(row.stock_qty || 0) <= Number(row.safety_stock || 0);
  return `
    <button type="button" class="product-row ${state.forms.inventoryDealerCode === row.dealer_code && state.forms.inventorySku === row.sku ? "active" : ""}" data-edit-inventory-dealer="${escapeAttr(row.dealer_code)}" data-edit-inventory-sku="${escapeAttr(row.sku)}">
      <span class="color-dot" style="background:${colorHex(row.color || row.product_name)}"></span>
      <span>
        <span class="product-name">${escapeHtml(row.product_name)}</span>
        <span class="product-meta">${escapeHtml(row.dealer_name || row.dealer_code)} · ${escapeHtml(row.sku)}${isLow ? " · 안전재고 이하" : ""}</span>
      </span>
      <span class="stock-mini">
        <strong>${roll(Number(row.stock_qty || 0))}</strong>
        <span>현재</span>
      </span>
    </button>
  `;
}

function renderProductRow(product) {
  const active = product.sku === state.selectedSku;
  const inventory = state.inventory.find((row) => row.sku === product.sku && row.dealer_code === state.session?.dealer_code);
  const discountRate = dealerDiscountRate(state.session?.dealer_code);
  return `
    <button type="button" class="product-row ${active ? "active" : ""}" data-sku="${escapeAttr(product.sku)}">
      <span class="color-dot" style="background:${colorHex(product.color || product.product_name)}"></span>
      <span>
        <span class="product-name">${escapeHtml(product.product_name)}</span>
        <span class="product-meta">${escapeHtml(product.sku)} · ${escapeHtml(product.category || "")}</span>
        <span class="product-meta">소비자가 ${money(productRetailPrice(product))} · 내 적용가 ${money(dealerSalePrice(product, state.session?.dealer_code))} (${percent(discountRate)} 할인)</span>
      </span>
      <span class="stock-mini">
        <strong>${roll(Number(inventory?.stock_qty || 0))}</strong>
        <span>현재</span>
      </span>
    </button>
  `;
}

function renderProductManageRow(product) {
  return `
    <article class="product-manage-row">
      <button type="button" class="product-row ${state.forms.productSku === product.sku ? "active" : ""}" data-edit-product="${escapeAttr(product.sku)}">
        <span class="color-dot" style="background:${colorHex(product.color || product.product_name)}"></span>
        <span>
          <span class="product-name">${escapeHtml(product.product_name)}</span>
          <span class="product-meta">${escapeHtml(product.sku)} · ${escapeHtml(product.category || "")} · ${toBool(product.is_active) ? "판매중" : "중지"}</span>
          <span class="product-meta">소비자가 ${money(productRetailPrice(product))} · 매입가 ${money(productPurchasePrice(product))}</span>
        </span>
        <span class="stock-mini">
          <strong>${escapeHtml(product.unit || "롤")}</strong>
          <span>단위</span>
        </span>
      </button>
      <button type="button" class="secondary-button small-button danger-button" data-action="deleteProduct" data-sku="${escapeAttr(product.sku)}">삭제</button>
    </article>
  `;
}

function renderOrderCard(order) {
  const canChange = state.session?.role === "admin";
  const canCancel = state.session?.role === "dealer" && order.dealer_code === state.session.dealer_code && order.status === "접수";
  const canReceive = state.session?.role === "dealer" &&
    order.dealer_code === state.session.dealer_code &&
    ["출고", "완료"].includes(order.status) &&
    !order.dealer_received_at;
  const trackingNo = orderTrackingNo(order);
  const canPrintLabel = canChange && Boolean(trackingNo);
  const printCount = Number(order.print_count || 0);
  const hasShipping = order.courier || order.tracking_no || order.shipping_receipt_no || order.shipping_company || order.tracking_number;
  const hasRecipient = order.recipient_name || order.recipient_phone || order.recipient_address || order.shipping_memo;
  const hasRecipientOrShipping = hasRecipient || hasShipping;
  const staffId = order.created_by_login_id || "";
  const recipientAddress = [order.recipient_zipcode ? `(${order.recipient_zipcode})` : "", order.recipient_address, order.recipient_address_detail].filter(Boolean).join(" ");
  return `
    <article class="order-card">
      <div>
        <span class="badge ${statusTone(order.status)}">${escapeHtml(orderStatusLabel(order.status))}</span>
        <h3>${escapeHtml(order.product_name)}</h3>
        <p class="product-meta">${escapeHtml(order.order_id)} · ${escapeHtml(order.sku)}</p>
        <p class="product-meta">${escapeHtml(order.dealer_name)} · ${escapeHtml(order.dealer_code)}</p>
        ${staffId ? `<p class="product-meta">담당자 ID: ${escapeHtml(staffId)}</p>` : ""}
      </div>
      <div class="order-side">
        <strong>${roll(Number(order.qty || 0))}</strong>
        <span>${escapeHtml(order.created_at || "")}</span>
      </div>
      <p class="order-memo">${escapeHtml(order.memo || "메모 없음")}</p>
      ${hasRecipientOrShipping ? `
        <div class="shipping-info">
          <strong>수령/배송 정보</strong>
          <span>${escapeHtml(order.recipient_name || "담당자 미입력")} · ${escapeHtml(order.recipient_phone || "전화번호 미입력")}</span>
          <span>${escapeHtml(recipientAddress || "주소 미입력")}</span>
          ${order.shipping_memo ? `<span>메모: ${escapeHtml(order.shipping_memo)}</span>` : ""}
          ${hasShipping ? `<span>배송: ${escapeHtml(order.courier || order.shipping_company || "택배사 미입력")} · ${escapeHtml(order.tracking_no || order.tracking_number || "송장번호 미입력")}</span>` : ""}
          ${order.shipping_receipt_no ? `<span>접수번호: ${escapeHtml(order.shipping_receipt_no)}</span>` : ""}
          ${order.approved_at ? `<span>승인일: ${escapeHtml(order.approved_at)}</span>` : ""}
          ${order.print_status ? `<span>출력상태: ${escapeHtml(printStatusLabel(order.print_status))}${printCount ? ` · ${printCount}회` : ""}</span>` : ""}
          ${order.printed_at ? `<span>마지막 출력: ${escapeHtml(order.printed_at)}</span>` : ""}
        </div>
      ` : ""}
      ${order.shipping_error ? `
        <div class="shipping-info shipping-error">
          <strong>송장 생성 오류</strong>
          <span>${escapeHtml(order.shipping_error)}</span>
        </div>
      ` : ""}
      ${canChange ? `
        <div class="order-actions">
          ${orderStatuses.map((status) => `<button type="button" class="${isOrderStatusActive(order.status, status) ? "active" : ""}" data-order-status="${status}" data-order-id="${escapeAttr(order.order_id)}">${status}</button>`).join("")}
          ${canPrintLabel ? `<button type="button" class="label-print-button" data-order-label-print="${escapeAttr(order.order_id)}">${printCount > 0 ? "재출력" : "송장출력"}</button>` : ""}
        </div>
      ` : ""}
      ${canCancel ? `
        <div class="order-actions">
          <button type="button" class="danger-button" data-action="cancelOrder" data-order-id="${escapeAttr(order.order_id)}">발주 취소</button>
        </div>
      ` : ""}
      ${canReceive ? `
        <div class="order-actions">
          <button type="button" class="primary-button" data-action="receiveOrder" data-order-id="${escapeAttr(order.order_id)}">입고완료</button>
        </div>
      ` : ""}
    </article>
  `;
}

function renderReservationCard(reservation) {
  const canComplete = state.session?.role === "dealer" &&
    reservation.dealer_code === state.session.dealer_code &&
    reservation.status !== "시공완료";
  const tone = reservation.status === "재고부족"
    ? "danger"
    : reservation.status === "시공완료"
      ? "ok"
      : "warn";
  return `
    <article class="order-card">
      <div>
        <span class="badge ${tone}">${escapeHtml(reservation.status || "예약")}</span>
        <h3>${escapeHtml(reservation.product_name)}</h3>
        <p class="product-meta">${escapeHtml(reservation.reservation_id || "")} · ${escapeHtml(reservation.sku)}</p>
        <p class="product-meta">${escapeHtml(reservation.customer_name || "고객명 미입력")} · ${escapeHtml(reservation.customer_phone || "연락처 미입력")}</p>
        <p class="product-meta">예약일: ${escapeHtml(reservation.reservation_date || "미지정")}</p>
      </div>
      <div class="order-side">
        <strong>${roll(Number(reservation.qty || 0))}</strong>
        <span>${escapeHtml(reservation.created_at || "")}</span>
      </div>
      <p class="order-memo">${escapeHtml(reservation.memo || "메모 없음")}</p>
      ${canComplete ? `
        <div class="order-actions">
          <button type="button" class="primary-button" data-action="completeReservation" data-reservation-id="${escapeAttr(reservation.reservation_id)}">시공완료</button>
        </div>
      ` : ""}
    </article>
  `;
}

function renderOrderMini(order) {
  return `
    <div class="history-item">
      <div class="history-time">${escapeHtml(order.status)}</div>
      <div>
        <div class="product-name">${escapeHtml(order.product_name)}</div>
        <div class="product-meta">${escapeHtml(order.dealer_name)} · ${escapeHtml(order.created_by_login_id || "담당자 미기록")} · ${escapeHtml(order.order_id)}</div>
      </div>
      <strong>${roll(Number(order.qty || 0))}</strong>
    </div>
  `;
}

function renderAccountRow(account) {
  const isSelf = state.session?.login_id === account.login_id;
  const isAdminSession = state.session?.role === "admin";
  const protectedAdmin = isProtectedRootAdmin(account);
  const dealerTopManager = isDealerTopManagerAccount(account);
  const canDealerManagerDelete = canManageDealerStaff() && !isAdminSession && account.role === "dealer" && !isSelf && !dealerTopManager && sameDealerCode(account.dealer_code, state.session?.dealer_code);
  const canCopyGuide = canManageDealerStaff() && account.role === "dealer" && (isAdminSession || sameDealerCode(account.dealer_code, state.session?.dealer_code));
  const guideButton = canCopyGuide
    ? `<button type="button" class="secondary-button small-button" data-share="${escapeAttr(accountKakaoGuideMessage(account))}">안내문 공유</button>`
    : "";
  const discountButton = isAdminSession && account.role === "dealer" && dealerTopManager
    ? `<button type="button" class="secondary-button small-button" data-action="updateDealerDiscount" data-dealer-code="${escapeAttr(account.dealer_code)}">할인율 수정</button>`
    : "";
  const resetButton = !protectedAdmin || isSelf
    ? `<button type="button" class="secondary-button small-button" data-action="resetPassword" data-login-id="${escapeAttr(account.login_id)}">PW 초기화</button>`
    : "";
  const dangerButtons = isSelf || protectedAdmin ? "" : `
      <button type="button" class="secondary-button small-button danger-button" data-action="deactivateAccount" data-login-id="${escapeAttr(account.login_id)}">사용중지</button>
      <button type="button" class="secondary-button small-button danger-button" data-action="deleteAccount" data-login-id="${escapeAttr(account.login_id)}">계정삭제</button>
    `;
  const dealerManagerButtons = canDealerManagerDelete
    ? `<button type="button" class="secondary-button small-button danger-button" data-action="deleteAccount" data-login-id="${escapeAttr(account.login_id)}">담당자 삭제</button>`
    : "";
  const actionButtons = isAdminSession ? `${guideButton}${discountButton}${resetButton}${dangerButtons}` : `${guideButton}${dealerManagerButtons}`;
  const discountMeta = account.role === "dealer" && dealerTopManager ? ` · 공통 할인율 ${percent(dealerDiscountRate(account.dealer_code))}` : "";
  return `
    <article class="account-row">
      <div>
        <span class="badge ${toBool(account.is_active) ? "" : "danger"}">${toBool(account.is_active) ? "사용중" : "중지"}</span>
        <h3>${escapeHtml(account.dealer_name)}</h3>
        <p class="product-meta">${roleLabel(account.role)} · ${escapeHtml(account.login_id)} · ${escapeHtml(account.dealer_code)}${discountMeta} · 최초로그인 ${toBool(account.is_first_login) ? "필요" : "완료"}${isSelf ? " · 현재 로그인 계정" : ""}${protectedAdmin ? " · 기본 관리자 보호" : ""}${dealerTopManager ? " · 최상위 관리자" : ""}</p>
      </div>
      ${actionButtons ? `<div class="account-actions">${actionButtons}</div>` : ""}
    </article>
  `;
}

function renderCommonLinkCard(url) {
  return `
    <article class="panel link-card common-link-card">
      <div class="link-card-head">
        <div>
          <h3>공통 접속 QR</h3>
          <p class="product-meta">모든 대리점 공용 로그인 링크</p>
        </div>
        <img class="qr-image" src="${escapeAttr(qrUrl(url))}" alt="공통 접속 QR" />
      </div>
      <label class="field">
        <span>공통 접속 링크</span>
        <input type="text" value="${escapeAttr(url)}" readonly />
      </label>
      <div class="page-actions">
        <button type="button" class="secondary-button" data-copy="${escapeAttr(url)}">링크 복사</button>
        <button type="button" class="primary-button" data-qr-download="${escapeAttr(url)}" data-file-name="gloc-common-qr.png">QR 다운로드</button>
      </div>
    </article>
  `;
}

function renderDealerLinkCard(account) {
  const url = commonLoginUrl();
  const tempPassword = state.tempPasswords[account.login_id] || "초기 발급/초기화한 비밀번호";
  const message = kakaoMessage(account, url, tempPassword);
  return `
    <article class="panel link-card">
      <div>
        <h3>${escapeHtml(account.dealer_name)}</h3>
        <p class="product-meta">${escapeHtml(account.dealer_code)} · ${escapeHtml(account.login_id)}</p>
      </div>
      <label class="field">
        <span>카카오톡 안내문</span>
        <textarea readonly>${escapeHtml(message)}</textarea>
      </label>
      <div class="page-actions">
        <button type="button" class="secondary-button" data-copy="${escapeAttr(message)}">안내문 복사</button>
      </div>
    </article>
  `;
}

function renderBottomNav() {
  if (!state.session || state.screen === "passwordChange" || state.screen === "onboarding") return "";
  const admin = state.session.role === "admin";
  const items = admin
    ? [
        ["admin", "대시보드"],
        ["inventory", "재고"],
        ["inventoryManage", "수정"],
        ["productManage", "제품"],
        ["orders", "발주"],
        ["sales", "매출"],
        ["dealers", "대리점"],
        ["dealerInfo", "정보"],
        ["links", "QR"],
        ["notifications", "알림"]
      ]
    : [
        ["inventory", "재고"],
        ["inventoryManage", "재고수정"],
        ["orderCreate", "발주신청"],
        ["orders", "내 발주"],
        ["reservations", "예약"],
        ["dealers", "담당자"],
        ["dealerInfo", "대리점 정보"],
        ["notifications", "알림"]
      ];
  return `
    <nav class="bottom-nav visible ${admin ? "admin-nav" : ""}" aria-label="하단 메뉴">
      ${items.map(([screen, label]) => `<button type="button" class="${state.screen === screen ? "active" : ""}" data-nav="${screen}">${label}</button>`).join("")}
      <button type="button" data-action="logout">로그아웃</button>
    </nav>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-login-role]").forEach((button) => {
    button.addEventListener("click", () => {
      state.forms.loginRole = button.dataset.loginRole;
      if (state.forms.loginRole === "admin") {
        state.forms.loginId = "admin";
        state.forms.dealerCode = "ADMIN";
      } else if (state.forms.loginId === "admin") {
        state.forms.loginId = "";
        state.forms.dealerCode = "";
      }
      render();
    });
  });

  bindInput("loginId", (value) => (state.forms.loginId = value));
  bindInput("loginPassword", (value) => (state.forms.password = value));
  bindInput("dealerCode", (value) => (state.forms.dealerCode = value.toUpperCase()));
  bindInput("currentPassword", (value) => (state.forms.currentPassword = value));
  bindInput("newPassword", (value) => (state.forms.newPassword = value));
  bindInput("newPasswordConfirm", (value) => (state.forms.newPasswordConfirm = value));
  bindInput("onboardingPassword", (value) => (state.forms.onboardingPassword = value));
  bindInput("onboardingPasswordConfirm", (value) => (state.forms.onboardingPasswordConfirm = value));
  bindInput("onboardingContactName", (value) => (state.forms.onboardingContactName = value));
  bindPhoneInput("onboardingPhone", (value) => (state.forms.onboardingPhone = value));
  bindInput("onboardingZipcode", (value) => (state.forms.onboardingZipcode = value));
  bindInput("onboardingAddress", (value) => (state.forms.onboardingAddress = value));
  bindInput("onboardingAddressDetail", (value) => (state.forms.onboardingAddressDetail = value));
  bindInput("dealerInfoContactName", (value) => (state.forms.dealerInfoContactName = value));
  bindPhoneInput("dealerInfoPhone", (value) => (state.forms.dealerInfoPhone = value));
  bindInput("dealerInfoZipcode", (value) => (state.forms.dealerInfoZipcode = value.replace(/\D/g, "").slice(0, 5)));
  bindInput("dealerInfoAddress", (value) => (state.forms.dealerInfoAddress = value));
  bindInput("dealerInfoAddressDetail", (value) => (state.forms.dealerInfoAddressDetail = value));
  bindInput("dealerInfoDefaultCourier", (value) => (state.forms.dealerInfoDefaultCourier = value));
  bindInput("dealerInfoShippingMemo", (value) => (state.forms.dealerInfoShippingMemo = value));
  bindInput("accountDealerCode", (value) => {
    state.forms.accountDealerCode = value.toUpperCase();
    syncAccountDealerNameFromCode();
    window.clearTimeout(accountFormRefreshTimer);
    accountFormRefreshTimer = window.setTimeout(render, 120);
  });
  bindInput("accountDealerName", (value) => (state.forms.accountDealerName = value));
  bindInput("accountLoginId", (value) => (state.forms.accountLoginId = value));
  bindInput("accountDiscountRate", (value) => (state.forms.accountDiscountRate = Number(value || 0)));
  bindInput("accountTemporaryPassword", (value) => (state.forms.accountTemporaryPassword = value));
  bindInput("inventoryStockQty", (value) => (state.forms.inventoryStockQty = Number(value || 0)));
  bindInput("inventorySafetyStock", (value) => (state.forms.inventorySafetyStock = Number(value || 0)));
  bindInput("inventoryLocation", (value) => (state.forms.inventoryLocation = value));
  bindInput("orderQty", (value) => (state.forms.orderQty = Number(value || 0)));
  bindInput("orderMemo", (value) => (state.forms.orderMemo = value));
  bindInput("saleQty", (value) => {
    state.forms.saleQty = Number(value || 0);
    refreshActiveSearchResults();
  });
  bindInput("saleMemo", (value) => (state.forms.saleMemo = value));
  bindInput("reservationCustomerName", (value) => (state.forms.reservationCustomerName = value));
  bindPhoneInput("reservationCustomerPhone", (value) => (state.forms.reservationCustomerPhone = value));
  bindInput("reservationDate", (value) => (state.forms.reservationDate = value || dateInputValue()));
  bindInput("reservationQty", (value) => {
    state.forms.reservationQty = Number(value || 0);
    refreshReservationStockPanel();
  });
  bindInput("reservationMemo", (value) => (state.forms.reservationMemo = value));
  bindInput("productSku", (value) => (state.forms.productSku = value.trim()));
  bindInput("productName", (value) => (state.forms.productName = value));
  bindInput("productUnit", (value) => (state.forms.productUnit = value));
  bindInput("productRetailPrice", (value) => (state.forms.productRetailPrice = Number(value || 0)));
  bindInput("productPurchasePrice", (value) => (state.forms.productPurchasePrice = Number(value || 0)));

  document.querySelector("#inventoryDealerCode")?.addEventListener("change", (event) => {
    state.forms.inventoryDealerCode = event.target.value;
    syncInventoryForm();
    render();
  });

  document.querySelector("#inventorySku")?.addEventListener("change", (event) => {
    state.forms.inventorySku = event.target.value;
    syncInventoryForm();
    render();
  });

  document.querySelector("#productCategory")?.addEventListener("change", (event) => {
    state.forms.productCategory = event.target.value;
  });

  document.querySelector("#accountRole")?.addEventListener("change", (event) => {
    state.forms.accountRole = event.target.value;
    state.forms.accountDealerCode = event.target.value === "admin" ? "ADMIN" : "";
    state.forms.accountDiscountRate = 0;
    render();
  });

  document.querySelector("#productIsActive")?.addEventListener("change", (event) => {
    state.forms.productIsActive = event.target.checked;
  });

  bindSearchInput("inventoryQuery", (value) => {
    state.filters.inventoryQuery = value;
    state.filters.inventoryPage = 1;
  });
  bindSearchInput("orderQuery", (value) => (state.filters.orderQuery = value));
  bindSearchInput("salesQuery", (value) => (state.filters.salesQuery = value));

  document.querySelector("#orderStatus")?.addEventListener("change", (event) => {
    state.filters.orderStatus = event.target.value;
    render();
  });

  document.querySelector("#labelSize")?.addEventListener("change", (event) => {
    state.forms.labelSize = event.target.value;
  });

  document.querySelector("#orderDate")?.addEventListener("change", (event) => {
    state.filters.orderDate = event.target.value;
    render();
  });

  document.querySelector("#orderMonth")?.addEventListener("change", (event) => {
    state.filters.orderMonth = event.target.value;
    render();
  });

  document.querySelectorAll("[data-order-period]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.orderPeriod = button.dataset.orderPeriod;
      if (!state.filters.orderDate) state.filters.orderDate = dateInputValue();
      if (!state.filters.orderMonth) state.filters.orderMonth = monthInputValue();
      render();
    });
  });

  document.querySelectorAll("[data-order-date-step]").forEach((button) => {
    button.addEventListener("click", () => {
      shiftOrderCalendar(Number(button.dataset.orderDateStep || 0));
      render();
    });
  });

  document.querySelectorAll("[data-order-year-step]").forEach((button) => {
    button.addEventListener("click", () => {
      shiftOrderYear(Number(button.dataset.orderYearStep || 0));
      render();
    });
  });

  document.querySelectorAll("[data-order-day]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.orderDate = button.dataset.orderDay;
      render();
    });
  });

  document.querySelectorAll("[data-order-month-value]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.orderMonth = button.dataset.orderMonthValue;
      render();
    });
  });

  document.querySelector("[data-order-date-current]")?.addEventListener("click", () => {
    if (state.filters.orderPeriod === "일별") state.filters.orderDate = dateInputValue();
    if (state.filters.orderPeriod === "월별") state.filters.orderMonth = monthInputValue();
    render();
  });

  document.querySelectorAll("[data-sales-period]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.salesPeriod = button.dataset.salesPeriod;
      if (!state.filters.salesDate) state.filters.salesDate = dateInputValue();
      if (!state.filters.salesMonth) state.filters.salesMonth = monthInputValue();
      render();
    });
  });

  document.querySelectorAll("[data-sales-date-step]").forEach((button) => {
    button.addEventListener("click", () => {
      shiftSalesCalendar(Number(button.dataset.salesDateStep || 0));
      render();
    });
  });

  document.querySelectorAll("[data-sales-year-step]").forEach((button) => {
    button.addEventListener("click", () => {
      shiftSalesYear(Number(button.dataset.salesYearStep || 0));
      render();
    });
  });

  document.querySelectorAll("[data-sales-day]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.salesDate = button.dataset.salesDay;
      render();
    });
  });

  document.querySelectorAll("[data-sales-month-value]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.salesMonth = button.dataset.salesMonthValue;
      render();
    });
  });

  document.querySelector("[data-sales-date-current]")?.addEventListener("click", () => {
    if (state.filters.salesPeriod === "일별") state.filters.salesDate = dateInputValue();
    if (state.filters.salesPeriod === "월별") state.filters.salesMonth = monthInputValue();
    render();
  });

  document.querySelectorAll("[data-inventory-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.inventoryScope = button.dataset.inventoryScope;
      state.filters.inventoryDealerCode = "전체";
      state.filters.inventoryPage = 1;
      render();
    });
  });

  document.querySelectorAll("[data-order-dealer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.dealerCode = button.dataset.orderDealer;
      render();
    });
  });

  document.querySelectorAll("[data-sales-dealer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.salesDealerCode = button.dataset.salesDealer;
      render();
    });
  });

  document.querySelectorAll("[data-color]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedColor = button.dataset.color;
      state.filters.inventoryPage = 1;
      const first = filteredProducts()[0];
      if (first) state.selectedSku = first.sku;
      render();
    });
  });

  bindDynamicListEvents(document);

  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.nav));
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      runWithButtonBusy(button, () => handleAction(button.dataset.action, button));
    });
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyText(button.dataset.copy));
  });

  document.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", () => shareText(button.dataset.share));
  });

  document.querySelectorAll("[data-qr-download]").forEach((button) => {
    button.addEventListener("click", () => downloadQr(button.dataset.qrDownload, button.dataset.fileName));
  });
}

function bindInput(id, update) {
  document.querySelector(`#${id}`)?.addEventListener("input", (event) => update(event.target.value));
}

function bindPhoneInput(id, update) {
  const input = document.querySelector(`#${id}`);
  if (!input) return;
  input.addEventListener("input", (event) => {
    const formatted = formatPhoneNumber(event.target.value);
    event.target.value = formatted;
    update(formatted);
  });
}

function bindDynamicListEvents(root) {
  root.querySelectorAll("[data-sku]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedSku = button.dataset.sku;
      render();
    });
  });

  root.querySelectorAll("[data-edit-inventory-sku]").forEach((button) => {
    button.addEventListener("click", () => {
      selectInventoryRow(button.dataset.editInventoryDealer, button.dataset.editInventorySku);
      render();
    });
  });

  root.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", () => {
      selectProductForEdit(button.dataset.editProduct);
      render();
    });
  });

  root.querySelectorAll("[data-order-status]").forEach((button) => {
    button.addEventListener("click", () => {
      runWithButtonBusy(button, () => updateOrderStatus(button.dataset.orderId, button.dataset.orderStatus));
    });
  });

  root.querySelectorAll("[data-order-label-print]").forEach((button) => {
    button.addEventListener("click", () => {
      runWithButtonBusy(button, () => printOrderLabel(button.dataset.orderLabelPrint));
    });
  });

  root.querySelectorAll("[data-inventory-dealer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.inventoryDealerCode = button.dataset.inventoryDealer;
      state.filters.inventoryPage = 1;
      render();
    });
  });

  root.querySelectorAll("[data-inventory-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.inventoryPage = Number(button.dataset.inventoryPage || 1);
      render();
    });
  });
}

async function runWithButtonBusy(button, task) {
  if (button.dataset.busy === "true") return;
  const originalText = button.textContent;
  button.dataset.busy = "true";
  button.disabled = true;
  button.classList.add("is-loading");
  button.textContent = "처리 중...";
  try {
    await task();
  } catch (error) {
    showToast(error.message || "처리 중 오류가 발생했습니다.");
  } finally {
    button.dataset.busy = "false";
    button.disabled = false;
    button.classList.remove("is-loading");
    button.textContent = originalText;
  }
}

function bindSearchInput(id, update) {
  document.querySelectorAll(`#${id}`).forEach((input) => {
    let composing = false;
    input.addEventListener("compositionstart", () => {
      composing = true;
    });
    input.addEventListener("compositionend", (event) => {
      composing = false;
      update(event.target.value);
      refreshActiveSearchResults();
    });
    input.addEventListener("input", (event) => {
      update(event.target.value);
      if (composing || event.isComposing) return;
      scheduleSearchRefresh();
    });
  });
}

function scheduleSearchRefresh() {
  window.clearTimeout(searchRefreshTimer);
  searchRefreshTimer = window.setTimeout(refreshActiveSearchResults, 80);
}

function refreshActiveSearchResults() {
  window.clearTimeout(searchRefreshTimer);

  if (state.screen === "inventory") {
    const rows = visibleInventory();
    const pageRows = paginatedInventoryRows(rows);
    replaceHtml("#inventoryStats", renderInventoryStatsCards(rows));
    replaceHtml("#inventoryRows", pageRows.map(renderInventoryRow).join("") || `<tr><td colspan="6" class="empty-cell">조회 결과가 없습니다.</td></tr>`);
    replaceHtml("#inventoryPager", renderInventoryPager(rows));
    replaceHtml("#inventoryDealerTabs", currentInventoryScope() === "dealerAll" ? renderInventoryDealerTabButtons() : "");
    return;
  }

  if (state.screen === "inventoryManage") {
    replaceHtml("#inventoryEditList", editableInventoryRows().slice(0, 16).map(renderInventoryEditRow).join("") || `<div class="empty">수정할 재고가 없습니다.</div>`);
    return;
  }

  if (state.screen === "orderCreate") {
    replaceHtml("#orderProductList", filteredProducts().slice(0, 12).map(renderProductRow).join("") || `<div class="empty">판매중 제품이 없습니다.</div>`);
    return;
  }

  if (state.screen === "reservations") {
    replaceHtml("#reservationProductList", filteredProducts().slice(0, 12).map(renderProductRow).join("") || `<div class="empty">판매중 제품이 없습니다.</div>`);
    refreshReservationStockPanel();
    return;
  }

  if (state.screen === "orders") {
    const rows = visibleOrders();
    replaceHtml("#orderStats", renderOrderStatsCards(rows));
    replaceHtml("#orderList", rows.map(renderOrderCard).join("") || `<div class="empty">발주 내역이 없습니다.</div>`);
    return;
  }

  if (state.screen === "sales") {
    const rows = visibleSalesRows();
    replaceHtml("#salesStats", renderSalesStatsCards(rows));
    replaceHtml("#salesRows", rows.map(renderSalesRow).join("") || `<tr><td colspan="9" class="empty-cell">완료된 매출 내역이 없습니다.</td></tr>`);
  }
}

function replaceHtml(selector, html) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.innerHTML = html;
  bindDynamicListEvents(target);
}

function refreshReservationStockPanel() {
  if (state.screen !== "reservations") return;
  replaceHtml("#reservationStockPanel", renderReservationStockPanel(selectedProduct()));
}

function isPushFeatureSupported() {
  return Boolean(
    window.isSecureContext &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function notificationPermission() {
  return "Notification" in window ? Notification.permission : "unsupported";
}

function syncPushSupportState() {
  state.push.supported = isPushFeatureSupported();
  state.push.permission = notificationPermission();
}

function pushCanSubscribe() {
  syncPushSupportState();
  return Boolean(
    state.session &&
    window.FilmStockApi?.isEnabled() &&
    config.vapidPublicKey &&
    state.push.supported &&
    state.push.permission !== "denied"
  );
}

function pushStatusText() {
  syncPushSupportState();
  if (!window.FilmStockApi?.isEnabled()) return "실데이터 모드에서만 발주 알림을 저장할 수 있습니다.";
  if (!config.vapidPublicKey) return "Vercel 환경변수 VAPID_PUBLIC_KEY가 설정되면 사용할 수 있습니다.";
  if (!state.push.supported) return "이 브라우저는 웹앱 푸시 알림을 지원하지 않습니다. iPhone은 홈 화면에 추가한 앱에서 사용해 주세요.";
  if (state.push.permission === "denied") return "알림 권한이 차단되어 있습니다. 휴대폰 설정에서 GLOC 알림을 허용해 주세요.";
  if (state.push.subscribed) {
    return state.session?.role === "admin"
      ? "이 기기는 새 발주가 등록되면 알림을 받을 수 있습니다."
      : "이 기기는 발주 승인, 출고, 반려 등 상태 변경 알림을 받을 수 있습니다.";
  }
  return state.push.message || "버튼을 눌러 이 기기에 발주 알림을 등록하세요.";
}

async function updatePushState(showDone = false) {
  syncPushSupportState();
  if (!state.push.supported) {
    state.push.subscribed = false;
    state.push.message = "이 브라우저는 웹앱 푸시 알림을 지원하지 않습니다.";
    render();
    if (showDone) showToast(state.push.message);
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("./service-worker.js");
    const subscription = await registration.pushManager.getSubscription();
    state.push.permission = notificationPermission();
    state.push.subscribed = Boolean(subscription);
    state.push.message = subscription
      ? "이 기기는 새 발주 알림을 받을 준비가 되어 있습니다."
      : "아직 이 기기에 발주 알림이 등록되지 않았습니다.";
    render();
    if (showDone) showToast(state.push.message);
  } catch (error) {
    state.push.subscribed = false;
    state.push.message = error.message || "알림 상태를 확인할 수 없습니다.";
    render();
    if (showDone) showToast(state.push.message);
  }
}

async function enablePushNotifications() {
  if (!state.session) throw new Error("로그인 후 발주 알림을 등록할 수 있습니다.");
  if (!window.FilmStockApi?.isEnabled()) throw new Error("발주 알림은 실데이터 모드에서 사용할 수 있습니다.");
  if (!config.vapidPublicKey) throw new Error("Vercel 환경변수 VAPID_PUBLIC_KEY를 먼저 설정해 주세요.");
  if (!isPushFeatureSupported()) throw new Error("이 브라우저는 웹앱 푸시 알림을 지원하지 않습니다. iPhone은 홈 화면에 추가한 앱에서 실행해 주세요.");

  const permission = await Notification.requestPermission();
  state.push.permission = permission;
  if (permission !== "granted") throw new Error("알림 권한이 허용되지 않았습니다.");

  const registration = await navigator.serviceWorker.register("./service-worker.js");
  let subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    try {
      await window.FilmStockApi.deletePushSubscription({
        endpoint: subscription.endpoint
      });
    } catch (error) {
      console.warn("기존 푸시 구독 삭제 실패", error);
    }
    await subscription.unsubscribe();
  }

  subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey)
  });

  await window.FilmStockApi.savePushSubscription({
    subscription: subscription.toJSON(),
    userAgent: navigator.userAgent
  });

  state.push.subscribed = true;
  state.push.message = "이 기기에 발주 알림이 등록되었습니다.";
  render();
  showToast("발주 알림이 등록되었습니다.");
}

async function updateAppBadgeCount(count) {
  try {
    if (count > 0 && "setAppBadge" in navigator) {
      await navigator.setAppBadge(count);
    } else if ("clearAppBadge" in navigator) {
      await navigator.clearAppBadge();
    }
  } catch (error) {
    console.warn("앱 배지 업데이트 실패", error);
  }
}

function syncAppBadgeFromOrders() {
  if (state.session?.role !== "admin") return;
  const pendingCount = state.orders.filter((order) => order.status === "접수").length;
  updateAppBadgeCount(pendingCount);
}

async function sendTestPushNotification() {
  if (!state.session) throw new Error("로그인 후 테스트 알림을 보낼 수 있습니다.");
  if (!window.FilmStockApi?.isEnabled()) throw new Error("테스트 알림은 실데이터 모드에서만 사용할 수 있습니다.");
  const data = await window.FilmStockApi.sendTestPushNotification();
  const notification = data?.notification || {};
  if (!notification.ok) {
    throw new Error(notification.reason || notification.error || notification.result?.error || "테스트 알림을 보낼 수 없습니다.");
  }
  const failed = Number(notification.result?.failed || 0);
  if (failed > 0) {
    throw new Error("테스트 알림 발송에 실패한 구독이 있습니다. 알림을 다시 등록해 주세요.");
  }
  showToast("테스트 알림을 보냈습니다.");
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }
  return outputArray;
}

async function handleAction(action, button) {
  if (action === "login") return login();
  if (action === "changePassword") return changePassword();
  if (action === "completeOnboarding") return completeOnboarding();
  if (action === "openPostcode") return openPostcode();
  if (action === "openDealerInfoPostcode") return openPostcodeFor("dealerInfo");
  if (action === "saveDealerInfo") return saveDealerInfo();
  if (action === "logout") return logout();
  if (action === "refresh") return refreshData();
  if (action === "refreshLinks") return refreshLinks();
  if (action === "enablePushNotifications") return enablePushNotifications();
  if (action === "checkPushNotifications") return updatePushState(true);
  if (action === "sendTestPushNotification") return sendTestPushNotification();
  if (action === "createOrder") return createOrder();
  if (action === "clearTestOrders") return clearTestOrders();
  if (action === "receiveOrder") return receiveOrder(button.dataset.orderId);
  if (action === "createReservation") return createReservation();
  if (action === "completeReservation") return completeReservation(button.dataset.reservationId);
  if (action === "cancelOrder") return cancelOrder(button.dataset.orderId);
  if (action === "saveInventory") return saveInventory();
  if (action === "saveProduct") return saveProduct();
  if (action === "createAccount") return createDealerAccount();
  if (action === "resetPassword") return resetDealerPassword(button.dataset.loginId);
  if (action === "updateDealerDiscount") return updateDealerDiscount(button.dataset.dealerCode);
  if (action === "deactivateAccount") return deactivateDealerAccount(button.dataset.loginId);
  if (action === "deleteAccount") return deleteDealerAccount(button.dataset.loginId);
  if (action === "deleteProduct") return deleteProduct(button.dataset.sku);
}

async function login() {
  const loginId = state.forms.loginId.trim();
  const password = state.forms.password.trim();
  const dealerCode = state.forms.dealerCode.trim().toUpperCase();
  if (!loginId || !password || !dealerCode) {
    throw new Error("아이디, 비밀번호, 대리점 코드를 모두 입력해 주세요.");
  }

  if (window.FilmStockApi?.isEnabled()) {
    showToast("로그인 확인 중입니다.");
    const data = await window.FilmStockApi.login({ loginId, password, dealerCode });
    applyRemoteSession(data);
  } else {
    const account = mockLogin(loginId, dealerCode);
    state.session = accountToSession(account);
  }

  state.forms.password = "";
  prepareOnboardingForm();
  prepareDealerInfoForm();
  state.screen = nextScreenAfterLogin();
  render();
  syncAppBadgeFromOrders();
  if (state.session) updatePushState(false);
  scrollTop();
  showToast(state.screen === "onboarding" ? "최초 설정을 완료해 주세요." : state.screen === "passwordChange" ? "비밀번호 변경이 필요합니다." : "로그인되었습니다.");
}

function mockLogin(loginId, dealerCode) {
  const account = state.accounts.find((item) => {
    const sameId = item.login_id.toLowerCase() === loginId.toLowerCase();
    if (!sameId || !toBool(item.is_active)) return false;
    if (item.role === "admin") return dealerCode === "ADMIN" || state.forms.loginRole === "admin";
    return item.dealer_code.toUpperCase() === dealerCode;
  });
  if (!account) throw new Error("계정 정보를 확인할 수 없습니다.");
  return account;
}

function applyRemoteSession(data) {
  if (!data?.user || !data?.session) throw new Error("로그인 응답이 올바르지 않습니다.");
  state.session = data.user;
  if (Array.isArray(data.accounts)) state.accounts = data.accounts;
  if (Array.isArray(data.products)) state.products = data.products;
  if (Array.isArray(data.inventory)) state.inventory = data.inventory;
  if (Array.isArray(data.orders)) state.orders = data.orders;
  if (Array.isArray(data.sales)) state.retailSales = data.sales;
  if (Array.isArray(data.reservations)) state.reservations = data.reservations;
  syncAppBadgeFromOrders();
}

function nextScreenAfterLogin() {
  if (needsDealerOnboarding(state.session)) return "onboarding";
  if (toBool(state.session?.is_first_login)) return "passwordChange";
  return defaultScreen();
}

function needsDealerOnboarding(account) {
  if (!account || account.role !== "dealer") return false;
  return toBool(account.is_first_login) || !String(account.profile_completed_at || "").trim();
}

function prepareOnboardingForm() {
  if (!state.session) return;
  state.forms.onboardingPassword = "";
  state.forms.onboardingPasswordConfirm = "";
  state.forms.onboardingContactName = state.session.contact_name || "";
  state.forms.onboardingPhone = state.session.phone || "";
  state.forms.onboardingZipcode = state.session.zipcode || "";
  state.forms.onboardingAddress = state.session.address || "";
  state.forms.onboardingAddressDetail = state.session.address_detail || "";
}

function prepareDealerInfoForm() {
  const profile = currentDealerProfile();
  state.forms.dealerInfoContactName = profile.contact_name || "";
  state.forms.dealerInfoPhone = profile.phone || "";
  state.forms.dealerInfoZipcode = profile.zipcode || "";
  state.forms.dealerInfoAddress = profile.address || "";
  state.forms.dealerInfoAddressDetail = profile.address_detail || "";
  state.forms.dealerInfoDefaultCourier = profile.default_courier || "";
  state.forms.dealerInfoShippingMemo = profile.shipping_memo || "";
}

async function changePassword() {
  const { currentPassword, newPassword, newPasswordConfirm } = state.forms;
  if (!currentPassword || !newPassword || !newPasswordConfirm) throw new Error("비밀번호를 모두 입력해 주세요.");
  if (newPassword.length < 8) throw new Error("새 비밀번호는 8자 이상으로 입력해 주세요.");
  if (newPassword !== newPasswordConfirm) throw new Error("새 비밀번호 확인이 일치하지 않습니다.");

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.changePassword({ currentPassword, newPassword });
    if (data?.user) state.session = data.user;
  } else {
    const account = state.accounts.find((item) => item.login_id === state.session.login_id);
    if (account) {
      account.is_first_login = false;
      account.updated_at = nowText();
      state.session = accountToSession(account);
    }
  }

  state.forms.currentPassword = "";
  state.forms.newPassword = "";
  state.forms.newPasswordConfirm = "";
  state.screen = defaultScreen();
  render();
  scrollTop();
  showToast("비밀번호가 변경되었습니다.");
}

async function completeOnboarding() {
  if (!state.session || state.session.role !== "dealer") throw new Error("대리점 계정으로 다시 로그인해 주세요.");
  const payload = onboardingPayload();

  if (!payload.new_password || !payload.new_password_confirm) throw new Error("새 비밀번호를 입력해 주세요.");
  if (payload.new_password.length < 8) throw new Error("새 비밀번호는 8자 이상으로 입력해 주세요.");
  if (payload.new_password !== payload.new_password_confirm) throw new Error("새 비밀번호 확인이 일치하지 않습니다.");
  if (!payload.contact_name) throw new Error("담당자 이름을 입력해 주세요.");
  if (!payload.phone) throw new Error("전화번호를 입력해 주세요.");
  if (!payload.zipcode || !payload.address) throw new Error("주소찾기로 배송 주소를 입력해 주세요.");

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.completeOnboarding(payload);
    if (data?.user) state.session = data.user;
    if (Array.isArray(data?.accounts)) state.accounts = data.accounts;
  } else {
    const account = state.accounts.find((item) => item.login_id === state.session.login_id);
    if (account) {
      account.contact_name = payload.contact_name;
      account.phone = payload.phone;
      account.zipcode = payload.zipcode;
      account.address = payload.address;
      account.address_detail = payload.address_detail;
      account.is_first_login = false;
      account.password_changed_at = nowText();
      account.profile_completed_at = nowText();
      account.updated_at = nowText();
      state.session = accountToSession(account);
    }
  }

  state.forms.onboardingPassword = "";
  state.forms.onboardingPasswordConfirm = "";
  state.screen = defaultScreen();
  render();
  scrollTop();
  showToast("최초 설정이 완료되었습니다.");
}

async function saveDealerInfo() {
  if (!state.session || state.session.role !== "dealer") throw new Error("대리점 계정만 대리점 정보를 수정할 수 있습니다.");
  const payload = dealerInfoPayload();
  validateDealerInfoPayload(payload);

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.updateDealerProfile(payload);
    if (data?.user) state.session = data.user;
    if (Array.isArray(data?.accounts)) state.accounts = data.accounts;
  } else {
    const now = nowText();
    state.accounts = state.accounts.map((account) => {
      if (account.role !== "dealer" || !sameDealerCode(account.dealer_code, state.session.dealer_code)) return account;
      return { ...account, ...payload, updated_at: now };
    });
    state.session = {
      ...state.session,
      ...payload,
      updated_at: now
    };
  }

  prepareDealerInfoForm();
  render();
  showToast("대리점 정보가 저장되었습니다.");
}

function onboardingPayload() {
  return {
    new_password: state.forms.onboardingPassword.trim(),
    new_password_confirm: state.forms.onboardingPasswordConfirm.trim(),
    contact_name: state.forms.onboardingContactName.trim(),
    phone: state.forms.onboardingPhone.trim(),
    zipcode: state.forms.onboardingZipcode.trim(),
    address: state.forms.onboardingAddress.trim(),
    address_detail: state.forms.onboardingAddressDetail.trim()
  };
}

function dealerInfoPayload() {
  return {
    contact_name: state.forms.dealerInfoContactName.trim(),
    phone: state.forms.dealerInfoPhone.trim(),
    zipcode: state.forms.dealerInfoZipcode.trim(),
    address: state.forms.dealerInfoAddress.trim(),
    address_detail: state.forms.dealerInfoAddressDetail.trim(),
    default_courier: state.forms.dealerInfoDefaultCourier.trim(),
    shipping_memo: state.forms.dealerInfoShippingMemo.trim()
  };
}

function validateDealerInfoPayload(payload) {
  if (!payload.contact_name) throw new Error("담당자 이름을 입력해 주세요.");
  if (!payload.phone) throw new Error("전화번호를 입력해 주세요.");
  if (!/^\d{5}$/.test(payload.zipcode)) throw new Error("우편번호는 숫자 5자리로 입력해 주세요.");
  if (!payload.address) throw new Error("주소를 입력해 주세요.");
}

async function openPostcode() {
  return openPostcodeFor("onboarding");
}

async function openPostcodeFor(target) {
  await loadDaumPostcode();
  if (!window.daum?.Postcode) throw new Error("주소찾기 서비스를 시작할 수 없습니다.");
  await new Promise((resolve) => {
    new window.daum.Postcode({
      oncomplete(data) {
        const zipcode = data.zonecode || "";
        const address = data.roadAddress || data.jibunAddress || "";
        if (target === "dealerInfo") {
          state.forms.dealerInfoZipcode = zipcode;
          state.forms.dealerInfoAddress = address;
        } else {
          state.forms.onboardingZipcode = zipcode;
          state.forms.onboardingAddress = address;
        }
        render();
        window.setTimeout(() => {
          const detailId = target === "dealerInfo" ? "#dealerInfoAddressDetail" : "#onboardingAddressDetail";
          document.querySelector(detailId)?.focus();
        }, 0);
        resolve();
      },
      onclose() {
        resolve();
      }
    }).open();
  });
}

function loadDaumPostcode() {
  if (window.daum?.Postcode) return Promise.resolve();
  if (daumPostcodeLoading) return daumPostcodeLoading;
  daumPostcodeLoading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.dataset.daumPostcode = "true";
    script.onload = () => resolve();
    script.onerror = () => {
      daumPostcodeLoading = null;
      reject(new Error("주소찾기 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."));
    };
    document.head.appendChild(script);
  });
  return daumPostcodeLoading;
}

async function refreshData(showDone = true) {
  if (window.FilmStockApi?.isEnabled() && state.session) {
    const [inventoryData, orderData, salesData, reservationData] = await Promise.all([
      window.FilmStockApi.getInventory({}),
      window.FilmStockApi.getOrders({}),
      window.FilmStockApi.getSales({}),
      window.FilmStockApi.getReservations({})
    ]);
    if (Array.isArray(inventoryData?.products)) state.products = inventoryData.products;
    if (Array.isArray(inventoryData?.inventory)) state.inventory = inventoryData.inventory;
    if (Array.isArray(orderData?.orders)) state.orders = orderData.orders;
    if (Array.isArray(orderData?.accounts)) state.accounts = orderData.accounts;
    if (Array.isArray(salesData?.sales)) state.retailSales = salesData.sales;
    if (Array.isArray(reservationData?.reservations)) state.reservations = reservationData.reservations;
    if (state.screen === "dealerInfo" && state.session?.role === "dealer") prepareDealerInfoForm();
    syncAppBadgeFromOrders();
  }
  render();
  if (showDone) showToast("최신 데이터로 갱신했습니다.");
}

async function refreshLinks() {
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.getDealerLinks({ baseUrl: appPublicBase() });
    if (Array.isArray(data?.accounts)) state.accounts = data.accounts;
  }
  render();
  showToast("대리점 링크를 갱신했습니다.");
}

async function createOrder() {
  const product = selectedProduct();
  const qty = Number(state.forms.orderQty || 0);
  if (!product) throw new Error("제품을 선택해 주세요.");
  if (!qty || qty < 1) throw new Error("발주 수량을 1개 이상 입력해 주세요.");

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.createOrder({
      sku: product.sku,
      qty,
      memo: state.forms.orderMemo
    });
    if (data?.order) state.orders.unshift(data.order);
  } else {
    state.orders.unshift({
      order_id: `ORD-${Date.now().toString().slice(-9)}`,
      agency_id: state.session.dealer_code,
      dealer_code: state.session.dealer_code,
      dealer_name: state.session.dealer_name,
      created_by_login_id: state.session.login_id,
      product_name: product.product_name,
      sku: product.sku,
      qty,
      unit_retail_price: productRetailPrice(product),
      dealer_discount_rate: dealerDiscountRate(state.session.dealer_code),
      unit_sale_price: dealerSalePrice(product, state.session.dealer_code),
      unit_purchase_price: productPurchasePrice(product),
      status: "접수",
      memo: state.forms.orderMemo,
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
      shipping_company: "",
      tracking_number: "",
      print_status: "",
      printed_at: "",
      print_count: 0,
      created_at: nowText(),
      updated_at: nowText()
    });
  }

  state.forms.orderQty = 10;
  state.forms.orderMemo = "";
  state.screen = "orders";
  render();
  scrollTop();
  showToast("발주가 접수되었습니다.");
}

async function updateOrderStatus(orderId, status) {
  if (state.session?.role !== "admin") throw new Error("관리자만 발주 상태를 변경할 수 있습니다.");
  const payload = { orderId, status };
  const orderForProfile = state.orders.find((item) => item.order_id === orderId);
  const dealerProfile = dealerProfileByCode(orderForProfile?.dealer_code);
  let toastMessage = `발주 상태를 ${status}(으)로 변경했습니다.`;

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.updateOrderStatus(payload);
    if (data?.order) {
      state.orders = state.orders.map((order) => (order.order_id === orderId ? data.order : order));
      if (data.order.shipping_error) {
        toastMessage = `송장 생성 오류: ${data.order.shipping_error}`;
      } else if (status === "승인") {
        toastMessage = "승인 처리와 테스트 송장번호를 등록했습니다.";
      }
    }
    upsertInventoryRows(data?.inventory_rows);
    if (data?.inventory) upsertInventory(data.inventory);
  } else {
    const order = state.orders.find((item) => item.order_id === orderId);
    if (order) {
      if (status === "승인") {
        Object.assign(order, orderShippingProfile(dealerProfile));
        try {
          Object.assign(order, registerMockKoreaPostShipment(order, dealerProfile));
          toastMessage = "승인 처리와 테스트 송장번호를 등록했습니다.";
        } catch (error) {
          order.status = "승인";
          clearLocalShippingRegistration(order);
          order.shipping_error = error.message || "배송정보 검증에 실패했습니다.";
          order.updated_at = nowText();
          render();
          syncAppBadgeFromOrders();
          throw error;
        }
        order.updated_at = nowText();
        render();
        syncAppBadgeFromOrders();
        showToast(toastMessage);
        return;
      }

      if (["출고", "완료"].includes(status) && !order.hq_stock_deducted_at) {
        adjustLocalInventory(headOfficeCode, order.sku, -Number(order.qty || 0), { requireEnoughStock: true });
        order.hq_stock_deducted_at = nowText();
      }
      order.status = status;
      if (["접수", "반려", "취소"].includes(status)) {
        clearLocalShippingRegistration(order);
      }
      if (status === "출고") {
        Object.assign(order, orderShippingProfile(dealerProfile));
      } else if (["접수", "반려", "취소"].includes(status)) {
        Object.assign(order, emptyOrderShippingProfile());
      }
      order.updated_at = nowText();
    }
  }
  render();
  syncAppBadgeFromOrders();
  showToast(toastMessage);
}

function orderShippingProfile(profile) {
  return {
    recipient_name: profile.contact_name || "",
    recipient_phone: profile.phone || "",
    recipient_zipcode: profile.zipcode || "",
    recipient_address: profile.address || "",
    recipient_address_detail: profile.address_detail || "",
    default_courier: profile.default_courier || "",
    shipping_memo: profile.shipping_memo || ""
  };
}

function emptyOrderShippingProfile() {
  return orderShippingProfile({});
}

function registerMockKoreaPostShipment(order, dealerProfile) {
  const agency = {
    agency_id: order.agency_id || order.dealer_code,
    dealer_code: order.dealer_code,
    dealer_name: order.dealer_name,
    ...dealerProfile
  };
  validateMockShippingAgencyInfo(agency);

  const existingTrackingNo = order.tracking_no || order.tracking_number;
  const courier = order.courier || order.shipping_company || agency.default_courier || "우체국택배";
  const shipment = existingTrackingNo
    ? {
        courier,
        tracking_no: existingTrackingNo,
        shipping_receipt_no: order.shipping_receipt_no || `MOCK-RCPT-${compactDateValue()}-${randomDigits(6)}`
      }
    : mockKoreaPostAdapter(order, agency);

  return {
    status: shippingRegisteredTestStatus,
    ...orderShippingProfile(agency),
    courier: shipment.courier,
    tracking_no: shipment.tracking_no,
    shipping_receipt_no: shipment.shipping_receipt_no,
    shipping_error: "",
    approved_at: order.approved_at || nowText(),
    shipping_company: shipment.courier,
    tracking_number: shipment.tracking_no
  };
}

function mockKoreaPostAdapter(order, agency) {
  validateMockShippingAgencyInfo(agency);
  // 테스트 모드 전용: 실제 우체국 API를 호출하지 않고 송장 형식만 생성합니다.
  const date = compactDateValue();
  const random = randomDigits(6);
  return {
    courier: "우체국택배",
    tracking_no: `TEST-KP-${date}-${random}`,
    shipping_receipt_no: `MOCK-RCPT-${date}-${random}`,
    order_id: order.order_id
  };
}

function validateMockShippingAgencyInfo(agency) {
  const missingFields = [];
  if (!String(agency.contact_name || "").trim()) missingFields.push("담당자 이름");
  if (!String(agency.phone || "").trim()) missingFields.push("전화번호");
  if (!String(agency.zipcode || "").trim()) missingFields.push("우편번호");
  if (!String(agency.address || "").trim()) missingFields.push("주소");
  if (missingFields.length) throw new Error(`배송정보가 부족합니다: ${missingFields.join(", ")}`);
  if (!/^\d{5}$/.test(String(agency.zipcode))) throw new Error("우편번호는 숫자 5자리여야 합니다.");
}

function clearLocalShippingRegistration(order) {
  order.courier = "";
  order.tracking_no = "";
  order.shipping_receipt_no = "";
  order.shipping_error = "";
  order.approved_at = "";
  order.shipping_company = "";
  order.tracking_number = "";
  order.print_status = "";
  order.printed_at = "";
  order.print_count = 0;
}

async function printOrderLabel(orderId) {
  const order = state.orders.find((item) => item.order_id === orderId);
  if (!order) throw new Error("출력할 발주를 찾을 수 없습니다.");
  if (!orderTrackingNo(order)) throw new Error("송장번호가 있는 발주만 출력할 수 있습니다.");

  try {
    const printWindow = window.open("", "_blank", "width=900,height=900");
    if (!printWindow) throw new Error("팝업이 차단되어 송장 출력창을 열 수 없습니다.");

    printWindow.document.open();
    printWindow.document.write(buildShippingLabelHtml(order, state.forms.labelSize));
    printWindow.document.close();
    await markOrderPrintResult(orderId, "printed");
    render();
    showToast(`${Number(order.print_count || 0) > 1 ? "송장을 재출력했습니다." : "송장 출력창을 열었습니다."}`);
  } catch (error) {
    await markOrderPrintResult(orderId, "failed");
    render();
    throw error;
  }
}

async function markOrderPrintResult(orderId, printStatus) {
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.markOrderPrinted({
      orderId,
      printStatus,
      labelSize: state.forms.labelSize
    });
    if (data?.order) {
      state.orders = state.orders.map((order) => (order.order_id === orderId ? data.order : order));
    }
    return;
  }

  const order = state.orders.find((item) => item.order_id === orderId);
  if (!order) return;
  order.print_status = printStatus;
  if (printStatus === "printed") {
    order.printed_at = nowText();
    order.print_count = Number(order.print_count || 0) + 1;
  }
  order.updated_at = nowText();
}

function buildShippingLabelHtml(order, labelSizeValue) {
  const label = labelSizeMeta(labelSizeValue);
  const trackingNo = orderTrackingNo(order);
  const sender = labelSenderInfo();
  const registrationNo = labelRegistrationNo(order);
  const safeRegistrationNo = escapeHtml(registrationNo);
  const safeTrackingNo = escapeHtml(trackingNo);
  const paymentMethod = labelPaymentMethod(order);
  const receiptDate = labelReceiptDate(order);
  const messageText = labelDeliveryMessage(order);
  const promoText = labelPromotionText(order);
  const testWatermark = shouldShowTestWatermark(order)
    ? `<div class="test-watermark">TEST / 실제 접수 아님</div>`
    : "";
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>송장출력 ${safeTrackingNo}</title>
    <style>
      @page { size: ${label.pageSize}; margin: 0; }
      * { box-sizing: border-box; }
      html,
      body {
        margin: 0;
        width: ${label.widthMm}mm;
        height: ${label.heightMm}mm;
        background: transparent;
        color: #000;
        font-family: Arial, "Noto Sans KR", "Apple SD Gothic Neo", sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        text-rendering: geometricPrecision;
      }
      .print-shell {
        width: ${label.widthMm}mm;
        min-height: ${label.heightMm}mm;
        position: relative;
      }
      .label-overlay {
        position: relative;
        width: ${label.widthMm}mm;
        height: ${label.heightMm}mm;
        overflow: hidden;
        background: transparent;
        color: #000;
        transform: rotate(${koreaPostOverlay.PRINT_ROTATION_DEG}deg);
        transform-origin: center center;
      }
      .field,
      .barcode-slot,
      .test-watermark {
        position: absolute;
        color: #000;
      }
      .field {
        font-size: 3.1mm;
        font-weight: 700;
        line-height: 1.18;
        letter-spacing: 0;
        white-space: normal;
        overflow-wrap: anywhere;
        word-break: keep-all;
      }
      .field-small {
        font-size: 2.45mm;
        font-weight: 700;
        line-height: 1.2;
      }
      .customer-order {
        left: ${overlayX(koreaPostOverlay.CUSTOMER_ORDER_X_MM)};
        top: ${overlayY(koreaPostOverlay.CUSTOMER_ORDER_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.CUSTOMER_ORDER_WIDTH_MM)};
      }
      .payment-method {
        left: ${overlayX(koreaPostOverlay.PAYMENT_X_MM)};
        top: ${overlayY(koreaPostOverlay.PAYMENT_Y_MM)};
        width: 25mm;
        text-align: center;
        font-size: 6.2mm;
        font-weight: 900;
        line-height: 1;
      }
      .main-barcode {
        left: ${overlayX(koreaPostOverlay.BARCODE_X_MM)};
        top: ${overlayY(koreaPostOverlay.BARCODE_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.BARCODE_WIDTH_MM)};
        height: ${overlaySize(koreaPostOverlay.BARCODE_HEIGHT_MM)};
      }
      .delivery-message {
        left: ${overlayX(koreaPostOverlay.MESSAGE_X_MM)};
        top: ${overlayY(koreaPostOverlay.MESSAGE_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.MESSAGE_WIDTH_MM)};
      }
      .content-name {
        left: ${overlayX(koreaPostOverlay.CONTENT_X_MM)};
        top: ${overlayY(koreaPostOverlay.CONTENT_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.CONTENT_WIDTH_MM)};
      }
      .promo {
        left: ${overlayX(koreaPostOverlay.PROMO_X_MM)};
        top: ${overlayY(koreaPostOverlay.PROMO_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.PROMO_WIDTH_MM)};
        text-align: center;
      }
      .sender {
        left: ${overlayX(koreaPostOverlay.SENDER_X_MM)};
        top: ${overlayY(koreaPostOverlay.SENDER_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.SENDER_WIDTH_MM)};
      }
      .recipient {
        left: ${overlayX(koreaPostOverlay.RECIPIENT_X_MM)};
        top: ${overlayY(koreaPostOverlay.RECIPIENT_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.RECIPIENT_WIDTH_MM)};
      }
      .recipient-barcode {
        left: ${overlayX(koreaPostOverlay.RECIPIENT_BARCODE_X_MM)};
        top: ${overlayY(koreaPostOverlay.RECIPIENT_BARCODE_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.RECIPIENT_BARCODE_WIDTH_MM)};
        height: ${overlaySize(koreaPostOverlay.RECIPIENT_BARCODE_HEIGHT_MM)};
      }
      .registration {
        left: ${overlayX(koreaPostOverlay.REGISTRATION_X_MM)};
        top: ${overlayY(koreaPostOverlay.REGISTRATION_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.REGISTRATION_WIDTH_MM)};
      }
      .bottom-barcode {
        left: ${overlayX(koreaPostOverlay.BOTTOM_BARCODE_X_MM)};
        top: ${overlayY(koreaPostOverlay.BOTTOM_BARCODE_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.BOTTOM_BARCODE_WIDTH_MM)};
        height: ${overlaySize(koreaPostOverlay.BOTTOM_BARCODE_HEIGHT_MM)};
      }
      .barcode-slot svg {
        display: block;
        width: 100%;
        height: 100%;
        fill: #000;
        shape-rendering: crispEdges;
      }
      .sender-name {
        display: block;
        font-size: 5.2mm;
        font-weight: 900;
        line-height: 1;
      }
      .recipient-name {
        display: block;
        margin: 1.2mm 0 1mm;
        font-size: 6.8mm;
        font-weight: 900;
        line-height: 1;
      }
      .address-line {
        display: block;
        margin-top: 1.1mm;
      }
      .test-watermark {
        left: ${overlayX(koreaPostOverlay.WATERMARK_X_MM)};
        top: ${overlayY(koreaPostOverlay.WATERMARK_Y_MM)};
        transform: translate(-50%, -50%) rotate(-20deg);
        color: rgba(0, 0, 0, 0.12);
        font-size: 9mm;
        font-weight: 700;
        white-space: nowrap;
        pointer-events: none;
      }
      .print-instructions,
      .actions {
        position: fixed;
        left: 16px;
        right: 16px;
        bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #111;
        font-size: 13px;
      }
      .print-instructions {
        bottom: 70px;
        text-align: center;
      }
      .actions button {
        min-height: 42px;
        padding: 0 18px;
        border: 0;
        border-radius: 8px;
        background: #111;
        color: #fff;
        font-weight: 850;
        cursor: pointer;
      }
      @media print {
        html,
        body {
          width: ${label.widthMm}mm;
          height: ${label.heightMm}mm;
          margin: 0;
          padding: 0;
          background: transparent;
        }
        .print-shell {
          width: ${label.widthMm}mm;
          height: ${label.heightMm}mm;
          margin: 0;
          padding: 0;
        }
        .print-instructions,
        .actions {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <main class="print-shell">
      <section class="label-overlay" aria-label="우체국 소포 라벨 오버레이">
        ${testWatermark}
        <div class="field field-small customer-order">
          <span class="address-line">접수일: ${escapeHtml(receiptDate)}</span>
          <span class="address-line">주문: ${escapeHtml(order.order_id || order.order_no || "")}</span>
          <span class="address-line">고객: ${escapeHtml(order.dealer_name || order.dealer_code || "")}</span>
        </div>
        <div class="field payment-method">${escapeHtml(paymentMethod)}</div>
        <div class="barcode-slot main-barcode">${code39BarcodeSvg(registrationNo)}</div>
        <div class="field field-small delivery-message">배송메시지: ${escapeHtml(messageText)}</div>
        <div class="field field-small content-name">내용품명: ${escapeHtml(labelContentName(order))}</div>
        ${promoText ? `<div class="field field-small promo">${escapeHtml(promoText)}</div>` : ""}
        <div class="field field-small sender">
          <strong class="sender-name">${escapeHtml(sender.name)}</strong>
          <span class="address-line">${escapeHtml(sender.address)}</span>
          <span class="address-line">T: ${escapeHtml(sender.phone)}</span>
        </div>
        <div class="field recipient">
          <strong class="recipient-name">${escapeHtml(order.recipient_name || order.dealer_name || "수령인 미입력")}</strong>
          <span class="address-line">T: ${escapeHtml(order.recipient_phone || "전화번호 미입력")}</span>
          <span class="address-line">${escapeHtml(order.recipient_zipcode || "")}</span>
          <span class="address-line">${escapeHtml(order.recipient_address || "")}</span>
          ${order.recipient_address_detail ? `<span class="address-line">${escapeHtml(order.recipient_address_detail)}</span>` : ""}
        </div>
        <div class="barcode-slot recipient-barcode">${code39BarcodeSvg(trackingNo.slice(-10) || trackingNo)}</div>
        <div class="field field-small registration">
          <span class="address-line">등기번호: ${safeRegistrationNo}</span>
          <span class="address-line">수량: ${roll(Number(order.qty || 0))}</span>
        </div>
        <div class="barcode-slot bottom-barcode">${code39BarcodeSvg(registrationNo)}</div>
      </section>
      <p class="print-instructions">프린터 설정: 배율 100%, 여백 없음, 가로 방향, 머리글/바닥글 제거 · 출력은 180도 회전 보정됨</p>
      <div class="actions">
        <button type="button" onclick="window.print()">오버레이 출력</button>
        <button type="button" onclick="window.close()">닫기</button>
      </div>
    </main>
    <script>
      window.addEventListener("load", function () {
        window.setTimeout(function () {
          window.focus();
          window.print();
        }, 350);
      });
    </script>
  </body>
</html>`;
}

function labelSizeOptions() {
  return [
    { value: "post-overlay-150x100", label: "우체국 소포 오버레이 150x100mm", pageSize: "150mm 100mm", widthMm: 150, heightMm: 100 }
  ];
}

function labelSizeMeta(value) {
  return labelSizeOptions().find((option) => option.value === value) || labelSizeOptions()[0];
}

function overlayMm(value) {
  return `${Number(value || 0).toFixed(2)}mm`;
}

function overlayX(value) {
  return overlayMm(koreaPostOverlay.OFFSET_X_MM + Number(value || 0) * koreaPostOverlay.SCALE);
}

function overlayY(value) {
  return overlayMm(koreaPostOverlay.OFFSET_Y_MM + Number(value || 0) * koreaPostOverlay.SCALE);
}

function overlaySize(value) {
  return overlayMm(Number(value || 0) * koreaPostOverlay.SCALE);
}

function labelPrintMode() {
  return String(config.labelMode || "test").toLowerCase() === "production" ? "production" : "test";
}

function shouldShowTestWatermark() {
  return labelPrintMode() !== "production";
}

function labelRegistrationNo(order) {
  return String(order.shipping_receipt_no || order.tracking_no || order.order_id || "").trim();
}

function labelWeightText(order) {
  return String(order.shipping_weight || order.weight || "1190g").trim();
}

function labelFeeText(order) {
  return String(order.shipping_fee || order.fee || "착불").trim();
}

function labelContentName(order) {
  return String(order.shipping_content_name || order.product_name || "필름 제품").trim();
}

function labelPaymentMethod(order) {
  const feeText = labelFeeText(order);
  return /선불|prepaid/i.test(feeText) ? "선불" : "착불";
}

function labelReceiptDate(order) {
  const datePart = orderDatePart(order.created_at || order.approved_at || nowText()) || dateInputValue();
  return datePart.replace(/-/g, ".");
}

function labelDeliveryMessage(order) {
  return String(order.shipping_memo || order.memo || "배송 전 연락 바랍니다.").trim();
}

function labelPromotionText(order) {
  return String(order.shipping_promo || order.promotion_text || "").trim();
}

function labelSenderInfo() {
  return {
    name: "GLOC 본사 출고팀",
    phone: "본사 문의",
    address: "본사 출고지"
  };
}

function orderTrackingNo(order) {
  return String(order?.tracking_no || order?.tracking_number || "").trim();
}

function orderRecipientAddress(order) {
  return [order.recipient_zipcode ? `(${order.recipient_zipcode})` : "", order.recipient_address, order.recipient_address_detail]
    .filter(Boolean)
    .join(" ");
}

function printStatusLabel(status) {
  if (status === "printed") return "출력 완료";
  if (status === "failed") return "출력 실패";
  return status || "";
}

function code39BarcodeSvg(value) {
  const patterns = {
    "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn", "4": "nnnwwnnnw",
    "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw", "8": "wnnwnnwnn", "9": "nnwwnnwnn",
    A: "wnnnnwnnw", B: "nnwnnwnnw", C: "wnwnnwnnn", D: "nnnnwwnnw", E: "wnnnwwnnn",
    F: "nnwnwwnnn", G: "nnnnnwwnw", H: "wnnnnwwnn", I: "nnwnnwwnn", J: "nnnnwwwnn",
    K: "wnnnnnnww", L: "nnwnnnnww", M: "wnwnnnnwn", N: "nnnnwnnww", O: "wnnnwnnwn",
    P: "nnwnwnnwn", Q: "nnnnnnwww", R: "wnnnnnwwn", S: "nnwnnnwwn", T: "nnnnwnwwn",
    U: "wwnnnnnnw", V: "nwwnnnnnw", W: "wwwnnnnnn", X: "nwnnwnnnw", Y: "wwnnwnnnn",
    Z: "nwwnwnnnn", "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "$": "nwnwnwnnn",
    "/": "nwnwnnnwn", "+": "nwnnnwnwn", "%": "nnnwnwnwn", "*": "nwnnwnwnn"
  };
  const encoded = `*${String(value || "").toUpperCase().replace(/[^0-9A-Z .$/+%-]/g, "")}*`;
  const narrow = 2;
  const wide = 5;
  const height = 80;
  let x = 0;
  const rects = [];

  encoded.split("").forEach((char) => {
    const pattern = patterns[char] || patterns["-"];
    pattern.split("").forEach((unit, index) => {
      const width = unit === "w" ? wide : narrow;
      if (index % 2 === 0) {
        rects.push(`<rect x="${x}" y="0" width="${width}" height="${height}" />`);
      }
      x += width;
    });
    x += narrow;
  });

  return `<svg viewBox="0 0 ${x} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="송장번호 바코드" fill="#000" shape-rendering="crispEdges">${rects.join("")}</svg>`;
}

async function receiveOrder(orderId) {
  const order = state.orders.find((item) => item.order_id === orderId);
  if (!order) throw new Error("입고 처리할 발주를 찾을 수 없습니다.");
  const confirmed = confirm(`${order.dealer_name} ${order.product_name} ${roll(Number(order.qty || 0))}을 입고완료 처리할까요? 대리점 재고에 반영됩니다.`);
  if (!confirmed) return;

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.receiveOrder({ orderId });
    if (data?.order) state.orders = state.orders.map((item) => (item.order_id === orderId ? data.order : item));
    upsertInventoryRows(data?.inventory_rows);
    if (data?.inventory) upsertInventory(data.inventory);
  } else {
    adjustLocalInventory(order.dealer_code, order.sku, Number(order.qty || 0), { requireEnoughStock: false });
    order.status = "완료";
    order.dealer_received_at = nowText();
    order.updated_at = nowText();
  }
  render();
  showToast("입고완료 처리했습니다. 재고에 반영되었습니다.");
}

async function clearTestOrders() {
  if (state.session?.role !== "admin") throw new Error("관리자만 테스트 발주를 삭제할 수 있습니다.");
  const confirmed = confirm("현재 발주 내역을 모두 삭제합니다. 최종 오픈 전 테스트 발주 삭제 용도로만 사용하세요.");
  if (!confirmed) return;
  const typed = prompt("삭제하려면 전체삭제 라고 입력해 주세요.");
  if (typed !== "전체삭제") {
    showToast("삭제가 취소되었습니다.");
    return;
  }

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.clearOrders();
    state.orders = [];
    showToast(`테스트 발주 ${Number(data?.deleted_count || 0)}건을 삭제했습니다.`);
  } else {
    const deletedCount = state.orders.length;
    state.orders = [];
    showToast(`테스트 발주 ${deletedCount}건을 삭제했습니다.`);
  }
  syncAppBadgeFromOrders();
  render();
}

async function createSale() {
  const product = selectedProduct();
  const qty = Number(state.forms.saleQty || 0);
  if (state.session?.role !== "dealer") throw new Error("대리점 계정만 판매 등록할 수 있습니다.");
  if (!product) throw new Error("판매할 제품을 선택해 주세요.");
  if (!qty || qty < 1) throw new Error("판매 수량을 1개 이상 입력해 주세요.");
  const inventory = dealerInventoryForProduct(product.sku);
  if (Number(inventory?.stock_qty || 0) < qty) throw new Error("재고가 부족합니다. 재고 확인 또는 발주가 필요합니다.");

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.createSale({
      sku: product.sku,
      qty,
      memo: state.forms.saleMemo
    });
    if (data?.sale) state.retailSales.unshift(data.sale);
    if (data?.inventory) upsertInventory(data.inventory);
  } else {
    adjustLocalInventory(state.session.dealer_code, product.sku, -qty, { requireEnoughStock: true });
    state.retailSales.unshift({
      sale_id: `SAL-${Date.now().toString().slice(-9)}`,
      dealer_code: state.session.dealer_code,
      dealer_name: state.session.dealer_name,
      created_by_login_id: state.session.login_id,
      product_name: product.product_name,
      sku: product.sku,
      qty,
      memo: state.forms.saleMemo,
      created_at: nowText(),
      updated_at: nowText()
    });
  }

  state.forms.saleQty = 1;
  state.forms.saleMemo = "";
  render();
  showToast("판매완료 처리했습니다. 재고에서 차감되었습니다.");
}

async function createReservation() {
  const product = selectedProduct();
  const qty = Number(state.forms.reservationQty || 0);
  if (state.session?.role !== "dealer") throw new Error("대리점 계정만 예약 등록할 수 있습니다.");
  if (!product) throw new Error("예약 제품을 선택해 주세요.");
  if (!qty || qty < 1) throw new Error("예약 수량을 1개 이상 입력해 주세요.");
  const summary = reservationStockSummary(product.sku);
  const status = qty > summary.availableStock ? "재고부족" : "예약";

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.createReservation({
      sku: product.sku,
      qty,
      customer_name: state.forms.reservationCustomerName,
      customer_phone: state.forms.reservationCustomerPhone,
      reservation_date: state.forms.reservationDate || dateInputValue(),
      memo: state.forms.reservationMemo
    });
    if (data?.reservation) state.reservations.unshift(data.reservation);
  } else {
    state.reservations.unshift({
      reservation_id: `RSV-${Date.now().toString().slice(-9)}`,
      dealer_code: state.session.dealer_code,
      dealer_name: state.session.dealer_name,
      created_by_login_id: state.session.login_id,
      customer_name: state.forms.reservationCustomerName,
      customer_phone: state.forms.reservationCustomerPhone,
      reservation_date: state.forms.reservationDate || dateInputValue(),
      product_name: product.product_name,
      sku: product.sku,
      qty,
      status,
      memo: state.forms.reservationMemo,
      created_at: nowText(),
      updated_at: nowText()
    });
  }

  state.forms.reservationCustomerName = "";
  state.forms.reservationCustomerPhone = "";
  state.forms.reservationDate = dateInputValue();
  state.forms.reservationQty = 1;
  state.forms.reservationMemo = "";
  render();
  showToast(status === "재고부족" ? "예약 저장됨: 재고부족 상태입니다." : "예약을 저장했습니다.");
}

async function completeReservation(reservationId) {
  const reservation = state.reservations.find((item) => item.reservation_id === reservationId);
  if (!reservation) throw new Error("시공완료 처리할 예약을 찾을 수 없습니다.");
  const confirmed = confirm(`${reservation.product_name} ${roll(Number(reservation.qty || 0))}을 시공완료 처리할까요? 재고에서 자동 차감됩니다.`);
  if (!confirmed) return;

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.completeReservation({ reservationId });
    if (data?.reservation) {
      state.reservations = state.reservations.map((item) => (item.reservation_id === reservationId ? data.reservation : item));
    }
    if (data?.inventory) upsertInventory(data.inventory);
  } else {
    adjustLocalInventory(reservation.dealer_code, reservation.sku, -Number(reservation.qty || 0), { requireEnoughStock: true });
    state.reservations = state.reservations.map((item) => (
      item.reservation_id === reservationId
        ? { ...item, status: "시공완료", completed_at: nowText(), updated_at: nowText() }
        : item
    ));
  }
  render();
  showToast("시공완료 처리했습니다. 재고에서 차감되었습니다.");
}

async function cancelOrder(orderId) {
  const order = state.orders.find((item) => item.order_id === orderId);
  if (!order) throw new Error("취소할 발주를 찾을 수 없습니다.");
  if (order.status !== "접수") throw new Error("승인 전 접수 상태에서만 취소할 수 있습니다.");
  const confirmed = confirm(`${order.product_name} 발주를 취소할까요?`);
  if (!confirmed) return;

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.cancelOrder({ orderId });
    if (data?.order) {
      state.orders = state.orders.map((item) => (item.order_id === orderId ? data.order : item));
    }
  } else {
    order.status = "취소";
    order.updated_at = nowText();
  }
  render();
  showToast("발주가 취소되었습니다.");
}

async function saveInventory() {
  if (!state.forms.inventoryDealerCode) state.forms.inventoryDealerCode = editableInventoryOwnerCode();
  if (!state.forms.inventorySku) state.forms.inventorySku = state.selectedSku || state.products[0]?.sku || "";
  const dealerCode = state.forms.inventoryDealerCode;
  const payload = {
    dealer_code: dealerCode,
    sku: state.forms.inventorySku,
    stock_qty: Number(state.forms.inventoryStockQty || 0),
    safety_stock: Number(state.forms.inventorySafetyStock || 0),
    location: state.forms.inventoryLocation
  };
  if (!payload.dealer_code || !payload.sku) throw new Error("대리점과 제품을 선택해 주세요.");
  if (payload.stock_qty < 0 || payload.safety_stock < 0) throw new Error("재고와 안전재고는 0 이상이어야 합니다.");

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.saveInventory(payload);
    if (data?.inventory) upsertInventory(data.inventory);
  } else {
    const product = state.products.find((item) => item.sku === payload.sku);
    upsertInventory({
      dealer_code: payload.dealer_code,
      dealer_name: dealerNameByCode(payload.dealer_code),
      product_name: product?.product_name || payload.sku,
      sku: payload.sku,
      category: product?.category || "",
      color: product?.color || colorNameFromText(product?.product_name || ""),
      stock_qty: payload.stock_qty,
      safety_stock: payload.safety_stock,
      location: payload.location,
      updated_at: nowText()
    });
  }
  state.selectedSku = payload.sku;
  state.selectedColor = "전체";
  state.filters.inventoryQuery = "";
  state.filters.inventoryPage = 1;
  state.filters.inventoryDealerCode = "전체";
  state.filters.inventoryScope = state.session?.role === "admin" ? "headOffice" : "mine";
  state.screen = "inventory";
  render();
  scrollTop();
  showToast("재고가 저장되었습니다.");
}

async function saveProduct() {
  if (state.session?.role !== "admin") throw new Error("관리자만 제품을 등록할 수 있습니다.");
  const payload = {
    sku: state.forms.productSku.trim(),
    product_name: state.forms.productName.trim(),
    category: state.forms.productCategory,
    unit: state.forms.productUnit.trim() || "롤",
    retail_price: Number(state.forms.productRetailPrice || defaultRetailPrice),
    purchase_price: Number(state.forms.productPurchasePrice || defaultPurchasePrice),
    is_active: state.forms.productIsActive
  };
  if (!payload.sku || !payload.product_name || !payload.category) {
    throw new Error("SKU, 제품명, 카테고리를 입력해 주세요.");
  }
  if (payload.retail_price < 0 || payload.purchase_price < 0) {
    throw new Error("소비자가와 매입가는 0 이상이어야 합니다.");
  }

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.saveProduct(payload);
    if (data?.product) upsertProduct(data.product);
  } else {
    upsertProduct({ ...payload, color: colorNameFromText(payload.product_name) });
    inventoryOwnerAccounts().forEach((account) => {
      const exists = state.inventory.some((row) => row.dealer_code === account.dealer_code && row.sku === payload.sku);
      if (!exists) {
        upsertInventory({
          dealer_code: account.dealer_code,
          dealer_name: account.dealer_name,
          product_name: payload.product_name,
          sku: payload.sku,
          category: payload.category,
          color: colorNameFromText(payload.product_name),
          stock_qty: 0,
          safety_stock: 0,
          location: `${account.dealer_name} 창고`,
          updated_at: nowText()
        });
      }
    });
  }
  await refreshData(false);
  selectProductForEdit(payload.sku);
  render();
  showToast("제품이 저장되었습니다.");
}

async function createDealerAccount() {
  if (!canManageDealerStaff()) throw new Error("담당자 추가는 본사 관리자 또는 대리점 최상위 관리자만 가능합니다.");
  const role = state.session?.role === "admin" && state.forms.accountRole === "admin" ? "admin" : "dealer";
  const dealerCode = role === "admin"
    ? "ADMIN"
    : state.session?.role === "admin"
      ? state.forms.accountDealerCode.trim().toUpperCase()
      : state.session?.dealer_code || "";
  const existingDealerAccount = state.accounts.find((item) => item.role === "dealer" && sameDealerCode(item.dealer_code, dealerCode));
  let accountDiscountRate = 0;
  if (role === "dealer") {
    if (existingDealerAccount) accountDiscountRate = "";
    else if (state.session?.role === "admin") accountDiscountRate = Number(state.forms.accountDiscountRate || 0);
    else accountDiscountRate = "";
  }
  const account = {
    login_id: state.forms.accountLoginId.trim(),
    dealer_code: dealerCode,
    dealer_name: state.session?.role === "admin" ? dealerNameForCode(dealerCode, state.forms.accountDealerName) : state.session?.dealer_name || "",
    role,
    dealer_discount_rate: accountDiscountRate,
    temporary_password: state.forms.accountTemporaryPassword.trim()
  };
  if (account.dealer_discount_rate !== "" && (account.dealer_discount_rate < 0 || account.dealer_discount_rate > 100)) {
    throw new Error("대리점 할인율은 0~100 사이로 입력해 주세요.");
  }
  if (!account.login_id || !account.dealer_code || !account.dealer_name || !account.temporary_password) {
    throw new Error("계정 유형, 코드, 이름, 아이디, 초기 비밀번호를 모두 입력해 주세요.");
  }

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.createDealerAccount(account);
    if (Array.isArray(data?.accounts)) state.accounts = data.accounts;
    else if (data?.account) upsertAccount(data.account);
    state.tempPasswords[account.login_id] = data?.temporary_password || account.temporary_password;
  } else {
    if (state.accounts.some((item) => item.login_id === account.login_id)) throw new Error("이미 사용 중인 아이디입니다.");
    const newAccount = {
      login_id: account.login_id,
      dealer_code: account.dealer_code,
      dealer_name: account.dealer_name,
      role: account.role,
      dealer_discount_rate: account.dealer_discount_rate,
      is_first_login: true,
      is_active: true,
      contact_name: "",
      phone: "",
      zipcode: "",
      address: "",
      address_detail: "",
      default_courier: "",
      shipping_memo: "",
      updated_at: nowText()
    };
    state.accounts.push(newAccount);
    state.tempPasswords[account.login_id] = account.temporary_password;
    if (account.role === "dealer" && !state.inventory.some((row) => row.dealer_code === account.dealer_code)) seedInventoryForDealer(newAccount);
  }

  state.forms.accountLoginId = "";
  if (state.session?.role === "admin") {
    state.forms.accountDealerCode = state.forms.accountRole === "admin" ? "ADMIN" : "";
    state.forms.accountDealerName = "";
    state.forms.accountDiscountRate = 0;
  }
  state.forms.accountTemporaryPassword = "";
  render();
  showToast(account.role === "admin" ? "관리자 계정을 생성했습니다." : state.session?.role === "admin" ? "대리점 계정을 생성했습니다." : "담당자 ID를 생성했습니다.");
}

async function updateDealerDiscount(dealerCode) {
  if (state.session?.role !== "admin") throw new Error("대리점 할인율은 관리자만 변경할 수 있습니다.");
  const currentRate = dealerDiscountRate(dealerCode);
  const input = prompt("대리점 할인율(%)을 입력해 주세요. 예: 20", String(currentRate));
  if (input === null) return;
  const discountRate = Number(input);
  if (Number.isNaN(discountRate) || discountRate < 0 || discountRate > 100) {
    throw new Error("대리점 할인율은 0~100 사이 숫자로 입력해 주세요.");
  }

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.updateDealerDiscount({ dealerCode, discountRate });
    freezeDealerOrderPricing(dealerCode, currentRate);
    if (Array.isArray(data?.accounts)) state.accounts = data.accounts;
  } else {
    freezeDealerOrderPricing(dealerCode, currentRate);
    let topManagerUpdated = false;
    state.accounts = state.accounts.map((account) => {
      if (account.role !== "dealer" || !sameDealerCode(account.dealer_code, dealerCode)) return account;
      if (!topManagerUpdated) {
        topManagerUpdated = true;
        return { ...account, dealer_discount_rate: discountRate, updated_at: nowText() };
      }
      return { ...account, dealer_discount_rate: "", updated_at: nowText() };
    });
  }
  render();
  showToast("할인율을 저장했습니다. 새 할인율은 이후 발주부터 적용됩니다.");
}

async function resetDealerPassword(loginId) {
  const account = state.accounts.find((item) => item.login_id === loginId);
  const temporaryPassword = prompt("새 임시 비밀번호를 입력해 주세요. 최초 로그인 후 해당 사용자가 변경해야 합니다.");
  if (!temporaryPassword) return;
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.resetDealerPassword({ loginId, temporaryPassword });
    if (data?.account) upsertAccount(data.account);
  } else {
    if (account) {
      account.is_first_login = true;
      account.updated_at = nowText();
    }
  }
  state.tempPasswords[loginId] = temporaryPassword;
  render();
  showToast("비밀번호를 초기화했습니다. 안내문에서 임시 비밀번호를 확인할 수 있습니다.");
}

async function deactivateDealerAccount(loginId) {
  const account = state.accounts.find((item) => item.login_id === loginId);
  if (isProtectedRootAdmin(account)) throw new Error("기본 본사 관리자 계정은 사용중지할 수 없습니다.");
  const confirmed = confirm("이 계정을 사용중지할까요?");
  if (!confirmed) return;
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.deactivateDealerAccount({ loginId });
    if (data?.account) upsertAccount(data.account);
  } else {
    if (account) {
      account.is_active = false;
      account.updated_at = nowText();
    }
  }
  render();
  showToast("계정을 사용중지했습니다.");
}

async function deleteDealerAccount(loginId) {
  const account = state.accounts.find((item) => item.login_id === loginId);
  if (isProtectedRootAdmin(account)) throw new Error("기본 본사 관리자 계정은 삭제할 수 없습니다.");
  if (state.session?.role !== "admin") {
    if (!canManageDealerStaff()) throw new Error("담당자 삭제는 본사 관리자 또는 대리점 최상위 관리자만 가능합니다.");
    if (!account || account.role !== "dealer" || !sameDealerCode(account.dealer_code, state.session.dealer_code)) throw new Error("본인 대리점 담당자만 삭제할 수 있습니다.");
    if (state.session.login_id === loginId || isDealerTopManagerAccount(account)) throw new Error("최상위 관리자 계정은 삭제할 수 없습니다.");
  }
  const dealerName = account?.dealer_name || loginId;
  const hasOtherDealerAccount = account?.role === "dealer" && state.accounts.some((item) => item.login_id !== loginId && item.role === "dealer" && item.dealer_code === account.dealer_code);
  const inventoryNotice = account?.role === "dealer" && !hasOtherDealerAccount
    ? "\n같은 대리점의 다른 담당자 계정이 없으면 재고 행도 함께 삭제됩니다. 발주 이력은 보존됩니다."
    : "\n계정만 삭제되며 재고와 발주 이력은 보존됩니다.";
  const confirmed = confirm(`${dealerName} 계정을 완전히 삭제할까요?${inventoryNotice}`);
  if (!confirmed) return;

  if (window.FilmStockApi?.isEnabled()) {
    await window.FilmStockApi.deleteDealerAccount({ loginId });
    removeDealerAccount(loginId);
    await refreshData(false);
  } else {
    removeDealerAccount(loginId);
  }
  render();
  showToast("계정을 삭제했습니다.");
}

async function deleteProduct(sku) {
  const product = state.products.find((item) => item.sku === sku);
  const productName = product?.product_name || sku;
  const confirmed = confirm(`${productName} 제품을 완전히 삭제할까요?\n해당 SKU의 대리점별 재고 행도 함께 삭제됩니다. 발주 이력은 보존됩니다.`);
  if (!confirmed) return;

  if (window.FilmStockApi?.isEnabled()) {
    await window.FilmStockApi.deleteProduct({ sku });
    removeProduct(sku);
    await refreshData(false);
  } else {
    removeProduct(sku);
  }
  ensureProductForm();
  render();
  showToast("제품을 삭제했습니다.");
}

function logout() {
  window.FilmStockApi?.signOut?.();
  state.session = null;
  state.screen = "login";
  updateAppBadgeCount(0);
  render();
  scrollTop();
  showToast("로그아웃되었습니다.");
}

function navigate(screen) {
  if (screen === "links" || screen === "admin" || screen === "productManage" || screen === "sales") {
    if (state.session?.role !== "admin") {
      showToast("관리자만 접근할 수 있습니다.");
      return;
    }
  }
  if (screen === "inventoryManage") {
    ensureInventoryForm();
  }
  if (screen === "productManage") {
    ensureProductForm();
  }
  if (screen === "dealerInfo" && state.session?.role === "dealer") {
    prepareDealerInfoForm();
  }
  state.screen = screen;
  render();
  scrollTop();
}

function ensureInventoryForm() {
  if (!state.session) return;
  state.forms.inventoryDealerCode = editableInventoryOwnerCode();
  if (!state.forms.inventorySku) {
    state.forms.inventorySku = state.selectedSku || state.products[0]?.sku || "";
  }
  syncInventoryForm();
}

function syncInventoryForm() {
  const row = state.inventory.find((item) => item.dealer_code === state.forms.inventoryDealerCode && item.sku === state.forms.inventorySku);
  if (row) {
    state.forms.inventoryStockQty = Number(row.stock_qty || 0);
    state.forms.inventorySafetyStock = Number(row.safety_stock || 0);
    state.forms.inventoryLocation = row.location || "";
    return;
  }
  state.forms.inventoryStockQty = 0;
  state.forms.inventorySafetyStock = 0;
  state.forms.inventoryLocation = `${dealerNameByCode(state.forms.inventoryDealerCode)} 창고`;
}

function selectInventoryRow(dealerCode, sku) {
  state.forms.inventoryDealerCode = dealerCode;
  state.forms.inventorySku = sku;
  state.selectedSku = sku;
  syncInventoryForm();
}

function ensureProductForm() {
  if (!state.forms.productSku && state.products[0]) {
    selectProductForEdit(state.products[0].sku);
  }
}

function selectProductForEdit(sku) {
  const product = state.products.find((item) => item.sku === sku);
  if (!product) return;
  state.forms.productSku = product.sku;
  state.forms.productName = product.product_name;
  state.forms.productCategory = product.category || "PPF";
  state.forms.productUnit = product.unit || "롤";
  state.forms.productRetailPrice = productRetailPrice(product);
  state.forms.productPurchasePrice = productPurchasePrice(product);
  state.forms.productIsActive = toBool(product.is_active);
}

function editableInventoryRows() {
  const query = normalize(state.filters.inventoryQuery);
  return state.inventory
    .filter((row) => {
      if (row.dealer_code !== editableInventoryOwnerCode()) return false;
      if (!query) return true;
      return [row.product_name, row.sku, row.dealer_name, row.dealer_code, row.stock_qty, row.location]
        .some((value) => normalize(value).includes(query));
    })
    .sort((a, b) => String(a.dealer_code).localeCompare(String(b.dealer_code)) || String(a.product_name).localeCompare(String(b.product_name), "ko"));
}

function visibleInventory(options = {}) {
  const includeDealerFilter = options.includeDealerFilter !== false;
  const query = normalize(state.filters.inventoryQuery);
  const scope = currentInventoryScope();
  return state.inventory
    .filter((row) => {
      if (scope === "mine" && row.dealer_code !== state.session?.dealer_code) return false;
      if (scope === "headOffice" && row.dealer_code !== headOfficeCode) return false;
      if (scope === "dealerAll" && row.dealer_code === headOfficeCode) return false;
      if (includeDealerFilter && scope === "dealerAll" && state.filters.inventoryDealerCode !== "전체" && row.dealer_code !== state.filters.inventoryDealerCode) return false;
      if (state.selectedColor !== "전체" && row.color !== state.selectedColor && !normalize(row.product_name).includes(normalize(state.selectedColor))) return false;
      if (!query) return true;
      return [row.product_name, row.sku, row.dealer_name, row.dealer_code, row.stock_qty, row.category, row.color]
        .some((value) => normalize(value).includes(query));
    })
    .sort((a, b) => Number(a.stock_qty) - Number(b.stock_qty));
}

function inventoryDealerOptions() {
  const rows = visibleInventory({ includeDealerFilter: false });
  const map = new Map();
  uniqueDealerAccounts().forEach((account) => {
    map.set(account.dealer_code, {
      dealer_code: account.dealer_code,
      dealer_name: account.dealer_name,
      totalStock: 0,
      count: 0
    });
  });
  rows.forEach((row) => {
    if (!row.dealer_code || row.dealer_code === headOfficeCode) return;
    if (!map.has(row.dealer_code)) {
      map.set(row.dealer_code, {
        dealer_code: row.dealer_code,
        dealer_name: row.dealer_name || row.dealer_code,
        totalStock: 0,
        count: 0
      });
    }
    const dealer = map.get(row.dealer_code);
    dealer.totalStock += Number(row.stock_qty || 0);
    dealer.count += 1;
  });
  return Array.from(map.values()).sort((a, b) => String(a.dealer_name).localeCompare(String(b.dealer_name), "ko"));
}

function inventoryTotalPages(rows) {
  return Math.max(1, Math.ceil(rows.length / inventoryPageSize));
}

function currentInventoryPage(rows) {
  const totalPages = inventoryTotalPages(rows);
  const page = Math.min(Math.max(Number(state.filters.inventoryPage || 1), 1), totalPages);
  state.filters.inventoryPage = page;
  return page;
}

function paginatedInventoryRows(rows) {
  const page = currentInventoryPage(rows);
  const start = (page - 1) * inventoryPageSize;
  return rows.slice(start, start + inventoryPageSize);
}

function filteredProducts() {
  const query = normalize(state.filters.inventoryQuery);
  return activeProducts().filter((product) => {
    if (state.selectedColor !== "전체" && product.color !== state.selectedColor && !normalize(product.product_name).includes(normalize(state.selectedColor))) return false;
    if (!query) return true;
    return [product.product_name, product.sku, product.category, product.color].some((value) => normalize(value).includes(query));
  });
}

function orderDealerOptions() {
  const counts = state.orders.reduce((map, order) => {
    const code = order.dealer_code || "";
    if (!code || code === headOfficeCode) return map;
    map.set(code, (map.get(code) || 0) + 1);
    return map;
  }, new Map());

  const dealers = new Map();
  state.accounts
    .filter((account) => account.role === "dealer")
    .forEach((account) => {
      dealers.set(account.dealer_code, {
        dealer_code: account.dealer_code,
        dealer_name: account.dealer_name,
        count: counts.get(account.dealer_code) || 0
      });
    });

  state.orders.forEach((order) => {
    if (!order.dealer_code || order.dealer_code === headOfficeCode || dealers.has(order.dealer_code)) return;
    dealers.set(order.dealer_code, {
      dealer_code: order.dealer_code,
      dealer_name: order.dealer_name || order.dealer_code,
      count: counts.get(order.dealer_code) || 0
    });
  });

  return Array.from(dealers.values()).sort((a, b) => String(a.dealer_name).localeCompare(String(b.dealer_name), "ko"));
}

function visibleOrders() {
  const query = normalize(state.filters.orderQuery);
  return state.orders.filter((order) => {
    if (state.session?.role === "dealer" && order.dealer_code !== state.session.dealer_code) return false;
    if (state.session?.role === "admin" && state.filters.dealerCode !== "전체" && order.dealer_code !== state.filters.dealerCode) return false;
    if (state.filters.orderStatus !== "전체" && !hasOrderStatusMatch(order.status, state.filters.orderStatus)) return false;
    if (state.filters.orderPeriod === "일별" && orderDatePart(order.created_at) !== state.filters.orderDate) return false;
    if (state.filters.orderPeriod === "월별" && !orderDatePart(order.created_at).startsWith(state.filters.orderMonth)) return false;
    if (!query) return true;
    return [order.order_id, order.product_name, order.sku, order.dealer_name, order.dealer_code, order.created_by_login_id, order.memo, order.status, orderStatusLabel(order.status), order.courier, order.tracking_no, order.shipping_receipt_no, order.shipping_company, order.tracking_number, order.recipient_name, order.recipient_phone, order.recipient_address]
      .some((value) => normalize(value).includes(query));
  });
}

function visibleRetailSales() {
  return state.retailSales
    .filter((sale) => state.session?.role !== "dealer" || sale.dealer_code === state.session.dealer_code)
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

function visibleReservations() {
  return state.reservations
    .filter((reservation) => state.session?.role !== "dealer" || reservation.dealer_code === state.session.dealer_code)
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

function salesRowsBase() {
  return state.orders
    .filter((order) => order.status === "완료")
    .map(enrichSalesRow);
}

function visibleSalesRows() {
  const query = normalize(state.filters.salesQuery);
  return salesRowsBase()
    .filter((row) => {
      if (state.filters.salesDealerCode !== "전체" && row.dealer_code !== state.filters.salesDealerCode) return false;
      if (state.filters.salesPeriod === "일별" && orderDatePart(row.created_at) !== state.filters.salesDate) return false;
      if (state.filters.salesPeriod === "월별" && !orderDatePart(row.created_at).startsWith(state.filters.salesMonth)) return false;
      if (!query) return true;
      return [row.order_id, row.product_name, row.sku, row.dealer_name, row.dealer_code, row.created_by_login_id]
        .some((value) => normalize(value).includes(query));
    })
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

function salesDealerOptions() {
  const revenueMap = salesRowsBase().reduce((map, row) => {
    const code = row.dealer_code || "";
    if (!code || code === headOfficeCode) return map;
    map.set(code, (map.get(code) || 0) + row.revenue);
    return map;
  }, new Map());

  const dealers = new Map();
  state.accounts
    .filter((account) => account.role === "dealer")
    .forEach((account) => {
      dealers.set(account.dealer_code, {
        dealer_code: account.dealer_code,
        dealer_name: account.dealer_name,
        revenue: revenueMap.get(account.dealer_code) || 0
      });
    });

  salesRowsBase().forEach((row) => {
    if (!row.dealer_code || row.dealer_code === headOfficeCode || dealers.has(row.dealer_code)) return;
    dealers.set(row.dealer_code, {
      dealer_code: row.dealer_code,
      dealer_name: row.dealer_name || row.dealer_code,
      revenue: revenueMap.get(row.dealer_code) || 0
    });
  });

  return Array.from(dealers.values()).sort((a, b) => String(a.dealer_name).localeCompare(String(b.dealer_name), "ko"));
}

function enrichSalesRow(order) {
  const product = state.products.find((item) => item.sku === order.sku) || {};
  const qty = Number(order.qty || 0);
  const unitRetailPrice = Number(hasSnapshotValue(order.unit_retail_price) ? order.unit_retail_price : productRetailPrice(product));
  const discountRate = Number(hasSnapshotValue(order.dealer_discount_rate) ? order.dealer_discount_rate : fallbackOrderDiscountRate(order));
  const unitSalePrice = Number(hasSnapshotValue(order.unit_sale_price) ? order.unit_sale_price : Math.round(unitRetailPrice * (1 - discountRate / 100)));
  const unitPurchasePrice = Number(hasSnapshotValue(order.unit_purchase_price) ? order.unit_purchase_price : productPurchasePrice(product));
  const revenue = unitSalePrice * qty;
  const cost = unitPurchasePrice * qty;
  const profit = revenue - cost;
  return {
    ...order,
    qty,
    unitRetailPrice,
    discountRate,
    unitSalePrice,
    unitPurchasePrice,
    revenue,
    cost,
    profit
  };
}

function freezeDealerOrderPricing(dealerCode, discountRate) {
  state.orders = state.orders.map((order) => {
    if (!sameDealerCode(order.dealer_code, dealerCode)) return order;
    const product = state.products.find((item) => item.sku === order.sku) || {};
    const unitRetailPrice = Number(hasSnapshotValue(order.unit_retail_price) ? order.unit_retail_price : productRetailPrice(product));
    const orderDiscountRate = Number(hasSnapshotValue(order.dealer_discount_rate) ? order.dealer_discount_rate : discountRate);
    const unitSalePrice = Number(hasSnapshotValue(order.unit_sale_price) ? order.unit_sale_price : Math.round(unitRetailPrice * (1 - orderDiscountRate / 100)));
    const unitPurchasePrice = Number(hasSnapshotValue(order.unit_purchase_price) ? order.unit_purchase_price : productPurchasePrice(product));
    return {
      ...order,
      unit_retail_price: unitRetailPrice,
      dealer_discount_rate: orderDiscountRate,
      unit_sale_price: unitSalePrice,
      unit_purchase_price: unitPurchasePrice
    };
  });
}

function hasSnapshotValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function fallbackOrderDiscountRate(order) {
  if (hasSnapshotValue(order.dealer_discount_rate)) return Number(order.dealer_discount_rate || 0);
  return defaultLegacyOrderDiscountRate;
}

function orderReportStats(rows) {
  return rows.reduce(
    (stats, order) => {
      stats.count += 1;
      stats.qty += Number(order.qty || 0);
      if (order.status === "접수") stats.received += 1;
      if (["접수", "승인", shippingRegisteredTestStatus, "출고"].includes(order.status)) stats.inProgress += 1;
      if (order.status === "완료") stats.done += 1;
      return stats;
    },
    { count: 0, qty: 0, received: 0, inProgress: 0, done: 0 }
  );
}

function orderAmountStats(rows) {
  return rows.reduce(
    (stats, order) => {
      if (["취소", "반려"].includes(order.status)) return stats;
      const pricing = enrichSalesRow(order);
      stats.orderAmount += pricing.revenue;
      return stats;
    },
    { orderAmount: 0 }
  );
}

function salesReportStats(rows) {
  const stats = rows.reduce(
    (summary, row) => {
      summary.count += 1;
      summary.qty += Number(row.qty || 0);
      summary.revenue += Number(row.revenue || 0);
      summary.cost += Number(row.cost || 0);
      summary.profit += Number(row.profit || 0);
      return summary;
    },
    { count: 0, qty: 0, revenue: 0, cost: 0, profit: 0, marginRate: 0 }
  );
  stats.marginRate = stats.revenue > 0 ? (stats.profit / stats.revenue) * 100 : 0;
  return stats;
}

function inventoryStats(rows) {
  return rows.reduce(
    (stats, row) => {
      stats.totalStock += Number(row.stock_qty || 0);
      if (Number(row.stock_qty || 0) <= Number(row.safety_stock || 0)) stats.lowStock += 1;
      return stats;
    },
    { totalStock: 0, lowStock: 0 }
  );
}

function dashboardStats() {
  const inventory = inventoryStats(state.inventory);
  return {
    activeDealers: uniqueDealerAccounts().filter((account) => toBool(account.is_active)).length,
    totalStock: inventory.totalStock,
    lowStock: inventory.lowStock,
    openOrders: state.orders.filter((order) => order.status === "접수").length
  };
}

function selectedProduct() {
  const products = activeProducts();
  return products.find((product) => product.sku === state.selectedSku) || products[0];
}

function currentInventoryScope() {
  const requested = state.filters.inventoryScope === "others" ? "dealerAll" : state.filters.inventoryScope;
  if (state.session?.role === "admin") {
    return requested === "dealerAll" ? "dealerAll" : "headOffice";
  }
  if (requested === "headOffice" || requested === "dealerAll") return requested;
  return "mine";
}

function inventoryScopeTitle(scope) {
  if (scope === "headOffice") return "본사 제품 재고";
  if (scope === "dealerAll") return "전체 대리점/샵 제품 재고";
  return "내 대리점/샵 제품 재고";
}

function editableInventoryOwnerCode() {
  if (!state.session) return "";
  return state.session.role === "admin" ? headOfficeCode : state.session.dealer_code;
}

function activeProducts() {
  return state.products.filter((product) => toBool(product.is_active));
}

function dealerAccounts() {
  return state.accounts.filter((account) => account.role === "dealer");
}

function uniqueDealerAccounts() {
  const map = new Map();
  dealerAccounts().forEach((account) => {
    if (!account.dealer_code || map.has(account.dealer_code)) return;
    map.set(account.dealer_code, account);
  });
  return Array.from(map.values());
}

function uniqueDealerProfiles() {
  const map = new Map();
  dealerAccounts().forEach((account) => {
    if (!account.dealer_code || map.has(account.dealer_code)) return;
    map.set(account.dealer_code, dealerProfileByCode(account.dealer_code));
  });
  return Array.from(map.values())
    .filter(Boolean)
    .sort((a, b) => String(a.dealer_name || "").localeCompare(String(b.dealer_name || ""), "ko"));
}

function dealerProfileByCode(dealerCode) {
  const accounts = dealerAccounts().filter((account) => sameDealerCode(account.dealer_code, dealerCode));
  return accounts.find(hasDealerProfileInfo) || accounts[0] || {};
}

function currentDealerProfile() {
  if (!state.session) return {};
  const profile = dealerProfileByCode(state.session.dealer_code);
  return {
    ...state.session,
    ...profile,
    dealer_name: profile.dealer_name || state.session.dealer_name,
    dealer_code: profile.dealer_code || state.session.dealer_code
  };
}

function hasDealerProfileInfo(account) {
  return Boolean(account && (
    account.contact_name ||
    account.phone ||
    account.zipcode ||
    account.address ||
    account.address_detail ||
    account.default_courier ||
    account.shipping_memo
  ));
}

function managedAccounts() {
  if (state.session?.role === "admin") {
    return state.accounts.filter((account) => account.role === "dealer" || account.role === "admin");
  }
  return state.accounts.filter((account) => (
    account.role === "dealer" &&
    sameDealerCode(account.dealer_code, state.session?.dealer_code)
  ));
}

function canManageDealerStaff() {
  if (state.session?.role === "admin") return true;
  if (state.session?.role !== "dealer") return false;
  return isDealerTopManagerAccount(state.session);
}

function isDealerTopManagerAccount(account) {
  if (!account || account.role !== "dealer") return false;
  const topManager = topDealerAccountByCode(account.dealer_code);
  return Boolean(topManager && String(topManager.login_id).toLowerCase() === String(account.login_id || "").toLowerCase());
}

function topDealerAccountByCode(dealerCode) {
  return state.accounts.find((item) => item.role === "dealer" && sameDealerCode(item.dealer_code, dealerCode));
}

function sameDealerCode(left, right) {
  return String(left || "").toUpperCase() === String(right || "").toUpperCase();
}

function isProtectedRootAdmin(account) {
  if (!account) return false;
  return (
    String(account.login_id || "").toLowerCase() === "admin" &&
    String(account.dealer_code || "").toUpperCase() === headOfficeCode &&
    account.role === "admin"
  );
}

function inventoryOwnerAccounts() {
  return [
    { dealer_code: headOfficeCode, dealer_name: headOfficeName, is_active: true },
    ...uniqueDealerAccounts().filter((account) => toBool(account.is_active))
  ];
}

function accountToSession(account) {
  return {
    login_id: account.login_id,
    dealer_code: account.dealer_code,
    dealer_name: account.dealer_name,
    role: account.role,
    dealer_discount_rate: account.dealer_discount_rate || 0,
    is_first_login: account.is_first_login,
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

function upsertAccount(account) {
  const index = state.accounts.findIndex((item) => item.login_id === account.login_id);
  if (index >= 0) state.accounts[index] = account;
  else state.accounts.push(account);
}

function upsertInventory(row) {
  const index = state.inventory.findIndex((item) => item.dealer_code === row.dealer_code && item.sku === row.sku);
  if (index >= 0) state.inventory[index] = { ...state.inventory[index], ...row };
  else state.inventory.push(row);
}

function upsertInventoryRows(rows) {
  if (!Array.isArray(rows)) return;
  rows.filter(Boolean).forEach(upsertInventory);
}

function dealerInventoryForProduct(sku) {
  return state.inventory.find((row) => row.dealer_code === state.session?.dealer_code && row.sku === sku);
}

function reservationStockSummary(sku) {
  const inventory = dealerInventoryForProduct(sku);
  const currentStock = Number(inventory?.stock_qty || 0);
  const pendingQty = pendingReservationQty(sku);
  return {
    currentStock,
    pendingQty,
    availableStock: Math.max(currentStock - pendingQty, 0)
  };
}

function pendingReservationQty(sku) {
  if (!sku || !state.session) return 0;
  return state.reservations
    .filter((reservation) => (
      reservation.sku === sku &&
      reservation.dealer_code === state.session.dealer_code &&
      reservation.status !== "시공완료"
    ))
    .reduce((total, reservation) => total + Number(reservation.qty || 0), 0);
}

function adjustLocalInventory(dealerCode, sku, deltaQty, options = {}) {
  const product = state.products.find((item) => item.sku === sku) || {};
  const index = state.inventory.findIndex((item) => item.dealer_code === dealerCode && item.sku === sku);
  const current = index >= 0 ? state.inventory[index] : {
    dealer_code: dealerCode,
    dealer_name: dealerNameByCode(dealerCode),
    product_name: product.product_name || "",
    sku,
    category: product.category || "",
    color: product.color || colorNameFromText(product.product_name),
    stock_qty: 0,
    safety_stock: 0,
    location: `${dealerNameByCode(dealerCode)} 창고`,
    updated_at: ""
  };
  const nextQty = Number(current.stock_qty || 0) + Number(deltaQty || 0);
  if (options.requireEnoughStock && nextQty < 0) throw new Error(`${dealerNameByCode(dealerCode)} 재고가 부족합니다.`);
  const next = {
    ...current,
    product_name: current.product_name || product.product_name || "",
    category: current.category || product.category || "",
    color: current.color || product.color || colorNameFromText(product.product_name),
    stock_qty: nextQty,
    updated_at: nowText()
  };
  if (index >= 0) state.inventory[index] = next;
  else state.inventory.push(next);
  return next;
}

function upsertProduct(product) {
  const normalized = {
    ...product,
    retail_price: productRetailPrice(product),
    purchase_price: productPurchasePrice(product),
    color: product.color || colorNameFromText(product.product_name)
  };
  const index = state.products.findIndex((item) => item.sku === normalized.sku);
  if (index >= 0) state.products[index] = { ...state.products[index], ...normalized };
  else state.products.push(normalized);
}

function removeDealerAccount(loginId) {
  const account = state.accounts.find((item) => item.login_id === loginId);
  state.accounts = state.accounts.filter((item) => item.login_id !== loginId);
  const hasOtherDealerAccount = account?.role === "dealer" && state.accounts.some((item) => item.role === "dealer" && item.dealer_code === account.dealer_code);
  if (account?.role === "dealer" && !hasOtherDealerAccount) {
    state.inventory = state.inventory.filter((row) => row.dealer_code !== account.dealer_code);
    if (state.filters.dealerCode === account.dealer_code) state.filters.dealerCode = "전체";
    if (state.filters.salesDealerCode === account.dealer_code) state.filters.salesDealerCode = "전체";
  }
  delete state.tempPasswords[loginId];
}

function removeProduct(sku) {
  state.products = state.products.filter((product) => product.sku !== sku);
  state.inventory = state.inventory.filter((row) => row.sku !== sku);
  if (state.selectedSku === sku) {
    state.selectedSku = activeProducts()[0]?.sku || state.products[0]?.sku || "";
  }
  if (state.forms.inventorySku === sku) {
    state.forms.inventorySku = state.selectedSku;
    syncInventoryForm();
  }
  if (state.forms.productSku === sku) {
    state.forms.productSku = "";
    state.forms.productName = "";
    state.forms.productCategory = "PPF";
    state.forms.productUnit = "롤";
    state.forms.productRetailPrice = defaultRetailPrice;
    state.forms.productPurchasePrice = defaultPurchasePrice;
    state.forms.productIsActive = true;
  }
}

function dealerNameByCode(dealerCode) {
  return state.accounts.find((account) => account.dealer_code === dealerCode)?.dealer_name || dealerCode;
}

function dealerNameForCode(dealerCode, preferredName = "") {
  const existing = topDealerAccountByCode(dealerCode);
  if (existing?.dealer_name) return existing.dealer_name;
  const name = String(preferredName || "").trim();
  if (name) return name;
  return dealerCode ? `${dealerCode} 대리점` : "";
}

function syncAccountDealerNameFromCode() {
  if (state.forms.accountRole === "admin") return;
  const code = state.forms.accountDealerCode.trim().toUpperCase();
  if (!code) return;
  const existing = topDealerAccountByCode(code);
  const currentName = state.forms.accountDealerName.trim();
  const looksGenerated = /^[A-Z0-9-]+\s대리점$/.test(currentName);
  if (existing?.dealer_name) {
    state.forms.accountDealerName = existing.dealer_name;
    return;
  }
  if (!currentName || looksGenerated) {
    state.forms.accountDealerName = `${code} 대리점`;
  }
}

function seedInventoryForDealer(account) {
  state.products.forEach((product) => {
    state.inventory.push({
      dealer_code: account.dealer_code,
      dealer_name: account.dealer_name,
      product_name: product.product_name,
      sku: product.sku,
      category: product.category,
      color: product.color,
      stock_qty: 0,
      safety_stock: 80,
      location: `${account.dealer_name} 창고`,
      updated_at: nowText()
    });
  });
}

function defaultScreen() {
  return state.session?.role === "admin" ? "admin" : "inventory";
}

function currentDealerName() {
  return state.session?.dealer_name || "대리점";
}

function dataModeText() {
  if (state.dataMode === "appsScript") return "Google Apps Script API와 연결된 실데이터 모드입니다.";
  return "현재는 샘플 모드입니다. config.js 또는 Vercel 환경변수에 Apps Script URL을 넣으면 실데이터로 전환됩니다.";
}

function roleLabel(role) {
  return role === "admin" ? "관리자" : "대리점";
}

function statusTone(status) {
  if (status === "반려" || status === "취소") return "danger";
  if (status === "접수" || status === "승인" || status === shippingRegisteredTestStatus) return "warn";
  return "";
}

function isApprovedLikeStatus(status) {
  return status === "승인" || status === shippingRegisteredTestStatus;
}

function orderStatusLabel(status) {
  if (status === shippingRegisteredTestStatus) return "승인 · 테스트송장";
  return status || "";
}

function isOrderStatusActive(actualStatus, buttonStatus) {
  return buttonStatus === "승인" ? isApprovedLikeStatus(actualStatus) : actualStatus === buttonStatus;
}

function hasOrderStatusMatch(actualStatus, filterStatus) {
  return filterStatus === "승인" ? isApprovedLikeStatus(actualStatus) : actualStatus === filterStatus;
}

function colorHex(value) {
  const found = colorOptions.find((option) => option.value !== "전체" && normalize(value).includes(normalize(option.value)));
  return found?.hex || "#cf4e42";
}

function colorNameFromText(value) {
  const found = colorOptions.find((option) => option.value !== "전체" && normalize(value).includes(normalize(option.value)));
  return found?.value || "";
}

function roll(value) {
  return `${Number(value || 0).toLocaleString("ko-KR")}롤`;
}

function money(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("ko-KR")}원`;
}

function percent(value) {
  return `${Number(value || 0).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}%`;
}

function productRetailPrice(product) {
  const value = Number(product?.retail_price || 0);
  return value > 0 ? value : defaultRetailPrice;
}

function productPurchasePrice(product) {
  const value = Number(product?.purchase_price || 0);
  return value > 0 ? value : defaultPurchasePrice;
}

function dealerDiscountRate(dealerCode) {
  const dealerAccountsForCode = state.accounts.filter((item) => item.role === "dealer" && sameDealerCode(item.dealer_code, dealerCode));
  const topManager = dealerAccountsForCode[0];
  if (topManager && topManager.dealer_discount_rate !== undefined && topManager.dealer_discount_rate !== "") {
    return Number(topManager.dealer_discount_rate || 0);
  }
  const legacyAccount = dealerAccountsForCode.find((item) => item.dealer_discount_rate !== undefined && item.dealer_discount_rate !== "");
  return Number(legacyAccount?.dealer_discount_rate || 0);
}

function dealerSalePrice(product, dealerCode) {
  const retailPrice = productRetailPrice(product);
  const discountRate = dealerDiscountRate(dealerCode);
  return Math.round(retailPrice * (1 - discountRate / 100));
}

function nowText() {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

function dateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function compactDateValue(date = new Date()) {
  return dateInputValue(date).replaceAll("-", "");
}

function randomDigits(length) {
  const max = 10 ** Number(length || 6);
  return String(Math.floor(Math.random() * max)).padStart(Number(length || 6), "0");
}

function formatPhoneNumber(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function monthInputValue(date = new Date()) {
  return dateInputValue(date).slice(0, 7);
}

function parseDateInput(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date();
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function parseMonthInput(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})$/);
  if (!match) return new Date();
  return new Date(Number(match[1]), Number(match[2]) - 1, 1);
}

function shiftOrderCalendar(step) {
  if (!step) return;
  if (state.filters.orderPeriod === "일별") {
    const date = parseDateInput(state.filters.orderDate);
    date.setDate(date.getDate() + step);
    state.filters.orderDate = dateInputValue(date);
  }
  if (state.filters.orderPeriod === "월별") {
    const date = parseMonthInput(state.filters.orderMonth);
    date.setMonth(date.getMonth() + step);
    state.filters.orderMonth = monthInputValue(date);
  }
}

function shiftOrderYear(step) {
  if (!step) return;
  const date = parseMonthInput(state.filters.orderMonth);
  date.setFullYear(date.getFullYear() + step);
  state.filters.orderMonth = monthInputValue(date);
}

function shiftSalesCalendar(step) {
  if (!step) return;
  if (state.filters.salesPeriod === "일별") {
    const date = parseDateInput(state.filters.salesDate);
    date.setDate(date.getDate() + step);
    state.filters.salesDate = dateInputValue(date);
  }
  if (state.filters.salesPeriod === "월별") {
    const date = parseMonthInput(state.filters.salesMonth);
    date.setMonth(date.getMonth() + step);
    state.filters.salesMonth = monthInputValue(date);
  }
}

function shiftSalesYear(step) {
  if (!step) return;
  const date = parseMonthInput(state.filters.salesMonth);
  date.setFullYear(date.getFullYear() + step);
  state.filters.salesMonth = monthInputValue(date);
}

function orderCalendarLabel() {
  if (state.filters.orderPeriod === "일별") {
    const date = parseDateInput(state.filters.orderDate);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short"
    }).format(date);
  }
  if (state.filters.orderPeriod === "월별") {
    const date = parseMonthInput(state.filters.orderMonth);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long"
    }).format(date);
  }
  return "전체 기간";
}

function salesCalendarLabel() {
  if (state.filters.salesPeriod === "일별") {
    const date = parseDateInput(state.filters.salesDate);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short"
    }).format(date);
  }
  if (state.filters.salesPeriod === "월별") {
    const date = parseMonthInput(state.filters.salesMonth);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long"
    }).format(date);
  }
  return "전체 기간";
}

function salesPeriodLabel() {
  if (state.filters.salesDealerCode === "전체") return `통합 · ${salesCalendarLabel()}`;
  return `${dealerNameByCode(state.filters.salesDealerCode)} · ${salesCalendarLabel()}`;
}

function orderDatePart(value) {
  const text = String(value || "");
  const isoMatch = text.match(/\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];
  const koreanMatch = text.match(/(\d{4})\.\s*(\d{2})\.\s*(\d{2})/);
  if (koreanMatch) return `${koreanMatch[1]}-${koreanMatch[2]}-${koreanMatch[3]}`;
  return "";
}

function commonLoginUrl() {
  const base = appPublicBase();
  if (base.endsWith("index.html") || base.endsWith("/login")) return base;
  return `${base.replace(/\/$/, "")}/login`;
}

function dealerManualUrl() {
  const base = appPublicBase().replace(/\/index\.html$/, "").replace(/\/login$/, "");
  return `${base.replace(/\/$/, "")}/manual-dealer.html`;
}

function appPublicBase() {
  if (config.appPublicUrl) return String(config.appPublicUrl).replace(/\/$/, "");
  if (window.location.protocol === "file:") return window.location.href.split("?")[0];
  const path = window.location.pathname.endsWith("/") ? `${window.location.pathname}index.html` : window.location.pathname;
  return `${window.location.origin}${path}`;
}

function qrUrl(url) {
  return `https://quickchart.io/qr?size=260&margin=1&text=${encodeURIComponent(url)}`;
}

function kakaoMessage(account, url, temporaryPassword) {
  const manualUrl = dealerManualUrl();
  return `안녕하세요.
재고조회 및 발주는 아래 링크에서 진행해 주세요.

접속 링크: ${url}
초기 ID: ${account.login_id}
초기 PW: ${temporaryPassword}
대리점 코드: ${account.dealer_code}

최초 로그인 후 비밀번호를 변경해 주세요.

사용방법은 아래 대리점 사용설명서를 확인해 주세요.
대리점 사용설명서: ${manualUrl}`;
}

function accountKakaoGuideMessage(account) {
  const tempPassword = state.tempPasswords[account.login_id] || "초기 발급/초기화한 비밀번호";
  return kakaoMessage(account, commonLoginUrl(), tempPassword);
}

async function copyText(value) {
  await navigator.clipboard.writeText(value);
  showToast("복사되었습니다.");
}

async function shareText(value) {
  if (navigator.share) {
    await navigator.share({ text: value });
    return;
  }
  await copyText(value);
}

function downloadQr(url, fileName) {
  const link = document.createElement("a");
  link.href = qrUrl(url);
  link.download = fileName || "dealer-qr.png";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast("QR 다운로드를 시작했습니다.");
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function toBool(value) {
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true" || String(value) === "1";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "auto" });
}

let toastTimer = null;
function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}

initFromUrl();
render();
