// ============================================
// POSTERIZED — Main JavaScript
// ============================================

// Product Data
const products = [
  {
    id: 1,
    title: "Batman — Men Are Brave",
    category: "superheroes",
    categoryLabel: "Superheroes",
    price: 300,
    originalPrice: 499,
    image: "image: "posters/batman-brave.jpg"",
    badge: "Trending",
    description: "A powerful Batman silhouette poster with the bold 'Men Are Brave' typography. Deep red tones create a dramatic, cinematic feel perfect for any superhero fan's wall."
  },
  {
    id: 2,
    title: "Spider-Man — Peter Parker",
    category: "superheroes",
    categoryLabel: "Superheroes",
    price: 300,
    originalPrice: 499,
    image: "image: "posters/spiderman.jpg"",
    badge: "Popular",
    description: "A stunning Spider-Man magazine-style poster featuring Peter Parker in his iconic suit. 'With Great Power Comes Great Responsibility' — a must-have for every Marvel fan."
  },
  {
    id: 3,
    title: "Ford Mustang Classic",
    category: "cars",
    categoryLabel: "Cars",
    price: 300,
    originalPrice: 499,
    image: image: "posters/mustang.jpg",
    badge: "Hot",
    description: "Celebrate the legendary Ford Mustang with this beautifully illustrated poster. The classic black Mustang on a golden background radiates vintage muscle car energy."
  },
  {
    id: 4,
    title: "Car Poster Wall Kit — 26 Designs",
    category: "combo",
    categoryLabel: "Combo Pack",
    price: 300,
    originalPrice: 549,
    image: "image: "posters/car-poster-kit.jpg"",
    badge: "Best Value",
    description: "The ultimate car lover's room setup! 26 A4-size premium car posters featuring Mustang, Porsche, BMW, Bugatti, Ferrari, and more. Transform your entire wall."
  },
  {
    id: 5,
    title: "Radha Krishna — Divine Love",
    category: "spiritual",
    categoryLabel: "Spiritual",
    price: 300,
    originalPrice: 499,
    image: "image: "posters/radha-krishna.jpg"",
    badge: "New",
    description: "A breathtaking artistic rendition of Radha Krishna, showcasing divine love in intricate detail. Delicate floral motifs and celestial colors bring peace and beauty to any space."
  }
];

// Cart State
let cart = [];
let currentModalProduct = null;
let modalQty = 1;

// ============================================
// DOM ELEMENTS
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const productsGrid = $('#products-grid');
const cartBtn = $('#cart-btn');
const cartCount = $('#cart-count');
const cartOverlay = $('#cart-overlay');
const cartDrawer = $('#cart-drawer');
const cartCloseBtn = $('#cart-close-btn');
const cartItems = $('#cart-items');
const cartEmpty = $('#cart-empty');
const cartFooter = $('#cart-footer');
const cartTotalAmount = $('#cart-total-amount');
const checkoutWhatsappBtn = $('#checkout-whatsapp-btn');

const modalOverlay = $('#modal-overlay');
const productModal = $('#product-modal');
const modalClose = $('#modal-close');
const modalImg = $('#modal-img');
const modalTitle = $('#modal-title');
const modalCategory = $('#modal-category');
const modalDescription = $('#modal-description');
const modalPrice = $('#modal-price');
const modalAddBtn = $('#modal-add-btn');
const qtyMinus = $('#qty-minus');
const qtyPlus = $('#qty-plus');
const qtyValue = $('#qty-value');

const searchBtn = $('#search-btn');
const searchOverlay = $('#search-overlay');
const searchInput = $('#search-input');
const searchClose = $('#search-close');

const mobileMenuBtn = $('#mobile-menu-btn');
const mobileMenuOverlay = $('#mobile-menu-overlay');
const mobileCloseBtn = $('#mobile-close-btn');

const toast = $('#toast');
const toastMessage = $('#toast-message');

