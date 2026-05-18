const app = document.querySelector("#app");
const config = window.FILM_STOCK_CONFIG || {};

const orderStatuses = ["접수", "승인", "출고", "완료", "반려"];
const headOfficeCode = "ADMIN";
const headOfficeName = "본사";

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
      is_first_login: false,
      is_active: true,
      updated_at: nowText()
    },
    ...mockDealers.map((dealer, index) => ({
      login_id: `dealer${String(index + 1).padStart(2, "0")}`,
      dealer_code: dealer.dealer_code,
      dealer_name: dealer.dealer_name,
      role: "dealer",
      is_first_login: index === 1,
      is_active: true,
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
      dealer_code: "D001",
      dealer_name: "서울 총판",
      product_name: products[0].product_name,
      sku: products[0].sku,
      qty: 40,
      status: "접수",
      memo: "이번 주 내 출고 요청",
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
  selectedColor: "전체",
  selectedSku: mockProducts[0].sku,
  filters: {
    inventoryQuery: "",
    inventoryScope: "mine",
    orderQuery: "",
    orderStatus: "전체",
    dealerCode: "전체"
  },
  forms: {
    loginRole: "dealer",
    loginId: "",
    password: "",
    dealerCode: "",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
    accountLoginId: "",
    accountDealerCode: "",
    accountDealerName: "",
    accountTemporaryPassword: "",
    inventoryDealerCode: "",
    inventorySku: "",
    inventoryStockQty: 0,
    inventorySafetyStock: 0,
    inventoryLocation: "",
    orderQty: 10,
    orderMemo: "",
    productSku: "",
    productName: "",
    productCategory: "PPF",
    productUnit: "롤",
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
      ${renderAdminDashboard()}
      ${renderDealerManagement()}
      ${renderInventory()}
      ${renderInventoryManage()}
      ${renderProductManage()}
      ${renderOrders()}
      ${renderOrderCreate()}
      ${renderDealerLinks()}
      ${renderBottomNav()}
      <div id="toast" class="toast" role="status"></div>
    </div>
  `;
  bindEvents();
}

function renderTopbar() {
  const isLoggedIn = Boolean(state.session);
  const subtitle = isLoggedIn ? `${state.session.dealer_name} · ${roleLabel(state.session.role)}` : "PPF · 틴팅 재고관리";
  const chip = isLoggedIn ? "로그인됨" : state.dataMode === "appsScript" ? "실데이터 모드" : "샘플 모드";
  return `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">
          <img src="gloc-logo.png" alt="GLOC" />
        </div>
        <div>
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
            <button class="quick-card" type="button" data-nav="dealers">
              <strong>계정관리</strong>
              <span>대리점 생성, 초기화, 사용중지</span>
            </button>
            <button class="quick-card" type="button" data-nav="links">
              <strong>QR/안내문</strong>
              <span>공통 QR과 대리점별 안내문 생성</span>
            </button>
          </div>
        </article>
        <article class="panel summary-panel">
          <h3>최근 발주</h3>
          <div class="history-list">
            ${visibleOrders().slice(0, 5).map(renderOrderMini).join("") || `<div class="empty">발주 내역이 없습니다.</div>`}
          </div>
        </article>
        ${renderPushNotificationPanel()}
      </section>
    </main>
  `;
}

function renderPushNotificationPanel() {
  if (state.session?.role !== "admin") return "";
  const canSubscribe = pushCanSubscribe();
  const buttonText = state.push.subscribed ? "이 기기 알림 다시 등록" : "이 기기에서 발주 알림 받기";
  return `
    <article class="panel summary-panel history-panel push-panel">
      <div class="panel-head-row">
        <div>
          <p class="eyebrow">관리자 알림</p>
          <h3>새 발주 푸시 알림</h3>
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
  const dealerAccounts = state.accounts.filter((account) => account.role === "dealer");
  return `
    <main class="screen ${state.screen === "dealers" ? "active" : ""}" data-screen="dealers">
      <section class="page-head">
        <p class="eyebrow">대리점 관리</p>
        <h1>계정 생성 및 상태 관리</h1>
        <p class="lead">대리점별 초기 ID/PW를 발급하고, 비밀번호 초기화 또는 계정 사용중지를 처리합니다.</p>
      </section>

      <section class="work-layout">
        <div class="panel form-panel">
          <h3>대리점 계정 생성</h3>
          <div class="form-grid">
            <label class="field">
              <span>대리점 코드</span>
              <input id="accountDealerCode" type="text" value="${escapeAttr(state.forms.accountDealerCode)}" placeholder="예: D013" />
            </label>
            <label class="field">
              <span>대리점명</span>
              <input id="accountDealerName" type="text" value="${escapeAttr(state.forms.accountDealerName)}" placeholder="예: 강남 대리점" />
            </label>
            <label class="field">
              <span>초기 아이디</span>
              <input id="accountLoginId" type="text" value="${escapeAttr(state.forms.accountLoginId)}" placeholder="예: gangnam01" />
            </label>
            <label class="field">
              <span>초기 비밀번호</span>
              <input id="accountTemporaryPassword" type="text" value="${escapeAttr(state.forms.accountTemporaryPassword)}" placeholder="관리자가 전달할 임시 비밀번호" />
            </label>
            <button type="button" class="primary-button" data-action="createAccount">대리점 계정 생성</button>
          </div>
        </div>

        <div class="panel list-panel">
          <h3>대리점 계정 목록</h3>
          <div class="account-list">
            ${dealerAccounts.map(renderAccountRow).join("") || `<div class="empty">등록된 대리점 계정이 없습니다.</div>`}
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderInventory() {
  const rows = visibleInventory();
  const scope = currentInventoryScope();
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
              ${rows.slice(0, 80).map(renderInventoryRow).join("") || `<tr><td colspan="6" class="empty-cell">조회 결과가 없습니다.</td></tr>`}
            </tbody>
          </table>
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
  return `
    <main class="screen ${state.screen === "orders" ? "active" : ""}" data-screen="orders">
      <section class="page-head">
        <p class="eyebrow">${state.session?.role === "admin" ? "관리자" : currentDealerName()}</p>
        <h1>발주관리</h1>
        <p class="lead">${state.session?.role === "admin" ? "전체 발주의 상태를 변경하고 검색합니다." : "내 대리점 발주 내역만 조회됩니다."}</p>
        <div class="page-actions">
          ${state.session?.role === "dealer" ? `<button class="primary-button" type="button" data-nav="orderCreate">발주 신청</button>` : ""}
          <button class="secondary-button" type="button" data-action="refresh">새로고침</button>
        </div>
      </section>

      <section class="toolbar">
        <input class="search-input" id="orderQuery" type="search" placeholder="주문번호, 제품명, SKU, 대리점명 검색" value="${escapeAttr(state.filters.orderQuery)}" />
        <select class="search-input compact-select" id="orderStatus">
          ${["전체", ...orderStatuses].map((status) => `<option value="${status}" ${state.filters.orderStatus === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
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

function renderOrderCreate() {
  const product = selectedProduct();
  const dealerInventory = state.inventory.find((row) => row.sku === product?.sku && row.dealer_code === state.session?.dealer_code);
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
  return `
    <button type="button" class="product-row ${active ? "active" : ""}" data-sku="${escapeAttr(product.sku)}">
      <span class="color-dot" style="background:${colorHex(product.color || product.product_name)}"></span>
      <span>
        <span class="product-name">${escapeHtml(product.product_name)}</span>
        <span class="product-meta">${escapeHtml(product.sku)} · ${escapeHtml(product.category || "")}</span>
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
  return `
    <article class="order-card">
      <div>
        <span class="badge ${statusTone(order.status)}">${escapeHtml(order.status)}</span>
        <h3>${escapeHtml(order.product_name)}</h3>
        <p class="product-meta">${escapeHtml(order.order_id)} · ${escapeHtml(order.sku)}</p>
        <p class="product-meta">${escapeHtml(order.dealer_name)} · ${escapeHtml(order.dealer_code)}</p>
      </div>
      <div class="order-side">
        <strong>${roll(Number(order.qty || 0))}</strong>
        <span>${escapeHtml(order.created_at || "")}</span>
      </div>
      <p class="order-memo">${escapeHtml(order.memo || "메모 없음")}</p>
      ${canChange ? `
        <div class="order-actions">
          ${orderStatuses.map((status) => `<button type="button" class="${order.status === status ? "active" : ""}" data-order-status="${status}" data-order-id="${escapeAttr(order.order_id)}">${status}</button>`).join("")}
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
        <div class="product-meta">${escapeHtml(order.dealer_name)} · ${escapeHtml(order.order_id)}</div>
      </div>
      <strong>${roll(Number(order.qty || 0))}</strong>
    </div>
  `;
}

function renderAccountRow(account) {
  return `
    <article class="account-row">
      <div>
        <span class="badge ${toBool(account.is_active) ? "" : "danger"}">${toBool(account.is_active) ? "사용중" : "중지"}</span>
        <h3>${escapeHtml(account.dealer_name)}</h3>
        <p class="product-meta">${escapeHtml(account.login_id)} · ${escapeHtml(account.dealer_code)} · 최초로그인 ${toBool(account.is_first_login) ? "필요" : "완료"}</p>
      </div>
      <div class="account-actions">
        <button type="button" class="secondary-button small-button" data-action="resetPassword" data-login-id="${escapeAttr(account.login_id)}">PW 초기화</button>
        <button type="button" class="secondary-button small-button danger-button" data-action="deactivateAccount" data-login-id="${escapeAttr(account.login_id)}">사용중지</button>
        <button type="button" class="secondary-button small-button danger-button" data-action="deleteAccount" data-login-id="${escapeAttr(account.login_id)}">계정삭제</button>
      </div>
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
  if (!state.session || state.screen === "passwordChange") return "";
  const admin = state.session.role === "admin";
  const items = admin
    ? [
        ["admin", "대시보드"],
        ["inventory", "재고"],
        ["inventoryManage", "수정"],
        ["productManage", "제품"],
        ["orders", "발주"],
        ["dealers", "대리점"],
        ["links", "QR"]
      ]
    : [
        ["inventory", "재고"],
        ["inventoryManage", "재고수정"],
        ["orderCreate", "발주신청"],
        ["orders", "내 발주"]
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
  bindInput("accountDealerCode", (value) => (state.forms.accountDealerCode = value.toUpperCase()));
  bindInput("accountDealerName", (value) => (state.forms.accountDealerName = value));
  bindInput("accountLoginId", (value) => (state.forms.accountLoginId = value));
  bindInput("accountTemporaryPassword", (value) => (state.forms.accountTemporaryPassword = value));
  bindInput("inventoryStockQty", (value) => (state.forms.inventoryStockQty = Number(value || 0)));
  bindInput("inventorySafetyStock", (value) => (state.forms.inventorySafetyStock = Number(value || 0)));
  bindInput("inventoryLocation", (value) => (state.forms.inventoryLocation = value));
  bindInput("orderQty", (value) => (state.forms.orderQty = Number(value || 0)));
  bindInput("orderMemo", (value) => (state.forms.orderMemo = value));
  bindInput("productSku", (value) => (state.forms.productSku = value.trim()));
  bindInput("productName", (value) => (state.forms.productName = value));
  bindInput("productUnit", (value) => (state.forms.productUnit = value));

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

  document.querySelector("#productIsActive")?.addEventListener("change", (event) => {
    state.forms.productIsActive = event.target.checked;
  });

  bindSearchInput("inventoryQuery", (value) => (state.filters.inventoryQuery = value));
  bindSearchInput("orderQuery", (value) => (state.filters.orderQuery = value));

  document.querySelector("#orderStatus")?.addEventListener("change", (event) => {
    state.filters.orderStatus = event.target.value;
    render();
  });

  document.querySelector("#dealerFilter")?.addEventListener("change", (event) => {
    state.filters.dealerCode = event.target.value;
    render();
  });

  document.querySelectorAll("[data-inventory-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.inventoryScope = button.dataset.inventoryScope;
      render();
    });
  });

  document.querySelectorAll("[data-color]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedColor = button.dataset.color;
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
      handleAction(button.dataset.action, button).catch((error) => showToast(error.message || "처리 중 오류가 발생했습니다."));
    });
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyText(button.dataset.copy));
  });

  document.querySelectorAll("[data-qr-download]").forEach((button) => {
    button.addEventListener("click", () => downloadQr(button.dataset.qrDownload, button.dataset.fileName));
  });
}

