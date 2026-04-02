'use strict';
/* ================================================================
   admin-luxury-anim.js — OutfitKart Admin Luxury Experience
   ================================================================
   HOW TO USE:
   Add this ONE line to index.html, after script-admin.js:
     <script src="admin-luxury-anim.js"></script>
   That's it. No other changes needed.
   ================================================================ */

(function () {

  /* ──────────────────────────────────────────────────────────────
     1. INJECT CSS
     ────────────────────────────────────────────────────────────── */
  const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

:root {
  --lux-gold-1: #C9A84C;
  --lux-gold-2: #F5E6C0;
  --lux-gold-3: #B8860B;
  --lux-dark-1: #07040000;
  --lux-dark-2: #130d00;
  --lux-dark-3: #2d1f00;
}

/* ── MODAL OVERLAY ── */
#admin-login-modal.lux-active {
  background: rgba(0,0,0,0.88) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
}

/* ── LUXURY CARD ── */
.lux-card {
  position: relative;
  background: #100b00 !important;
  border-radius: 0 !important;
  overflow: hidden;
  padding: 44px 40px 36px !important;
  box-shadow:
    0 0 0 1px rgba(201,168,76,0.22),
    0 40px 120px rgba(0,0,0,0.95),
    inset 0 0 80px rgba(201,168,76,0.03);
  animation: luxCardReveal 0.65s cubic-bezier(0.16,1,0.3,1) both;
  max-width: 420px !important;
}

@keyframes luxCardReveal {
  0%   { opacity:0; transform:translateY(48px) scale(0.95); clip-path:polygon(5% 0,95% 0,100% 100%,0 100%); }
  100% { opacity:1; transform:translateY(0)    scale(1);    clip-path:polygon(0   0,100% 0,100% 100%,0 100%); }
}

/* ── TOP GOLD BAR ── */
.lux-card::before {
  content:'';
  position:absolute; top:0; left:-100%; right:0; height:1.5px;
  background:linear-gradient(90deg,transparent,var(--lux-gold-1),var(--lux-gold-2),var(--lux-gold-1),transparent);
  animation: luxTopLine 0.85s cubic-bezier(0.4,0,0.2,1) 0.45s forwards;
  z-index:10;
}
@keyframes luxTopLine { 0%{left:-100%} 100%{left:0} }

/* ── BOTTOM LINE ── */
.lux-card::after {
  content:'';
  position:absolute; bottom:0; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,0.25),transparent);
}

/* ── CORNER ORNAMENTS ── */
.lux-corner {
  position:absolute; width:18px; height:18px;
  opacity:0; animation:luxCorner 0.45s ease 0.7s forwards;
}
.lux-corner-tl { top:10px; left:10px; border-top:1.5px solid var(--lux-gold-1); border-left:1.5px solid var(--lux-gold-1); }
.lux-corner-tr { top:10px; right:10px; border-top:1.5px solid var(--lux-gold-1); border-right:1.5px solid var(--lux-gold-1); }
.lux-corner-bl { bottom:10px; left:10px; border-bottom:1.5px solid var(--lux-gold-1); border-left:1.5px solid var(--lux-gold-1); }
.lux-corner-br { bottom:10px; right:10px; border-bottom:1.5px solid var(--lux-gold-1); border-right:1.5px solid var(--lux-gold-1); }
@keyframes luxCorner { 0%{opacity:0;transform:scale(0.4)} 100%{opacity:1;transform:scale(1)} }

/* ── FLOATING DUST ── */
.lux-dust-particle {
  position:absolute; border-radius:50%;
  background:var(--lux-gold-1); pointer-events:none;
  animation:luxDust linear infinite;
}
@keyframes luxDust {
  0%   { opacity:0; transform:translateY(100%) translateX(0px); }
  8%   { opacity:0.5; }
  92%  { opacity:0.15; }
  100% { opacity:0; transform:translateY(-90px) translateX(15px); }
}

