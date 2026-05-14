# GLOC 매뉴얼북 텍스트 수정 가이드

수정 대상 파일:

```text
docs/manual-book.html
```

이 파일은 HTML 파일이지만, 대부분의 문구는 태그 사이 글자만 바꾸면 됩니다.
가장 안전한 원칙은 **`<h1>`, `<h2>`, `<h3>`, `<p>`, `<span>`, `<td>` 같은 태그는 지우지 않고 안쪽 텍스트만 수정하는 것**입니다.

## 1. 현재 보고 있는 장 찾기

각 화면은 아래처럼 `<section>` 단위로 나뉩니다.

```html
<section class="chapter" data-title="QR/카카오톡 안내문" id="qr">
  ...
</section>
```

- `data-title`: 왼쪽 목차와 모바일 상단 선택창에 보이는 이름
- `id`: 주소 뒤 `#qr`처럼 붙는 화면 고유 이름
- `<h1>`: 화면 큰 제목
- `<p class="lead">`: 제목 아래 설명문

예를 들어 현재 주소가 `manual-book.html#qr`이면 아래 부분을 찾으면 됩니다.

```html
<section class="chapter" data-title="QR/카카오톡 안내문" id="qr">
```

## 2. 일반 문구 수정

수정 전:

```html
<h1>QR과 카카오톡 안내문 보내기</h1>
```

수정 후:

```html
<h1>대리점 접속 QR 보내기</h1>
```

설명문도 같은 방식입니다.

수정 전:

```html
<p class="lead">현재 구조는 대리점별 QR이 아니라 모든 대리점이 같은 QR과 같은 링크를 사용합니다.</p>
```

수정 후:

```html
<p class="lead">모든 대리점은 하나의 공통 QR로 접속하고, 로그인 정보로 대리점을 구분합니다.</p>
```

## 3. 왼쪽 메뉴 이름 수정

왼쪽 메뉴 이름은 `data-title`을 바꾸면 됩니다.

수정 전:

```html
<section class="chapter" data-title="QR/카카오톡 안내문" id="qr">
```

수정 후:

```html
<section class="chapter" data-title="QR 안내문" id="qr">
```

`id="qr"`는 주소와 연결되므로 가능하면 바꾸지 않는 것이 안전합니다.

## 4. 단계 문구 수정

단계 하나는 아래 구조입니다.

```html
<div class="step">
  <div class="num">1</div>
  <div>
    <h3>QR 메뉴 열기</h3>
    <p>관리자 로그인 후 <strong>QR</strong> 메뉴를 누릅니다.</p>
    <span class="click-path">QR 클릭</span>
  </div>
</div>
```

수정할 수 있는 부분:

```html
<div class="num">1</div>
<h3>여기에 단계 제목</h3>
<p>여기에 설명문</p>
<span class="click-path">여기에 클릭 순서</span>
```

## 5. 필요 없는 단계 삭제

아래처럼 `<div class="step">`부터 그에 맞는 `</div>`까지 한 덩어리를 삭제합니다.

```html
<div class="step">
  <div class="num">3</div>
  <div>
    <h3>안내문 복사</h3>
    <p>대리점별 안내문에서 <strong>안내문 복사</strong>를 누른 뒤 카카오톡에 붙여넣습니다.</p>
    <span class="click-path">안내문 복사 클릭 → 카카오톡 붙여넣기</span>
  </div>
</div>
```

삭제 후에는 남은 단계 번호를 1, 2, 3 순서로 맞춰줍니다.

## 6. 새 단계 추가

기존 단계 하나를 복사해서 아래에 붙여 넣은 뒤 번호와 문구를 바꿉니다.

```html
<div class="step">
  <div class="num">4</div>
  <div>
    <h3>새 단계 제목</h3>
    <p>새 단계 설명을 입력합니다.</p>
    <span class="click-path">클릭 순서 입력</span>
  </div>
</div>
```

## 7. 안내 박스 수정 또는 삭제

노란 안내 박스:

```html
<div class="callout warn">
  <h3>중요</h3>
  <p>관리자는 모든 정보를 볼 수 있습니다. 대리점/샵은 발주와 재고 수정은 본인 계정 기준으로만 할 수 있습니다.</p>
</div>
```

