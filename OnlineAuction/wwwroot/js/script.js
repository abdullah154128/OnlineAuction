// ── DATA ──
const catIcons = { Watches:'fa-solid fa-clock', Art:'fa-solid fa-palette', Electronics:'fa-solid fa-laptop', Collectibles:'fa-solid fa-trophy', Fashion:'fa-solid fa-bag-shopping', Vehicles:'fa-solid fa-car' };
const products = [
  { id:1, category:'Watches', title:'1967 Rolex Submariner Ref. 5513', bid:28400, startBid:18000, bids:47, badge:'ending', timer:'8h 44m', desc:'Exceptional 1967 Rolex Submariner reference 5513 with original matte tropical dial. Case and bracelet show beautiful patina consistent with age. Movement runs perfectly, recently serviced. A museum-quality timepiece for the serious collector.', tags:['Rolex','Vintage','Swiss','1960s','Luxury'], bidHistory:[{user:'C***r',amount:28400,time:'2 min ago'},{user:'W***n',amount:26500,time:'15 min ago'},{user:'A***s',amount:24000,time:'1 hr ago'}], endTime:Date.now()+8*3600000+44*60000 },
  { id:2, category:'Art', title:'Abstract Oil on Canvas — "Crimson Tide"', bid:4200, startBid:800, bids:23, badge:'live', timer:'2d 3h', desc:'Striking large-format oil on canvas by acclaimed contemporary artist M. Voss. Bold, expressive brushwork with rich layers of crimson, ochre, and midnight blue. Signed and dated verso. Certificate of authenticity included.', tags:['Oil Painting','Contemporary','Abstract','Large Format'], bidHistory:[{user:'R***a',amount:4200,time:'5 min ago'},{user:'J***k',amount:3900,time:'22 min ago'}], endTime:Date.now()+51*3600000 },
  { id:3, category:'Electronics', title:'Apple Mac Pro M2 Ultra — Sealed', bid:5800, startBid:4500, bids:18, badge:'new', timer:'5d 12h', desc:'Factory sealed Apple Mac Pro with M2 Ultra chip. 192GB unified memory, 8TB SSD. Purchased and unopened. Full Apple warranty. Perfect for power users, studios, and professionals.', tags:['Apple','Mac Pro','M2 Ultra','Sealed','Pro'], bidHistory:[{user:'T***m',amount:5800,time:'1 hr ago'}], endTime:Date.now()+5.5*24*3600000 },
  { id:4, category:'Collectibles', title:'1952 Topps Mickey Mantle RC PSA 7', bid:72000, startBid:50000, bids:61, badge:'ending', timer:'4h 11m', desc:'The holy grail of baseball cards. 1952 Topps Mickey Mantle rookie card graded PSA 7. Vibrant colors, sharp corners, exceptional for the grade. Investment-grade collectible rarely seen at auction.', tags:['Baseball','Rookie Card','PSA','Mantle','1952 Topps'], bidHistory:[{user:'D***z',amount:72000,time:'1 min ago'},{user:'B***h',amount:69000,time:'8 min ago'},{user:'F***r',amount:65000,time:'31 min ago'}], endTime:Date.now()+4*3600000+11*60000 },
  { id:5, category:'Fashion', title:"Hermès Birkin 30 — Togo Leather", bid:14600, startBid:10000, bids:34, badge:'live', timer:'1d 8h', desc:'Pristine Hermès Birkin 30 in coveted Etain Togo leather with Palladium hardware. Excellent condition. Full set: dust bag, box, receipt, lock and keys. Certificate of authenticity included.', tags:['Hermès','Birkin','Luxury','Bag','French'], bidHistory:[{user:'S***a',amount:14600,time:'3 min ago'},{user:'N***i',amount:13800,time:'45 min ago'}], endTime:Date.now()+32*3600000 },
  { id:6, category:'Vehicles', title:'1969 Ford Mustang Boss 429 — Restored', bid:89500, startBid:65000, bids:29, badge:'live', timer:'3d 6h', desc:'Frame-off concours restoration of a matching-numbers 1969 Ford Mustang Boss 429 in Raven Black. One of the most powerful and beautiful muscle cars ever built. Full documentation and history file included.', tags:['Ford','Mustang','Classic Car','Boss 429','Restored'], bidHistory:[{user:'P***r',amount:89500,time:'2 hr ago'}], endTime:Date.now()+3.25*24*3600000 },
  { id:7, category:'Art', title:'Japanese Meiji Bronze Incense Burner', bid:3100, startBid:1500, bids:16, badge:'live', timer:'6d 2h', desc:'Impressive Meiji period (1868–1912) Japanese bronze koro with pierced lid, dragon handles, and inlaid details. Stands 38cm tall. Excellent patina, no cracks or repairs. Private UK collection provenance.', tags:['Japanese','Meiji','Bronze','Antique','Asian Art'], bidHistory:[{user:'G***n',amount:3100,time:'6 hr ago'}], endTime:Date.now()+6*24*3600000 },
  { id:8, category:'Electronics', title:'Leica M11 Monochrom — Mint Condition', bid:7200, startBid:6000, bids:11, badge:'new', timer:'4d 9h', desc:'Leica M11 Monochrom in virtually new condition. Less than 150 shutter actuations. Includes original box, charger, strap, and one extra battery. The definitive black-and-white rangefinder experience.', tags:['Leica','Camera','Monochrom','Rangefinder','M11'], bidHistory:[{user:'O***r',amount:7200,time:'4 hr ago'}], endTime:Date.now()+4.375*24*3600000 },
];

