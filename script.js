const API_URL = window.API_URL || '';
let products = [];
let cart = JSON.parse(localStorage.getItem('velvoraCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('velvoraWishlist')) || [];
let currentSlide = 0;
let lastScroll = 0;
let modalQty = 1;
let selectedModalSize = null;
let searchTimer;

const sampleProducts = [
    { _id: "1", name: "Classic Wool Blend Overcoat", description: "Timeless wool blend overcoat with elegant lapels. Perfect for formal occasions and everyday sophistication.", price: 299.99, originalPrice: 399.99, category: "women", image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400", stock: 25, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Black", "Camel", "Navy"], tag: "new", rating: 5 },
    { _id: "2", name: "Premium Italian Leather Handbag", description: "Handcrafted Italian leather handbag with gold hardware. Features multiple compartments for organized storage.", price: 349.99, originalPrice: 449.99, category: "accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400", stock: 15, sizes: [], colors: ["Tan", "Black", "Burgundy"], tag: "bestseller", rating: 5 },
    { _id: "3", name: "Silk Blend Midi Skirt", description: "Elegant silk blend midi skirt with flowing silhouette. Perfect for office or evening wear.", price: 129.99, originalPrice: 169.99, category: "women", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400", stock: 40, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Ivory", "Blush", "Sage"], tag: "new", rating: 4 },
    { _id: "4", name: "Cashmere V-Neck Sweater", description: "Luxuriously soft 100% cashmere sweater. Lightweight yet warm, perfect for layering.", price: 189.99, originalPrice: 249.99, category: "women", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", stock: 30, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Cream", "Heather Gray", "Navy", "Burgundy"], tag: "sale", rating: 5 },
    { _id: "5", name: "Tailored Wool Blazer", description: "Impeccably tailored wool blazer with modern slim fit. Perfect for business meetings.", price: 279.99, originalPrice: 349.99, category: "men", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", stock: 20, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Charcoal", "Navy", "Black"], tag: "new", rating: 5 },
    { _id: "6", name: "Premium Cotton Oxford Shirt", description: "Crisp cotton oxford shirt with mother-of-pearl buttons. Classic American style.", price: 89.99, originalPrice: 119.99, category: "men", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", stock: 50, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Light Blue", "Pink"], tag: "bestseller", rating: 4 },
    { _id: "7", name: "Designer Aviator Sunglasses", description: "Premium metal frame sunglasses with UV400 protection. Includes luxury hard case.", price: 159.99, originalPrice: 199.99, category: "accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400", stock: 35, sizes: [], colors: ["Gold", "Silver", "Rose Gold"], tag: "sale", rating: 4 },
    { _id: "8", name: "Kids Designer Party Dress", description: "Adorable party dress with tulle overlay and sequin details. Perfect for special occasions.", price: 79.99, originalPrice: 99.99, category: "kids", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400", stock: 25, sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"], colors: ["Pink", "Lavender", "Red"], tag: "new", rating: 5 },
    { _id: "9", name: "Slim Fit Dark Wash Jeans", description: "Premium stretch denim with modern slim fit. Comfortable all-day wear.", price: 99.99, originalPrice: 139.99, category: "men", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400", stock: 45, sizes: ["28", "30", "32", "34", "36", "38"], colors: ["Dark Blue", "Black"], tag: "sale", rating: 4 },
    { _id: "10", name: "Leather Card Wallet", description: "Slim genuine leather card wallet with RFID blocking. Holds up to 8 cards.", price: 59.99, originalPrice: 79.99, category: "accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400", stock: 60, sizes: [], colors: ["Black", "Brown", "Navy"], tag: "bestseller", rating: 4 },
    { _id: "11", name: "Floral Print Maxi Dress", description: "Bohemian-inspired maxi dress with flattering wrap silhouette. Perfect for summer events.", price: 119.99, originalPrice: 159.99, category: "women", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", stock: 35, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Floral Blue", "Floral Pink", "Floral Green"], tag: "new", rating: 5 },
    { _id: "12", name: "Boys Formal Suit Set", description: "Complete suit set including blazer, pants, and tie. Perfect for weddings and special events.", price: 129.99, originalPrice: 169.99, category: "kids", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", stock: 20, sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"], colors: ["Navy", "Gray", "Black"], tag: "bestseller", rating: 5 },
    { _id: "13", name: "Silk Pocket Square Set", description: "Set of 3 premium silk pocket squares with elegant patterns. Gift-boxed.", price: 49.99, originalPrice: 69.99, category: "accessories", image: "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=400", stock: 40, sizes: [], colors: ["Classic Set", "Modern Set", "Bold Set"], tag: "sale", rating: 4 },
    { _id: "14", name: "Cashmere Blend Scarf", description: "Luxuriously soft cashmere blend scarf. Oversized for maximum warmth and style.", price: 89.99, originalPrice: 119.99, category: "accessories", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400", stock: 50, sizes: [], colors: ["Camel", "Gray", "Burgundy", "Navy"], tag: "new", rating: 5 },
    { _id: "15", name: "Premium Leather Belt", description: "Handcrafted genuine leather belt with brushed silver buckle. 1.25 inch width.", price: 69.99, originalPrice: 89.99, category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", stock: 55, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Brown", "Tan"], tag: "bestseller", rating: 4 },
    { _id: "16", name: "Kids Knit Sweater", description: "Cozy knit sweater perfect for layering. Soft cotton blend for sensitive skin.", price: 49.99, originalPrice: 69.99, category: "kids", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400", stock: 40, sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: ["Cream", "Navy", "Sage", "Rose"], tag: "sale", rating: 4 }
];

