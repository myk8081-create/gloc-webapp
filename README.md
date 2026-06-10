# GLOC 재고관리/발주 웹앱

PPF/틴팅/디테일링 제품을 판매하는 본사와 대리점용 재고조회 및 발주관리 웹앱입니다.
모바일 QR 접속, 카카오톡 링크 전달, 대리점별 권한 분리, Google Sheets 기반 납품 구조를 기준으로 제작되어 있습니다.

## 구성

- Frontend: HTML, CSS, JavaScript 정적 웹앱
- Backend/DB: Vercel API Route + Repository/Provider 계층 + Google Sheets/Apps Script
- Deploy: Vercel 정적 배포 + 발주 푸시 알림 API
- 주요 화면: 로그인, 최초 비밀번호 변경, 관리자 대시보드, 대리점 관리, 본사/내 재고/전체 대리점·샵 재고조회, 재고수정, 제품등록/수정, 발주관리, 발주신청, 예약관리, 정품인증서, 매출현황, 상담 시뮬레이터, QR/카카오톡 안내문 생성

## 코드 구조

기존 UI는 유지하면서 데이터 접근 구조를 분리했습니다.

- 브라우저: `/api/gloc`만 호출
- Vercel API: Apps Script Web App URL을 서버 환경변수에서 읽어 호출
- Repository: `src/lib/repositories`
- Provider: `src/lib/providers`
- Next.js App Router 전환용 API Route 초안: `app/api`

상세 구조와 고객별 Google Sheets 분리 방식은 [docs/repository-architecture.md](docs/repository-architecture.md)를 참고하세요.
Google Sheets 로그인·조회·저장 속도 개선 구조와 배포 방법은 [docs/google-sheets-performance.md](docs/google-sheets-performance.md)를 참고하세요.

## 최종 인수인계

고객에게 넘기기 전에는 [docs/handover-guide.md](docs/handover-guide.md)의 체크리스트를 따라 진행하세요.
소스코드, Google Sheets/Apps Script, Vercel 배포, Figma 디자인, 관리자 계정 정보를 각각 확인하면 납품 후 운영자가 직접 관리할 수 있습니다.

비개발자 운영자는 [docs/manual-book.html](docs/manual-book.html)을 브라우저에서 열어 단계별 클릭형 사용 매뉴얼로 볼 수 있습니다.
매뉴얼 문구를 직접 수정할 때는 [docs/manual-edit-guide.md](docs/manual-edit-guide.md)를 참고하세요.

역할별로 따로 전달할 때는 [docs/manual-admin.html](docs/manual-admin.html)을 본사용으로, [docs/manual-dealer.html](docs/manual-dealer.html)을 대리점/샵용으로 사용하세요.
휴대폰에서 보려면 배포된 사이트의 `/manual.html` 주소를 사용하세요. 예: `https://운영도메인/manual.html`

## Google Sheets 만들기

1. Google Drive에서 새 스프레드시트를 만듭니다.
2. 메뉴에서 `확장 프로그램 > Apps Script`를 엽니다.
3. 이 프로젝트의 `apps-script/Code.js` 내용을 Apps Script 편집기에 붙여 넣습니다.
4. 저장 후 함수 목록에서 `setupInitialData`를 선택하고 실행합니다.
5. 권한 승인 화면이 나오면 승인합니다.

`setupInitialData`가 아래 시트를 자동 생성합니다. 이미 같은 이름의 시트가 있으면 그 시트를 사용합니다.

### 대리점관리

| 컬럼 | 설명 |
| --- | --- |
| login_id | 로그인 아이디 |
| password_hash | 해시 처리된 비밀번호 |
| dealer_code | 대리점 코드 |
| dealer_name | 대리점명 |
| dealer_discount_rate | 대리점 공통 할인율(%). 각 대리점 최상위 관리자 행에만 저장하고, 같은 dealer_code 담당자는 이 값을 자동 적용 |
| can_access_ppf | PPF 재고 확인 및 주문 권한 |
| can_access_tinting | 틴팅 재고 확인 및 주문 권한 |
| can_access_detailing | 디테일링 재고 확인 및 주문 권한 |
| role | `admin` 또는 `dealer` |
| is_first_login | 최초 로그인 여부 |
| is_active | 계정 활성 여부 |
| updated_at | 수정일 |

### 재고현황

| 컬럼 | 설명 |
| --- | --- |
| dealer_code | 대리점 코드 |
| product_name | 제품명 |
| sku | SKU |
| stock_qty | 현재 재고 |
| safety_stock | 안전재고 |
| location | 보관 위치 |
| updated_at | 수정일 |

