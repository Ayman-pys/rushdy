/* =========================================================
   رشدي استوديو — script.js
   ملاحظة: رقم الواتساب موضوع في متغير واحد لسهولة التغيير لاحقاً
========================================================= */
const WHATSAPP_NUMBER = "201000000000"; // غيّر هذا الرقم لاستقبال الطلبات

/* ---------------------------------------------------------
   1) بيانات اللوحات (24 لوحة)
--------------------------------------------------------- */
const paintings = [
  { title: "همسات الفجر", desc: "لوحة زيتية تجريدية بألوان دافئة تحاكي إشراقة الصباح.", price: 42, discount: 35, seed: "art-1" },
  { title: "ظلال الصحراء", desc: "منظر طبيعي بتدرجات ذهبية وبنية يعكس هدوء الرمال.", price: 128, discount: 20, seed: "art-2" },
  { title: "نافذة على البحر", desc: "لوحة مائية زرقاء تنبض بحياة الموج وضوء الأفق.", price: 9, discount: 50, seed: "art-3" },
  { title: "أسرار القمر", desc: "عمل تجريدي ليلي بلمسات فضية وذهبية دقيقة.", price: 265, discount: 40, seed: "art-4" },
  { title: "حكاية الياسمين", desc: "تكوين نباتي رقيق بألوان بيضاء وخضراء ناعمة.", price: 76, discount: 25, seed: "art-5" },
  { title: "طريق الحرير", desc: "لوحة مستوحاة من الرحلات القديمة بدرجات ترابية.", price: 340, discount: 45, seed: "art-6" },
  { title: "وجه من الماضي", desc: "بورتريه تعبيري بألوان داكنة وضربات فرشاة جريئة.", price: 190, discount: 30, seed: "art-7" },
  { title: "أثر الزمن", desc: "عمل تجريدي فاخر بملمس ذهبي وتشققات فنية متعمدة.", price: 750, discount: 70, seed: "art-8" },
];

// حساب السعر بعد الخصم لكل لوحة
paintings.forEach((p, i) => {
  p.id = i + 1;
  p.finalPrice = Math.max(1, Math.round(p.price * (1 - p.discount / 100)));
  p.image = `https://picsum.photos/seed/${p.seed}/700/850`;
});

/* ---------------------------------------------------------
   2) عرض اللوحات في المعرض
--------------------------------------------------------- */
const galleryGrid = document.getElementById("galleryGrid");
const noResults = document.getElementById("noResults");
let currentFilter = "all";
let currentSearch = "";

function priceInRange(price, range) {
  if (range === "all") return true;
  const [min, max] = range.split("-").map(Number);
  return price >= min && price <= max;
}

function renderGallery() {
  const filtered = paintings.filter(p =>
    priceInRange(p.finalPrice, currentFilter) &&
    p.title.toLowerCase().includes(currentSearch.toLowerCase())
  );

  galleryGrid.innerHTML = filtered.map(p => `
    <article class="painting-card" data-id="${p.id}" tabindex="0" role="button" aria-label="${p.title}">
      <div class="painting-frame">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <span class="discount-badge">-${p.discount}%</span>
      </div>
      <div class="painting-label">
        <h4>${p.title}</h4>
        <p class="painting-desc">${p.desc}</p>
        <div class="price-row">
          <span class="old-price">${p.price}$</span>
          <span class="new-price">${p.finalPrice}$</span>
        </div>
      </div>
    </article>
  `).join("");

  noResults.hidden = filtered.length !== 0;

  // فتح النافذة عند الضغط على أي بطاقة (بما في ذلك الصورة نفسها)
  galleryGrid.querySelectorAll(".painting-card").forEach(card => {
    card.addEventListener("click", () => openModal(Number(card.dataset.id)));
    card.addEventListener("keypress", e => {
      if (e.key === "Enter") openModal(Number(card.dataset.id));
    });
  });

  // ظهور تدريجي للبطاقات
  requestAnimationFrame(() => {
    galleryGrid.querySelectorAll(".painting-card").forEach((card, i) => {
      setTimeout(() => card.classList.add("show"), i * 40);
    });
  });
}
renderGallery();

/* فلاتر السعر */
document.getElementById("filterChips").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  currentFilter = chip.dataset.filter;
  renderGallery();
});

/* البحث المباشر (شريط المعرض + شريط الهيدر) */
function handleSearchInput(value) {
  currentSearch = value;
  renderGallery();
  document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
}
document.getElementById("gallerySearch").addEventListener("input", e => {
  currentSearch = e.target.value;
  renderGallery();
});
document.getElementById("headerSearchInput").addEventListener("input", e => {
  document.getElementById("gallerySearch").value = e.target.value;
  currentSearch = e.target.value;
  renderGallery();
});
document.getElementById("headerSearchInput").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    handleSearchInput(e.target.value);
    closeHeaderSearch();
  }
});

/* ---------------------------------------------------------
   3) نافذة عرض اللوحة (Modal)
--------------------------------------------------------- */
const modalOverlay = document.getElementById("modalOverlay");
let activePainting = null;

