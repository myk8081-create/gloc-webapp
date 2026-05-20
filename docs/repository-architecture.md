# Repository / Provider 구조

현재 운영 앱은 기존 UI를 유지하기 위해 정적 프론트엔드를 그대로 사용합니다. 다만 데이터 접근은 아래 구조로 분리해 향후 Next.js App Router 또는 Supabase 전환이 가능하도록 정리했습니다.

## 원칙

- 프론트엔드는 Google Sheets 원본 URL을 직접 호출하지 않습니다.
- 브라우저는 Vercel API `/api/gloc`만 호출합니다.
- `/api/gloc`는 서버 환경변수의 `APPS_SCRIPT_API_URL`로 Apps Script API를 호출합니다.
- Repository는 업무 기능 단위, Provider는 실제 저장소 단위로 분리합니다.

## 추가된 구조

```text
src/lib/repositories
  orders.repository.ts
  agencies.repository.ts
  settings.repository.ts

src/lib/providers
  googleSheets.provider.ts
  supabase.provider.ts
  provider.types.ts
  index.ts

app/api
  orders/route.ts
  orders/[orderNo]/status/route.ts
  agencies/route.ts
  settings/route.ts
  setup-sheets/route.ts

api
  gloc.js
```

## Google Sheets 시트 구조

새 Repository 계층에서 사용하는 표준 시트는 아래와 같습니다. 기존 운영 시트는 삭제하지 않고 그대로 둡니다.

### Orders

`order_no`, `agency_id`, `product_name`, `quantity`, `status`, `courier`, `tracking_no`, `shipping_receipt_no`, `print_status`, `printed_at`, `print_count`, `shipping_error`, `approved_at`, `created_at`

### Agencies

`id`, `dealer_id`, `agency_name`, `contact_name`, `phone`, `zipcode`, `address`, `address_detail`, `default_courier`, `shipping_memo`, `is_active`, `is_first_login`, `password_changed_at`, `profile_completed_at`, `updated_at`

### Settings

`key`, `value`

### Logs

`created_at`, `level`, `message`

## 고객별 Google Sheets 분리

기본 고객은 아래 환경변수를 사용합니다.

```text
APPS_SCRIPT_API_URL=https://script.google.com/macros/s/.../exec
GLOC_CUSTOMER_ID=default
```

고객별로 분리하려면 고객 ID를 붙인 환경변수를 추가합니다.

```text
APPS_SCRIPT_API_URL_GLOC_A=https://script.google.com/macros/s/.../exec
APPS_SCRIPT_API_URL_GLOC_B=https://script.google.com/macros/s/.../exec
```

API 요청에서 `x-gloc-customer: gloc_a` 헤더를 보내면 `APPS_SCRIPT_API_URL_GLOC_A`를 사용합니다. 없으면 기본 `APPS_SCRIPT_API_URL`을 사용합니다.

## Supabase 전환

현재는 `DATA_PROVIDER=googleSheets`가 기본값입니다.

나중에 Supabase로 전환할 때는 Repository는 유지하고 `src/lib/providers/supabase.provider.ts`만 실제 Supabase 쿼리로 채우면 됩니다.

```text
DATA_PROVIDER=supabase
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```
