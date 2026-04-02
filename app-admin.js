'use strict';
/* ============================================================
   SCRIPT-ADMIN.JS — OutfitKart Admin Panel (FULLY UPDATED)
   Changes:
   1. ScrapingBee auto-import REMOVED completely
   2. Supplier URL field in normal Add Product → clickable in orders
   3. Gold: full form with supplier_price, supplier_url, margin,
      auto-calc selling price, auto-gen description, ImgBB upload
      Uses 'description' column (not 'desc')
   4. Promo Codes management tab — create, share to Telegram/WhatsApp
   5. Orders show supplier URL as clickable link + promo info
   ============================================================ */

/* ============================================================
   A1. ADMIN AUTH
   ============================================================ */
function showAdminLogin(){const m=document.getElementById('admin-login-modal');m?.classList.remove('hidden');m?.classList.add('flex');document.getElementById('admin-mobile')?.focus();}
function closeAdminLogin(goToHome=false){const m=document.getElementById('admin-login-modal');m?.classList.add('hidden');m?.classList.remove('flex');if(goToHome)navigate('home');}
function updateAdminNameInHeader(){const name=localStorage.getItem('outfitkart_admin_name')||'Admin';const nameEl=document.getElementById('admin-display-name');const avatarEl=document.getElementById('admin-avatar-initial');const pill=document.getElementById('admin-user-name-pill');if(nameEl)nameEl.textContent=name;if(avatarEl)avatarEl.textContent=name.charAt(0).toUpperCase();if(pill){pill.classList.remove('hidden');pill.classList.add('flex');}}

async function handleAdminLogin(e){
    e.preventDefault();
    const mobile=document.getElementById('admin-mobile').value.trim().replace(/\D/g,'');
    const password=document.getElementById('admin-password').value.trim();
    if(mobile.length!==10){showToast('Enter valid 10-digit mobile number ❌');return;}
    const btnEl=e.target.querySelector('button[type="submit"]');
    if(btnEl){btnEl.disabled=true;btnEl.innerHTML='<i class="fas fa-spinner fa-spin mr-2"></i>Verifying...';}
    try{
        if(!ADMIN_AUTHORIZED_MOBILES.includes(mobile)){showToast('Access Denied ❌ Not an authorized admin');if(btnEl){btnEl.disabled=false;btnEl.innerHTML='<i class="fas fa-lock mr-2"></i>Login';}document.getElementById('admin-password').value='';return;}
        const{data:user,error}=await dbClient.from('users').select('mobile,name,password').eq('mobile',mobile).eq('password',password).maybeSingle();
        if(error)throw error;
        if(!user){showToast('Invalid Mobile or Password ❌');document.getElementById('admin-password').value='';if(btnEl){btnEl.disabled=false;btnEl.innerHTML='<i class="fas fa-lock mr-2"></i>Login';}return;}
        isAdminLoggedIn=true;
        localStorage.setItem('outfitkart_admin_session','true');
        localStorage.setItem('outfitkart_admin_name',user.name||'Admin');
        localStorage.setItem('outfitkart_admin_mobile',user.mobile);
        showToast('Welcome '+(user.name||'Admin')+'! 👋');
        document.getElementById('admin-mobile').value='';document.getElementById('admin-password').value='';
        closeAdminLogin();setTimeout(()=>navigate('admin'),100);
    }catch(err){showToast('Login error: '+err.message);if(btnEl){btnEl.disabled=false;btnEl.innerHTML='<i class="fas fa-lock mr-2"></i>Login';}}
}

function loadAdminDashboard(){updateAdminNameInHeader();switchAdminTab('dashboard');renderAdminDashboard();}

/* ============================================================
   A2. DASHBOARD WITH CHARTS
   ============================================================ */