function openModal(id) {
  const p = paintings.find(x => x.id === id);
  if (!p) return;
  activePainting = p;
  document.getElementById("modalImg").src = p.image;
  document.getElementById("modalImg").alt = p.title;
  document.getElementById("modalBadge").textContent = `-${p.discount}%`;
  document.getElementById("modalTitle").textContent = p.title;
  document.getElementById("modalDesc").textContent = p.desc;
  document.getElementById("modalOld").textContent = `${p.price}$`;
  document.getElementById("modalNew").textContent = `${p.finalPrice}$`;
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeDrawer(); } });

/* شراء عبر واتساب برسالة معبأة مسبقاً */
document.getElementById("modalBuy").addEventListener("click", () => {
  if (!activePainting) return;
  const p = activePainting;
  const message =
`السلام عليكم،
أرغب في شراء اللوحة التالية:

اسم اللوحة:
${p.title}

السعر:
${p.finalPrice}$

الرجاء التواصل معي لإكمال عملية الشراء.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
  showToast("جاري فتح واتساب لإتمام طلبك ✨");
});

/* ---------------------------------------------------------
   4) العد التنازلي (وهمي - يتجدد تلقائياً)
--------------------------------------------------------- */
function getTargetDate() {
  const stored = localStorageSafeGet("rashdi_offer_end");
  if (stored && new Date(stored) > new Date()) return new Date(stored);
  const target = new Date();
  target.setDate(target.getDate() + 3);
  localStorageSafeSet("rashdi_offer_end", target.toISOString());
  return target;
}
// تجنب استخدام localStorage الفعلي إن لم يكن متاحاً (بيئات معاينة)
function localStorageSafeGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
function localStorageSafeSet(key, val){ try { localStorage.setItem(key, val); } catch(e){ /* silent */ } }

let targetDate = getTargetDate();

function updateCountdown() {
  const now = new Date();
  let diff = targetDate - now;
  if (diff <= 0) {
    targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    localStorageSafeSet("rashdi_offer_end", targetDate.toISOString());
    diff = targetDate - now;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById("cdDays").textContent = String(days).padStart(2, "0");
  document.getElementById("cdHours").textContent = String(hours).padStart(2, "0");
  document.getElementById("cdMins").textContent = String(mins).padStart(2, "0");
  document.getElementById("cdSecs").textContent = String(secs).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------------------------------------------------------
   5) العدادات المتحركة (Intersection Observer)
--------------------------------------------------------- */
const counters = document.querySelectorAll(".stat-number");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
counters.forEach(c => counterObserver.observe(c));

function animateCounter(el) {
  const target = Number(el.dataset.target);
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString("ar");
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString("ar");
  }
  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------
   6) ظهور العناصر عند التمرير (fade/slide up)
--------------------------------------------------------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------------------------------------------------------
   7) الهيدر: تغيير الخلفية عند التمرير + إبراز الرابط النشط
--------------------------------------------------------- */
const siteHeader = document.getElementById("siteHeader");
const sections = document.querySelectorAll("main section[id], .hero");
const navLinks = document.querySelectorAll(".nav-link");
const bottomNavItems = document.querySelectorAll(".bn-item");

function onScroll() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 40);

  let currentId = "home";
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 120) currentId = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
  bottomNavItems.forEach(item => {
    item.classList.toggle("active", item.dataset.target === currentId);
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------------------------------------------------------
   8) البحث في الهيدر (فتح/إغلاق)
--------------------------------------------------------- */
const headerSearch = document.getElementById("headerSearch");
document.getElementById("searchToggle").addEventListener("click", () => {
  headerSearch.classList.toggle("open");
  if (headerSearch.classList.contains("open")) {
    setTimeout(() => document.getElementById("headerSearchInput").focus(), 300);
  }
});
function closeHeaderSearch() { headerSearch.classList.remove("open"); }
document.getElementById("headerSearchClose").addEventListener("click", closeHeaderSearch);

/* ---------------------------------------------------------
   9) القائمة الجانبية (Drawer) للجوال
--------------------------------------------------------- */
const drawer = document.getElementById("drawer");
function openDrawer() { drawer.classList.add("open"); document.body.style.overflow = "hidden"; }
function closeDrawer() { drawer.classList.remove("open"); document.body.style.overflow = ""; }
document.getElementById("menuToggle").addEventListener("click", openDrawer);
document.getElementById("drawerClose").addEventListener("click", closeDrawer);
document.getElementById("drawerBackdrop").addEventListener("click", closeDrawer);
document.querySelectorAll(".drawer-nav a").forEach(a => a.addEventListener("click", closeDrawer));

/* ---------------------------------------------------------
   10) تنبيه صغير (Toast) بأسلوب التطبيقات
--------------------------------------------------------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------------------------------------------------------
   11) شاشة التحميل الافتتاحية
--------------------------------------------------------- */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hide"), 500);
});
// خطة احتياطية في حال تأخر حدث load
setTimeout(() => document.getElementById("loader").classList.add("hide"), 2200);
