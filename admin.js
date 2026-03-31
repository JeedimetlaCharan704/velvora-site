const API_URL = 'http://localhost:3001/api';
let authToken = localStorage.getItem('velvoraAdminToken');
let allProducts = [];
let allOrders = [];
let allUsers = [];
let cropper = null;
let currentImageCallback = null;
let isDemoMode = false;
let useOnlineMode = false;

async function apiCall(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'API Error');
        return data;
    } catch (e) {
        console.warn('API unavailable, using localStorage:', e.message);
        useOnlineMode = false;
        throw e;
    }
}

function getStoredData(key, defaultValue) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
}

function setStoredData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getStoredProducts() {
    const stored = localStorage.getItem('velvoraProducts');
    return stored ? JSON.parse(stored) : sampleAdminProducts;
}

// Initialize Admin
async function initAdmin() {
    console.log('Initializing admin...');
    
    const user = JSON.parse(localStorage.getItem('velvoraAdminUser'));
    
    if (!authToken || !user || user.role !== 'admin') {
        enableDemoMode();
    }
    
    console.log('Loading products...');
    await loadProducts();
    await loadOrders();
    loadStats();
    loadCustomers();
    
    if (typeof initCharts === 'function') {
        setTimeout(initCharts, 100);
    }
}

function enableDemoMode() {
    console.log('Enabling demo mode...');
    const demoUser = { id: 'demo', name: 'Admin', email: 'admin@velvora.com', role: 'admin' };
    localStorage.setItem('velvoraAdminUser', JSON.stringify(demoUser));
    localStorage.setItem('velvoraAdminToken', 'demo-token');
    authToken = 'demo-token';
}

const sampleAdminProducts = [
    { _id: "1", name: "Silk Evening Gown", description: "Elegant silk evening gown perfect for special occasions", price: 22499.99, originalPrice: 29999.99, category: "women", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", stock: 15, sizes: ["XS", "S", "M", "L", "XL"], tag: "new" },
    { _id: "2", name: "Premium Leather Jacket", description: "Genuine leather jacket with modern fit", price: 37499.99, originalPrice: 44999.99, category: "men", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", stock: 20, sizes: ["S", "M", "L", "XL", "XXL"], tag: "new" },
    { _id: "3", name: "Designer Sunglasses", description: "Luxury designer sunglasses with UV protection", price: 14999.99, originalPrice: 19999.99, category: "accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", stock: 50, sizes: [], tag: "sale" },
    { _id: "4", name: "Cashmere Sweater", description: "100% cashmere sweater for ultimate comfort", price: 15999.99, originalPrice: 21999.99, category: "women", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", stock: 25, sizes: ["XS", "S", "M", "L", "XL"], tag: "new" },
    { _id: "5", name: "Classic Denim Jeans", description: "Premium denim jeans with perfect fit", price: 6999.99, originalPrice: 9999.99, category: "men", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400", stock: 100, sizes: ["28", "30", "32", "34", "36"], tag: "sale" },
    { _id: "6", name: "Floral Summer Dress", description: "Beautiful floral print summer dress", price: 5999.99, originalPrice: 7999.99, category: "women", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", stock: 50, sizes: ["XS", "S", "M", "L"], tag: "new" }
];

const sampleOrders = [
    { _id: "1", orderId: "VEL-001", customer: { name: "John Doe", email: "john@example.com" }, createdAt: new Date(), total: 22499.99, status: "Pending", items: [{ name: "Silk Evening Gown", price: 22499.99, quantity: 1 }] },
    { _id: "2", orderId: "VEL-002", customer: { name: "Jane Smith", email: "jane@example.com" }, createdAt: new Date(Date.now() - 86400000), total: 37499.99, status: "Processing", items: [{ name: "Premium Leather Jacket", price: 37499.99, quantity: 1 }] },
    { _id: "3", orderId: "VEL-003", customer: { name: "Mike Johnson", email: "mike@example.com" }, createdAt: new Date(Date.now() - 172800000), total: 14999.99, status: "Delivered", items: [{ name: "Designer Sunglasses", price: 14999.99, quantity: 1 }] }
];

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        if (data && Array.isArray(data)) {
            allProducts = data;
        } else {
            const storedProducts = localStorage.getItem('velvoraProducts');
            if (storedProducts) {
                allProducts = JSON.parse(storedProducts);
            } else {
                allProducts = sampleAdminProducts;
            }
        }
    } catch (e) {
        const storedProducts = localStorage.getItem('velvoraProducts');
        if (storedProducts) {
            allProducts = JSON.parse(storedProducts);
        } else {
            allProducts = sampleAdminProducts;
        }
    }
    renderProducts();
    document.getElementById('totalProducts').textContent = allProducts.length;
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        if (data && data.orders) {
            allOrders = data.orders;
        } else {
            const storedOrders = localStorage.getItem('velvoraOrders');
            if (storedOrders) {
                allOrders = JSON.parse(storedOrders);
            } else {
                allOrders = sampleOrders;
            }
        }
    } catch (e) {
        const storedOrders = localStorage.getItem('velvoraOrders');
        if (storedOrders) {
            allOrders = JSON.parse(storedOrders);
        } else {
            allOrders = sampleOrders;
        }
    }
    renderOrders();
    renderAllOrders();
    
    animateValue('totalOrders', 0, allOrders.length);
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    animateValue('totalRevenue', 0, totalRevenue);
    
    const avgOrderValue = allOrders.length > 0 ? (totalRevenue / allOrders.length) : 0;
    const avgEl = document.getElementById('avgOrderValue');
    if (avgEl) avgEl.textContent = '₹' + avgOrderValue.toFixed(2);
}

function loadStats() {
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalCustomers = allUsers.length || 0;
    
    animateValue('totalOrders', 0, totalOrders);
    animateValue('totalRevenue', 0, totalRevenue);
    
    const totalCustomersEl = document.getElementById('totalCustomers');
    if (totalCustomersEl) totalCustomersEl.textContent = totalCustomers;
}

async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();
        if (data && Array.isArray(data)) {
            allUsers = data;
        } else {
            const storedUsers = localStorage.getItem('velvoraUsers');
            if (storedUsers) {
                allUsers = JSON.parse(storedUsers);
            } else {
                allUsers = [];
            }
        }
    } catch (e) {
        const storedUsers = localStorage.getItem('velvoraUsers');
        if (storedUsers) {
            allUsers = JSON.parse(storedUsers);
        } else {
            allUsers = [];
        }
    }
    renderCustomers(allUsers);
    const totalCustomersEl = document.getElementById('totalCustomers');
    if (totalCustomersEl) totalCustomersEl.textContent = allUsers.length;
}