async function renderAdminDashboard(){
    const dashboardEl=document.getElementById('admin-dashboard-content');if(!dashboardEl)return;
    dashboardEl.innerHTML='<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-3xl text-purple-600"></i><p class="mt-2 text-gray-500">Loading...</p></div>';
    try{
        const[ordersRes,usersRes,referralsRes]=await Promise.all([
            dbClient.from('orders').select('*').order('date',{ascending:false}),
            dbClient.from('users').select('*'),
            dbClient.from('referrals').select('commission,status').order('id',{ascending:false}).limit(500),
        ]);
        const allOrders=ordersRes.data||[];const allUsers=usersRes.data||[];const allReferrals=referralsRes.data||[];
        const activeOrders=allOrders.filter(o=>o.status!=='Cancelled');const cancelledOrders=allOrders.filter(o=>o.status==='Cancelled');
        const totalRevenue=activeOrders.reduce((s,o)=>s+(o.total||0),0);const totalProfit=activeOrders.reduce((s,o)=>s+(o.margin_total||0),0);
        const recentOrders=allOrders.slice(0,5);
        const pendingComm=allReferrals.filter(r=>r.status==='pending').reduce((s,r)=>s+(r.commission||0),0);
        const confirmedComm=allReferrals.filter(r=>r.status==='confirmed').reduce((s,r)=>s+(r.commission||0),0);
        const last7Labels=[],revenueByDay=[],profitByDay=[],ordersByDay=[];
        for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const dateStr=d.toLocaleDateString('en-IN');const dayOrders=allOrders.filter(o=>o.date===dateStr&&o.status!=='Cancelled');last7Labels.push(`${d.getDate()}/${d.getMonth()+1}`);revenueByDay.push(dayOrders.reduce((s,o)=>s+(o.total||0),0));profitByDay.push(dayOrders.reduce((s,o)=>s+(o.margin_total||0),0));ordersByDay.push(dayOrders.length);}
        const statusCounts={};allOrders.forEach(o=>{statusCounts[o.status]=(statusCounts[o.status]||0)+1;});
        const countBadge=document.getElementById('sidebar-product-count');if(countBadge)countBadge.textContent=products.length;
        dashboardEl.innerHTML=`
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div class="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-xl text-white shadow-lg"><div class="text-xl font-black">₹${totalRevenue.toLocaleString('en-IN')}</div><div class="text-xs opacity-90 font-semibold mt-1">Total Revenue</div><div class="text-[10px] opacity-70 mt-0.5">${activeOrders.length} active orders</div></div>
            <div class="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl text-white shadow-lg"><div class="text-xl font-black">₹${totalProfit.toLocaleString('en-IN')}</div><div class="text-xs opacity-90 font-semibold mt-1">Total Profit</div><div class="text-[10px] opacity-70 mt-0.5">From margin_amt</div></div>
            <div class="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg"><div class="text-xl font-black">${activeOrders.length}</div><div class="text-xs opacity-90 font-semibold mt-1">Active Orders</div><span class="text-[10px] bg-red-400/60 px-1.5 py-0.5 rounded-full font-bold mt-1 inline-block">${cancelledOrders.length} cancelled</span></div>
            <div class="bg-gradient-to-br from-rose-500 to-rose-700 p-4 rounded-xl text-white shadow-lg"><div class="text-xl font-black">${allUsers.length}</div><div class="text-xs opacity-90 font-semibold mt-1">Total Users</div><div class="text-[10px] opacity-70 mt-0.5">${products.length} products</div></div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div class="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-3"><div class="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"><i class="fas fa-hourglass-half text-amber-500 text-sm"></i></div><div><div class="text-[10px] text-gray-500">Pending Referral</div><div class="text-base font-black text-amber-600">₹${pendingComm.toLocaleString('en-IN')}</div></div></div>
            <div class="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-3"><div class="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"><i class="fas fa-gift text-green-600 text-sm"></i></div><div><div class="text-[10px] text-gray-500">Confirmed Referral</div><div class="text-base font-black text-green-600">₹${confirmedComm.toLocaleString('en-IN')}</div></div></div>
            <div class="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-3"><div class="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"><i class="fas fa-chart-bar text-purple-600 text-sm"></i></div><div><div class="text-[10px] text-gray-500">Avg Order Value</div><div class="text-base font-black">₹${activeOrders.length?Math.round(totalRevenue/activeOrders.length).toLocaleString('en-IN'):0}</div></div></div>
            <div class="bg-white p-3 rounded-xl border shadow-sm flex items-center gap-3"><div class="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0"><i class="fas fa-percentage text-teal-600 text-sm"></i></div><div><div class="text-[10px] text-gray-500">Profit Margin</div><div class="text-base font-black text-teal-600">${totalRevenue?Math.round((totalProfit/totalRevenue)*100):0}%</div></div></div>
        </div>
        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div class="bg-white rounded-xl border shadow-sm p-4"><h3 class="font-bold text-xs text-gray-700 mb-3 uppercase tracking-wide"><i class="fas fa-chart-bar text-purple-600 mr-2"></i>Revenue & Profit — Last 7 Days</h3><div style="position:relative;height:190px"><canvas id="dash-rev-chart"></canvas></div></div>
            <div class="bg-white rounded-xl border shadow-sm p-4"><h3 class="font-bold text-xs text-gray-700 mb-3 uppercase tracking-wide"><i class="fas fa-chart-line text-blue-600 mr-2"></i>Orders — Last 7 Days</h3><div style="position:relative;height:190px"><canvas id="dash-ord-chart"></canvas></div></div>
        </div>
        <div class="grid md:grid-cols-3 gap-4 mb-4">
            <div class="bg-white rounded-xl border shadow-sm p-4"><h3 class="font-bold text-xs text-gray-700 mb-3 uppercase tracking-wide"><i class="fas fa-chart-pie text-rose-500 mr-2"></i>Order Status</h3><div style="position:relative;height:170px"><canvas id="dash-pie-chart"></canvas></div></div>
            <div class="bg-white rounded-xl border shadow-sm p-4 md:col-span-2">
                <div class="flex items-center justify-between mb-3"><h3 class="font-bold text-xs text-gray-700 uppercase tracking-wide"><i class="fas fa-clock text-purple-600 mr-2"></i>Recent Orders</h3><button onclick="switchAdminTab('order')" class="text-[10px] bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg font-bold border border-purple-200">View All →</button></div>
                ${recentOrders.length?recentOrders.map(order=>{const badge=STATUS_BADGE[order.status]||'bg-gray-100 text-gray-600';return`<div class="flex justify-between items-center py-2 border-b last:border-b-0"><div><div class="font-semibold text-sm">#${order.id}</div><div class="text-xs text-gray-400">${order.customer_name||'N/A'} • ${order.date||''}</div></div><div class="text-right"><div class="font-bold text-sm">₹${(order.total||0).toLocaleString('en-IN')}</div><span class="${badge} text-[10px] px-2 py-0.5 rounded-full font-bold">${order.status}</span></div></div>`;}).join(''):'<div class="text-center text-gray-400 py-6 text-sm">No orders yet</div>'}
            </div>
        </div>`;
        setTimeout(()=>_renderDashboardCharts(last7Labels,revenueByDay,profitByDay,ordersByDay,statusCounts),150);
    }catch(err){dashboardEl.innerHTML='<div class="text-center text-red-500 py-10"><i class="fas fa-exclamation-triangle text-3xl mb-3"></i><p>Error loading dashboard</p></div>';}
}

function _renderDashboardCharts(labels, revenueByDay, profitByDay, ordersByDay, statusCounts) {
    function _draw() {
        const C = window.Chart;
        if (!C) return;

        // Purane charts ko destroy karna taaki memory leak na ho
        ['dash-rev-chart', 'dash-ord-chart', 'dash-pie-chart'].forEach(id => {
            const el = document.getElementById(id);
            if (el && el._ci) {
                el._ci.destroy();
                el._ci = null;
            }
        });

        // 1. Revenue & Profit Chart (Bar)
        const revEl = document.getElementById('dash-rev-chart');
        if (revEl) {
            const ctx = revEl.getContext('2d');
            revEl._ci = new C(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        { label: 'Revenue ₹', data: revenueByDay, backgroundColor: 'rgba(124,58,237,0.75)', borderRadius: 5 },
                        { label: 'Profit ₹', data: profitByDay, backgroundColor: 'rgba(34,197,94,0.75)', borderRadius: 5 }
                    ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    scales: { y: { ticks: { callback: v => '₹' + (v >= 1000 ? (v / 1000) + 'k' : v) } } }
                }
            });
        }

        // 2. Orders Chart (Line)
        const ordEl = document.getElementById('dash-ord-chart');
        if (ordEl) {
            const ctx = ordEl.getContext('2d');
            ordEl._ci = new C(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{ label: 'Orders', data: ordersByDay, borderColor: '#3b82f6', fill: true, tension: 0.4 }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        // 3. Status Pie Chart (Doughnut)
        const pieEl = document.getElementById('dash-pie-chart');
        const pieLabels = Object.keys(statusCounts);
        if (pieEl && pieLabels.length) {
            const ctx = pieEl.getContext('2d');
            pieEl._ci = new C(ctx, {
                type: 'doughnut',
                data: {
                    labels: pieLabels,
                    datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#7c3aed', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'] }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '60%' }
            });
        }
    }

    // Chart.js loading logic - FIXED
    if (window.Chart) {
        _draw();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
        script.onload = _draw;
        document.head.appendChild(script);
    }
}

/* ============================================================
   A3. ADMIN SIDEBAR TABS
   ============================================================ */
function switchAdminTab(tab){
    document.querySelectorAll('.admin-content-tab').forEach(el=>{el.style.display='none';el.classList.add('hidden');});
    const targetTab=document.getElementById(`admin-tab-${tab}`);if(targetTab){targetTab.style.display='block';targetTab.classList.remove('hidden');}
    document.querySelectorAll('.admin-nav-btn').forEach(btn=>btn.classList.remove('active'));
    const activeBtn=document.getElementById(`btn-admin-${tab}`);if(activeBtn)activeBtn.classList.add('active');
    if(tab!=='products'&&tab!=='inventory')closeEditModal();
    if(window.innerWidth<768)toggleAdminSidebar();
    const countBadge=document.getElementById('sidebar-product-count');if(countBadge)countBadge.textContent=products.length;
    if(tab==='dashboard')renderAdminDashboard();
    if(tab==='products')renderAdminProducts();
    if(tab==='order')loadAllOrdersAdmin();
    if(tab==='payout')loadAllWithdrawalsAdmin();
    if(tab==='users')loadAllUsersAdmin();
    if(tab==='referrals')loadAdminReferrals();
    if(tab==='influencer')loadAdminInfluencerRequests();
    if(tab==='gold')loadAdminGoldProducts();
    if(tab==='electronics')loadAdminElectronicsProducts();
    if(tab==='promo')loadAdminPromoCodes();
}

function toggleAdminSidebar(){
    const sidebar=document.getElementById('admin-sidebar');const overlay=document.getElementById('admin-sidebar-overlay');if(!sidebar||!overlay)return;
    const isOpen=!sidebar.classList.contains('-translate-x-full');
    if(isOpen){sidebar.classList.add('-translate-x-full');overlay.classList.add('hidden');}
    else{sidebar.classList.remove('-translate-x-full');overlay.classList.remove('hidden');}
}

/* ============================================================
   A4. LOGOUT / EXIT
   ============================================================ */
function adminLogout(){isAdminLoggedIn=false;['outfitkart_admin_session','outfitkart_admin_name','outfitkart_admin_username','outfitkart_admin_mobile'].forEach(k=>localStorage.removeItem(k));document.body.classList.remove('admin-active');const pill=document.getElementById('admin-user-name-pill');if(pill){pill.classList.add('hidden');pill.classList.remove('flex');}showToast('Admin Logged Out');navigate('home');}
function exitAdmin(){isAdminLoggedIn=false;['outfitkart_admin_session','outfitkart_admin_name','outfitkart_admin_username','outfitkart_admin_mobile'].forEach(k=>localStorage.removeItem(k));document.body.classList.remove('admin-active');navigate('home');}

/* ============================================================
   A5. PRODUCTS — ADD / EDIT / DELETE (ScrapingBee REMOVED)
   ============================================================ */
function updateDropdownSubs(catId,subId){
    try{
        const catEl=document.getElementById(catId);const subEl=document.getElementById(subId);if(!catEl||!subEl)return;
        const cData=CATEGORIES.find(c=>c.name===catEl.value);subEl.innerHTML='<option value="">Select Subcategory</option>';if(!cData)return;
        if(cData.groups){cData.groups.forEach(group=>{const og=document.createElement('optgroup');og.label=group.label;group.items.forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;og.appendChild(o);});subEl.appendChild(og);});}
        else{cData.subs.forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;subEl.appendChild(o);});}
        updateSizeSection(catEl.value);
    }catch(e){}
}

function updateSizeSection(categoryName){
    const sizeSection=document.getElementById('admin-size-section');
    const mlSection=document.getElementById('admin-ml-section');
    if(!sizeSection||!mlSection)return;
    const isPerf=isPerfumeCategory(categoryName);
    const isCombo=categoryName==='Combos'||categoryName==='Combo';
    mlSection.classList.toggle('hidden',!isPerf);
    if(isPerf){
        sizeSection.querySelectorAll('.admin-size-standard').forEach(el=>el.classList.add('hidden'));
    } else if(isCombo){
        // Combos: saare sections dikhao — admin khud choose kare
        sizeSection.querySelectorAll('.admin-size-standard').forEach(el=>el.classList.remove('hidden'));
        if(!sizeSection.querySelector('.combo-hint')){
            const hint=document.createElement('div');
            hint.className='combo-hint';
            hint.style.cssText='font-size:10px;color:#374151;background:#fef9c3;border:1px solid #fde047;padding:8px 12px;border-radius:8px;margin-bottom:8px;';
            hint.textContent='Combo Tip: Sirf woh sizes select karo jo is combo mein hain. User ko sirf wohi options dikhenge. Example: Shirt+Jeans => Topwear(S/M/L) + Bottomwear(28/30/32)';
            sizeSection.insertBefore(hint,sizeSection.firstChild);
        }
    } else {
        sizeSection.querySelectorAll('.admin-size-standard').forEach(el=>el.classList.remove('hidden'));
    }
}

function toggleProductMode(mode){
    // ScrapingBee removed — always show manual fields
    const manualFields=document.getElementById('manual-fields');if(!manualFields)return;
    manualFields.classList.remove('hidden');
    const modeManual=document.getElementById('mode-manual');if(modeManual)modeManual.checked=true;
    updateSellingPreview();
    // Replace auto-import section with info box
    const autoImport=document.getElementById('auto-import-fields');
    if(autoImport&&!autoImport.querySelector('.scrape-removed-notice')){
        autoImport.innerHTML=`<div class="scrape-removed-notice bg-blue-50 border border-blue-200 rounded-xl p-4"><i class="fas fa-info-circle text-blue-500 mr-2"></i><span class="text-sm text-blue-700 font-semibold">Supplier URL field neeche add karo — order panel mein clickable link milega</span></div>`;
    }
}

function updateSellingPreview(){
    const supplier=parseInt(document.getElementById('ap-supplier-price')?.value)||0;
    // Sync range slider and number input
    const rangeEl=document.getElementById('ap-margin-pct');
    const numEl=document.getElementById('ap-margin-pct-num');
    const marginPct=parseFloat((numEl?.value!==undefined&&numEl?.value!=='')?numEl.value:(rangeEl?.value||0))||0;
    if(rangeEl)rangeEl.value=marginPct;
    if(numEl&&document.activeElement!==numEl)numEl.value=marginPct;
    const marginAmt=Math.round(supplier*marginPct/100);
    const selling=supplier+marginAmt;
    const mrp=Math.round(selling*1.4);
    const prev=document.getElementById('selling-price-preview');
    const val=document.getElementById('selling-price-value');
    const mVal=document.getElementById('margin-amt-preview');
    const mrpVal=document.getElementById('mrp-preview-value');
    const pEl=document.getElementById('ap-price');
    const mEl=document.getElementById('ap-margin');
    const oldPriceEl=document.getElementById('ap-oldprice');
    if(prev)prev.classList.toggle('hidden',selling===0);
    if(val)val.textContent=`₹${selling.toLocaleString()}`;
    if(mVal)mVal.textContent=`₹${marginAmt.toLocaleString()}`;
    if(mrpVal)mrpVal.textContent=`₹${mrp.toLocaleString()}`;
    if(pEl)pEl.value=selling;
    if(mEl)mEl.value=marginAmt;
    // MRP auto-fill karo agar user ne khud nahi bhara
    if(oldPriceEl&&selling>0&&!oldPriceEl.dataset.manualEdit)oldPriceEl.value=mrp;
}

function autoGenerateDescription(){
    const name=document.getElementById('ap-name')?.value;if(!name)return showToast('Enter Product Name first');
    document.getElementById('ap-desc').value=`Elevate your style with our premium ${name}. Crafted for the modern wardrobe with unmatched quality, comfort, and durability. Perfect for every occasion — from casual outings to formal events. 100% authentic product. Limited stock available — order now!`;
}

async function adminAddProduct(e){
    e.preventDefault();
    const imgLinks=document.getElementById('ap-imgs').value.split('\n').map(l=>l.trim()).filter(Boolean);
    const catVal=document.getElementById('ap-category').value;const isPerf=isPerfumeCategory(catVal);
    let sizes=[];
    if(isPerf){sizes=Array.from(document.querySelectorAll('.ml-admin-chk:checked')).map(cb=>cb.value);if(!sizes.length)sizes=PERFUME_ML_SIZES;}
    else{
        sizes=Array.from(document.querySelectorAll('.size-admin-chk:checked')).map(cb=>cb.value);
        if(!sizes.length&&String(catVal).toLowerCase()==='accessories')sizes=['Free Size'];
    }
    const supplierPrice=parseInt(document.getElementById('ap-supplier-price')?.value)||0;
    const marginPct=parseFloat(document.getElementById('ap-margin-pct')?.value)||0;
    const marginAmt=Math.round(supplierPrice*marginPct/100)||parseInt(document.getElementById('ap-margin')?.value)||0;
    const sellingPrice=supplierPrice+marginAmt;
    if(sellingPrice<=0)return showToast('Enter a valid Supplier/Cost Price');
    const _su1=document.getElementById('ap-supplier-url-field')?.value.trim()||'';
    const _su2=document.getElementById('ap-supplier-url-2')?.value.trim()||'';
    const _su3=document.getElementById('ap-supplier-url-3')?.value.trim()||'';
    const _su4=document.getElementById('ap-supplier-url-4')?.value.trim()||'';
    const _suArr=[_su1,_su2,_su3,_su4].filter(Boolean);
    const supplierUrl=_suArr.length>1?JSON.stringify(_suArr):(_suArr[0]||'');
    const newP={
        name:document.getElementById('ap-name').value.trim(),price:sellingPrice,supplier_price:supplierPrice,margin_amt:marginAmt,
        supplier_url:supplierUrl,
        oldprice:parseInt(document.getElementById('ap-oldprice').value)||Math.round(sellingPrice*1.4),
        checkout_discount:parseInt(document.getElementById('ap-discount').value)||0,
        brand:document.getElementById('ap-brand').value.trim(),imgs:imgLinks,category:catVal,
        sub:document.getElementById('ap-sub').value,desc:document.getElementById('ap-desc').value.trim(),
        stock_qty:parseInt(document.getElementById('ap-stock').value)||50,available_sizes:sizes,istrending:true,
    };
    try{
        const{data,error}=await dbClient.from('products').insert([newP]).select().single();if(error)throw error;
        if(data){products.push(data);e.target.reset();updateDropdownSubs('ap-category','ap-sub');renderAdminProducts();showToast(`✅ Added! Sell: ₹${sellingPrice} | Cost: ₹${supplierPrice} | Profit: ₹${marginAmt}`);const countBadge=document.getElementById('sidebar-product-count');if(countBadge)countBadge.textContent=products.length;}
    }catch(err){showToast('Error: '+err.message);}
}

function renderAdminProducts(){
    const container=document.getElementById('admin-product-list');if(!container)return;
    const countBadge=document.getElementById('sidebar-product-count');if(countBadge)countBadge.textContent=products.length;
    if(!products.length){container.innerHTML=`<div class="text-center py-20"><i class="fas fa-box-open text-6xl text-gray-300 mb-4"></i><p class="text-gray-500 text-lg font-semibold">No products yet</p><button onclick="switchAdminTab('inventory')" class="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg font-bold text-sm">Add First Product</button></div>`;return;}
    container.innerHTML=`<div class="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 border-b sticky top-0 z-10"><div class="flex items-center justify-between"><span class="text-sm font-bold text-purple-700"><i class="fas fa-boxes mr-2"></i>Total: ${products.length} products</span></div></div>`+
        [...products].reverse().map(p=>{
            const isPerf=isPerfumeCategory(p.category);
            const supplierLink=(()=>{if(!p.supplier_url)return '';let urls=[];try{const pv=JSON.parse(p.supplier_url);if(Array.isArray(pv))urls=pv;else urls=[p.supplier_url];}catch{urls=[p.supplier_url];}return urls.map((u,i)=>`<a href="${u}" target="_blank" rel="noopener" class="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1 mt-0.5" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt text-[9px]"></i> Supplier${urls.length>1?' '+(i+1):''}</a>`).join('');})();
            return `<div class="flex justify-between items-center p-3 border-b text-sm hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <img src="${p.imgs?.[0]||p.img||'https://placehold.co/48x48/eee/666?text=?'}" class="w-12 h-12 rounded-lg object-cover border shadow-sm flex-shrink-0" loading="lazy">
                    <div class="min-w-0 flex-1">
                        <span class="truncate block font-semibold text-gray-800">${p.name}</span>
                        <span class="text-xs text-gray-500">${p.category} • ${p.sub||'N/A'}${isPerf?' 🌸':''}</span>
                        ${p.brand?`<span class="text-xs text-blue-600 block font-medium">${p.brand}</span>`:''}
                        ${supplierLink}
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <div class="text-right">
                        <div class="font-bold text-gray-900">₹${p.price}</div>
                        ${p.supplier_price?`<div class="text-[10px] text-gray-400">Cost: ₹${p.supplier_price}</div>`:''}
                        ${p.margin_amt?`<div class="text-[10px] text-green-600 font-bold">+₹${p.margin_amt}</div>`:''}
                    </div>
                    <button onclick="openEditProduct(${p.id})" class="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"><i class="fas fa-pen text-sm"></i></button>
                    <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"><i class="fas fa-trash text-sm"></i></button>
                </div>
            </div>`;
        }).join('');
}

async function openEditProduct(productId){
    const p=products.find(x=>x.id===productId);if(!p)return showToast('Product not found');
    const isPerf=isPerfumeCategory(p.category);
    document.getElementById('edit-product-id').value=p.id;
    document.getElementById('edit-product-title').textContent=`(ID: ${p.id})`;
    document.getElementById('ep-name').value=p.name||'';document.getElementById('ep-price').value=p.price||'';
    if(document.getElementById('ep-margin-amt'))document.getElementById('ep-margin-amt').value=p.margin_amt||0;
    document.getElementById('ep-category').value=p.category||'Men';
    setTimeout(()=>{updateDropdownSubs('ep-category','ep-sub');document.getElementById('ep-sub').value=p.sub||'';},50);
    document.getElementById('edit-ap-brand').value=p.brand||'';document.getElementById('ep-desc').value=p.desc||'';
    document.getElementById('ep-oldprice').value=p.oldprice||'';document.getElementById('ep-discount').value=p.checkout_discount||0;
    document.getElementById('ep-stock').value=p.stock_qty||50;
    document.getElementById('ep-imgs').value=Array.isArray(p.imgs)?p.imgs.join('\n'):(p.imgs||'');
    // Fill supplier URL fields (parse JSON array if multiple)
    const epSupUrl=document.getElementById('ep-supplier-url');
    if(epSupUrl){
        let _epUrls=[];
        try{const _pv=JSON.parse(p.supplier_url||'');if(Array.isArray(_pv))_epUrls=_pv;else _epUrls=[p.supplier_url||''];}
        catch{_epUrls=[p.supplier_url||''];}
        epSupUrl.value=_epUrls[0]||'';
        ['ep-supplier-url-2','ep-supplier-url-3','ep-supplier-url-4'].forEach((id,i)=>{const el=document.getElementById(id);if(el)el.value=_epUrls[i+1]||'';});
    }
    const grid=document.getElementById('ep-sizes-grid');grid.innerHTML='';
    const allSizes=isPerf?PERFUME_ML_SIZES:['XS','S','M','L','XL','XXL','XXXL','28','30','32','34','36','38','40','5','6','7','8','9','10','11','12','Free Size'];
    if(isPerf){const lbl=document.createElement('p');lbl.className='text-xs text-purple-600 font-bold mb-2 col-span-full';lbl.textContent='🌸 Select ML Volumes:';grid.appendChild(lbl);}
    allSizes.forEach(size=>{const lbl=document.createElement('label');lbl.className='flex items-center gap-1 cursor-pointer text-xs';lbl.innerHTML=`<input type="checkbox" value="${size}" class="ep-size-chk" ${p.available_sizes?.includes(size)?'checked':''}><span>${size}</span>`;grid.appendChild(lbl);});
    const modal=document.getElementById('edit-product-modal');modal?.classList.remove('hidden');modal?.classList.add('flex');
}
function closeEditModal(){document.getElementById('edit-product-modal')?.classList.add('hidden');document.getElementById('edit-product-form')?.reset();}

async function updateProduct(event){
    event.preventDefault();
    const productId=document.getElementById('edit-product-id').value;
    const updates={name:document.getElementById('ep-name').value,price:parseInt(document.getElementById('ep-price').value),margin_amt:parseInt(document.getElementById('ep-margin-amt')?.value)||0,oldprice:parseInt(document.getElementById('ep-oldprice').value)||0,checkout_discount:parseInt(document.getElementById('ep-discount').value)||0,brand:document.getElementById('edit-ap-brand').value,category:document.getElementById('ep-category').value,sub:document.getElementById('ep-sub').value,desc:document.getElementById('ep-desc').value,stock_qty:parseInt(document.getElementById('ep-stock').value)||0,available_sizes:Array.from(document.querySelectorAll('.ep-size-chk:checked')).map(cb=>cb.value),imgs:document.getElementById('ep-imgs').value.split('\n').map(l=>l.trim()).filter(Boolean),supplier_url:(()=>{const _u1=document.getElementById('ep-supplier-url')?.value.trim()||'';const _u2=document.getElementById('ep-supplier-url-2')?.value.trim()||'';const _u3=document.getElementById('ep-supplier-url-3')?.value.trim()||'';const _u4=document.getElementById('ep-supplier-url-4')?.value.trim()||'';const _ua=[_u1,_u2,_u3,_u4].filter(Boolean);return _ua.length>1?JSON.stringify(_ua):(_ua[0]||null);})()};
    try{const{data,error}=await dbClient.from('products').update(updates).eq('id',productId).select().single();if(error)throw error;const idx=products.findIndex(p=>p.id==productId);if(idx>-1)products[idx]=data;closeEditModal();renderAdminProducts();showToast('✅ Product Updated!');}
    catch(err){showToast('❌ Update failed: '+err.message);}
}

async function deleteProduct(id){
    if(!confirm('Delete this product?'))return;
    try{await dbClient.from('products').delete().eq('id',id);products=products.filter(p=>p.id!==id);renderAdminProducts();const countBadge=document.getElementById('sidebar-product-count');if(countBadge)countBadge.textContent=products.length;showToast('Deleted from DB. 🗑️');}
    catch(err){showToast('Delete failed: '+err.message);}
}

function addCustomMlVolume(){
    const inp=document.getElementById('custom-ml-input');if(!inp||!inp.value||isNaN(Number(inp.value)))return showToast('Valid number enter karo');
    const val=inp.value.trim()+'ml';const existing=document.querySelector(`.ml-admin-chk[value="${val}"]`);
    if(existing){existing.checked=true;showToast(`${val} already hai — checked!`);inp.value='';return;}
    const grid=document.querySelector('#admin-ml-section .grid');if(!grid)return;
    const lbl=document.createElement('label');lbl.className='flex items-center gap-1 cursor-pointer';lbl.innerHTML=`<input type="checkbox" value="${val}" class="ml-admin-chk accent-purple-600" checked> ${val}`;
    grid.appendChild(lbl);showToast(`✅ ${val} add ho gaya!`);inp.value='';
}

/* ============================================================
   A6. DOM READY — inject supplier URL + promo tab + hide scraping
   ============================================================ */
document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{
        // Supplier URLs (4 links) in Add Product form
        if(!document.getElementById('ap-supplier-url-field')){
            const brandRow=document.getElementById('ap-brand')?.closest('.grid');
            if(brandRow){
                const div=document.createElement('div');div.className='md:col-span-2';
                div.innerHTML=`<label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Supplier Links (order panel mein dikhenge — max 4)</label><div class="space-y-1.5"><input type="url" id="ap-supplier-url-field" placeholder="Link 1 (Main)" class="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300"><input type="url" id="ap-supplier-url-2" placeholder="Link 2 (Optional)" class="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300"><input type="url" id="ap-supplier-url-3" placeholder="Link 3 (Optional)" class="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300"><input type="url" id="ap-supplier-url-4" placeholder="Link 4 (Optional)" class="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300"></div>`;
                brandRow.insertAdjacentElement('afterend',div);
            }
        }
        // Supplier URL in Edit Product modal
        if(!document.getElementById('ep-supplier-url')){
            const epDisc=document.getElementById('ep-discount');if(epDisc){const div=document.createElement('div');div.className='md:col-span-2';div.innerHTML=`<label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Supplier Links (max 4)</label><div class="space-y-1.5"><input type="url" id="ep-supplier-url" placeholder="Link 1 (Main)" class="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300"><input type="url" id="ep-supplier-url-2" placeholder="Link 2 (Optional)" class="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300"><input type="url" id="ep-supplier-url-3" placeholder="Link 3 (Optional)" class="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300"><input type="url" id="ep-supplier-url-4" placeholder="Link 4 (Optional)" class="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300"></div>`;epDisc.closest('.grid')?.insertAdjacentElement('afterend',div);}
        }
        // Replace auto-import/ScrapingBee section
        const autoImport=document.getElementById('auto-import-fields');
        if(autoImport){autoImport.innerHTML=`<div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3"><i class="fas fa-info-circle text-blue-500 text-lg mt-0.5"></i><div><p class="font-bold text-blue-800 text-sm mb-1">Manual Product Entry</p><p class="text-xs text-blue-600">Supplier URL field neeche available hai — admin panel ke orders mein clickable link dikhega jab koi order aayega.</p></div></div>`;}
        // Always show manual fields
        const manualFields=document.getElementById('manual-fields');if(manualFields)manualFields.classList.remove('hidden');
        // Inject promo tab button + tab HTML
        _injectPromoTabUI();
    },600);
});

function _injectPromoTabUI(){
    // Promo button in sidebar
    if(!document.getElementById('btn-admin-promo')){
        const refBtn=document.getElementById('btn-admin-referrals');
        if(refBtn){
            const btn=document.createElement('button');btn.id='btn-admin-promo';btn.onclick=()=>switchAdminTab('promo');btn.className='admin-nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all';btn.innerHTML=`<span class="nav-icon"><i class="fas fa-tag"></i></span><span class="flex-1 text-left">Promo Codes</span><span class="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">NEW</span>`;
            refBtn.insertAdjacentElement('beforebegin',btn);
        }
    }
    // Promo tab content panel
    if(!document.getElementById('admin-tab-promo')){
        const adminContent=document.querySelector('.flex-1.p-4.md\\:p-6');
        if(adminContent){const tab=document.createElement('div');tab.id='admin-tab-promo';tab.className='admin-content-tab hidden space-y-3';tab.innerHTML=`<div class="bg-white p-4 md:p-6 rounded-xl shadow-md border"><div class="flex items-center justify-between mb-4"><h3 class="font-bold text-lg text-rose-600 flex items-center gap-2"><i class="fas fa-tag"></i> Promo Codes</h3><button onclick="loadAdminPromoCodes()" class="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold border border-purple-200 hover:bg-purple-200"><i class="fas fa-sync-alt mr-1"></i>Refresh</button></div><div id="admin-promo-content"><div class="text-center py-8 text-gray-400"><i class="fas fa-tag text-4xl mb-3"></i><p class="font-semibold">Click Refresh to load promo codes</p></div></div></div>`;adminContent.appendChild(tab);}
    }
}

/* ============================================================
   A7. ORDERS MANAGEMENT
   ============================================================ */
async function loadAllOrdersAdmin(){
    const container=document.getElementById('admin-full-order-list');if(!container)return;
    container.innerHTML='<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-2xl text-purple-600"></i></div>';
    try{const{data,error}=await dbClient.from('orders').select('*').order('date',{ascending:false});if(error)throw error;window.allAdminOrders=data||[];renderFilteredOrders(document.getElementById('admin-order-filter')?.value||'all');}
    catch(err){container.innerHTML=`<div class="text-center py-6 text-red-500">Error: ${err.message}</div>`;}
}
function filterAdminOrders(status){renderFilteredOrders(status);}

function renderFilteredOrders(filterStatus){
    const container=document.getElementById('admin-full-order-list');if(!container)return;
    const allOrders=window.allAdminOrders||[];const filteredData=filterStatus==='all'?allOrders:allOrders.filter(o=>o.status===filterStatus);
    if(!allOrders.length){container.innerHTML=`<div class="text-center py-20"><i class="fas fa-receipt text-6xl text-gray-300 mb-4"></i><p class="text-gray-500 text-lg font-semibold">No orders yet</p></div>`;return;}
    const activeOrders=allOrders.filter(o=>o.status!=='Cancelled');const cancelledOrders=allOrders.filter(o=>o.status==='Cancelled');
    if(!filteredData.length){container.innerHTML=`<div class="text-center py-16"><i class="fas fa-filter text-5xl text-gray-300 mb-3"></i><p class="text-gray-500 font-semibold">No ${filterStatus} orders found</p></div>`;return;}
    const headerHtml=`<div class="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200 mb-4 sticky top-0 z-10"><div class="flex items-center justify-between flex-wrap gap-2"><span class="text-sm font-black text-purple-700">${filterStatus==='all'?`Total: ${allOrders.length}`:`${filterStatus}: ${filteredData.length}`}</span><div class="flex gap-2"><span class="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full border border-green-200 font-bold">Active: ${activeOrders.length}</span><span class="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-full border border-red-200 font-bold">Cancelled: ${cancelledOrders.length}</span></div></div></div>`;
    container.innerHTML=headerHtml+filteredData.map(o=>{
        const oidSafe=String(o.id||'').replace(/'/g,"\\'");const badge=STATUS_BADGE[o.status]||'bg-gray-100 text-gray-600';
        const itemsHtml=o.items?.length?o.items.map(item=>{const prod=products.find(p=>p.id===item.id)||goldProducts.find(p=>p.id===item.id);const suppUrl=prod?.supplier_url||item.supplier_url||'';return `<div class="admin-order-item"><img src="${item.img||'https://placehold.co/48x60/e11d48/fff?text=?'}" alt="${item.name}" onerror="this.src='https://placehold.co/48x60/eee/999?text=?'" loading="lazy"><div class="admin-order-item-info"><div class="admin-order-item-name" title="${item.name}">${item.name}</div><div class="admin-order-item-meta">Size: <strong>${item.size||'M'}</strong> &nbsp;•&nbsp; Qty: <strong>${item.qty||1}</strong></div><div class="admin-order-item-price">₹${((item.price||0)*(item.qty||1)).toLocaleString('en-IN')}</div>${suppUrl?(()=>{let urls=[];try{const p=JSON.parse(suppUrl);if(Array.isArray(p))urls=p;else urls=[suppUrl];}catch{urls=[suppUrl];}return urls.map((u,i)=>`<a href="${u}" target="_blank" rel="noopener" class="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-0.5 mt-0.5"><i class="fas fa-external-link-alt text-[8px]"></i> Supplier ${urls.length>1?i+1:''} Link</a>`).join('');})():''}</div></div>`;}).join(''):'<div class="text-xs text-gray-400 italic py-2 px-1">No item details</div>';
        const promoInfo=o.promo_code?`<div class="col-span-2 bg-rose-50 rounded p-1.5 border border-rose-200"><span class="font-bold text-rose-700 uppercase text-[10px]">Promo</span><div class="font-mono font-semibold text-rose-800 mt-0.5">${o.promo_code} (-₹${o.promo_discount||0})</div></div>`:'';
        return `<div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-3 hover:shadow-md transition-all">
            <div class="flex justify-between items-start pb-3 mb-3 border-b"><div><span class="font-bold text-purple-700 font-mono text-sm">#${o.id}</span><span class="${badge} text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">${o.status||'Processing'}</span><div class="text-xs text-gray-500 mt-1">${o.date||''} • ${o.paymentmode||''}</div></div><div class="font-black text-lg text-rose-600">₹${(o.total||0).toLocaleString('en-IN')}</div></div>
            <div class="grid grid-cols-2 gap-2 text-xs mb-3 bg-gray-50 rounded-lg p-3 border">
                <div><span class="font-bold text-gray-400 uppercase text-[10px]">Customer</span><div class="font-semibold text-gray-800 mt-0.5">${o.customer_name||'N/A'}</div></div>
                <div><span class="font-bold text-gray-400 uppercase text-[10px]">Mobile</span><div class="font-semibold text-gray-800 mt-0.5">${o.mobile||'N/A'}</div></div>
                <div class="col-span-2"><span class="font-bold text-gray-400 uppercase text-[10px]">TX ID</span><div class="font-mono text-gray-700 mt-0.5 truncate">${o.transaction_id||'N/A'}</div></div>
                ${o.margin_total?`<div class="col-span-2 bg-green-50 rounded p-1.5 border border-green-200"><span class="font-bold text-green-700 uppercase text-[10px]">Profit</span><div class="font-bold text-green-700 mt-0.5">₹${o.margin_total.toLocaleString('en-IN')}</div></div>`:''}
                ${o.referral_code?`<div class="col-span-2 bg-green-50 rounded p-1.5 border border-green-200"><span class="font-bold text-green-700 uppercase text-[10px]">Referral Code</span><div class="font-mono font-semibold text-green-800 mt-0.5">${o.referral_code}</div></div>`:''}
                ${promoInfo}
                ${o.refund_upi?`<div class="col-span-2 bg-rose-50 rounded p-1.5 border border-rose-200"><span class="font-bold text-rose-700 uppercase text-[10px]">Refund UPI</span><div class="font-mono font-semibold text-rose-800 mt-0.5 select-all">${o.refund_upi}</div></div>`:''}
            </div>
            <div class="mb-3"><div class="text-[10px] font-bold text-gray-400 uppercase mb-2">Items (${(o.items||[]).length})</div><div class="admin-order-items">${itemsHtml}</div></div>
            <div class="text-[10px] text-gray-500 bg-blue-50 rounded-lg p-2 border border-blue-100 mb-3"><i class="fas fa-map-marker-alt text-blue-400 mr-1"></i>${[o.address,o.city,o.state,o.pincode?'- '+o.pincode:''].filter(Boolean).join(', ')||'N/A'}</div>
            <div class="flex items-center gap-2"><span class="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Status:</span><select onchange="updateOrderStatus('${oidSafe}',this.value)" class="flex-1 border border-gray-300 rounded-lg text-xs p-2 font-bold bg-white focus:ring-2 focus:ring-purple-300 outline-none cursor-pointer">${ALL_ORDER_STATUSES.map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
        </div>`;
    }).join('');
}

async function updateOrderStatus(orderId,newStatus){
    orderId=String(orderId||'').trim();if(!orderId){showToast('❌ Invalid order ID');return;}showToast(`⏳ Updating #${orderId}...`);
    try{const res=await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`,{method:'PATCH',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`,'Prefer':'return=representation'},body:JSON.stringify({status:newStatus})});if(!res.ok)throw new Error(`HTTP ${res.status}`);showToast(`✅ Order #${orderId} → "${newStatus}"`);setTimeout(()=>loadAllOrdersAdmin(),600);}
    catch(err){showToast(`❌ Update failed: ${err.message}`);setTimeout(()=>loadAllOrdersAdmin(),500);}
}

