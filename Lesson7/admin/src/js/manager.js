

// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// // =======================
// // 📌 DOM
// // =======================
// const form = document.getElementById("productForm");
// const list = document.getElementById("productList");

// const productId = document.getElementById("productId");
// const name = document.getElementById("name");
// const image = document.getElementById("image");
// const description = document.getElementById("description");
// const stock = document.getElementById("stock");
// const price = document.getElementById("price");

// // =======================
// // 🧩 ERROR UI
// // =======================
// function showError(input, message) {
//   const group = input.parentElement;
//   const errorText = group.querySelector(".error-text");

//   errorText.innerText = message;
//   input.classList.add("error");
// }

// function clearError(input) {
//   const group = input.parentElement;
//   const errorText = group.querySelector(".error-text");

//   errorText.innerText = "";
//   input.classList.remove("error");
// }

// // =======================
// // 🔍 VALIDATION
// // =======================
// function validateForm(product) {
//   let isValid = true;

//   if (!product.name) {
//     showError(name, "Không được để trống tên");
//     isValid = false;
//   } else clearError(name);

//   if (!product.image) {
//     showError(image, "Không được để trống ảnh");
//     isValid = false;
//   } else clearError(image);

//   if (!product.description) {
//     showError(description, "Không được để trống mô tả");
//     isValid = false;
//   } else clearError(description);

//   if (isNaN(product.stock) || product.stock < 0) {
//     showError(stock, "Stock phải >= 0");
//     isValid = false;
//   } else clearError(stock);

//   if (isNaN(product.price) || product.price <= 0) {
//     showError(price, "Giá phải > 0");
//     isValid = false;
//   } else clearError(price);

//   return isValid;
// }

// // =======================
// // ➕ ADD / UPDATE
// // =======================
// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const product = {
//     name: name.value.trim(),
//     image: image.value.trim(),
//     description: description.value.trim(),
//     stock: Number(stock.value),
//     price: Number(price.value),
//   };

//   if (!validateForm(product)) return;

//   try {
//     if (productId.value) {
//       await db.collection("products")
//         .doc(productId.value)
//         .update(product);

//       alert("✅ Cập nhật sản phẩm thành công!");
//     } else {
//       await db.collection("products").add(product);
//       alert("✅ Thêm sản phẩm thành công!");
//     }

//     form.reset();
//     productId.value = "";
//     loadProducts();

//   } catch (err) {
//     alert(err.message);
//   }
// });

// // =======================
// // 📦 LOAD PRODUCTS
// // =======================
// async function loadProducts() {
//   list.innerHTML = "";

//   const snapshot = await db.collection("products").get();

//   snapshot.forEach(doc => {
//     const p = doc.data();

//     const tr = document.createElement("tr");

//     tr.innerHTML = `
//       <td>${p.name}</td>
//       <td><img src="${p.image}" /></td>
//       <td>${p.price.toLocaleString("vi-VN")}đ</td>
//       <td>${p.stock}</td>
//       <td>
//         <button class="edit-btn">✏️ Sửa</button>
//         <button class="delete-btn">🗑️ Xóa</button>
//       </td>
//     `;

//     // ✏️ EDIT
//     tr.querySelector(".edit-btn").addEventListener("click", () => {
//       editProduct(doc.id);
//     });

//     // ❌ DELETE
//     tr.querySelector(".delete-btn").addEventListener("click", () => {
//       deleteProduct(doc.id);
//     });

//     list.appendChild(tr);
//   });
// }

// // =======================
// // ✏️ EDIT
// // =======================
// async function editProduct(id) {
//   try {
//     const doc = await db.collection("products").doc(id).get();
//     const p = doc.data();

//     productId.value = id;
//     name.value = p.name;
//     image.value = p.image;
//     description.value = p.description;
//     stock.value = p.stock;
//     price.value = p.price;

//     [name, image, description, stock, price].forEach(clearError);

//     window.scrollTo({ top: 0, behavior: "smooth" });

//   } catch (err) {
//     alert("❌ Lỗi khi load sản phẩm!");
//   }
// }

// // =======================
// // ❌ DELETE
// // =======================
// async function deleteProduct(id) {
//   const confirmDelete = confirm("⚠️ Bạn có chắc muốn xóa sản phẩm này?");
//   if (!confirmDelete) return;

//   try {
//     await db.collection("products").doc(id).delete();

//     alert("✅ Xóa thành công!");
//     loadProducts();

//   } catch (err) {
//     alert("❌ Xóa thất bại!");
//   }
// }

// // =======================
// // 🚀 INIT
// // =======================
// loadProducts();

// Khởi tạo Firestore từ global object firebase (được load từ các thẻ script HTML)
const db = firebase.firestore();
const productsCollection = db.collection('products');

// Lấy các DOM Elements
const productList = document.getElementById('product-list');
const formAddProduct = document.getElementById('form-add-product');
const formEditProduct = document.getElementById('form-edit-product');
const productSearchInput = document.getElementById('product-search');
const stockFilterSelect = document.getElementById('stock-filter');
const totalProductsEl = document.getElementById('total-products');
const lowStockProductsEl = document.getElementById('low-stock-products');
const refreshProductsBtn = document.getElementById('refresh-products');

let allProducts = [];