// Render Customers
function renderCustomers(users) {
    const grid = document.getElementById('customersGrid');
    if (!grid) return;
    
    if (users.length === 0) {
        grid.innerHTML = '<p class="no-data">No customers yet</p>';
        return;
    }
    
    grid.innerHTML = users.map(user => `
        <div class="customer-card">
            <div class="customer-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="customer-info">
                <h4>${user.name}</h4>
                <p><i class="fas fa-envelope"></i> ${user.email}</p>
                <p><i class="fas fa-phone"></i> ${user.phone || 'Not provided'}</p>
                <div class="customer-stats">
                    <span><i class="fas fa-shopping-bag"></i> ${user.total_orders || 0} orders</span>
                    <span><i class="fas fa-rupee-sign"></i> ₹${parseFloat(user.total_spent || 0).toLocaleString('en-IN')}</span>
                </div>
                <span class="customer-date"><i class="fas fa-calendar"></i> Joined: ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
        </div>
    `).join('');
}

// Render Recent Orders (Dashboard)
function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    const container = tbody?.parentElement;
    
    if (allOrders.length === 0) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="6">No orders yet</td></tr>';
        return;
    }
    
    const recentOrders = allOrders.slice(0, 5);
    
    // Desktop table
    if (tbody) {
        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.customerName || order.customer?.name || 'N/A'}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹${order.total?.toFixed(2) || '0.00'}</td>
                <td><span class="status-badge ${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span></td>
                <td><button class="action-btn" onclick="viewOrder('${order._id}')"><i class="fas fa-eye"></i></button></td>
            </tr>
        `).join('');
    }
    
    // Mobile cards
    if (container) {
        let mobileCards = container.querySelector('.mobile-cards');
        if (!mobileCards) {
            mobileCards = document.createElement('div');
            mobileCards.className = 'mobile-cards';
            container.appendChild(mobileCards);
        }
        
        mobileCards.innerHTML = recentOrders.map(order => `
            <div class="recent-order-card">
                <div class="recent-order-info">
                    <strong>${order.orderId}</strong>
                    <span>${order.customerName || order.customer?.name || 'N/A'}</span>
                </div>
                <div class="recent-order-info">
                    <span>₹${order.total?.toFixed(2) || '0.00'}</span>
                    <span class="status-badge ${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span>
                </div>
            </div>
        `).join('');
    }
}

// Render All Orders
function renderAllOrders() {
    const tbody = document.getElementById('allOrdersTable');
    const container = tbody?.parentElement;
    
    // Desktop table
    if (tbody) {
        tbody.innerHTML = allOrders.map(order => `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.customerName || order.customer?.name || 'N/A'}</td>
                <td>${order.items?.length || 0} items</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹${order.total?.toFixed(2) || '0.00'}</td>
                <td>
                    <select onchange="updateOrderStatus('${order._id}', this.value)">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td>
                    <button class="action-btn" onclick="viewOrder('${order._id}')"><i class="fas fa-eye"></i></button>
                    <button class="action-btn delete" onclick="deleteOrder('${order._id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }
    
    // Mobile cards
    if (container) {
        let mobileCards = container.querySelector('.mobile-cards');
        if (!mobileCards) {
            mobileCards = document.createElement('div');
            mobileCards.className = 'mobile-cards';
            container.appendChild(mobileCards);
        }
        
        mobileCards.innerHTML = allOrders.map(order => `
            <div class="order-card-admin">
                <div class="order-card-header">
                    <strong>${order.orderId}</strong>
                    <span class="status-badge ${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span>
                </div>
                <div class="order-card-info">
                    <p>${order.customerName || order.customer?.name || 'N/A'}</p>
                    <p>${new Date(order.createdAt).toLocaleDateString()} • ${order.items?.length || 0} items</p>
                </div>
                <div class="order-card-total">
                    <span>Total</span>
                    <span>₹${order.total?.toFixed(2) || '0.00'}</span>
                </div>
                <div class="order-card-actions">
                    <button class="action-btn" onclick="viewOrder('${order._id}')"><i class="fas fa-eye"></i> View</button>
                    <button class="action-btn" onclick="updateOrderStatusFromCard('${order._id}')"><i class="fas fa-truck"></i> Status</button>
                    <button class="action-btn delete" onclick="deleteOrder('${order._id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
}

// Render Order History
let currentPage = 1;
const ordersPerPage = 10;

function renderOrderHistory() {
    const tbody = document.getElementById('orderHistoryTable');
    if (!tbody) return;
    
    // Update history stats
    updateHistoryStats();
    
    // Paginate orders
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const paginatedOrders = allOrders.slice(startIndex, endIndex);
    
    tbody.innerHTML = paginatedOrders.map(order => `
        <tr>
            <td><strong>${order.orderId}</strong></td>
            <td>
                <div class="customer-cell">
                    <span>${order.customerName || order.customer?.name || 'N/A'}</span>
                    <small>${order.customerEmail || order.customer?.email || ''}</small>
                </div>
            </td>
            <td>${order.items?.length || 0} items</td>
            <td>
                <div class="date-cell">
                    <span>${new Date(order.createdAt).toLocaleDateString()}</span>
                    <small>${new Date(order.createdAt).toLocaleTimeString()}</small>
                </div>
            </td>
            <td><strong>₹${order.total?.toFixed(2) || '0.00'}</strong></td>
            <td>
                <span class="payment-badge ${order.paymentMethod || 'cod'}">${getPaymentMethodLabel(order.paymentMethod)}</span>
            </td>
            <td>
                <select onchange="updateOrderStatus('${order._id}', this.value)" class="status-select">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="action-btn" onclick="viewOrder('${order._id}')" title="View"><i class="fas fa-eye"></i></button>
                <button class="action-btn print" onclick="printOrder('${order._id}')" title="Print"><i class="fas fa-print"></i></button>
                <button class="action-btn delete" onclick="deleteOrder('${order._id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    renderPagination();
}

function getPaymentMethodLabel(method) {
    switch(method) {
        case 'card': return 'Card';
        case 'upi': return 'UPI';
        case 'paypal': return 'PayPal';
        case 'cod': return 'COD';
        default: return 'COD';
    }
}

function updateHistoryStats() {
    const totalOrders = allOrders.length;
    const completedOrders = allOrders.filter(o => o.status === 'Delivered').length;
    const pendingOrders = allOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    document.getElementById('totalHistoryOrders').textContent = totalOrders;
    document.getElementById('completedOrders').textContent = completedOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('totalRevenueHistory').textContent = '₹' + totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function renderPagination() {
    const pagination = document.getElementById('orderPagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(allOrders.length / ordersPerPage);
    
    let html = '';
    if (totalPages > 1) {
        html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Prev
        </button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<span class="ellipsis">...</span>`;
            }
        }
        
        html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    pagination.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(allOrders.length / ordersPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderOrderHistory();
}

function searchOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    if (!searchTerm) {
        renderAllOrders();
        return;
    }
    
    const filteredOrders = allOrders.filter(order => 
        (order.orderId || '').toLowerCase().includes(searchTerm) ||
        (order.customerName || order.customer?.name || '').toLowerCase().includes(searchTerm) ||
        (order.customerEmail || order.customer?.email || '').toLowerCase().includes(searchTerm)
    );
    
    const tbody = document.getElementById('allOrdersTable');
    if (tbody) {
        tbody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.customerName || order.customer?.name || 'N/A'}</td>
                <td>${order.items?.length || 0} items</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹${order.total?.toFixed(2) || '0.00'}</td>
                <td>
                    <select onchange="updateOrderStatus('${order._id}', this.value)">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td>
                    <button class="action-btn" onclick="viewOrder('${order._id}')"><i class="fas fa-eye"></i></button>
                    <button class="action-btn delete" onclick="deleteOrder('${order._id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }
}

function filterOrdersByDate() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate && !endDate) {
        renderAllOrders();
        return;
    }
    
    const filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && end) {
            return orderDate >= start && orderDate <= end;
        } else if (start) {
            return orderDate >= start;
        } else if (end) {
            return orderDate <= end;
        }
        return true;
    });
    
    const tbody = document.getElementById('allOrdersTable');
    if (tbody) {
        tbody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.customerName || order.customer?.name || 'N/A'}</td>
                <td>${order.items?.length || 0} items</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹${order.total?.toFixed(2) || '0.00'}</td>
                <td>
                    <select onchange="updateOrderStatus('${order._id}', this.value)">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td>
                    <button class="action-btn" onclick="viewOrder('${order._id}')"><i class="fas fa-eye"></i></button>
                    <button class="action-btn delete" onclick="deleteOrder('${order._id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }
}

function exportOrders() {
    const csvContent = [
        ['Order ID', 'Customer', 'Email', 'Items', 'Date', 'Amount', 'Payment', 'Status'].join(','),
        ...allOrders.map(order => [
            order.orderId,
            order.customerName || order.customer?.name || 'N/A',
            order.customerEmail || order.customer?.email || '',
            order.items?.length || 0,
            new Date(order.createdAt).toLocaleDateString(),
            order.total?.toFixed(2) || '0.00',
            order.paymentMethod || 'cod',
            order.status || 'Pending'
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velvora-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function printOrder(orderId) {
    const order = allOrders.find(o => o._id === orderId);
    if (!order) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Order ${order.orderId}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #c8a96a; }
                .info { margin: 10px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #f5f5f5; }
            </style>
        </head>
        <body>
            <h1>Velvora Luxury - Order Details</h1>
            <div class="info"><strong>Order ID:</strong> ${order.orderId}</div>
            <div class="info"><strong>Customer:</strong> ${order.customerName || order.customer?.name || 'N/A'}</div>
            <div class="info"><strong>Email:</strong> ${order.customerEmail || order.customer?.email || ''}</div>
            <div class="info"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</div>
            <div class="info"><strong>Status:</strong> ${order.status || 'Pending'}</div>
            <table>
                <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
                ${(order.items || []).map(item => `
                    <tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${(item.price * item.quantity).toFixed(2)}</td></tr>
                `).join('')}
            </table>
            <h3>Total: ₹${order.total?.toFixed(2) || '0.00'}</h3>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Update order status from mobile card
function updateOrderStatusFromCard(orderId) {
    const status = prompt('Enter status (Pending, Processing, Shipped, Delivered):');
    if (status && ['Pending', 'Processing', 'Shipped', 'Delivered'].includes(status)) {
        updateOrderStatus(orderId, status);
    }
}

// Filter Orders
function filterOrders(status) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const tbody = document.getElementById('allOrdersTable');
    if (!tbody) return;
    
    let filteredOrders = status === 'All' ? allOrders : allOrders.filter(o => o.status === status);
    
    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>${order.orderId}</td>
            <td>${order.customerName || order.customer?.name || 'N/A'}</td>
            <td>${order.items?.length || 0} items</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>₹${order.total?.toFixed(2) || '0.00'}</td>
            <td>
                <select onchange="updateOrderStatus('${order._id}', this.value)">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </td>
            <td>
                <button class="action-btn" onclick="viewOrder('${order._id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" onclick="deleteOrder('${order._id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Render Products (Desktop Table + Mobile Cards)
function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    const productsTable = document.querySelector('.products-table');
    if (!tbody) return;
    
    // Desktop table
    tbody.innerHTML = allProducts.map((p, index) => `
        <tr>
            <td><img src="${p.image}" alt="${p.name}" class="product-thumb" onerror="this.style.display='none'"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.tag ? `<span class="tag-badge tag-${p.tag}">${p.tag}</span>` : '-'}</td>
            <td>₹${p.price.toFixed(2)}</td>
            <td><span class="stock-badge ${p.stock < 20 ? 'low' : ''}">${p.stock}</span></td>
            <td>
                <button class="action-btn" onclick="editProduct(${index})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteProduct(${index})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    // Mobile cards - always recreate to ensure visibility
    if (productsTable) {
        // Remove old mobile cards if any
        let mobileCards = productsTable.querySelector('.mobile-cards');
        if (mobileCards) {
            mobileCards.remove();
        }
        
        // Create new mobile cards
        mobileCards = document.createElement('div');
        mobileCards.className = 'mobile-cards';
        mobileCards.style.display = 'flex';
        mobileCards.style.flexDirection = 'column';
        mobileCards.style.gap = '12px';
        mobileCards.style.padding = '10px';
        
        mobileCards.innerHTML = allProducts.map((p, index) => `
            <div class="product-card-admin" style="background: white; border-radius: 16px; padding: 14px; display: flex; gap: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <img src="${p.image}" alt="${p.name}" style="width: 70px; height: 70px; border-radius: 12px; object-fit: cover;" onerror="this.style.display='none'">
                <div style="flex: 1;">
                    <strong style="font-size: 14px; color: #2b2b2b; display: block; margin-bottom: 4px;">${p.name}</strong>
                    <p style="font-size: 13px; color: #c8a96a; font-weight: 600; margin-bottom: 8px;">₹${p.price.toFixed(2)}</p>
                    <span class="stock-badge ${p.stock < 20 ? 'low' : ''}" style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; background: ${p.stock < 20 ? '#fee' : '#f0f0f0'}; color: ${p.stock < 20 ? '#e74c3c' : '#666'};">${p.stock} in stock</span>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <button class="action-btn" data-index="${index}" style="padding: 8px 14px; border-radius: 20px; font-size: 12px; background: #c8a96a; color: #1a1a1a; font-weight: 600; flex: 1; justify-content: center; display: flex; align-items: center; gap: 5px; border: none; cursor: pointer;"><i class="fas fa-edit"></i> Edit</button>
                        <button class="action-btn delete" data-index="${index}" style="padding: 8px 14px; border-radius: 20px; font-size: 12px; background: #fee; color: #e74c3c; border: none; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        mobileCards.querySelectorAll('.action-btn:not(.delete)').forEach(btn => {
            btn.onclick = () => editProduct(parseInt(btn.dataset.index));
        });
        mobileCards.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.onclick = () => deleteProduct(parseInt(btn.dataset.index));
        });
        
        productsTable.appendChild(mobileCards);
    }
    
    console.log('Products rendered:', allProducts.length, 'Mobile cards created:', productsTable ? 'yes' : 'no');
}

// Show Add Product Form
function showAddProduct() {
    const formHtml = `
        <div class="product-form-modal">
            <h2>Add New Product</h2>
            <form onsubmit="addProduct(event)">
                <input type="text" id="prodName" placeholder="Product Name" required>
                <input type="number" id="prodPrice" placeholder="Price" step="0.01" required>
                <input type="number" id="prodOriginalPrice" placeholder="Original Price (optional)" step="0.01">
                <select id="prodCategory" required>
                    <option value="">Select Category</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                    <option value="shoes">Shoes</option>
                </select>
                <input type="text" id="prodImage" placeholder="Image URL" required>
                <input type="number" id="prodStock" placeholder="Stock Quantity" required>
                <input type="text" id="prodSizes" placeholder="Sizes (comma separated, e.g., S,M,L,XL)">
                <select id="prodTag">
                    <option value="">No Tag</option>
                    <option value="new">New</option>
                    <option value="sale">Sale</option>
                    <option value="hot">Hot</option>
                </select>
                <textarea id="prodDescription" placeholder="Product Description" rows="3"></textarea>
                <div class="form-buttons">
                    <button type="submit" class="save-btn">Add Product</button>
                    <button type="button" class="cancel-btn" onclick="closeProductForm()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `<div class="modal-content">${formHtml}</div>`;
    modal.onclick = (e) => { if (e.target === modal) closeProductForm(); };
    document.body.appendChild(modal);
}

// Close Product Form
function closeProductForm() {
    const modal = document.querySelector('.product-form-modal')?.closest('.modal');
    if (modal) modal.remove();
}

// Add Product
async function addProduct(event) {
    event.preventDefault();
    
    const productData = {
        name: document.getElementById('prodName').value,
        price: parseFloat(document.getElementById('prodPrice').value),
        originalPrice: document.getElementById('prodOriginalPrice').value ? parseFloat(document.getElementById('prodOriginalPrice').value) : null,
        category: document.getElementById('prodCategory').value,
        image: document.getElementById('prodImage').value,
        stock: parseInt(document.getElementById('prodStock').value),
        sizes: document.getElementById('prodSizes').value.split(',').map(s => s.trim()).filter(s => s),
        tag: document.getElementById('prodTag').value,
        description: document.getElementById('prodDescription').value
    };

    try {
        await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
    } catch (e) {
        productData._id = String(Date.now());
        allProducts.push(productData);
        localStorage.setItem('velvoraProducts', JSON.stringify(allProducts));
    }
    
    closeProductForm();
    loadProducts();
    loadStats();
    alert('Product added successfully!');
}

// Edit Product
async function editProduct(index) {
    const product = allProducts[index];
    if (!product) {
        alert('Product not found');
        return;
    }
    
    const productId = product._id;

    const formHtml = `
        <button type="button" class="modal-close" onclick="closeProductForm()" style="position:absolute;top:15px;right:20px;font-size:24px;cursor:pointer;background:none;border:none;">&times;</button>
        <div class="product-form-modal">
            <h2>Edit Product</h2>
            <form onsubmit="updateProduct(event, '${productId}')">
                <input type="text" id="prodName" placeholder="Product Name" value="${product.name}" required>
                <input type="number" id="prodPrice" placeholder="Price" step="0.01" value="${product.price}" required>
                <input type="number" id="prodOriginalPrice" placeholder="Original Price" step="0.01" value="${product.originalPrice || ''}">
                <select id="prodCategory" required>
                    <option value="men" ${product.category === 'men' ? 'selected' : ''}>Men</option>
                    <option value="women" ${product.category === 'women' ? 'selected' : ''}>Women</option>
                    <option value="kids" ${product.category === 'kids' ? 'selected' : ''}>Kids</option>
                    <option value="accessories" ${product.category === 'accessories' ? 'selected' : ''}>Accessories</option>
                    <option value="shoes" ${product.category === 'shoes' ? 'selected' : ''}>Shoes</option>
                </select>
                <input type="text" id="prodImage" placeholder="Image URL" value="${product.image}" required>
                <input type="number" id="prodStock" placeholder="Stock Quantity" value="${product.stock}" required>
                <input type="text" id="prodSizes" placeholder="Sizes" value="${(product.sizes || []).join(', ')}">
                <select id="prodTag">
                    <option value="" ${!product.tag ? 'selected' : ''}>No Tag</option>
                    <option value="new" ${product.tag === 'new' ? 'selected' : ''}>New</option>
                    <option value="sale" ${product.tag === 'sale' ? 'selected' : ''}>Sale</option>
                    <option value="hot" ${product.tag === 'hot' ? 'selected' : ''}>Hot</option>
                </select>
                <textarea id="prodDescription" placeholder="Description" rows="3">${product.description || ''}</textarea>
                <div class="form-buttons">
                    <button type="submit" class="save-btn">Update Product</button>
                    <button type="button" class="cancel-btn" onclick="closeProductForm()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'editProductModal';
    modal.innerHTML = `<div class="modal-content admin-modal" style="position:relative;">${formHtml}</div>`;
    modal.onclick = (e) => { if (e.target === modal) closeProductForm(); };
    document.body.appendChild(modal);
}

// Update Product
async function updateProduct(event, productId) {
    event.preventDefault();
    
    const productData = {
        name: document.getElementById('prodName').value,
        price: parseFloat(document.getElementById('prodPrice').value),
        originalPrice: document.getElementById('prodOriginalPrice').value ? parseFloat(document.getElementById('prodOriginalPrice').value) : null,
        category: document.getElementById('prodCategory').value,
        image: document.getElementById('prodImage').value,
        stock: parseInt(document.getElementById('prodStock').value),
        sizes: document.getElementById('prodSizes').value.split(',').map(s => s.trim()).filter(s => s),
        tag: document.getElementById('prodTag').value,
        description: document.getElementById('prodDescription').value
    };

    try {
        await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
    } catch (e) {
        const index = allProducts.findIndex(p => p._id === productId);
        if (index !== -1) {
            allProducts[index] = { ...allProducts[index], ...productData };
            localStorage.setItem('velvoraProducts', JSON.stringify(allProducts));
        }
    }

    closeProductForm();
    loadProducts();
    alert('Product updated successfully!');
}

// Delete Product
async function deleteProduct(index) {
    const product = allProducts[index];
    const productId = product._id;
    
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        await fetch(`${API_URL}/products/${productId}`, { method: 'DELETE' });
    } catch (e) {
        allProducts = allProducts.filter(p => p._id !== productId);
        localStorage.setItem('velvoraProducts', JSON.stringify(allProducts));
    }
    
    loadProducts();
    loadStats();
    alert('Product deleted successfully!');
}

// View Order Details
async function viewOrder(orderId) {
    const order = allOrders.find(o => o._id === orderId);
    if (!order) return;

    document.getElementById('orderDetails').innerHTML = `
        <div class="order-detail-header">
            <span>Order #${order.orderId}</span>
            <span class="status-badge ${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span>
        </div>
        <div class="order-detail-info">
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Customer:</strong> ${order.customerName || order.customer?.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${order.customerEmail || order.customer?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress?.phone || 'N/A'}</p>
            <p><strong>Address:</strong> ${order.shippingAddress?.address || 'N/A'}, ${order.shippingAddress?.city || ''}</p>
        </div>
        <div class="order-items-list">
            ${(order.items || []).map(item => `
                <div class="order-item-detail">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/50'">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity} × ₹${item.price}</p>
                        ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                    </div>
                    <span>₹${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-total-detail">
            <div><span>Subtotal:</span><span>₹${order.subtotal?.toFixed(2) || '0.00'}</span></div>
            <div><span>Tax:</span><span>₹${order.tax?.toFixed(2) || '0.00'}</span></div>
            <div><span>Shipping:</span><span>₹${order.shipping?.toFixed(2) || '0.00'}</span></div>
            <div class="total"><span>Total:</span><span>₹${order.total?.toFixed(2) || '0.00'}</span></div>
        </div>
    `;
    document.getElementById('orderModal').style.display = 'flex';
}

// Email notification functions (simulated)
function sendEmail(to, subject, body) {
    console.log('=== EMAIL SENT ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('==================');
    
    const emails = JSON.parse(localStorage.getItem('velvoraEmails')) || [];
    emails.push({
        to: to,
        subject: subject,
        body: body,
        sentAt: new Date().toISOString()
    });
    localStorage.setItem('velvoraEmails', JSON.stringify(emails));
    
    alert(`Email sent to ${to}`);
}

function sendShippingEmail(order) {
    const subject = `Order Shipped - ${order.orderId}`;
    const body = `Dear ${order.customerName || order.customer?.name},

Great news! Your order is on its way!

Order ID: ${order.orderId}
Tracking: Available in your account

Estimated delivery: 3-5 business days

Thank you for shopping with Velvora Luxury!`;
    
    sendEmail(order.customerEmail || order.customer?.email, subject, body);
}

function sendDeliveredEmail(order) {
    const subject = `Order Delivered - ${order.orderId}`;
    const body = `Dear ${order.customerName || order.customer?.name},

Your order has been delivered!

Order ID: ${order.orderId}

We hope you enjoy your purchase! Please take a moment to leave a review.

Thank you for shopping with Velvora Luxury!`;
    
    sendEmail(order.customerEmail || order.customer?.email, subject, body);
}

async function updateOrderStatus(orderId, status) {
    const order = allOrders.find(o => o._id === orderId || o.id === orderId);
    if (!order) return;
    
    const oldStatus = order.status;
    
    // Update in localStorage
    const index = allOrders.findIndex(o => o._id === orderId || o.id === orderId);
    if (index !== -1) {
        allOrders[index].status = status;
        localStorage.setItem('velvoraOrders', JSON.stringify(allOrders));
    }
    
    // Update in PostgreSQL database & send email
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, orderId: order.order_id || order.orderId })
        });
        const result = await response.json();
        
        if (result.success) {
            if (result.emailSent) {
                showNotification(`Order ${order.order_id || order.orderId} updated! Email sent to customer.`);
            } else {
                showNotification(`Order ${order.order_id || order.orderId} updated!`);
            }
        }
    } catch (e) {
        console.log('Database update failed, using localStorage');
        // Fallback to local email
        if (status === 'Shipped' && oldStatus !== 'Shipped') {
            sendShippingEmail(order);
        } else if (status === 'Delivered' && oldStatus !== 'Delivered') {
            sendDeliveredEmail(order);
        }
        showNotification('Order status updated (offline mode)');
    }
    
    loadOrders();
}

// Close Order Modal
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    allOrders = allOrders.filter(o => o._id !== orderId);
    localStorage.setItem('velvoraOrders', JSON.stringify(allOrders));
    loadOrders();
    loadStats();
    alert('Order deleted successfully!');
}

// Logout
async function logoutAdmin() {
    try {
        if (firebase && firebase.auth) {
            await firebase.auth().signOut();
        }
    } catch (e) {
        console.log('Firebase signout skipped');
    }
    
    localStorage.removeItem('velvoraAdminToken');
    localStorage.removeItem('velvoraAdminUser');
    localStorage.removeItem('velvoraUser');
    localStorage.removeItem('velvoraToken');
    localStorage.removeItem('firebaseUid');
    
    window.location.href = 'login.html';
}

function resetDemoData() {
    if (confirm('Reset all demo data to defaults? This will clear all your product changes.')) {
        localStorage.removeItem('velvoraProducts');
        allProducts = getStoredProducts();
        renderProducts();
        document.getElementById('totalProducts').textContent = allProducts.length;
        alert('Demo data has been reset!');
    }
}

// Navigation
function showAdminSection(section, event) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.admin-menu li').forEach(l => l.classList.remove('active'));
    
    document.getElementById(section).classList.add('active');
    if (event && event.target) {
        event.target.closest('li')?.classList.add('active');
    }
    
    const titles = { dashboard: 'Dashboard', orders: 'Orders', orderHistory: 'Order History', products: 'Products', customers: 'Customers', analytics: 'Analytics' };
    document.getElementById('pageTitle').textContent = titles[section];
    
    // Load customers when clicking customers tab
    if (section === 'customers') {
        loadCustomers();
    }
    
    // Load order history when clicking order history tab
    if (section === 'orderHistory') {
        renderOrderHistory();
    }
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.admin-sidebar').classList.remove('active');
    }
    
    // Update mobile nav active state
    updateMobileNavState(section);
}

// Mobile Nav Click Handler
function showMobileNav(section, event) {
    console.log('showMobileNav called:', section);
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    const sectionEl = document.getElementById(section);
    if (sectionEl) {
        sectionEl.classList.add('active');
        console.log('Section activated:', section, 'active:', sectionEl.classList.contains('active'));
    }
    
    const titles = { dashboard: 'Dashboard', orders: 'Orders', orderHistory: 'Order History', products: 'Products', customers: 'Customers', analytics: 'Analytics' };
    document.getElementById('pageTitle').textContent = titles[section];
    
    // Load order history when clicking order history tab
    if (section === 'orderHistory') {
        renderOrderHistory();
    }
    
    // Update mobile nav active state
    updateMobileNavState(section);
}

function updateMobileNavState(section) {
    document.querySelectorAll('.mobile-nav button').forEach(btn => btn.classList.remove('active'));
    const navButtons = {
        'dashboard': 0,
        'products': 1,
        'orders': 2,
        'orderHistory': 2,
        'analytics': 3
    };
    if (navButtons[section] !== undefined) {
        document.querySelectorAll('.mobile-nav button')[navButtons[section]]?.classList.add('active');
    }
}

// Toggle Sidebar
function toggleSidebar() {
    document.querySelector('.admin-sidebar').classList.toggle('active');
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    initAdmin();
}

// Set initial mobile nav state
document.addEventListener('DOMContentLoaded', () => {
    updateMobileNavState('dashboard');
    initImageUpload();
    initCharts();
});

// Image Upload with Cropper
function initImageUpload() {
    const dropArea = document.getElementById('dropArea');
    const imageInput = document.getElementById('imageInput');
    const cropperContainer = document.getElementById('cropperContainer');
    const cropperImage = document.getElementById('cropperImage');
    const cropBtn = document.getElementById('cropBtn');
    
    if (!dropArea || !imageInput) return;
    
    dropArea.addEventListener('click', () => imageInput.click());
    
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });
    
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length) handleImageSelect(files[0]);
    });
    
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleImageSelect(e.target.files[0]);
    });
    
    function handleImageSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            cropperImage.src = e.target.result;
            cropperContainer.style.display = 'block';
            cropBtn.style.display = 'inline-flex';
            dropArea.style.display = 'none';
            
            if (cropper) cropper.destroy();
            
            cropper = new Cropper(cropperImage, {
                aspectRatio: 1,
                viewMode: 1,
                background: false,
                autoCropArea: 1
            });
        };
        reader.readAsDataURL(file);
    }
}