/* ── CREST ── */
.lux-crest {
  display:flex; flex-direction:column; align-items:center;
  margin-bottom:36px; opacity:0;
  animation:luxCrestIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards;
}
@keyframes luxCrestIn { 0%{opacity:0;transform:translateY(-14px)} 100%{opacity:1;transform:translateY(0)} }

.lux-crest-ring {
  width:80px; height:80px; border-radius:50%;
  border:1.5px solid rgba(201,168,76,0.45);
  background:radial-gradient(circle at 38% 38%,rgba(201,168,76,0.22) 0%,rgba(201,168,76,0.05) 50%,transparent 70%);
  display:flex; align-items:center; justify-content:center;
  margin-bottom:16px; position:relative;
  box-shadow:0 0 0 4px rgba(201,168,76,0.07),0 0 0 10px rgba(201,168,76,0.03),0 0 40px rgba(201,168,76,0.18),inset 0 0 20px rgba(201,168,76,0.06);
  animation:ringBreath 3s ease infinite;
}
.lux-crest-ring::before {
  content:''; position:absolute; inset:-8px; border-radius:50%;
  border:1px solid rgba(201,168,76,0.13);
  animation:ringBreath 3s ease 0.5s infinite;
}
.lux-crest-ring::after {
  content:''; position:absolute; inset:-16px; border-radius:50%;
  border:1px dashed rgba(201,168,76,0.07);
  animation:ringRotate 12s linear infinite;
}
@keyframes ringBreath { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
@keyframes ringRotate { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }

.lux-crest-img {
  width:44px; height:44px; object-fit:contain;
  filter:drop-shadow(0 0 14px rgba(201,168,76,0.65)) drop-shadow(0 0 6px rgba(201,168,76,0.4));
  animation:logoGlow 3s ease infinite;
}
@keyframes logoGlow{0%,100%{filter:drop-shadow(0 0 10px rgba(201,168,76,0.5)) drop-shadow(0 0 5px rgba(201,168,76,0.3))}50%{filter:drop-shadow(0 0 22px rgba(201,168,76,0.9)) drop-shadow(0 0 12px rgba(245,230,192,0.5))}}

.lux-crest-wordmark {
  font-family:'Cinzel',serif; font-size:20px; font-weight:700;
  letter-spacing:0.32em; text-transform:uppercase;
  background:linear-gradient(135deg,var(--lux-gold-3) 0%,var(--lux-gold-1) 35%,var(--lux-gold-2) 55%,var(--lux-gold-1) 75%,var(--lux-gold-3) 100%);
  background-size:200% auto;
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text; line-height:1;
  animation:wordmarkShimmer 4s linear infinite;
}
@keyframes wordmarkShimmer{0%{background-position:0% center}100%{background-position:200% center}}

.lux-divider {
  display:flex; align-items:center; gap:8px; margin-top:9px;
}
.lux-divider-line {
  height:1px; width:36px;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,0.45));
}
.lux-divider-line.r { background:linear-gradient(90deg,rgba(201,168,76,0.45),transparent); }
.lux-divider-gem {
  width:5px; height:5px; border-radius:50%;
  background:var(--lux-gold-1);
  box-shadow:0 0 7px rgba(201,168,76,0.7);
}
.lux-crest-tagline {
  font-family:'Cormorant Garamond',serif; font-style:italic;
  font-size:11px; color:rgba(201,168,76,0.42);
  letter-spacing:0.22em; margin-top:7px;
}

/* ── FIELDS ── */
.lux-field { margin-bottom:20px; opacity:0; animation:luxFieldSlide 0.45s ease forwards; }
.lux-field:nth-child(1) { animation-delay:0.52s; }
.lux-field:nth-child(2) { animation-delay:0.62s; }
@keyframes luxFieldSlide { 0%{opacity:0;transform:translateX(-12px)} 100%{opacity:1;transform:translateX(0)} }

