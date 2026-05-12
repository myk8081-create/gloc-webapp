# Apps Script API 계약

프론트엔드는 Apps Script Web App URL 하나로 `POST` 요청을 보냅니다.

```json
{
  "action": "login",
  "token": "로그인 후 발급된 세션 토큰",
  "payload": {}
}
```

응답 형식:

```json
{
  "ok": true,
  "data": {}
}
```

오류 응답:

```json
{
  "ok": false,
  "error": "오류 메시지"
}
```

## Actions

### login

```json
{
  "login_id": "dealer01",
  "password": "********",
  "dealer_code": "D001"
}
```

### changePassword

```json
{
  "current_password": "현재 비밀번호",
  "new_password": "새 비밀번호"
}
```

### getInventory

관리자와 대리점/샵 모두 전체 재고 목록을 받습니다. 프론트엔드는 본사 재고, 내 재고, 전체 대리점/샵 재고를 탭으로 분리해 보여줍니다. 발주 등록과 재고 수정은 권한별 코드로 제한됩니다.

### createOrder

```json
{
  "sku": "TN-CH-035",
  "qty": 10,
  "memo": "배송 요청사항"
}
```

### getOrders

관리자는 전체 발주를, 대리점은 본인 발주만 받습니다.

### updateOrderStatus

관리자 전용입니다.

```json
{
  "order_id": "ORD-260511-ABC123",
  "status": "승인"
}
```

상태값: `접수`, `승인`, `출고`, `완료`, `반려`

### saveInventory

관리자는 본사 재고(`ADMIN`)만 저장할 수 있고, 대리점/샵은 본인 `dealer_code` 재고만 저장할 수 있습니다.
같은 `dealer_code` + `sku` 행이 있으면 수정하고, 없으면 새 행을 만듭니다.

```json
{
  "dealer_code": "D001",
  "sku": "PPF-CL-150",
  "stock_qty": 120,
  "safety_stock": 30,
  "location": "서울 창고 A-1"
}
```

### saveProduct

관리자 전용입니다. 같은 `sku`가 있으면 제품 정보를 수정하고, 없으면 새 제품을 등록합니다.
새 판매중 제품을 등록하면 활성 대리점별 재고 행이 0개로 자동 생성됩니다.

```json
{
  "sku": "PPF-CL-150",
  "product_name": "프리미엄 PPF 클리어 150",
  "category": "PPF",
  "unit": "롤",
  "is_active": true
}
```

### deleteProduct

관리자 전용입니다. `제품등록` 시트의 제품 행과 `재고현황` 시트의 같은 SKU 재고 행을 삭제합니다.
기존 발주 이력은 보존됩니다.

```json
{
  "sku": "PPF-CL-150"
}
```

### createDealerAccount

관리자 전용입니다.

```json
{
  "login_id": "dealer13",
  "dealer_code": "D013",
  "dealer_name": "강남 대리점",
  "temporary_password": "초기비밀번호"
}
```

### resetDealerPassword

관리자 전용입니다.

```json
{
  "login_id": "dealer13",
  "temporary_password": "새임시비밀번호"
}
```

### deactivateDealerAccount

관리자 전용입니다.

```json
{
  "login_id": "dealer13"
}
```

### deleteDealerAccount

관리자 전용입니다. `대리점관리` 시트의 대리점 계정 행과 `재고현황` 시트의 해당 대리점 재고 행을 삭제합니다.
기존 발주 이력은 보존됩니다.

```json
{
  "login_id": "dealer13"
}
```

### getDealerLinks

관리자 전용입니다.

```json
{
  "base_url": "https://stock.example.com"
}
```

응답의 `common_link`와 각 `links[].link`는 모두 같은 공통 로그인 링크입니다. 대리점 구분은 URL이 아니라 로그인 시 입력하는 `login_id`, `password`, `dealer_code`로 처리합니다.
