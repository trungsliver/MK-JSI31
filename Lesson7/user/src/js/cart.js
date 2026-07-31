// Khởi tạo tham chiếu DOM các phần tử
const cartItemsList = document.getElementById("cartItemsList");
const subtotalPriceEl = document.getElementById("subtotalPrice");
const totalOrderPriceEl = document.getElementById("totalOrderPrice");
const checkoutForm = document.getElementById("checkoutForm");
const customerPhone = document.getElementById("customerPhone");
const customerAddress = document.getElementById("customerAddress");
const orderNotes = document.getElementById("orderNotes");
const dynamicPaymentFields = document.getElementById("dynamicPaymentFields");

// Form fields hỗ trợ thanh toán thẻ ngân hàng
const cardFields = document.getElementById("cardFields");
const codFields = document.getElementById("codFields");
const cardName = document.getElementById("cardName");
const cardNumber = document.getElementById("cardNumber");
const cardExpiry = document.getElementById("cardExpiry");
const cardCVV = document.getElementById("cardCVV");

let cart = [];

/* ==========================================================================
   1. ĐỌC DỮ LIỆU GIỎ HÀNG & HIỂN THỊ
   ========================================================================== */
function initCartPage() {
    // Đọc mảng sản phẩm từ bộ nhớ cục bộLocalStorage
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    renderCart();
    setupPaymentMethodEvents();
}

function renderCart() {
    if (!cartItemsList) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x text-muted display-3"></i>
                <p class="mt-3 text-muted fw-bold">Giỏ hàng của bạn đang trống!</p>
                <a href="index.html" class="btn btn-sm btn-outline-primary rounded-pill px-4 mt-2">Mua sắm ngay</a>
            </div>`;
        updateSummaryPrice(0);
        return;
    }

    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        // Đồng bộ logic tính toán giá của bạn
        const itemPrice = Number(item.price);
        const itemSubtotal = itemPrice * item.quantity;
        total += itemSubtotal;

        cartItemsList.innerHTML += `
        <div class="row align-items-center py-3 cart-item-row g-3">
            <div class="col-12 col-md-5 d-flex align-items-center">
                <div class="cart-img-wrapper me-3">
                    <img src="${item.image}" class="cart-img" alt="${item.name}" onerror="this.src='https://placehold.co/100x100?text=VPP'">
                </div>
                <div class="flex-grow-1">
                    <h6 class="cart-item-title mb-1" title="${item.name}">${item.name}</h6>
                    <span class="d-md-none text-muted small">Đơn giá: ${formatVND(itemPrice)}</span>
                </div>
            </div>

            <div class="col-4 col-md-3 text-start text-md-center d-none d-md-block">
                <span class="fw-semibold">${formatVND(itemPrice)}</span>
            </div>

            <div class="col-6 col-md-2 d-flex justify-content-start justify-content-md-center">
                <div class="quantity-control-group d-flex align-items-center">
                    <button class="quantity-btn" onclick="updateQty(${index}, -1)">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn" onclick="updateQty(${index}, 1)">+</button>
                </div>
            </div>

            <div class="col-6 col-md-2 d-flex align-items-center justify-content-end text-end position-relative">
                <div class="me-3 me-md-0 w-100">
                    <span class="text-accent fw-bold fs-6 d-block d-md-inline">${formatVND(itemSubtotal)}</span>
                </div>
                <button class="btn btn-delete-item p-1" onclick="deleteItem(${index})" title="Xóa khỏi giỏ hàng">
                    <i class="bi bi-trash3-fill fs-5"></i>
                </button>
            </div>
        </div>
        `;
    });

    updateSummaryPrice(total);
}

/* ==========================================================================
   2. HÀM TƯƠNG TÁC: SỬA SỐ LƯỢNG / XÓA SẢN PHẨM
   ========================================================================== */
window.updateQty = function(index, change) {
    if (index < 0 || index >= cart.length) return;
    
    cart[index].quantity += change;
    
    // Giới hạn số lượng tối thiểu bằng 1
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
        return;
    }
    
    // Lưu lại trạng thái mới vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

window.deleteItem = function(index) {
    if (index < 0 || index >= cart.length) return;
    
    const productName = cart[index].name;
    // Hiển thị cảnh báo xác nhận xóa đúng theo yêu cầu khách hàng
    const confirmDelete = confirm(`Bạn có chắc chắn muốn loại bỏ sản phẩm "${productName}" ra khỏi giỏ hàng không?`);
    
    if (confirmDelete) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        
        // Cập nhật số lượng Badge Header (Nếu có hàm viết sẵn bên h-f.js)
        if (typeof updateCartCount === "function") updateCartCount();
    }
};

function updateSummaryPrice(totalAmount) {
    const formatted = formatVND(totalAmount);
    if (subtotalPriceEl) subtotalPriceEl.innerText = formatted;
    if (totalOrderPriceEl) totalOrderPriceEl.innerText = formatted;
}

/* ==========================================================================
   3. LOGIC CHUYỂN ĐỔI PHƯƠNG THỨC THANH TOÁN (UI EVENTS)
   ========================================================================== */
function setupPaymentMethodEvents() {
    const options = document.querySelectorAll('.payment-method-option');
    options.forEach(opt => {
        opt.addEventListener('click', function() {
            options.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            togglePaymentFields(radio.value);
        });
    });
}

function togglePaymentFields(method) {
    if (method === "CARD") {
        cardFields.classList.remove("d-none");
        codFields.classList.add("d-none");
    } else {
        cardFields.classList.add("d-none");
        codFields.classList.remove("d-none");
    }
}

/* ==========================================================================
   4. THỰC HIỆN KIỂM TRA ĐIỀU KIỆN DỮ LIỆU (VALIDATION)
   ========================================================================== */
function validateOrderForm(paymentMethod) {
    let isValid = true;

    // 1. Validate Số điện thoại định dạng chuẩn Việt Nam (Các đầu số di động 10 số hiện nay)
    const phoneVal = customerPhone.value.trim();
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    
    if (!phoneRegex.test(phoneVal)) {
        customerPhone.classList.add("is-invalid");
        isValid = false;
    } else {
        customerPhone.classList.remove("is-invalid");
    }

    // 2. Validate Địa chỉ bắt buộc phải nhập
    if (customerAddress.value.trim() === "") {
        customerAddress.classList.add("is-invalid");
        isValid = false;
    } else {
        customerAddress.classList.remove("is-invalid");
    }

    // 3. Validate bổ sung nếu chọn hình thức Thẻ ngân hàng
    if (paymentMethod === "CARD") {
        if (cardName.value.trim() === "") { cardName.classList.add("is-invalid"); isValid = false; } 
        else { cardName.classList.remove("is-invalid"); }

        const cardNumVal = cardNumber.value.replace(/\s+/g, '');
        if (cardNumVal.length < 12 || cardNumVal.length > 19 || isNaN(cardNumVal)) { 
            cardNumber.classList.add("is-invalid"); isValid = false; 
        } else { cardNumber.classList.remove("is-invalid"); }

        if (!/^\d{2}\/\d{2}$/.test(cardExpiry.value.trim())) { 
            cardExpiry.classList.add("is-invalid"); isValid = false; 
        } else { cardExpiry.classList.remove("is-invalid"); }

        const cvvVal = cardCVV.value.trim();
        if (cvvVal.length < 3 || cvvVal.length > 4 || isNaN(cvvVal)) { 
            cardCVV.classList.add("is-invalid"); isValid = false; 
        } else { cardCVV.classList.remove("is-invalid"); }
    }

    return isValid;
}

/* ==========================================================================
   5. XỬ LÝ THANH TOÁN & GỬI ĐƠN HÀNG LÊN FIRESTORE ORDERS
   ========================================================================== */
checkoutForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    // Kiểm tra giỏ hàng rỗng
    if (cart.length === 0) {
        alert("Thất bại: Giỏ hàng của bạn chưa có sản phẩm nào để tiến hành đặt hàng.");
        return;
    }

    // Lấy phương thức thanh toán đang chọn
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Thực hiện xác thực biểu mẫu dữ liệu đầu vào
    if (!validateOrderForm(selectedMethod)) {
        alert("Thanh toán thất bại: Vui lòng kiểm tra và hoàn thiện chính xác các trường thông tin bắt buộc màu đỏ.");
        return;
    }

    // Kiểm tra trạng thái đăng nhập hệ thống của Firebase Auth để lấy email tài khoản đang kết nối
    let currentUserEmail = "Khách vãng lai (Chưa đăng nhập)";
    if (typeof auth !== "undefined" && auth.currentUser) {
        currentUserEmail = auth.currentUser.email;
    } else {
        // Tùy chọn dự phòng nếu bạn cấu hình bảo mật bắt buộc đăng nhập
        const checkAuth = firebase.auth().currentUser;
        if (checkAuth) {
            currentUserEmail = checkAuth.email;
        } else {
            alert("Thanh toán thất bại: Bạn phải đăng nhập hệ thống trước khi đặt hàng!");
            return;
        }
    }

    // Khóa nút để tránh trùng lặp lệnh submit liên tục
    const btnPlaceOrder = document.getElementById("btnPlaceOrder");
    btnPlaceOrder.disabled = true;
    btnPlaceOrder.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý đơn hàng...`;

    // Tính tổng tiền thanh toán cuối cùng
    const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    // Chuẩn hóa cấu hình dữ liệu lưu trữ theo đúng yêu cầu bài toán đề ra
    const orderData = {
        user: currentUserEmail,
        products: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
            image: item.image
        })),
        sđt: customerPhone.value.trim(),
        address: customerAddress.value.trim(),
        total: totalAmount,
        status: "Chưa xử lý", // Trạng thái mặc định
        notes: selectedMethod === "COD" ? orderNotes.value.trim() : "", // Ghi chú mặc định nếu trống
        paymentMethod: selectedMethod,
        "thời gian đặt hàng": firebase.firestore.FieldValue.serverTimestamp() // Thời gian từ Server Firebase
    };

    try {
        // Thực thi ghi dữ liệu đồng bộ vào Firestore `orders` (sử dụng đối tượng db từ firebase-config.js)
        await db.collection("orders").add(orderData);

        // Hiển thị thông báo thành công trực quan đến khách hàng
        alert("🎉 Đặt hàng thành công! Đơn hàng của bạn đã được lưu nhận trên hệ thống và đang chờ xét duyệt.");

        // Giải phóng bộ nhớ giỏ hàng sau khi thanh toán hoàn thành
        localStorage.removeItem("cart");
        cart = [];
        renderCart();
        checkoutForm.reset();
        
        if (typeof updateCartCount === "function") updateCartCount();

    } catch (error) {
        console.error("Lỗi khi đẩy đơn hàng lên Firestore: ", error);
        alert(`Thanh toán thất bại. Đã có lỗi xảy ra từ máy chủ: ${error.message}`);
    } finally {
        // Trả lại trạng thái hoạt động thông thường cho nút bấm
        btnPlaceOrder.disabled = false;
        btnPlaceOrder.innerHTML = `<i class="bi bi-shield-check me-2"></i> XÁC NHẬN ĐẶT HÀNG`;
    }
});

/* Khởi chạy hàm tiện ích định dạng tiền Việt */
function formatVND(amount) {
    return Number(amount).toLocaleString("vi-VN") + "₫";
}

// Lắng nghe realtime sự kiện thay đổi trạng thái đăng nhập nếu có cập nhật muộn
if (typeof auth !== "undefined") {
    auth.onAuthStateChanged(user => {
        if (user) console.log("Đã kết nối tài khoản khách hàng:", user.email);
    });
}

// Khởi chạy tiến trình khởi tạo trang khi cấu trúc DOM sẵn sàng
initCartPage();