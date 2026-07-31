const productsContainer = document.getElementById("productsContainer");
const newProductsContainer = document.getElementById("newProductsContainer");
const bestSellersContainer = document.getElementById("bestSellersContainer");
const defaultProductSections = document.getElementById("defaultProductSections");
const searchResultsSection = document.getElementById("searchResultsSection");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const applyFilter = document.getElementById("applyFilter");
const loadingBox = document.getElementById("loadingBox");

let allProducts = [];

/* ==========================================================================
   FIRESTORE DATA FETCH
   ========================================================================== */
async function loadProducts() {
    try {
        // Gọi đối tượng db đã được khởi tạo từ file firebase-config.js
        const snapshot = await db.collection("products").get();
        allProducts = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            allProducts.push({
                id: doc.id,
                ...data
            });
        });

        // Phân phối và render sản phẩm ban đầu
        dispatchInitialSections(allProducts);

    } catch (error) {
        console.error("Lỗi lấy dữ liệu Firestore: ", error);
        const errorHTML = `
            <div class="col-12 text-center text-danger py-4">
                <i class="bi bi-exclamation-triangle-fill fs-1"></i>
                <p class="mt-2">Không thể tải danh sách sản phẩm. Vui lòng kiểm tra lại kết nối!</p>
            </div>`;
        if(newProductsContainer) newProductsContainer.innerHTML = errorHTML;
    }
    loadingBox.style.display = "none";
}

/* ==========================================================================
   PHÂN PHỐI SẢN PHẨM VÀO DANH MỤC BAN ĐẦU
   ========================================================================== */
function dispatchInitialSections(products) {
    if (products.length === 0) return;

    // Giả lập chia danh mục thông minh dựa trên cấu trúc Firestore của bạn:
    // - Lấy 4 item đầu làm "Sản phẩm mới"
    // - Lấy các item còn lại (hoặc tối đa 4) làm "Sản phẩm bán chạy"
    const newItems = products.slice(0, 4);
    const bestSellerItems = products.slice(4, 8).length > 0 ? products.slice(4, 8) : products.slice(0, 4);

    renderProductGrid(newItems, newProductsContainer);
    renderProductGrid(bestSellerItems, bestSellersContainer);
}

/* ==========================================================================
   XUẤT CARD SẢN PHẨM RA MÀN HÌNH (Ràng buộc chặt chẽ UI & Data)
   ========================================================================== */
function renderProductGrid(products, targetContainer) {
    targetContainer.innerHTML = "";

    if (products.length === 0) {
        targetContainer.innerHTML = `
            <div class="col-12 text-center text-muted py-4">
                Không tìm thấy sản phẩm nào phù hợp.
            </div>`;
        return;
    }

    products.forEach(product => {
        // Tạo các chỉ số ngẫu nhiên sáng tạo theo logic có sẵn của bạn
        const discount = randomNumber(5, 25);
        const sold = randomNumber(20, 1500);
        const oldPrice = Number(product.price);
        const newPrice = Math.round(oldPrice * (100 - discount) / 100);

        targetContainer.innerHTML += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card product-card">
                <div class="discount-tag">-${discount}%</div>
                
                <div class="product-image-wrapper">
                    <img src="${product.image}" class="product-image" alt="${product.name}" onerror="this.src='https://placehold.co/300x300?text=Van+Phong+Pham'">
                </div>

                <div class="product-body">
                    <div class="product-name" title="${product.name}">
                        ${product.name}
                    </div>

                    <div class="product-desc" title="${product.description}">
                        ${shortText(product.description)}
                    </div>

                    <div class="price-box">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="old-price">${formatPrice(oldPrice)}</span>
                            <span class="sold">Đã bán ${sold}</span>
                        </div>
                        <div class="new-price">${formatPrice(newPrice)}</div>
                    </div>

                    <button class="btn buy-btn" onclick="addToCart('${product.id}')">
                        <i class="bi bi-cart-plus-fill me-2"></i> Mua hàng
                    </button>
                </div>
            </div>
        </div>
        `;
    });
}

/* ==========================================================================
   BỘ LỌC TÌM KIẾM ĐA NĂNG
   ========================================================================== */
function filterProducts() {
    let result = [...allProducts];

    const keyword = searchInput.value.trim().toLowerCase();

    // Nếu người dùng thực hiện lọc/tìm kiếm dữ liệu
    if (keyword || minPrice.value || maxPrice.value || sortSelect.value) {
        defaultProductSections.classList.add("d-none");
        searchResultsSection.classList.remove("d-none");

        if (keyword) {
            result = result.filter(item => item.name.toLowerCase().includes(keyword));
        }

        const min = Number(minPrice.value) || 0;
        const max = Number(maxPrice.value) || Infinity;

        result = result.filter(item => item.price >= min && item.price <= max);

        if (sortSelect.value === "asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortSelect.value === "desc") {
            result.sort((a, b) => b.price - a.price);
        }

        renderProductGrid(result, productsContainer);
    } else {
        // Trở về trạng thái phân danh mục ban đầu khi xóa trắng bộ lọc
        defaultProductSections.classList.remove("d-none");
        searchResultsSection.classList.add("d-none");
    }
}

// Xóa nhanh bộ lọc tìm kiếm
window.clearSearchFilters = function() {
    searchInput.value = "";
    minPrice.value = "";
    maxPrice.value = "";
    sortSelect.value = "";
    filterProducts();
}

// Lắng nghe sự kiện người dùng tương tác
searchInput.addEventListener("input", filterProducts);
sortSelect.addEventListener("change", filterProducts);
applyFilter.addEventListener("click", filterProducts);

/* ==========================================================================
   GIỎ HÀNG THÊM VÀO LOCALSTORAGE
   ========================================================================== */
function addToCart(id) {
    const product = allProducts.find(item => item.id === id);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = cart.find(item => item.id === id);

    if (exist) {
        exist.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            description: product.description,
            price: product.price,
            stock: product.stock,
            quantity: 1,
            addedAt: Date.now()
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Gọi hàm cập nhật số lượng badge giỏ hàng trên Header nếu có thiết kế sẵn
    if(typeof updateCartCount === "function"){
        updateCartCount();
    }

    alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
}

/* ==========================================================================
   TIỆN ÍCH TRỢ GIÚP (UTILS)
   ========================================================================== */
function formatPrice(price) {
    return Number(price).toLocaleString("vi-VN") + "₫";
}

function shortText(text) {
    if (!text) return "";
    return text.length > 90 ? text.slice(0, 90) + "..." : text;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Khởi động tiến trình lấy thông tin */
loadProducts();

/* Đăng ký toàn cục để các hàm hoạt động trực tiếp khi gọi từ HTML onclick */
window.addToCart = addToCart;