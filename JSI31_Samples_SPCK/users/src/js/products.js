/* =========================================================
   FIREBASE
========================================================= */

import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import {
    firebaseConfig
} from "./firebase-config.js";


/* =========================================================
   FIREBASE INITIALIZE
========================================================= */

const app =
    getApps().length > 0
        ? getApp()
        : initializeApp(firebaseConfig);


const db =
    getFirestore(app);


/* =========================================================
   GLOBAL DATA
========================================================= */

let allProducts = [];

let filteredProducts = [];

let currentMinPrice = null;

let currentMaxPrice = null;


/* =========================================================
   DOM
========================================================= */

const productsGrid =
    document.getElementById(
        "products-grid"
    );

const productsLoading =
    document.getElementById(
        "products-loading"
    );

const productsError =
    document.getElementById(
        "products-error"
    );

const productsErrorMessage =
    document.getElementById(
        "products-error-message"
    );

const noProducts =
    document.getElementById(
        "no-products"
    );

const productsCount =
    document.getElementById(
        "products-count"
    );


const searchInput =
    document.getElementById(
        "product-search"
    );

const clearSearch =
    document.getElementById(
        "clear-search"
    );


const distributorFilter =
    document.getElementById(
        "distributor-filter"
    );

const brandFilter =
    document.getElementById(
        "brand-filter"
    );

const categoryFilter =
    document.getElementById(
        "category-filter"
    );


const distributorWrapper =
    document.getElementById(
        "distributor-filter-wrapper"
    );

const brandWrapper =
    document.getElementById(
        "brand-filter-wrapper"
    );

const categoryWrapper =
    document.getElementById(
        "category-filter-wrapper"
    );


const sortFilter =
    document.getElementById(
        "sort-filter"
    );


const minPriceInput =
    document.getElementById(
        "min-price"
    );

const maxPriceInput =
    document.getElementById(
        "max-price"
    );


const applyPriceBtn =
    document.getElementById(
        "apply-price"
    );


const resetFilterBtn =
    document.getElementById(
        "reset-filter"
    );

const resetNoProducts =
    document.getElementById(
        "reset-no-products"
    );


const activeFilters =
    document.getElementById(
        "active-filters"
    );


const retryProducts =
    document.getElementById(
        "retry-products"
    );


const cartToast =
    document.getElementById(
        "cart-toast"
    );

const cartToastProduct =
    document.getElementById(
        "cart-toast-product"
    );

const closeCartToast =
    document.getElementById(
        "close-cart-toast"
    );


let toastTimer = null;


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    showLoading();

    hideError();

    hideNoProducts();


    try {

        const productsRef =
            collection(
                db,
                "products"
            );


        const snapshot =
            await getDocs(
                productsRef
            );


        allProducts = [];


        snapshot.forEach(
            documentSnapshot => {

                const data =
                    documentSnapshot.data();


                /*
                    Dùng ID của document Firestore
                    làm product ID.
                */

                allProducts.push({

                    id:
                        documentSnapshot.id,

                    ...data

                });

            }
        );


        console.log(
            "Products loaded:",
            allProducts
        );


        createFilterOptions();


        filteredProducts =
            [...allProducts];


        applyFilters();


    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        showError(
            getFirebaseErrorMessage(
                error
            )
        );

    } finally {

        hideLoading();

    }

}


/* =========================================================
   FIREBASE ERROR MESSAGE
========================================================= */

function getFirebaseErrorMessage(error) {

    if (!error) {

        return "Không xác định được lỗi.";

    }


    if (
        error.code ===
        "permission-denied"
    ) {

        return `
            Firebase Firestore đang từ chối quyền truy cập.
            Hãy kiểm tra Firestore Rules.
        `;

    }


    if (
        error.code ===
        "failed-precondition"
    ) {

        return `
            Firestore chưa được cấu hình đúng.
            Hãy kiểm tra Firebase project.
        `;

    }


    return (
        error.message ||
        "Không thể tải danh sách sản phẩm."
    );

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    productsLoading.classList.remove(
        "d-none"
    );

}


