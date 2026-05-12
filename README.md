# Film Stock 재고관리/발주 웹앱

PPF/틴팅 제품을 판매하는 본사와 대리점용 재고조회 및 발주관리 웹앱입니다.
모바일 QR 접속, 카카오톡 링크 전달, 대리점별 권한 분리, Google Sheets 기반 납품 구조를 기준으로 제작되어 있습니다.

## 구성

- Frontend: HTML, CSS, JavaScript 정적 웹앱
- Backend/DB: Google Sheets + Google Apps Script Web App API
- Deploy: Vercel 정적 배포
- 주요 화면: 로그인, 최초 비밀번호 변경, 관리자 대시보드, 대리점 관리, 재고조회, 발주관리, 발주신청, QR/카카오톡 안내문 생성

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
| product_name | 제품명 |
| sku | SKU |
| qty | 발주 수량 |
| status | `접수`, `승인`, `출고`, `완료`, `반려` |
| memo | 메모 |
| created_at | 생성일 |
| updated_at | 수정일 |

### 제품등록

| 컬럼 | 설명 |
| --- | --- |
| sku | SKU |
| product_name | 제품명 |
| category | `PPF` 또는 `틴팅` |
| unit | 단위 |
| is_active | 판매 여부 |

### settings

| 컬럼 | 설명 |
| --- | --- |
| key | 설정 키 |
| value | 설정 값 |

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
  appPublicUrl: "https://stock.example.com"
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
```

4. 배포합니다.

빌드 명령은 `npm run build`, 출력 폴더는 `dist`입니다. `vercel.json`에 이미 설정되어 있습니다.

## 대리점 계정 생성

1. 관리자 계정으로 로그인합니다.
2. `대리점` 화면으로 이동합니다.
3. 대리점 코드, 대리점명, 초기 아이디, 초기 비밀번호를 입력합니다.
4. 생성된 대리점은 최초 로그인 후 비밀번호 변경이 필수입니다.

비밀번호는 Google Sheets에 평문으로 저장되지 않고 `password_hash`에 해시값으로 저장됩니다.

## QR코드와 카카오톡 링크

1. 관리자 화면에서 `QR` 메뉴로 이동합니다.
2. 대리점별 전용 링크가 자동 생성됩니다. 예: `https://stock.example.com/login?dealer=D001`
3. QR 다운로드 버튼으로 QR 이미지를 저장합니다.
4. 안내문 복사 버튼을 눌러 카카오톡으로 전달합니다.

카카오톡 안내문 예시:

```text
안녕하세요.
재고조회 및 발주는 아래 링크에서 진행해 주세요.

접속 링크: https://stock.example.com/login?dealer=D001
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
- 대리점 계정은 자기 `dealer_code` 데이터만 받을 수 있습니다.
- 비활성 계정은 로그인할 수 없습니다.