/* ============================================================
   A8. USERS
   ============================================================ */
async function loadAllUsersAdmin(){
    const container=document.getElementById('admin-users-list');if(!container)return;
    container.innerHTML='<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-2xl text-purple-600"></i></div>';
    try{const{data,error}=await dbClient.from('users').select('*').order('mobile',{ascending:false});if(error)throw error;container.innerHTML=data?.length?data.map(user=>`<div class="bg-white border rounded-lg p-4 hover:shadow-md transition"><div class="flex items-center gap-4"><img src="${user.profile_pic||`https://placehold.co/48x48/e11d48/ffffff?text=${(user.name||'U').charAt(0)}`}" class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"><div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><div class="font-bold text-gray-900">${user.name||'Unknown'}</div>${isAuthorizedAdmin(user)?'<span class="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Admin</span>':''}</div><div class="text-sm text-gray-500">+91 ${user.mobile}</div>${user.email?`<div class="text-xs text-gray-400">${user.email}</div>`:''} ${user.referral_code?`<div class="text-xs text-green-600 font-mono font-bold">Code: ${user.referral_code}</div>`:''} ${user.push_subscription?'<div class="text-xs text-blue-600"><i class="fas fa-bell text-[10px] mr-0.5"></i>Push Subscribed ✅</div>':''}</div><div class="text-right flex-shrink-0"><div class="text-lg font-bold text-purple-600">₹${user.wallet||0}</div><div class="text-xs text-gray-500">Wallet</div></div></div></div>`).join(''):'<div class="text-center text-gray-400 py-10">No users found</div>';}
    catch(err){container.innerHTML='<div class="text-center text-red-500 py-6">Error loading users</div>';}
}

/* ============================================================
   A9. PAYOUTS / WITHDRAWALS
   ============================================================ */
async function loadAllWithdrawalsAdmin(){
    const container=document.getElementById('admin-withdraw-list');if(!container)return;
    container.innerHTML='<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-2xl text-purple-600"></i></div>';
    try{
        const{data,error}=await dbClient.from('withdrawals').select('*').order('id',{ascending:false});if(error)throw error;
        const all=data||[];const pending=all.filter(w=>w.status==='Pending');const paid=all.filter(w=>w.status==='Paid');const rejected=all.filter(w=>w.status==='Rejected');
        if(!all.length){container.innerHTML='<div class="text-center text-gray-400 py-16"><i class="fas fa-wallet text-5xl mb-3 text-gray-300"></i><p class="font-semibold">No withdrawal requests yet</p></div>';return;}
        container.innerHTML=`<div class="grid grid-cols-3 gap-3 mb-4"><div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center"><div class="text-xl font-black text-amber-600">${pending.length}</div><div class="text-xs text-amber-700 font-bold">Pending</div><div class="text-xs text-amber-500">₹${pending.reduce((s,w)=>s+(w.amount||0),0).toLocaleString('en-IN')}</div></div><div class="bg-green-50 border border-green-200 rounded-xl p-3 text-center"><div class="text-xl font-black text-green-600">${paid.length}</div><div class="text-xs text-green-700 font-bold">Paid</div><div class="text-xs text-green-500">₹${paid.reduce((s,w)=>s+(w.amount||0),0).toLocaleString('en-IN')}</div></div><div class="bg-red-50 border border-red-200 rounded-xl p-3 text-center"><div class="text-xl font-black text-red-500">${rejected.length}</div><div class="text-xs text-red-700 font-bold">Rejected</div></div></div>
        <div class="flex gap-1 border-b mb-4 overflow-x-auto hide-scrollbar"><button onclick="filterPayouts('all',this)" class="payout-tab pb-2 px-4 text-sm font-bold text-purple-600 border-b-2 border-purple-600 whitespace-nowrap">All (${all.length})</button><button onclick="filterPayouts('Pending',this)" class="payout-tab pb-2 px-4 text-sm font-bold text-gray-500 whitespace-nowrap">Pending (${pending.length})</button><button onclick="filterPayouts('Paid',this)" class="payout-tab pb-2 px-4 text-sm font-bold text-gray-500 whitespace-nowrap">Paid (${paid.length})</button><button onclick="filterPayouts('Rejected',this)" class="payout-tab pb-2 px-4 text-sm font-bold text-gray-500 whitespace-nowrap">Rejected (${rejected.length})</button></div>
        <div id="payouts-list" class="space-y-3"></div>`;
        window._allPayouts=all;_renderPayoutsList(all);
    }catch(err){container.innerHTML=`<div class="text-center text-red-500 py-10">Error: ${err.message}</div>`;}
}
function filterPayouts(status,btn){document.querySelectorAll('.payout-tab').forEach(b=>{b.className='payout-tab pb-2 px-4 text-sm font-bold text-gray-500 whitespace-nowrap';});btn.className='payout-tab pb-2 px-4 text-sm font-bold text-purple-600 border-b-2 border-purple-600 whitespace-nowrap';const all=window._allPayouts||[];_renderPayoutsList(status==='all'?all:all.filter(w=>w.status===status));}
function _renderPayoutsList(items){
    const container=document.getElementById('payouts-list');if(!container)return;
    if(!items.length){container.innerHTML='<div class="text-center text-gray-400 py-10"><i class="fas fa-inbox text-4xl mb-3"></i><p class="font-semibold">No records found</p></div>';return;}
    const STATUS_STYLE={Pending:'bg-amber-50 border-amber-200',Paid:'bg-green-50 border-green-200',Rejected:'bg-red-50 border-red-200'};
    const BADGE={Pending:'bg-amber-100 text-amber-700',Paid:'bg-green-100 text-green-700',Rejected:'bg-red-100 text-red-600'};
    container.innerHTML=items.map(w=>`<div class="border rounded-xl p-4 ${STATUS_STYLE[w.status]||'bg-white border-gray-200'} hover:shadow-md transition-all"><div class="flex justify-between items-start mb-3"><div><div class="font-bold text-gray-800">+91 ${w.mobile}</div><div class="text-sm text-gray-600 font-medium">${w.name||'—'}</div><div class="text-xs text-gray-400 mt-0.5">${w.date||'—'}</div></div><div class="text-right"><div class="text-2xl font-black text-gray-800">₹${w.amount}</div><span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE[w.status]||'bg-gray-100 text-gray-500'}">${w.status}</span></div></div><div class="bg-white border rounded-lg p-3 font-mono text-sm select-all mb-3 flex items-center gap-2"><i class="fas fa-university text-gray-400 text-xs"></i><span>${w.upi_id}</span></div>${w.status==='Pending'?`<div class="flex gap-2"><button onclick="approvePayout(${w.id})" class="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold hover:bg-green-700 active:scale-95 text-sm"><i class="fas fa-check mr-1"></i>Mark as Paid</button><button onclick="rejectPayout(${w.id})" class="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold hover:bg-red-600 active:scale-95 text-sm"><i class="fas fa-times mr-1"></i>Reject</button></div>`:`<div class="text-xs text-gray-400 text-center font-semibold py-1">${w.status==='Paid'?'✅ Payment processed':'❌ Request rejected'}</div>`}</div>`).join('');
}
async function approvePayout(id){if(!confirm('Confirm: Payment done via UPI?'))return;try{await dbClient.from('withdrawals').update({status:'Paid'}).eq('id',id);showToast('✅ Payout marked as Paid!');loadAllWithdrawalsAdmin();}catch(err){showToast('Error: '+err.message);}}
async function rejectPayout(id){if(!confirm('Reject this withdrawal request? Wallet balance will be refunded.'))return;try{const{data:w}=await dbClient.from('withdrawals').select('*').eq('id',id).single();if(!w){showToast('Withdrawal not found');return;}const{data:user}=await dbClient.from('users').select('wallet').eq('mobile',w.mobile).maybeSingle();if(user){await dbClient.from('users').update({wallet:(user.wallet||0)+(w.amount||0)}).eq('mobile',w.mobile);}await dbClient.from('withdrawals').update({status:'Rejected'}).eq('id',id);showToast('❌ Rejected & ₹'+w.amount+' refunded to wallet');loadAllWithdrawalsAdmin();}catch(err){showToast('Error: '+err.message);}}

/* ============================================================
   A10. REFERRALS
   ============================================================ */
async function loadAdminReferrals(){
    const container=document.getElementById('admin-referrals-content');if(!container)return;
    container.innerHTML='<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-2xl text-purple-600"></i></div>';
    try{
        const{data:referrals,error}=await dbClient.from('referrals').select('*').order('id',{ascending:false});if(error)throw error;
        const all=referrals||[];const pending=all.filter(r=>r.status==='pending');const confirmed=all.filter(r=>r.status==='confirmed');const cancelled=all.filter(r=>r.status==='cancelled');
        container.innerHTML=`<div class="grid grid-cols-3 gap-3 mb-4"><div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center"><p class="text-xs text-amber-700 font-bold uppercase mb-1">Pending</p><p class="text-2xl font-black text-amber-600">₹${pending.reduce((s,r)=>s+(r.commission||0),0).toLocaleString()}</p><p class="text-xs text-amber-500 mt-1">${pending.length} referrals</p></div><div class="bg-green-50 border border-green-200 rounded-xl p-3 text-center"><p class="text-xs text-green-700 font-bold uppercase mb-1">Confirmed</p><p class="text-2xl font-black text-green-600">₹${confirmed.reduce((s,r)=>s+(r.commission||0),0).toLocaleString()}</p><p class="text-xs text-green-500 mt-1">${confirmed.length} referrals</p></div><div class="bg-red-50 border border-red-200 rounded-xl p-3 text-center"><p class="text-xs text-red-700 font-bold uppercase mb-1">Cancelled</p><p class="text-2xl font-black text-red-400">₹${cancelled.reduce((s,r)=>s+(r.commission||0),0).toLocaleString()}</p></div></div>
        <div class="flex gap-1 mb-4 border-b overflow-x-auto hide-scrollbar"><button onclick="adminFilterReferrals('pending',this)" class="pb-2 px-4 text-sm font-bold text-purple-600 border-b-2 border-purple-600 whitespace-nowrap admin-ref-tab">⏳ Pending (${pending.length})</button><button onclick="adminFilterReferrals('all',this)" class="pb-2 px-4 text-sm font-bold text-gray-500 whitespace-nowrap admin-ref-tab">All (${all.length})</button><button onclick="adminFilterReferrals('confirmed',this)" class="pb-2 px-4 text-sm font-bold text-gray-500 whitespace-nowrap admin-ref-tab">Confirmed (${confirmed.length})</button><button onclick="adminFilterReferrals('cancelled',this)" class="pb-2 px-4 text-sm font-bold text-gray-500 whitespace-nowrap admin-ref-tab">Cancelled (${cancelled.length})</button></div>
        <div id="admin-referrals-list" class="space-y-3"></div>`;
        window._allAdminReferrals=all;renderAdminReferralList(pending.length?pending:all);
    }catch(err){container.innerHTML=`<div class="text-center text-red-500 py-10">Error: ${err.message}</div>`;}
}
function adminFilterReferrals(status,btn){document.querySelectorAll('.admin-ref-tab').forEach(b=>{b.className='pb-2 px-4 text-sm font-bold text-gray-500 whitespace-nowrap admin-ref-tab';});btn.className='pb-2 px-4 text-sm font-bold text-purple-600 border-b-2 border-purple-600 whitespace-nowrap admin-ref-tab';const all=window._allAdminReferrals||[];renderAdminReferralList(status==='all'?all:all.filter(r=>r.status===status));}
function renderAdminReferralList(items){
    const container=document.getElementById('admin-referrals-list');if(!container)return;
    if(!items.length){container.innerHTML='<div class="text-center py-10 text-gray-400"><i class="fas fa-inbox text-4xl mb-3"></i><p>No referrals found</p></div>';return;}
    const BADGE={pending:'bg-amber-100 text-amber-700',confirmed:'bg-green-100 text-green-700',cancelled:'bg-red-100 text-red-600'};
    container.innerHTML=items.map(r=>`<div class="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all"><div class="flex justify-between items-start flex-wrap gap-2"><div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap mb-1"><span class="font-bold text-sm text-gray-800">Order #${r.order_id}</span><span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE[r.status]||'bg-gray-100 text-gray-500'}">${r.status}</span></div><div class="text-xs text-gray-500">Referrer: <strong>+91 ${r.referrer_mobile}</strong></div><div class="text-xs text-gray-500">Buyer: +91 ${r.buyer_mobile}</div><div class="text-xs text-gray-600 mt-1">Order: ₹${(r.order_total||0).toLocaleString()} | Commission: <strong class="text-green-600">₹${r.commission}</strong></div></div><div class="flex flex-col gap-1 items-end">${r.status==='pending'?`<button onclick="adminConfirmReferral(${r.id})" class="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-600 active:scale-95">✅ Confirm</button>`:''}</div></div></div>`).join('');
}
async function adminConfirmReferral(referralId){
    if(!confirm('Manually confirm this referral and credit wallet?'))return;
    try{const{data:ref}=await dbClient.from('referrals').select('*').eq('id',referralId).single();if(!ref)return showToast('Referral not found');await dbClient.from('referrals').update({status:'confirmed',confirmed_at:new Date().toISOString()}).eq('id',referralId);const{data:user}=await dbClient.from('users').select('wallet').eq('mobile',ref.referrer_mobile).maybeSingle();if(user){await dbClient.from('users').update({wallet:(user.wallet||0)+(ref.commission||0)}).eq('mobile',ref.referrer_mobile);}showToast(`✅ ₹${ref.commission} credited to +91 ${ref.referrer_mobile}`);loadAdminReferrals();}
    catch(err){showToast('Error: '+err.message);}
}

/* ============================================================
   A11. INFLUENCER REQUESTS
   ============================================================ */
async function loadAdminInfluencerRequests(){
    const container=document.getElementById('admin-influencer-list');if(!container)return;
    container.innerHTML='<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-2xl text-purple-600"></i></div>';
    try{
        const{data,error}=await dbClient.from('influencer_requests').select('*').order('id',{ascending:false});if(error)throw error;
        const all=data||[];if(!all.length){container.innerHTML='<div class="text-center py-16 text-gray-400"><i class="fas fa-video text-5xl mb-3"></i><p>No influencer requests yet</p></div>';return;}
        const BADGE={Pending:'bg-amber-100 text-amber-700',Approved:'bg-green-100 text-green-700',Rejected:'bg-red-100 text-red-600'};
        container.innerHTML=all.map(r=>`<div class="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all mb-3"><div class="flex justify-between items-start mb-2"><div class="flex-1 min-w-0"><div class="font-bold text-sm text-gray-800">${r.name} — +91 ${r.mobile}</div><div class="text-xs text-gray-500">${r.platform} • ${(r.views||0).toLocaleString()} views</div><a href="${r.video_url}" target="_blank" class="text-xs text-blue-600 hover:underline truncate block max-w-xs">${r.video_url}</a>${r.profile_url?`<a href="${r.profile_url}" target="_blank" class="text-xs text-purple-600 hover:underline truncate block max-w-xs">${r.profile_url}</a>`:''} ${r.description?`<div class="text-xs text-gray-500 mt-1 italic">${r.description}</div>`:''}</div><div class="text-right ml-3 flex-shrink-0"><div class="text-lg font-black text-green-600">₹${r.earnings||0}</div><span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE[r.status]||'bg-gray-100 text-gray-500'}">${r.status}</span></div></div>${r.status==='Pending'?`<div class="flex gap-2 mt-3"><button onclick="approveInfluencer(${r.id})" class="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-green-700 active:scale-95"><i class="fas fa-check mr-1"></i>Approve & Credit ₹${r.earnings||0}</button><button onclick="rejectInfluencer(${r.id})" class="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold text-xs hover:bg-red-600 active:scale-95"><i class="fas fa-times mr-1"></i>Reject</button></div>`:`<div class="text-xs text-gray-400 text-center py-1">${r.status==='Approved'?'✅ Approved & Wallet credited':'❌ Rejected'}</div>`}</div>`).join('');
    }catch(err){container.innerHTML=`<div class="text-center text-red-500 py-10">Error: ${err.message}</div>`;}
}
async function approveInfluencer(id){if(!confirm('Approve & credit earnings to wallet?'))return;try{const{data:req}=await dbClient.from('influencer_requests').select('*').eq('id',id).single();if(!req)return showToast('Request not found');await dbClient.from('influencer_requests').update({status:'Approved'}).eq('id',id);const{data:user}=await dbClient.from('users').select('wallet').eq('mobile',req.mobile).maybeSingle();if(user){await dbClient.from('users').update({wallet:(user.wallet||0)+(req.earnings||0)}).eq('mobile',req.mobile);}showToast(`✅ ₹${req.earnings} credited to +91 ${req.mobile}`);loadAdminInfluencerRequests();}catch(err){showToast('Error: '+err.message);}}
async function rejectInfluencer(id){const reason=prompt('Rejection reason (optional):')||'Does not meet requirements';try{await dbClient.from('influencer_requests').update({status:'Rejected',reject_reason:reason}).eq('id',id);showToast('❌ Request rejected');loadAdminInfluencerRequests();}catch(err){showToast('Error: '+err.message);}}

/* ============================================================
   A12. PUSH NOTIFICATIONS
   ============================================================ */
function searchProductsForNotif(query){const q=query.toLowerCase().trim();const box=document.getElementById('notif-product-results');if(!box)return;if(q.length<2){box.innerHTML='';return;}const hits=products.filter(p=>p.name.toLowerCase().includes(q)).slice(0,6);if(!hits.length){box.innerHTML='<div class="px-3 py-2 text-xs text-gray-400">No products found</div>';return;}box.innerHTML=hits.map(p=>{const img=p.imgs?.[0]||p.img||'';return`<div onclick="selectNotifProduct(${p.id})" class="flex items-center gap-2 px-3 py-2 hover:bg-purple-50 cursor-pointer border-b last:border-b-0"><img src="${img}" class="w-10 h-12 object-cover rounded flex-shrink-0" onerror="this.style.display='none'"><div class="min-w-0 flex-1"><div class="text-xs font-bold text-gray-800 truncate">${p.name}</div><div class="text-[10px] text-rose-600 font-bold">₹${p.price}</div></div></div>`;}).join('');}
function selectNotifProduct(productId){const p=products.find(x=>x.id===productId);if(!p)return;const img=p.imgs?.[0]||p.img||'';document.getElementById('notif-title').value=p.name.length>50?p.name.slice(0,47)+'...':p.name;document.getElementById('notif-body').value=`₹${p.price}${p.oldprice?' (Was ₹'+p.oldprice+')':''} — Abhi kharido! 🛍️`;document.getElementById('notif-url').value=`./?pid=${p.id}`;document.getElementById('notif-image').value=img;document.getElementById('notif-product-results').innerHTML='';document.getElementById('notif-product-search').value=p.name.slice(0,30);_updateNotifPreview();showToast('✅ Product selected!');}
function _updateNotifPreview(){const title=document.getElementById('notif-title')?.value||'';const body=document.getElementById('notif-body')?.value||'';const image=document.getElementById('notif-image')?.value||'';const prev=document.getElementById('notif-preview');if(!prev)return;if(!title&&!body){prev.classList.add('hidden');return;}prev.classList.remove('hidden');prev.innerHTML=`<div class="flex items-start gap-3 p-3 bg-gray-800 rounded-xl text-white"><img src="https://placehold.co/40x40/e11d48/ffffff?text=OK" class="w-10 h-10 rounded-lg flex-shrink-0"><div class="flex-1 min-w-0"><div class="text-xs font-bold truncate">${title||'Title'}</div><div class="text-[10px] text-gray-300 mt-0.5 line-clamp-2">${body||'Message'}</div></div>${image?`<img src="${image}" class="w-12 h-14 object-cover rounded flex-shrink-0" onerror="this.style.display='none'">`:''}</div><div class="text-[9px] text-gray-400 text-center mt-1">Preview (actual may vary by device)</div>`;}
function showPushSetupGuide(){alert('Push Setup:\n1. Supabase Edge Functions → New Function → "send-push"\n2. Ya OneSignal (free) use karo\n3. Ya Firebase Cloud Messaging (FCM)');}

async function sendAdminNotification(){
    const title=document.getElementById('notif-title')?.value.trim();const body=document.getElementById('notif-body')?.value.trim();const mobile=document.getElementById('notif-mobile')?.value.trim().replace(/\D/g,'');const url=document.getElementById('notif-url')?.value.trim()||'./';const image=document.getElementById('notif-image')?.value.trim()||null;const result=document.getElementById('notif-result');
    if(!title)return showToast('Title daalo!');if(!body)return showToast('Message daalo!');
    const btn=document.querySelector('[onclick="sendAdminNotification()"]');if(btn){btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';}
    if(result){result.classList.remove('hidden');result.className='text-center text-sm font-semibold py-2 rounded-lg bg-blue-50 text-blue-700';result.textContent='Fetching subscribed users...';}
    try{
        let query=dbClient.from('users').select('mobile,name,push_subscription').not('push_subscription','is',null);
        if(mobile)query=dbClient.from('users').select('mobile,name,push_subscription').eq('mobile',mobile).not('push_subscription','is',null);
        const{data:users,error}=await query;if(error)throw error;
        const subscribed=(users||[]).filter(u=>{if(!u.push_subscription)return false;try{JSON.parse(u.push_subscription);return true;}catch{return false;}});
        if(!subscribed.length){if(result){result.className='text-center text-sm font-semibold py-2 rounded-lg bg-amber-50 text-amber-700';result.textContent='⚠️ Koi bhi subscribed user nahi mila.';}if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-paper-plane mr-2"></i>Send Notification';}return;}
        try{await dbClient.from('notifications').insert([{title,body,url:url||'./',image:image||null,mobile:mobile||null,sent_at:new Date().toISOString(),sent_by:localStorage.getItem('outfitkart_admin_mobile')||'admin',status:'pending'}]);}catch(_){}
        try{const edgeRes=await fetch(`${SUPABASE_URL}/functions/v1/send-push`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${SUPABASE_KEY}`},body:JSON.stringify({title,body,url,image,mobile:mobile||null}),signal:AbortSignal.timeout(15000)});if(edgeRes.ok){const edgeData=await edgeRes.json();const sent=edgeData.sent||subscribed.length;if(result){result.className='text-center text-sm font-semibold py-2 rounded-lg bg-green-50 text-green-700';result.textContent=`✅ ${sent} users ko notification bheja gaya!`;}showToast(`✅ ${sent} users ko notification bheja!`);_clearNotifFields();if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-paper-plane mr-2"></i>Send Notification';}return;}}catch(_){}
        if(Notification.permission==='granted'){new Notification(title,{body,icon:image||'https://placehold.co/192x192/e11d48/ffffff?text=OK',data:{url}});}
        if(result){result.className='text-center text-sm font-semibold py-2 rounded-lg bg-amber-50 text-amber-700';result.innerHTML=`⚠️ <strong>${subscribed.length} users subscribed</strong> hain.<br><span class="text-xs">Supabase Edge Function setup karo full push ke liye.</span><br><button onclick="showPushSetupGuide()" class="mt-2 text-xs bg-purple-600 text-white px-3 py-1 rounded-lg font-bold">Setup Guide</button>`;}
        showToast(`📋 DB mein save! ${subscribed.length} users subscribed.`);_clearNotifFields();
    }catch(err){if(result){result.className='text-center text-sm font-semibold py-2 rounded-lg bg-red-50 text-red-700';result.textContent='❌ Error: '+err.message;}showToast('❌ '+err.message);}
    finally{if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-paper-plane mr-2"></i>Send Notification';}setTimeout(()=>result?.classList.add('hidden'),10000);}
}
function _clearNotifFields(){['notif-title','notif-body','notif-mobile','notif-image','notif-url','notif-product-search'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});document.getElementById('notif-preview')?.classList.add('hidden');const box=document.getElementById('notif-product-results');if(box)box.innerHTML='';}

/* ============================================================
   A13. PROMO CODES MANAGEMENT
   ============================================================ */
async function loadAdminPromoCodes(){
    const container=document.getElementById('admin-promo-content');if(!container)return;
    container.innerHTML='<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-2xl text-rose-500"></i></div>';
    try{
        const{data,error}=await dbClient.from('promo_codes').select('*').order('id',{ascending:false});
        if(error)throw error;
        const all=data||[];
        const active=all.filter(p=>p.is_active&&new Date(p.expires_at)>new Date());
        const expired=all.filter(p=>!p.is_active||new Date(p.expires_at)<=new Date());
        container.innerHTML=`
        <!-- Create Promo Form -->
        <div class="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-5 mb-5">
            <h4 class="font-black text-base text-rose-700 mb-4 flex items-center gap-2"><i class="fas fa-plus-circle"></i> Create New Promo Code</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Promo Code *</label>
                    <input type="text" id="new-promo-code" placeholder="e.g. SAVE50 or DIWALI20" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-black uppercase tracking-wider focus:ring-2 focus:ring-rose-400 outline-none" style="letter-spacing:0.1em;">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Discount Amount ₹ *</label>
                    <input type="number" id="new-promo-discount" placeholder="e.g. 50" min="1" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-rose-400 outline-none">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Max Uses</label>
                    <input type="number" id="new-promo-maxuses" placeholder="100" value="100" min="1" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-rose-400 outline-none">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Valid For (Hours) *</label>
                    <select id="new-promo-hours" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-rose-400 outline-none">
                        <option value="5" selected>5 Hours ⏳</option>
                        <option value="1">1 Hour</option>
                        <option value="2">2 Hours</option>
                        <option value="12">12 Hours</option>
                        <option value="24">24 Hours</option>
                        <option value="48">48 Hours</option>
                        <option value="72">72 Hours</option>
                    </select>
                </div>
            </div>
            <div class="mt-3">
                <label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Minimum Order Amount ₹</label>
                <input type="number" id="new-promo-minorder" placeholder="0 = no minimum" value="0" min="0" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-rose-400 outline-none">
            </div>
            <button onclick="createPromoCode()" class="w-full mt-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 rounded-xl font-black text-sm hover:from-rose-700 hover:to-rose-800 active:scale-95 transition-all shadow-lg"><i class="fas fa-plus mr-2"></i>Create Promo Code</button>
        </div>

        <!-- Active Promos -->
        <div class="mb-4">
            <h4 class="font-black text-sm text-green-700 mb-3 flex items-center gap-2"><i class="fas fa-check-circle"></i> Active Codes (${active.length})</h4>
            ${active.length?active.map(p=>_promoAdminRow(p)).join(''):'<div class="text-center text-gray-400 py-6 text-sm bg-gray-50 rounded-xl border border-dashed">No active promo codes</div>'}
        </div>

        <!-- Expired/Disabled Promos -->
        ${expired.length?`<div><h4 class="font-black text-sm text-gray-400 mb-3 flex items-center gap-2"><i class="fas fa-times-circle"></i> Expired/Disabled (${expired.length})</h4>${expired.map(p=>_promoAdminRow(p,true)).join('')}</div>`:''}
        `;
    }catch(err){
        container.innerHTML=`<div class="text-center text-red-500 py-10">
            <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
            <p class="font-bold">${err.message}</p>
            <p class="text-xs mt-2 text-gray-400">promo_codes table Supabase mein create karo</p>
            <button onclick="copyPromoSQL()" class="mt-3 text-xs bg-rose-600 text-white px-4 py-2 rounded-lg font-bold">📋 SQL Copy karo</button>
        </div>`;
    }
}

function _promoAdminRow(p,isExpired=false){
    const now=new Date();const expiresAt=new Date(p.expires_at);const isActive=p.is_active&&expiresAt>now;
    const timeLeft=isActive?_timeLeft(expiresAt):'Expired';
    const shareText=`🎉 OutfitKart Promo Code!\n\nCode: ${p.code}\nDiscount: ₹${p.discount} OFF\nValid till: ${expiresAt.toLocaleString('en-IN')}\n\nShop now 👇`;
    return `<div class="bg-white border rounded-xl p-4 mb-2 shadow-sm ${isActive?'border-green-200':'border-gray-200 opacity-60'}">
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
                <div class="px-4 py-2 rounded-xl font-black text-lg tracking-widest ${isActive?'bg-rose-50 text-rose-700 border border-rose-200':'bg-gray-100 text-gray-500'}" style="letter-spacing:0.15em;">${p.code}</div>
                <div>
                    <div class="font-black text-green-600 text-lg">-₹${p.discount}</div>
                    <div class="text-[10px] text-gray-500">Min order: ₹${p.min_order||0}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-xs font-bold ${isActive?'text-green-600':'text-red-500'}">${timeLeft}</div>
                <div class="text-[10px] text-gray-400">${p.used_count||0}/${p.max_uses} used</div>
            </div>
        </div>
        ${isActive?`<div class="flex gap-2 mt-3">
            <a href="https://t.me/outfitkart" target="_blank" rel="noopener"
               onclick="sharePromoToTelegram('${p.code}',${p.discount},'${expiresAt.toLocaleString('en-IN')}')"
               class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white active:scale-95" style="background:linear-gradient(135deg,#0088cc,#00b0f4)">
               <i class="fab fa-telegram text-sm"></i> Share on Telegram
            </a>
            <a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" rel="noopener"
               onclick="sharePromoToWhatsApp('${p.code}',${p.discount},'${expiresAt.toLocaleString('en-IN')}')"
               class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white active:scale-95" style="background:linear-gradient(135deg,#25D366,#128C7E)">
               <i class="fab fa-whatsapp text-sm"></i> Share on WhatsApp
            </a>
            <button onclick="disablePromoCode(${p.id})" class="px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-95">Disable</button>
        </div>`:`<div class="text-xs text-gray-400 text-center py-1">This code is ${!p.is_active?'disabled':'expired'}</div>`}
    </div>`;
}

function _timeLeft(expiresAt){
    const diff=expiresAt-new Date();if(diff<=0)return'Expired';
    const h=Math.floor(diff/3600000);const m=Math.floor((diff%3600000)/60000);
    if(h>0)return`⏳ ${h}h ${m}m left`;return`⏳ ${m}m left`;
}

async function createPromoCode(){
    const code=(document.getElementById('new-promo-code')?.value||'').trim().toUpperCase();
    const discount=parseInt(document.getElementById('new-promo-discount')?.value)||0;
    const maxUses=parseInt(document.getElementById('new-promo-maxuses')?.value)||100;
    const hours=parseInt(document.getElementById('new-promo-hours')?.value)||5;
    const minOrder=parseInt(document.getElementById('new-promo-minorder')?.value)||0;
    if(!code)return showToast('Promo code enter karo');
    if(!discount||discount<1)return showToast('Discount amount enter karo');
    if(!/^[A-Z0-9]+$/.test(code))return showToast('Code sirf letters aur numbers use karo');
    const expiresAt=new Date(Date.now()+hours*60*60*1000).toISOString();
    try{
        const{error}=await dbClient.from('promo_codes').insert([{code,discount,type:'flat',min_order:minOrder,max_uses:maxUses,used_count:0,expires_at:expiresAt,is_active:true,created_by:localStorage.getItem('outfitkart_admin_mobile')||'admin'}]);
        if(error)throw error;
        showToast(`✅ Promo code "${code}" created! Valid for ${hours} hours`);
        // Clear form
        ['new-promo-code','new-promo-discount'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
        const maxUsesEl=document.getElementById('new-promo-maxuses');if(maxUsesEl)maxUsesEl.value='100';
        const minOrderEl=document.getElementById('new-promo-minorder');if(minOrderEl)minOrderEl.value='0';
        loadAdminPromoCodes();
    }catch(err){showToast('❌ Error: '+err.message+(err.message.includes('duplicate')||err.message.includes('unique')?'\n(Code already exists — use different name)':''));}
}

function sharePromoToTelegram(code,discount,expiry){
    const text=`🎉 OutfitKart Special Offer!\n\n🏷️ Promo Code: ${code}\n💰 Get ₹${discount} OFF\n⏰ Valid till: ${expiry}\n\nShop now at OutfitKart! 🛍️`;
    window.open(`https://t.me/outfitkart`,'_blank');
    navigator.clipboard?.writeText(text).then(()=>showToast('📋 Promo message copied! Paste it in Telegram channel')).catch(()=>{});
}

function sharePromoToWhatsApp(code,discount,expiry){
    const text=`🎉 *OutfitKart Special Offer!*\n\n🏷️ Promo Code: *${code}*\n💰 Get *₹${discount} OFF*\n⏰ Valid till: ${expiry}\n\nShop now at OutfitKart! 🛍️`;
    window.open(`https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z`,'_blank');
    navigator.clipboard?.writeText(text).then(()=>showToast('📋 Promo message copied! Paste it in WhatsApp channel')).catch(()=>{});
}

async function disablePromoCode(id){
    if(!confirm('Disable this promo code?'))return;
    try{await dbClient.from('promo_codes').update({is_active:false}).eq('id',id);showToast('✅ Promo code disabled');loadAdminPromoCodes();}
    catch(err){showToast('Error: '+err.message);}
}

function copyPromoSQL(){
    const sql=`-- Promo Codes Table (Run in Supabase SQL Editor):
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id          BIGSERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,
  discount    NUMERIC NOT NULL,
  type        TEXT DEFAULT 'flat',
  min_order   NUMERIC DEFAULT 0,
  max_uses    INTEGER DEFAULT 100,
  used_count  INTEGER DEFAULT 0,
  expires_at  TIMESTAMPTZ NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_by  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON public.promo_codes USING (true) WITH CHECK (true);`;
    navigator.clipboard.writeText(sql).then(()=>showToast('✅ SQL copied! Supabase SQL Editor mein paste karo')).catch(()=>{const ta=document.createElement('textarea');ta.value=sql;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);showToast('✅ SQL copied!');});
}

/* ============================================================
   A14. GOLD PRODUCTS — gold_products TABLE
         Uses 'description' column (not 'desc')
   ============================================================ */
let _goldAdminProducts=[];let _goldEditId=null;

async function loadAdminGoldProducts(){
    const container=document.getElementById('admin-gold-list');if(!container){console.warn('[Gold] admin-gold-list not found');return;}
    container.innerHTML='<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-3xl" style="color:#C9A84C;"></i><p class="mt-3 font-semibold" style="color:#B8860B;">Loading Gold Products...</p></div>';
    try{
        const{data,error}=await dbClient.from('gold_products').select('*').order('id',{ascending:false});if(error)throw error;
        _goldAdminProducts=data||[];_renderGoldAdminUI(container);
    }catch(err){
        container.innerHTML=`<div class="text-center text-red-500 py-10"><i class="fas fa-exclamation-circle text-3xl mb-3"></i><p class="font-bold">${err.message}</p><p class="text-xs mt-2 text-gray-400">gold_products table Supabase mein exist karti hai?</p><button onclick="copyGoldSQL()" class="mt-3 text-xs bg-amber-600 text-white px-4 py-2 rounded-lg font-bold">📋 SQL Copy karo</button></div>`;
    }
}
const loadAdminGoldTab=loadAdminGoldProducts;

/* ── Electronics Admin ── */
async function loadAdminElectronicsProducts(){
    const container=document.getElementById('admin-electronics-list');
    if(!container)return;
    container.innerHTML='<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-blue-500 text-3xl"></i><p class="mt-2 text-gray-500 text-sm">Loading...</p></div>';
    try{
        const{data,error}=await dbClient.from('products').select('*').eq('category','Electronics').order('id',{ascending:false});
        if(error)throw error;
        const list=data||[];
        if(!list.length){
            container.innerHTML=`<div class="text-center py-12 text-blue-600"><span style="font-size:3rem;">&#9889;</span><p class="font-bold mt-3 text-lg">Koi Electronics product nahi hai abhi</p><p class="text-sm text-gray-500 mt-1">Add Product mein Electronics category choose karein</p><button onclick="switchAdminTab('inventory')" class="mt-4 text-sm bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700">+ Add Electronics Product</button></div>`;
            return;
        }
        container.innerHTML=list.map(p=>{
            const img=(p.imgs||[])[0]||p.img||'https://placehold.co/56x56/eff6ff/1d4ed8?text=E';
            const isActive=p.is_active!==false;
            return`<div class="flex gap-3 items-center p-3 border rounded-xl mb-2 bg-gray-50 hover:bg-blue-50 transition-all">
                <img src="${img}" class="w-14 h-14 object-cover rounded-lg border flex-shrink-0" onerror="this.src='https://placehold.co/56x56/eff6ff/1d4ed8?text=E'">
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-sm text-gray-800 truncate">${p.name}</div>
                    <div class="text-xs text-blue-600 font-semibold">${p.sub||'Electronics'}</div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-sm font-black text-gray-900">&#x20B9;${p.price}</span>
                        ${p.oldprice?`<span class="text-xs line-through text-gray-400">&#x20B9;${p.oldprice}</span>`:''}
                        <span class="text-[10px] ${isActive?'bg-green-100 text-green-700':'bg-red-100 text-red-700'} px-1.5 py-0.5 rounded-full font-bold">${isActive?'Active':'Inactive'}</span>
                    </div>
                </div>
                <div class="flex flex-col gap-1.5 flex-shrink-0">
                    <button onclick="openEditModal(${p.id})" class="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold border border-blue-200 hover:bg-blue-200"><i class="fas fa-edit mr-1"></i>Edit</button>
                    <button onclick="adminToggleProductActive(${p.id},${!isActive})" class="text-xs ${isActive?'bg-red-50 text-red-600 border-red-200':'bg-green-50 text-green-600 border-green-200'} px-3 py-1.5 rounded-lg font-bold border hover:opacity-80">${isActive?'Deactivate':'Activate'}</button>
                </div>
            </div>`;
        }).join('');
    }catch(err){
        container.innerHTML=`<div class="text-center text-red-500 py-10"><i class="fas fa-exclamation-circle text-3xl mb-3"></i><p class="font-bold">${err.message}</p></div>`;
    }
}
async function adminToggleProductActive(id,newState){
    try{
        await dbClient.from('products').update({is_active:newState}).eq('id',id);
        showToast(newState?'Product Activated ✅':'Product Deactivated ❌');
        loadAdminElectronicsProducts();renderAdminProducts();
    }catch(err){showToast('Error: '+err.message);}
}

function _renderGoldAdminUI(container){
    const all=_goldAdminProducts;
    container.innerHTML=`
    <div class="p-4 rounded-xl mb-4" style="background:linear-gradient(135deg,#1a0800,#3d2c00);">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3"><span style="font-size:2rem">⭐</span><div><div class="font-black" style="background:linear-gradient(135deg,#C9A84C,#F5E6C0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:1rem;">OutfitKart Gold</div><div style="color:rgba(245,230,192,0.6);font-size:11px;">${all.length} products</div></div></div>
            <div class="flex gap-2">
                <button onclick="_openGoldForm(null)" class="flex items-center gap-2 px-3 py-2 rounded-xl font-black text-sm active:scale-95" style="background:linear-gradient(135deg,#C9A84C,#B8860B);color:#1a0800;"><i class="fas fa-plus text-xs"></i> Add Gold</button>
                <button onclick="copyGoldSQL()" class="text-xs px-3 py-2 rounded-xl font-bold" style="background:rgba(201,168,76,0.2);color:#C9A84C;border:1px solid #C9A84C;">SQL</button>
            </div>
        </div>
    </div>
    <div id="gold-form-panel" class="hidden mb-4"></div>
    <div class="flex gap-2 mb-3 overflow-x-auto hide-scrollbar pb-1">
        <button onclick="_gFilter('all')" class="gf-btn text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap" style="background:linear-gradient(135deg,#C9A84C,#B8860B);color:#1a0800;">All (${all.length})</button>
        <button onclick="_gFilter('Men')" class="gf-btn text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white border border-gray-200 text-gray-700">Men</button>
        <button onclick="_gFilter('Women')" class="gf-btn text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white border border-gray-200 text-gray-700">Women</button>
        <button onclick="_gFilter('inactive')" class="gf-btn text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white border border-gray-200 text-gray-500">Inactive</button>
    </div>
    <div id="gold-admin-product-list" class="space-y-2">${all.length?all.map(_goldAdminRow).join(''):`<div class="text-center py-12" style="color:#B8860B;"><span style="font-size:3rem;">⭐</span><p class="font-bold mt-3">Koi Gold product nahi mila</p><p class="text-sm text-gray-400 mt-1">Upar + Add Gold button se products add karo</p></div>`}</div>`;
}

function _goldAdminRow(p){
    const img=(p.imgs||[])[0]||p.img||'https://placehold.co/48x48/eee/666?text=?';
    const active=p.is_active!==false;const safeName=(p.name||'').replace(/'/g,"\\'");
    const desc=p.description||p.desc||'';
    return `<div class="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all gold-adm-row" data-cat="${p.category||''}" data-active="${active}">
        <img src="${img}" class="w-12 h-14 rounded-lg object-cover border flex-shrink-0" loading="lazy" onerror="this.src='https://placehold.co/48x56/eee/666?text=?'">
        <div class="flex-1 min-w-0">
            <div class="font-semibold text-sm text-gray-800 truncate flex items-center gap-1"><span style="color:#B8860B;font-size:11px;">⭐</span> ${p.name}</div>
            <div class="text-xs text-gray-500">${p.category||'—'} › ${p.sub||'—'} • ₹${p.price}${p.oldprice?` <span class="line-through text-red-400">₹${p.oldprice}</span>`:''}</div>
            ${p.supplier_url?`<a href="${p.supplier_url}" target="_blank" rel="noopener" class="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-0.5" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt text-[8px]"></i> Supplier</a>`:''}
            <div class="text-[10px] text-blue-500">${(p.available_sizes||[]).join(', ')||'—'}</div>
        </div>
        <div class="flex flex-col gap-1.5 flex-shrink-0">
            <button onclick="_openGoldForm(${p.id})" class="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg font-bold hover:bg-amber-100"><i class="fas fa-edit mr-1"></i>Edit</button>
            <button onclick="_toggleGoldActive(${p.id},${!active})" class="text-xs px-2.5 py-1 rounded-lg font-bold border ${active?'bg-green-50 text-green-700 border-green-200':'bg-gray-50 text-gray-500 border-gray-200'}">${active?'Active':'Inactive'}</button>
            <button onclick="_deleteGoldProduct(${p.id},'${safeName}')" class="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg font-bold hover:bg-red-100"><i class="fas fa-trash-alt mr-1"></i>Del</button>
        </div>
    </div>`;
}

function _gFilter(type){
    document.querySelectorAll('.gold-adm-row').forEach(row=>{let show=true;if(type==='Men')show=row.dataset.cat==='Men';if(type==='Women')show=row.dataset.cat==='Women';if(type==='inactive')show=row.dataset.active==='false';row.style.display=show?'':'none';});
    document.querySelectorAll('.gf-btn').forEach(btn=>{const isActive=btn.getAttribute('onclick')?.includes(`'${type}'`);btn.style.background=isActive?'linear-gradient(135deg,#C9A84C,#B8860B)':'white';btn.style.color=isActive?'#1a0800':'#374151';btn.style.border=isActive?'none':'1px solid #e5e7eb';});
}

function _openGoldForm(id){
    _goldEditId=id;const p=id?_goldAdminProducts.find(x=>x.id===id):null;
    const panel=document.getElementById('gold-form-panel');if(!panel)return;
    const sizes=p?.available_sizes||[];const imgs=p?.imgs||(p?.img?[p.img]:[]);
    // Use description field (not desc)
    const description=p?.description||p?.desc||'';
    const supplierPrice=p?.supplier_price||'';const supplierUrl=p?.supplier_url||'';
    const marginAmt=p?.margin_amt||0;
    panel.className='mb-4 bg-white border-2 rounded-2xl p-4 shadow-lg';panel.style.borderColor='#C9A84C';
    panel.innerHTML=`
    <div class="flex items-center justify-between mb-4">
        <h3 class="font-black text-base" style="color:#B8860B;">${id?'✏️ Edit Gold Product':'➕ Add Gold Product'}</h3>
        <button onclick="_closeGoldForm()" class="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 font-bold text-sm">✕</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="md:col-span-2"><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Product Name *</label><input id="gf-name" value="${p?.name||''}" placeholder="Gold product ka naam" required class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-amber-400 outline-none"></div>
        <div><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Category *</label><select id="gf-category" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold bg-white focus:ring-2 focus:ring-amber-400 outline-none"><option value="Men" ${(p?.category||'Men')==='Men'?'selected':''}>👔 Men</option><option value="Women" ${p?.category==='Women'?'selected':''}>👗 Women</option></select></div>
        <div><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Sub Category *</label><select id="gf-sub" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold bg-white focus:ring-2 focus:ring-amber-400 outline-none"><option value="Topwear" ${(p?.sub||'Topwear')==='Topwear'?'selected':''}>👕 Topwear</option><option value="Bottomwear" ${p?.sub==='Bottomwear'?'selected':''}>👖 Bottomwear</option><option value="Footwear" ${p?.sub==='Footwear'?'selected':''}>👟 Footwear</option></select></div>

        <!-- Supplier Price + Margin = Selling Price auto-calc -->
        <div><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Supplier Price ₹ *</label><input id="gf-supplier-price" type="number" value="${supplierPrice}" placeholder="Cost price" oninput="_goldCalcPrice()" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-amber-400 outline-none"></div>
        <div><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Margin % <span class="text-[9px] text-gray-400">(auto-calc selling price)</span></label><input id="gf-margin-pct" type="range" min="0" max="150" value="30" oninput="_goldCalcPrice()" class="w-full mb-1"><input id="gf-margin-pct-num" type="number" value="30" min="0" placeholder="30" oninput="document.getElementById('gf-margin-pct').value=this.value;_goldCalcPrice()" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-amber-400 outline-none"></div>
        <div id="gf-price-preview" class="md:col-span-2 grid grid-cols-3 gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 hidden">
            <div class="text-center"><div class="text-[10px] font-black text-amber-700 uppercase mb-1">Selling Price</div><div id="gf-selling-preview" class="text-xl font-black text-amber-800">₹0</div></div>
            <div class="text-center"><div class="text-[10px] font-black text-green-700 uppercase mb-1">Margin Amt</div><div id="gf-margin-preview" class="text-xl font-black text-green-700">₹0</div></div>
            <div class="text-center"><div class="text-[10px] font-black text-gray-500 uppercase mb-1">MRP (1.4x)</div><div id="gf-mrp-preview" class="text-xl font-black text-gray-600">₹0</div></div>
        </div>
        <div><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Selling Price ₹ *</label><input id="gf-price" type="number" value="${p?.price||''}" placeholder="Auto-calculated" required class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-bold text-blue-600 focus:ring-2 focus:ring-amber-400 outline-none"></div>
        <div><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">MRP (Strike-through)</label><input id="gf-oldprice" type="number" value="${p?.oldprice||''}" placeholder="Strike-through price" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-amber-400 outline-none"></div>
        <div><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Brand</label><input id="gf-brand" value="${p?.brand||''}" placeholder="Brand name" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-amber-400 outline-none"></div>
        <div><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Stock Qty</label><input id="gf-stock" type="number" value="${p?.stock_qty||50}" placeholder="50" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-amber-400 outline-none"></div>
        <div class="md:col-span-2"><label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Supplier URL (order panel mein link aayega)</label><input id="gf-supplier-url" value="${supplierUrl}" placeholder="https://meesho.com/... ya amazon link" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-amber-400 outline-none"></div>
        <div class="md:col-span-2">
            <div class="flex items-center justify-between mb-1"><label class="block text-[10px] font-black text-gray-400 uppercase">Description</label><button type="button" onclick="_autoGenGoldDesc()" class="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-200 font-bold hover:bg-purple-200">✨ Auto Generate</button></div>
            <textarea id="gf-desc" rows="3" placeholder="Product ki premium description..." class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-amber-400 outline-none resize-none">${description}</textarea>
        </div>
        <!-- Images with ImgBB Upload -->
        <div class="md:col-span-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Product Images</label>
            <div class="flex items-center gap-2 mb-2">
                <label class="cursor-pointer bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700 active:scale-95 flex items-center gap-1">
                    <i class="fas fa-upload"></i> Upload via ImgBB
                    <input type="file" accept="image/*" multiple class="hidden" onchange="uploadToImgBB(event,'gf-imgs')">
                </label>
                <div class="upload-status text-xs font-bold text-rose-500 hidden"><i class="fas fa-spinner fa-spin mr-1"></i>Uploading...</div>
            </div>
            <textarea id="gf-imgs" rows="2" placeholder="https://... (ek line mein ek URL)" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-mono text-xs focus:ring-2 focus:ring-amber-400 outline-none resize-none">${imgs.join('\n')}</textarea>
        </div>
        <!-- Sizes -->
        <div class="md:col-span-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Available Sizes</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div class="border rounded-xl p-2.5 bg-gray-50"><div class="text-[9px] font-black text-gray-500 uppercase text-center mb-1.5">Clothing</div><div class="grid grid-cols-4 gap-1 text-[10px]">${['XS','S','M','L','XL','XXL','3XL','4XL'].map(s=>`<label class="flex items-center gap-0.5 cursor-pointer"><input type="checkbox" value="${s}" class="gold-size-chk" ${sizes.includes(s)?'checked':''}> ${s}</label>`).join('')}</div></div>
                <div class="border rounded-xl p-2.5 bg-blue-50"><div class="text-[9px] font-black text-blue-600 uppercase text-center mb-1.5">Pants</div><div class="grid grid-cols-3 gap-1 text-[10px]">${['28','30','32','34','36','38','40'].map(s=>`<label class="flex items-center gap-0.5 cursor-pointer"><input type="checkbox" value="${s}" class="gold-size-chk" ${sizes.includes(s)?'checked':''}> ${s}</label>`).join('')}</div></div>
                <div class="border rounded-xl p-2.5 bg-green-50"><div class="text-[9px] font-black text-green-600 uppercase text-center mb-1.5">Footwear</div><div class="grid grid-cols-3 gap-1 text-[10px]">${['6','7','8','9','10','11','12'].map(s=>`<label class="flex items-center gap-0.5 cursor-pointer"><input type="checkbox" value="${s}" class="gold-size-chk" ${sizes.includes(s)?'checked':''}> ${s}</label>`).join('')}</div></div>
                <div class="border rounded-xl p-2.5 bg-purple-50 flex items-center justify-center"><label class="flex flex-col items-center gap-1 cursor-pointer"><input type="checkbox" value="Free Size" class="gold-size-chk w-4 h-4" ${sizes.includes('Free Size')?'checked':''}><span class="text-xs font-bold text-purple-700 text-center">Free Size</span></label></div>
            </div>
        </div>
        <div class="md:col-span-2 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <input type="checkbox" id="gf-trending" ${p?.istrending?'checked':''} class="w-4 h-4 accent-amber-500">
            <label for="gf-trending" class="text-sm font-bold text-amber-800 cursor-pointer">⭐ Trending mein dikhao</label>
        </div>
    </div>
    <div class="flex gap-3 mt-4">
        <button onclick="_saveGoldProduct()" class="flex-1 py-3 rounded-xl font-black text-sm active:scale-95 transition-all shadow-md" style="background:linear-gradient(135deg,#C9A84C,#B8860B);color:#1a0800;"><i class="fas fa-save mr-2"></i>${id?'Save Changes':'Add Gold Product'}</button>
        <button onclick="_closeGoldForm()" class="px-6 py-3 rounded-xl font-bold text-sm border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 transition-all">Cancel</button>
    </div>`;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
    // Trigger price calc if editing
    if(p?.supplier_price)setTimeout(_goldCalcPrice,100);
}

function _goldCalcPrice(){
    const supplier=parseInt(document.getElementById('gf-supplier-price')?.value)||0;
    const marginPct=parseInt(document.getElementById('gf-margin-pct-num')?.value)||0;
    const marginAmt=Math.round(supplier*marginPct/100);const selling=supplier+marginAmt;const mrp=Math.round(selling*1.4);
    const preview=document.getElementById('gf-price-preview');const selPrev=document.getElementById('gf-selling-preview');const marPrev=document.getElementById('gf-margin-preview');const mrpPrev=document.getElementById('gf-mrp-preview');const priceField=document.getElementById('gf-price');const oldpriceField=document.getElementById('gf-oldprice');
    if(preview)preview.classList.toggle('hidden',selling===0);
    if(selPrev)selPrev.textContent=`₹${selling.toLocaleString()}`;if(marPrev)marPrev.textContent=`₹${marginAmt.toLocaleString()}`;if(mrpPrev)mrpPrev.textContent=`₹${mrp.toLocaleString()}`;
    if(priceField&&selling>0)priceField.value=selling;if(oldpriceField&&selling>0&&!oldpriceField.value)oldpriceField.value=mrp;
    // Sync range slider
    const rangeEl=document.getElementById('gf-margin-pct');if(rangeEl)rangeEl.value=marginPct;
}

function _autoGenGoldDesc(){
    const name=document.getElementById('gf-name')?.value;if(!name)return showToast('Product Name pehle daalo');
    const cat=document.getElementById('gf-category')?.value||'';const sub=document.getElementById('gf-sub')?.value||'';
    document.getElementById('gf-desc').value=`✨ Premium ${name} — Exclusively available in OutfitKart Gold Collection. Crafted from the finest materials, this ${sub||cat} piece combines luxury with everyday comfort. Whether you're dressing up for a special occasion or elevating your everyday style, this piece delivers unmatched elegance. Limited edition — order now before stock runs out! 🌟`;
}

function _closeGoldForm(){_goldEditId=null;const panel=document.getElementById('gold-form-panel');if(panel){panel.className='hidden mb-4';panel.innerHTML='';}}

async function _saveGoldProduct(){
    const name=document.getElementById('gf-name')?.value.trim();const price=parseFloat(document.getElementById('gf-price')?.value);const category=document.getElementById('gf-category')?.value;const sub=document.getElementById('gf-sub')?.value;
    if(!name)return showToast('Product name required!');if(!price||isNaN(price))return showToast('Valid price required!');
    const imgsRaw=document.getElementById('gf-imgs')?.value||'';const imgs=imgsRaw.split('\n').map(s=>s.trim()).filter(Boolean);
    const sizes=[...document.querySelectorAll('.gold-size-chk:checked')].map(c=>c.value);
    const supplierPrice=parseFloat(document.getElementById('gf-supplier-price')?.value)||null;
    const marginPct=parseInt(document.getElementById('gf-margin-pct-num')?.value)||0;
    const marginAmt=supplierPrice?Math.round(supplierPrice*marginPct/100):0;
    // Save as 'description' column (not 'desc')
    const payload={name,price,oldprice:parseFloat(document.getElementById('gf-oldprice')?.value)||null,category,sub,brand:document.getElementById('gf-brand')?.value.trim()||null,description:document.getElementById('gf-desc')?.value.trim()||null,imgs,img:imgs[0]||null,available_sizes:sizes,stock_qty:parseInt(document.getElementById('gf-stock')?.value)||50,supplier_price:supplierPrice,supplier_url:document.getElementById('gf-supplier-url')?.value.trim()||null,margin_amt:marginAmt,istrending:document.getElementById('gf-trending')?.checked||false,is_active:true};
    try{
        let savedData;
        if(_goldEditId){const{data,error}=await dbClient.from('gold_products').update(payload).eq('id',_goldEditId).select().single();if(error)throw error;savedData=data;const idx=_goldAdminProducts.findIndex(p=>p.id===_goldEditId);if(idx>-1)_goldAdminProducts[idx]=savedData;showToast('✅ Gold product updated!');}
        else{const{data,error}=await dbClient.from('gold_products').insert([payload]).select().single();if(error)throw error;savedData=data;_goldAdminProducts.unshift(savedData);showToast('⭐ Gold product added!');}
        // Update frontend goldProducts array
        if(typeof goldProducts!=='undefined'){if(_goldEditId){const gi=goldProducts.findIndex(p=>p.id===_goldEditId);if(gi>-1)goldProducts[gi]={...savedData,desc:savedData.description||''};else goldProducts.unshift({...savedData,desc:savedData.description||''});}else{goldProducts.unshift({...savedData,desc:savedData.description||''});}}
        _closeGoldForm();_renderGoldAdminUI(document.getElementById('admin-gold-list'));
    }catch(err){showToast('❌ Error: '+err.message);}
}

async function _toggleGoldActive(id,isActive){
    try{const{error}=await dbClient.from('gold_products').update({is_active:isActive}).eq('id',id);if(error)throw error;const idx=_goldAdminProducts.findIndex(p=>p.id===id);if(idx>-1)_goldAdminProducts[idx].is_active=isActive;showToast(isActive?'✅ Active kar diya':'🔴 Inactive kar diya');_renderGoldAdminUI(document.getElementById('admin-gold-list'));}
    catch(err){showToast('❌ '+err.message);}
}
async function _deleteGoldProduct(id,name){
    if(!confirm(`"${name}" Gold se delete karo?`))return;
    try{const{error}=await dbClient.from('gold_products').delete().eq('id',id);if(error)throw error;_goldAdminProducts=_goldAdminProducts.filter(p=>p.id!==id);if(typeof goldProducts!=='undefined'){const gi=goldProducts.findIndex(p=>p.id===id);if(gi>-1)goldProducts.splice(gi,1);}showToast('🗑️ Gold product deleted');_renderGoldAdminUI(document.getElementById('admin-gold-list'));}
    catch(err){showToast('❌ '+err.message);}
}

function copyGoldSQL(){
    const sql=`-- OutfitKart Gold (Run in Supabase SQL Editor):
CREATE TABLE IF NOT EXISTS public.gold_products (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  price           NUMERIC NOT NULL,
  oldprice        NUMERIC,
  category        TEXT DEFAULT 'Men',
  sub             TEXT DEFAULT 'Topwear',
  brand           TEXT,
  description     TEXT,
  imgs            JSONB DEFAULT '[]',
  img             TEXT,
  available_sizes JSONB DEFAULT '[]',
  stock_qty       INTEGER DEFAULT 50,
  supplier_price  NUMERIC,
  supplier_url    TEXT,
  margin_amt      NUMERIC DEFAULT 0,
  istrending      BOOLEAN DEFAULT true,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.gold_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON public.gold_products FOR SELECT USING (true);
CREATE POLICY "admin_write" ON public.gold_products FOR ALL USING (true) WITH CHECK (true);`;
    navigator.clipboard.writeText(sql).then(()=>showToast('✅ Gold SQL copied!')).catch(()=>{const ta=document.createElement('textarea');ta.value=sql;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);showToast('✅ SQL copied!');});
}

/* ============================================================
   EXPORTS
   ============================================================ */
Object.assign(window,{
    showAdminLogin,closeAdminLogin,handleAdminLogin,updateAdminNameInHeader,loadAdminDashboard,adminLogout,exitAdmin,
    switchAdminTab,toggleAdminSidebar,
    renderAdminDashboard,_renderDashboardCharts,
    updateDropdownSubs,updateSizeSection,toggleProductMode,updateSellingPreview,autoGenerateDescription,
    adminAddProduct,renderAdminProducts,openEditProduct,closeEditModal,updateProduct,deleteProduct,addCustomMlVolume,
    loadAllOrdersAdmin,filterAdminOrders,renderFilteredOrders,updateOrderStatus,
    loadAllUsersAdmin,
    loadAllWithdrawalsAdmin,filterPayouts,approvePayout,rejectPayout,
    loadAdminReferrals,adminFilterReferrals,renderAdminReferralList,adminConfirmReferral,
    loadAdminInfluencerRequests,approveInfluencer,rejectInfluencer,
    sendAdminNotification,searchProductsForNotif,selectNotifProduct,_updateNotifPreview,_clearNotifFields,showPushSetupGuide,
    // Gold
    loadAdminGoldProducts,loadAdminGoldTab,_openGoldForm,_closeGoldForm,_saveGoldProduct,_toggleGoldActive,_deleteGoldProduct,_gFilter,copyGoldSQL,_goldCalcPrice,_autoGenGoldDesc,
    // Electronics
    loadAdminElectronicsProducts,adminToggleProductActive,
    // Promo
    loadAdminPromoCodes,createPromoCode,sharePromoToTelegram,sharePromoToWhatsApp,disablePromoCode,copyPromoSQL,
}); a

/* ================================================================
   MERGED: admin-luxury-anim.js — Luxury Admin Experience
   (Combined into app-admin.js)
================================================================ */
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


/* ================================================================
   COMBO PRODUCT SUPPORT — Admin Panel
   ================================================================
   Product add/edit form mein 'Combo' type ka option add karo
   Taaki PDP pe special vertical thumbnail layout enable ho sake
================================================================ */

(function _comboAdminSupport() {
  'use strict';

  /* ── 1. CSS for Combo indicator in admin ── */
  (function _injectComboCSS() {
    if (document.getElementById('ok-combo-admin-css')) return;
    const s = document.createElement('style');
    s.id = 'ok-combo-admin-css';
    s.textContent = `
      .ok-combo-type-section {
        background: linear-gradient(135deg, #fdf4ff, #f0f4ff);
        border: 1.5px solid #e9d5ff;
        border-radius: 12px;
        padding: 12px 14px;
        margin-bottom: 12px;
      }
      .ok-combo-type-section label {
        font-size: 10px;
        font-weight: 800;
        color: #7c3aed;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        display: block;
        margin-bottom: 8px;
      }
      .ok-combo-type-options {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .ok-combo-type-opt {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px 10px;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        background: white;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        color: #374151;
      }
      .ok-combo-type-opt input { display: none; }
      .ok-combo-type-opt:has(input:checked), .ok-combo-type-opt.selected {
        border-color: #7c3aed;
        background: #f5f3ff;
        color: #7c3aed;
      }
      .ok-combo-type-opt:hover { border-color: #7c3aed; }
      .ok-combo-enabled-info {
        margin-top: 8px;
        font-size: 10px;
        color: #7c3aed;
        font-weight: 600;
        display: none;
      }
      .ok-combo-enabled-info.visible { display: block; }
      .admin-product-combo-badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: #f5f3ff;
        color: #7c3aed;
        border: 1px solid #ddd6fe;
        border-radius: 99px;
        font-size: 9px;
        font-weight: 800;
        padding: 1px 7px;
      }
    `;
    document.head.appendChild(s);
  })();

  /* ── 2. Combo Type Section HTML builder ── */
  function _buildComboTypeHTML(fieldPrefix, currentValue) {
    const isCombo = currentValue === true || currentValue === 'true' || currentValue === 1;
    const opts = [
      { val: 'false', emoji: '👕', label: 'Regular' },
      { val: 'true', emoji: '🎁', label: 'Combo Set' },
      { val: 'couple', emoji: '💑', label: 'Couple Combo' },
      { val: 'best_friend', emoji: '👯', label: 'Best Friend' },
      { val: 'matching', emoji: '✨', label: 'Matching Set' },
    ];
    return `
      <div class="ok-combo-type-section" id="${fieldPrefix}-combo-section">
        <label><i class="fas fa-boxes mr-1"></i> Product Type / Combo</label>
        <div class="ok-combo-type-options">
          ${opts.map(o => `
            <div class="ok-combo-type-opt${(currentValue||'false') === o.val ? ' selected' : ''}" 
                 onclick="window._okSetComboType('${fieldPrefix}','${o.val}',this)">
              <input type="radio" name="${fieldPrefix}-combo-type" value="${o.val}" ${(currentValue||'false') === o.val ? 'checked' : ''}>
              ${o.emoji} ${o.label}
            </div>`).join('')}
        </div>
        <input type="hidden" id="${fieldPrefix}-is-combo" value="${currentValue||'false'}">
        <div class="ok-combo-enabled-info${isCombo ? ' visible' : ''}" id="${fieldPrefix}-combo-info">
          ✅ Combo layout PDP pe special vertical thumbnail layout dikhayega
        </div>
      </div>
    `;
  }

  window._okSetComboType = function(prefix, val, el) {
    // Update hidden input
    const hidden = document.getElementById(`${prefix}-is-combo`);
    if (hidden) hidden.value = val;
    // Update visual selection
    el.closest('.ok-combo-type-options')?.querySelectorAll('.ok-combo-type-opt').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    // Show info if combo type selected
    const info = document.getElementById(`${prefix}-combo-info`);
    if (info) info.classList.toggle('visible', val !== 'false');
  };

  /* ── 3. Inject Combo section into Add Product form ── */
  function _injectComboIntoAddForm() {
    const form = document.getElementById('add-product-form') || document.querySelector('[onsubmit*="adminAddProduct"]');
    if (!form || form.dataset.comboInjected) return;
    form.dataset.comboInjected = '1';

    // Desc field ke baad inject karo
    const descField = document.getElementById('ap-desc')?.closest('.mb-3, .mb-4') || form.querySelector('[id*="desc"]')?.parentElement;
    if (descField) {
      const comboDiv = document.createElement('div');
      comboDiv.innerHTML = _buildComboTypeHTML('ap', 'false');
      descField.insertAdjacentElement('afterend', comboDiv.firstElementChild);
    }

    // Patch adminAddProduct to include is_combo field
    const origAdd = window.adminAddProduct;
    if (origAdd && !window._adminAddComboPatched) {
      window._adminAddComboPatched = true;
      window.adminAddProduct = async function(e) {
        // Call original
        await origAdd(e);
        // Update the last inserted product with is_combo
        const comboVal = document.getElementById('ap-is-combo')?.value || 'false';
        if (comboVal !== 'false' && window.products?.length) {
          const lastP = window.products[window.products.length - 1];
          if (lastP) {
            const client = window.dbClient || window.supabase;
            if (client) {
              await client.from('products').update({ is_combo: comboVal }).eq('id', lastP.id).catch(()=>{});
              lastP.is_combo = comboVal;
            }
          }
        }
      };
    }
  }

  /* ── 4. Inject Combo section into Edit Product modal ── */
  function _injectComboIntoEditForm() {
    const modal = document.getElementById('edit-product-modal');
    if (!modal || modal.dataset.comboInjected) return;
    modal.dataset.comboInjected = '1';

    const descField = document.getElementById('ep-desc')?.closest('.mb-3, .mb-4') || modal.querySelector('[id*="ep-desc"]')?.parentElement;
    if (descField) {
      const comboDiv = document.createElement('div');
      comboDiv.innerHTML = _buildComboTypeHTML('ep', 'false');
      descField.insertAdjacentElement('afterend', comboDiv.firstElementChild);
    }

    // Patch openEditProduct to fill combo value
    const origEdit = window.openEditProduct;
    if (origEdit && !window._editComboPatched) {
      window._editComboPatched = true;
      window.openEditProduct = function(productId) {
        origEdit(productId);
        setTimeout(() => {
          const p = (window.products || []).find(x => x.id === productId || String(x.id) === String(productId));
          if (!p) return;
          const comboVal = p.is_combo ? String(p.is_combo) : 'false';
          const hidden = document.getElementById('ep-is-combo');
          if (hidden) hidden.value = comboVal;
          // Visual selection update
          document.querySelectorAll('[onclick*="_okSetComboType(\'ep\'"]').forEach(el => {
            const val = el.querySelector('input[type="radio"]')?.value;
            el.classList.toggle('selected', val === comboVal);
          });
          const info = document.getElementById('ep-combo-info');
          if (info) info.classList.toggle('visible', comboVal !== 'false');
        }, 200);
      };
    }

    // Patch updateProduct to include is_combo
    const origUpdate = window.updateProduct;
    if (origUpdate && !window._updateComboPatched) {
      window._updateComboPatched = true;
      window.updateProduct = async function(e) {
        const comboVal = document.getElementById('ep-is-combo')?.value || 'false';
        await origUpdate(e);
        // Update is_combo
        const productId = document.getElementById('edit-product-id')?.value;
        if (productId && comboVal !== 'false') {
          const client = window.dbClient || window.supabase;
          if (client) await client.from('products').update({ is_combo: comboVal }).eq('id', productId).catch(()=>{});
          const p = (window.products || []).find(x => String(x.id) === String(productId));
          if (p) p.is_combo = comboVal;
        }
      };
    }
  }

  /* ── 5. Show Combo badge in product list ── */
  function _patchRenderAdminProductsForCombo() {
    if (window._renderAdminProductsComboPatched) return;
    window._renderAdminProductsComboPatched = true;
    const origRender = window.renderAdminProducts;
    if (!origRender) return;
    window.renderAdminProducts = function() {
      origRender();
      // Add combo badge to products
      setTimeout(() => {
        (window.products || []).forEach(p => {
          if (!p.is_combo || p.is_combo === 'false') return;
          // Find the card for this product
          const cards = document.querySelectorAll(`[onclick*="openEditProduct(${p.id})"]`);
          cards.forEach(btn => {
            const card = btn.closest('.flex');
            const nameEl = card?.querySelector('.font-semibold');
            if (nameEl && !nameEl.querySelector('.admin-product-combo-badge')) {
              const badge = document.createElement('span');
              badge.className = 'admin-product-combo-badge ml-1';
              badge.innerHTML = '🎁 Combo';
              nameEl.appendChild(badge);
            }
          });
        });
      }, 200);
    };
  }

  /* ── 6. INIT ── */
  function _initComboAdmin() {
    _injectComboIntoAddForm();
    _injectComboIntoEditForm();
    _patchRenderAdminProductsForCombo();
    
    // Watch for modal open/form appear
    new MutationObserver(() => {
      if (!document.getElementById('add-product-form')?.dataset.comboInjected) {
        _injectComboIntoAddForm();
      }
      const modal = document.getElementById('edit-product-modal');
      if (modal && !modal.classList.contains('hidden') && !modal.dataset.comboInjected) {
        _injectComboIntoEditForm();
      }
    }).observe(document.body, { childList: true, subtree: true });
    
    console.log('%c🎁 Admin Combo Support ✅ Product type selector injected', 
      'background:#7c3aed;color:white;font-weight:900;font-size:11px;padding:3px 10px;border-radius:5px;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(_initComboAdmin, 800));
  } else {
    setTimeout(_initComboAdmin, 800);
  }

})();