const sizeByCategory = {
    women: ['XS', 'S', 'M', 'L', 'XL'],
    men: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    kids: ['XS', 'S', 'M', 'L', 'XL'],
    shoes: ['6', '7', '8', '9', '10', '11'],
    accessories: []
};

const formatPrice = (price) => '₹' + Number(price || 0).toLocaleString('en-IN');
const placeholderImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0iYXJpYWwiIGZvbnQtc2l6ZT0iMjAiPkltYWdlPC90ZXh0Pjwvc3ZnPg==';

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        if (data && data.length > 0) {
            products = data;
            localStorage.setItem('velvoraProducts', JSON.stringify(data));
        } else {
            products = sampleProducts;
        }
    } catch (e) {
        const storedProducts = localStorage.getItem('velvoraProducts');
        if (storedProducts) {
            products = JSON.parse(storedProducts);
        } else {
            products = sampleProducts;
            localStorage.setItem('velvoraProducts', JSON.stringify(sampleProducts));
        }
    }
    renderProducts();
    renderNewArrivals();
}

function init() {
    loadProducts();
    updateCartCount();
    updateWishlistCount();
    initSlider();
    initScrollEffects();
    initAnimations();
    updateUserUI();
    initTestimonials();
    initModalHandler();
    
    window.addEventListener('resize', () => {
        initTestimonials();
    });
}

function updateUserUI() {
    const user = JSON.parse(localStorage.getItem('velvoraUser'));
    const userIcon = document.getElementById('userIcon');
    const profileIcon = document.getElementById('profileIcon');
    
    if (user) {
        if (userIcon) userIcon.style.display = 'none';
        if (profileIcon) profileIcon.style.display = 'flex';
    } else {
        if (userIcon) userIcon.style.display = 'flex';
        if (profileIcon) profileIcon.style.display = 'none';
    }
}

function renderProducts(filter = 'all', searchTerm = '', limit = 4) {
    const grid = document.getElementById('productGrid');
    let filtered = products;

    if (filter !== 'all') {
        if (filter === 'sale') {
            filtered = products.filter(p => p.tag === 'sale');
        } else if (filter === 'new') {
            filtered = products.filter(p => p.tag === 'new');
        } else {
            filtered = products.filter(p => p.category === filter);
        }
    }

    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    const productsToShow = filtered.slice(0, limit);
    if (grid) {
        grid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
        grid.dataset.allProducts = JSON.stringify(filtered);
    }
}