// ── STATE ──
let CP = null, CB = 0, prevPg = 'home';
let sCat='All', sStatus='', sSearch='', sSort='default', hCat='All', hSearch='';

// ── PAGE NAV ──
function showPage(name) {
  ['home','store','detail','about','contact'].forEach(p => {
    const el = document.getElementById('page-'+p);
    if(el) el.style.display = p===name ? 'block' : 'none';
  });
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  const el = document.getElementById('nav-'+name);
  if(el) el.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(name==='store') renderStore();
  if(name==='home') renderHome();
}
function goBack(){showPage(prevPg==='detail'?'store':(prevPg||'store'))}
function goStore(cat){sCat=cat;['All','Electronics','Art','Watches','Fashion','Collectibles','Vehicles'].forEach(c=>{const b=document.querySelector(`#sbCats .sb-link`);});document.querySelectorAll('#sbCats .sb-link').forEach(b=>{b.classList.toggle('active',b.textContent.trim().startsWith(cat)||(cat==='All'&&b.textContent.trim().startsWith('All')))});showPage('store')}

// ── CARD HTML ──
function cardHTML(p,i) {
  const ic = catIcons[p.category]||'fa-solid fa-box';
  const bl = p.badge==='ending'?'<i class="fa-solid fa-fire-flame-curved"></i> Ending Soon':p.badge==='new'?'<i class="fa-solid fa-sparkles"></i> New':'<i class="fa-solid fa-circle" style="font-size:8px"></i> Live';
  return `<div class="product-card" style="animation-delay:${i*55}ms" onclick="openDetail(products.find(x=>x.id===${p.id}))">
    <div class="card-img-wrap"><div class="card-img-icon"><i class="${ic}"></i></div>
      <span class="card-badge badge-${p.badge}">${bl}</span>
      <button class="card-fav" onclick="event.stopPropagation();toggleFav(this)"><i class="fa-regular fa-heart"></i></button>
    </div>
    <div class="card-body">
      <div class="card-cat">${p.category}</div>
      <div class="card-title">${p.title}</div>
      <div class="card-bid-row">
        <div><div class="card-bid-label">Current Bid</div><div class="card-bid-amt">$${p.bid.toLocaleString()}</div></div>
        <div class="card-timer ${p.badge==='ending'?'':'gold'}"><i class="fa-regular fa-clock"></i> ${p.timer}</div>
      </div>
      <div class="card-bids"><i class="fa-solid fa-users" style="font-size:11px"></i> ${p.bids} bid${p.bids!==1?'s':''}</div>
      <button class="btn-bid" onclick="event.stopPropagation();openDetail(products.find(x=>x.id===${p.id}))"><i class="fa-solid fa-gavel"></i> Place a Bid</button>
    </div></div>`;
}

// ── HOME ──
function renderHome() {
  let items = hCat==='All'?[...products]:products.filter(p=>p.category===hCat);
  if(hSearch) items=items.filter(p=>p.title.toLowerCase().includes(hSearch)||p.category.toLowerCase().includes(hSearch));
  const grid=document.getElementById('homeGrid'), empty=document.getElementById('homeEmpty'), count=document.getElementById('homeCount');
  if(!items.length){grid.innerHTML='';empty.style.display='block';count.textContent='No items found';return}
  empty.style.display='none';count.textContent=`Showing ${items.length} item${items.length!==1?'s':''}`;
  grid.innerHTML=items.map(cardHTML).join('');
}
function homeCat(cat,btn){hCat=cat;renderHome();document.querySelectorAll('.cat-pill').forEach(b=>b.classList.remove('active'));if(btn)btn.classList.add('active')}
function handleSearch(v){hSearch=v.toLowerCase().trim();renderHome()}

// ── STORE ──
function getStoreItems() {
  let items=[...products];
  if(sCat!=='All') items=items.filter(p=>p.category===sCat);
  if(sStatus) items=items.filter(p=>p.badge===sStatus);
  if(sSearch) items=items.filter(p=>p.title.toLowerCase().includes(sSearch)||p.category.toLowerCase().includes(sSearch)||p.tags.some(t=>t.toLowerCase().includes(sSearch)));
  const mn=parseFloat(document.getElementById('priceMin')?.value)||0, mx=parseFloat(document.getElementById('priceMax')?.value)||Infinity;
  items=items.filter(p=>p.bid>=mn&&p.bid<=mx);
  if(sSort==='bid-asc') items.sort((a,b)=>a.bid-b.bid);
  else if(sSort==='bid-desc') items.sort((a,b)=>b.bid-a.bid);
  else if(sSort==='ending') items.sort((a,b)=>a.endTime-b.endTime);
  else if(sSort==='newest') items.sort((a,b)=>b.id-a.id);
  return items;
}
function renderStore() {
  const items=getStoreItems(), grid=document.getElementById('storeGrid'), empty=document.getElementById('storeEmpty'), count=document.getElementById('storeCount');
  if(!items.length){grid.innerHTML='';empty.style.display='block'}else{empty.style.display='none';grid.innerHTML=items.map(cardHTML).join('')}
  count.textContent=`${items.length} lot${items.length!==1?'s':''}`;
}
function storeCat(cat,btn){sCat=cat;document.querySelectorAll('#sbCats .sb-link').forEach(b=>b.classList.remove('active'));if(btn)btn.classList.add('active');renderStore()}
function storeStatus(status,btn){sStatus=status;document.querySelectorAll('#sbStatus .sb-link').forEach(b=>b.classList.remove('active'));if(btn)btn.classList.add('active');renderStore()}
function handleStoreSearch(v){sSearch=v.toLowerCase().trim();renderStore()}
function handleSort(v){sSort=v;renderStore()}
function toggleSidebar(){const sb=document.getElementById('sidebar');sb.classList.toggle('open');document.querySelector('.sb-toggle').classList.toggle('active',sb.classList.contains('open'))}

// ── DETAIL ──
function openDetail(p) {
  if(!p) return;
  const vis=[...document.querySelectorAll('[id^="page-"]')].find(el=>el.style.display!=='none');
  prevPg = vis ? vis.id.replace('page-','') : 'store';
  CP=p; CB=p.bid;
  document.getElementById('d-bc-cat').textContent=p.category;
  document.getElementById('d-bc-title').textContent=p.title;
  document.getElementById('d-cat').textContent=p.category;
  document.getElementById('d-title').textContent=p.title;
  document.getElementById('d-bid').textContent='$'+CB.toLocaleString();
  document.getElementById('d-start').textContent='$'+p.startBid.toLocaleString();
  document.getElementById('d-numbids').textContent=p.bids;
  document.getElementById('d-desc').textContent=p.desc;
  const ic=catIcons[p.category]||'fa-solid fa-box';
  document.getElementById('d-main-img').innerHTML=`<i class="${ic}" style="font-size:96px;color:var(--soft);opacity:.45"></i>`;
  document.getElementById('d-thumbs').innerHTML=[0,1,2].map((n,i)=>`<div class="d-thumb ${i===0?'active':''}" onclick="document.querySelectorAll('.d-thumb').forEach(t=>t.classList.remove('active'));this.classList.add('active')"><i class="${ic}"></i></div>`).join('');
  document.getElementById('d-tags').innerHTML=p.tags.map(t=>`<span class="d-tag">${t}</span>`).join('');
  document.getElementById('bidInput').value='';
  document.getElementById('bidHint').innerHTML=`<i class="fa-solid fa-circle-info"></i> Minimum bid: $${(CB+100).toLocaleString()}`;
  renderBidHist();
  document.getElementById('watchBtn').innerHTML='<i class="fa-regular fa-heart"></i> Add to Watchlist';
  document.getElementById('watchBtn').classList.remove('watching');
  showPage('detail');
}
function renderBidHist(){document.getElementById('bidHistList').innerHTML=CP.bidHistory.map(b=>`<div class="bid-row"><span class="bid-row-user"><i class="fa-regular fa-user" style="font-size:11px"></i> ${b.user}</span><span class="bid-row-amt">$${b.amount.toLocaleString()}</span><span class="bid-row-time"><i class="fa-regular fa-clock" style="font-size:10px"></i> ${b.time}</span></div>`).join('')}

// ── BID ──
function placeBid(){
  const input=document.getElementById('bidInput'), val=parseFloat(input.value);
  if(!val||val<=CB){toast('warning',`Bid must exceed $${CB.toLocaleString()}`);input.style.borderColor='var(--accent)';setTimeout(()=>input.style.borderColor='',1600);return}
  CB=val;CP.bids+=1;CP.bid=val;CP.bidHistory.unshift({user:'You',amount:val,time:'Just now'});
  document.getElementById('d-bid').textContent='$'+val.toLocaleString();
  document.getElementById('d-numbids').textContent=CP.bids;
  document.getElementById('bidHint').innerHTML=`<i class="fa-solid fa-circle-info"></i> Minimum bid: $${(val+100).toLocaleString()}`;
  renderBidHist();input.value='';toast('success',`Bid of $${val.toLocaleString()} placed!`);
}

// ── FAV / WATCH ──
function toggleFav(btn){const ic=btn.querySelector('i'),act=btn.classList.toggle('active');ic.className=act?'fa-solid fa-heart':'fa-regular fa-heart';toast(act?'success':'warning',act?'Added to watchlist':'Removed from watchlist')}
function toggleWatch(){const btn=document.getElementById('watchBtn'),w=btn.classList.toggle('watching');btn.innerHTML=w?'<i class="fa-solid fa-heart" style="color:var(--accent)"></i> Watching':'<i class="fa-regular fa-heart"></i> Add to Watchlist';toast(w?'success':'warning',w?'Added to watchlist':'Removed from watchlist')}

// ── TOAST ──
function toast(type,msg){
  const el=document.getElementById('toastEl'),ic=document.getElementById('toastIcon');
  el.className='toast '+type;
  ic.className={success:'fa-solid fa-circle-check',warning:'fa-solid fa-triangle-exclamation',error:'fa-solid fa-circle-xmark'}[type]||'fa-solid fa-circle-check';
  document.getElementById('toastMsg').textContent=msg;
  el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3200);
}