// ============================================
// RENDER PRODUCTS
// ============================================
function renderProducts(filter = 'all') {
  productsGrid.innerHTML = '';
  
  const filtered = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);
  
  filtered.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.style.animationDelay = `${index * 0.08}s`;
    card.dataset.productId = product.id;
    card.innerHTML = `
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        ${product.badge ? `<span class="product-card-badge">${product.badge}</span>` : ''}
        <button class="product-card-quick-view">Quick View</button>
      </div>
      <div class="product-card-info">
        <div class="product-card-category">${product.categoryLabel}</div>
        <h3 class="product-card-title">${product.title}</h3>
        <div class="product-card-price-row">
          <span class="product-card-price">₹${product.price}</span>
          <span class="product-card-original-price">₹${product.originalPrice}</span>
        </div>
      </div>
      <button class="product-card-add-btn" aria-label="Add to cart" data-product-id="${product.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    `;
    productsGrid.appendChild(card);
  });
  
  // Bind events
  bindProductCardEvents();
}

function bindProductCardEvents() {
  // Quick view / card click
  $$('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open modal if clicking add button
      if (e.target.closest('.product-card-add-btn')) return;
      const id = parseInt(card.dataset.productId);
      openProductModal(id);
    });
  });
  
  // Add to cart buttons
  $$('.product-card-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.productId);
      addToCart(id, 1);
    });
  });
}

// ============================================
// PRODUCT MODAL
// ============================================
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  currentModalProduct = product;
  modalQty = 1;
  
  modalImg.src = product.image;
  modalImg.alt = product.title;
  modalTitle.textContent = product.title;
  modalCategory.textContent = product.categoryLabel;
  modalDescription.textContent = product.description;
  modalPrice.textContent = `₹${product.price}`;
  qtyValue.textContent = modalQty;
  modalAddBtn.textContent = `Add to Cart — ₹${product.price * modalQty}`;
  
  modalOverlay.classList.add('active');
  productModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  modalOverlay.classList.remove('active');
  productModal.classList.remove('active');
  document.body.style.overflow = '';
  currentModalProduct = null;
}

modalClose.addEventListener('click', closeProductModal);
modalOverlay.addEventListener('click', closeProductModal);

qtyMinus.addEventListener('click', () => {
  if (modalQty > 1) {
    modalQty--;
    qtyValue.textContent = modalQty;
    if (currentModalProduct) {
      modalAddBtn.textContent = `Add to Cart — ₹${currentModalProduct.price * modalQty}`;
    }
  }
});

qtyPlus.addEventListener('click', () => {
  if (modalQty < 10) {
    modalQty++;
    qtyValue.textContent = modalQty;
    if (currentModalProduct) {
      modalAddBtn.textContent = `Add to Cart — ₹${currentModalProduct.price * modalQty}`;
    }
  }
});

modalAddBtn.addEventListener('click', () => {
  if (currentModalProduct) {
    addToCart(currentModalProduct.id, modalQty);
    closeProductModal();
  }
});

// ============================================
// CART
// ============================================
function addToCart(productId, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  
  updateCartUI();
  showToast(`${product.title} added to cart!`);
  
  // Bump animation on cart count
  cartCount.classList.remove('bump');
  void cartCount.offsetWidth; // trigger reflow
  cartCount.classList.add('bump');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  cartCount.textContent = totalItems;
  cartTotalAmount.textContent = `₹${totalPrice}`;
  
  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartFooter.style.display = 'none';
    // Remove all cart items except empty state
    const itemEls = cartItems.querySelectorAll('.cart-item');
    itemEls.forEach(el => el.remove());
  } else {
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    
    // Rebuild cart items
    const itemEls = cartItems.querySelectorAll('.cart-item');
    itemEls.forEach(el => el.remove());
    
    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">₹${item.price * item.qty}</div>
          <div class="cart-item-qty">Qty: ${item.qty}</div>
        </div>
        <button class="cart-item-remove" data-product-id="${item.id}" aria-label="Remove item">×</button>
      `;
      cartItems.appendChild(el);
    });
    
    // Bind remove buttons
    cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(parseInt(btn.dataset.productId));
      });
    });
  }
}

// Cart drawer open/close
function openCart() {
  cartOverlay.classList.add('active');
  cartDrawer.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('active');
  cartDrawer.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// WhatsApp Checkout
checkoutWhatsappBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (cart.length === 0) return;
  
  let message = "🛒 *New Order from Posterized*\n\n";
  cart.forEach(item => {
    message += `• ${item.title} × ${item.qty} = ₹${item.price * item.qty}\n`;
  });
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  message += `\n*Total: ₹${total}*\n\nPlease confirm my order!`;
  
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/919999999999?text=${encodedMessage}`, '_blank');
});