function cropImage() {
    if (!cropper) return;
    
    const canvas = cropper.getCroppedCanvas({
        width: 800,
        height: 800,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });
    
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    
    // Set the cropped image to the input field
    const imageInput = document.getElementById('prodImage');
    if (imageInput) {
        imageInput.value = croppedImage;
    }
    
    closeImageModal();
}

function openImageUpload(callback) {
    currentImageCallback = callback;
    document.getElementById('imageUploadModal').classList.add('active');
}

function closeImageModal() {
    const modal = document.getElementById('imageUploadModal');
    modal.classList.remove('active');
    
    const dropArea = document.getElementById('dropArea');
    const cropperContainer = document.getElementById('cropperContainer');
    const cropBtn = document.getElementById('cropBtn');
    const imageInput = document.getElementById('imageInput');
    
    if (dropArea) dropArea.style.display = 'block';
    if (cropperContainer) cropperContainer.style.display = 'none';
    if (cropBtn) cropBtn.style.display = 'none';
    if (imageInput) imageInput.value = '';
    
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

// Initialize Charts
let revenueChart = null;
let ordersChart = null;

function initCharts() {
    // Get canvas elements
    const revenueCtx = document.getElementById('revenueChart');
    const ordersCtx = document.getElementById('ordersStatusChart');
    
    // Destroy existing charts if they exist using multiple methods for compatibility
    try {
        if (revenueCtx) {
            // Method 1: Chart.getChart() (Chart.js 3+)
            if (typeof Chart !== 'undefined' && Chart.getChart) {
                const existingRevenue = Chart.getChart(revenueCtx);
                if (existingRevenue) existingRevenue.destroy();
            }
            // Method 2: Check for chart property on the canvas
            if (revenueCtx.chart) {
                revenueCtx.chart.destroy();
            }
        }
        if (ordersCtx) {
            if (typeof Chart !== 'undefined' && Chart.getChart) {
                const existingOrders = Chart.getChart(ordersCtx);
                if (existingOrders) existingOrders.destroy();
            }
            if (ordersCtx.chart) {
                ordersCtx.chart.destroy();
            }
        }
    } catch (e) {
        console.log('Chart cleanup:', e);
    }
    
    // Clear chart variables
    revenueChart = null;
    ordersChart = null;
    
    // Try to initialize charts with error handling
    try {
    if (revenueCtx) {
        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [5000, 8000, 12000, 9000, 15000, 20000],
                    borderColor: '#c8a96a',
                    backgroundColor: 'rgba(200, 169, 106, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: '#c8a96a',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Orders Status Chart
    if (ordersCtx) {
        const statusCounts = {
            Pending: allOrders.filter(o => o.status === 'Pending').length,
            Processing: allOrders.filter(o => o.status === 'Processing').length,
            Shipped: allOrders.filter(o => o.status === 'Shipped').length,
            Delivered: allOrders.filter(o => o.status === 'Delivered').length
        };
        
        ordersChart = new Chart(ordersCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],
                datasets: [{
                    data: [statusCounts.Pending || 1, statusCounts.Processing || 0, statusCounts.Shipped || 0, statusCounts.Delivered || 0],
                    backgroundColor: ['#ffc107', '#0d6efd', '#6f42c1', '#198754'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 15, usePointStyle: true }
                    }
                },
                cutout: '65%'
            }
        });
    }
    
    // Top Products
    renderTopProducts();
    } catch (chartError) {
        console.log('Chart initialization skipped:', chartError);
    }
}

function renderTopProducts() {
    const container = document.getElementById('topProductsList');
    if (!container) return;
    
    if (allProducts.length === 0) {
        container.innerHTML = '<p class="no-data">No products yet</p>';
        return;
    }
    
    const topProducts = allProducts.slice(0, 5).map((p, index) => `
        <div class="top-product-item">
            <span class="rank">${index + 1}</span>
            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/40'">
            <div class="top-product-info">
                <strong>${p.name}</strong>
                <span>${p.stock} in stock</span>
            </div>
            <span class="price">₹${p.price.toFixed(2)}</span>
        </div>
    `).join('');
    
    container.innerHTML = topProducts;
}

// Animate Stats Counter
function animateValue(elementId, start, end, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        if (elementId.includes('Revenue')) {
            element.textContent = '₹' + Math.floor(current).toLocaleString();
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}