.lux-label {
  display:block; font-family:'Cinzel',serif; font-size:8.5px;
  font-weight:600; letter-spacing:0.32em; text-transform:uppercase;
  color:rgba(201,168,76,0.55); margin-bottom:9px;
}

.lux-input-wrap {
  display:flex; border:1px solid rgba(201,168,76,0.18);
  background:rgba(255,255,255,0.025);
  transition:border-color 0.3s,background 0.3s,box-shadow 0.3s;
}
.lux-input-wrap:focus-within {
  border-color:rgba(201,168,76,0.55);
  background:rgba(201,168,76,0.04);
  box-shadow:0 0 0 3px rgba(201,168,76,0.06);
}

.lux-prefix {
  display:flex; align-items:center; padding:0 13px;
  font-family:'Cinzel',serif; font-size:10px; letter-spacing:0.05em;
  color:rgba(201,168,76,0.45); border-right:1px solid rgba(201,168,76,0.13);
  background:rgba(201,168,76,0.035); white-space:nowrap;
}

.lux-input {
  flex:1; background:transparent !important;
  border:none !important; outline:none !important;
  padding:14px 16px; font-family:'Cormorant Garamond',serif;
  font-size:15px; color:rgba(245,230,192,0.88) !important;
  letter-spacing:0.04em; box-shadow:none !important;
}
.lux-input::placeholder { color:rgba(201,168,76,0.22); font-style:italic; }

/* ── BUTTON ── */
.lux-btn {
  width:100%; padding:16px; margin-top:28px;
  background:linear-gradient(135deg,rgba(45,31,0,0.9) 0%,rgba(201,168,76,0.07) 50%,rgba(45,31,0,0.9) 100%);
  border:1px solid rgba(201,168,76,0.38);
  color:var(--lux-gold-1); font-family:'Cinzel',serif;
  font-size:10.5px; font-weight:600; letter-spacing:0.38em;
  text-transform:uppercase; cursor:pointer; position:relative;
  overflow:hidden; transition:all 0.4s;
  opacity:0; animation:luxBtnIn 0.45s ease 0.78s forwards;
}
@keyframes luxBtnIn { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }

.lux-btn::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,0.12),transparent);
  transform:translateX(-100%); transition:transform 0.55s ease;
}
.lux-btn:hover {
  border-color:rgba(201,168,76,0.75); color:var(--lux-gold-2);
  box-shadow:0 0 28px rgba(201,168,76,0.14), 0 0 60px rgba(201,168,76,0.05);
  background:linear-gradient(135deg,rgba(201,168,76,0.07) 0%,rgba(201,168,76,0.14) 50%,rgba(201,168,76,0.07) 100%);
}
.lux-btn:hover::before { transform:translateX(100%); }
.lux-btn:active { transform:scale(0.978); }

.lux-btn.loading { pointer-events:none; color:transparent; }
.lux-btn.loading::after {
  content:''; position:absolute; inset:0;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='16' fill='none' stroke='%23C9A84C' stroke-width='2' stroke-dasharray='60 20' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 20 20' to='360 20 20' dur='0.9s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/svg%3E") center/22px no-repeat;
}

/* ── CANCEL ── */
.lux-cancel-link {
  display:block; text-align:center; margin-top:20px;
  font-family:'Cormorant Garamond',serif; font-style:italic;
  font-size:11.5px; color:rgba(201,168,76,0.28); cursor:pointer;
  letter-spacing:0.12em; transition:color 0.3s;
  opacity:0; animation:luxFadeIn 0.4s ease 0.9s forwards;
}
.lux-cancel-link:hover { color:rgba(201,168,76,0.6); }
@keyframes luxFadeIn { 0%{opacity:0} 100%{opacity:1} }

