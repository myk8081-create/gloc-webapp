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
const certificateRandomChars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const certificateNumberPattern = /^GLOC-[A-Z0-9]{4}-\d{8}-[A-Z0-9]{6}-[A-Z]{1}$/;
const koreaPostLabelPreviewTemplate = "./templates/korea-post-label-preview.png";
const koreaPostOverlay = {
  PAGE_WIDTH_MM: 150,
  PAGE_HEIGHT_MM: 100,
  OFFSET_X_MM: 0,
  OFFSET_Y_MM: 0,
  SCALE: 1,
  PRINT_OFFSET_X_MM: 0,
  PRINT_OFFSET_Y_MM: 0,
  PRINT_SCALE: 1,
  PRINT_ROTATION_DEG: 180,
  REGION_CODE_X_MM: 58,
  REGION_CODE_Y_MM: 3,
  REGION_CODE_WIDTH_MM: 53,
  SORT_CODE_X_MM: 116,
  SORT_CODE_Y_MM: 4,
  SORT_CODE_WIDTH_MM: 19,
  CUSTOMER_ORDER_X_MM: 6,
  CUSTOMER_ORDER_Y_MM: 15,
  CUSTOMER_ORDER_WIDTH_MM: 49,
  PAYMENT_X_MM: 39,
  PAYMENT_Y_MM: 29,
  WEIGHT_X_MM: 6,
  WEIGHT_Y_MM: 32,
  VOLUME_X_MM: 25,
  VOLUME_Y_MM: 32,
  FEE_X_MM: 45,
  FEE_Y_MM: 32,
  BARCODE_X_MM: 10,
  BARCODE_Y_MM: 41,
  BARCODE_WIDTH_MM: 33,
  BARCODE_HEIGHT_MM: 14,
  MESSAGE_X_MM: 6,
  MESSAGE_Y_MM: 62,
  MESSAGE_WIDTH_MM: 62,
  CONTENT_X_MM: 6,
  CONTENT_Y_MM: 71,
  CONTENT_WIDTH_MM: 63,
  PRODUCT_X_MM: 6,
  PRODUCT_Y_MM: 78,
  PRODUCT_WIDTH_MM: 63,
  SENDER_X_MM: 62,
  SENDER_Y_MM: 17,
  SENDER_WIDTH_MM: 70,
  RECIPIENT_X_MM: 62,
  RECIPIENT_Y_MM: 39,
  RECIPIENT_WIDTH_MM: 70,
  REGISTRATION_X_MM: 62,
  REGISTRATION_Y_MM: 66,
  REGISTRATION_WIDTH_MM: 63,
  BOTTOM_BARCODE_X_MM: 62,
  BOTTOM_BARCODE_Y_MM: 77,
  BOTTOM_BARCODE_WIDTH_MM: 44,
  BOTTOM_BARCODE_HEIGHT_MM: 15,
  BOTTOM_CODE_X_MM: 126,
  BOTTOM_CODE_Y_MM: 82,
  BOTTOM_CODE_WIDTH_MM: 18,
  WATERMARK_X_MM: 75,
  WATERMARK_Y_MM: 50
};

const labelCalibrationFields = [
  { id: "labelOffsetX", key: "label_offset_x_mm", label: "전체 X 이동값(mm)", defaultValue: koreaPostOverlay.OFFSET_X_MM },
  { id: "labelOffsetY", key: "label_offset_y_mm", label: "전체 Y 이동값(mm)", defaultValue: koreaPostOverlay.OFFSET_Y_MM },
  { id: "labelScale", key: "label_scale", label: "전체 배율", defaultValue: koreaPostOverlay.SCALE, step: 0.01 },
  { id: "printOffsetX", key: "print_offset_x_mm", label: "실출력 전용 X 보정(mm)", defaultValue: koreaPostOverlay.PRINT_OFFSET_X_MM },
  { id: "printOffsetY", key: "print_offset_y_mm", label: "실출력 전용 Y 보정(mm)", defaultValue: koreaPostOverlay.PRINT_OFFSET_Y_MM },
  { id: "printScale", key: "print_scale", label: "실출력 전용 배율", defaultValue: koreaPostOverlay.PRINT_SCALE, step: 0.01 },
  { id: "zoneCodeX", key: "zone_code_x_mm", label: "상단 권역코드 X", defaultValue: koreaPostOverlay.REGION_CODE_X_MM },
  { id: "zoneCodeY", key: "zone_code_y_mm", label: "상단 권역코드 Y", defaultValue: koreaPostOverlay.REGION_CODE_Y_MM },
  { id: "sortCodeX", key: "sort_code_x_mm", label: "상단 분류번호 X", defaultValue: koreaPostOverlay.SORT_CODE_X_MM },
  { id: "sortCodeY", key: "sort_code_y_mm", label: "상단 분류번호 Y", defaultValue: koreaPostOverlay.SORT_CODE_Y_MM },
  { id: "customerOrderX", key: "customer_order_x_mm", label: "좌측 주문정보 X", defaultValue: koreaPostOverlay.CUSTOMER_ORDER_X_MM },
  { id: "customerOrderY", key: "customer_order_y_mm", label: "좌측 주문정보 Y", defaultValue: koreaPostOverlay.CUSTOMER_ORDER_Y_MM },
  { id: "paymentX", key: "payment_x_mm", label: "좌측 착불표시 X", defaultValue: koreaPostOverlay.PAYMENT_X_MM },
  { id: "paymentY", key: "payment_y_mm", label: "좌측 착불표시 Y", defaultValue: koreaPostOverlay.PAYMENT_Y_MM },
  { id: "weightX", key: "weight_x_mm", label: "좌측 중량 X", defaultValue: koreaPostOverlay.WEIGHT_X_MM },
  { id: "weightY", key: "weight_y_mm", label: "좌측 중량 Y", defaultValue: koreaPostOverlay.WEIGHT_Y_MM },
  { id: "volumeX", key: "volume_x_mm", label: "좌측 용적 X", defaultValue: koreaPostOverlay.VOLUME_X_MM },
  { id: "volumeY", key: "volume_y_mm", label: "좌측 용적 Y", defaultValue: koreaPostOverlay.VOLUME_Y_MM },
  { id: "feeX", key: "fee_x_mm", label: "좌측 요금 X", defaultValue: koreaPostOverlay.FEE_X_MM },
  { id: "feeY", key: "fee_y_mm", label: "좌측 요금 Y", defaultValue: koreaPostOverlay.FEE_Y_MM },
  { id: "leftBarcodeX", key: "left_barcode_x_mm", label: "좌측 바코드 X", defaultValue: koreaPostOverlay.BARCODE_X_MM },
  { id: "leftBarcodeY", key: "left_barcode_y_mm", label: "좌측 바코드 Y", defaultValue: koreaPostOverlay.BARCODE_Y_MM },
  { id: "leftBarcodeWidth", key: "left_barcode_width_mm", label: "좌측 바코드 width", defaultValue: koreaPostOverlay.BARCODE_WIDTH_MM },
  { id: "leftBarcodeHeight", key: "left_barcode_height_mm", label: "좌측 바코드 height", defaultValue: koreaPostOverlay.BARCODE_HEIGHT_MM },
  { id: "messageX", key: "message_x_mm", label: "배송메시지 X", defaultValue: koreaPostOverlay.MESSAGE_X_MM },
  { id: "messageY", key: "message_y_mm", label: "배송메시지 Y", defaultValue: koreaPostOverlay.MESSAGE_Y_MM },
  { id: "contentX", key: "content_x_mm", label: "내용품명 X", defaultValue: koreaPostOverlay.CONTENT_X_MM },
  { id: "contentY", key: "content_y_mm", label: "내용품명 Y", defaultValue: koreaPostOverlay.CONTENT_Y_MM },
  { id: "productX", key: "product_x_mm", label: "상품정보 X", defaultValue: koreaPostOverlay.PRODUCT_X_MM },
  { id: "productY", key: "product_y_mm", label: "상품정보 Y", defaultValue: koreaPostOverlay.PRODUCT_Y_MM },
  { id: "senderBlockX", key: "sender_block_x_mm", label: "우측 보내는 분 X", defaultValue: koreaPostOverlay.SENDER_X_MM },
  { id: "senderBlockY", key: "sender_block_y_mm", label: "우측 보내는 분 Y", defaultValue: koreaPostOverlay.SENDER_Y_MM },
  { id: "receiverBlockX", key: "receiver_block_x_mm", label: "우측 받는 분 X", defaultValue: koreaPostOverlay.RECIPIENT_X_MM },
  { id: "receiverBlockY", key: "receiver_block_y_mm", label: "우측 받는 분 Y", defaultValue: koreaPostOverlay.RECIPIENT_Y_MM },
  { id: "trackingTextX", key: "tracking_text_x_mm", label: "하단 등록번호 X", defaultValue: koreaPostOverlay.REGISTRATION_X_MM },
  { id: "trackingTextY", key: "tracking_text_y_mm", label: "하단 등록번호 Y", defaultValue: koreaPostOverlay.REGISTRATION_Y_MM },
  { id: "bottomBarcodeX", key: "bottom_barcode_x_mm", label: "하단 바코드 X", defaultValue: koreaPostOverlay.BOTTOM_BARCODE_X_MM },
  { id: "bottomBarcodeY", key: "bottom_barcode_y_mm", label: "하단 바코드 Y", defaultValue: koreaPostOverlay.BOTTOM_BARCODE_Y_MM },
  { id: "bottomBarcodeWidth", key: "bottom_barcode_width_mm", label: "하단 바코드 width", defaultValue: koreaPostOverlay.BOTTOM_BARCODE_WIDTH_MM },
  { id: "bottomBarcodeHeight", key: "bottom_barcode_height_mm", label: "하단 바코드 height", defaultValue: koreaPostOverlay.BOTTOM_BARCODE_HEIGHT_MM },
  { id: "bottomCodeX", key: "bottom_code_x_mm", label: "우측 하단 코드 X", defaultValue: koreaPostOverlay.BOTTOM_CODE_X_MM },
  { id: "bottomCodeY", key: "bottom_code_y_mm", label: "우측 하단 코드 Y", defaultValue: koreaPostOverlay.BOTTOM_CODE_Y_MM },
  { id: "bottomCodeWidth", key: "bottom_code_width_mm", label: "우측 하단 코드 width", defaultValue: koreaPostOverlay.BOTTOM_CODE_WIDTH_MM }
];

const labelCalibrationOverlayMap = {
  labelOffsetX: "OFFSET_X_MM",
  labelOffsetY: "OFFSET_Y_MM",
  labelScale: "SCALE",
  printOffsetX: "PRINT_OFFSET_X_MM",
  printOffsetY: "PRINT_OFFSET_Y_MM",
  printScale: "PRINT_SCALE",
  zoneCodeX: "REGION_CODE_X_MM",
  zoneCodeY: "REGION_CODE_Y_MM",
  sortCodeX: "SORT_CODE_X_MM",
  sortCodeY: "SORT_CODE_Y_MM",
  customerOrderX: "CUSTOMER_ORDER_X_MM",
  customerOrderY: "CUSTOMER_ORDER_Y_MM",
  paymentX: "PAYMENT_X_MM",
  paymentY: "PAYMENT_Y_MM",
  weightX: "WEIGHT_X_MM",
  weightY: "WEIGHT_Y_MM",
  volumeX: "VOLUME_X_MM",
  volumeY: "VOLUME_Y_MM",
  feeX: "FEE_X_MM",
  feeY: "FEE_Y_MM",
  leftBarcodeX: "BARCODE_X_MM",
  leftBarcodeY: "BARCODE_Y_MM",
  leftBarcodeWidth: "BARCODE_WIDTH_MM",
  leftBarcodeHeight: "BARCODE_HEIGHT_MM",
  messageX: "MESSAGE_X_MM",
  messageY: "MESSAGE_Y_MM",
  contentX: "CONTENT_X_MM",
  contentY: "CONTENT_Y_MM",
  productX: "PRODUCT_X_MM",
  productY: "PRODUCT_Y_MM",
  senderBlockX: "SENDER_X_MM",
  senderBlockY: "SENDER_Y_MM",
  receiverBlockX: "RECIPIENT_X_MM",
  receiverBlockY: "RECIPIENT_Y_MM",
  trackingTextX: "REGISTRATION_X_MM",
  trackingTextY: "REGISTRATION_Y_MM",
  bottomBarcodeX: "BOTTOM_BARCODE_X_MM",
  bottomBarcodeY: "BOTTOM_BARCODE_Y_MM",
  bottomBarcodeWidth: "BOTTOM_BARCODE_WIDTH_MM",
  bottomBarcodeHeight: "BOTTOM_BARCODE_HEIGHT_MM",
  bottomCodeX: "BOTTOM_CODE_X_MM",
  bottomCodeY: "BOTTOM_CODE_Y_MM",
  bottomCodeWidth: "BOTTOM_CODE_WIDTH_MM"
};

function defaultLabelCalibration() {
  return Object.fromEntries(labelCalibrationFields.map((field) => [field.id, field.defaultValue]));
}

function calibrationNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : Number(fallback || 0);
}

function nullableNumber(value, fallback = 0) {
  if (value === null || value === undefined) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampNullableNumber(value, min, max, fallback = 0) {
  return Math.min(max, Math.max(min, nullableNumber(value, fallback)));
}

function formatCalibrationNumber(value) {
  const number = calibrationNumber(value, 0);
  return Number.isInteger(number) ? String(number) : String(Number(number.toFixed(2)));
}

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
  { category: "틴팅", brand: "GLOC", color: "차콜", color_hex: "#101820", product_name: "세라믹 틴팅 차콜", sku: "TN-CH", sizes: ["15%", "35%", "50%"], unit: "롤", shade_percent: 35, opacity: 55, available_parts: "frontGlass,firstRowGlass,secondRowGlass,rearGlass,roofGlass" },
  { category: "PPF", brand: "GLOC", color: "클리어", color_hex: "#f7fbf9", product_name: "프리미엄 PPF 클리어", sku: "PPF-CL", sizes: ["150", "180", "200"], unit: "롤", finish_type: "gloss", transparency_type: "transparent", opacity: 28 },
  { category: "PPF", brand: "GLOC", color: "매트", color_hex: "#c9cac2", product_name: "매트 PPF", sku: "PPF-MT", sizes: ["150", "180", "200"], unit: "롤", finish_type: "matte", transparency_type: "semi_transparent", opacity: 42 },
  { category: "틴팅", brand: "GLOC", color: "스모크", color_hex: "#202b30", product_name: "카본 틴팅 스모크", sku: "TN-SM", sizes: ["05%", "15%", "35%"], unit: "롤", shade_percent: 15, opacity: 70, available_parts: "frontGlass,firstRowGlass,secondRowGlass,rearGlass,roofGlass" },
  { category: "PPF", brand: "GLOC", color: "블랙", color_hex: "#0b1113", product_name: "블랙 PPF", sku: "PPF-BK", sizes: ["150", "180", "200"], unit: "롤", finish_type: "gloss", transparency_type: "opaque", opacity: 100 },
  { category: "틴팅", brand: "GLOC", color: "세라믹", color_hex: "#5d6b70", product_name: "세라믹 틴팅", sku: "TN-CR", sizes: ["35%", "50%", "70%"], unit: "롤", shade_percent: 50, opacity: 42, available_parts: "frontGlass,firstRowGlass,secondRowGlass,rearGlass,roofGlass" },
  { category: "틴팅", brand: "GLOC", color: "차콜", color_hex: "#101820", product_name: "나노 틴팅 차콜", sku: "TN-NC", sizes: ["15%", "35%", "50%"], unit: "롤", shade_percent: 30, opacity: 58, available_parts: "frontGlass,firstRowGlass,secondRowGlass,rearGlass,roofGlass" },
  { category: "PPF", brand: "GLOC", color: "클리어", color_hex: "#f7fbf9", product_name: "라이트 PPF 클리어", sku: "PPF-LC", sizes: ["120", "150", "180"], unit: "롤", finish_type: "satin", transparency_type: "transparent", opacity: 24 }
];

const teslaVehicleSeed = [
  { id: "tesla-model3-legacy", brand: "Tesla", model_name: "Model 3", generation_name: "Legacy", facelift_type: "Legacy", body_code: "M3-L", model_year: "2017-2023", vehicle_type: "sedan", default_color: "Pearl White", thumbnail_url: "", image_mode_enabled: true, three_d_enabled: false, glb_file_url: "/models/tesla/model3-legacy.glb" },
  { id: "tesla-model3-highland", brand: "Tesla", model_name: "Model 3", generation_name: "Highland", facelift_type: "Highland", body_code: "M3-H", model_year: "2024-", vehicle_type: "sedan", default_color: "Pearl White", thumbnail_url: "", image_mode_enabled: true, three_d_enabled: true, glb_file_url: "/models/tesla/model3-highland.glb" },
  { id: "tesla-modely-legacy", brand: "Tesla", model_name: "Model Y", generation_name: "Legacy", facelift_type: "Legacy", body_code: "MY-L", model_year: "2020-2024", vehicle_type: "suv", default_color: "Pearl White", thumbnail_url: "", image_mode_enabled: true, three_d_enabled: false, glb_file_url: "/models/tesla/modely-legacy.glb" },
  { id: "tesla-modely-juniper", brand: "Tesla", model_name: "Model Y", generation_name: "Juniper", facelift_type: "Juniper", body_code: "MY-J", model_year: "2025-", vehicle_type: "suv", default_color: "Pearl White", thumbnail_url: "", image_mode_enabled: true, three_d_enabled: false, glb_file_url: "/models/tesla/modely-juniper.glb" },
  { id: "tesla-models", brand: "Tesla", model_name: "Model S", generation_name: "Current", facelift_type: "Current", body_code: "MS", model_year: "2021-", vehicle_type: "sedan", default_color: "Pearl White", thumbnail_url: "", image_mode_enabled: true, three_d_enabled: false, glb_file_url: "/models/tesla/models.glb" },
  { id: "tesla-modelx", brand: "Tesla", model_name: "Model X", generation_name: "Current", facelift_type: "Current", body_code: "MX", model_year: "2021-", vehicle_type: "suv", default_color: "Pearl White", thumbnail_url: "", image_mode_enabled: true, three_d_enabled: false, glb_file_url: "/models/tesla/modelx.glb" },
  { id: "tesla-cybertruck", brand: "Tesla", model_name: "Cybertruck", generation_name: "Foundation", facelift_type: "Foundation", body_code: "CT", model_year: "2024-", vehicle_type: "truck", default_color: "Quicksilver", thumbnail_url: "", image_mode_enabled: true, three_d_enabled: false, glb_file_url: "/models/tesla/cybertruck.glb" }
];

const vehicleColorOptions = [
  { name: "Pearl White", label: "펄 화이트", hex: "#f4f1e8", accent: "#ffffff" },
  { name: "Solid Black", label: "솔리드 블랙", hex: "#101214", accent: "#272b2c" },
  { name: "Midnight Silver", label: "미드나잇 실버", hex: "#555c62", accent: "#9ca3a8" },
  { name: "Deep Blue", label: "딥 블루", hex: "#142c55", accent: "#315994" },
  { name: "Ultra Red", label: "울트라 레드", hex: "#a51f1e", accent: "#db5148" },
  { name: "Stealth Gray", label: "스텔스 그레이", hex: "#333938", accent: "#747c79" },
  { name: "Quicksilver", label: "퀵실버", hex: "#b8bcc0", accent: "#f4f5f5" }
];

const vehicleViewOptions = [
  { value: "front", label: "Front" },
  { value: "front45", label: "Front 45" },
  { value: "side", label: "Side" },
  { value: "rear45", label: "Rear 45" },
  { value: "rear", label: "Rear" }
];

const threeModuleUrls = {
  core: "https://esm.sh/three@0.161.0",
  gltfLoader: "https://esm.sh/three@0.161.0/examples/jsm/loaders/GLTFLoader.js",
  orbitControls: "https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls.js"
};

const showroomEnvironmentPath = "/env/gloc-showroom-360.jpg";
const consultationRenderSettings = {
  desktopPixelRatio: 2,
  mobilePixelRatio: 1.35,
  bodyEnvMapIntensity: 1.45,
  glassEnvMapIntensity: 1.85,
  ppfEnvMapIntensity: 1.65,
  backgroundIntensity: 0.9,
  mobileBackgroundIntensity: 0.74,
  backgroundBlurriness: 0.08,
  mobileBackgroundBlurriness: 0,
  showroomRotationY: Math.PI / 4
};

const ppfPartOptions = [
  { key: "hood", label: "후드", price: 220000 },
  { key: "front_bumper", label: "프론트 범퍼", price: 280000 },
  { key: "rear_bumper", label: "리어 범퍼", price: 240000 },
  { key: "front_fender", label: "프론트 휀더", price: 180000 },
  { key: "rear_fender", label: "리어 휀더", price: 180000 },
  { key: "front_door", label: "프론트 도어", price: 220000 },
  { key: "rear_door", label: "리어 도어", price: 220000 },
  { key: "mirror", label: "사이드미러", price: 90000 },
  { key: "roof", label: "루프", price: 260000 },
  { key: "trunk", label: "트렁크", price: 180000 },
  { key: "headlight", label: "헤드라이트", price: 120000 },
  { key: "pillar", label: "필러", price: 90000 },
  { key: "door_cup", label: "도어컵", price: 60000 },
  { key: "door_edge", label: "도어엣지", price: 60000 },
  { key: "full_body", label: "전체 시공", price: 2500000, full: true }
];

const tintStrengthOptions = [0, 15, 35, 50, 70, 100];
const tintAreaOptions = [
  { key: "frontGlass", label: "전면 유리", shortLabel: "전면", defaultTintStrength: 30 },
  { key: "firstRowGlass", label: "1열 유리", shortLabel: "1열", defaultTintStrength: 15 },
  { key: "secondRowGlass", label: "2열 유리", shortLabel: "2열", defaultTintStrength: 15 },
  { key: "rearGlass", label: "후면 유리", shortLabel: "후면", defaultTintStrength: 15 },
  { key: "roofGlass", label: "글라스 루프", shortLabel: "루프", defaultTintStrength: 30 }
];

const consultationBodyPartOptions = [
  { key: "hood", legacyKey: "hood", label: "후드" },
  { key: "frontBumper", legacyKey: "front_bumper", label: "프론트 범퍼" },
  { key: "rearBumper", legacyKey: "rear_bumper", label: "리어 범퍼" },
  { key: "frontDoorLeft", legacyKey: "front_door", label: "1열 좌측 도어" },
  { key: "frontDoorRight", legacyKey: "front_door", label: "1열 우측 도어" },
  { key: "rearDoorLeft", legacyKey: "rear_door", label: "2열 좌측 도어" },
  { key: "rearDoorRight", legacyKey: "rear_door", label: "2열 우측 도어" },
  { key: "rearQuarterLeft", legacyKey: "rear_fender", label: "좌측 리어 쿼터" },
  { key: "rearQuarterRight", legacyKey: "rear_fender", label: "우측 리어 쿼터" },
  { key: "trunk", legacyKey: "trunk", label: "트렁크" },
  { key: "roof", legacyKey: "roof", label: "루프" },
  { key: "sideSkirtLeft", legacyKey: "side_skirt", label: "좌측 사이드스커트" },
  { key: "sideSkirtRight", legacyKey: "side_skirt", label: "우측 사이드스커트" },
  { key: "fenderLeft", legacyKey: "front_fender", label: "좌측 프론트 휀더" },
  { key: "fenderRight", legacyKey: "front_fender", label: "우측 프론트 휀더" }
];

const consultationGlassPartOptions = [
  { key: "frontGlass", legacyKey: "frontGlass", label: "앞유리", shortLabel: "전면" },
  { key: "firstRowGlass", legacyKey: "firstRowGlass", label: "1열 유리", shortLabel: "1열" },
  { key: "secondRowGlass", legacyKey: "secondRowGlass", label: "2열 유리", shortLabel: "2열" },
  { key: "rearGlass", legacyKey: "rearGlass", label: "후면유리", shortLabel: "후면" },
  { key: "roofGlass", legacyKey: "roofGlass", label: "루프유리", shortLabel: "루프" }
];

const productFinishOptions = [
  { value: "gloss", label: "유광" },
  { value: "matte", label: "무광" },
  { value: "semi_matte", label: "반무광" },
  { value: "satin", label: "사틴" }
];

const productTransparencyOptions = [
  { value: "opaque", label: "불투명" },
  { value: "semi_transparent", label: "반투명" },
  { value: "transparent", label: "투명" }
];

const consultationProductTypeConfig = {
  tint: { label: "틴팅", category: "TINTING", searchKey: "tintProductQuery" },
  ppf: { label: "PPF", category: "PPF", searchKey: "ppfProductQuery" }
};

const consultationPartMapping = {
  hood: ["hood", "bonnet", "본넷", "후드"],
  roof: ["roof", "루프"],
  front_bumper: ["front_bumper", "frontbumper", "bumper_front"],
  rear_bumper: ["rear_bumper", "rearbumper", "bumper_rear"],
  front_door: ["front_door_l", "front_door_r", "door_fl", "door_fr", "front_doors"],
  rear_door: ["rear_door_l", "rear_door_r", "door_rl", "door_rr", "rear_doors"],
  front_fender: ["front_fender_left", "front_fender_right", "front_fenders"],
  rear_fender: ["rear_fender_left", "rear_fender_right", "rear_fenders", "side_body_panels"],
  trunk: ["trunk", "tailgate"],
  mirror: ["mirror_l", "mirror_r", "mirror_body"],
  side_skirt: ["side_skirt_l", "side_skirt_r", "side_skirt"],
  spoiler: ["spoiler"],
  frontGlass: ["front_glass", "windshield", "glass_front"],
  firstRowGlass: ["front_door_glass_left", "front_door_glass_right", "driverwindow", "passengerwindow", "frontsideglass", "front_side_glass", "side_glass_l", "side_glass_r", "window_l", "window_r", "glass_side_front"],
  secondRowGlass: ["rear_door_glass_left", "rear_door_glass_right", "secondrowwindowleft", "secondrowwindowright", "rearsideglass", "rear_side_glass", "glass_side_rear"],
  rearGlass: ["rear_glass", "glass_rear"],
  roofGlass: ["roof_glass", "sunroof", "panoramicroof", "panoramic_roof", "glass_roof"]
};

const consultationVehicleMeshMaps = {
  "tesla-model3-highland": {
    body: [
      "body",
      "hood",
      "front_bumper",
      "rear_bumper",
      "front_doors",
      "rear_doors",
      "front_fenders",
      "roof",
      "side_body_panels",
      "trunk",
      "mirror_body"
    ],
    glass: [
      "glass_front",
      "glass_rear",
      "glass_roof",
      "glass_side_front",
      "glass_side_rear",
      "mirrors_glass"
    ],
    ppf: {
      hood: ["hood"],
      front_bumper: ["front_bumper"],
      rear_bumper: ["rear_bumper"],
      front_fender: ["front_fenders"],
      rear_fender: ["side_body_panels"],
      front_door: ["front_doors"],
      rear_door: ["rear_doors"],
      mirror: ["mirror_body"],
      roof: ["roof"],
      trunk: ["trunk"],
      headlight: ["headlight_lens"],
      pillar: ["window_trim"]
    },
    tint: {
      frontGlass: ["glass_front"],
      firstRowGlass: ["glass_side_front"],
      secondRowGlass: ["glass_side_rear"],
      rearGlass: ["glass_rear"],
      roofGlass: ["glass_roof"]
    }
  }
};

const consultationStatusLabels = {
  saved: "상담저장",
  quote: "견적완료",
  reservation_ready: "예약 전환 대기"
};

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
      brand: base.brand || "GLOC",
      product_code: `${base.sku}-${number}`,
      color: base.color,
      color_name: base.color,
      color_hex: base.color_hex ?? "#f7fbf9",
      color_chart_image_url: "",
      finish_type: base.finish_type || "",
      transparency_type: base.transparency_type || "",
      opacity: base.opacity ?? 100,
      shade_percent: productCategoryMatches({ category: base.category }, "tint") ? nullableNumber(Number(String(size).replace(/\D/g, "")), base.shade_percent ?? 35) : "",
      available_parts: base.available_parts || "",
      description: "",
      unit: base.unit,
      retail_price: defaultRetailPrice,
      purchase_price: defaultPurchasePrice,
      is_active: true
    });
  }

  products[0].product_name = "세라믹 틴팅 차콜 35%";
  products[0].sku = "TN-CH-035";
  products[0].product_code = "TN-CH-035";
  products[0].shade_percent = 35;
  products[1].product_name = "프리미엄 PPF 클리어";
  products[1].sku = "PPF-CL-150";
  products[1].product_code = "PPF-CL-150";
  products[2].product_name = "매트 PPF 블랙";
  products[2].sku = "PPF-MB-200";
  products[2].product_code = "PPF-MB-200";
  products[2].color_hex = "#111111";
  products[2].transparency_type = "opaque";
  products[2].opacity = 100;
  products[3].product_name = "카본 틴팅 스모크 15%";
  products[3].sku = "TN-SM-015";
  products[3].product_code = "TN-SM-015";
  products[3].shade_percent = 15;
  return products;
}

function createMockVehicles() {
  return teslaVehicleSeed.map((vehicle) => ({
    ...vehicle,
    is_active: true,
    created_at: nowText(),
    updated_at: nowText()
  }));
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
  screen: initialScreenFromUrl(),
  dataMode: window.FilmStockApi?.isEnabled() ? "appsScript" : "mock",
  session: null,
  accounts: createMockAccounts(),
  products: mockProducts,
  inventory: createMockInventory(mockProducts),
  orders: createMockOrders(mockProducts),
  retailSales: [],
  reservations: [],
  certificates: [],
  vehicles: createMockVehicles(),
  consultations: [],
  labelCalibration: defaultLabelCalibration(),
  selectedColor: "전체",
  selectedSku: mockProducts[0].sku,
  consultation: {
    vehicleId: "tesla-model3-highland",
    view: "front45",
    color: "Pearl White",
    renderMode: "3d",
    tintSku: "TN-CH-035",
    tintAreas: {
      frontGlass: 30,
      firstRowGlass: 15,
      secondRowGlass: 15,
      rearGlass: 15,
      roofGlass: 30
    },
    tintEnabled: true,
    ppfEnabled: true,
    ppfSku: "PPF-CL-150",
    ppfParts: ["hood", "front_bumper"],
    applications: [],
    tintProductQuery: "",
    ppfProductQuery: "",
    tintFilter: "전체",
    ppfFilter: "전체",
    tintTarget: "frontGlass",
    selectedPartId: null,
    selectedCategory: null,
    appliedPpfMap: {},
    appliedTintMap: {},
    customerName: "",
    customerPhone: "",
    memo: ""
  },
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
    salesMonth: monthInputValue(),
    certificateQuery: "",
    certificateDealerCode: "전체",
    consultationQuery: "",
    productManageQuery: ""
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
    reservationVehicleNumber: "",
    reservationVehicleModel: "",
    reservationDate: dateInputValue(),
    reservationQty: 1,
    reservationMemo: "",
    verifySerial: "",
    labelSize: "post-overlay-150x100",
    labelPreviewBackground: true,
    labelPreviewGuides: false,
    labelPreviewOutputArea: true,
    labelPreviewZoom: 1,
    productSku: "",
    productName: "",
    productCategory: "PPF",
    productBrand: "GLOC",
    productColorName: "",
    productColorHex: "#f7fbf9",
    productColorChartImageUrl: "",
    productFinishType: "gloss",
    productTransparencyType: "transparent",
    productOpacity: 100,
    productShadePercent: 35,
    productAvailableParts: tintAreaOptions.map((area) => area.key).join(","),
    productDescription: "",
    productUnit: "롤",
    productRetailPrice: defaultRetailPrice,
    productPurchasePrice: defaultPurchasePrice,
    productIsActive: true,
    vehicleId: "",
    vehicleBrand: "Tesla",
    vehicleModelName: "",
    vehicleGenerationName: "",
    vehicleBodyCode: "",
    vehicleModelYear: "",
    vehicleType: "sedan",
    vehicleDefaultColor: "Pearl White",
    vehicleGlbFileUrl: "",
    vehicleImageModeEnabled: true,
    vehicleThreeDEnabled: false,
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
  },
  verification: {
    result: null,
    error: ""
  }
};

let consultation3dRuntime = null;
let consultation3dModulesPromise = null;
let consultationOriginalMaterials = new Map();
let consultationPpfOverlayMap = new Map();
let consultationGlassMeshGroupMap = new Map();
let consultationOriginalGlassMaterials = new Map();

let searchRefreshTimer = null;
let accountFormRefreshTimer = null;
let daumPostcodeLoading = null;

function initialScreenFromUrl() {
  return window.location.pathname === "/verify" || new URLSearchParams(window.location.search).get("screen") === "verify"
    ? "verify"
    : "login";
}

function requestedScreenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("screen");
  if (requested === "consultation") return "consultation";
  const path = window.location.pathname.replace(/\/index\.html$/, "");
  if (path === "/consultation") return "consultation";
  return "";
}

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
      ${renderPublicVerify()}
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
      ${renderConsultation()}
      ${renderVehicleAdmin()}
      ${renderCertificates()}
      ${renderDealerLinks()}
      ${renderNotifications()}
      ${renderLabelSettings()}
      ${renderBottomNav()}
      <div id="toast" class="toast" role="status"></div>
    </div>
  `;
  bindEvents();
  requestAnimationFrame(initConsultation3dViewer);
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
            <p class="eyebrow">GLOC 재고관리</p>
            <h1>로그인</h1>
            <p class="lead">대리점 또는 관리자 계정으로 재고조회와 발주를 진행합니다.</p>
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

function renderPublicVerify() {
  const result = state.verification.result;
  const error = state.verification.error;
  return `
    <main class="screen verify-screen ${state.screen === "verify" ? "active" : ""}" data-screen="verify">
      <section class="verify-layout">
        <section class="panel verify-card">
          <img class="verify-logo" src="gloc-logo-banner.png" alt="GLOC" />
          <p class="eyebrow">GLOC AUTHENTICITY</p>
          <h1>정품 인증 확인</h1>
          <p class="lead">QR은 인증 페이지 접속용입니다. 인증서에 인쇄된 시리얼번호를 직접 입력해야 정품 여부를 확인할 수 있습니다.</p>
          <div class="form-grid">
            <label class="field">
              <span>시리얼번호</span>
              <input id="verifySerial" type="text" value="${escapeAttr(state.forms.verifySerial)}" placeholder="인증서에 인쇄된 시리얼번호를 입력하세요" autocomplete="off" />
            </label>
            <button type="button" class="primary-button" data-action="verifyCertificate">인증 확인</button>
          </div>
          ${error ? `<div class="verify-result danger"><strong>인증 실패</strong><span>${escapeHtml(error)}</span></div>` : ""}
          ${result ? renderVerificationResult(result) : ""}
          <div class="page-actions">
            <button type="button" class="secondary-button" data-nav="login">로그인 화면으로</button>
          </div>
        </section>
      </section>
    </main>
  `;
}

function renderVerificationResult(data) {
  if (data.result !== "success") {
    return `<div class="verify-result warn"><strong>${escapeHtml(data.message || "인증 결과")}</strong><span>시리얼번호를 다시 확인해 주세요.</span></div>`;
  }
  const certificate = data.certificate || {};
  return `
    <div class="verify-result ok">
      <strong>${escapeHtml(data.message || "GLOC 정품 인증 완료")}</strong>
      <dl class="verify-detail-list">
        <div><dt>제품 유형</dt><dd>${escapeHtml(certificate.product_type || "-")}</dd></div>
        <div><dt>제품명</dt><dd>${escapeHtml(certificate.product_name || "-")}</dd></div>
        <div><dt>시공일</dt><dd>${escapeHtml(formatDateOnly(certificate.installation_date) || "-")}</dd></div>
        <div><dt>시공 대리점</dt><dd>${escapeHtml(certificate.dealer_name || "-")}</dd></div>
        <div><dt>차량번호</dt><dd>${escapeHtml(certificate.vehicle_number_masked || "-")}</dd></div>
      </dl>
    </div>
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
        <p class="lead">본사 재고, 전체 대리점 재고, 안전재고 미달 제품, 발주 상태를 한곳에서 확인합니다.</p>
        <div class="page-actions">
          <button class="primary-button" type="button" data-nav="inventoryManage">재고 수정</button>
          <button class="secondary-button" type="button" data-nav="productManage">제품 등록</button>
          <button class="secondary-button" type="button" data-nav="sales">매출현황</button>
          <button class="secondary-button" type="button" data-nav="certificates">정품인증서</button>
          <button class="primary-button" type="button" data-nav="consultation">상담 시뮬레이터</button>
          <button class="primary-button" type="button" data-nav="dealers">대리점 계정 관리</button>
          <button class="secondary-button" type="button" data-nav="links">QR/카카오톡 안내문</button>
          <button class="secondary-button" type="button" data-nav="labelSettings">송장출력 설정</button>
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
          <div class="metric-note">본사와 대리점 합산</div>
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
            <button class="quick-card" type="button" data-nav="certificates">
              <strong>정품인증서 관리</strong>
              <span>인증번호 검색, 발급 내역 확인, 재인쇄</span>
            </button>
            <button class="quick-card" type="button" data-nav="consultation">
              <strong>상담 시뮬레이터</strong>
              <span>차량 색상, 틴팅, PPF 부위별 상담 화면</span>
            </button>
            <button class="quick-card" type="button" data-nav="vehicleAdmin">
              <strong>차량/3D 관리</strong>
              <span>Tesla 이미지, GLB, Mesh 매핑 확장 관리</span>
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
              <span>QR과 대리점별 안내문 생성</span>
            </button>
            <button class="quick-card" type="button" data-nav="notifications">
              <strong>알림설정</strong>
              <span>이 기기 푸시 알림 등록과 테스트</span>
            </button>
            <button class="quick-card" type="button" data-nav="labelSettings">
              <strong>송장출력 설정</strong>
              <span>우체국 라벨 출력 위치를 mm 단위로 보정</span>
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

function renderLabelSettings() {
  if (state.session?.role !== "admin") return "";
  return `
    <main class="screen ${state.screen === "labelSettings" ? "active" : ""}" data-screen="labelSettings">
      <section class="page-head">
        <p class="eyebrow">송장출력 설정</p>
        <h1>라벨 출력 위치 보정</h1>
        <p class="lead">실제 우체국 라벨 미리보기와 출력 좌표를 함께 보정합니다. 배경 라벨 이미지는 화면 미리보기 전용이며 실제 출력은 검정 텍스트와 바코드만 사용합니다.</p>
        <div class="page-actions">
          <button class="secondary-button" type="button" data-action="refreshLabelSettings">설정 새로고침</button>
          <button class="secondary-button" type="button" data-action="previewTestLabel">테스트 PDF 생성</button>
          <button class="primary-button" type="button" data-action="printTestLabel">테스트 출력</button>
        </div>
      </section>

      <section class="label-settings-workbench">
        ${renderKoreaPostLabelPreview()}
        ${renderLabelCalibrationEditor()}
      </section>

      <section class="panel summary-panel">
        <h3>출력 기준</h3>
        <div class="history-list">
          <div class="history-item">
            <div class="history-time">1</div>
            <div>
              <div class="product-name">브라우저 인쇄 설정</div>
              <div class="product-meta">배율 100%, 여백 없음, 가로 방향, 머리글/바닥글 제거</div>
            </div>
          </div>
          <div class="history-item">
            <div class="history-time">2</div>
            <div>
              <div class="product-name">미리보기 위치 조정</div>
              <div class="product-meta">화면 미리보기에서 항목 자체가 어긋나면 전체 X/Y 또는 해당 항목 X/Y를 조정합니다.</div>
            </div>
          </div>
          <div class="history-item">
            <div class="history-time">3</div>
            <div>
              <div class="product-name">실제 인쇄 차이 보정</div>
              <div class="product-meta">미리보기는 맞는데 종이 출력만 밀리면 실출력 전용 X/Y/배율을 조정합니다. 출력물이 오른쪽 또는 아래로 밀리면 먼저 음수 방향으로 줄여봅니다.</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderLabelCalibrationEditor() {
  return `
    <section class="panel summary-panel label-calibration-panel" id="labelCalibrationPanel">
      <div class="panel-head-row">
        <div>
          <p class="eyebrow">Settings 시트 저장</p>
          <h3>위치 보정값</h3>
        </div>
        <span class="badge">0.5mm 단위</span>
      </div>
      <p class="product-meta label-calibration-help">숫자를 입력하거나 +/- 버튼을 누르면 왼쪽 미리보기에 바로 반영됩니다. 실제 인쇄만 밀리면 실출력 전용 X/Y/배율만 조정한 뒤 저장합니다.</p>
      <div class="label-calibration-grid" id="labelCalibrationFields">
        ${labelCalibrationFields.map(renderLabelCalibrationField).join("")}
      </div>
      <div class="page-actions">
        <button class="primary-button" type="button" data-action="saveLabelSettings">저장</button>
        <button class="secondary-button" type="button" data-action="resetLabelSettings">기본값으로 초기화</button>
      </div>
    </section>
  `;
}

function renderKoreaPostLabelPreview() {
  const previewData = shippingLabelPrintData(testLabelOrder(), { forceTestMode: true });
  return `
    <section class="panel summary-panel label-preview-panel" id="labelPreviewPanel">
      <div class="panel-head-row">
        <div>
          <p class="eyebrow">미리보기 전용</p>
          <h3>우체국 송장 미리보기</h3>
        </div>
        <span class="badge">실제 출력과 배경 분리</span>
      </div>
      <div class="label-preview-tools">
        <label class="checkbox-row label-preview-toggle">
          <span>실제 우체국 라벨 배경</span>
          <input id="labelPreviewBackground" type="checkbox" ${state.forms.labelPreviewBackground ? "checked" : ""} />
        </label>
        <label class="checkbox-row label-preview-toggle">
          <span>좌표 가이드</span>
          <input id="labelPreviewGuides" type="checkbox" ${state.forms.labelPreviewGuides ? "checked" : ""} />
        </label>
        <label class="checkbox-row label-preview-toggle">
          <span>실제 출력 영역</span>
          <input id="labelPreviewOutputArea" type="checkbox" ${state.forms.labelPreviewOutputArea ? "checked" : ""} />
        </label>
        <label class="field label-preview-zoom">
          <span>확대/축소 <output id="labelPreviewZoomValue">${Math.round(Number(state.forms.labelPreviewZoom || 1) * 100)}%</output></span>
          <input id="labelPreviewZoom" type="range" min="0.6" max="1.6" step="0.05" value="${escapeAttr(state.forms.labelPreviewZoom)}" />
        </label>
      </div>
      <div class="label-preview-values" id="labelPreviewValues">
        ${renderLabelPreviewValues()}
      </div>
      <div class="label-preview-viewport" id="labelPreviewViewport">
        ${renderLabelPreviewSheet(previewData)}
      </div>
      <div class="page-actions">
        <button class="secondary-button" type="button" data-action="previewTestLabel">테스트 PDF 생성</button>
        <button class="primary-button" type="button" data-action="printTestLabel">테스트 출력</button>
        <a class="secondary-button" href="#labelCalibrationPanel">보정값 입력 보기</a>
      </div>
    </section>
  `;
}

function renderLabelPreviewValues() {
  return `
    <span>OFFSET X <strong>${formatCalibrationNumber(labelCalibrationValue("labelOffsetX"))}mm</strong></span>
    <span>OFFSET Y <strong>${formatCalibrationNumber(labelCalibrationValue("labelOffsetY"))}mm</strong></span>
    <span>SCALE <strong>${formatCalibrationNumber(labelCalibrationValue("labelScale"))}</strong></span>
    <span>실출력 X/Y <strong>${formatCalibrationNumber(labelCalibrationValue("printOffsetX"))}, ${formatCalibrationNumber(labelCalibrationValue("printOffsetY"))}</strong></span>
    <span>실출력 배율 <strong>${formatCalibrationNumber(labelCalibrationValue("printScale"))}</strong></span>
    <span>메인 바코드 <strong>${formatCalibrationNumber(labelCalibrationValue("leftBarcodeX"))}, ${formatCalibrationNumber(labelCalibrationValue("leftBarcodeY"))}</strong></span>
    <span>하단 바코드 <strong>${formatCalibrationNumber(labelCalibrationValue("bottomBarcodeX"))}, ${formatCalibrationNumber(labelCalibrationValue("bottomBarcodeY"))}</strong></span>
  `;
}

function renderLabelPreviewSheet(data) {
  const classes = [
    "label-preview-stage",
    state.forms.labelPreviewBackground ? "show-template" : "",
    state.forms.labelPreviewGuides ? "show-guides" : "",
    state.forms.labelPreviewOutputArea ? "show-output-area" : ""
  ].filter(Boolean).join(" ");
  return `
    <div class="label-preview-stage-wrap" style="--label-preview-zoom:${escapeAttr(state.forms.labelPreviewZoom)}">
      <figure class="${classes}" id="labelPreviewStage" aria-label="우체국 소포 라벨 실제 미리보기">
        <img class="label-preview-template" src="${koreaPostLabelPreviewTemplate}" alt="" aria-hidden="true" />
        <div class="label-preview-overlay" style="--label-preview-data-scale:${escapeAttr(labelCalibrationValue("labelScale"))}">
          ${renderLabelPreviewOverlay(data)}
        </div>
      </figure>
    </div>
  `;
}

function renderLabelPreviewOverlay(data) {
  return `
    ${data.testWatermark ? `<div class="label-preview-watermark" style="${labelPreviewPointStyle(koreaPostOverlay.WATERMARK_X_MM, koreaPostOverlay.WATERMARK_Y_MM)}">TEST / 실제 접수 아님</div>` : ""}
    <div class="label-preview-field preview-region-code" style="${labelPreviewBoxStyle(koreaPostOverlay.REGION_CODE_X_MM, koreaPostOverlay.REGION_CODE_Y_MM, koreaPostOverlay.REGION_CODE_WIDTH_MM)}">${renderLabelRegionCode(data.regionCode)}</div>
    <div class="label-preview-field preview-sort-code" style="${labelPreviewBoxStyle(koreaPostOverlay.SORT_CODE_X_MM, koreaPostOverlay.SORT_CODE_Y_MM, koreaPostOverlay.SORT_CODE_WIDTH_MM)}">${escapeHtml(data.sortCode)}</div>
    <div class="label-preview-field preview-customer-order" style="${labelPreviewBoxStyle(koreaPostOverlay.CUSTOMER_ORDER_X_MM, koreaPostOverlay.CUSTOMER_ORDER_Y_MM, koreaPostOverlay.CUSTOMER_ORDER_WIDTH_MM)}">
      <span>접수국: ${escapeHtml(data.receiptOffice)}　신청일: ${escapeHtml(data.receiptDate)}</span>
      <span>주문인: ${escapeHtml(data.ordererName)}</span>
      <span>고객 주문처: ${escapeHtml(data.dealerName)}</span>
      <span>주문번호: ${escapeHtml(data.orderNo)}</span>
    </div>
    <div class="label-preview-field preview-payment" style="${labelPreviewBoxStyle(koreaPostOverlay.PAYMENT_X_MM, koreaPostOverlay.PAYMENT_Y_MM, 18)}">요금: ${escapeHtml(data.paymentMethod)}</div>
    <div class="label-preview-field preview-metric" style="${labelPreviewBoxStyle(koreaPostOverlay.WEIGHT_X_MM, koreaPostOverlay.WEIGHT_Y_MM, 18)}">중량:${escapeHtml(data.weightText)}</div>
    <div class="label-preview-field preview-metric" style="${labelPreviewBoxStyle(koreaPostOverlay.VOLUME_X_MM, koreaPostOverlay.VOLUME_Y_MM, 18)}">용적:${escapeHtml(data.volumeText)}</div>
    <div class="label-preview-field preview-metric" style="${labelPreviewBoxStyle(koreaPostOverlay.FEE_X_MM, koreaPostOverlay.FEE_Y_MM, 20)}">요금:${escapeHtml(data.feeText)}</div>
    <div class="label-preview-barcode" style="${labelPreviewBoxStyle(koreaPostOverlay.BARCODE_X_MM, koreaPostOverlay.BARCODE_Y_MM, koreaPostOverlay.BARCODE_WIDTH_MM, koreaPostOverlay.BARCODE_HEIGHT_MM)}">${code128BarcodeSvg(data.registrationNo)}</div>
    <div class="label-preview-field preview-small" style="${labelPreviewBoxStyle(koreaPostOverlay.MESSAGE_X_MM, koreaPostOverlay.MESSAGE_Y_MM, koreaPostOverlay.MESSAGE_WIDTH_MM)}">배송메시지: ${escapeHtml(data.messageText)}</div>
    <div class="label-preview-field preview-small" style="${labelPreviewBoxStyle(koreaPostOverlay.CONTENT_X_MM, koreaPostOverlay.CONTENT_Y_MM, koreaPostOverlay.CONTENT_WIDTH_MM)}">내용품명: ${escapeHtml(data.contentName)}</div>
    <div class="label-preview-field preview-tiny" style="${labelPreviewBoxStyle(koreaPostOverlay.PRODUCT_X_MM, koreaPostOverlay.PRODUCT_Y_MM, koreaPostOverlay.PRODUCT_WIDTH_MM)}">${escapeHtml(data.productText)}</div>
    <div class="label-preview-field preview-small preview-sender" style="${labelPreviewBoxStyle(koreaPostOverlay.SENDER_X_MM, koreaPostOverlay.SENDER_Y_MM, koreaPostOverlay.SENDER_WIDTH_MM)}">
      <span>${escapeHtml(data.sender.address)}</span>
      <strong>${escapeHtml(data.sender.name)}</strong>
      <span>T: ${escapeHtml(data.sender.phone)}</span>
    </div>
    <div class="label-preview-field preview-recipient" style="${labelPreviewBoxStyle(koreaPostOverlay.RECIPIENT_X_MM, koreaPostOverlay.RECIPIENT_Y_MM, koreaPostOverlay.RECIPIENT_WIDTH_MM)}">
      <span>${escapeHtml(data.recipient.address)}</span>
      ${data.recipient.addressDetail ? `<span>${escapeHtml(data.recipient.addressDetail)}</span>` : ""}
      <strong>${escapeHtml(data.recipient.name)}</strong>
      <span>T: ${escapeHtml(data.recipient.phone)}</span>
      <b>${escapeHtml(data.recipient.zipcode)}</b>
    </div>
    <div class="label-preview-field preview-small" style="${labelPreviewBoxStyle(koreaPostOverlay.REGISTRATION_X_MM, koreaPostOverlay.REGISTRATION_Y_MM, koreaPostOverlay.REGISTRATION_WIDTH_MM)}">
      <span>등기번호: ${escapeHtml(data.registrationNo)}</span>
      <span>수량: ${roll(data.qty)}</span>
    </div>
    <div class="label-preview-barcode" style="${labelPreviewBoxStyle(koreaPostOverlay.BOTTOM_BARCODE_X_MM, koreaPostOverlay.BOTTOM_BARCODE_Y_MM, koreaPostOverlay.BOTTOM_BARCODE_WIDTH_MM, koreaPostOverlay.BOTTOM_BARCODE_HEIGHT_MM)}">${code128BarcodeSvg(data.registrationNo)}</div>
    <div class="label-preview-field preview-bottom-code" style="${labelPreviewBoxStyle(koreaPostOverlay.BOTTOM_CODE_X_MM, koreaPostOverlay.BOTTOM_CODE_Y_MM, koreaPostOverlay.BOTTOM_CODE_WIDTH_MM)}">${escapeHtml(data.bottomCode)}</div>
  `;
}

function renderLabelCalibrationField(field) {
  const value = labelCalibrationValue(field.id);
  const step = field.step || 0.5;
  return `
    <label class="field label-calibration-field">
      <span>${escapeHtml(field.label)}</span>
      <div class="label-stepper">
        <button type="button" class="step-button" data-label-step="${escapeAttr(field.id)}" data-step="${-step}">-${step}</button>
        <input id="labelCal_${escapeAttr(field.id)}" type="number" step="${step}" value="${escapeAttr(formatCalibrationNumber(value))}" inputmode="decimal" />
        <button type="button" class="step-button" data-label-step="${escapeAttr(field.id)}" data-step="${step}">+${step}</button>
      </div>
      <small>${escapeHtml(field.key)}</small>
    </label>
  `;
}

function labelCalibrationValue(id) {
  const field = labelCalibrationFields.find((item) => item.id === id);
  return calibrationNumber(state.labelCalibration?.[id], field?.defaultValue);
}

function labelCalibrationSettingsPayload() {
  return Object.fromEntries(labelCalibrationFields.map((field) => [field.key, labelCalibrationValue(field.id)]));
}

function applyLabelSettings(settings) {
  if (!settings || typeof settings !== "object") {
    syncLabelOverlayCalibration();
    return;
  }
  labelCalibrationFields.forEach((field) => {
    const nextValue = Object.prototype.hasOwnProperty.call(settings, field.key)
      ? settings[field.key]
      : settings[field.id];
    state.labelCalibration[field.id] = calibrationNumber(nextValue, field.defaultValue);
  });
  syncLabelOverlayCalibration();
}

function syncLabelOverlayCalibration() {
  Object.entries(labelCalibrationOverlayMap).forEach(([fieldId, overlayKey]) => {
    koreaPostOverlay[overlayKey] = labelCalibrationValue(fieldId);
  });
}

function adjustLabelCalibration(id, delta) {
  const field = labelCalibrationFields.find((item) => item.id === id);
  if (!field) return;
  state.labelCalibration[id] = Number((labelCalibrationValue(id) + Number(delta || 0)).toFixed(2));
  syncLabelOverlayCalibration();
}

function validateLabelCalibration() {
  if (labelCalibrationValue("labelScale") <= 0) throw new Error("전체 배율은 0보다 커야 합니다.");
  if (labelCalibrationValue("printScale") <= 0) throw new Error("실출력 전용 배율은 0보다 커야 합니다.");
  ["leftBarcodeWidth", "leftBarcodeHeight", "bottomBarcodeWidth", "bottomBarcodeHeight"].forEach((id) => {
    if (labelCalibrationValue(id) <= 0) throw new Error("바코드 width/height는 0보다 커야 합니다.");
  });
}

function refreshLabelPreview() {
  const viewport = document.querySelector("#labelPreviewViewport");
  if (viewport) viewport.innerHTML = renderLabelPreviewSheet(shippingLabelPrintData(testLabelOrder(), { forceTestMode: true }));
  const values = document.querySelector("#labelPreviewValues");
  if (values) values.innerHTML = renderLabelPreviewValues();
  refreshLabelPreviewZoom();
}

function refreshLabelPreviewZoom() {
  document.querySelector(".label-preview-stage-wrap")?.style.setProperty("--label-preview-zoom", state.forms.labelPreviewZoom);
  const output = document.querySelector("#labelPreviewZoomValue");
  if (output) output.textContent = `${Math.round(Number(state.forms.labelPreviewZoom || 1) * 100)}%`;
}

function labelPreviewBoxStyle(x, y, width = 0, height = 0) {
  const styles = [
    `left:${labelPreviewXPercent(x)}%`,
    `top:${labelPreviewYPercent(y)}%`
  ];
  if (width) styles.push(`width:${labelPreviewWidthPercent(width)}%`);
  if (height) styles.push(`height:${labelPreviewHeightPercent(height)}%`);
  return styles.join(";");
}

function labelPreviewPointStyle(x, y) {
  return `${labelPreviewBoxStyle(x, y)};`;
}

function labelPreviewXPercent(value) {
  return Number(((koreaPostOverlay.OFFSET_X_MM + Number(value || 0) * koreaPostOverlay.SCALE) / koreaPostOverlay.PAGE_WIDTH_MM * 100).toFixed(4));
}

function labelPreviewYPercent(value) {
  return Number(((koreaPostOverlay.OFFSET_Y_MM + Number(value || 0) * koreaPostOverlay.SCALE) / koreaPostOverlay.PAGE_HEIGHT_MM * 100).toFixed(4));
}

function labelPreviewWidthPercent(value) {
  return Number((Number(value || 0) * koreaPostOverlay.SCALE / koreaPostOverlay.PAGE_WIDTH_MM * 100).toFixed(4));
}

function labelPreviewHeightPercent(value) {
  return Number((Number(value || 0) * koreaPostOverlay.SCALE / koreaPostOverlay.PAGE_HEIGHT_MM * 100).toFixed(4));
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
  const productColorFallback = productCategoryMatches({ category: state.forms.productCategory }, "tint") ? "#111111" : "#f7fbf9";
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
                ${["PPF", "틴팅", "TINTING"].map((category) => `<option value="${category}" ${state.forms.productCategory === category ? "selected" : ""}>${category}</option>`).join("")}
              </select>
            </label>
            <label class="field">
              <span>브랜드</span>
              <input id="productBrand" type="text" value="${escapeAttr(state.forms.productBrand)}" placeholder="예: GLOC" />
            </label>
            <label class="field">
              <span>색상명</span>
              <input id="productColorName" type="text" value="${escapeAttr(state.forms.productColorName)}" placeholder="예: 울트라 레드 / 차콜" />
            </label>
            <label class="field">
              <span>색상 HEX</span>
              <div class="color-input-row">
                <input id="productColorHex" type="color" value="${escapeAttr(normalizeHexColor(state.forms.productColorHex, productColorFallback))}" />
                <input id="productColorHexText" type="text" value="${escapeAttr(state.forms.productColorHex)}" placeholder="#B00020" />
                <span class="color-chip-preview" style="background:${escapeAttr(normalizeHexColor(state.forms.productColorHex, productColorFallback))}"></span>
              </div>
              <small class="field-help">입력한 HEX 색상값이 그대로 3D 모델에 적용됩니다.</small>
            </label>
            <label class="field">
              <span>색상표 이미지</span>
              <input id="productColorChartImageUrl" type="text" value="${escapeAttr(state.forms.productColorChartImageUrl)}" placeholder="이미지 URL 또는 업로드 후 자동 입력" />
              <input id="productColorChartFile" type="file" accept="image/*" />
              ${state.forms.productColorChartImageUrl ? `<img class="product-chart-preview" src="${escapeAttr(state.forms.productColorChartImageUrl)}" alt="색상표 미리보기" />` : ""}
            </label>
            ${renderProductCategoryFields()}
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
            <label class="field wide-field">
              <span>설명</span>
              <textarea id="productDescription" placeholder="제품 특징, 상담 시 안내 문구 등">${escapeHtml(state.forms.productDescription)}</textarea>
            </label>
            <label class="checkbox-row inline-check">
              <input id="productIsActive" type="checkbox" ${state.forms.productIsActive ? "checked" : ""} />
              <span>판매중</span>
            </label>
            <button type="button" class="primary-button" data-action="saveProduct">제품 저장</button>
          </div>
        </div>

        <div class="panel list-panel">
          <div class="panel-head-row">
            <h3>제품 목록</h3>
            <input class="search-input compact-search" id="productManageQuery" type="search" placeholder="브랜드, 제품명, 코드, 색상 검색" value="${escapeAttr(state.filters.productManageQuery || "")}" />
          </div>
          <div class="product-list" id="productManageRows">
            ${productManageRows().slice(0, 60).map(renderProductManageRow).join("") || `<div class="empty">등록된 제품이 없습니다.</div>`}
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderProductCategoryFields() {
  const isTint = productCategoryMatches({ category: state.forms.productCategory }, "tint");
  if (isTint) {
    return `
      <label class="field">
        <span>틴팅 농도 (0~100)</span>
        <input id="productShadePercent" type="number" min="0" max="100" inputmode="numeric" value="${escapeAttr(state.forms.productShadePercent)}" placeholder="예: 15" />
        <small class="field-help">0 = 틴팅 없음, 100 = 완전 검정</small>
      </label>
      <label class="field">
        <span>투명도 (0~100)</span>
        <input id="productOpacity" type="number" min="0" max="100" inputmode="numeric" value="${escapeAttr(state.forms.productOpacity)}" />
        <small class="field-help">0 = 완전 투명, 100 = 완전 불투명</small>
      </label>
    `;
  }
  return `
    <label class="field">
      <span>광택 타입</span>
      <select id="productFinishType">
        ${productFinishOptions.map((option) => `<option value="${option.value}" ${state.forms.productFinishType === option.value ? "selected" : ""}>${option.label}</option>`).join("")}
      </select>
    </label>
    <label class="field">
      <span>투명도 타입</span>
      <select id="productTransparencyType">
        ${productTransparencyOptions.map((option) => `<option value="${option.value}" ${state.forms.productTransparencyType === option.value ? "selected" : ""}>${option.label}</option>`).join("")}
      </select>
    </label>
    <label class="field">
      <span>투명도 수치(0~100)</span>
      <input id="productOpacity" type="number" min="0" max="100" inputmode="numeric" value="${escapeAttr(state.forms.productOpacity)}" />
    </label>
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
              <span>차량번호</span>
              <input id="reservationVehicleNumber" type="text" value="${escapeAttr(state.forms.reservationVehicleNumber)}" placeholder="예: 12가3456" />
            </label>
            <label class="field">
              <span>차량모델</span>
              <input id="reservationVehicleModel" type="text" value="${escapeAttr(state.forms.reservationVehicleModel)}" placeholder="예: GV80" />
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

function renderConsultation() {
  if (!state.session) return "";
  const vehicle = selectedConsultationVehicle();
  const quote = consultationQuote();
  const color = vehicleColorByName(state.consultation.color);
  const canUse3d = consultationCanUse3d(vehicle);
  const mode = state.consultation.renderMode === "3d" && canUse3d ? "3d" : "image";
  const recent = visibleConsultations().slice(0, 4);
  return `
    <main class="screen ${state.screen === "consultation" ? "active consultation-screen" : ""}" data-screen="consultation">
      <section class="page-head consultation-head">
        <p class="eyebrow">${state.session.role === "admin" ? "관리자 상담 도구" : escapeHtml(currentDealerName())}</p>
        <h1>틴팅 및 PPF 상담 시뮬레이터</h1>
        <p class="lead">차량 색상, 틴팅 농도, PPF 시공 부위를 선택하면 태블릿 상담 화면에서 즉시 시공 느낌과 견적을 확인합니다.</p>
        <div class="page-actions">
          ${state.session.role === "admin" ? `<button class="secondary-button" type="button" data-nav="vehicleAdmin">차량/3D 관리</button>` : ""}
          <button class="secondary-button" type="button" data-action="refresh">제품/재고 새로고침</button>
        </div>
      </section>

      <section class="consultation-shell">
        <article class="panel consultation-viewer-panel">
          <div class="consultation-viewer-head">
            <div>
              <span class="eyebrow">Tesla Showroom</span>
              <h2>${escapeHtml(vehicleDisplayName(vehicle))}</h2>
              <p>${escapeHtml(color.label)} · ${mode === "3d" ? "3D GLB 모드" : "2.5D 이미지/SVG 모드"}</p>
            </div>
            <div class="consultation-mode-toggle">
              <button type="button" class="${mode === "image" ? "active" : ""}" data-consultation-mode="image">2.5D</button>
              <button type="button" class="${mode === "3d" ? "active" : ""}" data-consultation-mode="3d" ${canUse3d ? "" : "disabled"}>3D</button>
            </div>
          </div>
          ${mode === "3d" ? renderConsultation3dSlot(vehicle) : renderConsultationVehicleStage(vehicle)}
          <div class="consultation-view-tabs">
            ${vehicleViewOptions.map((view) => `<button type="button" class="${state.consultation.view === view.value ? "active" : ""}" data-consultation-view="${view.value}">${escapeHtml(view.label)}</button>`).join("")}
          </div>
          <div class="consultation-bottom-actions">
            <button type="button" class="secondary-button" data-action="downloadConsultationSnapshot">Screenshot 저장</button>
            <button type="button" class="primary-button" data-action="saveConsultation">상담 저장</button>
            <button type="button" class="secondary-button" data-action="consultationFutureReservation">예약 생성</button>
            <button type="button" class="secondary-button" data-action="consultationFutureCertificate">정품인증 생성</button>
          </div>
        </article>

        <aside class="panel consultation-control-panel">
          ${renderConsultationVehicleControls(vehicle)}
          ${renderConsultationColorControls()}
          <div id="consultationProductControlsMount">${renderConsultationProductControls()}</div>
          <div id="consultationTintAreaMount">${renderConsultationTintAreaControls()}</div>
          <div id="consultationPartMount">${renderConsultationPartControls()}</div>
          <div id="consultationAppliedPartsMount">${renderConsultationAppliedParts()}</div>
          ${renderConsultationCustomerForm()}
          <div id="consultationQuoteMount">${renderConsultationQuotePanel(quote)}</div>
        </aside>
      </section>

      <section class="panel history-panel consultation-history">
        <div class="panel-head-row">
          <h3>최근 상담</h3>
          <input class="search-input compact-search" id="consultationQuery" type="search" placeholder="고객명, 차량, 제품 검색" value="${escapeAttr(state.filters.consultationQuery)}" />
        </div>
        <div class="consultation-history-list" id="consultationRows">
          ${recent.map(renderConsultationHistoryCard).join("") || `<div class="empty">저장된 상담 내역이 없습니다.</div>`}
        </div>
      </section>
    </main>
  `;
}

function renderConsultationVehicleStage(vehicle) {
  const color = vehicleColorByName(state.consultation.color);
  const tintOpacity = consultationAverageTintOpacity();
  const ppfProduct = selectedConsultationPpfProduct();
  const ppfTone = ppfProduct && /매트|matte/i.test(productDisplayName(ppfProduct)) ? "matte" : /카본|carbon/i.test(productDisplayName(ppfProduct)) ? "carbon" : "gloss";
  return `
    <div class="consultation-stage" data-view="${escapeAttr(state.consultation.view)}">
      <div class="consultation-stage-bg"></div>
      <svg class="consultation-car-svg" viewBox="0 0 980 470" role="img" aria-label="${escapeAttr(vehicleDisplayName(vehicle))} 상담 이미지">
        <defs>
          <linearGradient id="carBodyShine" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="${escapeAttr(color.accent)}" stop-opacity="0.95" />
            <stop offset="45%" stop-color="${escapeAttr(color.hex)}" stop-opacity="1" />
            <stop offset="100%" stop-color="#060707" stop-opacity="0.48" />
          </linearGradient>
          <linearGradient id="glassTintGradient" x1="0" x2="1">
            <stop offset="0%" stop-color="#0c1115" stop-opacity="${tintOpacity}" />
            <stop offset="100%" stop-color="#23323a" stop-opacity="${Math.max(0.18, tintOpacity - 0.12)}" />
          </linearGradient>
          <pattern id="carbonPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="16" height="16" fill="rgba(255,255,255,0.04)" />
            <path d="M0 0H16M0 8H16" stroke="#ffffff" stroke-opacity="0.22" stroke-width="2" />
          </pattern>
          <filter id="softVehicleShadow" x="-20%" y="-30%" width="140%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity="0.42" />
          </filter>
        </defs>
        <ellipse cx="490" cy="392" rx="395" ry="42" fill="#000" opacity="0.35" />
        <g filter="url(#softVehicleShadow)" class="vehicle-body-group">
          <path class="consult-body" d="M119 276C146 215 234 190 313 179C357 128 440 98 571 108C663 116 728 155 773 204C844 209 893 238 913 287C926 318 914 345 882 353H130C91 342 90 310 119 276Z" fill="url(#carBodyShine)" />
          <path class="consult-hood" d="M127 273C185 222 260 203 327 197L384 268L268 292L132 292Z" fill="${escapeAttr(color.hex)}" opacity="0.72" />
          <path class="consult-roof" d="M352 184C397 132 470 117 564 126C633 132 690 164 731 210L623 217L397 212Z" fill="${escapeAttr(color.hex)}" opacity="0.82" />
          <path class="consult-window" d="M385 203C423 152 488 140 559 146C618 151 668 176 702 211L616 215L414 210Z" fill="url(#glassTintGradient)" />
          <path class="consult-window" d="M274 211C302 198 333 191 365 188L399 212L356 260L254 269Z" fill="url(#glassTintGradient)" opacity="0.88" />
          <path class="consult-window" d="M707 214L766 220C795 227 819 240 835 260L736 263L621 217Z" fill="url(#glassTintGradient)" opacity="0.82" />
          <path class="consult-door" d="M397 217L617 219L684 344H333L354 264Z" fill="${escapeAttr(color.hex)}" opacity="0.48" />
          <path class="consult-trunk" d="M686 234C765 230 851 251 896 291L876 337L697 342L646 232Z" fill="${escapeAttr(color.hex)}" opacity="0.68" />
          <path class="consult-bumper" d="M104 292L244 293L237 346H125C88 336 83 315 104 292Z" fill="#111415" opacity="0.55" />
          <path class="consult-bumper" d="M849 287C898 295 925 318 891 348H733L732 294Z" fill="#111415" opacity="0.55" />
          <circle cx="260" cy="347" r="54" fill="#111" />
          <circle cx="260" cy="347" r="28" fill="#444" />
          <circle cx="744" cy="347" r="54" fill="#111" />
          <circle cx="744" cy="347" r="28" fill="#444" />
          <path d="M163 292H877" stroke="#fff" stroke-opacity="0.22" stroke-width="2" />
          <path d="M410 214L390 344M618 218L670 344" stroke="#080a0a" stroke-opacity="0.38" stroke-width="4" />
          ${renderPpfSvgOverlays(ppfTone)}
        </g>
      </svg>
      <div class="consultation-stage-caption">
        <strong>${escapeHtml(vehicleDisplayName(vehicle))}</strong>
        <span>${escapeHtml(selectedConsultationSummary())}</span>
      </div>
    </div>
  `;
}

function renderPpfSvgOverlays(ppfTone) {
  const parts = new Set(state.consultation.ppfParts || []);
  const all = parts.has("full_body");
  const fill = ppfTone === "carbon" ? "url(#carbonPattern)" : ppfTone === "matte" ? "rgba(255,255,255,0.20)" : "rgba(255,211,118,0.20)";
  const stroke = ppfTone === "matte" ? "#d9d5ca" : "#d8b05a";
  const overlays = [
    ["hood", "M134 275C191 228 261 208 330 200L384 268L268 292L132 292Z"],
    ["front_bumper", "M99 292L246 292L239 346H126C89 337 82 316 99 292Z"],
    ["rear_bumper", "M831 287C889 292 928 318 891 348H735L732 295Z"],
    ["front_fender", "M244 292L338 273L330 343H302C296 312 281 294 244 292Z"],
    ["rear_fender", "M677 343L690 270L760 281C730 291 713 313 706 343Z"],
    ["front_door", "M350 266L397 218L504 218L508 344H331Z"],
    ["rear_door", "M507 218L617 219L681 344H509Z"],
    ["mirror", "M348 214L383 211L372 227L342 229Z"],
    ["roof", "M352 184C397 132 470 117 564 126C633 132 690 164 731 210L623 217L397 212Z"],
    ["trunk", "M686 234C765 230 851 251 896 291L876 337L697 342L646 232Z"],
    ["headlight", "M869 286L906 295L886 306L850 300Z"],
    ["pillar", "M397 211L421 209L400 264L375 265Z"],
    ["door_cup", "M457 262H492M574 262H609"],
    ["door_edge", "M506 220V343M621 222L675 342"]
  ];
  return overlays
    .filter(([key]) => all || parts.has(key))
    .map(([key, path]) => {
      const lineOnly = key === "door_cup" || key === "door_edge";
      return lineOnly
        ? `<path class="ppf-overlay" d="${path}" fill="none" stroke="${stroke}" stroke-width="8" stroke-linecap="round" opacity="0.95" />`
        : `<path class="ppf-overlay" d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-dasharray="10 8" opacity="0.9" />`;
    })
    .join("");
}

function renderConsultation3dSlot(vehicle) {
  const glbUrl = publicAssetUrl(vehicle?.glb_file_url || "");
  const environmentUrl = publicAssetUrl(showroomEnvironmentPath);
  return `
    <div
      class="consultation-stage consultation-3d-stage"
      id="consultation3dViewer"
      data-glb-url="${escapeAttr(glbUrl)}"
      data-env-url="${escapeAttr(environmentUrl)}"
      data-vehicle-id="${escapeAttr(vehicle?.id || "")}"
      data-view="${escapeAttr(state.consultation.view)}"
      data-body-color="${escapeAttr(vehicleColorByName(state.consultation.color).hex)}"
      data-vehicle-name="${escapeAttr(vehicleDisplayName(vehicle))}"
    >
      <div class="consultation-orbit-grid"></div>
      <div class="consultation-3d-loader">
        <span class="badge warn">3D GLB 로딩</span>
        <h2>${escapeHtml(vehicleDisplayName(vehicle))}</h2>
        <p>등록된 3D 모델을 불러오고 있습니다. 화면을 드래그하면 회전하고, 손가락 두 개로 확대/축소할 수 있습니다.</p>
        <code>${escapeHtml(vehicle?.glb_file_url || "/models/tesla/*.glb")}</code>
      </div>
      <div class="consultation-stage-caption">
        <strong>${escapeHtml(vehicleDisplayName(vehicle))}</strong>
        <span>3D GLB · ${escapeHtml(selectedConsultationSummary())}</span>
      </div>
    </div>
  `;
}

function renderConsultationVehicleControls(vehicle) {
  const models = consultationVehicleModels();
  const generations = consultationVehicleGenerations(vehicle?.model_name);
  return `
    <section class="consultation-control-section">
      <div class="control-section-head">
        <span class="eyebrow">01 Vehicle</span>
        <strong>차량 선택</strong>
      </div>
      <div class="consultation-pill-row">
        <button type="button" class="active" disabled>Tesla</button>
      </div>
      <div class="consultation-pill-row">
        ${models.map((model) => `<button type="button" class="${vehicle?.model_name === model ? "active" : ""}" data-consultation-model="${escapeAttr(model)}">${escapeHtml(model)}</button>`).join("")}
      </div>
      <div class="consultation-pill-row">
        ${generations.map((item) => `<button type="button" class="${vehicle?.id === item.id ? "active" : ""}" data-consultation-vehicle="${escapeAttr(item.id)}">${escapeHtml(item.generation_name)}</button>`).join("")}
      </div>
    </section>
  `;
}

function renderConsultationColorControls() {
  return `
    <section class="consultation-control-section">
      <div class="control-section-head">
        <span class="eyebrow">02 Color</span>
        <strong>차량 색상</strong>
      </div>
      <div class="consultation-color-grid">
        ${vehicleColorOptions.map((color) => `
          <button type="button" class="${state.consultation.color === color.name ? "active" : ""}" data-consultation-color="${escapeAttr(color.name)}">
            <span style="background:${escapeAttr(color.hex)}"></span>
            ${escapeHtml(color.label)}
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderConsultationProductControls() {
  const category = state.consultation.selectedCategory;
  return `
    ${renderConsultationSelectedPartPanel()}
    ${category === "glass" ? renderConsultationProductStep("tint") : ""}
    ${category === "body" || !category ? renderConsultationProductStep("ppf") : ""}
    ${!category ? `
      <section class="consultation-control-section">
        <div class="control-section-head">
          <span class="eyebrow">03 Product</span>
          <strong>적용 방법</strong>
        </div>
        <div class="empty compact-empty">PPF는 제품을 먼저 검색해 선택한 뒤 차체를 클릭하면 바로 적용됩니다. 틴팅은 유리를 클릭한 뒤 제품을 검색해 적용하세요.</div>
      </section>
    ` : ""}
  `;
}

function renderConsultationSelectedPartPanel() {
  const partId = state.consultation.selectedPartId;
  const category = state.consultation.selectedCategory;
  const categoryLabel = category === "body" ? "차체 PPF" : category === "glass" ? "유리 틴팅" : "대기";
  const applied = category === "body"
    ? consultationAppliedPpfMap()[partId]
    : category === "glass"
      ? consultationAppliedTintMap()[partId]
      : null;
  return `
    <section class="consultation-control-section selected-part-panel">
      <div class="control-section-head">
        <span class="eyebrow">03 Target</span>
        <strong>선택 부위</strong>
      </div>
      <div class="selected-part-summary ${category ? "active" : ""}">
        <span>
          <strong>${partId ? escapeHtml(consultationPartLabel(partId)) : "차량 부위를 선택하세요"}</strong>
          <small>${escapeHtml(categoryLabel)}${applied ? ` · 적용됨: ${escapeHtml(applied.product_name || applied.name || "-")}` : ""}</small>
        </span>
      </div>
    </section>
  `;
}

function renderConsultationProductStep(type) {
  const config = consultationProductTypeConfig[type];
  const query = type === "tint" ? state.consultation.tintProductQuery : state.consultation.ppfProductQuery;
  const hasQuery = normalize(query).length > 0;
  const products = hasQuery ? consultationFilteredProducts(type).slice(0, 8) : [];
  const enabled = type === "tint" ? state.consultation.tintEnabled !== false : state.consultation.ppfEnabled !== false;
  const searchId = type === "tint" ? "consultationTintProductQuery" : "consultationPpfProductQuery";
  const targetPart = state.consultation.selectedPartId;
  const placeholderPart = type === "tint" && targetPart ? consultationPartLabel(targetPart) : type === "ppf" && targetPart ? consultationPartLabel(targetPart) : "";
  return `
    <section class="consultation-control-section" id="consultation${type === "tint" ? "Tint" : "Ppf"}ProductStep">
      <div class="control-section-head">
        <span class="eyebrow">${type === "tint" ? "03 Film" : "04 PPF"}</span>
        <strong>${config.label} 제품</strong>
      </div>
      <div class="product-search-stack">
        <input class="search-input compact-search" id="${searchId}" type="search" placeholder="${type === "tint" ? `${placeholderPart || "선택 유리"} 틴팅 제품 검색` : `${placeholderPart ? `${placeholderPart} ` : ""}PPF 제품 검색`}" value="${escapeAttr(query || "")}" />
      </div>
      <div class="consultation-product-list" id="consultation${type === "tint" ? "Tint" : "Ppf"}ProductList">
        ${renderNoProductOption(type, enabled)}
        ${renderConsultationProductResults(type, products, hasQuery)}
      </div>
    </section>
  `;
}

function renderConsultationProductResults(type, products, hasQuery) {
  if (!hasQuery) {
    return `<div class="empty compact-empty">${type === "tint" ? "적용 유리를 선택한 뒤 제품명을 검색해 주세요." : "제품명, 브랜드, 코드, 색상으로 검색하면 결과가 표시됩니다."}</div>`;
  }
  return products.map((product) => renderConsultationProductChoice(product, type)).join("") || `<div class="empty">검색 결과가 없습니다.</div>`;
}

function renderNoProductOption(type, enabled) {
  return `
    <button type="button" class="consultation-product-choice no-product-option ${enabled ? "" : "active"}" data-consultation-no-product="${type}">
      <span>
        <strong>${consultationProductTypeConfig[type].label} 선택 안함</strong>
        <small>${type === "tint" ? "유리 틴팅 적용을 비활성화합니다." : "PPF 부위 적용을 비활성화합니다."}</small>
      </span>
      <em>0원</em>
    </button>
  `;
}

function renderConsultationTintAreaControls() {
  if (state.consultation.renderMode === "3d") return "";
  if (state.consultation.tintEnabled === false) return "";
  const areas = consultationTintAreas();
  return `
    <section class="consultation-control-section">
      <div class="control-section-head">
        <span class="eyebrow">03-1 Tint Density</span>
        <strong>유리별 농도</strong>
      </div>
      <div class="consultation-tint-area-list">
        ${tintAreaOptions.map((area) => `
          <div class="consultation-tint-area-row">
            <span>${escapeHtml(area.label)}</span>
            <div>
              ${tintStrengthOptions.map((strength) => `
                <button
                  type="button"
                  class="${Number(areas[area.key]) === strength ? "active" : ""}"
                  data-consultation-tint-area="${escapeAttr(area.key)}"
                  data-tint-strength="${strength}"
                >${strength}%</button>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderConsultationProductChoice(product, type) {
  const currentSku = type === "tint" ? selectedConsultationTintProduct()?.sku : selectedConsultationPpfProduct()?.sku;
  const partId = state.consultation.selectedPartId;
  const applied = type === "tint" ? consultationAppliedTintMap()[partId] : consultationAppliedPpfMap()[partId];
  const selected = currentSku === product.sku || applied?.sku === product.sku;
  const stock = consultationProductStock(product);
  const colorHex = normalizeHexColor(product.colorHex ?? product.color_hex, productCategoryMatches(product, "tint") ? "#111111" : "#ffd36d");
  return `
    <button type="button" class="consultation-product-choice ${selected ? "active" : ""}" data-consultation-product="${escapeAttr(product.sku)}" data-consultation-product-type="${type}" ${stock.disabled ? "disabled" : ""}>
      <span>
        <strong><i class="product-color-dot" style="background:${escapeAttr(colorHex)}"></i>${escapeHtml(productDisplayName(product))}</strong>
        <small>${escapeHtml(productBrandText(product))} · ${escapeHtml(product.sku)} · ${escapeHtml(productMetaText(product))} · ${escapeHtml(stock.label)}</small>
      </span>
      <em>${money(consultationProductPrice(product, type))}</em>
    </button>
  `;
}

function renderConsultationPartControls() {
  if (state.consultation.renderMode === "3d") return "";
  if (state.consultation.ppfEnabled === false) return "";
  const selected = new Set(state.consultation.ppfParts || []);
  return `
    <section class="consultation-control-section">
      <div class="control-section-head">
        <span class="eyebrow">05 Area</span>
        <strong>PPF 부위 선택</strong>
      </div>
      <div class="consultation-part-grid">
        ${ppfPartOptions.map((part) => `
          <button type="button" class="${selected.has(part.key) ? "active" : ""}" data-consultation-part="${escapeAttr(part.key)}">
            <span>${escapeHtml(part.label)}</span>
            <small>${money(part.price)}</small>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderConsultationAppliedParts() {
  const tintMap = consultationAppliedTintMap();
  const ppfMap = consultationAppliedPpfMap();
  const hasTintApplied = Object.values(tintMap).some(Boolean);
  const hasPpfApplied = Object.values(ppfMap).some(Boolean);
  const tintRows = consultationGlassPartOptions.map((part) => {
    const product = tintMap[part.key];
    return `
      <div class="applied-part-row applied-status-row selectable-status-row" role="button" tabindex="0" data-consultation-target-part="${escapeAttr(part.key)}" data-consultation-target-category="glass">
        <span>
          <strong>${escapeHtml(part.label)}</strong>
          <small>${product ? escapeHtml(product.product_name || product.name || "-") : "미적용"}</small>
        </span>
        <span class="status-actions">
          <button type="button" class="secondary-button small-button" data-consultation-target-part="${escapeAttr(part.key)}" data-consultation-target-category="glass">선택</button>
          ${product ? `<button type="button" class="secondary-button small-button" data-remove-application="${escapeAttr(part.key)}" data-remove-category="TINTING">해제</button>` : ""}
        </span>
      </div>
    `;
  }).join("");
  const ppfRows = consultationBodyPartOptions
    .filter((part) => ppfMap[part.key])
    .map((part) => `
      <div class="applied-part-row applied-status-row selectable-status-row" role="button" tabindex="0" data-consultation-target-part="${escapeAttr(part.key)}" data-consultation-target-category="body">
        <span>
          <strong>${escapeHtml(part.label)}</strong>
          <small>${escapeHtml(ppfMap[part.key]?.product_name || ppfMap[part.key]?.name || "-")}</small>
        </span>
        <span class="status-actions">
          <button type="button" class="secondary-button small-button" data-consultation-target-part="${escapeAttr(part.key)}" data-consultation-target-category="body">선택</button>
          <button type="button" class="secondary-button small-button" data-remove-application="${escapeAttr(part.key)}" data-remove-category="PPF">해제</button>
        </span>
      </div>
    `).join("");
  return `
    <section class="consultation-control-section">
      <div class="control-section-head">
        <span class="eyebrow">06 Applied</span>
        <strong>부위별 적용 내역</strong>
      </div>
      <div class="applied-parts-list">
        ${!hasTintApplied && !hasPpfApplied ? `<div class="empty">3D 차량 부위를 클릭하고 제품을 검색해 적용하세요.</div>` : ""}
        <div class="applied-map-heading">유리별 틴팅</div>
        ${tintRows}
        ${ppfRows ? `<div class="applied-map-heading">차체 PPF</div>${ppfRows}` : ""}
      </div>
      <div class="consultation-inline-actions">
        <button type="button" class="secondary-button small-button" data-action="consultationApplyAllTint">틴팅 전체 적용</button>
        <button type="button" class="secondary-button small-button danger-button" data-action="consultationClearAllTint">틴팅 전체 해제</button>
        <button type="button" class="secondary-button small-button" data-action="consultationApplyAllPpf">PPF 전체 적용</button>
        <button type="button" class="secondary-button small-button danger-button" data-action="consultationClearAllPpf">PPF 전체 해제</button>
      </div>
    </section>
  `;
}

function renderConsultationCustomerForm() {
  return `
    <section class="consultation-control-section">
      <div class="control-section-head">
        <span class="eyebrow">06 Customer</span>
        <strong>상담 저장 정보</strong>
      </div>
      <div class="form-grid">
        <label class="field">
          <span>고객명</span>
          <input id="consultationCustomerName" type="text" value="${escapeAttr(state.consultation.customerName)}" placeholder="예: 홍길동" />
        </label>
        <label class="field">
          <span>연락처</span>
          <input id="consultationCustomerPhone" type="tel" inputmode="numeric" maxlength="13" value="${escapeAttr(state.consultation.customerPhone)}" placeholder="예: 010-0000-0000" />
        </label>
        <label class="field">
          <span>상담 메모</span>
          <textarea id="consultationMemo" placeholder="희망 시공일, 차종 특이사항 등">${escapeHtml(state.consultation.memo)}</textarea>
        </label>
      </div>
    </section>
  `;
}

function renderConsultationQuotePanel(quote) {
  return `
    <section class="consultation-quote-panel">
      <div>
        <span class="eyebrow">Live Quote</span>
        <strong>${money(quote.total)}</strong>
        <small>${quote.items.length}개 선택 항목 기준</small>
      </div>
      <dl>
        ${quote.items.map((item) => `<div><dt>${escapeHtml(item.label)}</dt><dd>${money(item.amount)}</dd></div>`).join("") || `<div><dt>선택 항목</dt><dd>없음</dd></div>`}
      </dl>
    </section>
  `;
}

function renderConsultationHistoryCard(row) {
  return `
    <article class="consultation-history-card">
      <div>
        <span class="badge">${escapeHtml(consultationStatusLabels[row.status] || row.status || "상담")}</span>
        <h3>${escapeHtml(row.customer_name || "고객명 미입력")}</h3>
        <p class="product-meta">${escapeHtml(row.vehicle_model || "-")} · ${escapeHtml(row.vehicle_color || "-")}</p>
        <p class="product-meta">${escapeHtml(row.dealer_name || row.dealer_code || "-")} · ${escapeHtml(row.created_by_login_id || "담당자 미기록")} · ${escapeHtml(row.created_at || "-")}</p>
      </div>
      <strong>${money(Number(row.quote_total || 0))}</strong>
    </article>
  `;
}

function renderVehicleAdmin() {
  if (state.session?.role !== "admin") return "";
  const vehicles = activeVehicles();
  const selected = selectedVehicleAdminRecord();
  return `
    <main class="screen ${state.screen === "vehicleAdmin" ? "active" : ""}" data-screen="vehicleAdmin">
      <section class="page-head">
        <p class="eyebrow">상담 시뮬레이터 관리</p>
        <h1>차량/3D 관리</h1>
        <p class="lead">차량 이미지, GLB 파일 경로, 3D Mesh 매핑을 상담 시뮬레이터에서 사용할 수 있도록 준비합니다.</p>
        <div class="page-actions">
          <button class="primary-button" type="button" data-nav="consultation">상담 화면 보기</button>
          <button class="secondary-button" type="button" data-action="refresh">새로고침</button>
        </div>
      </section>
      <section class="work-layout vehicle-admin-layout">
        <div class="panel list-panel">
          <h3>등록 차량</h3>
          <div class="vehicle-admin-list">
            ${vehicles.map(renderVehicleAdminRow).join("") || `<div class="empty">등록된 차량이 없습니다.</div>`}
          </div>
        </div>
        <div class="panel form-panel">
          <h3>${selected ? "차량 정보 수정" : "차량 등록"}</h3>
          <div class="form-grid">
            <label class="field"><span>차량 ID</span><input id="vehicleId" type="text" value="${escapeAttr(state.forms.vehicleId)}" placeholder="예: tesla-model3-highland" /></label>
            <div class="two-col">
              <label class="field"><span>브랜드</span><input id="vehicleBrand" type="text" value="${escapeAttr(state.forms.vehicleBrand)}" /></label>
              <label class="field"><span>모델명</span><input id="vehicleModelName" type="text" value="${escapeAttr(state.forms.vehicleModelName)}" placeholder="Model 3" /></label>
            </div>
            <div class="two-col">
              <label class="field"><span>세부 모델</span><input id="vehicleGenerationName" type="text" value="${escapeAttr(state.forms.vehicleGenerationName)}" placeholder="Highland" /></label>
              <label class="field"><span>바디 코드</span><input id="vehicleBodyCode" type="text" value="${escapeAttr(state.forms.vehicleBodyCode)}" placeholder="M3-H" /></label>
            </div>
            <div class="two-col">
              <label class="field"><span>연식</span><input id="vehicleModelYear" type="text" value="${escapeAttr(state.forms.vehicleModelYear)}" placeholder="2024-" /></label>
              <label class="field"><span>차량 타입</span><input id="vehicleType" type="text" value="${escapeAttr(state.forms.vehicleType)}" placeholder="sedan" /></label>
            </div>
            <label class="field"><span>기본 색상</span><input id="vehicleDefaultColor" type="text" value="${escapeAttr(state.forms.vehicleDefaultColor)}" placeholder="Pearl White" /></label>
            <label class="field"><span>GLB 파일 경로</span><input id="vehicleGlbFileUrl" type="text" value="${escapeAttr(state.forms.vehicleGlbFileUrl)}" placeholder="/models/tesla/model3-highland.glb" /></label>
            <label class="checkbox-row"><input id="vehicleImageModeEnabled" type="checkbox" ${toBool(state.forms.vehicleImageModeEnabled) ? "checked" : ""} /> 2.5D 이미지/SVG 모드 사용</label>
            <label class="checkbox-row"><input id="vehicleThreeDEnabled" type="checkbox" ${toBool(state.forms.vehicleThreeDEnabled) ? "checked" : ""} /> 3D GLB 모드 사용</label>
            <button type="button" class="primary-button" data-action="saveVehicle">차량 저장</button>
          </div>
          <div class="vehicle-mesh-help">
            <h4>권장 Mesh 이름</h4>
            <p>body, hood, front_bumper, rear_bumper, front_door_left/right, rear_door_left/right, windshield_front, window_front_left/right, windshield_rear, sunroof 등을 GLB에서 사용하면 향후 3D 매핑이 쉬워집니다.</p>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderVehicleAdminRow(vehicle) {
  return `
    <button type="button" class="vehicle-admin-row ${state.forms.vehicleId === vehicle.id ? "active" : ""}" data-edit-vehicle="${escapeAttr(vehicle.id)}">
      <span>
        <strong>${escapeHtml(vehicleDisplayName(vehicle))}</strong>
        <small>${escapeHtml(vehicle.id)} · ${consultationCanUse3d(vehicle) ? "3D 사용" : "2.5D 우선"}</small>
      </span>
      <em>${escapeHtml(vehicle.body_code || vehicle.model_year || "")}</em>
    </button>
  `;
}

function renderCertificates() {
  if (!state.session) return "";
  const rows = visibleCertificates();
  const dealers = certificateDealerOptions();
  return `
    <main class="screen ${state.screen === "certificates" ? "active" : ""}" data-screen="certificates">
      <section class="page-head">
        <p class="eyebrow">${state.session.role === "admin" ? "관리자" : escapeHtml(currentDealerName())}</p>
        <h1>정품인증서 ${state.session.role === "admin" ? "관리" : "내역"}</h1>
        <p class="lead">시공완료 처리된 예약 기준으로 인증서가 자동 발급됩니다. QR은 인증페이지 진입용이며 실제 인증은 시리얼번호 입력으로만 진행됩니다.</p>
        <div class="page-actions">
          ${state.session.role === "dealer" ? `<button class="secondary-button" type="button" data-nav="reservations">예약관리</button>` : ""}
          <button class="secondary-button" type="button" data-action="refresh">새로고침</button>
        </div>
      </section>

      <section class="panel list-panel">
        <div class="filter-row">
          <input class="search-input" id="certificateQuery" type="search" placeholder="인증번호, 대리점명, 차량번호, 제품명 검색" value="${escapeAttr(state.filters.certificateQuery)}" />
          ${state.session.role === "admin" ? `
            <select id="certificateDealerCode" class="search-input">
              <option value="전체">전체 대리점</option>
              ${dealers.map((dealer) => `<option value="${escapeAttr(dealer.dealer_code)}" ${state.filters.certificateDealerCode === dealer.dealer_code ? "selected" : ""}>${escapeHtml(dealer.dealer_name)} (${escapeHtml(dealer.dealer_code)})</option>`).join("")}
            </select>
          ` : ""}
        </div>
        <div class="certificate-list" id="certificateList">
          ${rows.map(renderCertificateCard).join("") || `<div class="empty">발급된 정품인증서가 없습니다.</div>`}
        </div>
      </section>
    </main>
  `;
}

function renderCertificateCard(certificate) {
  return `
    <article class="certificate-row">
      <div>
        <span class="badge ${certificate.status === "active" ? "ok" : "warn"}">${escapeHtml(certificateStatusLabel(certificate.status))}</span>
        <h3>${escapeHtml(certificate.certificate_number)}</h3>
        <p class="product-meta">${escapeHtml(certificate.product_type || "-")} · ${escapeHtml(certificate.product_name || "-")}</p>
        <p class="product-meta">${escapeHtml(certificate.dealer_name || certificate.dealer_code || "-")} · 차량 ${escapeHtml(certificate.vehicle_number || "미입력")} · ${escapeHtml(certificate.vehicle_model || "모델 미입력")}</p>
        <p class="product-meta">시공일 ${escapeHtml(formatDateOnly(certificate.installation_date) || "-")} · 발급일 ${escapeHtml(formatDateOnly(certificate.issued_at) || "-")} · 인증조회 ${Number(certificate.verified_count || 0)}회</p>
      </div>
      <div class="account-actions">
        <button type="button" class="primary-button small-button" data-certificate-print="${escapeAttr(certificate.id)}">정품인증서 인쇄</button>
      </div>
    </article>
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
        <span class="color-dot" style="background:${escapeAttr(validHexColor(product.color_hex, colorHex(product.color || product.product_name)))}"></span>
        <span>
          <span class="product-name">${escapeHtml(product.product_name)}</span>
          <span class="product-meta">${escapeHtml(productBrandText(product))} · ${escapeHtml(product.sku)} · ${escapeHtml(product.category || "")} · ${toBool(product.is_active) ? "판매중" : "중지"}</span>
          <span class="product-meta">${escapeHtml(productMetaText(product))}</span>
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
  const certificate = certificateForReservation(reservation.reservation_id);
  const canPrintCertificate = reservation.status === "시공완료" && certificate;
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
        <p class="product-meta">차량: ${escapeHtml(reservation.vehicle_number || "미입력")} · ${escapeHtml(reservation.vehicle_model || "모델 미입력")}</p>
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
      ${canPrintCertificate ? `
        <div class="order-actions">
          <button type="button" class="label-print-button" data-certificate-print="${escapeAttr(certificate.id)}">정품인증서 인쇄</button>
        </div>
      ` : reservation.status === "시공완료" ? `<p class="product-meta">정품인증서가 아직 동기화되지 않았습니다. 새로고침 후 확인해 주세요.</p>` : ""}
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
        ["consultation", "상담"],
        ["vehicleAdmin", "차량"],
        ["certificates", "인증서"],
        ["dealers", "대리점"],
        ["dealerInfo", "정보"],
        ["links", "QR"],
        ["notifications", "알림"],
        ["labelSettings", "라벨"]
      ]
    : [
        ["inventory", "재고"],
        ["inventoryManage", "재고수정"],
        ["orderCreate", "발주신청"],
        ["orders", "내 발주"],
        ["reservations", "예약"],
        ["consultation", "상담"],
        ["certificates", "인증서"],
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
  bindInput("reservationVehicleNumber", (value) => (state.forms.reservationVehicleNumber = value));
  bindInput("reservationVehicleModel", (value) => (state.forms.reservationVehicleModel = value));
  bindInput("reservationDate", (value) => (state.forms.reservationDate = value || dateInputValue()));
  bindInput("reservationQty", (value) => {
    state.forms.reservationQty = Number(value || 0);
    refreshReservationStockPanel();
  });
  bindInput("reservationMemo", (value) => (state.forms.reservationMemo = value));
  bindInput("consultationCustomerName", (value) => (state.consultation.customerName = value));
  bindPhoneInput("consultationCustomerPhone", (value) => (state.consultation.customerPhone = value));
  bindInput("consultationMemo", (value) => (state.consultation.memo = value));
  bindInput("verifySerial", (value) => {
    state.forms.verifySerial = normalizeCertificateNumberInput(value);
    state.verification.error = "";
    state.verification.result = null;
  });
  bindInput("productSku", (value) => (state.forms.productSku = value.trim()));
  bindInput("productName", (value) => (state.forms.productName = value));
  bindInput("productBrand", (value) => (state.forms.productBrand = value));
  bindInput("productColorName", (value) => (state.forms.productColorName = value));
  bindInput("productColorHex", (value) => {
    state.forms.productColorHex = value;
    syncProductHexInputs();
  });
  bindInput("productColorHexText", (value) => {
    state.forms.productColorHex = value;
    syncProductHexInputs();
  });
  bindInput("productColorChartImageUrl", (value) => (state.forms.productColorChartImageUrl = value));
  bindInput("productOpacity", (value) => (state.forms.productOpacity = clampNullableNumber(value, 0, 100, 0)));
  bindInput("productShadePercent", (value) => (state.forms.productShadePercent = clampNullableNumber(value, 0, 100, 35)));
  bindInput("productDescription", (value) => (state.forms.productDescription = value));
  bindInput("productUnit", (value) => (state.forms.productUnit = value));
  bindInput("productRetailPrice", (value) => (state.forms.productRetailPrice = Number(value || 0)));
  bindInput("productPurchasePrice", (value) => (state.forms.productPurchasePrice = Number(value || 0)));
  bindInput("productManageQuery", (value) => {
    state.filters.productManageQuery = value;
    refreshProductManageRows();
  });
  bindInput("consultationTintProductQuery", (value) => {
    state.consultation.tintProductQuery = value;
    refreshConsultationProductList("tint");
  });
  bindInput("consultationPpfProductQuery", (value) => {
    state.consultation.ppfProductQuery = value;
    refreshConsultationProductList("ppf");
  });
  bindInput("vehicleId", (value) => (state.forms.vehicleId = value.trim()));
  bindInput("vehicleBrand", (value) => (state.forms.vehicleBrand = value));
  bindInput("vehicleModelName", (value) => (state.forms.vehicleModelName = value));
  bindInput("vehicleGenerationName", (value) => (state.forms.vehicleGenerationName = value));
  bindInput("vehicleBodyCode", (value) => (state.forms.vehicleBodyCode = value));
  bindInput("vehicleModelYear", (value) => (state.forms.vehicleModelYear = value));
  bindInput("vehicleType", (value) => (state.forms.vehicleType = value));
  bindInput("vehicleDefaultColor", (value) => (state.forms.vehicleDefaultColor = value));
  bindInput("vehicleGlbFileUrl", (value) => (state.forms.vehicleGlbFileUrl = value));
  labelCalibrationFields.forEach((field) => {
    bindInput(`labelCal_${field.id}`, (value) => {
      state.labelCalibration[field.id] = calibrationNumber(value, field.defaultValue);
      syncLabelOverlayCalibration();
      refreshLabelPreview();
    });
  });
  bindInput("labelPreviewZoom", (value) => {
    state.forms.labelPreviewZoom = Math.min(1.6, Math.max(0.6, calibrationNumber(value, 1)));
    refreshLabelPreviewZoom();
  });

  document.querySelectorAll("[data-label-step]").forEach((button) => {
    button.addEventListener("click", () => {
      adjustLabelCalibration(button.dataset.labelStep, Number(button.dataset.step || 0));
      const input = document.querySelector(`#labelCal_${button.dataset.labelStep}`);
      if (input) input.value = formatCalibrationNumber(labelCalibrationValue(button.dataset.labelStep));
      refreshLabelPreview();
    });
  });

  ["Background", "Guides", "OutputArea"].forEach((name) => {
    document.querySelector(`#labelPreview${name}`)?.addEventListener("change", (event) => {
      state.forms[`labelPreview${name}`] = event.target.checked;
      refreshLabelPreview();
    });
  });

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
    render();
  });

  document.querySelector("#productFinishType")?.addEventListener("change", (event) => {
    state.forms.productFinishType = event.target.value;
  });

  document.querySelector("#productTransparencyType")?.addEventListener("change", (event) => {
    state.forms.productTransparencyType = event.target.value;
  });

  document.querySelector("#productColorChartFile")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.forms.productColorChartImageUrl = String(reader.result || "");
      render();
    };
    reader.readAsDataURL(file);
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

  document.querySelector("#vehicleImageModeEnabled")?.addEventListener("change", (event) => {
    state.forms.vehicleImageModeEnabled = event.target.checked;
  });

  document.querySelector("#vehicleThreeDEnabled")?.addEventListener("change", (event) => {
    state.forms.vehicleThreeDEnabled = event.target.checked;
  });

  bindSearchInput("inventoryQuery", (value) => {
    state.filters.inventoryQuery = value;
    state.filters.inventoryPage = 1;
  });
  bindSearchInput("orderQuery", (value) => (state.filters.orderQuery = value));
  bindSearchInput("salesQuery", (value) => (state.filters.salesQuery = value));
  bindSearchInput("certificateQuery", (value) => (state.filters.certificateQuery = value));
  bindSearchInput("consultationQuery", (value) => (state.filters.consultationQuery = value));

  document.querySelector("#orderStatus")?.addEventListener("change", (event) => {
    state.filters.orderStatus = event.target.value;
    render();
  });

  document.querySelector("#labelSize")?.addEventListener("change", (event) => {
    state.forms.labelSize = event.target.value;
  });

  document.querySelector("#certificateDealerCode")?.addEventListener("change", (event) => {
    state.filters.certificateDealerCode = event.target.value;
    render();
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

function bindConsultationProductSearchInputs(root = document) {
  root.querySelector("#consultationTintProductQuery")?.addEventListener("input", (event) => {
    state.consultation.tintProductQuery = event.target.value;
    refreshConsultationProductList("tint");
  });
  root.querySelector("#consultationPpfProductQuery")?.addEventListener("input", (event) => {
    state.consultation.ppfProductQuery = event.target.value;
    refreshConsultationProductList("ppf");
  });
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

  root.querySelectorAll("[data-certificate-print]").forEach((button) => {
    button.addEventListener("click", () => {
      runWithButtonBusy(button, () => printCertificate(button.dataset.certificatePrint));
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

  root.querySelectorAll("[data-consultation-model]").forEach((button) => {
    button.addEventListener("click", () => {
      selectConsultationModel(button.dataset.consultationModel);
      render();
    });
  });

  root.querySelectorAll("[data-consultation-vehicle]").forEach((button) => {
    button.addEventListener("click", () => {
      state.consultation.vehicleId = button.dataset.consultationVehicle;
      const vehicle = selectedConsultationVehicle();
      state.consultation.color = vehicle?.default_color || state.consultation.color;
      render();
    });
  });

  root.querySelectorAll("[data-consultation-color]").forEach((button) => {
    button.addEventListener("click", () => {
      state.consultation.color = button.dataset.consultationColor;
      render();
    });
  });

  root.querySelectorAll("[data-consultation-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.consultation.view = button.dataset.consultationView;
      render();
    });
  });

  root.querySelectorAll("[data-consultation-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.consultation.renderMode = button.dataset.consultationMode;
      render();
    });
  });

  root.querySelectorAll("[data-consultation-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.consultationProductType;
      const product = state.products.find((item) => item.sku === button.dataset.consultationProduct);
      if (type === "tint") {
        state.consultation.tintEnabled = true;
        state.consultation.tintSku = button.dataset.consultationProduct;
        applyConsultationProductToSelectedPart(product, "tint");
      }
      if (type === "ppf") {
        state.consultation.ppfEnabled = true;
        state.consultation.ppfSku = button.dataset.consultationProduct;
        syncAppliedPpfProduct(product);
        if (state.consultation.selectedCategory === "body" && state.consultation.selectedPartId) {
          applyConsultationProductToSelectedPart(product, "ppf");
        } else {
          showToast("PPF 제품이 선택되었습니다. 차체 부위를 클릭하면 적용됩니다.");
        }
      }
      refreshConsultationAfterOptionChange(type);
    });
  });

  root.querySelectorAll("[data-consultation-no-product]").forEach((button) => {
    button.addEventListener("click", () => {
      setConsultationNoProduct(button.dataset.consultationNoProduct);
      refreshConsultationAfterOptionChange(button.dataset.consultationNoProduct);
    });
  });

  root.querySelectorAll("[data-consultation-tint-target]").forEach((button) => {
    button.addEventListener("click", () => {
      state.consultation.tintTarget = button.dataset.consultationTintTarget || "frontGlass";
      state.consultation.tintFilter = "전체";
      const canonical = canonicalGlassPartFromLegacy(state.consultation.tintTarget);
      state.consultation.selectedPartId = canonical;
      state.consultation.selectedCategory = "glass";
      refreshConsultationAfterOptionChange("tint");
    });
  });

  root.querySelectorAll("[data-consultation-target-part]").forEach((target) => {
    target.addEventListener("click", (event) => {
      if (event.target.closest("[data-remove-application]")) return;
      event.stopPropagation();
      selectConsultationTargetPart(target.dataset.consultationTargetPart, target.dataset.consultationTargetCategory);
    });
    target.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      selectConsultationTargetPart(target.dataset.consultationTargetPart, target.dataset.consultationTargetCategory);
    });
  });

  root.querySelectorAll("[data-consultation-product-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.consultationProductFilter;
      if (type === "tint") {
        state.consultation.tintFilter = button.dataset.filterValue || "전체";
        if (state.consultation.tintFilter.startsWith("part:")) {
          state.consultation.tintTarget = state.consultation.tintFilter.replace("part:", "");
        }
      }
      if (type === "ppf") state.consultation.ppfFilter = button.dataset.filterValue || "전체";
      refreshConsultationProductStep(type);
    });
  });

  root.querySelectorAll("[data-consultation-tint-area]").forEach((button) => {
    button.addEventListener("click", () => {
      const area = button.dataset.consultationTintArea;
      const tintStrength = Number(button.dataset.tintStrength ?? 0);
      if (!area || !Number.isFinite(tintStrength)) return;
      state.consultation.tintAreas = {
        ...consultationTintAreas(),
        [area]: tintStrength
      };
      render();
    });
  });

  root.querySelectorAll("[data-consultation-part]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleConsultationPpfPart(button.dataset.consultationPart);
      refreshConsultationAfterOptionChange("ppf");
    });
  });

  root.querySelectorAll("[data-remove-application]").forEach((button) => {
    button.addEventListener("click", () => {
      removeConsultationApplication(button.dataset.removeApplication, button.dataset.removeCategory);
      refreshConsultationAfterOptionChange(button.dataset.removeCategory === "TINTING" ? "tint" : "ppf");
    });
  });

  root.querySelectorAll("[data-edit-vehicle]").forEach((button) => {
    button.addEventListener("click", () => {
      selectVehicleForEdit(button.dataset.editVehicle);
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
    return;
  }

  if (state.screen === "certificates") {
    replaceHtml("#certificateList", visibleCertificates().map(renderCertificateCard).join("") || `<div class="empty">발급된 정품인증서가 없습니다.</div>`);
    return;
  }

  if (state.screen === "consultation") {
    replaceHtml("#consultationRows", visibleConsultations().slice(0, 4).map(renderConsultationHistoryCard).join("") || `<div class="empty">저장된 상담 내역이 없습니다.</div>`);
  }
}

function replaceHtml(selector, html) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.innerHTML = html;
  bindDynamicListEvents(target);
  bindConsultationProductSearchInputs(target);
}

function replaceElementHtml(selector, html) {
  const target = document.querySelector(selector);
  if (!target) return;
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const next = template.content.firstElementChild;
  if (!next) return;
  target.replaceWith(next);
  bindDynamicListEvents(next);
  bindConsultationProductSearchInputs(next);
}

function refreshProductManageRows() {
  replaceHtml("#productManageRows", productManageRows().slice(0, 60).map(renderProductManageRow).join("") || `<div class="empty">등록된 제품이 없습니다.</div>`);
}

function refreshConsultationProductList(type) {
  const enabled = type === "tint" ? state.consultation.tintEnabled !== false : state.consultation.ppfEnabled !== false;
  const query = type === "tint" ? state.consultation.tintProductQuery : state.consultation.ppfProductQuery;
  const hasQuery = normalize(query).length > 0;
  const products = hasQuery ? consultationFilteredProducts(type).slice(0, 8) : [];
  const selector = type === "tint" ? "#consultationTintProductList" : "#consultationPpfProductList";
  replaceHtml(
    selector,
    `${renderNoProductOption(type, enabled)}${renderConsultationProductResults(type, products, hasQuery)}`
  );
}

function refreshConsultationProductStep(type) {
  const selector = type === "tint" ? "#consultationTintProductStep" : "#consultationPpfProductStep";
  replaceElementHtml(selector, renderConsultationProductStep(type));
}

function refreshConsultationAfterOptionChange(type) {
  replaceHtml("#consultationProductControlsMount", renderConsultationProductControls());
  replaceHtml("#consultationTintAreaMount", renderConsultationTintAreaControls());
  replaceHtml("#consultationPartMount", renderConsultationPartControls());
  replaceHtml("#consultationAppliedPartsMount", renderConsultationAppliedParts());
  replaceHtml("#consultationQuoteMount", renderConsultationQuotePanel(consultationQuote()));
  refreshConsultation3dRuntimeVisuals();
}

async function initConsultation3dViewer() {
  const container = document.querySelector("#consultation3dViewer");
  if (!container || state.screen !== "consultation" || state.consultation.renderMode !== "3d") {
    disposeConsultation3dViewer();
    return;
  }

  const glbUrl = container.dataset.glbUrl || "";
  const environmentUrl = container.dataset.envUrl || publicAssetUrl(showroomEnvironmentPath);
  const vehicleId = container.dataset.vehicleId || selectedConsultationVehicle()?.id || "";
  const key = [
    glbUrl,
    environmentUrl,
    vehicleId,
    state.consultation.color,
    state.consultation.view,
    state.consultation.tintEnabled,
    state.consultation.tintSku,
    JSON.stringify(consultationTintAreas()),
    state.consultation.ppfEnabled,
    state.consultation.ppfSku,
    (state.consultation.ppfParts || []).join(","),
    JSON.stringify(consultationApplications())
  ].join("|");
  if (consultation3dRuntime?.container === container && consultation3dRuntime?.key === key) return;
  disposeConsultation3dViewer();

  if (!glbUrl) {
    showConsultation3dError(container, "등록된 GLB 파일 경로가 없습니다. 차량/3D 관리에서 파일 경로를 입력해 주세요.");
    return;
  }

  try {
    container.classList.add("is-loading");
    const modules = await loadThreeModules();
    if (!document.body.contains(container)) return;
    mountConsultation3dViewer(container, modules, glbUrl, environmentUrl, key);
  } catch (error) {
    showConsultation3dError(container, error.message || "3D 뷰어 모듈을 불러오지 못했습니다.");
  }
}

function loadThreeModules() {
  if (!consultation3dModulesPromise) {
    consultation3dModulesPromise = Promise.all([
      import(threeModuleUrls.core),
      import(threeModuleUrls.gltfLoader),
      import(threeModuleUrls.orbitControls)
    ]).then(([THREE, loaderModule, controlsModule]) => ({
      THREE,
      GLTFLoader: loaderModule.GLTFLoader,
      OrbitControls: controlsModule.OrbitControls
    }));
  }
  return consultation3dModulesPromise;
}

function mountConsultation3dViewer(container, modules, glbUrl, environmentUrl, key) {
  const { THREE, GLTFLoader, OrbitControls } = modules;
  const mobile = isMobileViewport();
  const host = document.createElement("div");
  host.className = "consultation-3d-canvas";
  container.prepend(host);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 1000);
  const renderer = new THREE.WebGLRenderer({
    antialias: !mobile,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? consultationRenderSettings.mobilePixelRatio : consultationRenderSettings.desktopPixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = mobile ? 0.95 : 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const environmentTexture = loadShowroomEnvironment(THREE, scene, renderer, environmentUrl);
  if (environmentTexture) container.classList.add("has-showroom");

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 1.2;
  controls.maxDistance = 8;

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111111, mobile ? 0.95 : 1.15);
  scene.add(hemiLight);
  const keyLight = new THREE.DirectionalLight(0xffffff, mobile ? 1.5 : 1.9);
  keyLight.position.set(4, 5, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  keyLight.shadow.radius = 4;
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
  rimLight.position.set(-4, 2.5, -3);
  scene.add(rimLight);

  const showroomFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    createShowroomFloorMaterial(THREE)
  );
  showroomFloor.rotation.x = -Math.PI / 2;
  showroomFloor.position.y = -0.018;
  showroomFloor.receiveShadow = true;
  scene.add(showroomFloor);

  const floorShadow = new THREE.Mesh(
    new THREE.CircleGeometry(4.8, 96),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: mobile ? 0.17 : 0.22 })
  );
  floorShadow.rotation.x = -Math.PI / 2;
  floorShadow.position.y = -0.01;
  floorShadow.receiveShadow = true;
  scene.add(floorShadow);

  const setSize = () => {
    const width = Math.max(320, host.clientWidth || container.clientWidth || 720);
    const height = Math.max(300, host.clientHeight || container.clientHeight || 460);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  let animationFrame = 0;
  let model = null;
  let disposeInteractions = () => {};
  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(animate);
  };

  const loader = new GLTFLoader();
  loader.load(
    glbUrl,
    (gltf) => {
      if (!document.body.contains(container)) return;
      model = gltf.scene;
      prepareConsultationModel(THREE, model, container.dataset.vehicleId || "");
      applyConsultation3dMaterials(THREE, model, container.dataset.vehicleId || "");
      scene.add(model);
      setSize();
      frameConsultationModel(THREE, camera, controls, model, container.dataset.view || state.consultation.view);
      disposeInteractions = bindConsultation3dPartInteractions(THREE, camera, renderer, model, container.dataset.vehicleId || "");
      container.classList.remove("is-loading");
      container.classList.add("is-ready");
      const loaderNode = container.querySelector(".consultation-3d-loader");
      if (loaderNode) loaderNode.remove();
      animate();
    },
    undefined,
    (error) => {
      showConsultation3dError(container, `GLB 파일을 불러오지 못했습니다: ${error.message || glbUrl}`);
    }
  );

  window.addEventListener("resize", setSize);
  setSize();
  consultation3dRuntime = {
    key,
    container,
    THREE,
    vehicleId: container.dataset.vehicleId || "",
    scene,
    renderer,
    controls,
    get model() {
      return model;
    },
    animationFrame,
    dispose() {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", setSize);
      disposeInteractions();
      controls.dispose();
      environmentTexture?.dispose?.();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
        materials.forEach((material) => {
          ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "alphaMap"].forEach((key) => material[key]?.dispose?.());
          material.dispose?.();
        });
      });
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}

function loadShowroomEnvironment(THREE, scene, renderer, environmentUrl) {
  if (!environmentUrl) return null;
  const mobile = isMobileViewport();
  applyShowroomEnvironmentTransform(THREE, scene);
  const texture = new THREE.TextureLoader().load(
    environmentUrl,
    (loadedTexture) => {
      loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1);
      scene.environment = loadedTexture;
      scene.background = loadedTexture;
      scene.backgroundIntensity = mobile ? consultationRenderSettings.mobileBackgroundIntensity : consultationRenderSettings.backgroundIntensity;
      scene.backgroundBlurriness = mobile ? consultationRenderSettings.mobileBackgroundBlurriness : consultationRenderSettings.backgroundBlurriness;
      scene.environmentIntensity = mobile ? 1.05 : 1.28;
      applyShowroomEnvironmentTransform(THREE, scene);
    },
    undefined,
    () => {
      scene.background = new THREE.Color(0xf4f6fb);
    }
  );
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  scene.environment = texture;
  scene.background = texture;
  scene.backgroundIntensity = mobile ? consultationRenderSettings.mobileBackgroundIntensity : consultationRenderSettings.backgroundIntensity;
  scene.backgroundBlurriness = mobile ? consultationRenderSettings.mobileBackgroundBlurriness : consultationRenderSettings.backgroundBlurriness;
  scene.environmentIntensity = mobile ? 1.05 : 1.28;
  return texture;
}

function applyShowroomEnvironmentTransform(THREE, scene) {
  const rotation = new THREE.Euler(0, consultationRenderSettings.showroomRotationY, 0);
  scene.backgroundRotation = rotation;
  scene.environmentRotation = rotation;
}

function createShowroomFloorMaterial(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  context.fillStyle = "#eef2f6";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(76, 84, 96, 0.16)";
  context.lineWidth = 1.4;
  const seededWave = (seed, scale = 1) => {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return (value - Math.floor(value)) * scale;
  };
  for (let index = 0; index < 18; index += 1) {
    context.beginPath();
    const startX = seededWave(index + 1, canvas.width);
    const startY = seededWave(index + 21, canvas.height);
    context.moveTo(startX, startY);
    context.bezierCurveTo(
      startX + seededWave(index + 41, 180) - 90,
      startY + seededWave(index + 61, 120) - 60,
      startX + seededWave(index + 81, 220) - 110,
      startY + seededWave(index + 101, 180) - 90,
      startX + seededWave(index + 121, 260) - 130,
      startY + seededWave(index + 141, 220) - 110
    );
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshPhysicalMaterial({
    color: 0xf7f8fb,
    map: texture,
    roughness: 0.24,
    metalness: 0.06,
    clearcoat: 0.65,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.9,
    transparent: true,
    opacity: 0.46,
    depthWrite: false
  });
}

function disposeConsultation3dViewer() {
  if (!consultation3dRuntime) return;
  disposeAllConsultationPpfOverlays();
  consultation3dRuntime.dispose();
  consultation3dRuntime = null;
  consultationOriginalMaterials.clear();
  consultationGlassMeshGroupMap.clear();
  consultationOriginalGlassMaterials.clear();
}

function refreshConsultation3dRuntimeVisuals() {
  const runtime = consultation3dRuntime;
  if (!runtime?.model || !runtime?.THREE || !document.body.contains(runtime.container)) return;
  cleanupConsultation3dHelpers(runtime);
  applyConsultation3dMaterials(runtime.THREE, runtime.model, runtime.vehicleId || "");
}

function cleanupConsultation3dHelpers(runtime) {
  const removable = [];
  runtime.scene.traverse((object) => {
    if (
      String(object.name || "").startsWith("consultation_mesh_highlight_")
      || String(object.name || "").startsWith("consultation_ppf_overlay_")
      || String(object.name || "").startsWith("consultation_ppf_edge_")
    ) {
      removable.push(object);
    }
  });
  removable.forEach((object) => {
    object.parent?.remove(object);
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
    materials.forEach((material) => material.dispose?.());
  });
}

function showConsultation3dError(container, message) {
  container.classList.remove("is-loading");
  container.classList.add("has-error");
  const loader = container.querySelector(".consultation-3d-loader") || container;
  loader.innerHTML = `
    <span class="badge danger">3D 로딩 실패</span>
    <h2>2.5D 화면으로 전환해 주세요</h2>
    <p>${escapeHtml(message)}</p>
    <button type="button" class="secondary-button" data-consultation-mode="image">2.5D로 보기</button>
  `;
  loader.querySelector("[data-consultation-mode]")?.addEventListener("click", () => {
    state.consultation.renderMode = "image";
    render();
  });
}

function prepareConsultationModel(THREE, model, vehicleId = "") {
  consultationGlassMeshGroupMap.clear();
  consultationOriginalGlassMaterials.clear();
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    if (object.material) object.material = cloneThreeMaterial(object.material);
    const meshInfo = consultationMeshInfo(object, vehicleId);
    if (meshInfo.tintAreas?.length) {
      const glassPartId = meshInfo.tintAreas[0];
      object.userData.category = "glass";
      object.userData.partId = glassPartId;
      object.userData.glassPartId = glassPartId;
      registerConsultationGlassMesh(object, glassPartId);
    } else if (meshInfo.ppfParts?.length) {
      object.userData.category = "body";
      object.userData.partId = meshInfo.ppfParts[0];
    }
  });
}

function registerConsultationGlassMesh(mesh, glassPartId) {
  if (!mesh?.uuid || !glassPartId) return;
  if (!consultationOriginalGlassMaterials.has(mesh.uuid)) {
    consultationOriginalGlassMaterials.set(mesh.uuid, cloneThreeMaterial(mesh.material));
  }
  const group = consultationGlassMeshGroupMap.get(glassPartId) || [];
  if (!group.includes(mesh)) group.push(mesh);
  consultationGlassMeshGroupMap.set(glassPartId, group);
}

function bindConsultation3dPartInteractions(THREE, camera, renderer, model, vehicleId = "") {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hoverTarget = null;

  const resolveIntersections = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(model.children, true)
      .map((hit) => hit.object)
      .find((object) => resolveConsultationPartFromMesh(object, vehicleId));
  };

  const clearHover = () => {
    hoverTarget = null;
    renderer.domElement.style.cursor = "";
  };

  const showHover = (object) => {
    if (!object || object === hoverTarget) return;
    hoverTarget = object;
    renderer.domElement.style.cursor = "pointer";
  };

  const onMove = (event) => {
    const object = resolveIntersections(event);
    if (object) showHover(object);
    else clearHover();
  };

  const onLeave = () => clearHover();
  const onClick = (event) => {
    const object = resolveIntersections(event);
    if (!object) return;
    const part = resolveConsultationPartFromMesh(object, vehicleId);
    if (!part) return;
    handleConsultationPartClick(part);
  };

  renderer.domElement.addEventListener("pointermove", onMove);
  renderer.domElement.addEventListener("pointerleave", onLeave);
  renderer.domElement.addEventListener("click", onClick);
  return () => {
    clearHover();
    renderer.domElement.removeEventListener("pointermove", onMove);
    renderer.domElement.removeEventListener("pointerleave", onLeave);
    renderer.domElement.removeEventListener("click", onClick);
  };
}

function cloneThreeMaterial(material) {
  if (Array.isArray(material)) return material.map((item) => item.clone());
  return material.clone();
}

function isMobileViewport() {
  return window.matchMedia?.("(max-width: 759px), (pointer: coarse)")?.matches || window.innerWidth < 760;
}

function isDevelopmentRuntime() {
  const debugFlag = String(config.debugMode ?? config.debugTintMaterial ?? "").toLowerCase();
  return debugFlag === "true" || ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

function applyConsultation3dMaterials(THREE, model, vehicleId = "") {
  const bodyColor = new THREE.Color(vehicleColorByName(state.consultation.color).hex);
  const appliedPpfMap = consultationAppliedPpfMap();
  const appliedTintMap = consultationAppliedTintMap();
  const selectedPpfParts = new Set(Object.keys(appliedPpfMap).filter((partId) => appliedPpfMap[partId]));
  disposeAllConsultationPpfOverlays();
  model.traverse((object) => {
    if (object.userData?.isPpfOverlay) return;
    if (!object.isMesh || !object.material) return;
    storeConsultationOriginalMaterial(object);
    restoreConsultationBaseMaterial(object);
    const meshInfo = consultationMeshInfo(object, vehicleId);
    const appliedTintPart = meshInfo.tintAreas?.find((partId) => appliedTintMap[partId]);
    if (appliedTintPart) {
      applyConsultationTintMaterialToMesh(THREE, object, appliedTintMap[appliedTintPart]);
      return;
    }
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (meshInfo.isGlass) {
        material.transparent = true;
        material.opacity = 0.32;
        material.color = new THREE.Color("#9fb0bb");
        material.roughness = 0.04;
        material.metalness = 0.08;
        material.envMapIntensity = consultationRenderSettings.glassEnvMapIntensity;
        material.depthWrite = false;
        material.needsUpdate = true;
        return;
      }
      if (meshInfo.isBody) {
        material.color = bodyColor.clone();
        material.roughness = 0.22;
        material.metalness = 0.34;
        material.clearcoat = 1;
        material.clearcoatRoughness = 0.1;
        material.envMapIntensity = consultationRenderSettings.bodyEnvMapIntensity;
      }
      material.needsUpdate = true;
    });
    const appliedPpfPart = meshInfo.ppfParts?.find((partId) => selectedPpfParts.has(partId));
    if (appliedPpfPart) {
      const product = appliedPpfMap[appliedPpfPart];
      createConsultationPpfOverlay(THREE, object, product, appliedPpfPart);
    }
  });
}

function storeConsultationOriginalMaterial(object) {
  if (!object?.uuid || consultationOriginalMaterials.has(object.uuid)) return;
  consultationOriginalMaterials.set(object.uuid, cloneThreeMaterial(object.material));
}

function restoreConsultationBaseMaterial(object) {
  const original = consultationOriginalMaterials.get(object.uuid);
  if (!original) return;
  if (!isConsultationAppliedMaterial(object.material)) return;
  disposeObjectMaterial(object.material);
  object.material = cloneThreeMaterial(original);
}

function isConsultationAppliedMaterial(material) {
  const materials = Array.isArray(material) ? material : material ? [material] : [];
  return materials.some((item) => ["ppf", "tint"].includes(item?.userData?.consultationMaterialKind));
}

function disposeObjectMaterial(material) {
  const materials = Array.isArray(material) ? material : material ? [material] : [];
  materials.forEach((item) => item?.dispose?.());
}

function disposeAllConsultationPpfOverlays() {
  Array.from(consultationPpfOverlayMap.keys()).forEach((partId) => removeConsultationPpfOverlay(partId));
  consultationPpfOverlayMap.clear();
}

function removeConsultationPpfOverlay(partId) {
  const overlays = consultationPpfOverlayMap.get(partId);
  const list = Array.isArray(overlays) ? overlays : overlays ? [overlays] : [];
  list.forEach((overlay) => {
    overlay.parent?.remove(overlay);
    overlay.geometry?.dispose?.();
    disposeObjectMaterial(overlay.material);
  });
  consultationPpfOverlayMap.delete(partId);
}

function restoreConsultationGlassGroup(glassPartId) {
  const meshes = consultationGlassMeshGroupMap.get(glassPartId) || [];
  meshes.forEach((mesh) => {
    const original = consultationOriginalGlassMaterials.get(mesh.uuid) || consultationOriginalMaterials.get(mesh.uuid);
    if (!original) return;
    disposeObjectMaterial(mesh.material);
    mesh.material = cloneThreeMaterial(original);
  });
}

function createConsultationPpfOverlay(THREE, originalMesh, product, partId) {
  if (!originalMesh?.geometry || !product || !partId) return null;
  const material = createConsultationPpfMaterial(THREE, product);
  material.userData.consultationMaterialKind = "ppfOverlay";
  const overlay = originalMesh.clone(false);
  overlay.geometry = originalMesh.geometry.clone();
  overlay.material = material;
  overlay.name = `${originalMesh.name || partId}_ppf_overlay`;
  overlay.scale.multiplyScalar(1.001);
  overlay.userData.isPpfOverlay = true;
  overlay.userData.category = "ppfOverlay";
  overlay.userData.sourcePartId = partId;
  overlay.renderOrder = 10;
  overlay.castShadow = false;
  overlay.receiveShadow = false;
  overlay.raycast = () => {};
  originalMesh.parent?.add(overlay);
  const overlays = consultationPpfOverlayMap.get(partId) || [];
  overlays.push(overlay);
  consultationPpfOverlayMap.set(partId, overlays);
  return overlay;
}

function createConsultationPpfMaterial(THREE, product) {
  const style = consultationPpfMaterialStyle(product);
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(style.colorHex),
    emissive: new THREE.Color(style.colorHex),
    emissiveIntensity: style.emissiveIntensity,
    transparent: style.opacity < 1,
    opacity: style.opacity,
    metalness: style.metalness,
    roughness: style.roughness,
    clearcoat: style.clearcoat,
    clearcoatRoughness: style.clearcoatRoughness,
    envMapIntensity: style.envMapIntensity,
    depthWrite: style.opacity >= 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    side: THREE.FrontSide,
    wireframe: false,
    toneMapped: false
  });
}

function applyConsultationTintMaterialToMesh(THREE, object, product) {
  if (!object?.material || !product) return;
  storeConsultationOriginalMaterial(object);
  const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
  disposeObjectMaterial(object.material);
  const baseMaterial = createConsultationTintMaterial(THREE, product);
  const nextMaterials = sourceMaterials.map(() => baseMaterial.clone());
  nextMaterials.forEach((material) => {
    material.userData.consultationMaterialKind = "tint";
    material.needsUpdate = true;
  });
  object.material = Array.isArray(object.material) ? nextMaterials : nextMaterials[0];
  baseMaterial.dispose?.();
}

function createConsultationTintMaterial(THREE, product) {
  const colorHex = normalizeHexColor(product?.colorHex ?? product?.color_hex, "#111111");
  const tintStrength = productTintStrength(product);
  const transparencyPercent = productTransparencyPercent(product);
  const opacity = transparencyPercent / 100;
  const tintFactor = tintStrength / 100;
  const isMatte = product?.finishType === "matte" || product?.finish_type === "matte";
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colorHex),
    transparent: opacity < 1,
    opacity,
    transmission: 1 - tintFactor,
    roughness: isMatte ? 0.45 : 0.05,
    metalness: 0,
    clearcoat: isMatte ? 0.2 : 1,
    clearcoatRoughness: isMatte ? 0.35 : 0.02,
    envMapIntensity: consultationRenderSettings.glassEnvMapIntensity,
    depthWrite: true,
    depthTest: true,
    side: THREE.FrontSide,
    wireframe: false
  });
  material.userData.productColorHex = colorHex;
  material.userData.tintStrength = tintStrength;
  material.userData.transparencyPercent = transparencyPercent;
  if (isDevelopmentRuntime()) {
    console.log("TINT PRODUCT COLOR:", product?.colorHex ?? product?.color_hex);
    console.log("NORMALIZED TINT COLOR:", colorHex);
    console.log("TINT STRENGTH:", tintStrength);
    console.log("TRANSPARENCY PERCENT:", transparencyPercent);
    console.log("TINT OPACITY:", opacity);
    console.log("MATERIAL COLOR:", material.color.getHexString());
  }
  return material;
}

function consultationTintColor(THREE, product) {
  return new THREE.Color(normalizeHexColor(product?.colorHex ?? product?.color_hex, "#111111"));
}

function consultationTintReflectivity(product) {
  const text = normalize([productDisplayName(product), product?.sku, product?.color].filter(Boolean).join(" "));
  if (text.includes("반사") || text.includes("reflect") || text.includes("metal")) return 0.45;
  return 0.18;
}

function consultationPpfVisualStyle(product) {
  const style = consultationPpfMaterialStyle(product);
  return {
    tint: style.colorHex,
    emissive: style.colorHex,
    opacity: style.opacity,
    mix: style.opacity,
    roughness: style.roughness,
    metalness: style.metalness,
    clearcoat: style.clearcoat,
    clearcoatRoughness: style.clearcoatRoughness,
    envMapIntensity: style.envMapIntensity,
    emissiveIntensity: style.emissiveIntensity
  };
}

function consultationPpfMaterialStyle(product) {
  const colorHex = normalizeHexColor(product?.colorHex ?? product?.color_hex, "#f7fbf9");
  const finishType = normalizePpfFinishType(productPpfFinishType(product));
  const transparencyType = normalizePpfTransparencyType(product?.transparencyType || product?.transparency_type);
  const opacityPercent = Number(product?.opacityPercent ?? product?.opacity_percent ?? product?.opacity ?? 0);
  const opacity = ppfOpacityFromProduct(transparencyType, opacityPercent);
  const preset = ppfFinishMaterialPreset(finishType);
  return {
    colorHex,
    finishType,
    transparencyType,
    opacity,
    ...preset,
    emissiveIntensity: preset.emissiveIntensity * opacity
  };
}

function productPpfFinishType(product) {
  const explicitValue = product?.finishType ?? product?.finish_type;
  if (explicitValue !== null && explicitValue !== undefined && String(explicitValue).trim()) return explicitValue;
  const text = normalize([
    product?.product_name,
    product?.name,
    product?.color_name,
    product?.color,
    product?.sku
  ].filter(Boolean).join(" "));
  if (text.includes("반무광") || text.includes("semi")) return "semi_matte";
  if (text.includes("사틴") || text.includes("satin")) return "satin";
  if (text.includes("무광") || text.includes("매트") || text.includes("matte")) return "matte";
  if (text.includes("유광") || text.includes("gloss")) return "gloss";
  return "gloss";
}

function normalizePpfFinishType(value) {
  const text = normalize(String(value || "").trim().replace(/-/g, "_"));
  if (["matte", "무광", "매트"].includes(text)) return "matte";
  if (["semi_matte", "semimatte", "반무광"].includes(text)) return "semi_matte";
  if (["satin", "사틴"].includes(text)) return "satin";
  return "gloss";
}

function normalizePpfTransparencyType(value) {
  const text = normalize(String(value || "").trim().replace(/-/g, "_"));
  if (["opaque", "불투명"].includes(text)) return "opaque";
  if (["semiTransparent", "semi_transparent", "semitransparent", "반투명"].includes(text)) return "semiTransparent";
  return "transparent";
}

function ppfTransparencyOptionValue(value) {
  const normalized = normalizePpfTransparencyType(value);
  return normalized === "semiTransparent" ? "semi_transparent" : normalized;
}

function ppfOpacityFromProduct(transparencyType, opacityPercent) {
  const raw = Math.min(100, Math.max(0, Number(opacityPercent) || 0)) / 100;
  if (transparencyType === "opaque") return Math.min(1, Math.max(0.85, raw || 1));
  if (transparencyType === "semiTransparent") return Math.min(0.65, Math.max(0.35, raw || 0.5));
  return Math.min(0.25, Math.max(0.08, raw || 0.18));
}

function ppfFinishMaterialPreset(finishType) {
  if (finishType === "matte") {
    return {
      roughness: 0.85,
      metalness: 0.05,
      clearcoat: 0,
      clearcoatRoughness: 0.9,
      envMapIntensity: 0.48,
      emissiveIntensity: 0.2
    };
  }
  if (finishType === "semi_matte") {
    return {
      roughness: 0.62,
      metalness: 0.06,
      clearcoat: 0.18,
      clearcoatRoughness: 0.42,
      envMapIntensity: 0.56,
      emissiveIntensity: 0.18
    };
  }
  if (finishType === "satin") {
    return {
      roughness: 0.42,
      metalness: 0.08,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      envMapIntensity: 0.68,
      emissiveIntensity: 0.16
    };
  }
  return {
    roughness: 0.08,
    metalness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.01,
    envMapIntensity: 0.78,
    emissiveIntensity: 0.14
  };
}

function addConsultationPpfMeshHighlights() {}

function addConsultationPpfSelectionOverlays() {}

function consultationOverlaySpecs(size, center) {
  const x = size.x || 1;
  const y = size.y || 1;
  const z = size.z || 1;
  const topY = center.y + y * 0.42;
  const sideY = center.y + y * 0.08;
  const sideZ = z * 0.5 + 0.012;
  const frontX = center.x - x * 0.45;
  const rearX = center.x + x * 0.45;
  const specs = [
    { key: "hood", width: x * 0.28, height: z * 0.7, position: [center.x - x * 0.27, topY, center.z], rotation: [-Math.PI / 2, 0, 0] },
    { key: "roof", width: x * 0.26, height: z * 0.74, position: [center.x + x * 0.02, center.y + y * 0.62, center.z], rotation: [-Math.PI / 2, 0, 0] },
    { key: "trunk", width: x * 0.22, height: z * 0.68, position: [center.x + x * 0.34, center.y + y * 0.38, center.z], rotation: [-Math.PI / 2, 0, 0] },
    { key: "front_bumper", width: z * 0.78, height: y * 0.26, position: [frontX, center.y - y * 0.1, center.z], rotation: [0, Math.PI / 2, 0] },
    { key: "rear_bumper", width: z * 0.78, height: y * 0.26, position: [rearX, center.y - y * 0.08, center.z], rotation: [0, Math.PI / 2, 0] },
    { key: "front_fender", width: x * 0.16, height: y * 0.34, position: [center.x - x * 0.29, sideY, center.z + sideZ], rotation: [0, 0, 0] },
    { key: "front_fender", width: x * 0.16, height: y * 0.34, position: [center.x - x * 0.29, sideY, center.z - sideZ], rotation: [0, Math.PI, 0] },
    { key: "rear_fender", width: x * 0.18, height: y * 0.34, position: [center.x + x * 0.33, sideY, center.z + sideZ], rotation: [0, 0, 0] },
    { key: "rear_fender", width: x * 0.18, height: y * 0.34, position: [center.x + x * 0.33, sideY, center.z - sideZ], rotation: [0, Math.PI, 0] },
    { key: "front_door", width: x * 0.2, height: y * 0.38, position: [center.x - x * 0.08, sideY, center.z + sideZ], rotation: [0, 0, 0] },
    { key: "front_door", width: x * 0.2, height: y * 0.38, position: [center.x - x * 0.08, sideY, center.z - sideZ], rotation: [0, Math.PI, 0] },
    { key: "rear_door", width: x * 0.2, height: y * 0.38, position: [center.x + x * 0.14, sideY, center.z + sideZ], rotation: [0, 0, 0] },
    { key: "rear_door", width: x * 0.2, height: y * 0.38, position: [center.x + x * 0.14, sideY, center.z - sideZ], rotation: [0, Math.PI, 0] },
    { key: "mirror", width: x * 0.08, height: y * 0.11, position: [center.x - x * 0.16, center.y + y * 0.26, center.z + sideZ * 1.06], rotation: [0, 0, 0] },
    { key: "mirror", width: x * 0.08, height: y * 0.11, position: [center.x - x * 0.16, center.y + y * 0.26, center.z - sideZ * 1.06], rotation: [0, Math.PI, 0] },
    { key: "headlight", width: z * 0.34, height: y * 0.09, position: [frontX - x * 0.006, center.y + y * 0.1, center.z + z * 0.23], rotation: [0, Math.PI / 2, 0] },
    { key: "headlight", width: z * 0.34, height: y * 0.09, position: [frontX - x * 0.006, center.y + y * 0.1, center.z - z * 0.23], rotation: [0, Math.PI / 2, 0] },
    { key: "pillar", width: x * 0.08, height: y * 0.36, position: [center.x - x * 0.18, center.y + y * 0.22, center.z + sideZ], rotation: [0, 0, 0] },
    { key: "pillar", width: x * 0.08, height: y * 0.36, position: [center.x - x * 0.18, center.y + y * 0.22, center.z - sideZ], rotation: [0, Math.PI, 0] },
    { key: "door_cup", width: x * 0.11, height: y * 0.05, position: [center.x + x * 0.02, center.y + y * 0.16, center.z + sideZ * 1.02], rotation: [0, 0, 0] },
    { key: "door_cup", width: x * 0.11, height: y * 0.05, position: [center.x + x * 0.02, center.y + y * 0.16, center.z - sideZ * 1.02], rotation: [0, Math.PI, 0] },
    { key: "door_edge", width: x * 0.025, height: y * 0.42, position: [center.x + x * 0.05, sideY, center.z + sideZ * 1.025], rotation: [0, 0, 0] },
    { key: "door_edge", width: x * 0.025, height: y * 0.42, position: [center.x + x * 0.05, sideY, center.z - sideZ * 1.025], rotation: [0, Math.PI, 0] }
  ];
  return specs;
}

function consultationMeshInfo(object, vehicleId = "") {
  const materialName = Array.isArray(object.material) ? object.material.map((item) => item?.name).join("_") : object.material?.name;
  const rawName = [object.name, object.parent?.name, materialName].filter(Boolean).join("_");
  const name = normalizeMeshName(rawName);
  const directName = normalizeMeshName(object.name || "");
  const map = consultationVehicleMeshMaps[vehicleId] || null;
  const exactMap = Boolean(map);
  const ppfParts = consultationUniqueParts([
    ...consultationMappedPpfParts(directName, name, map),
    ...consultationAliasPpfParts(directName, name)
  ]);
  const tintAreas = consultationUniqueParts([
    ...consultationMappedTintAreas(directName, name, map),
    ...consultationAliasTintAreas(directName, name)
  ]);
  const mappedBodyNames = new Set((map?.body || []).map(normalizeMeshName));
  const mappedGlassNames = new Set((map?.glass || []).map(normalizeMeshName));
  return {
    name,
    directName,
    isBody: exactMap ? mappedBodyNames.has(directName) || ppfParts.length > 0 : isBodyMeshName(name),
    isGlass: exactMap ? mappedGlassNames.has(directName) || tintAreas.length > 0 : isGlassMeshName(name),
    ppfParts,
    tintAreas
  };
}

function consultationUniqueParts(parts) {
  return Array.from(new Set(parts.filter(Boolean)));
}

function consultationMappedPpfParts(directName, combinedName, map) {
  if (!map?.ppf) return [];
  if (isGlassMeshName(combinedName)) return [];
  return Object.entries(map.ppf)
    .filter(([, names]) => names.map(normalizeMeshName).some((meshName) => directName === meshName || combinedName.includes(meshName)))
    .map(([part]) => canonicalBodyPartFromLegacy(part, directName || combinedName))
    .filter(Boolean);
}

function consultationMappedTintAreas(directName, combinedName, map) {
  if (!map?.tint) return [];
  return Object.entries(map.tint)
    .filter(([, names]) => names.map(normalizeMeshName).some((meshName) => directName === meshName || combinedName.includes(meshName)))
    .map(([area]) => canonicalGlassPartFromLegacy(area, directName || combinedName))
    .filter(Boolean);
}

function consultationAliasPpfParts(directName, combinedName) {
  if (isGlassMeshName(combinedName)) return [];
  return Object.entries(consultationPartMapping)
    .filter(([part]) => !tintAreaOptions.some((area) => area.key === part))
    .filter(([, aliases]) => aliases.map(normalizeMeshName).some((alias) => directName === alias || combinedName.includes(alias)))
    .map(([part]) => canonicalBodyPartFromLegacy(part, directName || combinedName))
    .filter(Boolean);
}

function consultationAliasTintAreas(directName, combinedName) {
  return Object.entries(consultationPartMapping)
    .filter(([part]) => tintAreaOptions.some((area) => area.key === part))
    .filter(([, aliases]) => aliases.map(normalizeMeshName).some((alias) => directName === alias || combinedName.includes(alias)))
    .map(([part]) => canonicalGlassPartFromLegacy(part, directName || combinedName))
    .filter(Boolean);
}

function resolveConsultationPartFromMesh(object, vehicleId = "") {
  if (object?.userData?.isPpfOverlay || object?.userData?.category === "ppfOverlay") return null;
  if (object?.userData?.category && object?.userData?.partId) {
    const category = object.userData.category === "glass" ? "glass" : "body";
    const partId = object.userData.partId;
    return { partId, category, partName: consultationPartLabel(partId), meshName: object.name || "" };
  }
  const meshInfo = consultationMeshInfo(object, vehicleId);
  if (meshInfo.tintAreas?.length) {
    return { partId: meshInfo.tintAreas[0], category: "glass", partName: consultationPartLabel(meshInfo.tintAreas[0]), meshName: object.name || "" };
  }
  if (meshInfo.ppfParts?.length) {
    return { partId: meshInfo.ppfParts[0], category: "body", partName: consultationPartLabel(meshInfo.ppfParts[0]), meshName: object.name || "" };
  }
  const normalized = normalizeMeshName([object.name, object.parent?.name].filter(Boolean).join("_"));
  const matched = Object.entries(consultationPartMapping).find(([, aliases]) => aliases.map(normalizeMeshName).some((alias) => normalized.includes(alias)));
  if (!matched) return null;
  const rawPartId = matched[0];
  const category = tintAreaOptions.some((area) => area.key === rawPartId) ? "glass" : "body";
  const partId = category === "glass"
    ? canonicalGlassPartFromLegacy(rawPartId, normalized)
    : canonicalBodyPartFromLegacy(rawPartId, normalized);
  if (!partId) return null;
  return { partId, category, partName: consultationPartLabel(partId), meshName: object.name || "" };
}

function consultationPartLabel(partId) {
  return consultationBodyPartOptions.find((part) => part.key === partId)?.label
    || consultationGlassPartOptions.find((part) => part.key === partId)?.label
    || ppfPartOptions.find((part) => part.key === partId)?.label
    || tintAreaOptions.find((area) => area.key === partId)?.label
    || partId;
}

function handleConsultationPartClick(part) {
  if (!part?.partId) return;
  const category = part.category === "glass" || part.category === "TINTING" ? "glass" : "body";
  const partId = category === "glass"
    ? canonicalGlassPartFromLegacy(part.partId, part.meshName)
    : canonicalBodyPartFromLegacy(part.partId, part.meshName);
  if (!partId) return;
  const appliedMap = category === "glass" ? consultationAppliedTintMap() : consultationAppliedPpfMap();
  if (appliedMap[partId]) {
    removeProductFromConsultationPart(partId, category);
    state.consultation.selectedPartId = null;
    state.consultation.selectedCategory = null;
    refreshConsultationAfterOptionChange(category === "glass" ? "tint" : "ppf");
    showToast(`${consultationPartLabel(partId)} 적용을 해제했습니다.`);
    return;
  }
  if (category === "body") {
    state.consultation.selectedPartId = partId;
    state.consultation.selectedCategory = "body";
    const product = selectedConsultationPpfProduct();
    if (!product) {
      refreshConsultationAfterOptionChange("ppf");
      showToast("PPF 제품을 먼저 선택하세요.");
      return;
    }
    applyConsultationProductToSelectedPart(product, "ppf");
    refreshConsultationAfterOptionChange("ppf");
    return;
  }
  selectConsultationTargetPart(partId, category);
}

function selectConsultationTargetPart(partId, category) {
  const canonicalCategory = category === "glass" || category === "TINTING" ? "glass" : "body";
  const canonicalPartId = canonicalCategory === "glass"
    ? canonicalGlassPartFromLegacy(partId) || partId
    : canonicalBodyPartFromLegacy(partId) || partId;
  if (!canonicalPartId) return;
  state.consultation.selectedPartId = canonicalPartId;
  state.consultation.selectedCategory = canonicalCategory;
  if (canonicalCategory === "glass") {
    const legacyTarget = legacyGlassPartFor(canonicalPartId);
    state.consultation.tintTarget = legacyTarget;
    state.consultation.tintFilter = "전체";
  }
  refreshConsultationAfterOptionChange(canonicalCategory === "glass" ? "tint" : "ppf");
  showToast(`${consultationPartLabel(canonicalPartId)} 선택됨. 적용할 ${canonicalCategory === "glass" ? "틴팅" : "PPF"} 제품을 검색해 주세요.`);
}

function applyConsultationProductToSelectedPart(product, type) {
  if (!product) return;
  const category = type === "tint" ? "glass" : "body";
  const partId = state.consultation.selectedPartId;
  if (!partId || state.consultation.selectedCategory !== category) {
    showToast(`먼저 3D 차량에서 ${category === "glass" ? "유리" : "차체"} 부위를 선택해 주세요.`);
    return;
  }
  if (category === "glass") {
    const legacyTarget = legacyGlassPartFor(partId);
    const tintMap = consultationAppliedTintMap();
    tintMap[partId] = product;
    state.consultation.tintAreas = {
      ...consultationTintAreas(),
      [legacyTarget]: productTintStrength(product)
    };
    upsertConsultationApplication(productApplicationRecord(partId, "TINTING", product));
    showToast(`${consultationPartLabel(partId)}에 ${productDisplayName(product)} 적용`);
    return;
  }
  const ppfMap = consultationAppliedPpfMap();
  ppfMap[partId] = product;
  const legacyPart = legacyBodyPartFor(partId);
  const next = new Set(state.consultation.ppfParts || []);
  next.delete("full_body");
  next.add(legacyPart);
  state.consultation.ppfParts = Array.from(next);
  upsertConsultationApplication(productApplicationRecord(partId, "PPF", product));
  showToast(`${consultationPartLabel(partId)}에 ${productDisplayName(product)} 적용`);
}

function syncAppliedPpfProduct(product) {
  if (!product) return;
  const ppfMap = consultationAppliedPpfMap();
  Object.keys(ppfMap).forEach((partId) => {
    if (!ppfMap[partId]) return;
    ppfMap[partId] = product;
    upsertConsultationApplication(productApplicationRecord(partId, "PPF", product));
  });
}

function removeProductFromConsultationPart(partId, category) {
  const canonicalCategory = category === "glass" || category === "TINTING" ? "glass" : "body";
  const canonicalPartId = canonicalCategory === "glass"
    ? canonicalGlassPartFromLegacy(partId) || partId
    : canonicalBodyPartFromLegacy(partId) || partId;
  state.consultation.applications = consultationApplications().filter((item) => {
    const itemCategory = item.category === "TINTING" ? "glass" : "body";
    const itemPartId = itemCategory === "glass"
      ? canonicalGlassPartFromLegacy(item.partId) || item.partId
      : canonicalBodyPartFromLegacy(item.partId) || item.partId;
    return !(itemCategory === canonicalCategory && itemPartId === canonicalPartId);
  });
  if (canonicalCategory === "body") {
    removeConsultationPpfOverlay(canonicalPartId);
    delete consultationAppliedPpfMap()[canonicalPartId];
    const legacyPart = legacyBodyPartFor(canonicalPartId);
    state.consultation.ppfParts = (state.consultation.ppfParts || []).filter((part) => part !== legacyPart && part !== canonicalPartId);
  }
  if (canonicalCategory === "glass") {
    restoreConsultationGlassGroup(canonicalPartId);
    delete consultationAppliedTintMap()[canonicalPartId];
  }
}

function consultationTintStrengthForMesh(meshInfo, product) {
  const tintMap = consultationAppliedTintMap();
  const area = meshInfo.tintAreas?.find((key) => tintMap[key]);
  const applied = area ? consultationApplicationForPart(area, "TINTING") : null;
  if (applied?.tintStrength !== null && applied?.tintStrength !== undefined) return clampNullableNumber(applied.tintStrength, 0, 100, 0);
  if (applied?.shadePercent !== null && applied?.shadePercent !== undefined) return clampNullableNumber(applied.shadePercent, 0, 100, 0);
  return productTintStrength(product);
}

function consultationTintProductForMesh(meshInfo) {
  if (state.consultation.tintEnabled === false) return null;
  const tintMap = consultationAppliedTintMap();
  const area = meshInfo.tintAreas?.find((key) => tintMap[key]);
  return area ? tintMap[area] : null;
}

function consultationPpfProductForMesh(meshInfo) {
  const ppfMap = consultationAppliedPpfMap();
  const appliedPart = meshInfo.ppfParts?.find((part) => ppfMap[part]);
  return appliedPart ? ppfMap[appliedPart] : null;
}

function consultationOverlayFallbackParts(vehicleId, selectedParts) {
  if (selectedParts.has("full_body")) return new Set();
  const map = consultationVehicleMeshMaps[vehicleId] || null;
  if (!map?.ppf) return selectedParts;
  const mappedParts = new Set(Object.keys(map.ppf));
  return new Set(Array.from(selectedParts).filter((part) => !mappedParts.has(part)));
}

function normalizeMeshName(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9가-힣]+/g, "_");
}

function isGlassMeshName(name) {
  return /glass|window|windshield|sunroof|유리/.test(name);
}

function isBodyMeshName(name) {
  return /body|hood|bumper|door|fender|trunk|roof|mirror|quarter|panel|차체|본넷|도어|범퍼/.test(name);
}

function frameConsultationModel(THREE, camera, controls, model, view) {
  const box = new THREE.Box3().setFromObject(model);
  if (box.isEmpty()) {
    camera.position.set(3, 1.5, 4);
    controls.target.set(0, 0.5, 0);
    controls.update();
    return;
  }
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.y -= box.min.y;
  model.position.z -= center.z;
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const distance = Math.max(2.4, maxDim * 1.45);
  const height = Math.max(0.8, size.y * 0.48);
  const cameraPositions = {
    front: [0, height, distance],
    front45: [distance * 0.72, height, distance * 0.72],
    side: [distance, height, 0],
    rear45: [-distance * 0.72, height, -distance * 0.72],
    rear: [0, height, -distance]
  };
  camera.position.set(...(cameraPositions[view] || cameraPositions.front45));
  camera.near = 0.01;
  camera.far = distance * 10;
  camera.updateProjectionMatrix();
  controls.target.set(0, Math.max(0.28, size.y * 0.34), 0);
  controls.update();
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
  if (action === "refreshLabelSettings") return loadLabelSettings(true);
  if (action === "saveLabelSettings") return saveLabelSettings();
  if (action === "resetLabelSettings") return resetLabelSettings();
  if (action === "previewTestLabel") return previewTestLabel();
  if (action === "printTestLabel") return printTestLabel();
  if (action === "verifyCertificate") return verifyCertificatePublic();
  if (action === "createOrder") return createOrder();
  if (action === "clearTestOrders") return clearTestOrders();
  if (action === "receiveOrder") return receiveOrder(button.dataset.orderId);
  if (action === "createReservation") return createReservation();
  if (action === "completeReservation") return completeReservation(button.dataset.reservationId);
  if (action === "printCertificate") return printCertificate(button.dataset.certificateId);
  if (action === "saveConsultation") return saveConsultation();
  if (action === "downloadConsultationSnapshot") return downloadConsultationSnapshot();
  if (action === "consultationApplyAll") return consultationApplyAll();
  if (action === "consultationClearAll") return consultationClearAll();
  if (action === "consultationApplyAllTint") return consultationApplyAllTint();
  if (action === "consultationClearAllTint") return consultationClearAllTint();
  if (action === "consultationApplyAllPpf") return consultationApplyAllPpf();
  if (action === "consultationClearAllPpf") return consultationClearAllPpf();
  if (action === "consultationFutureReservation") return consultationFutureReservation();
  if (action === "consultationFutureCertificate") return consultationFutureCertificate();
  if (action === "cancelOrder") return cancelOrder(button.dataset.orderId);
  if (action === "saveInventory") return saveInventory();
  if (action === "saveProduct") return saveProduct();
  if (action === "saveVehicle") return saveVehicle();
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
  if (Array.isArray(data.certificates)) state.certificates = data.certificates;
  if (Array.isArray(data.vehicles)) state.vehicles = data.vehicles.length ? data.vehicles : createMockVehicles();
  if (Array.isArray(data.consultations)) state.consultations = data.consultations;
  applyLabelSettings(data.label_settings || data.labelSettings);
  syncAppBadgeFromOrders();
}

function nextScreenAfterLogin() {
  if (needsDealerOnboarding(state.session)) return "onboarding";
  if (toBool(state.session?.is_first_login)) return "passwordChange";
  const requested = requestedScreenFromUrl();
  if (requested && canAccessScreen(requested)) return requested;
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
    const requests = [
      window.FilmStockApi.getInventory({}),
      window.FilmStockApi.getOrders({}),
      window.FilmStockApi.getSales({}),
      window.FilmStockApi.getReservations({}),
      window.FilmStockApi.getCertificates({}),
      window.FilmStockApi.getConsultationData({})
    ];
    if (state.session.role === "admin") requests.push(window.FilmStockApi.getLabelSettings().catch(() => null));
    const [inventoryData, orderData, salesData, reservationData, certificateData, consultationData, labelData] = await Promise.all(requests);
    if (Array.isArray(inventoryData?.products)) state.products = inventoryData.products;
    if (Array.isArray(inventoryData?.inventory)) state.inventory = inventoryData.inventory;
    if (Array.isArray(orderData?.orders)) state.orders = orderData.orders;
    if (Array.isArray(orderData?.accounts)) state.accounts = orderData.accounts;
    if (Array.isArray(salesData?.sales)) state.retailSales = salesData.sales;
    if (Array.isArray(reservationData?.reservations)) state.reservations = reservationData.reservations;
    if (Array.isArray(certificateData?.certificates)) state.certificates = certificateData.certificates;
    if (Array.isArray(consultationData?.vehicles)) state.vehicles = consultationData.vehicles.length ? consultationData.vehicles : createMockVehicles();
    if (Array.isArray(consultationData?.consultations)) state.consultations = consultationData.consultations;
    applyLabelSettings(labelData?.label_settings || labelData?.settings);
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

async function loadLabelSettings(showDone = false) {
  if (state.session?.role !== "admin") throw new Error("관리자만 라벨 출력 설정을 확인할 수 있습니다.");
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.getLabelSettings();
    applyLabelSettings(data?.label_settings || data?.settings);
  } else {
    syncLabelOverlayCalibration();
  }
  render();
  if (showDone) showToast("라벨 출력 보정값을 불러왔습니다.");
}

async function saveLabelSettings() {
  if (state.session?.role !== "admin") throw new Error("관리자만 라벨 출력 설정을 저장할 수 있습니다.");
  validateLabelCalibration();
  syncLabelOverlayCalibration();
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.saveLabelSettings(labelCalibrationSettingsPayload());
    applyLabelSettings(data?.label_settings || data?.settings);
  }
  render();
  showToast("라벨 출력 위치 보정값을 저장했습니다.");
}

async function resetLabelSettings() {
  if (state.session?.role !== "admin") throw new Error("관리자만 라벨 출력 설정을 초기화할 수 있습니다.");
  state.labelCalibration = defaultLabelCalibration();
  syncLabelOverlayCalibration();
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.saveLabelSettings(labelCalibrationSettingsPayload());
    applyLabelSettings(data?.label_settings || data?.settings);
  }
  render();
  showToast("라벨 출력 위치를 기본값으로 초기화했습니다.");
}

function previewTestLabel() {
  openTestLabelWindow(false);
  showToast("테스트 송장 미리보기를 열었습니다.");
}

function printTestLabel() {
  openTestLabelWindow(true);
  showToast("테스트 출력창을 열었습니다.");
}

function openTestLabelWindow(autoPrint) {
  if (state.session?.role !== "admin") throw new Error("관리자만 테스트 송장을 출력할 수 있습니다.");
  validateLabelCalibration();
  syncLabelOverlayCalibration();
  const printWindow = window.open("", "_blank", "width=900,height=900");
  if (!printWindow) throw new Error("팝업이 차단되어 테스트 송장창을 열 수 없습니다.");
  printWindow.document.open();
  printWindow.document.write(buildShippingLabelHtml(testLabelOrder(), state.forms.labelSize, {
    autoPrint,
    forceTestMode: true
  }));
  printWindow.document.close();
}

function testLabelOrder() {
  const date = compactDateValue();
  return {
    order_id: `TEST-ORDER-${date}`,
    order_no: `TEST-ORDER-${date}`,
    dealer_code: "D001",
    dealer_name: "라벨 테스트 대리점",
    product_name: "카본 틴팅 스모크 05%",
    sku: "TN-SM-100",
    qty: 10,
    courier: "우체국택배",
    tracking_no: `TEST-KP-${date}-123456`,
    shipping_receipt_no: `MOCK-RCPT-${date}-123456`,
    recipient_name: "홍길동",
    recipient_phone: "010-1234-5678",
    recipient_zipcode: "10900",
    recipient_address: "경기 파주시 산내로 26",
    recipient_address_detail: "파주창고 101호",
    shipping_memo: "테스트 송장입니다.",
    created_at: nowText()
  };
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
  validateLabelCalibration();
  syncLabelOverlayCalibration();

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

function shippingLabelPrintData(order, options = {}) {
  const sender = labelSenderInfo();
  const recipientName = order.recipient_name || order.dealer_name || "수령인 미입력";
  const recipientPhone = order.recipient_phone || "전화번호 미입력";
  return {
    orderNo: String(order.order_id || order.order_no || "").trim(),
    dealerName: String(order.dealer_name || order.dealer_code || "").trim(),
    ordererName: String(order.orderer_name || order.login_id || order.dealer_name || "GLOC").trim(),
    receiptOffice: String(order.receipt_office || "GLOC").trim(),
    trackingNo: orderTrackingNo(order),
    registrationNo: labelRegistrationNo(order),
    regionCode: labelRegionCode(order),
    sortCode: labelSortCode(order),
    paymentMethod: labelPaymentMethod(order),
    receiptDate: labelReceiptDate(order),
    weightText: labelWeightText(order),
    volumeText: labelVolumeText(order),
    feeText: labelFeeText(order),
    messageText: labelDeliveryMessage(order),
    contentName: labelContentName(order),
    productText: labelProductInfo(order),
    bottomCode: labelBottomCode(order),
    qty: Number(order.qty || order.quantity || 0),
    sender: {
      name: labelPersonName(sender.name),
      phone: labelPhone(sender.phone),
      address: sender.address
    },
    recipient: {
      name: labelPersonName(recipientName),
      phone: labelPhone(recipientPhone),
      zipcode: String(order.recipient_zipcode || "").trim(),
      address: String(order.recipient_address || "").trim(),
      addressDetail: labelAddressDetail(order.recipient_address_detail || "")
    },
    testWatermark: Boolean(options.forceTestMode || shouldShowTestWatermark(order))
  };
}

function renderPrintLabelOverlay(data) {
  return `
    ${data.testWatermark ? `<div class="test-watermark">TEST / 실제 접수 아님</div>` : ""}
    <div class="field region-code">${renderLabelRegionCode(data.regionCode)}</div>
    <div class="field sort-code">${escapeHtml(data.sortCode)}</div>
    <div class="field field-small customer-order">
      <span class="address-line">접수국: ${escapeHtml(data.receiptOffice)}　신청일: ${escapeHtml(data.receiptDate)}</span>
      <span class="address-line">주문인: ${escapeHtml(data.ordererName)}</span>
      <span class="address-line">고객 주문처: ${escapeHtml(data.dealerName)}</span>
      <span class="address-line">주문번호: ${escapeHtml(data.orderNo)}</span>
    </div>
    <div class="field payment-method">요금: ${escapeHtml(data.paymentMethod)}</div>
    <div class="field field-small weight">중량:${escapeHtml(data.weightText)}</div>
    <div class="field field-small volume">용적:${escapeHtml(data.volumeText)}</div>
    <div class="field field-small fee">요금:${escapeHtml(data.feeText)}</div>
    <div class="barcode-slot main-barcode">${code128BarcodeSvg(data.registrationNo)}</div>
    <div class="field field-small delivery-message">배송메시지: ${escapeHtml(data.messageText)}</div>
    <div class="field field-small content-name">내용품명: ${escapeHtml(data.contentName)}</div>
    <div class="field field-tiny product-info">${escapeHtml(data.productText)}</div>
    <div class="field field-small sender">
      <span class="address-line">${escapeHtml(data.sender.address)}</span>
      <strong class="sender-name">${escapeHtml(data.sender.name)}</strong>
      <span class="address-line">T: ${escapeHtml(data.sender.phone)}</span>
    </div>
    <div class="field recipient">
      <span class="address-line">${escapeHtml(data.recipient.address)}</span>
      ${data.recipient.addressDetail ? `<span class="address-line">${escapeHtml(data.recipient.addressDetail)}</span>` : ""}
      <strong class="recipient-name">${escapeHtml(data.recipient.name)}</strong>
      <span class="address-line">T: ${escapeHtml(data.recipient.phone)}</span>
      <span class="address-strong">${escapeHtml(data.recipient.zipcode)}</span>
    </div>
    <div class="field field-small registration">
      <span class="address-line">등기번호: ${escapeHtml(data.registrationNo)}</span>
      <span class="address-line">수량: ${roll(data.qty)}</span>
    </div>
    <div class="barcode-slot bottom-barcode">${code128BarcodeSvg(data.registrationNo)}</div>
    <div class="field bottom-code">${escapeHtml(data.bottomCode)}</div>
  `;
}

function buildShippingLabelHtml(order, labelSizeValue, options = {}) {
  const label = labelSizeMeta(labelSizeValue);
  const data = shippingLabelPrintData(order, options);
  const safeTrackingNo = escapeHtml(data.trackingNo);
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
        font-size: ${overlaySize(3)};
        font-weight: 700;
        line-height: 1.16;
        letter-spacing: 0;
        white-space: normal;
        overflow-wrap: anywhere;
        word-break: keep-all;
      }
      .field-small {
        font-size: ${overlaySize(2.45)};
        font-weight: 700;
        line-height: 1.2;
      }
      .field-tiny {
        font-size: ${overlaySize(2.15)};
        font-weight: 700;
        line-height: 1.2;
      }
      .region-code {
        left: ${overlayX(koreaPostOverlay.REGION_CODE_X_MM)};
        top: ${overlayY(koreaPostOverlay.REGION_CODE_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.REGION_CODE_WIDTH_MM)};
        display: flex;
        align-items: center;
        gap: ${overlaySize(1.2)};
        font-size: ${overlaySize(13)};
        font-weight: 900;
        line-height: 0.9;
        letter-spacing: 0;
      }
      .label-region-prefix {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: ${overlaySize(14)};
        min-height: ${overlaySize(13)};
        padding: 0 ${overlaySize(0.8)};
        background: #000;
        color: #fff;
        line-height: 1;
      }
      .label-region-route {
        display: inline-block;
        color: #000;
        line-height: 0.92;
      }
      .sort-code {
        left: ${overlayX(koreaPostOverlay.SORT_CODE_X_MM)};
        top: ${overlayY(koreaPostOverlay.SORT_CODE_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.SORT_CODE_WIDTH_MM)};
        text-align: center;
        font-size: ${overlaySize(9)};
        font-weight: 900;
        line-height: 1;
      }
      .customer-order {
        left: ${overlayX(koreaPostOverlay.CUSTOMER_ORDER_X_MM)};
        top: ${overlayY(koreaPostOverlay.CUSTOMER_ORDER_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.CUSTOMER_ORDER_WIDTH_MM)};
      }
      .payment-method {
        left: ${overlayX(koreaPostOverlay.PAYMENT_X_MM)};
        top: ${overlayY(koreaPostOverlay.PAYMENT_Y_MM)};
        width: ${overlaySize(18)};
        text-align: left;
        font-size: ${overlaySize(3)};
        font-weight: 900;
        line-height: 1.1;
      }
      .weight {
        left: ${overlayX(koreaPostOverlay.WEIGHT_X_MM)};
        top: ${overlayY(koreaPostOverlay.WEIGHT_Y_MM)};
        width: ${overlaySize(18)};
      }
      .volume {
        left: ${overlayX(koreaPostOverlay.VOLUME_X_MM)};
        top: ${overlayY(koreaPostOverlay.VOLUME_Y_MM)};
        width: ${overlaySize(18)};
      }
      .fee {
        left: ${overlayX(koreaPostOverlay.FEE_X_MM)};
        top: ${overlayY(koreaPostOverlay.FEE_Y_MM)};
        width: ${overlaySize(20)};
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
      .product-info {
        left: ${overlayX(koreaPostOverlay.PRODUCT_X_MM)};
        top: ${overlayY(koreaPostOverlay.PRODUCT_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.PRODUCT_WIDTH_MM)};
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
      .bottom-code {
        left: ${overlayX(koreaPostOverlay.BOTTOM_CODE_X_MM)};
        top: ${overlayY(koreaPostOverlay.BOTTOM_CODE_Y_MM)};
        width: ${overlaySize(koreaPostOverlay.BOTTOM_CODE_WIDTH_MM)};
        text-align: center;
        font-size: ${overlaySize(9)};
        font-weight: 900;
        line-height: 0.9;
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
        margin-top: ${overlaySize(0.8)};
        font-size: ${overlaySize(4.2)};
        font-weight: 900;
        line-height: 1;
      }
      .recipient-name {
        display: block;
        margin: ${overlaySize(1.2)} 0 ${overlaySize(1)};
        font-size: ${overlaySize(6.6)};
        font-weight: 900;
        line-height: 1;
      }
      .address-line {
        display: block;
        margin-top: ${overlaySize(0.8)};
      }
      .address-strong {
        display: block;
        margin-top: ${overlaySize(1.2)};
        font-size: ${overlaySize(4.6)};
        font-weight: 900;
        line-height: 1.14;
      }
      .test-watermark {
        left: ${overlayX(koreaPostOverlay.WATERMARK_X_MM)};
        top: ${overlayY(koreaPostOverlay.WATERMARK_Y_MM)};
        transform: translate(-50%, -50%) rotate(-20deg);
        color: rgba(0, 0, 0, 0.12);
        font-size: ${overlaySize(9)};
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
        ${renderPrintLabelOverlay(data)}
      </section>
      <p class="print-instructions">프린터 설정: 배율 100%, 여백 없음, 가로 방향, 머리글/바닥글 제거 · 출력은 180도 회전 보정됨</p>
      <div class="actions">
        <button type="button" onclick="window.print()">오버레이 출력</button>
        <button type="button" onclick="window.close()">닫기</button>
      </div>
    </main>
    ${options.autoPrint === false ? "" : `<script>
      window.addEventListener("load", function () {
        window.setTimeout(function () {
          window.focus();
          window.print();
        }, 350);
      });
    </script>`}
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

function printOverlayScale() {
  return koreaPostOverlay.SCALE * koreaPostOverlay.PRINT_SCALE;
}

function overlayX(value) {
  return overlayMm(koreaPostOverlay.OFFSET_X_MM + koreaPostOverlay.PRINT_OFFSET_X_MM + Number(value || 0) * printOverlayScale());
}

function overlayY(value) {
  return overlayMm(koreaPostOverlay.OFFSET_Y_MM + koreaPostOverlay.PRINT_OFFSET_Y_MM + Number(value || 0) * printOverlayScale());
}

function overlaySize(value) {
  return overlayMm(Number(value || 0) * printOverlayScale());
}

function labelPrintMode() {
  return String(config.labelMode || "test").toLowerCase() === "production" ? "production" : "test";
}

function shippingMode() {
  const mode = String(config.shippingMode || "").toLowerCase();
  if (mode) return mode === "production" ? "production" : "mock";
  return labelPrintMode() === "production" ? "production" : "mock";
}

function shouldShowTestWatermark() {
  return shippingMode() !== "production";
}

function labelPrivacyMaskingEnabled() {
  return String(config.labelPrivacyMasking ?? "true").toLowerCase() === "true";
}

function labelPersonName(value) {
  const name = String(value || "").trim();
  if (!labelPrivacyMaskingEnabled() || name.length < 2) return name;
  if (name.length === 2) return `${name[0]}*`;
  return `${name[0]}${"*".repeat(Math.max(1, name.length - 2))}${name[name.length - 1]}`;
}

function labelPhone(value) {
  const phone = String(value || "").trim();
  if (!labelPrivacyMaskingEnabled()) return phone;
  return phone.replace(/(\d{2,3})-?(\d{3,4})-?(\d{4})$/, "$1-****-$3");
}

function labelAddressDetail(value) {
  const detail = String(value || "").trim();
  if (!labelPrivacyMaskingEnabled() || !detail) return detail;
  const parts = detail.split(/\s+/);
  if (parts.length === 1) return "***";
  return `${parts.slice(0, -1).join(" ")} ***`;
}

function labelRegistrationNo(order) {
  return String(order.shipping_receipt_no || order.tracking_no || order.order_id || "").trim();
}

function labelRegionCode(order) {
  return String(order.region_code || order.zone_code || order.label_region_code || "B4 484").trim();
}

function renderLabelRegionCode(value) {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return escapeHtml(parts.join(" "));
  const prefix = parts.shift();
  return `<span class="label-region-prefix">${escapeHtml(prefix)}</span><span class="label-region-route">${escapeHtml(parts.join(" "))}</span>`;
}

function labelSortCode(order) {
  return String(order.sort_code || order.classification_code || order.label_sort_code || "0316").trim();
}

function labelWeightText(order) {
  return String(order.shipping_weight || order.weight || "1190g").trim();
}

function labelVolumeText(order) {
  return String(order.shipping_volume || order.volume || "60cm").trim();
}

function labelFeeText(order) {
  return String(order.shipping_fee || order.fee || "4,500 착불").trim();
}

function labelContentName(order) {
  return String(order.shipping_content_name || order.product_name || "필름 제품").trim();
}

function labelProductInfo(order) {
  const qtyText = roll(Number(order.qty || order.quantity || 0));
  return [order.product_name, order.sku, qtyText].filter(Boolean).join(" / ");
}

function labelBottomCode(order) {
  return String(order.bottom_code || order.routing_code || "031 000").trim();
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

function code128BarcodeSvg(value) {
  const patterns = [
    "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
    "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
    "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
    "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
    "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
    "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
    "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
    "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
    "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
    "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
    "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
  ];
  const encoded = String(value || "-").replace(/[^\x20-\x7e]/g, "-");
  const values = [104, ...encoded.split("").map((char) => char.charCodeAt(0) - 32)];
  const checksum = values.slice(1).reduce((total, next, index) => total + next * (index + 1), values[0]) % 103;
  values.push(checksum, 106);
  const moduleWidth = 2;
  const height = 80;
  let x = 20;
  const rects = [];

  values.forEach((code) => {
    patterns[code].split("").forEach((unit, index) => {
      const width = Number(unit) * moduleWidth;
      if (index % 2 === 0) rects.push(`<rect x="${x}" y="0" width="${width}" height="${height}" />`);
      x += width;
    });
  });

  return `<svg viewBox="0 0 ${x + 20} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Code128 송장번호 바코드" fill="#000" shape-rendering="crispEdges">${rects.join("")}</svg>`;
}

async function verifyCertificatePublic() {
  const certificateNumber = normalizeCertificateNumberInput(state.forms.verifySerial);
  state.forms.verifySerial = certificateNumber;
  state.verification.result = null;
  state.verification.error = "";

  if (!certificateNumberPattern.test(certificateNumber)) {
    state.verification.error = "올바른 인증번호 형식이 아닙니다.";
    render();
    return;
  }

  try {
    const data = window.FilmStockApi?.isEnabled()
      ? await window.FilmStockApi.verifyCertificate({
          certificateNumber,
          userAgent: navigator.userAgent
        })
      : await mockVerifyCertificate(certificateNumber);
    state.verification.result = data;
    state.verification.error = "";
  } catch (error) {
    state.verification.error = error.message || "인증번호를 확인할 수 없습니다.";
  }
  render();
}

async function mockVerifyCertificate(certificateNumber) {
  if (!(await isLocalCertificateCheckDigitValid(certificateNumber))) {
    return {
      result: "invalid",
      message: "등록되지 않은 인증번호입니다."
    };
  }
  const certificate = state.certificates.find((item) => item.certificate_number === certificateNumber);
  if (!certificate) {
    return {
      result: "invalid",
      message: "등록되지 않은 인증번호입니다."
    };
  }
  if (certificate.status !== "active") {
    return {
      result: certificate.status,
      message: certificate.status === "revoked" ? "사용 중지된 인증서입니다" : "재발급된 인증서입니다"
    };
  }
  certificate.verified_count = Number(certificate.verified_count || 0) + 1;
  certificate.last_verified_at = nowText();
  return {
    result: "success",
    message: "GLOC 정품 인증 완료",
    certificate: verificationCertificateView(certificate)
  };
}

function verificationCertificateView(certificate) {
  return {
    status: certificate.status,
    product_type: certificate.product_type,
    product_name: certificate.product_name,
    installation_date: certificate.installation_date,
    dealer_name: certificate.dealer_name,
    vehicle_number_masked: maskVehicleNumber(certificate.vehicle_number),
    verified_count: certificate.verified_count,
    last_verified_at: certificate.last_verified_at
  };
}

async function createLocalCertificateForReservation(reservation) {
  const existing = certificateForReservation(reservation?.reservation_id);
  if (existing) return existing;
  const issueDate = compactDateValue(new Date());
  const serial = await generateLocalCertificateNumber(reservation.dealer_code, issueDate);
  const now = nowText();
  return {
    id: `CERT-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    reservation_id: reservation.reservation_id,
    dealer_id: reservation.dealer_code,
    dealer_code: reservation.dealer_code,
    dealer_name: reservation.dealer_name,
    customer_name: reservation.customer_name || "",
    customer_phone: reservation.customer_phone || "",
    vehicle_number: reservation.vehicle_number || "",
    vehicle_model: reservation.vehicle_model || "",
    product_type: productTypeForCertificate(reservation),
    product_name: reservation.product_name || "",
    product_serial: serial,
    certificate_number: serial,
    random_code: serial.split("-")[3] || "",
    check_digit: serial.split("-")[4] || "",
    installation_date: reservation.completed_at || now,
    issued_at: now,
    issued_by: state.session?.login_id || "",
    verified_count: 0,
    last_verified_at: "",
    status: "active",
    created_at: now
  };
}

async function generateLocalCertificateNumber(dealerCode, issueDate) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const randomCode = localCertificateRandomCode();
    const base = ["GLOC", String(dealerCode || "").toUpperCase(), issueDate, randomCode].join("-");
    const checkDigit = await certificateCheckDigit(base);
    const certificateNumber = `${base}-${checkDigit}`;
    if (!state.certificates.some((item) => item.certificate_number === certificateNumber)) return certificateNumber;
  }
  throw new Error("인증번호 중복이 반복되어 생성하지 못했습니다. 다시 시도해 주세요.");
}

function localCertificateRandomCode() {
  const bytes = new Uint8Array(6);
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
  else bytes.forEach((_, index) => (bytes[index] = Math.floor(Math.random() * 255)));
  return Array.from(bytes, (byte) => certificateRandomChars[byte % certificateRandomChars.length]).join("");
}

async function certificateCheckDigit(base) {
  if (window.crypto?.subtle) {
    const digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(base));
    const bytes = new Uint8Array(digest);
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[bytes[bytes.length - 1] % 26];
  }
  const total = String(base).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[total % 26];
}

async function isLocalCertificateCheckDigitValid(certificateNumber) {
  const parts = String(certificateNumber || "").split("-");
  if (parts.length !== 5) return false;
  const checkDigit = parts.pop();
  return (await certificateCheckDigit(parts.join("-"))) === checkDigit;
}

function normalizeCertificateNumberInput(value) {
  return String(value || "").toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9-]/g, "");
}

function productTypeForCertificate(source) {
  const text = [source.category, source.product_name, source.sku].join(" ").toLowerCase();
  if (text.includes("ppf")) return "PPF";
  if (text.includes("틴팅") || text.includes("tint") || text.includes("tn-")) return "TINTING";
  return source.category || "FILM";
}

function maskVehicleNumber(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const digits = text.match(/\d{4}$/);
  if (digits) return `****${digits[0]}`;
  return text.length <= 2 ? `${text[0]}*` : `${text.slice(0, 2)}****`;
}

function formatDateOnly(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return text.slice(0, 10);
}

function printCertificate(certificateId) {
  const certificate = state.certificates.find((item) => item.id === certificateId || item.certificate_number === certificateId);
  if (!certificate) throw new Error("출력할 정품인증서를 찾을 수 없습니다.");
  if (state.session?.role === "dealer" && certificate.dealer_code !== state.session.dealer_code) {
    throw new Error("본인 대리점 인증서만 출력할 수 있습니다.");
  }

  const printWindow = window.open("", "_blank", "width=1000,height=760");
  if (!printWindow) throw new Error("팝업이 차단되어 정품인증서 출력창을 열 수 없습니다.");
  printWindow.document.open();
  printWindow.document.write(buildCertificateHtml(certificate));
  printWindow.document.close();
  showToast("정품인증서 출력창을 열었습니다.");
}

function buildCertificateHtml(certificate) {
  const verifyUrl = certificateVerifyUrl(certificate.dealer_code);
  const qrSrc = certificateQrUrl(verifyUrl);
  const installDate = formatDateOnly(certificate.installation_date || certificate.issued_at || nowText());
  const publicRoot = appPublicBase()
    .replace(/\/index\.html$/i, "")
    .replace(/\/login$/i, "")
    .replace(/\/verify$/i, "")
    .replace(/\/$/, "");
  const templateSrc = `${publicRoot}/certificates/gloc-certificate-template.png`;
  const localTemplateSrc = `${publicRoot}/public/certificates/gloc-certificate-template.png`;
  const productType = String(certificate.product_type || "").toUpperCase();
  const isPpf = productType.includes("PPF");
  const isTinting = productType.includes("TINT") || productType.includes("틴팅");
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GLOC 정품인증서</title>
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        background: #f4f0ea;
        color: #222;
        font-family: "Times New Roman", Georgia, "Apple SD Gothic Neo", "Noto Sans KR", serif;
      }
      body {
        min-height: 100vh;
        display: grid;
        place-items: center;
        gap: 14px;
        padding: 20px;
      }
      .certificate-viewport {
        position: relative;
        width: min(297mm, calc(100vw - 40px));
        height: 210mm;
      }
      .certificate-wrapper {
        position: relative;
        width: 297mm;
        height: 210mm;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.18);
        page-break-inside: avoid;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .certificate-background {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .overlay-data {
        position: absolute;
        inset: 0;
        color: #222;
        letter-spacing: 0.04em;
      }
      .cert-value {
        position: absolute;
        left: 80mm;
        width: 88mm;
        color: #222;
        font-family: Arial, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
        font-size: 4.1mm;
        font-weight: 600;
        line-height: 1.15;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cert-serial {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 3.7mm;
        letter-spacing: 0.02em;
      }
      .cert-product-name { top: 119.3mm; }
      .cert-serial-number { top: 127.8mm; }
      .cert-vehicle-number { top: 136.4mm; }
      .cert-install-date { top: 145.1mm; }
      .cert-dealer { top: 153.8mm; }
      .cert-check {
        position: absolute;
        top: 107.8mm;
        width: 4.7mm;
        height: 4.7mm;
        display: grid;
        place-items: center;
        color: #222;
        font-family: Arial, "Apple SD Gothic Neo", sans-serif;
        font-size: 4mm;
        font-weight: 900;
        line-height: 1;
      }
      .cert-check.ppf { left: 74.4mm; }
      .cert-check.tinting { left: 102.8mm; }
      .cert-qr {
        position: absolute;
        left: 203.1mm;
        top: 119.8mm;
        width: 31.2mm;
        height: 31.2mm;
        display: block;
        background: #fff;
        image-rendering: pixelated;
      }
      .print-guide {
        width: min(297mm, calc(100vw - 40px));
        padding: 12px 14px;
        border: 1px solid #d8c9b2;
        border-radius: 10px;
        background: #fff8ef;
        color: #4d3720;
        font-family: Arial, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
        font-size: 14px;
        font-weight: 700;
        text-align: center;
      }
      .actions { display: flex; justify-content: center; gap: 8px; }
      .actions button {
        min-height: 44px;
        padding: 0 20px;
        border: 0;
        border-radius: 8px;
        background: #cf4e42;
        color: #fff;
        font-family: Arial, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
        font-weight: 900;
        cursor: pointer;
      }
      .actions button.secondary { background: #222; }
      @media print {
        @page { size: A4 landscape; margin: 0; }
        html, body {
          width: 297mm;
          height: 210mm;
          min-height: 210mm;
          padding: 0;
          background: #fff;
        }
        body { display: block; }
        .certificate-viewport {
          width: 297mm;
          height: 210mm;
        }
        .certificate-wrapper {
          position: relative;
          width: 297mm;
          height: 210mm;
          box-shadow: none;
          transform: none !important;
        }
        .print-guide, .actions { display: none; }
      }
      @media screen and (max-width: 1180px) {
        body { place-items: start center; overflow: auto; }
        .certificate-wrapper { transform-origin: top left; }
      }
    </style>
  </head>
  <body>
    <main class="certificate-viewport">
      <div class="certificate-wrapper">
        <img
          class="certificate-background"
          src="${escapeAttr(templateSrc)}"
          onerror="this.onerror=null;this.src='${escapeAttr(localTemplateSrc)}';"
          alt=""
        />
        <section class="overlay-data" aria-label="GLOC 정품인증서 데이터">
          ${isPpf ? '<span class="cert-check ppf">✓</span>' : ""}
          ${isTinting ? '<span class="cert-check tinting">✓</span>' : ""}
          <div class="cert-value cert-product-name">${escapeHtml(certificate.product_name || "-")}</div>
          <div class="cert-value cert-serial cert-serial-number">${escapeHtml(certificate.certificate_number || "-")}</div>
          <div class="cert-value cert-vehicle-number">${escapeHtml(certificate.vehicle_number || "-")}</div>
          <div class="cert-value cert-install-date">${escapeHtml(installDate || "-")}</div>
          <div class="cert-value cert-dealer">${escapeHtml(certificate.dealer_name || certificate.dealer_code || "-")}</div>
          <img class="cert-qr" src="${escapeAttr(qrSrc)}" alt="GLOC 정품인증 QR" />
        </section>
      </div>
    </main>
    <div class="print-guide">인쇄 전 브라우저 인쇄 설정에서 “배경 그래픽” 옵션을 활성화하세요.</div>
    <div class="actions">
      <button type="button" onclick="showPrintGuideAndPrint()">인쇄</button>
      <button class="secondary" type="button" onclick="window.close()">닫기</button>
    </div>
    <script>
      function fitCertificatePreview() {
        if (window.matchMedia("print").matches) return;
        const viewport = document.querySelector(".certificate-viewport");
        const sheet = document.querySelector(".certificate-wrapper");
        if (!viewport || !sheet) return;
        const scale = Math.min(1, viewport.clientWidth / sheet.offsetWidth);
        viewport.style.height = (sheet.offsetHeight * scale) + "px";
        sheet.style.transform = "scale(" + scale + ")";
      }
      function showPrintGuideAndPrint() {
        alert("인쇄 설정에서 '배경 그래픽' 옵션을 활성화하세요.");
        window.print();
      }
      window.addEventListener("load", fitCertificatePreview);
      window.addEventListener("resize", fitCertificatePreview);
    </script>
  </body>
</html>`;
}

function certificateField(label, value, className = "") {
  return `<div class="cert-field ${escapeAttr(className)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "-")}</strong></div>`;
}

function certificateVerifyUrl(dealerCode) {
  const base = appPublicBase().replace(/\/index\.html$/i, "").replace(/\/login$/i, "").replace(/\/$/, "");
  const dealer = dealerCode ? `?dealer=${encodeURIComponent(dealerCode)}` : "";
  return `${base}/verify${dealer}`;
}

function certificateQrUrl(url) {
  const base = appPublicBase().replace(/\/index\.html$/i, "").replace(/\/login$/i, "").replace(/\/$/, "");
  return `${base}/api/qr?data=${encodeURIComponent(url)}`;
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
      vehicle_number: state.forms.reservationVehicleNumber,
      vehicle_model: state.forms.reservationVehicleModel,
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
      vehicle_number: state.forms.reservationVehicleNumber,
      vehicle_model: state.forms.reservationVehicleModel,
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
  state.forms.reservationVehicleNumber = "";
  state.forms.reservationVehicleModel = "";
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
    if (data?.certificate) upsertCertificate(data.certificate);
    if (data?.inventory) upsertInventory(data.inventory);
  } else {
    adjustLocalInventory(reservation.dealer_code, reservation.sku, -Number(reservation.qty || 0), { requireEnoughStock: true });
    const completedAt = nowText();
    state.reservations = state.reservations.map((item) => (
      item.reservation_id === reservationId
        ? { ...item, status: "시공완료", completed_at: completedAt, updated_at: completedAt }
        : item
    ));
    const updatedReservation = state.reservations.find((item) => item.reservation_id === reservationId);
    upsertCertificate(await createLocalCertificateForReservation(updatedReservation));
  }
  render();
  showToast("시공완료 처리했습니다. 정품인증서가 자동 발급되었습니다.");
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
  const isTint = productCategoryMatches({ category: state.forms.productCategory }, "tint");
  const tintStrength = clampNullableNumber(state.forms.productShadePercent, 0, 100, 35);
  const transparencyPercent = clampNullableNumber(state.forms.productOpacity, 0, 100, 0);
  const payload = {
    sku: state.forms.productSku.trim(),
    product_name: state.forms.productName.trim(),
    category: state.forms.productCategory,
    brand: state.forms.productBrand.trim() || "GLOC",
    product_code: state.forms.productSku.trim(),
    color_name: state.forms.productColorName.trim() || colorNameFromText(state.forms.productName),
    color_hex: normalizeHexColor(state.forms.productColorHex, isTint ? "#111111" : "#f7fbf9"),
    color_chart_image_url: state.forms.productColorChartImageUrl.trim(),
    finish_type: isTint ? "" : state.forms.productFinishType,
    transparency_type: isTint ? "" : state.forms.productTransparencyType,
    opacity: transparencyPercent,
    transparency_percent: isTint ? transparencyPercent : "",
    shade_percent: isTint ? tintStrength : "",
    tint_strength: isTint ? tintStrength : "",
    available_parts: isTint ? tintAreaOptions.map((area) => area.key).join(",") : "",
    description: state.forms.productDescription.trim(),
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
    upsertProduct({ ...payload, color: payload.color_name || colorNameFromText(payload.product_name) });
    inventoryOwnerAccounts().forEach((account) => {
      const exists = state.inventory.some((row) => row.dealer_code === account.dealer_code && row.sku === payload.sku);
      if (!exists) {
        upsertInventory({
          dealer_code: account.dealer_code,
          dealer_name: account.dealer_name,
          product_name: payload.product_name,
          sku: payload.sku,
          category: payload.category,
          color: payload.color_name || colorNameFromText(payload.product_name),
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
  if (!canAccessScreen(screen)) {
    showToast("관리자만 접근할 수 있습니다.");
    return;
  }
  if (screen === "inventoryManage") {
    ensureInventoryForm();
  }
  if (screen === "productManage") {
    ensureProductForm();
  }
  if (screen === "vehicleAdmin") {
    ensureVehicleForm();
  }
  if (screen === "dealerInfo" && state.session?.role === "dealer") {
    prepareDealerInfoForm();
  }
  state.screen = screen;
  render();
  scrollTop();
}

function canAccessScreen(screen) {
  const adminOnlyScreens = ["links", "admin", "productManage", "sales", "labelSettings", "vehicleAdmin"];
  return !adminOnlyScreens.includes(screen) || state.session?.role === "admin";
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
  state.forms.productBrand = product.brand || "GLOC";
  state.forms.productColorName = product.color_name || product.color || colorNameFromText(product.product_name);
  state.forms.productColorHex = normalizeHexColor(product.color_hex, productCategoryMatches(product, "tint") ? "#111111" : "#f7fbf9");
  state.forms.productColorChartImageUrl = product.color_chart_image_url || "";
  state.forms.productFinishType = normalizePpfFinishType(productPpfFinishType(product));
  state.forms.productTransparencyType = ppfTransparencyOptionValue(product.transparency_type || product.transparencyType || "transparent");
  state.forms.productOpacity = productCategoryMatches(product, "tint")
    ? productTransparencyPercent(product)
    : nullableNumber(product.opacity ?? 100);
  state.forms.productShadePercent = productTintStrength(product);
  state.forms.productAvailableParts = product.available_parts ?? tintAreaOptions.map((area) => area.key).join(",");
  state.forms.productDescription = product.description || "";
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

function productManageRows() {
  const query = normalize(state.filters.productManageQuery || "");
  return state.products.filter((product) => {
    if (!query) return true;
    return productSearchFields(product).some((value) => normalize(value).includes(query));
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

function visibleCertificates() {
  const query = normalize(state.filters.certificateQuery);
  return state.certificates
    .filter((certificate) => state.session?.role !== "dealer" || certificate.dealer_code === state.session.dealer_code)
    .filter((certificate) => state.session?.role !== "admin" || state.filters.certificateDealerCode === "전체" || certificate.dealer_code === state.filters.certificateDealerCode)
    .filter((certificate) => {
      if (!query) return true;
      return [certificate.certificate_number, certificate.dealer_name, certificate.dealer_code, certificate.vehicle_number, certificate.vehicle_model, certificate.product_name, certificate.customer_name]
        .some((value) => normalize(value).includes(query));
    })
    .sort((a, b) => String(b.issued_at || b.created_at || "").localeCompare(String(a.issued_at || a.created_at || "")));
}

function certificateDealerOptions() {
  const dealers = new Map();
  state.certificates.forEach((certificate) => {
    if (!certificate.dealer_code) return;
    dealers.set(certificate.dealer_code, {
      dealer_code: certificate.dealer_code,
      dealer_name: certificate.dealer_name || dealerNameByCode(certificate.dealer_code)
    });
  });
  return Array.from(dealers.values()).sort((a, b) => String(a.dealer_name).localeCompare(String(b.dealer_name), "ko"));
}

function certificateForReservation(reservationId) {
  return state.certificates.find((certificate) => String(certificate.reservation_id) === String(reservationId));
}

function upsertCertificate(certificate) {
  if (!certificate) return;
  const index = state.certificates.findIndex((item) => item.id === certificate.id || item.certificate_number === certificate.certificate_number || item.reservation_id === certificate.reservation_id);
  if (index >= 0) state.certificates[index] = { ...state.certificates[index], ...certificate };
  else state.certificates.unshift(certificate);
}

function certificateStatusLabel(status) {
  if (status === "active") return "정상";
  if (status === "revoked") return "사용중지";
  if (status === "reissued") return "재발급";
  return status || "대기";
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

function activeVehicles() {
  const source = state.vehicles.length ? state.vehicles : createMockVehicles();
  return source.filter((vehicle) => toBool(vehicle.is_active));
}

function selectedConsultationVehicle() {
  const vehicles = activeVehicles();
  return vehicles.find((vehicle) => vehicle.id === state.consultation.vehicleId) || vehicles[0] || teslaVehicleSeed[0];
}

function consultationCanUse3d(vehicle) {
  if (!vehicle || !String(vehicle.glb_file_url || "").trim()) return false;
  return toBool(vehicle.three_d_enabled) || vehicle.id === "tesla-model3-highland";
}

function publicAssetUrl(path) {
  const value = String(path || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) return value;
  const appRoot = appPublicBase()
    .replace(/\/index\.html$/i, "")
    .replace(/\/login$/i, "")
    .replace(/\/verify$/i, "")
    .replace(/\/$/, "");
  return value.startsWith("/") ? `${appRoot}${value}` : `${appRoot}/${value}`;
}

function vehicleColorByName(name) {
  return vehicleColorOptions.find((color) => color.name === name) || vehicleColorOptions[0];
}

function vehicleDisplayName(vehicle) {
  if (!vehicle) return "Tesla";
  return [vehicle.brand, vehicle.model_name, vehicle.generation_name]
    .filter(Boolean)
    .join(" ");
}

function consultationVehicleModels() {
  return Array.from(new Set(activeVehicles().map((vehicle) => vehicle.model_name).filter(Boolean)));
}

function consultationVehicleGenerations(modelName) {
  return activeVehicles().filter((vehicle) => vehicle.model_name === modelName);
}

function selectConsultationModel(modelName) {
  const vehicle = consultationVehicleGenerations(modelName)[0];
  if (!vehicle) return;
  state.consultation.vehicleId = vehicle.id;
  state.consultation.color = vehicle.default_color || state.consultation.color;
}

function productCategoryMatches(product, key) {
  const category = normalize(product?.category || "");
  const name = normalize(product?.product_name || product?.name || "");
  if (key === "tint") return category.includes("틴팅") || category.includes("tint") || name.includes("틴팅");
  if (key === "ppf") return category.includes("ppf") || name.includes("ppf");
  return false;
}

function productDisplayName(product) {
  return product?.product_name || product?.name || product?.sku || "-";
}

function consultationTintProducts() {
  return activeProducts().filter((product) => productCategoryMatches(product, "tint"));
}

function consultationPpfProducts() {
  return activeProducts().filter((product) => productCategoryMatches(product, "ppf"));
}

function selectedConsultationTintProduct() {
  if (state.consultation.tintEnabled === false) return null;
  const products = consultationTintProducts();
  return products.find((product) => product.sku === state.consultation.tintSku) || null;
}

function selectedConsultationPpfProduct() {
  if (state.consultation.ppfEnabled === false) return null;
  const products = consultationPpfProducts();
  return products.find((product) => product.sku === state.consultation.ppfSku) || null;
}

function selectedConsultationTintTarget() {
  const key = state.consultation.tintTarget || "frontGlass";
  return tintAreaOptions.some((area) => area.key === key) ? key : "frontGlass";
}

function consultationAppliedPpfMap() {
  if (!state.consultation.appliedPpfMap || typeof state.consultation.appliedPpfMap !== "object") state.consultation.appliedPpfMap = {};
  consultationApplications()
    .filter((item) => item.category === "PPF" && item.productId)
    .forEach((item) => {
      const canonical = canonicalBodyPartFromLegacy(item.partId) || item.partId;
      if (!state.consultation.appliedPpfMap[canonical]) {
        state.consultation.appliedPpfMap[canonical] = state.products.find((product) => product.sku === item.productId) || {
          sku: item.productId,
          product_name: item.productName,
          color_hex: item.colorHex,
          finish_type: item.finishType,
          transparency_type: item.transparencyType,
          opacity: item.opacity
        };
      }
    });
  return state.consultation.appliedPpfMap;
}

function consultationAppliedTintMap() {
  if (!state.consultation.appliedTintMap || typeof state.consultation.appliedTintMap !== "object") state.consultation.appliedTintMap = {};
  state.consultation.appliedTintMap = Object.fromEntries(
    Object.entries(state.consultation.appliedTintMap)
      .map(([partId, product]) => [canonicalGlassPartFromLegacy(partId) || partId, product])
      .filter(([partId, product]) => partId && product)
  );
  consultationApplications()
    .filter((item) => item.category === "TINTING" && item.productId)
    .forEach((item) => {
      const canonical = canonicalGlassPartFromLegacy(item.partId) || item.partId;
      if (!state.consultation.appliedTintMap[canonical]) {
        state.consultation.appliedTintMap[canonical] = state.products.find((product) => product.sku === item.productId) || {
          sku: item.productId,
          product_name: item.productName,
          color_hex: item.colorHex,
          shade_percent: item.tintStrength ?? item.shadePercent,
          tint_strength: item.tintStrength ?? item.shadePercent,
          opacity: item.transparencyPercent ?? item.opacity,
          transparency_percent: item.transparencyPercent ?? item.opacity
        };
      }
    });
  return state.consultation.appliedTintMap;
}

function legacyBodyPartFor(partId) {
  return consultationBodyPartOptions.find((part) => part.key === partId)?.legacyKey || partId;
}

function legacyGlassPartFor(partId) {
  const canonical = canonicalGlassPartFromLegacy(partId) || partId;
  return consultationGlassPartOptions.find((part) => part.key === canonical)?.legacyKey || selectedConsultationTintTarget();
}

function canonicalBodyPartFromLegacy(partId, meshName = "") {
  if (!partId) return "";
  if (consultationBodyPartOptions.some((part) => part.key === partId)) return partId;
  const name = normalizeMeshName(meshName);
  const side = meshSideFromName(name);
  const mappings = {
    hood: "hood",
    front_bumper: "frontBumper",
    rear_bumper: "rearBumper",
    roof: "roof",
    trunk: "trunk"
  };
  if (mappings[partId]) return mappings[partId];
  if (partId === "front_door") return side === "right" ? "frontDoorRight" : "frontDoorLeft";
  if (partId === "rear_door") return side === "right" ? "rearDoorRight" : "rearDoorLeft";
  if (partId === "front_fender") return side === "right" ? "fenderRight" : "fenderLeft";
  if (partId === "rear_fender") return side === "right" ? "rearQuarterRight" : "rearQuarterLeft";
  if (partId === "side_skirt") return side === "right" ? "sideSkirtRight" : "sideSkirtLeft";
  return "";
}

function canonicalGlassPartFromLegacy(partId, meshName = "") {
  if (!partId) return "";
  if (consultationGlassPartOptions.some((part) => part.key === partId)) return partId;
  const name = normalizeMeshName(meshName);
  const normalizedPart = normalizeMeshName(partId);
  if (partId === "frontGlass" || ["frontwindshield", "windshield", "front_glass"].includes(normalizedPart)) return "frontGlass";
  if (partId === "rearGlass" || ["rearwindshield", "rearwindow", "backglass", "back_glass", "rear_glass"].includes(normalizedPart)) return "rearGlass";
  if (partId === "roofGlass" || ["roofglass", "roof_glass", "sunroof", "panoramicroof", "panoramic_roof", "glass_roof"].includes(normalizedPart)) return "roofGlass";
  if (partId === "frontSideGlass" || ["frontdoorglassleft", "frontdoorglassright", "driverwindow", "passengerwindow", "firstrowglass"].includes(normalizedPart)) return "firstRowGlass";
  if (partId === "rearSideGlass" || ["reardoorglassleft", "reardoorglassright", "secondrowwindowleft", "secondrowwindowright", "secondrowglass"].includes(normalizedPart)) return "secondRowGlass";
  if (name.includes("front") && (name.includes("side") || name.includes("door") || name.includes("window"))) return "firstRowGlass";
  if ((name.includes("rear") || name.includes("second")) && (name.includes("side") || name.includes("door") || name.includes("window"))) return "secondRowGlass";
  return "";
}

function meshSideFromName(name) {
  const text = normalizeMeshName(name);
  if (/(^|_)(right|r|fr|rr|rh)(_|$)/.test(text) || text.includes("_right")) return "right";
  if (/(^|_)(left|l|fl|rl|lh)(_|$)/.test(text) || text.includes("_left")) return "left";
  return "left";
}

function consultationCategoryFromPart(partId) {
  if (consultationBodyPartOptions.some((part) => part.key === partId)) return "body";
  if (consultationGlassPartOptions.some((part) => part.key === partId)) return "glass";
  if (ppfPartOptions.some((part) => part.key === partId)) return "body";
  if (tintAreaOptions.some((area) => area.key === partId)) return "glass";
  return null;
}

function consultationFilteredProducts(type) {
  const products = type === "tint" ? consultationTintProducts() : consultationPpfProducts();
  const query = normalize(type === "tint" ? state.consultation.tintProductQuery : state.consultation.ppfProductQuery);
  const filterValue = type === "tint" ? state.consultation.tintFilter : state.consultation.ppfFilter;
  return products.filter((product) => {
    if (!consultationProductMatchesFilter(product, type, filterValue)) return false;
    if (!query) return true;
    return productSearchFields(product).some((value) => normalize(value).includes(query));
  });
}

function productSearchFields(product) {
  return [
    product.product_name,
    product.name,
    product.sku,
    product.product_code,
    product.brand,
    product.category,
    product.color,
    product.color_name,
    product.color_hex,
    product.colorHex,
    product.finish_type,
    product.finishType,
    product.transparency_type,
    product.transparencyType,
    product.tint_strength,
    product.tintStrength,
    product.shade_percent,
    product.transparency_percent,
    product.transparencyPercent,
    product.opacityPercent,
    product.available_parts,
    product.availableParts,
    product.description
  ];
}

function consultationProductMatchesFilter(product, type, filterValue = "전체") {
  if (!filterValue || filterValue === "전체") return true;
  if (type === "tint") {
    if (filterValue.startsWith("shade:")) return productTintStrength(product) === Number(filterValue.replace("shade:", ""));
    return normalize(product.brand).includes(normalize(filterValue)) || normalize(product.color_name || product.color).includes(normalize(filterValue));
  }
  if (filterValue.startsWith("finish:")) return normalizePpfFinishType(productPpfFinishType(product)) === filterValue.replace("finish:", "");
  if (filterValue.startsWith("transparency:")) {
    const normalizedTransparency = normalizePpfTransparencyType(product.transparencyType || product.transparency_type);
    const storedValue = normalizedTransparency === "semiTransparent" ? "semi_transparent" : normalizedTransparency;
    return storedValue === filterValue.replace("transparency:", "");
  }
  return normalize(product.brand).includes(normalize(filterValue)) || normalize(product.color_name || product.color).includes(normalize(filterValue));
}

function consultationTintFilterOptions() {
  return [
    { value: "전체", label: "전체" },
    ...tintStrengthOptions.map((value) => ({ value: `shade:${value}`, label: `${value}%` }))
  ];
}

function consultationPpfFilterOptions() {
  return [
    { value: "전체", label: "전체" },
    ...productFinishOptions.map((item) => ({ value: `finish:${item.value}`, label: item.label })),
    ...productTransparencyOptions.map((item) => ({ value: `transparency:${item.value}`, label: item.label }))
  ];
}

function productTintStrength(product) {
  const tintValue = product?.tintStrength ?? product?.tint_strength ?? product?.shade_percent;
  if (tintValue !== null && tintValue !== undefined && tintValue !== "") {
    return clampNullableNumber(tintValue, 0, 100, 0);
  }
  const match = String(product?.product_name || product?.sku || "").match(/(\d{1,2})\s*%/);
  if (!match) return 0;
  return clampNullableNumber(match[1], 0, 100, 0);
}

function productTransparencyPercent(product) {
  const transparencyValue = product?.transparencyPercent ?? product?.transparency_percent ?? product?.opacityPercent ?? product?.opacity_percent ?? product?.opacity;
  return clampNullableNumber(transparencyValue, 0, 100, 0);
}

function productAvailableParts(product) {
  const parts = csvToArray(product?.availableParts || product?.available_parts);
  const source = parts.length ? parts : tintAreaOptions.map((area) => area.key);
  return Array.from(new Set(source.map((part) => canonicalGlassPartFromLegacy(part) || part)));
}

function productBrandText(product) {
  return [product?.brand || "GLOC", product?.color_name || product?.color].filter(Boolean).join(" · ");
}

function productMetaText(product) {
  const opacity = productTransparencyPercent(product);
  if (productCategoryMatches(product, "tint")) return `틴팅 농도 ${productTintStrength(product)}% · 투명도 ${opacity}%`;
  const finishValue = normalizePpfFinishType(productPpfFinishType(product));
  const transparencyValue = normalizePpfTransparencyType(product.transparencyType || product.transparency_type) === "semiTransparent" ? "semi_transparent" : normalizePpfTransparencyType(product.transparencyType || product.transparency_type);
  const finish = productFinishOptions.find((item) => item.value === finishValue)?.label || "유광";
  const transparency = productTransparencyOptions.find((item) => item.value === transparencyValue)?.label || "투명";
  return `${finish} · ${transparency} · 투명도 ${opacity}%`;
}

function csvToArray(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeHexColor(hex, fallback = "#111111") {
  if (hex === undefined || hex === null) return fallback;
  const value = String(hex).trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) return value;
  if (/^[0-9A-Fa-f]{6}$/.test(value)) return `#${value}`;
  return fallback;
}

function validHexColor(value, fallback = "#111111") {
  return normalizeHexColor(value, fallback);
}

function syncProductHexInputs() {
  const text = document.querySelector("#productColorHexText");
  const color = document.querySelector("#productColorHex");
  const chip = document.querySelector(".color-chip-preview");
  const fallback = productCategoryMatches({ category: state.forms.productCategory }, "tint") ? "#111111" : "#f7fbf9";
  const value = normalizeHexColor(state.forms.productColorHex, fallback);
  if (text && text.value !== state.forms.productColorHex) text.value = state.forms.productColorHex;
  if (color && color.value !== value) color.value = value;
  if (chip) chip.style.background = value;
}

function consultationTintOpacity(product) {
  return productTransparencyPercent(product) / 100;
}

function consultationTintAreas() {
  const saved = state.consultation?.tintAreas || {};
  const legacyTintAreaAliases = {
    firstRowGlass: "frontSideGlass",
    secondRowGlass: "rearSideGlass"
  };
  return Object.fromEntries(
    tintAreaOptions.map((area) => {
      const rawValue = saved[area.key] ?? saved[legacyTintAreaAliases[area.key]] ?? area.defaultTintStrength;
      const value = Number(rawValue);
      return [area.key, Number.isFinite(value) ? clampNullableNumber(value, 0, 100, area.defaultTintStrength) : area.defaultTintStrength];
    })
  );
}

function consultationAverageTintOpacity() {
  if (state.consultation.tintEnabled === false) return 0;
  const appliedProducts = Object.values(consultationAppliedTintMap()).filter(Boolean);
  if (appliedProducts.length) {
    return appliedProducts.reduce((sum, product) => sum + productTransparencyPercent(product) / 100, 0) / appliedProducts.length;
  }
  const selected = selectedConsultationTintProduct();
  return selected ? productTransparencyPercent(selected) / 100 : 0;
}

function consultationProductStock(product) {
  if (!product) return { qty: 0, label: "재고 없음", disabled: true };
  const dealerCode = state.session?.role === "dealer" ? state.session.dealer_code : headOfficeCode;
  const rows = state.inventory.filter((row) => row.sku === product.sku && (row.dealer_code === dealerCode || state.session?.role === "admin"));
  const qty = rows.reduce((sum, row) => sum + Number(row.stock_qty || 0), 0);
  if (qty <= 0) return { qty, label: "품절", disabled: true };
  const safety = Math.max(...rows.map((row) => Number(row.safety_stock || 0)), 0);
  if (qty <= safety) return { qty, label: `부족 ${roll(qty)}`, disabled: false };
  return { qty, label: `재고 ${roll(qty)}`, disabled: false };
}

function consultationProductPrice(product, type) {
  if (!product) return 0;
  const dealerCode = state.session?.role === "dealer" ? state.session.dealer_code : headOfficeCode;
  const base = dealerSalePrice(product, dealerCode);
  if (type === "tint") return Math.round(base * vehicleQuoteMultiplier(selectedConsultationVehicle()) * 0.8);
  const name = normalize(productDisplayName(product));
  const factor = name.includes("매트") || name.includes("matte") ? 1.12 : name.includes("카본") || name.includes("carbon") ? 1.18 : 1;
  return Math.round(base * 0.12 * factor);
}

function vehicleQuoteMultiplier(vehicle) {
  const model = String(vehicle?.model_name || "");
  if (model.includes("Model X") || model.includes("Cybertruck")) return 1.25;
  if (model.includes("Model Y") || model.includes("Model S")) return 1.12;
  return 1;
}

function selectedPpfPartObjects() {
  const applied = consultationAppliedPpfMap();
  const selected = new Set(Object.keys(applied).filter((partId) => applied[partId]));
  const legacySelected = new Set(Array.from(selected).map(legacyBodyPartFor));
  if ((state.consultation.ppfParts || []).includes("full_body")) return ppfPartOptions.filter((part) => part.full);
  return ppfPartOptions.filter((part) => legacySelected.has(part.key) && !part.full);
}

function consultationApplications() {
  return Array.isArray(state.consultation.applications) ? state.consultation.applications : [];
}

function consultationApplicationForPart(partId, category) {
  return consultationApplications().find((item) => item.partId === partId && item.category === category);
}

function productApplicationRecord(partId, category, product) {
  const partName = consultationPartLabel(partId);
  return {
    partId,
    partName,
    category,
    productId: product?.sku || "",
    productName: productDisplayName(product),
    colorHex: normalizeHexColor(product?.colorHex ?? product?.color_hex, category === "TINTING" ? "#111111" : "#ffd36d"),
    finishType: product?.finishType || product?.finish_type || "",
    transparencyType: product?.transparencyType || product?.transparency_type || "",
    opacity: productTransparencyPercent(product),
    transparencyPercent: category === "TINTING" ? productTransparencyPercent(product) : "",
    shadePercent: category === "TINTING" ? productTintStrength(product) : "",
    tintStrength: category === "TINTING" ? productTintStrength(product) : ""
  };
}

function applySelectedTintProductToTarget() {
  const product = selectedConsultationTintProduct();
  if (!product) return;
  const target = state.consultation.selectedCategory === "glass"
    ? state.consultation.selectedPartId
    : canonicalGlassPartFromLegacy(selectedConsultationTintTarget());
  const legacyTarget = legacyGlassPartFor(target);
  state.consultation.tintAreas = {
    ...consultationTintAreas(),
    [legacyTarget]: productTintStrength(product)
  };
  consultationAppliedTintMap()[target] = product;
  upsertConsultationApplication(productApplicationRecord(target, "TINTING", product));
}

function upsertConsultationApplication(record) {
  state.consultation.applications = [
    ...consultationApplications().filter((item) => !(item.partId === record.partId && item.category === record.category)),
    record
  ];
}

function removeConsultationApplication(partId, category) {
  removeProductFromConsultationPart(partId, category);
  showToast(`${consultationPartLabel(partId)} 적용을 해제했습니다.`);
}

function setConsultationNoProduct(type) {
  const hasApplied = consultationApplications().some((item) => type === "tint" ? item.category === "TINTING" : item.category === "PPF");
  const hasPpfParts = type === "ppf" && (state.consultation.ppfParts || []).length > 0;
  if ((hasApplied || hasPpfParts) && !confirm("기존 적용 내역을 삭제하고 선택 안함으로 변경할까요?")) return;
  if (type === "tint") {
    consultationGlassPartOptions.forEach((area) => restoreConsultationGlassGroup(area.key));
    state.consultation.tintEnabled = false;
    state.consultation.tintSku = "";
    state.consultation.appliedTintMap = {};
    state.consultation.applications = consultationApplications().filter((item) => item.category !== "TINTING");
    if (state.consultation.selectedCategory === "glass") {
      clearConsultationSelectedTarget();
    }
  }
  if (type === "ppf") {
    disposeAllConsultationPpfOverlays();
    state.consultation.ppfEnabled = false;
    state.consultation.ppfSku = "";
    state.consultation.ppfParts = [];
    state.consultation.appliedPpfMap = {};
    state.consultation.applications = consultationApplications().filter((item) => item.category !== "PPF");
    if (state.consultation.selectedCategory === "body") {
      clearConsultationSelectedTarget();
    }
  }
  showToast(`${consultationProductTypeConfig[type].label} 선택 안함으로 변경했습니다.`);
}

function consultationApplyAll() {
  const didTint = selectedConsultationTintProduct();
  const didPpf = selectedConsultationPpfProduct();
  if (didTint) consultationApplyAllTint();
  if (didPpf) consultationApplyAllPpf();
  if (!didTint && !didPpf) throw new Error("먼저 적용할 PPF 또는 틴팅 제품을 선택해 주세요.");
}

function consultationApplyAllTint() {
  const tintProduct = selectedConsultationTintProduct();
  if (!tintProduct) throw new Error("틴팅 제품을 먼저 선택해 주세요.");
  state.consultation.tintEnabled = true;
  state.consultation.appliedTintMap = {};
  state.consultation.applications = consultationApplications().filter((item) => item.category !== "TINTING");
  const nextAreas = { ...consultationTintAreas() };
  consultationGlassPartOptions.forEach((area) => {
    nextAreas[area.key] = productTintStrength(tintProduct);
    state.consultation.appliedTintMap[area.key] = tintProduct;
    upsertConsultationApplication(productApplicationRecord(area.key, "TINTING", tintProduct));
  });
  state.consultation.tintAreas = nextAreas;
  clearConsultationSelectedTarget();
  refreshConsultationAfterOptionChange("tint");
  showToast("틴팅 제품을 전체 유리에 적용했습니다.");
}

function consultationClearAllTint() {
  consultationGlassPartOptions.forEach((area) => restoreConsultationGlassGroup(area.key));
  state.consultation.appliedTintMap = {};
  state.consultation.applications = consultationApplications().filter((item) => item.category !== "TINTING");
  if (state.consultation.selectedCategory === "glass") clearConsultationSelectedTarget();
  refreshConsultationAfterOptionChange("tint");
  showToast("전체 유리 틴팅을 해제했습니다.");
}

function consultationApplyAllPpf() {
  const ppfProduct = selectedConsultationPpfProduct();
  if (!ppfProduct) throw new Error("PPF 제품을 먼저 선택해 주세요.");
  disposeAllConsultationPpfOverlays();
  state.consultation.ppfEnabled = true;
  state.consultation.appliedPpfMap = {};
  state.consultation.applications = consultationApplications().filter((item) => item.category !== "PPF");
  consultationBodyPartOptions.forEach((part) => {
    state.consultation.appliedPpfMap[part.key] = ppfProduct;
    upsertConsultationApplication(productApplicationRecord(part.key, "PPF", ppfProduct));
  });
  state.consultation.ppfParts = Array.from(new Set(consultationBodyPartOptions.map((part) => part.legacyKey)));
  clearConsultationSelectedTarget();
  refreshConsultationAfterOptionChange("ppf");
  showToast("PPF 제품을 전체 차체 부위에 적용했습니다.");
}

function consultationClearAllPpf() {
  disposeAllConsultationPpfOverlays();
  state.consultation.ppfParts = [];
  state.consultation.appliedPpfMap = {};
  state.consultation.applications = consultationApplications().filter((item) => item.category !== "PPF");
  if (state.consultation.selectedCategory === "body") clearConsultationSelectedTarget();
  refreshConsultationAfterOptionChange("ppf");
  showToast("전체 PPF 오버레이를 해제했습니다.");
}

function consultationClearAll() {
  consultationGlassPartOptions.forEach((area) => restoreConsultationGlassGroup(area.key));
  disposeAllConsultationPpfOverlays();
  state.consultation.ppfParts = [];
  state.consultation.appliedPpfMap = {};
  state.consultation.appliedTintMap = {};
  state.consultation.applications = [];
  clearConsultationSelectedTarget();
  refreshConsultationAfterOptionChange("ppf");
  showToast("부위별 적용 내역을 모두 해제했습니다.");
}

function clearConsultationSelectedTarget() {
  state.consultation.selectedPartId = null;
  state.consultation.selectedCategory = null;
}

function consultationQuote() {
  const items = [];
  consultationApplications().forEach((application) => {
    const product = state.products.find((item) => item.sku === application.productId);
    if (!product) return;
    const type = application.category === "TINTING" ? "tint" : "ppf";
    const legacyPart = type === "ppf" ? legacyBodyPartFor(application.partId) : "";
    const partBase = ppfPartOptions.find((part) => part.key === legacyPart)?.price || 0;
    const amount = type === "tint"
      ? Math.round(consultationProductPrice(product, "tint") / Math.max(1, consultationGlassPartOptions.length))
      : consultationProductPrice(product, "ppf") + partBase;
    items.push({
      label: `${application.category === "TINTING" ? "틴팅" : "PPF"} · ${application.partName} · ${productDisplayName(product)}`,
      amount
    });
  });
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return { items, total };
}

function toggleConsultationPpfPart(partKey) {
  if (partKey !== "full_body") {
    const canonical = canonicalBodyPartFromLegacy(partKey) || partKey;
    state.consultation.selectedPartId = canonical;
    state.consultation.selectedCategory = "body";
    const product = selectedConsultationPpfProduct();
    if (product) applyConsultationProductToSelectedPart(product, "ppf");
    return;
  }
  const selected = new Set(state.consultation.ppfParts || []);
  if (partKey === "full_body") {
    state.consultation.ppfParts = selected.has("full_body") ? [] : ["full_body"];
    if (state.consultation.ppfParts.length) {
      const product = selectedConsultationPpfProduct();
      if (product) consultationApplyAll();
    } else {
      state.consultation.appliedPpfMap = {};
      state.consultation.applications = consultationApplications().filter((item) => item.category !== "PPF");
    }
    return;
  }
  selected.delete("full_body");
  state.consultation.applications = consultationApplications().filter((item) => !(item.partId === "full_body" && item.category === "PPF"));
  if (selected.has(partKey)) {
    selected.delete(partKey);
    state.consultation.applications = consultationApplications().filter((item) => !(item.partId === partKey && item.category === "PPF"));
  } else {
    selected.add(partKey);
    const product = selectedConsultationPpfProduct();
    if (product) upsertConsultationApplication(productApplicationRecord(partKey, "PPF", product));
  }
  state.consultation.ppfParts = Array.from(selected);
}

function selectedConsultationSummary() {
  const applications = consultationApplications();
  const tintCount = applications.filter((item) => item.category === "TINTING").length;
  const ppfCount = applications.filter((item) => item.category === "PPF").length;
  return [
    tintCount ? `틴팅 ${tintCount}개 유리 적용` : "",
    ppfCount ? `PPF ${ppfCount}개 차체 부위 적용` : ""
  ].filter(Boolean).join(" · ") || "3D 차량 부위를 선택해 상담을 시작하세요";
}

function visibleConsultations() {
  const query = normalize(state.filters.consultationQuery);
  return state.consultations
    .filter((row) => state.session?.role !== "dealer" || sameDealerCode(row.dealer_code, state.session.dealer_code))
    .filter((row) => {
      if (!query) return true;
      return [row.customer_name, row.customer_phone, row.vehicle_model, row.vehicle_color, row.dealer_name, row.created_by_login_id, row.memo, row.selected_tint_products, row.selected_ppf_products, row.selected_ppf_parts, row.applications]
        .some((value) => normalize(value).includes(query));
    })
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

function upsertConsultation(row) {
  if (!row) return;
  const index = state.consultations.findIndex((item) => item.consultation_id === row.consultation_id);
  if (index >= 0) state.consultations[index] = { ...state.consultations[index], ...row };
  else state.consultations.unshift(row);
}

function consultationPayload() {
  const vehicle = selectedConsultationVehicle();
  const tintMap = consultationAppliedTintMap();
  const ppfMap = consultationAppliedPpfMap();
  const quote = consultationQuote();
  const selectedParts = selectedPpfPartObjects();
  return {
    customer_name: state.consultation.customerName.trim(),
    customer_phone: state.consultation.customerPhone.trim(),
    vehicle_id: vehicle?.id || "",
    vehicle_model: vehicleDisplayName(vehicle),
    vehicle_color: vehicleColorByName(state.consultation.color).label,
    selected_tint_products: Object.values(tintMap).some(Boolean)
      ? JSON.stringify(Object.entries(tintMap).filter(([, product]) => product).map(([partId, product]) => ({ partId, partName: consultationPartLabel(partId), sku: product.sku, product_name: productDisplayName(product), tintStrength: productTintStrength(product), transparencyPercent: productTransparencyPercent(product), enabled: true })))
      : JSON.stringify([{ enabled: false, product_name: "선택 안함" }]),
    selected_ppf_products: Object.values(ppfMap).some(Boolean)
      ? JSON.stringify(Object.entries(ppfMap).filter(([, product]) => product).map(([partId, product]) => ({ partId, partName: consultationPartLabel(partId), sku: product.sku, product_name: productDisplayName(product), enabled: true })))
      : JSON.stringify([{ enabled: false, product_name: "선택 안함" }]),
    selected_ppf_parts: JSON.stringify(selectedParts.map((part) => ({ key: part.key, label: part.label, price: part.price }))),
    applications: JSON.stringify(consultationApplications()),
    quote_total: quote.total,
    screenshot_url: "",
    memo: state.consultation.memo.trim(),
    status: "saved"
  };
}

async function saveConsultation() {
  if (!state.session) throw new Error("로그인 후 상담을 저장할 수 있습니다.");
  const payload = consultationPayload();
  if (!payload.customer_name) throw new Error("고객명을 입력해 주세요.");
  if (!payload.customer_phone) throw new Error("연락처를 입력해 주세요.");

  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.saveConsultation(payload);
    upsertConsultation(data?.consultation);
  } else {
    upsertConsultation({
      ...payload,
      consultation_id: `CNS-${compactDateValue()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
      dealer_code: state.session.dealer_code,
      dealer_name: state.session.dealer_name,
      created_by_login_id: state.session.login_id,
      created_at: nowText(),
      updated_at: nowText()
    });
  }
  render();
  showToast("상담 내역을 저장했습니다.");
}

function downloadConsultationSnapshot() {
  const vehicle = selectedConsultationVehicle();
  const quote = consultationQuote();
  const svg = consultationSnapshotSvg(vehicle, quote);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gloc-consultation-${compactDateValue()}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("상담 스냅샷 SVG를 저장했습니다.");
}

function consultationSnapshotSvg(vehicle, quote) {
  const color = vehicleColorByName(state.consultation.color);
  const title = escapeHtml(vehicleDisplayName(vehicle));
  const summary = escapeHtml(selectedConsultationSummary());
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="#101211"/>
  <rect x="80" y="80" width="1440" height="840" rx="36" fill="#1c201e" stroke="#8b6b35"/>
  <text x="130" y="160" fill="#cf4e42" font-size="34" font-family="Arial, sans-serif" font-weight="700">GLOC CONSULTATION</text>
  <text x="130" y="230" fill="#fff8ed" font-size="70" font-family="Arial, sans-serif" font-weight="800">${title}</text>
  <text x="130" y="292" fill="#c8c0b6" font-size="32" font-family="Arial, sans-serif">${escapeHtml(color.label)} · ${summary}</text>
  <ellipse cx="800" cy="690" rx="480" ry="48" fill="#000" opacity="0.35"/>
  <path d="M330 590C375 490 510 450 630 435C700 355 825 330 1010 350C1120 365 1215 415 1270 495C1375 505 1440 550 1460 615C1480 680 1430 710 1365 720H350C270 705 275 640 330 590Z" fill="${escapeAttr(color.hex)}" stroke="#ffffff" stroke-opacity="0.22" stroke-width="6"/>
  <path d="M690 445C760 375 880 365 985 385C1075 402 1140 440 1195 497L1020 505L715 495Z" fill="#111923" opacity="${consultationTintOpacity(selectedConsultationTintProduct())}"/>
  <circle cx="520" cy="710" r="78" fill="#0a0b0b"/><circle cx="520" cy="710" r="39" fill="#555"/>
  <circle cx="1180" cy="710" r="78" fill="#0a0b0b"/><circle cx="1180" cy="710" r="39" fill="#555"/>
  <text x="130" y="835" fill="#fff8ed" font-size="44" font-family="Arial, sans-serif" font-weight="800">견적 합계 ${escapeHtml(money(quote.total))}</text>
</svg>`;
}

function consultationFutureReservation() {
  showToast("상담 저장 후 예약관리와 연결할 수 있도록 확장 슬롯을 준비했습니다.");
}

function consultationFutureCertificate() {
  showToast("시공완료 후 정품인증서 자동 생성 흐름과 연결할 수 있도록 구조를 준비했습니다.");
}

function selectedVehicleAdminRecord() {
  return activeVehicles().find((vehicle) => vehicle.id === state.forms.vehicleId);
}

function ensureVehicleForm() {
  if (!state.forms.vehicleId && activeVehicles()[0]) selectVehicleForEdit(activeVehicles()[0].id);
}

function selectVehicleForEdit(vehicleId) {
  const vehicle = activeVehicles().find((item) => item.id === vehicleId);
  if (!vehicle) return;
  state.forms.vehicleId = vehicle.id || "";
  state.forms.vehicleBrand = vehicle.brand || "Tesla";
  state.forms.vehicleModelName = vehicle.model_name || "";
  state.forms.vehicleGenerationName = vehicle.generation_name || "";
  state.forms.vehicleBodyCode = vehicle.body_code || "";
  state.forms.vehicleModelYear = vehicle.model_year || "";
  state.forms.vehicleType = vehicle.vehicle_type || "sedan";
  state.forms.vehicleDefaultColor = vehicle.default_color || "Pearl White";
  state.forms.vehicleGlbFileUrl = vehicle.glb_file_url || "";
  state.forms.vehicleImageModeEnabled = toBool(vehicle.image_mode_enabled);
  state.forms.vehicleThreeDEnabled = toBool(vehicle.three_d_enabled);
}

function vehiclePayload() {
  const id = state.forms.vehicleId.trim();
  if (!id) throw new Error("차량 ID를 입력해 주세요.");
  if (!state.forms.vehicleModelName.trim()) throw new Error("모델명을 입력해 주세요.");
  return {
    id,
    brand: state.forms.vehicleBrand.trim() || "Tesla",
    model_name: state.forms.vehicleModelName.trim(),
    generation_name: state.forms.vehicleGenerationName.trim() || "Current",
    facelift_type: state.forms.vehicleGenerationName.trim() || "",
    body_code: state.forms.vehicleBodyCode.trim(),
    model_year: state.forms.vehicleModelYear.trim(),
    vehicle_type: state.forms.vehicleType.trim() || "sedan",
    default_color: state.forms.vehicleDefaultColor.trim() || "Pearl White",
    thumbnail_url: "",
    image_mode_enabled: toBool(state.forms.vehicleImageModeEnabled),
    three_d_enabled: toBool(state.forms.vehicleThreeDEnabled),
    glb_file_url: state.forms.vehicleGlbFileUrl.trim(),
    is_active: true
  };
}

function upsertVehicle(vehicle) {
  if (!vehicle) return;
  const index = state.vehicles.findIndex((item) => item.id === vehicle.id);
  if (index >= 0) state.vehicles[index] = { ...state.vehicles[index], ...vehicle };
  else state.vehicles.push(vehicle);
}

async function saveVehicle() {
  if (state.session?.role !== "admin") throw new Error("관리자만 차량 정보를 저장할 수 있습니다.");
  const payload = vehiclePayload();
  if (window.FilmStockApi?.isEnabled()) {
    const data = await window.FilmStockApi.saveVehicle(payload);
    upsertVehicle(data?.vehicle);
  } else {
    upsertVehicle({
      ...payload,
      created_at: selectedVehicleAdminRecord()?.created_at || nowText(),
      updated_at: nowText()
    });
  }
  state.consultation.vehicleId = payload.id;
  render();
  showToast("차량 정보를 저장했습니다.");
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
  return state.products.filter((product) => product.useYn === undefined && product.use_yn === undefined
    ? toBool(product.is_active)
    : toBool(product.useYn ?? product.use_yn));
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
    color: product.color || product.color_name || colorNameFromText(product.product_name),
    color_name: product.color_name || product.color || colorNameFromText(product.product_name),
    product_code: product.product_code || product.sku,
    color_hex: validHexColor(product.color_hex, colorHex(product.color || product.product_name))
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
    state.forms.productBrand = "GLOC";
    state.forms.productColorName = "";
    state.forms.productColorHex = "#f7fbf9";
    state.forms.productColorChartImageUrl = "";
    state.forms.productFinishType = "gloss";
    state.forms.productTransparencyType = "transparent";
    state.forms.productOpacity = 100;
    state.forms.productShadePercent = 35;
    state.forms.productAvailableParts = tintAreaOptions.map((area) => area.key).join(",");
    state.forms.productDescription = "";
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
