// Service Worker حداقلی برای «حسابداری هوشمند ساحل»
// هدف اصلی: برآورده کردن معیارهای نصب واقعی (WebAPK) در کروم/سامسونگ اینترنت،
// نه کش‌کردن کل اپ. محتوای داخل iframe (اسکریپت گوگل) دست‌نخورده باقی می‌ماند
// چون درخواست‌های آن از origin دیگری هستند و توسط این SW رهگیری نمی‌شوند.

const CACHE_NAME = 'sahel-shell-v1';
const SHELL_FILES = [
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// فقط ناوبری‌های سطح بالا (index.html) را هندل می‌کنیم؛ هر درخواست دیگری
// (از جمله همه‌چیز داخل iframe) دست‌نخورده به شبکه می‌رود.
self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match('./index.html'))
  );
});