### 발주현황

| 컬럼 | 설명 |
| --- | --- |
| order_id | 발주번호 |
| dealer_code | 대리점 코드 |
| dealer_name | 대리점명 |
| created_by_login_id | 발주 담당자 아이디 |
| product_name | 제품명 |
| sku | SKU |
| product_category | 발주 제품 카테고리. `PPF`, `TINTING`, `DETAILING` |
| qty | 발주 수량 |
| unit_retail_price | 발주 당시 제품 소비자가 |
| dealer_discount_rate | 발주 당시 대리점 할인율(%) |
| unit_sale_price | 발주 당시 할인 적용 판매가 |
| unit_purchase_price | 발주 당시 제품 매입가 |
| status | `접수`, `승인`, `출고`, `완료`, `반려`, `취소` |
| memo | 메모 |
| shipping_company | 택배사 |
| tracking_number | 송장번호 |
| created_at | 생성일 |
| updated_at | 수정일 |

### 제품등록

| 컬럼 | 설명 |
| --- | --- |
| sku | SKU |
| product_name | 제품명 |
| category | `PPF`, `TINTING`, `DETAILING` |
| unit | 단위 |
| retail_price | 소비자가. 비어 있으면 기본 1,000,000원 적용 |
| purchase_price | 매입가. 비어 있으면 기본 500,000원 적용 |
| is_active | 판매 여부 |

### 예약현황

| 컬럼 | 설명 |
| --- | --- |
| reservation_id | 예약번호 |
| dealer_code | 예약 대리점 코드 |
| dealer_name | 예약 대리점명 |
| created_by_login_id | 예약 담당자 아이디 |
| customer_name | 고객명 |
| customer_phone | 고객 연락처 |
| vehicle_number | 차량번호 |
| vehicle_model | 차량모델 |
| reservation_date | 예약일 |
| product_name | 기존 화면 호환용 대표 제품명 |
| sku | 기존 화면 호환용 대표 SKU |
| qty | 전체 예약 수량 합계 |
| reservation_items | 여러 예약 제품과 시공 부위를 저장하는 JSON |
| status | `예약`, `재고부족`, `시공완료` |
| memo | 예약 메모 |
| completed_at | 시공완료 처리일 |
| created_at | 생성일 |
| updated_at | 수정일 |

`reservation_items`에는 제품별 `sku`, `product_name`, `category`, `usage_area`, `qty`가 저장됩니다. 기존 단일 제품 예약은 자동으로 한 개의 예약 항목으로 변환해 읽으므로 기존 데이터도 그대로 사용할 수 있습니다.

### 카테고리 권한과 기존 데이터

- 관리자는 PPF, 틴팅, 디테일링 전체 상품과 재고 및 발주를 조회할 수 있습니다.
- 대리점은 관리자에게 허용받은 카테고리만 조회하고 발주할 수 있습니다. 같은 `dealer_code`를 사용하는 담당자 계정에는 동일한 권한이 적용됩니다.
- 기존 대리점 계정은 자동으로 PPF와 틴팅 권한이 활성화되고, 디테일링 권한은 비활성화됩니다.
- 기존 제품의 카테고리가 비어 있으면 제품명/SKU를 기준으로 틴팅과 디테일링을 판별하고, 분류할 수 없는 제품은 PPF로 저장합니다.
- 기존 발주의 `product_category`가 비어 있으면 제품 SKU의 카테고리를 기준으로 자동 저장합니다.
- 예약 생성과 시공완료 처리에서도 예약 항목별 카테고리 권한을 검사합니다. 권한이 없는 사업부 제품은 예약하거나 조회할 수 없습니다.
- 최신 `apps-script/Code.js`를 배포한 뒤 처음 API를 호출하면 필요한 컬럼 추가와 기존 데이터 보정이 자동 실행됩니다.

### 차량등록

| 컬럼 | 설명 |
| --- | --- |
| id | 차량 고유 ID. 예: `tesla-model3-highland` |
| brand | 브랜드 |
| model_name | 모델명 |
| generation_name | 세부 모델명 |
| body_code | 바디 코드 |
| model_year | 연식 |
| vehicle_type | 차종 |
| default_color | 기본 색상 |
| image_mode_enabled | 2.5D 이미지/SVG 모드 사용 여부 |
| three_d_enabled | 3D GLB 모드 사용 여부 |
| glb_file_url | GLB 파일 경로 |
| is_active | 사용 여부 |

### 상담현황

| 컬럼 | 설명 |
| --- | --- |
| consultation_id | 상담 저장번호 |
| dealer_code | 대리점 코드 |
| dealer_name | 대리점명 |
| created_by_login_id | 상담 담당자 아이디 |
| customer_name | 고객명 |
| customer_phone | 고객 연락처 |
| vehicle_id | 차량 ID |
| vehicle_model | 차량 모델 표시명 |
| vehicle_color | 선택 색상 |
| selected_tint_products | 선택 틴팅 제품 JSON |
| selected_ppf_products | 선택 PPF 제품 JSON |
| selected_ppf_parts | 선택 PPF 부위 JSON |
| quote_total | 총 견적 |
| memo | 상담 메모 |
| status | 상담 상태 |
| created_at | 생성일 |
| updated_at | 수정일 |

### settings

| 컬럼 | 설명 |
| --- | --- |
| key | 설정 키 |
| value | 설정 값 |

### 푸시구독

| 컬럼 | 설명 |
| --- | --- |
| subscription_id | 푸시 구독 고유값 |
| login_id | 관리자 아이디 |
| dealer_code | 관리자 코드 |
| role | 계정 권한 |
| endpoint | 브라우저 푸시 엔드포인트 |
| subscription_json | 브라우저 푸시 구독 JSON |
| user_agent | 등록한 기기/브라우저 정보 |
| is_active | 알림 사용 여부 |
| created_at | 생성일 |
| updated_at | 수정일 |

## Apps Script 배포

1. Apps Script 편집기 오른쪽 위 `배포 > 새 배포`를 누릅니다.
2. 유형 선택에서 `웹 앱`을 선택합니다.
3. 실행 계정은 `나`로 둡니다.
4. 액세스 권한은 운영 방식에 맞게 `모든 사용자` 또는 조직 내부 사용자로 설정합니다.
5. 배포 후 발급되는 Web App URL을 복사합니다. 예: `https://script.google.com/macros/s/.../exec`

프론트엔드는 이 URL만 호출하며 Google Sheets 원본 URL은 노출하지 않습니다.

## 초기 관리자 계정

`setupInitialData` 실행 후 기본 관리자 계정이 생성됩니다.

```text
아이디: admin
초기 비밀번호: admin1234!
대리점 코드: ADMIN
```

첫 로그인 후 반드시 비밀번호를 변경하세요.

## 로컬 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:4173`으로 접속합니다.
기본 상태는 샘플 데이터 모드입니다.

## 실제 Apps Script 연결

로컬에서 바로 연결하려면 `config.js`를 수정합니다.

```js
window.FILM_STOCK_CONFIG = {
  dataMode: "appsScript",
  apiBaseUrl: "/api/gloc",
  appsScriptUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  appPublicUrl: "https://stock.example.com",
  vapidPublicKey: "VAPID_PUBLIC_KEY"
};
```

## Vercel 배포

1. GitHub에 이 프로젝트를 업로드합니다.
2. Vercel에서 새 프로젝트로 가져옵니다.
3. Environment Variables에 아래 값을 등록합니다.

```text
DATA_MODE=appsScript
API_BASE_URL=/api/gloc
APPS_SCRIPT_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
APP_PUBLIC_URL=https://stock.example.com
VAPID_PUBLIC_KEY=YOUR_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY=YOUR_VAPID_PRIVATE_KEY
VAPID_SUBJECT=mailto:admin@example.com
PUSH_API_SECRET=CHANGE_ME_TO_A_LONG_RANDOM_SECRET
SHIPPING_MODE=mock
LABEL_PRINT_MODE=test
LABEL_PRIVACY_MASKING=true
```

4. 배포합니다.

빌드 명령은 `npm run build`, 출력 폴더는 `dist`입니다. `vercel.json`에 이미 설정되어 있습니다.

푸시 알림용 VAPID 키는 아래 명령으로 생성합니다.

```bash
npm run generate:vapid
```

송장 출력은 우체국 소포 라벨지 위에 검정 텍스트와 Code128 바코드만 찍는 오버레이 방식입니다. 관리자 `송장출력 설정` 미리보기에서는 `public/templates/korea-post-label-preview.png` 배경 이미지를 보여 주지만 실제 출력창에는 배경, 빨간선, 로고, 박스가 포함되지 않습니다. `SHIPPING_MODE=production`으로 바꾸면 테스트 워터마크가 사라지고, `LABEL_PRIVACY_MASKING=false`로 바꾸면 출력용 이름/전화번호/상세주소 마스킹이 해제됩니다.

