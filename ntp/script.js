// Product Management
let currentProduct = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Clear any existing products for a fresh start
    localStorage.removeItem('smstoreProducts');
    loadProducts();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    const form = document.getElementById('addProductForm');
    form.addEventListener('submit', handleAddProduct);
}

// Initialize demo products on first load
function initializeDemoProducts() {
    // Removed - Fresh start with no demo products
}

// Toggle Add Product Modal
function toggleAddProductForm() {
    const modal = document.getElementById('addProductModal');
    modal.classList.toggle('show');
    if (!modal.classList.contains('show')) {
        document.getElementById('addProductForm').reset();
    }
}

// Handle Add Product
function handleAddProduct(e) {
    e.preventDefault();

    const formData = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        color: document.getElementById('productColor').value,
        size: document.getElementById('productSize').value,
        quantity: parseInt(document.getElementById('productQuantity').value),
        image: null
    };

    // Handle Image Upload
    const fileInput = document.getElementById('productImage');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            formData.image = e.target.result;
            saveProduct(formData);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveProduct(formData);
    }
}

// Save Product to LocalStorage
function saveProduct(product) {
    const products = JSON.parse(localStorage.getItem('smstoreProducts')) || [];
    products.push(product);
    localStorage.setItem('smstoreProducts', JSON.stringify(products));
    
    // Show success message
    showSuccessMessage('تم إضافة المنتج بنجاح! ✓');
    
    // Clear form and close modal
    document.getElementById('addProductForm').reset();
    toggleAddProductForm();
    
    // Reload products
    loadProducts();
}

// Load Products from LocalStorage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('smstoreProducts')) || [];
    const grid = document.getElementById('productsGrid');
    
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1;">
                <div class="empty-state">
                    <h3>لا توجد منتجات حالياً</h3>
                    <p>اضغط على زر "إضافة منتج" لإضافة منتجات جديدة إلى متجرك</p>
                </div>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageUrl = product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23f8f9fa;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23e8eaed;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="250" height="250"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%237f8c8d" font-size="16" font-family="Arial" font-weight="bold"%3E📦 صورة المنتج%3C/text%3E%3C/svg%3E';

    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-image">
        <div class="product-details">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-specs-mini">
                ${product.color ? `<span class="spec-badge">🎨 ${product.color}</span>` : ''}
                ${product.size ? `<span class="spec-badge">📏 ${product.size}</span>` : ''}
                ${product.quantity > 0 ? `<span class="spec-badge" style="background: linear-gradient(135deg, #25D366, #20c55e); color: white;">✓ ${product.quantity} متوفر</span>` : '<span class="spec-badge" style="background: #ff4757; color: white;">✗ غير متوفر</span>'}
            </div>
            <div class="product-price">${product.price.toFixed(2)} دج</div>
            <div class="product-actions">
                <button class="view-btn" onclick="openProductModal(${product.id})">عرض التفاصيل</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">حذف</button>
            </div>
        </div>
    `;

    return card;
}

// Open Product Modal
function openProductModal(productId) {
    const products = JSON.parse(localStorage.getItem('smstoreProducts')) || [];
    const product = products.find(p => p.id === productId);

    if (!product) return;

    currentProduct = product;

    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductPrice').textContent = product.price.toFixed(2);
    document.getElementById('modalProductColor').textContent = product.color || 'غير محدد';
    document.getElementById('modalProductSize').textContent = product.size || 'غير محدد';
    document.getElementById('modalProductQuantity').textContent = product.quantity + ' قطع';

    const imageUrl = product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f8f9fa" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%237f8c8d" font-size="20" font-family="Arial"%3E📦 صورة المنتج%3C/text%3E%3C/svg%3E';
    document.getElementById('modalProductImage').src = imageUrl;

    const quantityInput = document.getElementById('orderQuantity');
    quantityInput.max = product.quantity;
    quantityInput.value = 1;

    const modal = document.getElementById('productModal');
    modal.classList.add('show');
}

// Close Product Modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    currentProduct = null;
}

// Delete Product
function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const products = JSON.parse(localStorage.getItem('smstoreProducts')) || [];
        const filtered = products.filter(p => p.id !== productId);
        localStorage.setItem('smstoreProducts', JSON.stringify(filtered));
        showSuccessMessage('تم حذف المنتج بنجاح! ✓');
        loadProducts();
    }
}

// Order via WhatsApp
function orderViaWhatsApp() {
    if (!currentProduct) return;

    const quantity = parseInt(document.getElementById('orderQuantity').value);
    
    if (quantity > currentProduct.quantity) {
        alert('الكمية المطلوبة أكثر من المتاح!');
        return;
    }

    const totalPrice = (currentProduct.price * quantity).toFixed(2);

    // Create WhatsApp message with better formatting
    const message = `
🛍️ *طلب جديد من SM.store*

📦 *المنتج:* ${currentProduct.name}
💬 *الوصف:* ${currentProduct.description}
💰 *السعر الواحد:* ${currentProduct.price} دج
${currentProduct.color ? `🎨 *اللون:* ${currentProduct.color}` : ''}
${currentProduct.size ? `📏 *الحجم:* ${currentProduct.size}` : ''}
🔢 *الكمية:* ${quantity}
💵 *المجموع:* ${totalPrice} دج

━━━━━━━━━━━━━━━━━━
👤 *أكمل البيانات التالية:*
━━━━━━━━━━━━━━━━━━
👤 الاسم:
🏠 العنوان:
📱 رقم الهاتف:

شكراً لثقتك بـ SM.store ✨
`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/212728958504?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    closeProductModal();
    showSuccessMessage('تم فتح WhatsApp - أكمل البيانات الخاصة بك 📱');
}

// Show Success Message
function showSuccessMessage(message) {
    const msg = document.createElement('div');
    msg.className = 'success-message';
    msg.textContent = message;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 3500);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('addProductModal');
    const productModal = document.getElementById('productModal');
    
    if (event.target === modal) {
        modal.classList.remove('show');
    }
    if (event.target === productModal) {
        closeProductModal();
    }
});
