# GLOC 재고관리/발주 웹앱

PPF/틴팅 제품을 판매하는 본사와 대리점용 재고조회 및 발주관리 웹앱입니다.
모바일 QR 접속, 카카오톡 링크 전달, 대리점별 권한 분리, Google Sheets 기반 납품 구조를 기준으로 제작되어 있습니다.

## 구성

- Frontend: HTML, CSS, JavaScript 정적 웹앱
- Backend/DB: Google Sheets + Google Apps Script Web App API
- Deploy: Vercel 정적 배포 + 발주 푸시 알림 API
- 주요 화면: 로그인, 최초 비밀번호 변경, 관리자 대시보드, 대리점 관리, 본사/내 재고/전체 대리점·샵 재고조회, 재고수정, 제품등록/수정, 발주관리, 발주신청, 매출현황, QR/카카오톡 안내문 생성

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
| category | `PPF` 또는 `틴팅` |
| unit | 단위 |
| retail_price | 소비자가. 비어 있으면 기본 1,000,000원 적용 |
| purchase_price | 매입가. 비어 있으면 기본 500,000원 적용 |
| is_active | 판매 여부 |

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
APPS_SCRIPT_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
APP_PUBLIC_URL=https://stock.example.com
VAPID_PUBLIC_KEY=YOUR_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY=YOUR_VAPID_PRIVATE_KEY
VAPID_SUBJECT=mailto:admin@example.com
PUSH_API_SECRET=CHANGE_ME_TO_A_LONG_RANDOM_SECRET
```

4. 배포합니다.

빌드 명령은 `npm run build`, 출력 폴더는 `dist`입니다. `vercel.json`에 이미 설정되어 있습니다.

푸시 알림용 VAPID 키는 아래 명령으로 생성합니다.

```bash
npm run generate:vapid
```

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

- 관리자는 `재고 수정` 화면에서 본사 재고의 현재 재고, 안전재고, 보관 위치를 저장할 수 있습니다.
- 대리점/샵 계정은 `재고 수정` 화면에서 본인 대리점/샵 재고만 수정할 수 있습니다.
- `재고조회` 화면에서는 본사 재고, 내 재고, 전체 대리점/샵 재고를 탭으로 분리해 조회할 수 있습니다.
- 관리자는 `제품` 화면에서 SKU, 제품명, 카테고리, 단위, 판매 여부를 등록/수정할 수 있습니다.
- 관리자는 `제품` 화면에서 소비자가와 매입가를 함께 입력합니다.
- 관리자는 `대리점` 화면에서 대리점 최상위 관리자 계정의 공통 할인율(%)만 입력하거나 수정할 수 있습니다. 같은 `dealer_code`로 생성된 추가 담당자는 별도 할인율 칸이 없고 최상위 관리자 할인율을 그대로 사용합니다.
- 새 제품을 등록하면 활성 대리점별 재고 행이 0개로 자동 생성됩니다.
- 제품을 삭제하면 제품 행과 해당 SKU의 재고 행이 삭제됩니다. 기존 발주 이력은 보존됩니다.

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
- 대리점/샵 계정은 내 재고, 본사 재고, 전체 대리점/샵 재고를 분리 조회할 수 있고, 재고수정과 발주 등록은 자기 `dealer_code`로만 처리됩니다.
- 관리자는 웹에서 본사 재고를 수정하고 전체 대리점/샵 재고를 조회할 수 있으며, 제품등록 정보는 등록/수정/삭제할 수 있습니다.
- 비활성 계정은 로그인할 수 없습니다.
