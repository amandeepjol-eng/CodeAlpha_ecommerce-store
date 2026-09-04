let cart = JSON.parse(localStorage.getItem("cart")) || [];
let allProducts = [];

// Get products from backend
fetch("/products")
    .then(response => response.json())
    .then(products => {
        allProducts = products;
        displayProducts(products);
    })
    .catch(error => {
        console.log("Error:", error);
    });


// Display products
function displayProducts(products) {

    const productsDiv = document.getElementById("products");
    const productCount = document.getElementById("productCount");

    if (!productsDiv) return;

    productsDiv.innerHTML = "";

    if (productCount) {
        productCount.innerText = products.length + " Products";
    }

    // No products found
    if (products.length === 0) {
        productsDiv.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try searching for another product.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {

        let productIcon = `
            <div class="product-icon-box">
                <div class="default-icon">◇</div>
            </div>
        `;


        // Smartphone
        if (product.name.toLowerCase().includes("smartphone")) {

            productIcon = `
                <div class="product-icon-box">
                    <div class="phone-icon">

                        <div class="phone-camera"></div>

                        <div class="phone-screen">
                            <div class="screen-circle"></div>
                            <div class="screen-line"></div>
                        </div>

                        <div class="phone-button"></div>

                    </div>
                </div>
            `;
        }


        // Laptop
        else if (product.name.toLowerCase().includes("laptop")) {

            productIcon = `
                <div class="product-icon-box">

                    <div class="laptop-icon">

                        <div class="laptop-screen">

                            <div class="laptop-display">
                                <div class="display-circle"></div>
                                <div class="display-line"></div>
                            </div>

                        </div>

                        <div class="laptop-base"></div>

                    </div>

                </div>
            `;
        }


        // Headphones
        else if (product.name.toLowerCase().includes("headphone")) {

            productIcon = `
                <div class="product-icon-box">

                    <div class="headphone-icon">

                        <div class="headband"></div>

                        <div class="ear-left"></div>
                        <div class="ear-right"></div>

                    </div>

                </div>
            `;
        }


        // Smart Watch
        else if (product.name.toLowerCase().includes("watch")) {

            productIcon = `
                <div class="product-icon-box">

                    <div class="watch-icon">

                        <div class="watch-strap-top"></div>

                        <div class="watch-body">

                            <div class="watch-screen">

                                <div class="watch-time">
                                    10:09
                                </div>

                                <div class="watch-circle"></div>

                            </div>

                        </div>

                        <div class="watch-strap-bottom"></div>

                    </div>

                </div>
            `;
        }


        // Keyboard
        else if (product.name.toLowerCase().includes("keyboard")) {

            productIcon = `
                <div class="product-icon-box">

                    <div class="keyboard-icon">

                        <div class="keyboard-keys">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>

                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>

                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>

                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                    </div>

                </div>
            `;
        }


        // Wireless Mouse
        else if (product.name.toLowerCase().includes("mouse")) {

            productIcon = `
                <div class="product-icon-box">

                    <div class="mouse-icon">

                        <div class="mouse-line"></div>
                        <div class="mouse-wheel"></div>

                    </div>

                </div>
            `;
        }


        // Tablet
        else if (product.name.toLowerCase().includes("tablet")) {

            productIcon = `
                <div class="product-icon-box">

                    <div class="tablet-icon">

                        <div class="tablet-camera"></div>

                        <div class="tablet-screen">

                            <div class="tablet-circle"></div>
                            <div class="tablet-line"></div>

                        </div>

                    </div>

                </div>
            `;
        }


        productsDiv.innerHTML += `

            <div class="product-card">

                <div class="product-image">
                    ${productIcon}
                </div>

                <div class="product-info">

                    <span class="badge">
                        BEST SELLER
                    </span>

                    <h3>
                        ${product.name}
                    </h3>

                    <p class="description">
                        ${product.description}
                    </p>

                    <div class="rating">
                        ⭐⭐⭐⭐⭐
                        <span>(4.8)</span>
                    </div>

                    <div class="price-section">

                        <span class="price">
                            ₹${Number(product.price).toLocaleString("en-IN")}
                        </span>

                        <span class="old-price">
                            ₹${(Number(product.price) + 5000).toLocaleString("en-IN")}
                        </span>

                    </div>

                    <div class="product-buttons">

                        <button
                            class="add-btn"
                            onclick="addToCart('${product.name}', ${product.price})"
                        >
                            🛒 Add to Cart
                        </button>

                        <button
                            class="details-btn"
                            onclick="viewProduct(${product.id})"
                        >
                            Details
                        </button>

                    </div>

                </div>

            </div>

        `;
    });

    updateCartCount();
}


// Add product to cart
function addToCart(name, price) {

    cart.push({
        name: name,
        price: Number(price)
    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert(name + " added to cart! 🛒");
}


// Update cart count
function updateCartCount() {

    const count = document.getElementById("cartCount");

    if (count) {
        count.innerText = cart.length;
    }
}


// Open product details
function viewProduct(id) {

    window.location.href =
        "product.html?id=" + id;
}


// Search products
function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;

    const search =
        searchInput.value.toLowerCase();

    const filteredProducts =
        allProducts.filter(product =>
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search)
        );

    displayProducts(filteredProducts);
}


// Scroll to products
function scrollToProducts() {

    const productsSection =
        document.getElementById("productsSection");

    if (productsSection) {

        productsSection.scrollIntoView({
            behavior: "smooth"
        });

    }
}


// Initial cart count
updateCartCount();