// Hàm format tiền tệ VNĐ
const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// 1. READ: Lắng nghe dữ liệu realtime từ Firestore
productsCollection.onSnapshot((snapshot) => {
    allProducts = [];

    snapshot.forEach((doc) => {
        const data = doc.data();
        allProducts.push({ id: doc.id, ...data });
    });

    updateProductStats(allProducts);
    renderProducts(allProducts);
});

function renderProducts(products) {
    productList.innerHTML = '';

    if (!products.length) {
        productList.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Không tìm thấy sản phẩm phù hợp.</td></tr>`;
        return;
    }

    products.forEach((data) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-center">
                <img src="${data.image}" alt="${data.name}" class="product-img">
            </td>
            <td class="fw-medium">${data.name}</td>
            <td class="description-text" title="${data.description}">${data.description}</td>
            <td class="text-end fw-bold text-danger">${formatVND(data.price)}</td>
            <td class="text-center">
                <span class="badge bg-${data.stock > 10 ? 'success' : data.stock > 0 ? 'warning' : 'danger'} rounded-pill px-3">
                    ${data.stock}
                </span>
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-light btn-action text-primary edit-btn" data-id="${data.id}">
                    <i class="bi bi-pencil-square" style="pointer-events: none;"></i>
                </button>
                <button class="btn btn-sm btn-light btn-action text-danger delete-btn ms-1" data-id="${data.id}">
                    <i class="bi bi-trash" style="pointer-events: none;"></i>
                </button>
            </td>
        `;
        productList.appendChild(tr);
    });
}

function updateProductStats(products) {
    totalProductsEl.textContent = products.length;
    lowStockProductsEl.textContent = products.filter((item) => Number(item.stock || 0) <= 10).length;
}

function filterProducts() {
    const keyword = (productSearchInput.value || '').trim().toLowerCase();
    const stockFilter = stockFilterSelect.value;

    const filtered = allProducts.filter((item) => {
        const name = (item.name || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        const stock = Number(item.stock || 0);

        const matchKeyword = !keyword || name.includes(keyword) || description.includes(keyword);

        let matchStock = true;
        if (stockFilter === 'in-stock') matchStock = stock > 10;
        if (stockFilter === 'low-stock') matchStock = stock > 0 && stock <= 10;
        if (stockFilter === 'out-stock') matchStock = stock === 0;

        return matchKeyword && matchStock;
    });

    renderProducts(filtered);
}

// 2. CREATE: Thêm sản phẩm mới
formAddProduct.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Lấy dữ liệu từ form, ép kiểu số cho price và stock
    const newProduct = {
        name: document.getElementById('add-name').value,
        price: Number(document.getElementById('add-price').value),
        stock: Number(document.getElementById('add-stock').value),
        image: document.getElementById('add-image').value,
        description: document.getElementById('add-description').value
    };

    try {
        await productsCollection.add(newProduct);
        alert('Thêm sản phẩm thành công!');
        formAddProduct.reset(); // Xóa form
        // Đóng modal (Sử dụng Bootstrap JS API)
        const addModal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        addModal.hide();
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm: ", error);
        alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
});

// EVENT DELEGATION: Bắt sự kiện Click cho Nút Sửa và Nút Xóa trong bảng
productList.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    const editBtn = e.target.closest('.edit-btn');

    // 3. DELETE: Xóa sản phẩm
    if (deleteBtn) {
        const docId = deleteBtn.getAttribute('data-id');
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                await productsCollection.doc(docId).delete();
                alert('Đã xóa sản phẩm!');
            } catch (error) {
                console.error("Lỗi khi xóa: ", error);
            }
        }
    }

    // 4. CHUẨN BỊ UPDATE: Mở modal và điền dữ liệu cũ
    if (editBtn) {
        const docId = editBtn.getAttribute('data-id');
        
        try {
            const doc = await productsCollection.doc(docId).get();
            if (doc.exists) {
                const data = doc.data();
                // Đổ dữ liệu vào form Edit
                document.getElementById('edit-id').value = docId;
                document.getElementById('edit-name').value = data.name;
                document.getElementById('edit-price').value = data.price;
                document.getElementById('edit-stock').value = data.stock;
                document.getElementById('edit-image').value = data.image;
                document.getElementById('edit-description').value = data.description;
                
                // Hiển thị modal Sửa
                const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
                editModal.show();
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm: ", error);
        }
    }
});

productSearchInput.addEventListener('input', filterProducts);
stockFilterSelect.addEventListener('change', filterProducts);
refreshProductsBtn.addEventListener('click', filterProducts);

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.admin-header ul');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

// 5. UPDATE: Lưu dữ liệu cập nhật lên Firestore
formEditProduct.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('edit-id').value;
    const updatedProduct = {
        name: document.getElementById('edit-name').value,
        price: Number(document.getElementById('edit-price').value),
        stock: Number(document.getElementById('edit-stock').value),
        image: document.getElementById('edit-image').value,
        description: document.getElementById('edit-description').value
    };

    try {
        await productsCollection.doc(docId).update(updatedProduct);
        alert('Cập nhật sản phẩm thành công!');
        
        // Đóng modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        editModal.hide();
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm: ", error);
        alert('Cập nhật thất bại!');
    }
});