function hideLoading() {

    productsLoading.classList.add(
        "d-none"
    );

}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    productsErrorMessage.textContent =
        message;

    productsError.classList.remove(
        "d-none"
    );

}


function hideError() {

    productsError.classList.add(
        "d-none"
    );

}


/* =========================================================
   NO PRODUCTS
========================================================= */

function showNoProducts() {

    noProducts.classList.remove(
        "d-none"
    );

}


function hideNoProducts() {

    noProducts.classList.add(
        "d-none"
    );

}


/* =========================================================
   GET UNIQUE VALUES
========================================================= */

function getUniqueValues(field) {

    const values =
        allProducts

            .map(product => product[field])

            .filter(
                value =>
                    value !== undefined &&
                    value !== null &&
                    String(value).trim() !== ""
            )

            .map(
                value =>
                    String(value).trim()
            );


    return [
        ...new Set(values)
    ].sort(
        (a, b) =>
            a.localeCompare(
                b,
                "vi"
            )
    );

}


/* =========================================================
   CREATE FILTER OPTIONS
========================================================= */

function createFilterOptions() {

    /*
        Distributor
    */

    const distributors =
        getUniqueValues(
            "distributor"
        );


    distributorFilter.innerHTML =
        `
            <option value="">
                Tất cả nhà phân phối
            </option>
        `;


    distributors.forEach(
        distributor => {

            distributorFilter.insertAdjacentHTML(
                "beforeend",
                `
                    <option value="${escapeHTMLAttribute(distributor)}">
                        ${escapeHTML(distributor)}
                    </option>
                `
            );

        }
    );


    /*
        Brand
    */

    const brands =
        getUniqueValues(
            "brand"
        );


    if (brands.length === 0) {

        brandWrapper.classList.add(
            "d-none"
        );

    } else {

        brandWrapper.classList.remove(
            "d-none"
        );


        brandFilter.innerHTML =
            `
                <option value="">
                    Tất cả thương hiệu
                </option>
            `;


        brands.forEach(
            brand => {

                brandFilter.insertAdjacentHTML(
                    "beforeend",
                    `
                        <option value="${escapeHTMLAttribute(brand)}">
                            ${escapeHTML(brand)}
                        </option>
                    `
                );

            }
        );

    }


    /*
        Category
    */

    const categories =
        getUniqueValues(
            "category"
        );


    if (categories.length === 0) {

        categoryWrapper.classList.add(
            "d-none"
        );

    } else {

        categoryWrapper.classList.remove(
            "d-none"
        );


        categoryFilter.innerHTML =
            `
                <option value="">
                    Tất cả danh mục
                </option>
            `;


        categories.forEach(
            category => {

                categoryFilter.insertAdjacentHTML(
                    "beforeend",
                    `
                        <option value="${escapeHTMLAttribute(category)}">
                            ${escapeHTML(category)}
                        </option>
                    `
                );

            }
        );

    }

}


/* =========================================================
   APPLY FILTERS
========================================================= */

function applyFilters() {

    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();


    const distributor =
        distributorFilter.value;


    const brand =
        brandFilter.value;


    const category =
        categoryFilter.value;


    filteredProducts =
        allProducts.filter(
            product => {

                /*
                    Search by name
                */

                const productName =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const matchSearch =
                    productName.includes(
                        keyword
                    );


                /*
                    Distributor
                */

                const matchDistributor =
                    !distributor ||
                    String(
                        product.distributor || ""
                    ) === distributor;


                /*
                    Brand

                    Nếu sản phẩm không có brand
                    thì không match khi user
                    chọn brand.
                */

                const matchBrand =
                    !brand ||
                    String(
                        product.brand || ""
                    ) === brand;


                /*
                    Category
                */

                const matchCategory =
                    !category ||
                    String(
                        product.category || ""
                    ) === category;


                /*
                    Price
                */

                const price =
                    getProductPrice(
                        product
                    );


                const matchMinPrice =
                    currentMinPrice === null ||
                    price >= currentMinPrice;


                const matchMaxPrice =
                    currentMaxPrice === null ||
                    price <= currentMaxPrice;


                return (
                    matchSearch &&
                    matchDistributor &&
                    matchBrand &&
                    matchCategory &&
                    matchMinPrice &&
                    matchMaxPrice
                );

            }
        );


    sortProducts();


    renderProducts();


    renderActiveFilters();

}