/* ── ERROR ── */
.lux-error {
  font-family:'Cormorant Garamond',serif; font-style:italic;
  font-size:12px; color:rgba(220,90,90,0.82); text-align:center;
  letter-spacing:0.07em; margin-top:0;
  animation:luxErrIn 0.3s ease both;
}
@keyframes luxErrIn { 0%{opacity:0;transform:translateY(5px)} 100%{opacity:1;transform:translateY(0)} }

/* ── SHAKE ── */
.lux-shake { animation:luxShk 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both !important; }
@keyframes luxShk {
  0%,100%{transform:translateX(0)}
  14%{transform:translateX(-9px) rotate(-0.5deg)}
  28%{transform:translateX(8px)  rotate( 0.5deg)}
  42%{transform:translateX(-7px) rotate(-0.3deg)}
  57%{transform:translateX(5px)  rotate( 0.3deg)}
  71%{transform:translateX(-3px)}
  85%{transform:translateX(2px)}
}

/* ── SUCCESS FLASH ── */
.lux-success-flash {
  position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse at center,rgba(201,168,76,0.35) 0%,rgba(201,168,76,0.12) 40%,transparent 70%);
  animation:luxFlash 0.7s ease forwards;
}
@keyframes luxFlash { 0%{opacity:0} 25%{opacity:1} 100%{opacity:0} }

/* ══════════════════════════════════════════════════════════════
   CINEMATIC TRANSITION OVERLAY
   ══════════════════════════════════════════════════════════════ */
#ok-admin-transition {
  position:fixed; inset:0; z-index:99999;
  display:none; overflow:hidden;
}
#ok-admin-transition.visible { display:block; }

.lux-ctn-left, .lux-ctn-right {
  position:absolute; top:0; bottom:0; width:50%;
  background:linear-gradient(160deg,#0d0800 0%,#1a0e00 60%,#0d0800 100%);
  animation:ctnClose 0.55s cubic-bezier(0.76,0,0.24,1) both;
}
.lux-ctn-left  { left:0;  transform-origin:left; }
.lux-ctn-right { right:0; transform-origin:right; }
.lux-ctn-left.open  { animation:ctnOpenL 0.65s cubic-bezier(0.76,0,0.24,1) both; }
.lux-ctn-right.open { animation:ctnOpenR 0.65s cubic-bezier(0.76,0,0.24,1) both; }

@keyframes ctnClose  { 0%{transform:scaleX(0)} 100%{transform:scaleX(1)} }
@keyframes ctnOpenL  { 0%{transform:scaleX(1)} 100%{transform:scaleX(0)} }
@keyframes ctnOpenR  { 0%{transform:scaleX(1)} 100%{transform:scaleX(0)} }

.lux-seam-line {
  position:absolute; top:0; bottom:0; left:50%;
  width:2px; transform:translateX(-50%);
  background:linear-gradient(180deg,transparent 0%,var(--lux-gold-1) 20%,var(--lux-gold-2) 50%,var(--lux-gold-1) 80%,transparent 100%);
  box-shadow:0 0 22px rgba(201,168,76,0.65),0 0 55px rgba(201,168,76,0.2);
  animation:seamIn 0.5s ease both;
  z-index:2;
}
@keyframes seamIn { 0%{opacity:0;transform:translateX(-50%) scaleY(0)} 100%{opacity:1;transform:translateX(-50%) scaleY(1)} }
.lux-seam-line.out { animation:seamOut 0.35s ease both; }
@keyframes seamOut { 0%{opacity:1} 100%{opacity:0} }

.lux-scan {
  position:absolute; left:0; right:0; height:2px; z-index:3;
  background:linear-gradient(90deg,transparent 0%,rgba(201,168,76,0.08) 8%,rgba(201,168,76,0.7) 50%,rgba(201,168,76,0.08) 92%,transparent 100%);
  box-shadow:0 0 12px rgba(201,168,76,0.35);
  animation:scanDown 1.05s cubic-bezier(0.4,0,0.6,1) 0.18s both;
}
@keyframes scanDown { 0%{top:0;opacity:0} 4%{opacity:1} 96%{opacity:1} 100%{top:100%;opacity:0} }

.lux-center-crest {
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%);
  display:flex; flex-direction:column; align-items:center; gap:14px;
  z-index:4; animation:ccIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s both;
}
@keyframes ccIn  { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.65)} 100%{opacity:1;transform:translate(-50%,-50%) scale(1)} }
@keyframes ccOut { 0%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.18)} }
.lux-center-crest.exit { animation:ccOut 0.35s ease both; }

