// ======================================================
// Firebase Import
// ======================================================
// File firebase-config.js
import { firebaseConfig } from "./firebase-config.js";
// Thư viện Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Initialize Firebase
// ======================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const productRef = collection(db, "products");

// ======================================================
// Login Check
// ======================================================

if (localStorage.getItem("adminLogin") !== "true") {

    alert("Please login first!");

    window.location.href = "index.html";

}

let products = [];

// ======================================================
// DOM
// ======================================================

const productList = document.getElementById("productList");

const loading = document.getElementById("loading");

const totalProducts = document.getElementById("totalProducts");

const lowStockProducts = document.getElementById("lowStockProducts");

const inventoryValue = document.getElementById("inventoryValue");

const saveBtn = document.getElementById("saveBtn");

//==========================
// Form
//==========================

const txtId = document.getElementById("productId");

const txtName = document.getElementById("name");

const txtImage = document.getElementById("image");

const txtPrice = document.getElementById("price");

const txtDiscount = document.getElementById("discount");

const txtDescription = document.getElementById("description");

const txtDistributor = document.getElementById("distributor");

const txtAmount = document.getElementById("amount");

//==========================

let deleteId = null;

let editId = null;

// ======================================================
// Toast
// ======================================================

function showToast(message) {

    document.getElementById("toastMessage").innerHTML = message;

    const toast = bootstrap.Toast.getOrCreateInstance(
        document.getElementById("liveToast")
    );

    toast.show();

}

// ======================================================
// Currency
// ======================================================

function formatMoney(value) {

    return Number(value).toLocaleString("vi-VN") + " ₫";

}

// ======================================================
// Render Product Card
// ======================================================

function renderProduct(id, product) {

    const finalPrice =
        product.price -
        (product.price * product.discount) / 100;

    return `

<div class="col-12">

<div class="product-card horizontal-card">

<img
class="product-image"
src="${product.image}"
alt="${product.name}">

<div class="product-body">

<h5 class="product-name">

${product.name}

</h5>

<div class="mb-2">

<span class="price">

${formatMoney(finalPrice)}

</span>

${product.discount > 0
            ?
            `<span class="old-price">

${formatMoney(product.price)}

</span>`
            :
            ""
        }

</div>

${product.discount > 0
            ?
            `<span class="discount">

-${product.discount}%

</span>`
            :
            ""
        }

<p class="product-description">

${product.description}

</p>

<p class="shop">

<b>Distributor:</b>

${product.distributor}

</p>

<p class="stock ${product.amount <= 10 ? "low" : "good"}">

Stock: ${product.amount}

</p>

<div class="card-footer-admin">

<button
class="btn btn-edit"
onclick="editProduct('${id}')">

<i class="bi bi-pencil"></i>

Edit

</button>

<button
class="btn btn-delete"
onclick="showDelete('${id}')">

<i class="bi bi-trash"></i>

Delete

</button>

</div>

</div>

</div>

</div>

`;

}

// ======================================================
// Load Products
// ======================================================

async function loadProducts() {

    loading.style.display = "block";

    productList.innerHTML = "";

    let total = 0;

    let low = 0;

    let inventory = 0;

    const q = query(
        productRef,
        orderBy("name")
    );

    const snapshot = await getDocs(q);

    // Xóa dữ liệu cũ
    products = [];

    snapshot.forEach(doc => {

        const product = {

            id: doc.id,

            ...doc.data()

        };

        // Lưu vào mảng
        products.push(product);

        // Thống kê
        total++;

        if (Number(product.amount) <= 10) {

            low++;

        }

        inventory += Number(product.price) * Number(product.amount);

    });

    // Hiển thị toàn bộ sản phẩm
    renderProducts(products);


    totalProducts.innerHTML = total;

    lowStockProducts.innerHTML = low;

    inventoryValue.innerHTML =
        formatMoney(inventory);

    loading.style.display = "none";

}

// ======================================================
// Clear Form
// ======================================================

function clearForm() {

    txtId.value = "";

    txtName.value = "";

    txtImage.value = "";

    txtPrice.value = "";

    txtDiscount.value = 0;

    txtDescription.value = "";

    txtDistributor.value = "";

    txtAmount.value = "";

}

// ======================================================
// Save Product (Add / Update)
// ======================================================

