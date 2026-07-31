// // 🔥 Firebase config (giống file app.js)


// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// const orderList = document.getElementById("orderList");

// // =======================
// // 📦 LOAD ORDERS
// // =======================
// async function loadOrders() {
//   orderList.innerHTML = "";

//   const snapshot = await db.collection("orders").get();

//   snapshot.forEach(doc => {
//     const o = doc.data();

//     const tr = document.createElement("tr");

//     tr.innerHTML = `
//       <td>${doc.id}</td>
//       <td>${o.user}</td>
//       <td>${o.sđt}</td>
//       <td>${o.total.toLocaleString("vi-VN")}đ</td>
//       <td>
//         <select class="status">
//           <option ${o.status === "pending" ? "selected" : ""}>pending</option>
//           <option ${o.status === "shipping" ? "selected" : ""}>shipping</option>
//           <option ${o.status === "done" ? "selected" : ""}>done</option>
//         </select>
//       </td>
//       <td>
//         <button class="update-btn">💾 Cập nhật</button>
//         <button class="delete-btn">🗑️ Xóa</button>
//       </td>
//     `;

//     // UPDATE STATUS
//     tr.querySelector(".update-btn").addEventListener("click", async () => {
//       const newStatus = tr.querySelector(".status").value;

//       await db.collection("orders").doc(doc.id).update({
//         status: newStatus
//       });

//       alert("✅ Cập nhật trạng thái thành công!");
//     });

//     // DELETE ORDER
//     tr.querySelector(".delete-btn").addEventListener("click", async () => {
//       const confirmDelete = confirm("Bạn có chắc muốn xóa đơn?");
//       if (!confirmDelete) return;

//       await db.collection("orders").doc(doc.id).delete();

//       alert("Đã xóa!");
//       loadOrders();
//     });

//     orderList.appendChild(tr);
//   });
// }

// // =======================
// // 🚀 INIT
// // =======================
// loadOrders();

const ordersContainer =
document.getElementById(
    "ordersContainer"
);

const loadingBox =
document.getElementById(
    "loadingBox"
);

let allOrders = [];

const normalizeStatus = (status) =>
    (status || "")
        .toString()
        .trim()
        .toLowerCase();

/* ======================
   LOAD ORDERS
====================== */

async function loadOrders(){

    loadingBox.style.display = "block";
    ordersContainer.innerHTML = "";

    try{

        const snapshot =
        await db.collection("orders")
        .get();

        allOrders = [];

        snapshot.forEach(doc=>{

            allOrders.push({
                id:doc.id,
                ...doc.data()
            });

        });

        updateStats();

        renderOrders(allOrders);

    }
    catch(error){

        console.error(error);

        ordersContainer.innerHTML = `
            <div class="alert alert-danger">
                Không thể tải đơn hàng
            </div>
        `;
    }

    loadingBox.style.display = "none";

}

/* ======================
   RENDER
====================== */

function renderOrders(orders){

    ordersContainer.innerHTML = "";

    if(orders.length === 0){

        ordersContainer.innerHTML = `
            <div class="alert alert-warning">
                Không tìm thấy đơn hàng
            </div>
        `;

        return;
    }

    orders.forEach(order=>{

        const productsHTML =
        (order.products || [])
        .map(product => `

            <div class="product-item">

                <img
                    src="${product.image}"
                    alt="${product.name}">

                <div class="product-info">

                    <div class="product-name">
                        ${product.name}
                    </div>

                    <div>
                        Giá:
                        ${formatPrice(product.price)}
                    </div>

                    <div>
                        Số lượng:
                        ${product.quantity}
                    </div>

                </div>

            </div>

        `).join("");

        ordersContainer.innerHTML += `

        <div class="order-card">

            <div class="order-header">

                <div>

                    <div class="order-id">
                        #${order.id}
                    </div>

                    <div class="order-user">
                        ${order.user || ""}
                    </div>

                </div>

                <select
                    class="form-select order-status ${getStatusClass(order.status)}"
                    onchange="updateStatus(
                        '${order.id}',
                        this.value
                    )">

                    ${statusOptions(
                        order.status
                    )}

                </select>

            </div>

            <div class="order-body">

                <div class="product-list">
                    ${productsHTML}
                </div>

                <div class="order-info">

                    <div class="info-box">
                        <span>SĐT</span>
                        ${order.sdt || ""}
                    </div>

                    <div class="info-box">
                        <span>Địa chỉ</span>
                        ${order.address || ""}
                    </div>

                    <div class="info-box">
                        <span>Thanh toán</span>
                        ${order.paymentMethod || ""}
                    </div>

                    <div class="info-box">
                        <span>Ghi chú</span>
                        ${order.notes || "Không có"}
                    </div>

                    <div class="info-box">
                        <span>Tổng tiền</span>
                        ${formatPrice(order.total)}
                    </div>

                    <div class="info-box">
                        <span>Thời gian</span>
                        ${formatDate(
                            order["thời gian đặt hàng"]
                        )}
                    </div>

                </div>

                <div class="order-actions">

                    <button
                        class="btn btn-danger"
                        onclick="deleteOrder('${order.id}')">

                        <i class="bi bi-trash"></i>
                        Xóa đơn hàng

                    </button>

                </div>

            </div>

        </div>

        `;
    });

}