.lux-cc-ring {
  width:88px; height:88px; border-radius:50%;
  border:1px solid rgba(201,168,76,0.38);
  display:flex; align-items:center; justify-content:center;
  position:relative;
  background:radial-gradient(circle at 40% 40%,rgba(201,168,76,0.14) 0%,transparent 60%);
  box-shadow:0 0 40px rgba(201,168,76,0.12);
}
.lux-cc-ring::before, .lux-cc-ring::after {
  content:''; position:absolute; border-radius:50%;
  border:1px solid rgba(201,168,76,0.12);
  animation:ccRingPulse 1.6s ease infinite;
}
.lux-cc-ring::before { inset:-7px; }
.lux-cc-ring::after  { inset:-14px; animation-delay:0.35s; }
@keyframes ccRingPulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }

.lux-cc-img {
  width:44px; height:44px; object-fit:contain;
  filter:drop-shadow(0 0 10px rgba(201,168,76,0.55));
}

.lux-cc-wordmark {
  font-family:'Cinzel',serif; font-size:15px; font-weight:700;
  letter-spacing:0.42em; text-transform:uppercase;
  background:linear-gradient(135deg,var(--lux-gold-3),var(--lux-gold-1),var(--lux-gold-2),var(--lux-gold-3));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}

.lux-cc-status {
  font-family:'Cormorant Garamond',serif; font-style:italic;
  font-size:12px; color:rgba(201,168,76,0.48); letter-spacing:0.18em;
  animation:statusPulse 1.1s ease infinite;
}
@keyframes statusPulse { 0%,100%{opacity:0.48} 50%{opacity:0.9} }

/* ── Admin panel entrance ── */
#view-admin.lux-enter > div:first-child { animation:panelTopIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
#view-admin.lux-enter #admin-sidebar    { animation:panelLeftIn 0.65s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
#view-admin.lux-enter .flex-1.p-4      { animation:panelFadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
@keyframes panelTopIn  { 0%{opacity:0;transform:translateY(-100%)} 100%{opacity:1;transform:translateY(0)} }
@keyframes panelLeftIn { 0%{opacity:0;transform:translateX(-110%)} 100%{opacity:1;transform:translateX(0)} }
@keyframes panelFadeUp { 0%{opacity:0;transform:translateY(28px) scale(0.98)} 100%{opacity:1;transform:translateY(0) scale(1)} }

/* ── Admin card / stat tiles ── */
#view-admin.lux-enter .bg-white,
#view-admin.lux-enter .rounded-xl {
  animation:tileReveal 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