saveBtn.addEventListener("click", async () => {

    const product = {

        name: txtName.value.trim(),

        image: txtImage.value.trim(),

        price: Number(txtPrice.value),

        discount: Number(txtDiscount.value) || 0,

        description: txtDescription.value.trim(),

        distributor: txtDistributor.value.trim(),

        amount: Number(txtAmount.value)

    };

    // Validate

    if (product.name === "") {

        alert("Please enter product name.");

        txtName.focus();

        return;

    }

    if (product.image === "") {

        alert("Please enter image.");

        txtImage.focus();

        return;

    }

    if (product.price <= 0 || isNaN(product.price)) {

        alert("Invalid price.");

        txtPrice.focus();

        return;

    }

    if (product.amount < 0 || isNaN(product.amount)) {

        alert("Invalid quantity.");

        txtAmount.focus();

        return;

    }

    try {

        if (editId == null) {

            await addDoc(productRef, product);

            showToast("Add product successfully.");

        } else {

            const productDoc = doc(db, "products", editId);

            await updateDoc(productDoc, product);

            showToast("Update product successfully.");

        }

        bootstrap.Modal
            .getInstance(document.getElementById("productModal"))
            .hide();

        clearForm();

        editId = null;

        loadProducts();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

});

// ======================================================
// Edit Product
// ======================================================

window.editProduct = async function (id) {

    try {

        editId = id;

        document.getElementById("modalTitle").innerHTML = "Edit Product";

        const productDoc = doc(db, "products", id);

        const snapshot = await getDoc(productDoc);

        if (!snapshot.exists()) {

            alert("Product not found.");

            return;

        }

        const p = snapshot.data();

        txtId.value = id;

        txtName.value = p.name;

        txtImage.value = p.image;

        txtPrice.value = p.price;

        txtDiscount.value = p.discount;

        txtDescription.value = p.description;

        txtDistributor.value = p.distributor;

        txtAmount.value = p.amount;

        new bootstrap.Modal(
            document.getElementById("productModal")
        ).show();

    }

    catch (error) {

        console.error(error);

    }

};

// ======================================================
// Open Add Modal
// ======================================================

document.querySelector(".btn-add").addEventListener("click", () => {

    editId = null;

    clearForm();

    document.getElementById("modalTitle").innerHTML = "Add Product";

});

// ======================================================
// Delete
// ======================================================

window.showDelete = function (id) {

    deleteId = id;

    new bootstrap.Modal(
        document.getElementById("deleteModal")
    ).show();

};

document.getElementById("confirmDeleteBtn")
    .addEventListener("click", async () => {

        try {

            await deleteDoc(doc(db, "products", deleteId));

            bootstrap.Modal
                .getInstance(document.getElementById("deleteModal"))
                .hide();

            showToast("Delete successfully.");

            loadProducts();

        }

        catch (error) {

            console.error(error);

        }

    });

// ======================================================
// Logout
// ======================================================

window.logout = function () {

    if (!confirm("Do you want to logout?")) {

        return;

    }

    localStorage.removeItem("adminLogin");

    window.location.href = "index.html";

};

// ======================================================
// First Load
// ======================================================

loadProducts();

document
    .getElementById("btnSearch")
    .addEventListener("click", searchProducts);

function searchProducts() {

    const keyword = document
        .getElementById("searchName")
        .value
        .toLowerCase();

    const distributor = document
        .getElementById("searchDistributor")
        .value
        .toLowerCase();

    const min = Number(
        document.getElementById("minPrice").value
    ) || 0;

    const max = Number(
        document.getElementById("maxPrice").value
    ) || 999999999;

    const result = products.filter(product => {

        const finalPrice =
            product.price -
            product.price * product.discount / 100;

        return (

            product.name
                .toLowerCase()
                .includes(keyword)

            &&

            product.distributor
                .toLowerCase()
                .includes(distributor)

            &&

            finalPrice >= min

            &&

            finalPrice <= max

        );

    });

    renderProducts(result);

}

document
    .getElementById("searchName")
    .addEventListener("keyup", searchProducts);

document
    .getElementById("searchDistributor")
    .addEventListener("keyup", searchProducts);

document
    .getElementById("minPrice")
    .addEventListener("input", searchProducts);

document
    .getElementById("maxPrice")
    .addEventListener("input", searchProducts);

function renderProducts(list) {

    productList.innerHTML = "";

    list.forEach(product => {

        productList.innerHTML += renderProduct(
            product.id,
            product
        );

    });

}
renderProducts(products);