// ── COUNTDOWNS ──
let featEnd=Date.now()+8*3600000+44*60000+12000;
function tickHero(){const diff=featEnd-Date.now();if(diff<=0)return;const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=String(v).padStart(2,'0')};set('cd-h',h);set('cd-m',m);set('cd-s',s)}
function tickDetail(){if(!CP)return;const diff=CP.endTime-Date.now();if(diff<=0)return;const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=String(v).padStart(2,'0')};set('d-d',d);set('d-h',h);set('d-m',m);set('d-s',s)}
setInterval(()=>{tickHero();tickDetail()},1000); tickHero();

// ── FAQ ──
function toggleFaq(el){const item=el.closest('.faq-item'),was=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(f=>f.classList.remove('open'));if(!was)item.classList.add('open')}

// ── CONTACT FORM ──
function submitForm(){
  const fn=document.getElementById('cf-fn').value.trim(), em=document.getElementById('cf-em').value.trim(), sub=document.getElementById('cf-sub').value, msg=document.getElementById('cf-msg').value.trim();
  if(!fn||!em||!sub||!msg){toast('warning','Please fill in all required fields.');return}
  if(!em.includes('@')){toast('error','Please enter a valid email address.');return}
  document.getElementById('cfWrap').style.display='none';document.getElementById('cfSuccess').style.display='block';toast('success','Message sent successfully!');
}
function resetForm(){['cf-fn','cf-ln','cf-em','cf-msg'].forEach(id=>document.getElementById(id).value='');document.getElementById('cf-sub').value='';document.getElementById('cfWrap').style.display='block';document.getElementById('cfSuccess').style.display='none'}

// ── MOBILE ──
function toggleMob(){document.getElementById('mobMenu').classList.toggle('open')}

// ── INIT ──
renderHome();

// PROFILE DASHBOARD SCRIPT

document.addEventListener("DOMContentLoaded", function () {
    showProfilePanel("overview"); // default panel
});


// Switch dashboard panels
function showProfilePanel(name) {

    // remove active from nav items
    document.querySelectorAll('[id^="pnav-"]').forEach(btn => {
        btn.classList.remove("active");
    });

    // hide all panels
    document.querySelectorAll('[id^="pp-"]').forEach(panel => {
        panel.classList.remove("active");
    });

    // activate clicked sidebar button
    const navEl = document.getElementById("pnav-" + name);
    if (navEl) navEl.classList.add("active");

    // show selected panel
    const panelEl = document.getElementById("pp-" + name);
    if (panelEl) panelEl.classList.add("active");

    // titles
    const titles = {
        "overview": "Overview",
        "listings": "My Listings",
        "list-product": "List a Product",
        "bids": "My Bids",
        "settings": "Account Settings"
    };

    // subtitles
    const subs = {
        "overview": "Welcome back to your dashboard",
        "listings": "Manage all your auction listings",
        "list-product": "Create a new auction item",
        "bids": "Track the auctions you've bid on",
        "settings": "Manage your account details"
    };

    const title = document.getElementById("profilePageTitle");
    const sub = document.getElementById("profilePageSub");

    if (title && titles[name]) {
        title.textContent = titles[name];
    }

    if (sub && subs[name]) {
        sub.textContent = subs[name];
    }
}


// Mobile sidebar toggle
function toggleProfileSidebar() {
    const sidebar = document.getElementById("profileSidebar");

    if (sidebar) {
        sidebar.classList.toggle("mob-open");
    }
}


// ── OPEN PRODUCT MODAL ──
function openProductModal(id) {
    if (!id) return;

    // Find the table row with this id
    const row = document.querySelector(`tr[data-id='${id}']`);
    if (!row) return;

    // Populate modal fields
    document.getElementById('pm-id').value = id;
    document.getElementById('pm-title').value = row.dataset.title || '';
    document.getElementById('pm-cat').value = row.dataset.category || 'Watches';
    document.getElementById('pm-startbid').value = row.dataset.startingprice || '';
    document.getElementById('pm-desc').value = row.dataset.description || '';

    // Set modal title
    document.getElementById('productModalTitle').textContent = 'Edit Product';

    // Show modal
    document.getElementById('productModal').style.display = 'flex';
}

