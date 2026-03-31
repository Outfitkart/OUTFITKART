R,
});

})();
'use strict';
/* ================================================================
   OutfitKart — CATEGORIES NAV PATCH v5.0
   - Bottom nav "Categories" already set in index.html
   - Har subcat ka real Unsplash image hardcoded hai
   - Products load hone pe real product images replace kar denge
   ================================================================ */

(function _okCatPatch() {

/* ── CSS ── */
(function(){
  if (document.getElementById('ok-cnp5-css')) return;
  const s = document.createElement('style');
  s.id = 'ok-cnp5-css';
  s.textContent = `
  #view-categories{position:fixed;inset:0;z-index:52;background:#f5f5f5;display:flex;flex-direction:column;overflow:hidden;}
  #view-categories.hidden{display:none!important;}
  #ok-cph{background:white;height:56px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid #e5e7eb;box-shadow:0 1px 6px rgba(0,0,0,.08);flex-shrink:0;}
  #ok-cph h2{font-size:1.05rem;font-weight:900;color:#111827;margin:0;}
  #ok-cpbody{display:flex;flex:1;overflow:hidden;}
  #ok-csb{width:90px;flex-shrink:0;background:#efefef;overflow-y:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:80px;}
  #ok-csb::-webkit-scrollbar{display:none;}
  .ok-si{display:flex;flex-direction:column;align-items:center;padding:12px 6px;cursor:pointer;border-left:3px solid transparent;text-align:center;gap:5px;}
  .ok-si.active{background:white;border-left-color:#e11d48;}
  .ok-si img{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;}
  .ok-si.active img{border-color:#e11d48;}
  .ok-si span{font-size:9.5px;font-weight:700;color:#4b5563;line-height:1.2;word-break:break-word;}
  .ok-si.active span{color:#e11d48;}
  #ok-crp{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;background:white;padding:10px;padding-bottom:80px;}
  .ok-vabtn{display:flex;align-items:center;justify-content:space-between;background:#fff1f2;border:1.5px solid #fecdd3;border-radius:12px;padding:11px 14px;cursor:pointer;margin-bottom:10px;}
  .ok-vabtn:active{background:#ffe4e6;}
  .ok-vabtn span{font-size:12px;font-weight:800;color:#e11d48;}
  .ok-glbl{font-size:10px;font-weight:800;color:#374151;background:#f9fafb;border-radius:8px;padding:6px 10px;margin:8px 0 6px;border-left:3px solid #e11d48;}
  .ok-scg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;}
  .ok-sc{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:7px 3px;border-radius:10px;text-align:center;}
  .ok-sc:active{background:#fff1f2;}
  .ok-sc img{width:66px;height:74px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb;}
  .ok-sc span{font-size:9.5px;font-weight:700;color:#1f2937;line-height:1.2;}
  .ok-ads-s{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;margin-bottom:10px;}
  .ok-ads-s::-webkit-scrollbar{display:none;}
  .ok-adc{flex-shrink:0;width:190px;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;cursor:pointer;position:relative;}
  .ok-adc img{width:100%;height:76px;object-fit:cover;display:block;}
  .ok-adbg{position:absolute;top:5px;right:5px;background:rgba(0,0,0,.5);color:white;font-size:7px;font-weight:800;padding:2px 5px;border-radius:99px;}

  #ok-nav-categories.ok-nav-active{color:#e11d48!important;}
  `;
  document.head.appendChild(s);
})();


/* ────────────────────────────────────────────────────────────────
   CATEGORIES DATA — script-core.js ke exact groups + subcats
   Har subcat ka real Unsplash image hardcoded hai
──────────────────────────────────────────────────────────────── */
const CATS = [
  {
    key:'Men', label:'Men',
    photo:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'👕 Topwear', subs:[
        {n:'T-Shirts',        img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=220&fit=crop&q=80'},
        {n:'Casual Shirts',   img:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=220&fit=crop&q=80'},
        {n:'Formal Shirts',   img:'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80'},
        {n:'Oversized Tees',  img:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=220&fit=crop&q=80'},
        {n:'Oversized Shirts',img:'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=200&h=220&fit=crop&q=80'},
        {n:'Hoodies',         img:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&h=220&fit=crop&q=80'},
        {n:'Denim Jacket',    img:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👖 Bottomwear', subs:[
        {n:'Baggy Jeans',         img:'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=200&h=220&fit=crop&q=80'},
        {n:'Straight Fit Jeans',  img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80'},
        {n:'Slim Fit Jeans',      img:'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=200&h=220&fit=crop&q=80'},
        {n:'Cotton Trousers',     img:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=220&fit=crop&q=80'},
        {n:'Joggers',             img:'https://images.unsplash.com/photo-1556906781-9a412961a28b?w=200&h=220&fit=crop&q=80'},
        {n:'Cargo Pants',         img:'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200&h=220&fit=crop&q=80'},
        {n:'Formal Pant',         img:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=200&h=220&fit=crop&q=80'},
        {n:'Trousers',            img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👟 Footwear', subs:[
        {n:'Sneakers',      img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80'},
        {n:'Formal Shoes',  img:'https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=200&h=220&fit=crop&q=80'},
        {n:'Sports Shoes',  img:'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200&h=220&fit=crop&q=80'},
        {n:'Sandals',       img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80'},
        {n:'Slippers',      img:'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Women', label:'Women',
    photo:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'🥻 Ethnic', subs:[
        {n:'Sarees',   img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80'},
        {n:'Kurtis',   img:'https://images.unsplash.com/photo-1582718560869-01152e38cfd4?w=200&h=220&fit=crop&q=80'},
        {n:'Lehengas', img:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👖 Bottomwear', subs:[
        {n:'Straight Fit Jeans', img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=220&fit=crop&q=80'},
        {n:'Trousers',           img:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=200&h=220&fit=crop&q=80'},
        {n:'Baggy Jeans',        img:'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=200&h=220&fit=crop&q=80'},
        {n:'Cargo Jeans',        img:'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200&h=220&fit=crop&q=80'},
        {n:'Skinny Fit Jeans',   img:'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=200&h=220&fit=crop&q=80'},
        {n:'Slim Fit Jeans',     img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👗 Western', subs:[
        {n:'Tops',          img:'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=200&h=220&fit=crop&q=80'},
        {n:'Palazzo',       img:'https://images.unsplash.com/photo-1583496661160-fb5886a773ec?w=200&h=220&fit=crop&q=80'},
        {n:'Tops & Tunics', img:'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80'},
        {n:'Dresses',       img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80'},
        {n:'Skirts',        img:'https://images.unsplash.com/photo-1583496661160-fb5886a773ec?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👠 Footwear', subs:[
        {n:'Heels',   img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=220&fit=crop&q=80'},
        {n:'Flats',   img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80'},
        {n:'Sandals', img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80'},
        {n:'Sneakers',img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80'},
        {n:'Wedges',  img:'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Perfumes', label:'Perfumes',
    photo:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'🌸 For Her', subs:[
        {n:"Women's Perfume", img:'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=220&fit=crop&q=80'},
        {n:'Body Mist',       img:'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=220&fit=crop&q=80'},
        {n:'Gift Set',        img:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'💼 For Him', subs:[
        {n:"Men's Perfume",   img:'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=200&h=220&fit=crop&q=80'},
        {n:'Attar / Ittar',   img:'https://images.unsplash.com/photo-1594913862946-f6da68f9bdde?w=200&h=220&fit=crop&q=80'},
        {n:'Deodorant Spray', img:'https://images.unsplash.com/photo-1582903942568-e67dc6bab25d?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'✨ Unisex', subs:[
        {n:'Unisex Perfume',  img:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80'},
        {n:'Luxury Perfume',  img:'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80'},
        {n:'Budget Perfume',  img:'https://images.unsplash.com/photo-1547887538-047f28cce9b4?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Combos', label:'Combos 🎁',
    photo:'https://images.unsplash.com/photo-1445205170230-053b83016050?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'👕 Men Combos', subs:[
        {n:'Casual Combo',      img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=220&fit=crop&q=80'},
        {n:'Party Wear Combo',  img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=220&fit=crop&q=80'},
        {n:'Gym Combo',         img:'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=220&fit=crop&q=80'},
        {n:'Streetwear Combo',  img:'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=220&fit=crop&q=80'},
        {n:'Office Combo',      img:'https://images.unsplash.com/photo-1600091166971-7f9faad6c498?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👗 Women Combos', subs:[
        {n:'Casual Outfit Combo',img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=220&fit=crop&q=80'},
        {n:'Party Combo',        img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80'},
        {n:'Ethnic Combo',       img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80'},
        {n:'Western Combo',      img:'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80'},
        {n:'College Wear Combo', img:'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👫 Unisex Combos', subs:[
        {n:'Couple Combo',       img:'https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?w=200&h=220&fit=crop&q=80'},
        {n:'Best Friend Combo',  img:'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&h=220&fit=crop&q=80'},
        {n:'Matching Outfit Combo',img:'https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Accessories', label:'Accessories',
    photo:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:"👨 Men's", subs:[
        {n:'Sunglasses', img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=220&fit=crop&q=80'},
        {n:'Watches',    img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=220&fit=crop&q=80'},
        {n:'Wallets',    img:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=220&fit=crop&q=80'},
        {n:'Bags',       img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80'},
        {n:'Belts',      img:'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200&h=220&fit=crop&q=80'},
        {n:'Caps',       img:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&h=220&fit=crop&q=80'},
        {n:'Chains',     img:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=220&fit=crop&q=80'},
        {n:'Bracelets',  img:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=220&fit=crop&q=80'},
        {n:'Socks',      img:'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:"👩 Women's", subs:[
        {n:'Handbags',         img:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=220&fit=crop&q=80'},
        {n:'Clutches',         img:'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200&h=220&fit=crop&q=80'},
        {n:'Earrings',         img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80'},
        {n:'Necklace Sets',    img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80'},
        {n:'Bangles',          img:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=220&fit=crop&q=80'},
        {n:'Hair Accessories', img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=220&fit=crop&q=80'},
        {n:'Scrunchies',       img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'✨ Unisex & Tech', subs:[
        {n:'Unisex Sunglasses',img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=220&fit=crop&q=80'},
        {n:'Earbuds',          img:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=220&fit=crop&q=80'},
        {n:'Power Banks',      img:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=220&fit=crop&q=80'},
        {n:'Phone Cases',      img:'https://images.unsplash.com/photo-1601593346740-925612772716?w=200&h=220&fit=crop&q=80'},
        {n:'Backpacks',        img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Gold', label:'⭐ Gold',
    photo:'https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'👔 Men Gold', subs:[
        {n:'Topwear',    img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=220&fit=crop&q=80'},
        {n:'Bottomwear', img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80'},
        {n:'Footwear',   img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👗 Women Gold', subs:[
        {n:'Topwear',    img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=220&fit=crop&q=80'},
        {n:'Bottomwear', img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=220&fit=crop&q=80'},
        {n:'Footwear',   img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
];

/* Short display names */
const SHORT={'Formal Combo (Shirt+Trouser+Belt+Tie)':'Formal Combo','Casual Combo (Tee+Baggy Jeans+Locket)':'Casual Combo','Streetwear Combo (Oversized Tee+Cargo+Chain)':'Streetwear Combo','Tracksuit (Full Upper & Lower)':'Tracksuit','Ethnic Combo (Kurta+Pant+Dupatta)':'Ethnic Combo','Sherwani Set (Sherwani+Pant+Dupatta)':'Sherwani Set','Ethnic Set (Kurti+Pant+Dupatta)':'Ethnic Set','Western Combo (Top+Straight Jeans+Belt)':'Western Combo','Party Combo (Saree+Blouse+Belt)':'Party Combo','Indo-Western (Top+Palazzo+Shrug)':'Indo-Western'};
const _d=n=>SHORT[n]||n;

let _activeCat=0;

/* Get real product image for subcat if available */
function _prodImg(catKey, subName) {
  const isGold = catKey==='Gold';
  const pool=[...(window.products||[]),...(window.allProducts||[]),...(window._allProducts||[]),...(isGold?(window.goldProducts||window.allGoldProducts||[]):[])];
  for(const p of pool){
    const pc=(p.category||p.cat||'').trim();
    const ps=(p.subcategory||p.subcat||p.sub_category||p.sub||'').trim();
    const pi=(p.imgs&&p.imgs[0])||p.img||p.image||'';
    const cm=isGold?(p.is_gold||p.gold||pc.toLowerCase()==='gold'):pc.toLowerCase()===catKey.toLowerCase();
    if(cm&&ps.toLowerCase()===subName.toLowerCase()&&pi)return pi;
  }
  return null;
}

/* ── BUILD CATEGORIES PAGE ── */
function _buildCatPage(){
  if(document.getElementById('view-categories'))return;
  const page=document.createElement('div');
  page.id='view-categories';page.className='hidden';
  page.innerHTML=`
    <div id="ok-cph"><h2>Categories</h2></div>
    <div id="ok-cpbody">
      <div id="ok-csb">
        ${CATS.map((c,i)=>`
          <div class="ok-si ${i===0?'active':''}" onclick="_okCatSel(${i})" data-ci="${i}">
            <img src="${c.photo}" alt="${c.label}" onerror="this.src='https://placehold.co/48x48/f3f4f6/9ca3af?text=${encodeURIComponent(c.label[0])}'">
            <span>${c.label}</span>
          </div>`).join('')}
      </div>
      <div id="ok-crp"></div>
    </div>`;
  (document.getElementById('app-content')||document.querySelector('main')||document.body).appendChild(page);
  _renderRight(0);
}

window._okCatSel=function(i){
  _activeCat=i;
  document.querySelectorAll('.ok-si').forEach((el,j)=>el.classList.toggle('active',j===i));
  document.querySelector(`.ok-si[data-ci="${i}"]`)?.scrollIntoView({block:'nearest',behavior:'smooth'});
  _renderRight(i);
};

function _renderRight(i){
  const right=document.getElementById('ok-crp');
  if(!right)return;
  const cat=CATS[i];if(!cat)return;
  const isGold=cat.key==='Gold';
  const cleanLabel=cat.label.replace(/[^\w\s]/g,'').trim();

  /* Ads */
  const ads=(window._okAdsData||[]).filter(a=>a.active&&(a.position==='all'||a.position==='home'||a.position==='categories'));
  const adsHtml=ads.length?`<div class="ok-ads-s">${ads.slice(0,4).map(ad=>`
    <div class="ok-adc" onclick="${ad.link_url?`window.open('${ad.link_url}','_blank')`:''}">
      <img src="${ad.image_url||''}" onerror="this.parentElement.style.display='none'">
      ${ad.badge?`<div class="ok-adbg">${ad.badge}</div>`:''}
    </div>`).join('')}</div>`:'';

  const vaAct=isGold?`navigate('gold');_closeCategories();`:`openCategoryPage('${cat.key}');_closeCategories();`;

  let groupsHtml='';
  cat.groups.forEach(grp=>{
    const cards=grp.subs.map(sub=>{
      /* Real product image override karein agar available ho */
      const prodImg=_prodImg(cat.key,sub.n);
      const imgSrc=prodImg||sub.img;
      const act=isGold?`navigate('gold');_closeCategories();`:`openSubcatProducts('${cat.key}','${sub.n.replace(/'/g,"\\'")}');_closeCategories();`;
      return `<div class="ok-sc" onclick="${act}">
        <img src="${imgSrc}" alt="${_d(sub.n)}" loading="lazy" onerror="this.src='${sub.img}'">
        <span>${_d(sub.n)}</span>
      </div>`;
    }).join('');
    groupsHtml+=`<div class="ok-glbl">${grp.label}</div><div class="ok-scg">${cards}</div>`;
  });

  const promoHtml=`<div style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">
    <div onclick="if(typeof _closeCategories==='function')_closeCategories();if(typeof openProfilePage==='function')openProfilePage('referrals');" style="background:linear-gradient(135deg,#064e3b,#065f46);border-radius:12px;padding:12px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px rgba(0,0,0,.12);">
      <div style="width:38px;height:38px;background:rgba(255,255,255,.15);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">🎁</div>
      <div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:900;color:white;">Refer &amp; Earn ₹50+</div><div style="font-size:9.5px;color:rgba(255,255,255,.7);margin-top:2px;">Dost ko refer karo, 5% commission pao</div></div>
      <i class="fas fa-chevron-right" style="color:rgba(255,255,255,.5);font-size:10px;"></i>
    </div>
    <div onclick="if(typeof _closeCategories==='function')_closeCategories();if(typeof openProfilePage==='function')openProfilePage('influencer');" style="background:linear-gradient(135deg,#4c1d95,#6d28d9);border-radius:12px;padding:12px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px rgba(0,0,0,.12);">
      <div style="width:38px;height:38px;background:rgba(255,255,255,.15);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">🎬</div>
      <div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:900;color:white;">Influencer Program</div><div style="font-size:9.5px;color:rgba(255,255,255,.7);margin-top:2px;">Video banao, ₹50 per 1K views kamao</div></div>
      <i class="fas fa-chevron-right" style="color:rgba(255,255,255,.5);font-size:10px;"></i>
    </div>
  </div>`;

  right.innerHTML=`${adsHtml}
    <div class="ok-vabtn" onclick="${vaAct}">
      <span><i class="fas fa-th-large" style="margin-right:6px;"></i>View All ${cleanLabel}</span>
      <i class="fas fa-chevron-right"></i>
    </div>${groupsHtml}${promoHtml}`;
  right.scrollTop=0;
}

window._openCategories=function(){
  document.querySelectorAll('.view-section').forEach(v=>v.classList.add('hidden'));
  document.getElementById('view-categories')?.classList.remove('hidden');
  _navActive(true);window.currentView='categories';
};
window._closeCategories=function(){
  document.getElementById('view-categories')?.classList.add('hidden');
};

/* When products load, re-render to get real images */
function _watchProducts(){
  let att=0;
  const iv=setInterval(()=>{
    att++;
    if((window.products||window.allProducts||[]).length||att>40){
      clearInterval(iv);
      if((window.products||window.allProducts||[]).length)_renderRight(_activeCat);
    }
  },800);
}




/* ── NAV PATCHES ── */

function _navActive(on){
  const btn=document.getElementById('ok-nav-categories');
  if(btn)btn.style.color=on?'#e11d48':'';
}

function _patchNavigate(){
  if(window._cnp5done)return;
  if(!window.navigate)return;
  window._cnp5done=true;
  const orig=window.navigate;
  window.navigate=function(view,...args){
    if(view!=='categories'){_closeCategories();_navActive(false);}
    return orig(view,...args);
  };
}


/* ── INIT ── */
function _init(){
  _buildCatPage();
  _watchProducts();

  const wn=setInterval(()=>{if(typeof window.navigate==='function'){clearInterval(wn);_patchNavigate();}},300);

  /* Ads watch */
  let aa=0;
  const wa=setInterval(()=>{aa++;if(window._okAdsData||aa>20){clearInterval(wa);if(window._okAdsData)_renderRight(_activeCat);}},1000);

  console.log('%c🗂️ CatNav v5.0 ✅ Real images loaded','background:#e11d48;color:white;font-weight:900;font-size:11px;padding:3px 10px;border-radius:5px;');
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(_init,500));
else setTimeout(_init,500);

Object.assign(window,{
  _openCategories,_closeCategories,_okCatSel:window._okCatSel,
});

})();
