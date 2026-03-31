'use strict';
/* ================================================================
   OutfitKart — CATEGORIES NAV PATCH v4.0
   Fixes in this version:
   ✅ Men/Women se Full Combos group removed
   ✅ Cart mein empty + items dono saath nahi dikhenge
   ✅ Subcat images products load hone pe update hongi
   ✅ Home se Instagram button hataya (index.html mein)
   ================================================================
   index.html mein (giveaway-patch.js ke BAAD):
     <script src="categories-nav-patch.js"></script>
   ================================================================ */

(function _okCatPatch() {

/* ────────────────────────────────────────────────────────────────
   CSS
──────────────────────────────────────────────────────────────── */
(function(){
  if (document.getElementById('ok-cnp4-css')) return;
  const s = document.createElement('style');
  s.id = 'ok-cnp4-css';
  s.textContent = `
  /* ═══ CATEGORIES PAGE ═══ */
  #view-categories{position:fixed;inset:0;z-index:52;background:#f5f5f5;display:flex;flex-direction:column;overflow:hidden;}
  #view-categories.hidden{display:none!important;}
  #ok-cph{background:white;height:56px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid #e5e7eb;box-shadow:0 1px 6px rgba(0,0,0,.08);flex-shrink:0;}
  #ok-cph h2{font-size:1.05rem;font-weight:900;color:#111827;margin:0;}
  #ok-cpbody{display:flex;flex:1;overflow:hidden;}

  /* Left sidebar */
  #ok-csb{width:90px;flex-shrink:0;background:#efefef;overflow-y:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
  #ok-csb::-webkit-scrollbar{display:none;}
  .ok-si{display:flex;flex-direction:column;align-items:center;padding:12px 6px;cursor:pointer;border-left:3px solid transparent;text-align:center;transition:all .15s;gap:5px;}
  .ok-si.active{background:white;border-left-color:#e11d48;}
  .ok-si img{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;background:#f3f4f6;}
  .ok-si.active img{border-color:#e11d48;}
  .ok-si span{font-size:9.5px;font-weight:700;color:#4b5563;line-height:1.2;word-break:break-word;}
  .ok-si.active span{color:#e11d48;}

  /* Right panel */
  #ok-crp{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;background:white;padding:10px;}
  .ok-vabtn{display:flex;align-items:center;justify-content:space-between;background:#fff1f2;border:1.5px solid #fecdd3;border-radius:12px;padding:11px 14px;cursor:pointer;margin-bottom:10px;}
  .ok-vabtn:active{background:#ffe4e6;}
  .ok-vabtn span{font-size:12px;font-weight:800;color:#e11d48;}
  .ok-vabtn i{color:#e11d48;font-size:11px;}
  .ok-glbl{font-size:10px;font-weight:800;color:#374151;background:#f9fafb;border-radius:8px;padding:6px 10px;margin:8px 0 6px;border-left:3px solid #e11d48;}
  .ok-scg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;}
  .ok-sc{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:7px 3px;border-radius:10px;text-align:center;}
  .ok-sc:active{background:#fff1f2;}
  .ok-sc img{width:66px;height:74px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb;background:#f3f4f6;}
  .ok-sc span{font-size:9.5px;font-weight:700;color:#1f2937;line-height:1.2;}

  /* Ads strip */
  .ok-ads-s{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;margin-bottom:10px;}
  .ok-ads-s::-webkit-scrollbar{display:none;}
  .ok-adc{flex-shrink:0;width:190px;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;cursor:pointer;position:relative;}
  .ok-adc img{width:100%;height:76px;object-fit:cover;display:block;}
  .ok-adbg{position:absolute;top:5px;right:5px;background:rgba(0,0,0,.5);color:white;font-size:7px;font-weight:800;padding:2px 5px;border-radius:99px;}

  /* ═══ CART PAGE ═══ */
  #view-cart-page{position:fixed;inset:0;z-index:53;background:#f5f5f5;display:flex;flex-direction:column;overflow:hidden;}
  #view-cart-page.hidden{display:none!important;}
  #ok-ch{background:white;height:56px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid #e5e7eb;box-shadow:0 1px 6px rgba(0,0,0,.08);flex-shrink:0;}
  #ok-ch h2{font-size:1.05rem;font-weight:900;color:#111827;margin:0;}
  .ok-chc{font-size:.9rem;font-weight:600;color:#6b7280;margin-left:5px;}
  #ok-cbody{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding-bottom:80px;}

  /* Address */
  #ok-addr{background:white;padding:12px 16px;border-bottom:1px solid #e5e7eb;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
  .ok-al{flex:1;min-width:0;}
  .ok-al-lbl{font-size:10px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;}
  .ok-al-main{font-size:13px;font-weight:700;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .ok-al-sub{font-size:11px;color:#6b7280;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ok-addr-chg{font-size:13px;font-weight:800;color:#2563eb;cursor:pointer;flex-shrink:0;background:none;border:none;padding:0;}

  /* Cart item */
  .ok-ci{background:white;margin-bottom:8px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;padding:14px 16px;display:flex;gap:14px;align-items:flex-start;}
  .ok-ci-img{width:80px;height:100px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb;flex-shrink:0;background:#f3f4f6;}
  .ok-ci-info{flex:1;min-width:0;}
  .ok-ci-name{font-size:13px;font-weight:600;color:#111827;line-height:1.4;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .ok-ci-meta{font-size:11px;color:#6b7280;margin-bottom:6px;}
  .ok-ci-pr{display:flex;align-items:baseline;gap:6px;margin-bottom:8px;flex-wrap:wrap;}
  .ok-ci-disc{font-size:12px;font-weight:800;color:#388e3c;}
  .ok-ci-mrp{font-size:11px;color:#9ca3af;text-decoration:line-through;}
  .ok-ci-final{font-size:14px;font-weight:900;color:#111827;}
  .ok-qrow{display:inline-flex;align-items:center;border:1px solid #e5e7eb;border-radius:4px;overflow:hidden;margin-bottom:10px;}
  .ok-qbtn{width:30px;height:28px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#374151;cursor:pointer;background:none;border:none;}
  .ok-qbtn:active{background:#f3f4f6;}
  .ok-qnum{width:30px;text-align:center;font-size:13px;font-weight:700;color:#111827;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;height:28px;display:flex;align-items:center;justify-content:center;}
  .ok-ci-acts{display:flex;border-top:1px solid #e5e7eb;padding-top:10px;}
  .ok-ci-ab{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;font-size:11px;font-weight:700;color:#374151;cursor:pointer;padding:6px 0;background:none;border:none;}
  .ok-ci-ab:first-child{border-right:1px solid #e5e7eb;}
  .ok-ci-ab:active{color:#e11d48;}

  /* Price summary */
  #ok-csum{background:white;margin-bottom:8px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;padding:14px 16px;}
  #ok-csum h4{font-size:11px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em;margin:0 0 12px;}
  .ok-pr{display:flex;justify-content:space-between;font-size:13px;color:#374151;margin-bottom:8px;}
  .ok-pr.ok-tot{font-weight:900;color:#111827;font-size:14px;border-top:1px dashed #e5e7eb;padding-top:10px;margin-top:4px;}
  .ok-savbox{margin-top:10px;background:#e8f5e9;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:700;color:#388e3c;}

  /* Empty cart */
  #ok-cempty{display:none;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;text-align:center;}
  #ok-cempty.ok-show{display:flex!important;}
  #ok-cempty i{font-size:64px;color:#e5e7eb;margin-bottom:16px;display:block;}
  #ok-cempty h3{font-size:1.1rem;font-weight:800;color:#374151;margin:0 0 6px;}
  #ok-cempty p{font-size:13px;color:#9ca3af;margin:0 0 20px;}
  #ok-cempty button{background:#2874f0;color:white;font-size:13px;font-weight:800;padding:12px 28px;border-radius:4px;border:none;cursor:pointer;}

  /* Bottom bar */
  #ok-cbar{position:fixed;bottom:0;left:0;right:0;background:white;border-top:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:10px 16px;z-index:60;box-shadow:0 -4px 16px rgba(0,0,0,.08);}
  #ok-cbar.hidden{display:none!important;}
  .ok-bamt{display:block;font-size:18px;font-weight:900;color:#111827;}
  .ok-bsav{font-size:10px;color:#388e3c;font-weight:700;}
  #ok-cpbtn{background:#2874f0;color:white;font-size:14px;font-weight:900;padding:12px 24px;border-radius:4px;border:none;cursor:pointer;}
  #ok-cpbtn:active{background:#1a5ecf;}

  #ok-nav-categories.ok-nav-active{color:#e11d48!important;}
  `;
  document.head.appendChild(s);
})();


/* ────────────────────────────────────────────────────────────────
   EXACT CATEGORIES from script-core.js
   ✅ Men/Women mein Full Combos group NAHI hai
──────────────────────────────────────────────────────────────── */
const CATS = [
  {
    key: 'Men', label: 'Men',
    photo: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=120&h=120&fit=crop&q=80',
    groups: [
      { label:'👕 Topwear',    subs:['T-Shirts','Casual Shirts','Formal Shirts','Oversized Tees','Oversized Shirts','Hoodies','Denim Jacket'] },
      { label:'👖 Bottomwear', subs:['Baggy Jeans','Straight Fit Jeans','Slim Fit Jeans','Cotton Trousers','Joggers','Cargo Pants','Formal Pant','Trousers'] },
      { label:'👟 Footwear',   subs:['Sneakers','Formal Shoes','Sports Shoes','Sandals','Slippers'] },
    ]
  },
  {
    key: 'Women', label: 'Women',
    photo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=120&fit=crop&q=80',
    groups: [
      { label:'🥻 Ethnic',     subs:['Sarees','Kurtis','Lehengas'] },
      { label:'👖 Bottomwear', subs:['Straight Fit Jeans','Trousers','Baggy Jeans','Cargo Jeans','Skinny Fit Jeans','Slim Fit Jeans'] },
      { label:'👗 Western',    subs:['Tops','Palazzo','Tops & Tunics','Dresses','Skirts'] },
      { label:'👠 Footwear',   subs:['Heels','Flats','Sandals','Sneakers','Wedges'] },
    ]
  },
  {
    key: 'Perfumes', label: 'Perfumes',
    photo: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=120&h=120&fit=crop&q=80',
    groups: [
      { label:"🌸 For Her", subs:["Women's Perfume","Body Mist","Gift Set"] },
      { label:"💼 For Him", subs:["Men's Perfume","Attar / Ittar","Deodorant Spray"] },
      { label:"✨ Unisex",  subs:["Unisex Perfume","Luxury Perfume","Budget Perfume"] },
    ]
  },
  {
    key: 'Combos', label: 'Combos 🎁',
    photo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=120&h=120&fit=crop&q=80',
    groups: [
      { label:'👕 Men Combos',    subs:['Casual Combo','Party Wear Combo','Gym Combo','Streetwear Combo','Office Combo'] },
      { label:'👗 Women Combos',  subs:['Casual Outfit Combo','Party Combo','Ethnic Combo','Western Combo','College Wear Combo'] },
      { label:'👫 Unisex Combos', subs:['Couple Combo','Best Friend Combo','Matching Outfit Combo'] },
    ]
  },
  {
    key: 'Accessories', label: 'Accessories',
    photo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&h=120&fit=crop&q=80',
    groups: [
      { label:"👨 Men's",    subs:['Sunglasses','Watches','Wallets','Bags','Belts','Caps','Chains','Bracelets','Socks'] },
      { label:"👩 Women's",  subs:['Handbags','Clutches','Earrings','Necklace Sets','Bangles','Bracelets','Hair Accessories','Scrunchies','Socks','Belts'] },
      { label:"✨ Unisex & Tech", subs:['Unisex Sunglasses','Earbuds','Power Banks','Phone Cases','Backpacks'] },
    ]
  },
  {
    key: 'Gold', label: '⭐ Gold',
    photo: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?w=120&h=120&fit=crop&q=80',
    groups: [
      { label:'👔 Men Gold',   subs:['Topwear','Bottomwear','Footwear'] },
      { label:'👗 Women Gold', subs:['Topwear','Bottomwear','Footwear'] },
    ]
  },
];

/* Short display names */
const SHORT = {
  'Formal Combo (Shirt+Trouser+Belt+Tie)':'Formal Combo',
  'Casual Combo (Tee+Baggy Jeans+Locket)':'Casual Combo',
  'Streetwear Combo (Oversized Tee+Cargo+Chain)':'Streetwear Combo',
  'Tracksuit (Full Upper & Lower)':'Tracksuit',
  'Ethnic Combo (Kurta+Pant+Dupatta)':'Ethnic Combo',
  'Sherwani Set (Sherwani+Pant+Dupatta)':'Sherwani Set',
  'Ethnic Set (Kurti+Pant+Dupatta)':'Ethnic Set',
  'Western Combo (Top+Straight Jeans+Belt)':'Western Combo',
  'Party Combo (Saree+Blouse+Belt)':'Party Combo',
  'Indo-Western (Top+Palazzo+Shrug)':'Indo-Western',
};
const _d = n => SHORT[n] || n;

/* Image cache — subcat → img url */
const _imgCache = {};

function _getSubImg(catKey, subName) {
  const cacheKey = catKey + '::' + subName;
  if (_imgCache[cacheKey]) return _imgCache[cacheKey];
  const isGold = catKey === 'Gold';
  const pool = [
    ...(window.products       || []),
    ...(window.allProducts    || []),
    ...(window._allProducts   || []),
    ...(isGold ? (window.goldProducts || window.allGoldProducts || []) : []),
  ];
  for (const p of pool) {
    const pcat = (p.category || p.cat || '').trim();
    const psub = (p.subcategory || p.subcat || p.sub_category || p.sub || '').trim();
    const pimg = (p.imgs && p.imgs[0]) || p.img || p.image || '';
    const catOk = isGold
      ? (p.is_gold || p.gold || pcat.toLowerCase() === 'gold')
      : pcat.toLowerCase() === catKey.toLowerCase();
    if (catOk && psub.toLowerCase() === subName.toLowerCase() && pimg) {
      _imgCache[cacheKey] = pimg;
      return pimg;
    }
  }
  return '';
}

/* Placeholder image per group index */
const _PH_BG = ['f3e8ff','fff0f0','e8f4ff','f0fff4','fffbe8','fce8ff','e8f0ff','fef9e7'];
function _phUrl(name, gi) {
  const txt = encodeURIComponent(_d(name).slice(0,3));
  return `https://placehold.co/66x74/${_PH_BG[gi%_PH_BG.length]}/374151?text=${txt}`;
}

let _activeCat = 0;


/* ────────────────────────────────────────────────────────────────
   BUILD CATEGORIES PAGE
──────────────────────────────────────────────────────────────── */
function _buildCatPage() {
  if (document.getElementById('view-categories')) return;
  const page = document.createElement('div');
  page.id = 'view-categories';
  page.className = 'hidden';
  page.innerHTML = `
    <div id="ok-cph"><h2>Categories</h2></div>
    <div id="ok-cpbody">
      <div id="ok-csb">
        ${CATS.map((c,i) => `
          <div class="ok-si ${i===0?'active':''}" onclick="_okCatSel(${i})" data-ci="${i}">
            <img src="${c.photo}" alt="${c.label}"
              onerror="this.src='https://placehold.co/48x48/f3f4f6/9ca3af?text=${encodeURIComponent(c.label[0])}'">
            <span>${c.label}</span>
          </div>`).join('')}
      </div>
      <div id="ok-crp"></div>
    </div>`;
  (document.getElementById('app-content') || document.querySelector('main') || document.body).appendChild(page);
  _renderRight(0);
}

window._okCatSel = function(i) {
  _activeCat = i;
  document.querySelectorAll('.ok-si').forEach((el,j) => el.classList.toggle('active', j===i));
  document.querySelector(`.ok-si[data-ci="${i}"]`)?.scrollIntoView({block:'nearest',behavior:'smooth'});
  _renderRight(i);
};

function _renderRight(i) {
  const right = document.getElementById('ok-crp');
  if (!right) return;
  const cat = CATS[i];
  if (!cat) return;
  const isGold = cat.key === 'Gold';
  const cleanLabel = cat.label.replace(/[^\w\s]/g,'').trim();

  /* Ads */
  const ads = (window._okAdsData || []).filter(a => a.active && (a.position==='all'||a.position==='home'||a.position==='categories'));
  const adsHtml = ads.length ? `<div class="ok-ads-s">${ads.slice(0,4).map(ad=>`
    <div class="ok-adc" onclick="${ad.link_url?`window.open('${ad.link_url}','_blank')`:''}">
      <img src="${ad.image_url||''}" alt="${ad.title||''}" onerror="this.parentElement.style.display='none'">
      ${ad.badge?`<div class="ok-adbg">${ad.badge}</div>`:''}
    </div>`).join('')}</div>` : '';

  /* View All */
  const vaAct = isGold
    ? `navigate('gold');_closeCategories();`
    : `openCategoryPage('${cat.key}');_closeCategories();`;

  /* Groups */
  let groupsHtml = '';
  cat.groups.forEach((grp, gi) => {
    const cards = grp.subs.map(sub => {
      const img = _getSubImg(cat.key, sub);
      const dispName = _d(sub);
      const src = img || _phUrl(sub, gi);
      const act = isGold
        ? `navigate('gold');_closeCategories();`
        : `openSubcatProducts('${cat.key}','${sub.replace(/'/g,"\\'")}');_closeCategories();`;
      return `<div class="ok-sc" onclick="${act}">
        <img src="${src}" alt="${dispName}" loading="lazy"
          onerror="this.src='${_phUrl(sub, gi)}'">
        <span>${dispName}</span>
      </div>`;
    }).join('');
    groupsHtml += `<div class="ok-glbl">${grp.label}</div><div class="ok-scg">${cards}</div>`;
  });

  right.innerHTML = `
    ${adsHtml}
    <div class="ok-vabtn" onclick="${vaAct}">
      <span><i class="fas fa-th-large" style="margin-right:6px;"></i>View All ${cleanLabel}</span>
      <i class="fas fa-chevron-right"></i>
    </div>
    ${groupsHtml}`;
  right.scrollTop = 0;
}

window._openCategories = function() {
  document.querySelectorAll('.view-section').forEach(v=>v.classList.add('hidden'));
  document.getElementById('view-cart-page')?.classList.add('hidden');
  document.getElementById('view-categories')?.classList.remove('hidden');
  _navActive(true);
  window.currentView = 'categories';
};
window._closeCategories = function() {
  document.getElementById('view-categories')?.classList.add('hidden');
};

/* Re-render images when products actually load */
function _watchProducts() {
  let att = 0;
  const iv = setInterval(() => {
    att++;
    const p = (window.products||window.allProducts||[]);
    if (p.length || att > 40) {
      clearInterval(iv);
      if (p.length) {
        // Clear image cache so fresh images load
        Object.keys(_imgCache).forEach(k => delete _imgCache[k]);
        _renderRight(_activeCat);
      }
    }
  }, 800);
}


/* ────────────────────────────────────────────────────────────────
   CART PAGE (Flipkart style)
   ✅ FIX: empty + items dono saath nahi dikhenge
──────────────────────────────────────────────────────────────── */
function _buildCartPage() {
  if (document.getElementById('view-cart-page')) return;
  const page = document.createElement('div');
  page.id = 'view-cart-page';
  page.className = 'hidden';
  page.innerHTML = `
    <div id="ok-ch"><h2>My Cart<span class="ok-chc" id="ok-chc"></span></h2></div>
    <div id="ok-cbody">
      <div id="ok-addr">
        <div class="ok-al">
          <div class="ok-al-lbl">Deliver to</div>
          <div class="ok-al-main" id="ok-al-main">Select address</div>
          <div class="ok-al-sub" id="ok-al-sub"></div>
        </div>
        <button class="ok-addr-chg" onclick="_closeCartPage();proceedToCheckout&&proceedToCheckout()">Change</button>
      </div>
      <div id="ok-citems"></div>
      <div id="ok-csum" style="display:none;">
        <h4>Price Details</h4>
        <div class="ok-pr"><span id="ok-ps-lbl">Price</span><span id="ok-ps-mrp">₹0</span></div>
        <div class="ok-pr" id="ok-ps-dr"><span>Discount</span><span style="color:#388e3c;font-weight:800;" id="ok-ps-d">-₹0</span></div>
        <div class="ok-pr ok-tot"><span>Total Amount</span><span id="ok-ps-tot">₹0</span></div>
        <div class="ok-savbox">🎉 You will save <span id="ok-ps-sv">₹0</span> on this order</div>
      </div>
      <div id="ok-cempty">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty!</h3>
        <p>Add items to get started</p>
        <button onclick="_closeCartPage();navigate('home')">Shop Now</button>
      </div>
    </div>
    <div id="ok-cbar" class="hidden">
      <div>
        <span class="ok-bamt" id="ok-bamt">₹0</span>
        <span class="ok-bsav" id="ok-bsav"></span>
      </div>
      <button id="ok-cpbtn" onclick="_closeCartPage();proceedToCheckout&&proceedToCheckout()">PLACE ORDER</button>
    </div>`;
  (document.getElementById('app-content') || document.querySelector('main') || document.body).appendChild(page);
}

function _getCart() {
  const keys = ['outfitkart_cart','ok_cart','cart'];
  for (const k of keys) {
    try { const r=localStorage.getItem(k); if(r){const p=JSON.parse(r);if(Array.isArray(p)&&p.length)return p;} } catch {}
  }
  return Array.isArray(window.cart)&&window.cart.length ? [...window.cart] : [];
}
function _saveCart(c) {
  try { localStorage.setItem('outfitkart_cart',JSON.stringify(c)); } catch {}
  try { localStorage.setItem('ok_cart',JSON.stringify(c)); } catch {}
  window.cart = c; window.cartItems = c;
}
function _getUser() {
  const keys=['outfitkart_user','ok_user','user_data','currentUser','outfitkart_session'];
  for (const k of keys) {
    try { const r=localStorage.getItem(k); if(r){const u=JSON.parse(r);if(u&&(u.name||u.mobile))return u;} } catch {}
  }
  return window.currentUser||null;
}

window._openCartPage = function() {
  document.querySelectorAll('.view-section').forEach(v=>v.classList.add('hidden'));
  document.getElementById('view-categories')?.classList.add('hidden');
  const sb=document.getElementById('cart-sidebar');
  if(sb)sb.style.transform='translateX(100%)';
  document.getElementById('cart-overlay')?.classList.add('hidden');
  document.getElementById('view-cart-page')?.classList.remove('hidden');
  window.currentView='cart';
  _navActive(false);
  _renderCart();
};
window._closeCartPage = function() {
  document.getElementById('view-cart-page')?.classList.add('hidden');
};

function _renderCart() {
  const cart    = _getCart();
  const citems  = document.getElementById('ok-citems');
  const csum    = document.getElementById('ok-csum');
  const cempty  = document.getElementById('ok-cempty');
  const cbar    = document.getElementById('ok-cbar');
  const chc     = document.getElementById('ok-chc');
  if (!citems) return;

  /* Address */
  const u = _getUser();
  const am = document.getElementById('ok-al-main');
  const as = document.getElementById('ok-al-sub');
  if (am) {
    if (u && (u.name||u.full_name)) {
      am.textContent = `${u.name||u.full_name}${u.city?', '+u.city:''}${u.pincode?' '+u.pincode:''}`;
      if (as) as.textContent = u.road||u.house||u.address||'';
    } else {
      am.textContent = 'Select delivery address';
      if (as) as.textContent = '';
    }
  }

  /* ── EMPTY STATE ── */
  if (!cart.length) {
    citems.innerHTML = '';
    if (csum)   csum.style.display   = 'none';
    if (cbar)   cbar.classList.add('hidden');
    if (chc)    chc.textContent      = '';
    if (cempty) cempty.classList.add('ok-show');   /* show empty */
    return;
  }

  /* ── HAS ITEMS ── */
  if (cempty) cempty.classList.remove('ok-show');  /* hide empty */
  if (csum)   csum.style.display   = 'block';
  if (cbar)   cbar.classList.remove('hidden');
  if (chc)    chc.textContent = ` (${cart.length})`;

  let mrpT=0, finT=0;
  citems.innerHTML = cart.map((item,idx) => {
    const img  = item.img||(item.imgs&&item.imgs[0])||'https://placehold.co/80x100/f3f4f6/9ca3af?text=?';
    const name = item.name||'Product';
    const size = item.size||item.selectedSize||'';
    const qty  = item.qty||item.quantity||1;
    const pr   = item.price||0;
    const op   = item.oldprice||item.mrp||Math.round(pr*1.4);
    const disc = op>pr ? Math.round(((op-pr)/op)*100) : 0;
    const fin  = pr*qty;
    const mrp  = op*qty;
    mrpT+=mrp; finT+=fin;
    return `<div class="ok-ci">
      <img class="ok-ci-img" src="${img}" alt="${name}" onerror="this.src='https://placehold.co/80x100/f3f4f6/9ca3af?text=?'">
      <div class="ok-ci-info">
        <div class="ok-ci-name">${name}</div>
        <div class="ok-ci-meta">${size?'Size: '+size+' · ':''}Seller: OutfitKart</div>
        <div class="ok-ci-pr">
          ${disc>0?`<span class="ok-ci-disc">${disc}% off</span>`:''}
          ${op>pr?`<span class="ok-ci-mrp">₹${op.toLocaleString('en-IN')}</span>`:''}
          <span class="ok-ci-final">₹${fin.toLocaleString('en-IN')}</span>
        </div>
        <div class="ok-qrow">
          <button class="ok-qbtn" onclick="_okQ(${idx},-1)">−</button>
          <span class="ok-qnum">${qty}</span>
          <button class="ok-qbtn" onclick="_okQ(${idx},1)">+</button>
        </div>
        <div class="ok-ci-acts">
          <button class="ok-ci-ab" onclick="_okR(${idx})"><i class="fas fa-trash-alt" style="font-size:10px;"></i> REMOVE</button>
          <button class="ok-ci-ab" onclick="_closeCartPage();navigate('profile','wishlist')"><i class="far fa-heart" style="font-size:10px;"></i> SAVE FOR LATER</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const saved = mrpT-finT;
  const _e = id => document.getElementById(id);
  if(_e('ok-ps-lbl'))  _e('ok-ps-lbl').textContent  = `Price (${cart.length} item${cart.length>1?'s':''})`;
  if(_e('ok-ps-mrp'))  _e('ok-ps-mrp').textContent  = `₹${mrpT.toLocaleString('en-IN')}`;
  if(_e('ok-ps-d'))    _e('ok-ps-d').textContent    = `-₹${saved.toLocaleString('en-IN')}`;
  if(_e('ok-ps-dr'))   _e('ok-ps-dr').style.display  = saved>0?'flex':'none';
  if(_e('ok-ps-tot'))  _e('ok-ps-tot').textContent   = `₹${finT.toLocaleString('en-IN')}`;
  if(_e('ok-ps-sv'))   _e('ok-ps-sv').textContent    = `₹${saved.toLocaleString('en-IN')}`;
  if(_e('ok-bamt'))    _e('ok-bamt').textContent     = `₹${finT.toLocaleString('en-IN')}`;
  if(_e('ok-bsav')&&saved>0) _e('ok-bsav').textContent = `You save ₹${saved.toLocaleString('en-IN')}`;
}

window._okQ = function(idx,d) {
  const c=_getCart(); if(!c[idx])return;
  c[idx].qty=Math.max(1,(c[idx].qty||c[idx].quantity||1)+d);
  c[idx].quantity=c[idx].qty;
  _saveCart(c); _renderCart();
  typeof updateCartCount==='function'&&updateCartCount();
  typeof renderCart==='function'&&renderCart();
};
window._okR = function(idx) {
  const c=_getCart(); c.splice(idx,1);
  _saveCart(c); _renderCart();
  typeof updateCartCount==='function'&&updateCartCount();
  typeof renderCart==='function'&&renderCart();
};


/* ────────────────────────────────────────────────────────────────
   BOTTOM NAV PATCH
──────────────────────────────────────────────────────────────── */
function _patchNav() {
  const nav = document.querySelector('nav.fixed.bottom-0');
  if (!nav) { setTimeout(_patchNav,400); return; }

  /* Shop → Categories */
  let shopEl=null;
  nav.querySelectorAll('[onclick]').forEach(el=>{
    const oc=el.getAttribute('onclick')||'';
    if(oc.includes("navigate('shop')")&&!oc.includes('gold')&&!oc.includes('cart')&&!oc.includes('profile')&&!oc.includes('home'))shopEl=el;
  });
  if(!shopEl) nav.querySelectorAll('span').forEach(sp=>{
    if(!shopEl&&sp.textContent.trim().toLowerCase()==='shop')shopEl=sp.closest('[onclick]');
  });
  if(shopEl){
    shopEl.id='ok-nav-categories';
    shopEl.setAttribute('onclick','_openCategories()');
    const ic=shopEl.querySelector('i');if(ic)ic.className='fas fa-th-large text-lg';
    shopEl.querySelectorAll('span').forEach(sp=>{if(sp.textContent.trim().toLowerCase()==='shop')sp.textContent='Categories';});
  }

  /* Cart nav → cart page */
  nav.querySelectorAll('[onclick]').forEach(el=>{
    const oc=el.getAttribute('onclick')||'';
    if(oc.includes('toggleCart()')||oc.includes("navigate('cart')"))el.setAttribute('onclick','_openCartPage()');
  });
}

function _patchToggleCart() {
  if(window._okTCP)return; window._okTCP=true;
  window.toggleCart=function(){
    const cp=document.getElementById('view-cart-page');
    if(cp&&!cp.classList.contains('hidden'))_closeCartPage();
    else _openCartPage();
  };
  document.querySelectorAll('[onclick*="toggleCart"]').forEach(el=>{
    if(!el.closest('nav.fixed.bottom-0'))el.setAttribute('onclick','_openCartPage()');
  });
}

function _navActive(on){
  const btn=document.getElementById('ok-nav-categories');
  if(btn)btn.style.color=on?'#e11d48':'';
}


/* ────────────────────────────────────────────────────────────────
   NAVIGATE PATCH
──────────────────────────────────────────────────────────────── */
function _patchNavigate(){
  if(window._cnp4done)return;
  if(!window.navigate)return;
  window._cnp4done=true;
  const orig=window.navigate;
  window.navigate=function(view,...args){
    if(view!=='categories'){_closeCategories();_navActive(false);}
    if(view!=='cart')_closeCartPage();
    return orig(view,...args);
  };
}


/* ────────────────────────────────────────────────────────────────
   HOME — Instagram div hatao (agar index.html mein reh gaya ho)
──────────────────────────────────────────────────────────────── */
function _removeInstaBtn() {
  document.querySelectorAll('a[href*="instagram.com"]').forEach(el => {
    const wrap = el.closest('.mt-4.mx-4.mb-4');
    if (wrap) wrap.remove();
    else if (el.textContent.includes('Follow OutfitKart')) el.closest('div')?.remove();
  });
}


/* ────────────────────────────────────────────────────────────────
   INIT
──────────────────────────────────────────────────────────────── */
function _init(){
  _buildCatPage();
  _buildCartPage();
  _patchNav();
  _watchProducts();
  _removeInstaBtn();

  const wn=setInterval(()=>{if(typeof window.navigate==='function'){clearInterval(wn);_patchNavigate();}},300);
  setTimeout(_patchToggleCart,1200);
  setTimeout(_patchToggleCart,3000);
  setTimeout(_removeInstaBtn, 1500); /* mega-patch ke baad bhi remove karo */

  /* Ads watch */
  let aa=0;
  const wa=setInterval(()=>{aa++;if(window._okAdsData||aa>20){clearInterval(wa);if(window._okAdsData)_renderRight(_activeCat);}},1000);

  console.log('%c🗂️ CatNav v4.0 ✅','background:#e11d48;color:white;font-weight:900;font-size:11px;padding:3px 10px;border-radius:5px;');
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(_init,500));
else setTimeout(_init,500);

Object.assign(window,{
  _openCategories,_closeCategories,_okCatSel:window._okCatSel,
  _openCartPage:window._openCartPage,_closeCartPage:window._closeCartPage,
  _okQ:window._okQ,_okR:window._okR,
});

})();