function createProductCard(product) {
    const productId = product._id || product.id;
    const isInWishlist = wishlist.includes(productId);
    const stars = '★'.repeat(product.rating || 0) + '☆'.repeat(5 - (product.rating || 0));
    
    return `
        <div class="product-card" data-category="${product.category}">
            ${product.tag ? `<span class="product-tag ${product.tag}">${product.tag.toUpperCase()}</span>` : ''}
            <span class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlistItem('${productId}', event)">
                <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
            </span>
            <div class="product-image" onclick="openProductModal('${productId}')">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='${placeholderImg}'">
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="openProductModal('${productId}')">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 onclick="openProductModal('${productId}')">${product.name}</h3>
                <div class="product-rating">${stars}</div>
                <div class="product-price">
                    <span class="price">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${productId}')">
                    <i class="fas fa-shopping-bag"></i> Add to Bag
                </button>
            </div>
        </div>
    `;
}

function renderNewArrivals() {
    const grid = document.getElementById('newArrivalsGrid');
    if (!grid) return;
    
    const newProducts = products.filter(p => p.tag && p.tag.toLowerCase() === 'new').slice(0, 4);
    if (newProducts.length === 0) {
        grid.innerHTML = '<p class="no-products">No new arrivals yet</p>';
    } else {
        grid.innerHTML = newProducts.map(product => createProductCard(product)).join('');
    }
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => (p._id || p.id) == productId);
    if (!product) {
        showNotification('Product not found');
        return;
    }
    
    const existingItem = cart.find(item => (item._id || item.id) == productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity, id: productId });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to bag!`);
}

function addToCartFromModal(productId) {
    const product = products.find(p => (p._id || p.id) == productId);
    if (!product) {
        showNotification('Product not found');
        return;
    }
    
    const categorySizes = getModalSizes(product);
    const hasSizes = categorySizes.length > 0;
    
    if (hasSizes && !selectedModalSize) {
        const errorEl = document.querySelector('.modal-size-error');
        if (errorEl) {
            errorEl.style.display = 'block';
            const optionsEl = document.querySelector('.modal-size-options');
            if (optionsEl) {
                optionsEl.classList.add('shake');
                setTimeout(() => optionsEl.classList.remove('shake'), 500);
            }
        }
        return;
    }
    
    const quantityEl = document.getElementById('modalQuantityValue');
    const quantity = parseInt(quantityEl ? quantityEl.textContent : '1');
    
    const existingItem = cart.find(item => (item._id || item.id) == productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity, id: productId });
    }
    
    saveCart();
    updateCartCount();
    closeModal();
    showNotification(`${product.name} added to bag!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => String(item._id || item.id) !== String(productId));
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => String(item._id || item.id) === String(productId));
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            renderCartItems();
        }
    }
}