빨간 주의 박스:

```html
<div class="callout danger">
  <h3>계정삭제 주의</h3>
  <p><strong>계정삭제</strong>를 누르면 해당 대리점 계정과 해당 대리점의 재고 행이 삭제됩니다. 기존 발주 이력은 남습니다.</p>
</div>
```

필요 없으면 `<div class="callout ...">`부터 `</div>`까지 삭제하면 됩니다.

## 8. 표 내용 수정

표는 `<td>` 안쪽 텍스트만 바꾸면 됩니다.

수정 전:

```html
<td>사이트가 아예 안 열림</td>
<td>다른 인터넷, 다른 기기, 다른 브라우저에서 접속 확인</td>
<td>모두 안 되면 관리자에게 운영 사이트 장애로 전달</td>
```

수정 후:

```html
<td>사이트 접속이 안 됨</td>
<td>휴대폰 데이터와 회사 와이파이에서 각각 접속 확인</td>
<td>둘 다 안 되면 운영 담당자에게 화면 캡처 전달</td>
```

## 9. 장 전체 삭제

예를 들어 `QR/카카오톡 안내문` 장을 삭제하려면 두 곳을 수정해야 합니다.

1. 아래 `section` 전체 삭제

```html
<section class="chapter" data-title="QR/카카오톡 안내문" id="qr">
  ...
</section>
```

2. 아래 목차 배열에서 `qr` 삭제

```js
{ title: "관리자", ids: ["admin-start", "dealer-account", "product", "inventory-view", "inventory-edit", "order-manage", "qr"] },
```

수정 후:

```js
{ title: "관리자", ids: ["admin-start", "dealer-account", "product", "inventory-view", "inventory-edit", "order-manage"] },
```

## 10. 새 장 추가

새 장을 추가하려면 기존 장 하나를 복사해서 `id`, `data-title`, 제목, 내용을 바꿉니다.

```html
<section class="chapter" data-title="새 장 이름" id="new-chapter">
  <p class="eyebrow">GUIDE</p>
  <h1>새 장 제목</h1>
  <p class="lead">새 장 설명문을 입력합니다.</p>

  <div class="steps">
    <div class="step">
      <div class="num">1</div>
      <div>
        <h3>첫 번째 단계</h3>
        <p>첫 번째 단계 설명입니다.</p>
        <span class="click-path">클릭 순서</span>
      </div>
    </div>
  </div>
</section>
```

그 다음 목차 배열에 `new-chapter`를 추가합니다.

```js
{ title: "운영", ids: ["troubleshooting", "daily", "incident", "new-chapter", "share"] }
```

## 11. 현재 장 목록

| id | 메뉴 이름 | 용도 |
| --- | --- | --- |
| overview | 처음 보는 분을 위한 요약 | 첫 화면 |
| login | 로그인하기 | 로그인 안내 |
| admin-start | 관리자 첫 세팅 | 관리자 초기 설정 |
| dealer-account | 대리점 계정 관리 | 계정 생성/초기화/삭제 |
| product | 제품 등록/수정/삭제 | 제품 관리 |
| inventory-view | 재고 조회하기 | 재고 조회 |
| inventory-edit | 재고 수정하기 | 재고 수정 |
| order-create | 발주 신청하기 | 대리점 발주 |
| order-manage | 발주 관리하기 | 발주 상태 변경 |
| qr | QR/카카오톡 안내문 | QR/안내문 |
| mobile | 모바일 사용법 | 휴대폰 사용 |
| troubleshooting | 자주 생기는 문제 | 일반 문제 해결 |
| daily | 일상 운영 체크리스트 | 운영 루틴 |
| incident | 사이트 문제 대응 | 장애 대응 |
| share | 인쇄/공유 방법 | PDF 저장/공유 |

## 12. 수정 후 확인

수정 후 `manual-book.html`을 브라우저에서 새로고침해서 확인합니다.

확인할 것:

- 왼쪽 목차가 정상적으로 보이는지
- 다음/이전 버튼이 작동하는지
- 삭제한 장이 목차에서 사라졌는지
- 추가한 장이 목차에 보이는지
- 태그가 화면에 그대로 노출되지 않는지

