/* ========================================
   VÉLORA — E-COMMERCE JAVASCRIPT
   ======================================== */


/* ========================================
   ELEMENTS
   ======================================== */

const productGrid = document.getElementById("product-grid");
const productCards = document.querySelectorAll(".product-card");

const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("product-search");

const cartButton = document.querySelector(".cart-btn");
const cartSidebar = document.querySelector(".cart-sidebar");
const cartOverlay = document.querySelector(".cart-overlay");
const closeCartButton = document.querySelector(".close-cart");

const cartItemsContainer = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total strong");

const wishlistButton = document.querySelector(".wishlist-btn");
const wishlistIcons = document.querySelectorAll(".wishlist-icon");

const newsletterForm = document.querySelector(".newsletter-form");


/* ========================================
   CART DATA
   ======================================== */

let cart = [];


/* ========================================
   OPEN CART
   ======================================== */

function openCart() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.classList.add("cart-open");
}


/* ========================================
   CLOSE CART
   ======================================== */

function closeCart() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.classList.remove("cart-open");
}


/* ========================================
   CART EVENTS
   ======================================== */

cartButton.addEventListener("click", openCart);

closeCartButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


/* ========================================
   GET PRODUCT INFORMATION
   ======================================== */

function getProductInfo(productCard) {

    const name = productCard.dataset.name;

    const category = productCard.dataset.category;

    const priceText =
        productCard
            .querySelector(".product-price")
            .textContent
            .replace("$", "")
            .trim();

    const price = Number(priceText);

    const image =
        productCard.querySelector("img").src;

    return {
        name,
        category,
        price,
        image
    };
}


/* ========================================
   ADD TO CART
   ======================================== */

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const productCard =
            button.closest(".product-card");

        const product =
            getProductInfo(productCard);

        const existingProduct =
            cart.find(item => item.name === product.name);

        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({
                ...product,
                quantity: 1
            });

        }

        updateCart();

        openCart();

    });

});


/* ========================================
   UPDATE CART
   ======================================== */

function updateCart() {

    renderCart();

    updateCartCount();

    updateCartTotal();

}


/* ========================================
   RENDER CART
   ======================================== */

function renderCart() {

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        return;
    }


    cart.forEach((item, index) => {

        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

            </div>


            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    $${item.price.toFixed(2)}
                </p>


                <div class="cart-item-controls">

                    <button
                        class="quantity-minus"
                        data-index="${index}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-plus"
                        data-index="${index}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                data-index="${index}"
                aria-label="Remove ${item.name}"
            >
                ×
            </button>

        `;

        cartItemsContainer.appendChild(cartItem);

    });

}


/* ========================================
   CART COUNT
   ======================================== */

function updateCartCount() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent = totalItems;

}


/* ========================================
   CART TOTAL
   ======================================== */

function updateCartTotal() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

    cartTotal.textContent =
        `$${total.toFixed(2)}`;

}


/* ========================================
   CART QUANTITY + / -
   ======================================== */

cartItemsContainer.addEventListener("click", event => {

    const index =
        event.target.dataset.index;

    if (index === undefined) {
        return;
    }


    if (
        event.target.classList.contains(
            "quantity-plus"
        )
    ) {

        cart[index].quantity += 1;

    }


    if (
        event.target.classList.contains(
            "quantity-minus"
        )
    ) {

        cart[index].quantity -= 1;

        if (cart[index].quantity <= 0) {

            cart.splice(index, 1);

        }

    }


    if (
        event.target.classList.contains(
            "remove-item"
        )
    ) {

        cart.splice(index, 1);

    }


    updateCart();

});


/* ========================================
   PRODUCT FILTERS
   ======================================== */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category =
            button.dataset.category;

        productCards.forEach(card => {

            const cardCategory =
                card.dataset.category;

            if (
                category === "all" ||
                cardCategory === category
            ) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

        checkForNoResults();

    });

});


/* ========================================
   PRODUCT SEARCH
   ======================================== */

searchInput.addEventListener("input", () => {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    const activeCategory =
        document
            .querySelector(".filter-btn.active")
            .dataset.category;


    productCards.forEach(card => {

        const productName =
            card.dataset.name.toLowerCase();

        const productCategory =
            card.dataset.category.toLowerCase();

        const matchesSearch =
            productName.includes(searchTerm);

        const matchesCategory =
            activeCategory === "all" ||
            productCategory === activeCategory;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

    checkForNoResults();

});


/* ========================================
   NO SEARCH RESULTS
   ======================================== */

function checkForNoResults() {

    const visibleProducts =
        document.querySelectorAll(
            ".product-card:not(.hidden)"
        );

    let noResults =
        document.querySelector(".no-results");


    if (
        visibleProducts.length === 0
    ) {

        if (!noResults) {

            noResults =
                document.createElement("p");

            noResults.classList.add(
                "no-results"
            );

            noResults.textContent =
                "No products found. Try another search.";

            productGrid.appendChild(
                noResults
            );

        }

    } else {

        if (noResults) {
            noResults.remove();
        }

    }

}


/* ========================================
   WISHLIST
   ======================================== */

wishlistIcons.forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("active");

        if (button.classList.contains("active")) {

            button.textContent = "♥";

        } else {

            button.textContent = "♡";

        }

    });

});


/* ========================================
   HEADER WISHLIST
   ======================================== */

wishlistButton.addEventListener("click", () => {

    const activeWishlists =
        document.querySelectorAll(
            ".wishlist-icon.active"
        );

    if (activeWishlists.length > 0) {

        alert(
            `You have ${activeWishlists.length} item${
                activeWishlists.length > 1
                    ? "s"
                    : ""
            } in your wishlist.`
        );

    } else {

        alert(
            "Your wishlist is currently empty."
        );

    }

});


/* ========================================
   CHECKOUT
   ======================================== */

const checkoutButton =
    document.querySelector(".checkout-btn");

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Add a product first."
        );

        return;

    }

    alert(
        "Checkout is ready for integration with a real payment system."
    );

});


/* ========================================
   NEWSLETTER
   ======================================== */

newsletterForm.addEventListener("submit", event => {

    event.preventDefault();

    const emailInput =
        document.getElementById("email");

    const email =
        emailInput.value.trim();

    if (!email) {
        return;
    }

    alert(
        `Thanks for subscribing, ${email}!`
    );

    newsletterForm.reset();

});


/* ========================================
   ESCAPE KEY
   ======================================== */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCart();

    }

});


/* ========================================
   INITIAL STATE
   ======================================== */

updateCart();