/* =========================================================
   SORT
========================================================= */

function sortProducts() {

    const sortType =
        sortFilter.value;


    if (sortType === "price-asc") {

        filteredProducts.sort(
            (a, b) =>
                getProductPrice(a) -
                getProductPrice(b)
        );

    }


    else if (sortType === "price-desc") {

        filteredProducts.sort(
            (a, b) =>
                getProductPrice(b) -
                getProductPrice(a)
        );

    }


    else if (
        sortType ===
        "discount-desc"
    ) {

        filteredProducts.sort(
            (a, b) =>
                Number(
                    b.discount || 0
                ) -
                Number(
                    a.discount || 0
                )
        );

    }


    else if (
        sortType ===
        "stock-desc"
    ) {

        filteredProducts.sort(
            (a, b) =>
                Number(
                    b.amount || 0
                ) -
                Number(
                    a.amount || 0
                )
        );

    }

}


/* =========================================================
   GET PRODUCT PRICE
========================================================= */

function getProductPrice(product) {

    const price =
        Number(
            product.price || 0
        );


    /*
        Firestore đang lưu:

        price: 690000
        discount: 64

        => discount là phần trăm.
    */

    const discount =
        Number(
            product.discount || 0
        );


    if (
        discount > 0 &&
        discount < 100
    ) {

        return Math.round(
            price *
            (1 - discount / 100)
        );

    }


    return price;

}


/* =========================================================
   GET ORIGINAL PRICE
========================================================= */

function getOriginalPrice(product) {

    return Number(
        product.price || 0
    );

}


/* =========================================================
   FORMAT MONEY
========================================================= */