/* ======================
   UPDATE STATUS
====================== */

async function updateStatus(
    orderId,
    status
){

    try{

        await db
        .collection("orders")
        .doc(orderId)
        .update({
            status:status
        });

        alert(
            "Cập nhật thành công"
        );

        loadOrders();

    }
    catch(error){

        console.error(error);

        alert(
            "Lỗi cập nhật trạng thái"
        );
    }

}

window.updateStatus =
updateStatus;

/* ======================
   DELETE
====================== */

async function deleteOrder(
    orderId
){

    const confirmDelete =
    confirm(
        "Xóa đơn hàng này?"
    );

    if(!confirmDelete){
        return;
    }

    try{

        await db
        .collection("orders")
        .doc(orderId)
        .delete();

        loadOrders();

    }
    catch(error){

        console.error(error);

        alert(
            "Không thể xóa"
        );
    }

}

window.deleteOrder =
deleteOrder;

/* ======================
   SEARCH
====================== */

document
.getElementById("searchInput")
.addEventListener(
"input",
filterOrders
);

document
.getElementById("statusFilter")
.addEventListener(
"change",
filterOrders
);

function filterOrders(){

    const keyword =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const status =
    document
    .getElementById("statusFilter")
    .value;

    const filtered =
    allOrders.filter(order=>{

        const matchKeyword =

            (order.user || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (order.sdt || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (order.email || "")
            .toLowerCase()
            .includes(keyword)

            ||

            order.id
            .toLowerCase()
            .includes(keyword);

        const matchStatus =

            !status ||

            normalizeStatus(order.status) === normalizeStatus(status);

        return (
            matchKeyword &&
            matchStatus
        );

    });

    renderOrders(filtered);

}

/* ======================
   STATS
====================== */

function updateStats(){

    document
    .getElementById(
        "totalOrders"
    ).textContent =
    allOrders.length;

    const pending =
    allOrders.filter(
        item =>
        normalizeStatus(
            item.status
        ) ===
        "pending"
    ).length;

    document
    .getElementById(
        "pendingOrders"
    ).textContent =
    pending;

}

/* ======================
   HELPERS
====================== */

function statusOptions(
    current
){

    const statuses = [

        "Pending",
        "Confirmed",
        "Shipping",
        "Done",
        "Return",
        "Cancel"

    ];

    return statuses.map(status=>`

        <option
            value="${status}"
            ${current===status ? "selected" : ""}>

            ${status}

        </option>

    `).join("");

}

function getStatusClass(
    status
){

    return (
        "status-" +
        normalizeStatus(status)
    );

}

function formatPrice(price){

    return Number(
        price || 0
    ).toLocaleString(
        "vi-VN"
    ) + "₫";

}

function formatDate(timestamp){

    if(!timestamp){
        return "";
    }

    try{

        return timestamp
        .toDate()
        .toLocaleString(
            "vi-VN"
        );

    }
    catch{

        return "";
    }

}

document
.getElementById(
    "refreshBtn"
)
.addEventListener(
    "click",
    loadOrders
);

document
.getElementById(
    "clearFilterBtn"
)
.addEventListener(
    "click",
    () => {
        document.getElementById("searchInput").value = "";
        document.getElementById("statusFilter").value = "";
        renderOrders(allOrders);
    }
);

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".admin-header ul");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
}

loadOrders();