// ── CLOSE MODAL ──
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function saveProductModal() {
    const id = parseInt(document.getElementById('pm-id').value);
    const title = document.getElementById('pm-title').value.trim();
    const cat = document.getElementById('pm-cat').value;
    const start = parseFloat(document.getElementById('pm-startbid').value);
    const desc = document.getElementById('pm-desc').value.trim();

    if (!title || !start) {
        toast('warning', 'Title and starting bid are required.');
        return;
    }

    const updated = {
        Id: id,
        Title: title,
        Description: desc,
        StartingPrice: start,
        Category: { Name: cat }
    };

    fetch('/Profile/EditListing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
    })
        .then(res => {
            if (!res.ok) throw new Error();

            toast('success', 'Product updated successfully!');

            // CLOSE MODAL (use the same function your cancel button uses)
            closeModal('productModal');

            // reload page after closing
            setTimeout(() => {
                location.reload();
            }, 300);
        })
        .catch(() => {
            toast('error', 'Failed to update product.');
        });
}

function openConfirmDelete(type, id, ctx) {
    deleteContext = { type, id, ctx };
    if (type === 'product') {
        const p = allProducts.find(x => x.id === id);
        document.getElementById('confirmTitle').textContent = 'Delete this product?';
        document.getElementById('confirmMsg').textContent = `"${p ? p.title : 'This item'}" will be permanently removed.`;
    } else {
        const u = adminUsers.find(x => x.id === id);
        document.getElementById('confirmTitle').textContent = 'Delete this user?';
        document.getElementById('confirmMsg').textContent = `${u ? u.fname + ' ' + u.lname : 'This user'} and all their data will be permanently removed.`;
    }
    document.getElementById('confirmModal').classList.add('open');
}
function executeDelete() {
    if (!deleteContext) return;
    const { type, id, ctx } = deleteContext;
    if (type === 'product') {
        const removeFrom = arr => { const i = arr.findIndex(x => x.id === id); if (i > -1) arr.splice(i, 1); };
        removeFrom(allProducts); removeFrom(products); removeFrom(userProducts);
        if (ctx === 'profile') { renderProfileListings(); renderProfileRecent(); document.getElementById('stat-listings').textContent = userProducts.length; }
        if (ctx === 'admin') { renderAdminProducts(); renderAdminRecent(); document.getElementById('astat-products').textContent = allProducts.length; }
        toast('success', 'Product deleted.');
    } else {
        const i = adminUsers.findIndex(x => x.id === id);
        if (i > -1) adminUsers.splice(i, 1);
        renderAdminUsers(); renderAdminRecentUsers();
        document.getElementById('astat-users').textContent = adminUsers.length;
        toast('success', 'User deleted.');
    }
    closeModal('confirmModal');
    deleteContext = null;
}

function updateTimers() {
    const timers = document.querySelectorAll(".card-timer");

    timers.forEach(timer => {
        const endTimeStr = timer.dataset.endtime;
        if (!endTimeStr) return;

        const endTime = new Date(endTimeStr); // now JS can parse it
        if (isNaN(endTime)) return;

        const now = new Date();
        let diff = endTime - now; // milliseconds

        const textEl = timer.querySelector(".timer-text");
        if (!textEl) return;

        if (diff <= 0) {
            textEl.textContent = "Closed";
            timer.classList.remove("gold");
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);

        const minutes = Math.floor(diff / (1000 * 60));

        // Display format: "3d 7h 15m"
        let display = "";
        if (days > 0) display += days + "d ";
        if (hours > 0 || days > 0) display += hours + "h ";
        display += minutes + "m";

        textEl.textContent = display;

        // Highlight auctions ending < 24h
        if (days === 0) timer.classList.add("gold");
        else timer.classList.remove("gold");
    });
}

// Run every second
setInterval(updateTimers, 1000);
updateTimers();