관리자 화면의 `송장출력 설정`에서 라벨 전체 이동값, 배율, 권역코드, 분류번호, 바코드, 발송인/수령인 블록 좌표를 0.5mm 단위로 보정할 수 있습니다. 저장한 값은 Google Sheets `settings` 시트에 `label_*`, `zone_code_*`, `sort_code_*`, `left_barcode_*`, `sender_block_*`, `receiver_block_*`, `tracking_text_*`, `bottom_barcode_*` 키로 기록됩니다. 이 기능을 운영 사이트에서 쓰려면 최신 `apps-script/Code.js`를 Apps Script에 붙여 넣고 웹 앱을 다시 배포해야 합니다.

## 관리자 발주 푸시 알림

관리자가 홈 화면에 추가한 웹앱에서 알림을 허용하면, 대리점 발주 등록 시 관리자 기기로 푸시 알림을 받을 수 있습니다.

1. Vercel 환경변수에 `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `PUSH_API_SECRET`를 등록합니다.
2. 재배포 후 Google Sheets의 `settings` 시트에 아래 값을 추가합니다.

```text
push_api_url=https://stock.example.com/api/send-push
push_api_secret=Vercel에 넣은 PUSH_API_SECRET과 같은 값
push_click_url=https://stock.example.com/index.html
app_public_url=https://stock.example.com
```

3. Apps Script의 `apps-script/Code.js` 최신 내용을 붙여 넣고 웹 앱을 다시 배포합니다.
4. 관리자 계정으로 로그인합니다.
5. 관리자 대시보드의 `새 발주 푸시 알림` 영역에서 `이 기기에서 발주 알림 받기`를 누릅니다.
6. iPhone은 Safari에서 사이트를 열어 홈 화면에 추가한 뒤, 홈 화면 아이콘으로 실행해야 알림 권한을 받을 수 있습니다. Android는 Chrome에서 바로가기 앱 또는 브라우저에서 사용할 수 있습니다.

## 대리점 계정 생성

1. 관리자 계정으로 로그인합니다.
2. `대리점` 화면으로 이동합니다.
3. 대리점 코드, 대리점명, 대리점 할인율(%), 초기 아이디, 초기 비밀번호를 입력합니다.
4. 생성된 대리점은 최초 로그인 후 비밀번호 변경이 필수입니다.

비밀번호는 Google Sheets에 평문으로 저장되지 않고 `password_hash`에 해시값으로 저장됩니다.
대리점 계정을 삭제하면 계정 행과 해당 대리점의 재고 행이 삭제됩니다. 기존 발주 이력은 보존됩니다.

## 웹에서 재고와 제품 관리

- 로그인 후 상단의 `전체`, `PPF`, `틴팅`, `디테일링` 사업부 탭을 선택하면 상품, 재고, 발주, 예약, 통계가 함께 필터링됩니다. 선택값은 URL과 브라우저에 저장되어 새로고침 후에도 유지됩니다.
- 대리점은 허용받은 사업부 탭만 볼 수 있고, 관리자는 모든 사업부를 선택할 수 있습니다.
- 관리자는 `재고 수정` 화면에서 본사 재고의 현재 재고, 안전재고, 보관 위치를 저장할 수 있습니다.
- 대리점/샵 계정은 `재고 수정` 화면에서 본인 대리점/샵 재고만 수정할 수 있습니다.
- `재고조회` 화면에서는 본사 재고, 내 재고, 전체 대리점/샵 재고를 탭으로 분리해 조회할 수 있습니다.
- 관리자는 `제품` 화면에서 SKU, 제품명, 카테고리, 단위, 판매 여부를 등록/수정할 수 있습니다.
- 관리자는 `제품` 화면에서 소비자가와 매입가를 함께 입력합니다.
- 관리자는 `대리점` 화면에서 대리점 최상위 관리자 계정의 공통 할인율(%)만 입력하거나 수정할 수 있습니다. 같은 `dealer_code`로 생성된 추가 담당자는 별도 할인율 칸이 없고 최상위 관리자 할인율을 그대로 사용합니다.
- 새 제품을 등록하면 활성 대리점별 재고 행이 0개로 자동 생성됩니다.
- 제품을 삭제하면 제품 행과 해당 SKU의 재고 행이 삭제됩니다. 기존 발주 이력은 보존됩니다.

## 복합 예약 관리

- 대리점 `예약` 화면에서 제품명, SKU, 브랜드, 컬러를 검색할 수 있습니다. 검색창을 누르고 검색어를 입력하지 않으면 현재 사업부의 전체 제품이 표시됩니다.
- 제품 검색 목록은 `위/아래 방향키`, `Enter`, `Esc`로도 조작할 수 있습니다.
- 한 예약에 여러 제품을 추가할 수 있고, 같은 제품도 전면과 후면처럼 시공 부위를 나누어 반복 추가할 수 있습니다.
- PPF, 틴팅, 디테일링 사업부에 맞는 시공 부위 선택지가 자동 표시됩니다.
- 현재재고, 시공 전 예약수량, 예약 가능수량, 이번 예약 후 수량을 SKU별 총 예약수량 기준으로 계산합니다.
- 시공완료 시 예약에 포함된 모든 제품 재고가 각각 차감됩니다.

운영 사이트에 복합 예약 기능을 적용하려면 최신 `apps-script/Code.js`를 Apps Script 편집기에 붙여 넣고 웹 앱을 다시 배포해야 합니다. 처음 API를 호출하면 `예약현황` 시트에 `reservation_items` 컬럼이 자동 추가됩니다.

## 매출현황

- 관리자는 `매출` 화면에서 완료 처리된 발주 기준으로 매출을 조회합니다.
- 일별, 월별, 전체 기간으로 검색할 수 있고, 통합 또는 대리점별로 분리해서 볼 수 있습니다.
- 계산식은 `판매가 = 소비자가 × (1 - 대리점 할인율/100)`, `이익 = 판매가 - 매입가`이며 수량이 자동 반영됩니다.
- 발주 당시의 소비자가, 할인율, 매입가가 `발주현황` 시트에 함께 저장되므로 이후 제품 가격이나 할인율을 바꿔도 과거 매출 이력은 유지됩니다.

## QR코드와 카카오톡 링크

1. 관리자 화면에서 `QR` 메뉴로 이동합니다.
2. 모든 대리점이 함께 쓰는 공통 접속 링크가 생성됩니다. 예: `https://stock.example.com/login`
3. 공통 QR 다운로드 버튼으로 QR 이미지를 저장합니다.
4. 대리점별 안내문 복사 버튼을 눌러 카카오톡으로 전달합니다.

QR과 접속 링크는 모든 대리점이 동일하게 사용합니다. 대리점 구분은 로그인 화면에서 `초기 ID`, `초기 PW`, `대리점 코드`로 처리합니다.

카카오톡 안내문 예시:

```text
안녕하세요.
재고조회 및 발주는 아래 링크에서 진행해 주세요.

접속 링크: https://stock.example.com/login
초기 ID: dealer01
초기 PW: 초기 발급/초기화한 비밀번호
대리점 코드: D001

최초 로그인 후 비밀번호를 변경해 주세요.
```

기존 계정의 초기 비밀번호는 해시로만 저장되므로 다시 확인할 수 없습니다.
안내문에 초기 PW를 넣어야 하면 관리자 화면에서 비밀번호 초기화를 한 뒤 전달하세요.

## 고객 납품 및 소유권 이전

권장 절차:

1. 제작자 계정에서 기능 검수
2. 고객 Google 계정으로 스프레드시트 소유권 이전
3. Apps Script 프로젝트도 고객 계정에서 접근 가능하도록 이전 또는 고객 계정에서 새로 생성
4. 고객 계정에서 Apps Script Web App 재배포
5. Vercel 환경변수의 `APPS_SCRIPT_API_URL`을 고객 배포 URL로 변경
6. 고객 도메인 연결 후 `APP_PUBLIC_URL` 변경
7. 관리자 초기 비밀번호 변경 및 대리점 계정 발급

## 보안 메모

- Google Sheets 원본 URL은 프론트엔드에 넣지 않습니다.
- 프론트엔드는 Apps Script Web App URL만 호출합니다.
- 로그인 검증과 비밀번호 변경은 Apps Script 내부에서 처리합니다.
- 대리점 카테고리 권한은 화면 숨김뿐 아니라 상품 목록, 재고 조회, 발주 생성/조회/수정 API에서도 검사합니다.
- 권한이 없는 카테고리의 상품, 재고, 발주, 예약은 API 응답에 포함되지 않으며 주문하거나 예약할 수도 없습니다.
- 대리점/샵 계정은 내 재고, 본사 재고, 전체 대리점/샵 재고를 분리 조회할 수 있고, 재고수정과 발주 등록은 자기 `dealer_code`로만 처리됩니다.
- 관리자는 웹에서 본사 재고를 수정하고 전체 대리점/샵 재고를 조회할 수 있으며, 제품등록 정보는 등록/수정/삭제할 수 있습니다.
- 비활성 계정은 로그인할 수 없습니다.