// ============================================
// SEARCH
// ============================================
searchBtn.addEventListener('click', () => {
  searchOverlay.classList.add('active');
  setTimeout(() => searchInput.focus(), 300);
});

searchClose.addEventListener('click', () => {
  searchOverlay.classList.remove('active');
  searchInput.value = '';
  renderProducts();
});

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    renderProducts();
    return;
  }
  
  productsGrid.innerHTML = '';
  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(query) || 
    p.category.toLowerCase().includes(query) ||
    p.categoryLabel.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );
  
  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <p style="font-size: 18px; margin-bottom: 8px;">No posters found for "${e.target.value}"</p>
        <p style="font-size: 14px;">Try different keywords</p>
      </div>
    `;
    return;
  }
  
  filtered.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.style.animationDelay = `${index * 0.08}s`;
    card.dataset.productId = product.id;
    card.innerHTML = `
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        ${product.badge ? `<span class="product-card-badge">${product.badge}</span>` : ''}
        <button class="product-card-quick-view">Quick View</button>
      </div>
      <div class="product-card-info">
        <div class="product-card-category">${product.categoryLabel}</div>
        <h3 class="product-card-title">${product.title}</h3>
        <div class="product-card-price-row">
          <span class="product-card-price">₹${product.price}</span>
          <span class="product-card-original-price">₹${product.originalPrice}</span>
        </div>
      </div>
      <button class="product-card-add-btn" aria-label="Add to cart" data-product-id="${product.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    `;
    productsGrid.appendChild(card);
  });
  bindProductCardEvents();
});

// ============================================
// FILTERS
// ============================================
function setActiveFilter(filter) {
  // Update nav links
  $$('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.filter === filter);
  });
  
  // Update filter tabs
  $$('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  
  // Update mobile nav links
  $$('.mobile-nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.filter === filter);
  });
  
  renderProducts(filter);
  
  // Scroll to products section
  const productsSection = $('#products');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Nav link filters
$$('.nav-link[data-filter]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveFilter(link.dataset.filter);
  });
});

// Filter tabs
$$('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    setActiveFilter(tab.dataset.filter);
  });
});

// Mobile nav filters
$$('.mobile-nav-link[data-filter]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveFilter(link.dataset.filter);
    closeMobileMenu();
  });
});

// Category cards
$$('.category-card').forEach(card => {
  card.addEventListener('click', () => {
    const category = card.dataset.category;
    setActiveFilter(category);
  });
});

// Footer category links
$$('.footer-links-group a[data-filter]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveFilter(link.dataset.filter);
  });
});

// ============================================
// MOBILE MENU
// ============================================
function openMobileMenu() {
  mobileMenuOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenuOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
mobileCloseBtn.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', (e) => {
  if (e.target === mobileMenuOverlay) closeMobileMenu();
});

// ============================================
// TOAST
// ============================================
let toastTimeout;
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = $('#header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
  const revealElements = $$('.section-header, .category-card, .feature-card, .offers-content');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
  // Escape closes modals
  if (e.key === 'Escape') {
    closeProductModal();
    closeCart();
    closeMobileMenu();
    searchOverlay.classList.remove('active');
    searchInput.value = '';
  }
  
  // Ctrl/Cmd + K opens search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 300);
  }
});

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = $(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initScrollReveal();
});
