# Google Sheets 성능 최적화

현재 운영 데이터는 Google Sheets에 그대로 저장합니다. 이번 최적화는 데이터 구조를 변경하지 않고 Apps Script 호출 횟수와 사용자 대기 시간을 줄이는 방식입니다.

## 적용된 구조

### 1. Apps Script 짧은 캐시

`apps-script/Code.js`는 자주 읽는 시트 결과를 Apps Script `CacheService`에 30~120초 동안 저장합니다.

| 데이터 | 캐시 시간 |
| --- | --- |
| 발주, 예약, 판매, 상담, 인증서 | 30초 |
| 재고 | 45초 |
| 대리점 계정과 권한 | 60초 |
| 제품, 차량, 설정 | 120초 |

같은 API 요청 안에서 같은 시트를 다시 읽으면 Google Sheets 대신 요청 메모리를 사용합니다.

상품, 재고, 발주, 예약, 계정, 설정을 저장·수정·삭제하면 관련 캐시는 즉시 삭제됩니다. 따라서 저장 직후에는 최신 데이터가 다시 조회됩니다.

### 2. 로그인과 초기 로딩 분리

로그인은 계정과 비밀번호만 확인하고 필요한 세션 정보만 반환합니다.

1. 로그인 성공 및 화면 표시
2. 제품과 재고 우선 조회
3. 발주, 예약, 판매, 인증서, 상담, 설정 병렬 조회

발주나 과거 예약을 기다리느라 로그인 화면이 오래 멈추지 않습니다.

### 3. 묶음 저장

반복 `setValue` 대신 `setValues`를 사용해 여러 행이나 설정값을 한 번에 저장합니다. 초기 스키마 보정, 재고 기본 행 생성, 라벨 설정 저장 등에 적용되어 있습니다.

### 4. 프론트 검색

제품 검색은 로그인 후 받은 권한 허용 제품 목록을 브라우저 메모리에서 필터링합니다. 검색 글자를 입력할 때마다 Google Sheets API를 호출하지 않습니다.

### 5. 성능 로그

- Apps Script 실행 로그: action별 실행 시간과 `cache`, `request_memory`, `google_sheets` 사용 횟수
- Vercel Function 로그: `/api/gloc`의 action, Apps Script 응답 시간, HTTP 상태
- 브라우저 개발자 콘솔: action별 요청 시간과 재시도 횟수

## 배포 방법

성능 개선은 프론트와 Apps Script 양쪽에 들어 있습니다.

1. `apps-script/Code.js` 전체 내용을 Google Apps Script 편집기에 붙여 넣습니다.
2. `배포 > 배포 관리 > 수정 > 새 버전 > 배포`를 실행합니다.
3. GitHub에 최신 코드를 올린 뒤 Vercel Production을 재배포합니다.

Apps Script를 새 버전으로 배포하지 않으면 로그인 캐시와 묶음 저장 개선은 적용되지 않습니다.

## 운영 시 확인

- 저장 직후 최신 값이 보이는지 확인
- Apps Script 실행 로그에서 두 번째 요청부터 `cache`가 표시되는지 확인
- Vercel 로그에서 `/api/gloc`의 `durationMs` 확인
- 시트 컬럼명과 시트 이름은 기존 값을 유지

## 장기 전환

데이터 접근 경계는 `src/lib/repositories`와 `src/lib/providers`로 분리되어 있습니다. 향후 Supabase로 이전할 때 화면 업무 로직은 유지하고 Provider 구현을 교체할 수 있습니다.

