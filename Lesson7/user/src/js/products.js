const productsContainer =
document.getElementById("productsContainer");

const searchInput =
document.getElementById("searchInput");

const sortSelect =
document.getElementById("sortSelect");

const minPrice =
document.getElementById("minPrice");

const maxPrice =
document.getElementById("maxPrice");

const applyFilter =
document.getElementById("applyFilter");

const loadingBox =
document.getElementById("loadingBox");

let allProducts = [];

/* ==========================
   FIRESTORE
========================== */

async function loadProducts() {

    try {

        const snapshot =
        await db.collection("products").get();

        allProducts = [];

        snapshot.forEach(doc => {

            const data = doc.data();

            allProducts.push({
                id: doc.id,
                ...data
            });

        });

        renderProducts(allProducts);

    }
    catch(error){

        console.error(error);

        productsContainer.innerHTML =
        `
            <div class="col-12 text-center text-danger">
                Không thể tải sản phẩm
            </div>
        `;
    }

    loadingBox.style.display = "none";
}

/* ==========================
   RENDER
========================== */

function renderProducts(products){

    productsContainer.innerHTML = "";

    if(products.length === 0){

        productsContainer.innerHTML =
        `
            <div class="col-12 text-center">
                Không tìm thấy sản phẩm
            </div>
        `;
        return;
    }

    products.forEach(product => {

        const discount =
        randomNumber(5,25);

        const sold =
        randomNumber(20,1500);

        const oldPrice =
        product.price;

        const newPrice =
        Math.round(
            oldPrice * (100-discount)/100
        );

        productsContainer.innerHTML +=
        `
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="card product-card">

                <img
                    src="${product.image}"
                    class="product-image"
                    alt="${product.name}">

                <div class="product-body">

                    <div class="product-name">
                        ${product.name}
                    </div>

                    <div class="product-desc">
                        ${shortText(product.description)}
                    </div>

                    <div class="price-box">

                        <div class="old-price">
                            ${formatPrice(oldPrice)}
                        </div>

                        <div class="new-price">
                            ${formatPrice(newPrice)}
                        </div>

                        <div class="discount">
                            Giảm ${discount}%
                        </div>

                        <div class="sold">
                            Đã bán ${sold}
                        </div>

                    </div>

                    <button
                        class="btn btn-primary buy-btn"
                        onclick="addToCart('${product.id}')">

                        <i class="bi bi-cart-plus"></i>
                        Mua hàng

                    </button>

                </div>

            </div>

        </div>
        `;
    });

}

/* ==========================
   FILTER
========================== */

function filterProducts(){

    let result = [...allProducts];

    const keyword =
    searchInput.value
    .trim()
    .toLowerCase();

    if(keyword){

        result = result.filter(item =>
            item.name
            .toLowerCase()
            .includes(keyword)
        );

    }

    const min =
    Number(minPrice.value) || 0;

    const max =
    Number(maxPrice.value) || Infinity;

    result = result.filter(item =>
        item.price >= min &&
        item.price <= max
    );

    if(sortSelect.value === "asc"){

        result.sort(
            (a,b)=>a.price-b.price
        );
    }

    if(sortSelect.value === "desc"){

        result.sort(
            (a,b)=>b.price-a.price
        );
    }

    renderProducts(result);
}

searchInput.addEventListener(
    "input",
    filterProducts
);

sortSelect.addEventListener(
    "change",
    filterProducts
);

applyFilter.addEventListener(
    "click",
    filterProducts
);

/* ==========================
   CART
========================== */

function addToCart(id){

    const product =
    allProducts.find(
        item => item.id === id
    );

    if(!product) return;

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const exist =
    cart.find(item => item.id === id);

    if(exist){

        exist.quantity += 1;

    }else{

        cart.push({
            ...product,
            quantity:1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(
        "Đã thêm vào giỏ hàng"
    );
}

/* ==========================
   UTILS
========================== */

function formatPrice(price){

    return Number(price)
    .toLocaleString("vi-VN")
    + "₫";
}

function shortText(text){

    if(!text) return "";

    return text.length > 120
    ? text.slice(0,120) + "..."
    : text;
}

function randomNumber(min,max){

    return Math.floor(
        Math.random() *
        (max-min+1)
    ) + min;
}

/* ==========================
   START
========================== */

loadProducts();

// =============================================
// function addToCart(productId){

//     const product = allProducts.find(
//         item => item.id === productId
//     );

//     if(!product){
//         return;
//     }

//     let cart =
//     JSON.parse(
//         localStorage.getItem("cart")
//     ) || [];

//     const existingProduct =
//     cart.find(
//         item => item.id === productId
//     );

//     if(existingProduct){

//         existingProduct.quantity += 1;

//     }else{

//         cart.push({
//             id: product.id,
//             name: product.name,
//             image: product.image,
//             description: product.description,
//             price: product.price,
//             stock: product.stock,
//             quantity: 1,
//             addedAt: Date.now()
//         });

//     }

//     localStorage.setItem(
//         "cart",
//         JSON.stringify(cart)
//     );

//     updateCartCount();

//     alert("Đã thêm vào giỏ hàng");
// }

window.addToCart = addToCart;