function formatPrice(price) {

    return Number(
        price || 0
    ).toLocaleString(
        "vi-VN"
    ) + "₫";

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    productsGrid.innerHTML = "";


    productsCount.textContent =
        filteredProducts.length;


    if (
        filteredProducts.length === 0
    ) {

        showNoProducts();

        return;

    }


    hideNoProducts();


    filteredProducts.forEach(
        (product, index) => {

            const card =
                createProductCard(
                    product,
                    index
                );


            productsGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CREATE PRODUCT CARD
========================================================= */

function createProductCard(
    product,
    index
) {

    const card =
        document.createElement(
            "article"
        );


    const amount =
        Number(
            product.amount || 0
        );


    const discount =
        Number(
            product.discount || 0
        );


    const originalPrice =
        getOriginalPrice(
            product
        );


    const finalPrice =
        getProductPrice(
            product
        );


    const isOutOfStock =
        amount <= 0;


    card.className =
        "product-card";


    if (isOutOfStock) {

        card.classList.add(
            "out-of-stock"
        );

    }


    card.style.animationDelay =
        `${Math.min(index * 0.04, 0.3)}s`;


    /*
        Image fallback
    */

    const image =
        product.image ||
        "https://via.placeholder.com/600x600?text=No+Image";


    const description =
        product.description ||
        "Chưa có mô tả sản phẩm.";


    const name =
        product.name ||
        "Sản phẩm chưa có tên";


    const distributor =
        product.distributor ||
        "Chưa cập nhật";


    card.innerHTML =
        `
            <!-- Product Image -->
            <div class="product-image-wrapper">

                <img
                    src="${escapeHTMLAttribute(image)}"
                    alt="${escapeHTMLAttribute(name)}"
                    class="product-image"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/600x600?text=No+Image';"
                >

                ${
                    discount > 0
                        ? `
                            <span class="discount-badge">
                                -${discount}%
                            </span>
                        `
                        : ""
                }


                <span class="stock-badge">

                    ${
                        isOutOfStock
                            ? "Hết hàng"
                            : `Còn ${amount} sản phẩm`
                    }

                </span>

            </div>


            <!-- Product Content -->
            <div class="product-content">

                <div class="product-distributor">

                    <i class="bi bi-shop"></i>

                    ${escapeHTML(distributor)}

                </div>


                <h2 class="product-name">
                    ${escapeHTML(name)}
                </h2>


                <p class="product-description">
                    ${escapeHTML(description)}
                </p>


                <div class="product-price-area">

                    <span class="product-price">

                        ${formatPrice(finalPrice)}

                    </span>


                    ${
                        discount > 0
                            ? `
                                <span
                                    class="product-original-price"
                                >
                                    ${formatPrice(
                                        originalPrice
                                    )}
                                </span>
                            `
                            : ""
                    }


                    <div class="product-meta">

                        <span>

                            <i class="bi bi-box-seam"></i>

                            ${amount > 0
                                ? `Kho: ${amount}`
                                : "Hết hàng"
                            }

                        </span>


                        ${
                            discount > 0
                                ? `
                                    <span>
                                        Giảm ${discount}%
                                    </span>
                                `
                                : ""
                        }

                    </div>


                    <button
                        type="button"
                        class="add-cart-btn"
                        data-product-id="${escapeHTMLAttribute(product.id)}"
                        ${
                            isOutOfStock
                                ? "disabled"
                                : ""
                        }
                    >

                        <i
                            class="bi bi-cart-plus"
                        ></i>

                        ${
                            isOutOfStock
                                ? "Hết hàng"
                                : "Thêm vào giỏ hàng"
                        }

                    </button>

                </div>

            </div>
        `;


    /*
        Add cart event
    */

    const addButton =
        card.querySelector(
            ".add-cart-btn"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                addToCart(
                    product,
                    addButton
                );

            }
        );

    }


    return card;

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
    product,
    button
) {

    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "cart"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Cannot read cart:",
            error
        );

        cart = [];

    }


    /*
        Kiểm tra sản phẩm đã tồn tại
    */

    const existingProduct =
        cart.find(
            item =>
                String(item.id) ===
                String(product.id)
        );


    if (existingProduct) {

        /*
            Không cho quantity vượt quá
            số lượng trong kho.
        */

        const currentQuantity =
            Number(
                existingProduct.quantity || 1
            );


        const stock =
            Number(
                product.amount || 0
            );


        if (
            currentQuantity < stock
        ) {

            existingProduct.quantity =
                currentQuantity + 1;

        } else {

            showCartToast(
                `Đã đạt số lượng tối đa của "${product.name}".`
            );

            return;

        }

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name || "",

            image:
                product.image || "",

            price:
                Number(
                    product.price || 0
                ),

            discount:
                Number(
                    product.discount || 0
                ),

            finalPrice:
                getProductPrice(
                    product
                ),

            description:
                product.description || "",

            distributor:
                product.distributor || "",

            amount:
                Number(
                    product.amount || 0
                ),

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    /*
        Button animation
    */

    if (button) {

        const originalHTML =
            button.innerHTML;


        button.classList.add(
            "added"
        );


        button.innerHTML =
            `
                <i class="bi bi-check2"></i>
                Đã thêm vào giỏ
            `;


        setTimeout(() => {

            button.classList.remove(
                "added"
            );

            button.innerHTML =
                originalHTML;

        }, 1200);

    }


    showCartToast(
        product.name
    );


    console.log(
        "Current cart:",
        cart
    );

}


/* =========================================================
   CART TOAST
========================================================= */

function showCartToast(
    productName
) {

    cartToastProduct.textContent =
        productName ||
        "Sản phẩm đã được thêm.";


    cartToast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            hideCartToast();

        }, 3000);

}


function hideCartToast() {

    cartToast.classList.remove(
        "show"
    );

}


/* =========================================================
   ACTIVE FILTERS
========================================================= */

