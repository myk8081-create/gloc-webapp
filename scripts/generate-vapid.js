const webpush = require("web-push");

const keys = webpush.generateVAPIDKeys();

console.log("Vercel 환경변수에 아래 값을 등록하세요.\n");
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log("VAPID_SUBJECT=mailto:your-email@example.com");
console.log("PUSH_API_SECRET=원하는_긴_비밀문자");