function bindInput(id, update) {
  document.querySelector(`#${id}`)?.addEventListener("input", (event) => update(event.target.value));
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
      updateOrderStatus(button.dataset.orderId, button.dataset.orderStatus).catch((error) => showToast(error.message));
    });
  });
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
    replaceHtml("#inventoryStats", renderInventoryStatsCards(rows));
    replaceHtml("#inventoryRows", rows.slice(0, 80).map(renderInventoryRow).join("") || `<tr><td colspan="6" class="empty-cell">조회 결과가 없습니다.</td></tr>`);
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

  if (state.screen === "orders") {
    replaceHtml("#orderList", visibleOrders().map(renderOrderCard).join("") || `<div class="empty">발주 내역이 없습니다.</div>`);
  }
}

function replaceHtml(selector, html) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.innerHTML = html;
  bindDynamicListEvents(target);
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
    state.session?.role === "admin" &&
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
  if (state.push.subscribed) return "이 기기는 새 발주가 등록되면 알림을 받을 수 있습니다.";
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
  if (state.session?.role !== "admin") throw new Error("관리자 계정에서만 발주 알림을 등록할 수 있습니다.");
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

async function sendTestPushNotification() {
  if (state.session?.role !== "admin") throw new Error("관리자 계정에서만 테스트 알림을 보낼 수 있습니다.");
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
  if (action === "logout") return logout();
  if (action === "refresh") return refreshData();
  if (action === "refreshLinks") return refreshLinks();
  if (action === "enablePushNotifications") return enablePushNotifications();
  if (action === "checkPushNotifications") return updatePushState(true);
  if (action === "sendTestPushNotification") return sendTestPushNotification();
  if (action === "createOrder") return createOrder();
  if (action === "saveInventory") return saveInventory();
  if (action === "saveProduct") return saveProduct();
  if (action === "createAccount") return createDealerAccount();
  if (action === "resetPassword") return resetDealerPassword(button.dataset.loginId);
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
  state.screen = toBool(state.session.is_first_login) ? "passwordChange" : defaultScreen();
  render();
  if (state.session?.role === "admin") updatePushState(false);
  scrollTop();
  showToast(toBool(state.session.is_first_login) ? "비밀번호 변경이 필요합니다." : "로그인되었습니다.");
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

async function refreshData(showDone = true) {
  if (window.FilmStockApi?.isEnabled() && state.session) {
    const [inventoryData, orderData] = await Promise.all([
      window.FilmStockApi.getInventory({}),
      window.FilmStockApi.getOrders({})
    ]);
    if (Array.isArray(inventoryData?.products)) state.products = inventoryData.products;
    if (Array.isArray(inventoryData?.inventory)) state.inventory = inventoryData.inventory;
    if (Array.isArray(orderData?.orders)) state.orders = orderData.orders;
    if (Array.isArray(orderData?.accounts)) state.accounts = orderData.accounts;
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
      dealer_code: state.session.dealer_code,
      dealer_name: state.session.dealer_name,
      product_name: product.product_name,
      sku: product.sku,
      qty,
      status: "접수",
      memo: state.forms.orderMemo,
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
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.updateOrderStatus({ orderId, status });
    if (data?.order) {
      state.orders = state.orders.map((order) => (order.order_id === orderId ? data.order : order));
    }
  } else {
    const order = state.orders.find((item) => item.order_id === orderId);
    if (order) {
      order.status = status;
      order.updated_at = nowText();
    }
  }
  render();
  showToast(`발주 상태를 ${status}(으)로 변경했습니다.`);
}

async function saveInventory() {
  ensureInventoryForm();
  const dealerCode = editableInventoryOwnerCode();
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
  await refreshData(false);
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
    is_active: state.forms.productIsActive
  };
  if (!payload.sku || !payload.product_name || !payload.category) {
    throw new Error("SKU, 제품명, 카테고리를 입력해 주세요.");
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
  const account = {
    login_id: state.forms.accountLoginId.trim(),
    dealer_code: state.forms.accountDealerCode.trim().toUpperCase(),
    dealer_name: state.forms.accountDealerName.trim(),
    temporary_password: state.forms.accountTemporaryPassword.trim()
  };
  if (!account.login_id || !account.dealer_code || !account.dealer_name || !account.temporary_password) {
    throw new Error("대리점 코드, 이름, 아이디, 초기 비밀번호를 모두 입력해 주세요.");
  }

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.createDealerAccount(account);
    if (data?.account) upsertAccount(data.account);
    state.tempPasswords[account.login_id] = data?.temporary_password || account.temporary_password;
  } else {
    if (state.accounts.some((item) => item.login_id === account.login_id)) throw new Error("이미 사용 중인 아이디입니다.");
    const newAccount = {
      login_id: account.login_id,
      dealer_code: account.dealer_code,
      dealer_name: account.dealer_name,
      role: "dealer",
      is_first_login: true,
      is_active: true,
      updated_at: nowText()
    };
    state.accounts.push(newAccount);
    state.tempPasswords[account.login_id] = account.temporary_password;
    seedInventoryForDealer(newAccount);
  }

  state.forms.accountLoginId = "";
  state.forms.accountDealerCode = "";
  state.forms.accountDealerName = "";
  state.forms.accountTemporaryPassword = "";
  render();
  showToast("대리점 계정을 생성했습니다.");
}

async function resetDealerPassword(loginId) {
  const temporaryPassword = prompt("새 임시 비밀번호를 입력해 주세요. 최초 로그인 후 대리점이 변경해야 합니다.");
  if (!temporaryPassword) return;
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.resetDealerPassword({ loginId, temporaryPassword });
    if (data?.account) upsertAccount(data.account);
  } else {
    const account = state.accounts.find((item) => item.login_id === loginId);
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
  const confirmed = confirm("이 대리점 계정을 사용중지할까요?");
  if (!confirmed) return;
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.deactivateDealerAccount({ loginId });
    if (data?.account) upsertAccount(data.account);
  } else {
    const account = state.accounts.find((item) => item.login_id === loginId);
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
  const dealerName = account?.dealer_name || loginId;
  const confirmed = confirm(`${dealerName} 계정을 완전히 삭제할까요?\n해당 대리점의 재고 행도 함께 삭제됩니다. 발주 이력은 보존됩니다.`);
  if (!confirmed) return;

  if (window.FilmStockApi?.isEnabled()) {
    await window.FilmStockApi.deleteDealerAccount({ loginId });
    removeDealerAccount(loginId);
    await refreshData(false);
  } else {
    removeDealerAccount(loginId);
  }
  render();
  showToast("대리점 계정을 삭제했습니다.");
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
  render();
  scrollTop();
  showToast("로그아웃되었습니다.");
}

function navigate(screen) {
  if (screen === "dealers" || screen === "links" || screen === "admin" || screen === "productManage") {
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

function visibleInventory() {
  const query = normalize(state.filters.inventoryQuery);
  const scope = currentInventoryScope();
  return state.inventory
    .filter((row) => {
      if (scope === "mine" && row.dealer_code !== state.session?.dealer_code) return false;
      if (scope === "headOffice" && row.dealer_code !== headOfficeCode) return false;
      if (scope === "dealerAll" && row.dealer_code === headOfficeCode) return false;
      if (state.selectedColor !== "전체" && row.color !== state.selectedColor && !normalize(row.product_name).includes(normalize(state.selectedColor))) return false;
      if (!query) return true;
      return [row.product_name, row.sku, row.dealer_name, row.dealer_code, row.stock_qty, row.category, row.color]
        .some((value) => normalize(value).includes(query));
    })
    .sort((a, b) => Number(a.stock_qty) - Number(b.stock_qty));
}

function filteredProducts() {
  const query = normalize(state.filters.inventoryQuery);
  return activeProducts().filter((product) => {
    if (state.selectedColor !== "전체" && product.color !== state.selectedColor && !normalize(product.product_name).includes(normalize(state.selectedColor))) return false;
    if (!query) return true;
    return [product.product_name, product.sku, product.category, product.color].some((value) => normalize(value).includes(query));
  });
}

function visibleOrders() {
  const query = normalize(state.filters.orderQuery);
  return state.orders.filter((order) => {
    if (state.session?.role === "dealer" && order.dealer_code !== state.session.dealer_code) return false;
    if (state.filters.orderStatus !== "전체" && order.status !== state.filters.orderStatus) return false;
    if (!query) return true;
    return [order.order_id, order.product_name, order.sku, order.dealer_name, order.dealer_code, order.memo, order.status]
      .some((value) => normalize(value).includes(query));
  });
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
    activeDealers: state.accounts.filter((account) => account.role === "dealer" && toBool(account.is_active)).length,
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

function inventoryOwnerAccounts() {
  return [
    { dealer_code: headOfficeCode, dealer_name: headOfficeName, is_active: true },
    ...dealerAccounts().filter((account) => toBool(account.is_active))
  ];
}

function accountToSession(account) {
  return {
    login_id: account.login_id,
    dealer_code: account.dealer_code,
    dealer_name: account.dealer_name,
    role: account.role,
    is_first_login: account.is_first_login
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

function upsertProduct(product) {
  const normalized = {
    ...product,
    color: product.color || colorNameFromText(product.product_name)
  };
  const index = state.products.findIndex((item) => item.sku === normalized.sku);
  if (index >= 0) state.products[index] = { ...state.products[index], ...normalized };
  else state.products.push(normalized);
}

function removeDealerAccount(loginId) {
  const account = state.accounts.find((item) => item.login_id === loginId);
  state.accounts = state.accounts.filter((item) => item.login_id !== loginId);
  if (account) {
    state.inventory = state.inventory.filter((row) => row.dealer_code !== account.dealer_code);
    if (state.filters.dealerCode === account.dealer_code) state.filters.dealerCode = "전체";
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
    state.forms.productIsActive = true;
  }
}

function dealerNameByCode(dealerCode) {
  return state.accounts.find((account) => account.dealer_code === dealerCode)?.dealer_name || dealerCode;
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
  if (status === "반려") return "danger";
  if (status === "접수" || status === "승인") return "warn";
  return "";
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

function commonLoginUrl() {
  const base = appPublicBase();
  if (base.endsWith("index.html") || base.endsWith("/login")) return base;
  return `${base.replace(/\/$/, "")}/login`;
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
  return `안녕하세요.
재고조회 및 발주는 아래 링크에서 진행해 주세요.

접속 링크: ${url}
초기 ID: ${account.login_id}
초기 PW: ${temporaryPassword}
대리점 코드: ${account.dealer_code}

최초 로그인 후 비밀번호를 변경해 주세요.`;
}

async function copyText(value) {
  await navigator.clipboard.writeText(value);
  showToast("복사되었습니다.");
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