function renderActiveFilters() {

    activeFilters.innerHTML = "";


    const keyword =
        searchInput.value.trim();


    if (keyword) {

        addFilterTag(
            `Tên: ${keyword}`,
            () => {

                searchInput.value = "";

                updateSearchButton();

                applyFilters();

            }
        );

    }


    if (
        distributorFilter.value
    ) {

        addFilterTag(
            `NPP: ${distributorFilter.value}`,
            () => {

                distributorFilter.value = "";

                applyFilters();

            }
        );

    }


    if (
        brandFilter.value
    ) {

        addFilterTag(
            `Brand: ${brandFilter.value}`,
            () => {

                brandFilter.value = "";

                applyFilters();

            }
        );

    }


    if (
        categoryFilter.value
    ) {

        addFilterTag(
            `Category: ${categoryFilter.value}`,
            () => {

                categoryFilter.value = "";

                applyFilters();

            }
        );

    }


    if (
        currentMinPrice !== null
    ) {

        addFilterTag(
            `Từ ${formatPrice(currentMinPrice)}`,
            () => {

                currentMinPrice = null;

                minPriceInput.value = "";

                applyFilters();

            }
        );

    }


    if (
        currentMaxPrice !== null
    ) {

        addFilterTag(
            `Đến ${formatPrice(currentMaxPrice)}`,
            () => {

                currentMaxPrice = null;

                maxPriceInput.value = "";

                applyFilters();

            }
        );

    }

}


/* =========================================================
   ADD FILTER TAG
========================================================= */

function addFilterTag(
    text,
    removeCallback
) {

    const tag =
        document.createElement(
            "span"
        );


    tag.className =
        "filter-tag";


    tag.innerHTML =
        `
            <span>
                ${escapeHTML(text)}
            </span>

            <button
                type="button"
                aria-label="Xóa bộ lọc"
            >
                <i class="bi bi-x"></i>
            </button>
        `;


    tag.querySelector(
        "button"
    ).addEventListener(
        "click",
        removeCallback
    );


    activeFilters.appendChild(
        tag
    );

}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        updateSearchButton();

        applyFilters();

    }
);


/* =========================================================
   SEARCH BUTTON
========================================================= */

function updateSearchButton() {

    if (
        searchInput.value.trim()
    ) {

        clearSearch.classList.add(
            "visible"
        );

    } else {

        clearSearch.classList.remove(
            "visible"
        );

    }

}


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        updateSearchButton();

        searchInput.focus();

        applyFilters();

    }
);


/* =========================================================
   FILTER EVENTS
========================================================= */

distributorFilter.addEventListener(
    "change",
    applyFilters
);


brandFilter.addEventListener(
    "change",
    applyFilters
);


categoryFilter.addEventListener(
    "change",
    applyFilters
);


sortFilter.addEventListener(
    "change",
    applyFilters
);


/* =========================================================
   PRICE FILTER
========================================================= */

applyPriceBtn.addEventListener(
    "click",
    applyPriceFilter
);


function applyPriceFilter() {

    const min =
        minPriceInput.value.trim();


    const max =
        maxPriceInput.value.trim();


    currentMinPrice =
        min !== ""
            ? Number(min)
            : null;


    currentMaxPrice =
        max !== ""
            ? Number(max)
            : null;


    /*
        Invalid range
    */

    if (
        currentMinPrice !== null &&
        currentMaxPrice !== null &&
        currentMinPrice >
            currentMaxPrice
    ) {

        alert(
            "Giá thấp nhất không được lớn hơn giá cao nhất."
        );

        return;

    }


    applyFilters();

}


/* =========================================================
   ENTER ON PRICE
========================================================= */

minPriceInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            applyPriceFilter();

        }

    }
);


maxPriceInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            applyPriceFilter();

        }

    }
);


/* =========================================================
   RESET FILTER
========================================================= */

resetFilterBtn.addEventListener(
    "click",
    resetAllFilters
);


resetNoProducts.addEventListener(
    "click",
    resetAllFilters
);


function resetAllFilters() {

    searchInput.value = "";

    distributorFilter.value = "";

    brandFilter.value = "";

    categoryFilter.value = "";

    sortFilter.value = "default";

    minPriceInput.value = "";

    maxPriceInput.value = "";


    currentMinPrice = null;

    currentMaxPrice = null;


    updateSearchButton();

    applyFilters();

}


/* =========================================================
   RETRY
========================================================= */

retryProducts.addEventListener(
    "click",
    () => {

        loadProducts();

    }
);


/* =========================================================
   CLOSE TOAST
========================================================= */

closeCartToast.addEventListener(
    "click",
    hideCartToast
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeHTMLAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadProducts();