const ordersContainer =
document.getElementById("ordersContainer");

const loadingBox =
document.getElementById("loadingBox");

const emptyBox =
document.getElementById("emptyBox");

const orderCount =
document.getElementById("orderCount");

/* ==========================
   AUTH CHECK
========================== */

firebase.auth().onAuthStateChanged(
async(user)=>{

    if(!user){

        loadingBox.style.display = "none";

        emptyBox.classList.remove("d-none");

        emptyBox.innerHTML = `
            <i class="bi bi-person-x"></i>
            <h4>Chưa đăng nhập</h4>
            <p>Vui lòng đăng nhập để xem đơn hàng.</p>
        `;

        return;
    }

    await loadOrders(user.email);

});

/* ==========================
   LOAD ORDERS
========================== */

async function loadOrders(userEmail){

    try{

        const snapshot =
        await db.collection("orders")
        .where("user","==",userEmail)
        .get();

        loadingBox.style.display = "none";

        if(snapshot.empty){

            emptyBox.classList.remove("d-none");
            return;
        }

        let orders = [];

        snapshot.forEach(doc=>{

            orders.push({
                id:doc.id,
                ...doc.data()
            });

        });

        orders.sort((a,b)=>{

            const timeA =
            a["thời gian đặt hàng"]?.seconds || 0;

            const timeB =
            b["thời gian đặt hàng"]?.seconds || 0;

            return timeB - timeA;
        });

        orderCount.textContent =
        `${orders.length} đơn hàng`;

        renderOrders(orders);

    }
    catch(error){

        console.error(error);

        loadingBox.style.display = "none";

        emptyBox.classList.remove("d-none");

        emptyBox.innerHTML = `
            <i class="bi bi-exclamation-circle"></i>
            <h4>Lỗi tải dữ liệu</h4>
        `;
    }

}

/* ==========================
   RENDER
========================== */

function renderOrders(orders){

    ordersContainer.innerHTML = "";

    orders.forEach(order=>{

        const productsHtml =
        order.products.map(product=>{

            return `
            <div class="product-item">

                <img
                    src="${product.image}"
                    class="product-image">

                <div class="product-info">

                    <div class="product-name">
                        ${product.name}
                    </div>

                    <div class="product-price">
                        ${formatPrice(product.price)}
                    </div>

                    <div class="product-qty">
                        Số lượng:
                        ${product.quantity}
                    </div>

                </div>

            </div>
            `;

        }).join("");

        ordersContainer.innerHTML += `
        <div class="order-card">

            <div class="order-header">

                <div>

                    <div class="order-id">
                        Mã đơn hàng: ${order.id}
                    </div>

                    <div class="order-date">
                        ${formatDate(
                            order["thời gian đặt hàng"]
                        )}
                    </div>

                </div>

                <div class="
                order-status
                ${getStatusClass(order.status)}
                ">
                    ${order.status}
                </div>

            </div>

            <div class="order-body">
                ${productsHtml}
            </div>

            <div class="order-footer">

                <div class="order-detail">

                    <div class="detail-box">
                        <span>Người nhận</span>
                        ${order.user}
                    </div>

                    <div class="detail-box">
                        <span>Số điện thoại</span>
                        ${order.sđt}
                    </div>

                    <div class="detail-box">
                        <span>Địa chỉ</span>
                        ${order.address}
                    </div>

                    <div class="detail-box">
                        <span>Thanh toán</span>
                        ${order.paymentMethod}
                    </div>

                    <div class="detail-box">
                        <span>Ghi chú</span>
                        ${order.notes || "Không có"}
                    </div>

                    <div class="detail-box">
                        <span>Tổng tiền</span>
                        <strong>
                            ${formatPrice(order.total)}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
        `;
    });

}

/* ==========================
   STATUS
========================== */

function getStatusClass(status){

    status =
    (status || "").toLowerCase();

    if(
        status.includes("xử lý")
    ){
        return "status-pending";
    }

    if(
        status.includes("hoàn")
    ){
        return "status-completed";
    }

    if(
        status.includes("hủy")
    ){
        return "status-cancel";
    }

    return "status-pending";
}

/* ==========================
   FORMAT
========================== */

function formatPrice(price){

    return Number(price)
    .toLocaleString("vi-VN")
    + "₫";
}

function formatDate(timestamp){

    if(!timestamp) return "";

    const date =
    timestamp.toDate();

    return date.toLocaleString(
        "vi-VN"
    );
}