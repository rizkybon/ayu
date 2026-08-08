<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>Salin sw.js — Dompet AYU v4.3</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,sans-serif;background:#f5f5f5}
.top{background:#2c3e7a;color:#fff;padding:16px;text-align:center}.top h1{font-size:18px;font-weight:700}.top p{font-size:12px;opacity:.85;margin-top:4px}
.box{padding:16px}.stats{display:flex;gap:8px;margin-bottom:14px}.stat{flex:1;background:#fff;border-radius:10px;padding:10px;text-align:center}
.stat b{display:block;font-size:18px;font-weight:800;color:#2c3e7a}.stat small{font-size:10px;color:#888;margin-top:2px;display:block}
.btn{display:block;width:100%;padding:16px;background:#2c3e7a;color:#fff;border:none;border-radius:12px;font-size:17px;font-weight:700;cursor:pointer;margin-bottom:10px}
.btn.g{background:#1a6b4a}.btn:disabled{background:#aaa}
.pg{background:#ddd;border-radius:8px;height:10px;margin:8px 0;overflow:hidden;display:none}.pb{height:100%;background:#2c3e7a;border-radius:8px;transition:width .3s;width:0}
.st{font-size:13px;color:#555;text-align:center;margin:4px 0 10px;min-height:18px}
textarea{width:100%;height:140px;font-family:monospace;font-size:10px;border:1px solid #ddd;border-radius:10px;padding:10px;resize:vertical}
.footer{text-align:center;padding:16px;font-size:11px;color:#999}</style></head><body>
<div class="top"><h1>&#128203; Salin sw.js</h1><p>Dompet AYU v4.3 — Service Worker</p></div>
<div class="box">
  <div class="stats">
    <div class="stat"><b>2,490</b><small>karakter</small></div>
    <div class="stat"><b>75</b><small>baris</small></div>
    <div class="stat"><b>2KB</b><small>ukuran</small></div>
  </div>
  <button class="btn" id="bC" onclick="sl()">&#128203; Salin sw.js</button>
  <textarea id="ta" readonly></textarea>
</div>
<div class="footer">Dompet AYU v4.3</div>
<script>
const F="// ============================================================\n// Dompet AYU v4.2 \u2014 Service Worker\n// App Shell Caching untuk offline support\n// ============================================================\nconst CACHE_NAME = 'dompet-ayu-v4.2';\nconst SHELL_URLS = [\n  './',\n  './index.html'\n];\n\n// Install: cache app shell\nself.addEventListener('install', event => {\n  event.waitUntil(\n    caches.open(CACHE_NAME).then(cache => {\n      return cache.addAll(SHELL_URLS).catch(() => {\n        // Jika gagal cache (misal: offline saat install), lanjut tanpa error\n        return Promise.resolve();\n      });\n    }).then(() => self.skipWaiting())\n  );\n});\n\n// Activate: hapus cache lama\nself.addEventListener('activate', event => {\n  event.waitUntil(\n    caches.keys().then(keys =>\n      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))\n    ).then(() => self.clients.claim())\n  );\n});\n\n// Fetch: Cache First untuk shell, Network First untuk API\nself.addEventListener('fetch', event => {\n  const url = new URL(event.request.url);\n\n  // Jangan intercept request ke GAS API (selalu network)\n  if (url.hostname.includes('script.google.com') || \n      url.hostname.includes('googleapis.com')) {\n    return; // biarkan browser handle normal\n  }\n\n  // Untuk asset CDN (chart.js, jsQR): Cache First\n  if (url.hostname.includes('jsdelivr.net') || \n      url.hostname.includes('cdnjs.cloudflare.com')) {\n    event.respondWith(\n      caches.match(event.request).then(cached => {\n        if (cached) return cached;\n        return fetch(event.request).then(response => {\n          if (response.ok) {\n            const clone = response.clone();\n            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));\n          }\n          return response;\n        }).catch(() => cached || new Response('', {status: 503}));\n      })\n    );\n    return;\n  }\n\n  // Untuk index.html dan asset lokal: Cache First dengan network fallback\n  event.respondWith(\n    caches.match(event.request).then(cached => {\n      const networkFetch = fetch(event.request).then(response => {\n        if (response.ok && event.request.method === 'GET') {\n          const clone = response.clone();\n          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));\n        }\n        return response;\n      }).catch(() => null);\n\n      // Return cache langsung jika ada, background update\n      return cached || networkFetch || new Response('Offline', {status: 503});\n    })\n  );\n});\n";function sl(){cp(F)}
function cp(txt){
  const b=document.getElementById('bC');
  const ok=()=>{b.textContent='&#10003; Tersalin!';b.classList.add('g');setTimeout(()=>{b.textContent='&#128203; Salin sw.js';b.classList.remove('g')},3000)};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(ok).catch(fb);else fb();
  document.getElementById('ta').value=txt.substring(0,300)+'...';
}
function fb(){const t=document.getElementById('ta');t.value=F||'';t.select();t.setSelectionRange(0,9999999);try{document.execCommand('copy');ok()}catch(e){alert('Tap & tahan kotak teks lalu pilih Semua & Salin')}}
window.onload=()=>{document.getElementById('ta').value=(F||'').substring(0,200)||'Tap Muat dulu...'}
</script></body></html>