function saveCart() {
    localStorage.setItem('velvoraCart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cartCount');
    if (el) {
        el.textContent = count;
        el.style.display = count > 0 ? 'block' : 'none';
    }
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    
    if (!container || !totalEl) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty"><i class="fas fa-shopping-bag"></i> Your bag is empty</p>';
        totalEl.textContent = '₹0';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = '₹' + total.toLocaleString('en-IN');

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">₹${Number(item.price).toLocaleString('en-IN')}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item._id || item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item._id || item.id}', 1)">+</button>
                </div>
            </div>
            <span class="cart-item-remove" onclick="removeFromCart('${item._id || item.id}')">
                <i class="fas fa-times"></i>
            </span>
        </div>
    `).join('');
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        renderCartItems();
    }
}

function toggleWishlistItem(productId, event) {
    if (event) event.stopPropagation();
    
    const index = wishlist.indexOf(productId);
    const product = products.find(p => (p._id || p.id) == productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        if (product) showNotification(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(productId);
        if (product) showNotification(`${product.name} added to wishlist`);
    }

    localStorage.setItem('velvoraWishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderProducts();
    renderNewArrivals();
}

function updateWishlistCount() {
    const count = wishlist.length;
    const el = document.getElementById('wishlistCount');
    if (el) {
        el.textContent = count;
        el.style.display = count > 0 ? 'block' : 'none';
    }
}

function renderWishlistItems() {
    const container = document.getElementById('wishlistItems');
    
    if (!container) return;
    
    if (wishlist.length === 0) {
        container.innerHTML = '<p class="wishlist-empty"><i class="far fa-heart"></i> Your wishlist is empty</p>';
        return;
    }

    const wishlistProducts = products.filter(p => {
        const pid = p._id || p.id;
        return wishlist.includes(pid);
    });
    container.innerHTML = wishlistProducts.map(product => {
        const productId = product._id || product.id;
        return `
        <div class="wishlist-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="wishlist-item-info">
                <h4>${product.name}</h4>
                <p>₹${Number(product.price).toLocaleString('en-IN')}</p>
                <button onclick="addToCart('${productId}'); toggleWishlistItem('${productId}', event)">
                    <i class="fas fa-shopping-bag"></i> Add to Bag
                </button>
            </div>
            <span onclick="toggleWishlistItem('${productId}', event)">
                <i class="fas fa-times"></i>
            </span>
        </div>
    `}).join('');
}

function toggleWishlist() {
    const sidebar = document.getElementById('wishlistSidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        renderWishlistItems();
    }
}

function openProductModal(productId) {
    const product = products.find(p => (p._id || p.id) == productId);
    if (!product) {
        showNotification('Product not found');
        return;
    }
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;
    
    const stars = '★'.repeat(product.rating || 0) + '☆'.repeat(5 - (product.rating || 0));
    const categorySizes = getModalSizes(product);
    const hasSizes = categorySizes.length > 0;
    
    selectedModalSize = null;
    modalQty = 1;
    
    const sizeSection = hasSizes ? `
        <div class="modal-size-section">
            <span class="modal-size-label">Select Size</span>
            <div class="modal-size-options">
                ${categorySizes.map(size => `<span class="modal-size-option" data-size="${size}" onclick="selectModalSize('${size}')">${size}</span>`).join('')}
            </div>
            <p class="modal-size-error">Please select a size</p>
        </div>
    ` : `
        <div class="modal-size-section">
            <span class="modal-size-label">Size</span>
            <div class="modal-free-size">
                <span class="free-size-badge">Free Size</span>
            </div>
        </div>
    `;

    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
            <span class="modal-category">${product.category}</span>
            <h2>${product.name}</h2>
            <div class="modal-rating">${stars}</div>
            <p class="modal-price">
                <span class="current-price">${formatPrice(product.price)}</span>
                ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
            </p>
            ${sizeSection}
            <p class="modal-description">Experience unparalleled luxury with this exquisite piece. Crafted from the finest materials with meticulous attention to detail.</p>
            <div class="modal-quantity">
                <span>Quantity:</span>
                <div class="quantity-selector">
                    <button onclick="modalQuantity(-1)">-</button>
                    <span id="modalQuantityValue">1</span>
                    <button onclick="modalQuantity(1)">+</button>
                </div>
            </div>
            <div class="modal-actions">
                <button class="add-to-cart-modal" onclick="addToCartFromModal('${productId}')">
                    <i class="fas fa-shopping-bag"></i> Add to Bag
                </button>
                <button class="wishlist-modal" onclick="toggleWishlistItem('${productId}', event)">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function selectModalSize(size) {
    selectedModalSize = size;
    document.querySelectorAll('.modal-size-option').forEach(opt => opt.classList.remove('selected'));
    const el = document.querySelector(`.modal-size-option[data-size="${size}"]`);
    if (el) el.classList.add('selected');
}

function getModalSizes(product) {
    if (!product) return [];
    const category = product.category;
    const name = product.name.toLowerCase();
    
    if (name.includes('sneaker') || name.includes('boot') || name.includes('shoe') || name.includes('heel') || name.includes('sandal')) {
        return ['6', '7', '8', '9', '10', '11'];
    }
    
    if (category === 'accessories') {
        return [];
    }
    
    return sizeByCategory[category] || [];
}

function modalQuantity(change) {
    modalQty = Math.max(1, modalQty + change);
    const el = document.getElementById('modalQuantityValue');
    if (el) el.textContent = modalQty;
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalQty = 1;
    }
}

function filterProducts(category, event) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    renderProducts(category);
}

function filterCategory(category) {
    renderProducts(category);
    scrollToSection('products');
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
}

function searchProductsDebounced(term) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchProducts(term), 300);
}

function searchProducts(term) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (term.length < 2) {
        resultsContainer.style.display = 'none';
        return;
    }

    const results = products.filter(p => p.name.toLowerCase().includes(term.toLowerCase())).slice(0, 5);
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No products found</p>';
    } else {
        resultsContainer.innerHTML = results.map(p => `
            <div class="search-result-item" onclick="openProductModal('${p._id || p.id}'); document.getElementById('searchResults').style.display='none';">
                <img src="${p.image}" alt="${p.name}">
                <div>
                    <h4>${p.name}</h4>
                    <p>₹${Number(p.price).toLocaleString('en-IN')}</p>
                </div>
            </div>
        `).join('');
    }
    
    resultsContainer.style.display = 'block';
}

document.addEventListener('click', (e) => {
    const searchResults = document.getElementById('searchResults');
    if (!e.target.closest('.search-container') && searchResults) {
        searchResults.style.display = 'none';
    }
});

function toggleProducts() {
    const btn = document.getElementById('viewAllBtn');
    const grid = document.getElementById('productGrid');
    
    if (!btn || !grid) return;
    
    const isExpanded = btn.getAttribute('data-expanded') === 'true';
    const allProducts = JSON.parse(grid.dataset.allProducts || '[]');
    
    if (isExpanded) {
        const productsToShow = allProducts.slice(0, 4);
        grid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
        btn.textContent = 'View All Products';
        btn.setAttribute('data-expanded', 'false');
    } else {
        grid.innerHTML = allProducts.map(product => createProductCard(product)).join('');
        btn.textContent = 'Show Less';
        btn.setAttribute('data-expanded', 'true');
    }
}

let testimonialIndex = 0;

function initTestimonials() {
    const cards = document.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    if (window.innerWidth <= 768) {
        cards.forEach((card, index) => {
            card.style.display = index === 0 ? 'block' : 'none';
            card.classList.toggle('active', index === 0);
        });
        testimonialIndex = 0;
    } else {
        cards.forEach(card => {
            card.style.display = '';
            card.classList.remove('active');
        });
        testimonialIndex = 0;
    }
}

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    window.nextSlide = function() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    window.prevSlide = function() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    };

    setInterval(nextSlide, 6000);
}

function prevTestimonial() {
    const cards = document.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    cards[testimonialIndex].style.display = 'none';
    cards[testimonialIndex].classList.remove('active');
    testimonialIndex = (testimonialIndex - 1 + cards.length) % cards.length;
    cards[testimonialIndex].style.display = 'block';
    cards[testimonialIndex].classList.add('active');
}

function nextTestimonial() {
    const cards = document.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    cards[testimonialIndex].style.display = 'none';
    cards[testimonialIndex].classList.remove('active');
    testimonialIndex = (testimonialIndex + 1) % cards.length;
    cards[testimonialIndex].style.display = 'block';
    cards[testimonialIndex].classList.add('active');
}

function initScrollEffects() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (currentScroll <= 0) {
            header.classList.remove('hide');
            return;
        }

        if (currentScroll > lastScroll) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }

        lastScroll = currentScroll;
    });
}

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(sec => {
        sec.classList.add('hidden');
        observer.observe(sec);
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }
}

function animateStats() {
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                stat.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const sectionTop = section.offsetTop - headerHeight - 20;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setActive(element) {
    document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
    if (element) element.classList.add('active');
}

function toggleMenu() {
    document.querySelector('.nav')?.classList.toggle('active');
    document.querySelector('.menu-overlay')?.classList.toggle('active');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    if (notification && text) {
        text.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }
}

function subscribeNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    showNotification(`Thank you! 10% off code: WELCOME${email.substring(0, 3).toUpperCase()}`);
    e.target.reset();
}

function subscribeFooter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    showNotification(`Welcome to Velvora Circle, ${email.split('@')[0]}!`);
    e.target.reset();
}

function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Your bag is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

function initModalHandler() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        document.getElementById('cartSidebar')?.classList.remove('active');
        document.getElementById('wishlistSidebar')?.classList.remove('active');
        document.querySelector('.nav')?.classList.remove('active');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
    });
});

init();