#view-admin.lux-enter .bg-white:nth-child(1){animation-delay:0.35s}
#view-admin.lux-enter .bg-white:nth-child(2){animation-delay:0.42s}
#view-admin.lux-enter .bg-white:nth-child(3){animation-delay:0.49s}
#view-admin.lux-enter .bg-white:nth-child(4){animation-delay:0.56s}
@keyframes tileReveal{0%{opacity:0;transform:scale(0.92) translateY(16px)}100%{opacity:1;transform:scale(1) translateY(0)}}
  `;

  function injectCss() {
    if (document.getElementById('ok-lux-admin-style')) return;
    const s = document.createElement('style');
    s.id = 'ok-lux-admin-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ──────────────────────────────────────────────────────────────
     2. DUST PARTICLES
     ────────────────────────────────────────────────────────────── */
  function spawnDust(container, n) {
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div');
      el.className = 'lux-dust-particle';
      el.style.cssText = `
        left:${Math.random()*100}%;
        bottom:0;
        width:${1+Math.random()*2}px;
        height:${1+Math.random()*2}px;
        animation-duration:${2.8+Math.random()*3.5}s;
        animation-delay:${Math.random()*4}s;
      `;
      container.appendChild(el);
    }
  }

  /* ──────────────────────────────────────────────────────────────
     3. BUILD LUXURY MODAL CONTENT
     ────────────────────────────────────────────────────────────── */
  function buildLuxModal() {
    const modal = document.getElementById('admin-login-modal');
    if (!modal || modal.dataset.lux) return;
    modal.dataset.lux = '1';

    modal.classList.add('lux-active');

    modal.innerHTML = `
      <div class="lux-card" id="lux-card" style="width:100%;max-width:420px;">
        <div class="lux-corner lux-corner-tl"></div>
        <div class="lux-corner lux-corner-tr"></div>
        <div class="lux-corner lux-corner-bl"></div>
        <div class="lux-corner lux-corner-br"></div>
        <div id="lux-dust-host" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>

        <div class="lux-crest">
          <div class="lux-crest-ring">
            <img class="lux-crest-img"
              src="https://i.ibb.co/5gXg0WTr/1774263119958.png"
              alt="OutfitKart"
              onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span style=font-size:30px;filter:drop-shadow(0 0 8px rgba(201,168,76,0.5))>⭐</span>')">
          </div>
          <div class="lux-crest-wordmark">OutfitKart</div>
          <div class="lux-divider">
            <div class="lux-divider-line"></div>
            <div class="lux-divider-gem"></div>
            <div class="lux-divider-line r"></div>
          </div>
          <div class="lux-crest-tagline">Admin Sanctum</div>
        </div>

        <form id="lux-admin-form" autocomplete="off">
          <div class="lux-field">
            <label class="lux-label">Mobile Number</label>
            <div class="lux-input-wrap">
              <div class="lux-prefix">+91</div>
              <input id="admin-mobile" type="tel" pattern="[0-9]{10}" maxlength="10"
                required class="lux-input" placeholder="Registered number">
            </div>
          </div>
          <div class="lux-field">
            <label class="lux-label">Passphrase</label>
            <div class="lux-input-wrap">
              <input id="admin-password" type="password"
                required class="lux-input" placeholder="Restricted access" style="padding-left:16px;">
            </div>
          </div>
          <div id="lux-err"></div>
          <button type="submit" class="lux-btn" id="lux-btn">Enter the Sanctum</button>
        </form>

        <div class="lux-cancel-link" onclick="closeAdminLogin(true)">
          Withdraw Clearance
        </div>
      </div>
    `;

    spawnDust(document.getElementById('lux-dust-host'), 15);

    // Bind form submit
    document.getElementById('lux-admin-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleLuxLogin();
    });

    // Focus
    setTimeout(() => document.getElementById('admin-mobile')?.focus(), 400);
  }

  /* ──────────────────────────────────────────────────────────────
     4. LOGIN HANDLER
     ────────────────────────────────────────────────────────────── */
  async function handleLuxLogin() {
    const btn  = document.getElementById('lux-btn');
    const errEl = document.getElementById('lux-err');
    const form = document.getElementById('lux-admin-form');
    const mobile   = (document.getElementById('admin-mobile')?.value || '').trim().replace(/\D/g,'');
    const password = (document.getElementById('admin-password')?.value || '').trim();

    errEl.innerHTML = '';
    if (btn) { btn.classList.add('loading'); }

    // Validation
    if (mobile.length !== 10) {
      showLuxError('Enter a valid 10-digit number', btn, form);
      return;
    }

    try {
      // Auth check (reuse OutfitKart globals)
      const authorized = (window.ADMIN_AUTHORIZED_MOBILES || ['9343988416','7879245954']).includes(mobile);
      if (!authorized) {
        showLuxError('Access not granted — Unauthorized credential', btn, form);
        return;
      }

      // AFTER (fixed)
const client = window.dbClient || dbClient;
if (!client) {
    showLuxError('Database not initialized — try refreshing', btn, form);
    return;
}
const { data: user, error } = await client
    .from('users')
    .select('mobile,name,password')
    .eq('mobile', mobile)
    .eq('password', password)
    .maybeSingle();

      // ── SUCCESS ──
      await onLoginSuccess(user);

    } catch (err) {
      showLuxError(err.message || 'Authentication error', btn, form);
    }
  }

  function showLuxError(msg, btn, form) {
    if (btn) { btn.classList.remove('loading'); btn.textContent = 'Enter the Sanctum'; }
    if (form) {
      const card = document.getElementById('lux-card');
      card?.classList.add('lux-shake');
      setTimeout(() => card?.classList.remove('lux-shake'), 600);
    }
    const errEl = document.getElementById('lux-err');
    if (errEl) {
      errEl.innerHTML = `<div class="lux-error">⚠ ${msg}</div>`;
      setTimeout(() => { if(errEl) errEl.innerHTML = ''; }, 4500);
    }
  }

  /* ──────────────────────────────────────────────────────────────
     5. SUCCESS SEQUENCE
     ────────────────────────────────────────────────────────────── */
 async function onLoginSuccess(user) {
    const card = document.getElementById('lux-card');
    if (card) {
      const flash = document.createElement('div');
      flash.className = 'lux-success-flash';
      card.appendChild(flash);
      setTimeout(() => flash.remove(), 800);
    }

    window.isAdminLoggedIn = true;
    localStorage.setItem('outfitkart_admin_session', 'true');
    localStorage.setItem('outfitkart_admin_name', user.name || 'Admin');
    localStorage.setItem('outfitkart_admin_mobile', user.mobile);

    const mob  = document.getElementById('admin-mobile');
    const pass = document.getElementById('admin-password');
    if (mob)  mob.value  = '';
    if (pass) pass.value = '';

    await sleep(620);

    // Force-close the modal — both class AND inline style to beat any conflicts
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
      modal.style.display  = 'none';       // ← forceful override
      modal.classList.add('hidden');
      modal.classList.remove('flex', 'lux-active');
    }

    await runCurtainTransition(user.name || 'Admin');
  }
  /* ──────────────────────────────────────────────────────────────
     6. CURTAIN TRANSITION
     ────────────────────────────────────────────────────────────── */
  function buildTransitionOverlay() {
    let ov = document.getElementById('ok-admin-transition');
    if (ov) return ov;

    ov = document.createElement('div');
    ov.id = 'ok-admin-transition';
    ov.innerHTML = `
      <div class="lux-ctn-left"></div>
      <div class="lux-ctn-right"></div>
      <div class="lux-seam-line" id="ok-seam"></div>
      <div class="lux-scan"></div>
      <div class="lux-center-crest" id="ok-cc">
        <div class="lux-cc-ring">
          <img class="lux-cc-img"
            src="https://i.ibb.co/5gXg0WTr/1774263119958.png"
            onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span style=font-size:36px;filter:drop-shadow(0 0 10px rgba(201,168,76,0.6))>⭐</span>')">
        </div>
        <div class="lux-cc-wordmark">OutfitKart</div>
        <div class="lux-cc-status" id="ok-cc-status">Authenticating...</div>
      </div>
    `;
    document.body.appendChild(ov);
    return ov;
  }

  async function runCurtainTransition(adminName) {
    const ov = buildTransitionOverlay();

    // Reset
    const left  = ov.querySelector('.lux-ctn-left');
    const right = ov.querySelector('.lux-ctn-right');
    const seam  = document.getElementById('ok-seam');
    const cc    = document.getElementById('ok-cc');
    const status = document.getElementById('ok-cc-status');

    [left, right].forEach(el => { el.classList.remove('open'); });
    seam?.classList.remove('out');
    cc?.classList.remove('exit');

    ov.classList.add('visible');

    // Phase 1: curtains close + status
    await sleep(350);
    if (status) status.textContent = `Greetings, ${adminName}`;
    await sleep(500);
    if (status) status.textContent = 'Opening Dashboard...';
    await sleep(420);

    // Phase 2: Navigate + enter animation
    if (typeof window.navigate === 'function') {
      window.navigate('admin');
    } else {
      window.location.hash = 'admin';
    }
    window.updateAdminNameInHeader?.();
    window.loadAdminDashboard?.();

    const adminView = document.getElementById('view-admin');
    if (adminView) {
      adminView.classList.add('lux-enter');
      setTimeout(() => adminView.classList.remove('lux-enter'), 1400);
    }

    // Phase 3: Seam + crest fade
    await sleep(180);
    seam?.classList.add('out');
    cc?.classList.add('exit');

    // Phase 4: Open curtains
    await sleep(100);
    [left, right].forEach(el => el.classList.add('open'));

    // Phase 5: Cleanup
    await sleep(850);
    ov.classList.remove('visible');

    window.showToast?.(`Welcome ${adminName}! 👋`);
  }

  /* ──────────────────────────────────────────────────────────────
     7. HOOK INTO OUTFITKART's showAdminLogin
     ────────────────────────────────────────────────────────────── */
  function patchShowAdminLogin() {
    const orig = window.showAdminLogin;
    window.showAdminLogin = function () {
      injectCss();
      const m = document.getElementById('admin-login-modal');
      if (!m) { orig?.(); return; }
      m.classList.remove('hidden');
      m.classList.add('flex');
      // Reset lux flag so modal is rebuilt fresh
      delete m.dataset.lux;
      buildLuxModal();
    };
  }

  // Also override handleAdminLogin so the original button works
  function patchHandleAdminLogin() {
    window.handleAdminLogin = async function (e) {
      e.preventDefault();
      await handleLuxLogin();
    };
  }

  /* ──────────────────────────────────────────────────────────────
     8. ADMIN PANEL OPEN ANIMATION (for navigate('admin') calls)
     ────────────────────────────────────────────────────────────── */
  function patchNavigate() {
    const orig = window._navigateCore || window.navigate;
    if (!orig || window._luxNavPatched) return;
    window._luxNavPatched = true;

    const wrap = function (view, cat) {
      orig(view, cat);
      if (view === 'admin') {
        const adminView = document.getElementById('view-admin');
        if (adminView && !adminView.classList.contains('lux-enter')) {
          adminView.classList.add('lux-enter');
          setTimeout(() => adminView.classList.remove('lux-enter'), 1400);
        }
      }
    };

    // Patch both navigate and _navigateCore if they exist
    if (window._navigateCore) window._navigateCore = wrap;
    if (window.navigate) {
      const origNav = window.navigate;
      window.navigate = function (view, cat) {
        origNav(view, cat);
        if (view === 'admin') {
          const adminView = document.getElementById('view-admin');
          if (adminView && !adminView.classList.contains('lux-enter')) {
            adminView.classList.add('lux-enter');
            setTimeout(() => adminView.classList.remove('lux-enter'), 1400);
          }
        }
      };
    }
  }

  /* ──────────────────────────────────────────────────────────────
     9. UTILITY
     ────────────────────────────────────────────────────────────── */
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ──────────────────────────────────────────────────────────────
     10. INIT
     ────────────────────────────────────────────────────────────── */
  function init() {
    injectCss();
    patchShowAdminLogin();
    patchHandleAdminLogin();
    patchNavigate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay to ensure other scripts have loaded
    setTimeout(init, 100);
  }

  // Export for debugging
  window._luxAdmin = { buildLuxModal, runCurtainTransition, buildTransitionOverlay };

})();
