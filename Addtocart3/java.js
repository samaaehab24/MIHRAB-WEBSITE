// Select product list container
const productContainer = document.querySelector(".product-list");
// Check if we are on the product detail page
const isProductDetailPage = document.querySelector(".product-detail");
// Check if we are on the cart page
const isCartPage = document.querySelector(".cart");

// Call the appropriate function based on the current page
if (productContainer) {
    displayProducts(); // Show all products
} else if (isProductDetailPage) {
    displayProductDetail(); // Show product details
} else if (isCartPage) {
    displayCart(); // Show cart content
}

// Function to display all products
function displayProducts() {
    products.forEach(product => {
        // Create a product card element
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        // Add product image, title, and price to the card
        productCard.innerHTML = `
            <div class="img-box">
                <img src="${product.colors[0].mainImage}">
            </div>
            <h2 class="title">${product.title}</h2>
            <span class="price">${product.price}</span>
        `;

        // Add the product card to the product list container
        productContainer.appendChild(productCard);

        // Add click event to redirect to product details page
        const imgbox = productCard.querySelector(".img-box");
        imgbox.addEventListener("click", () => {
            sessionStorage.setItem("selectedproduct", JSON.stringify(product));
            window.location.href = "product-details.html";
        });
    });
}

// Function to display product detail page
function displayProductDetail() {
    const productData = JSON.parse(sessionStorage.getItem("selectedproduct")); // Get selected product

    // Select HTML elements for displaying data
    const titleEl = document.querySelector(".title");
    const priceEl = document.querySelector(".price");
    const descriptionEl = document.querySelector(".description");
    const mainImageContainer = document.querySelector(".main-img");
    const thumbnailContainer = document.querySelector(".thumbnail-list");
    const colorContainer = document.querySelector(".color-options");
    const sizeContainer = document.querySelector(".size-options");
    const addToCartBtn = document.querySelector("#add-cart-btn");

    // Set default selected color and size
    let selectedColor = productData.colors[0];
    let selectedSize = selectedColor.sizes[0];

    // Function to update the display when color or size is changed
    function updateProductDisplay(colorData) {
        if (!colorData.sizes.includes(selectedSize)) {
            selectedSize = colorData.sizes[0];
        }

        // Set main product image
        mainImageContainer.innerHTML = `<img src="${colorData.mainImage}">`;

        // Set thumbnails
        thumbnailContainer.innerHTML = "";
        const uniqueThumbnails = colorData.thumbnails.filter(src => src !== colorData.mainImage);
        const allThumbnails = [colorData.mainImage, ...uniqueThumbnails].slice(0, 4);

        allThumbnails.forEach(thumb => {
            const img = document.createElement("img");
            img.src = thumb;
            thumbnailContainer.appendChild(img);
            img.addEventListener("click", () => {
                mainImageContainer.innerHTML = `<img src="${thumb}">`;
            });
        });

        // Set color options
        colorContainer.innerHTML = "";
        productData.colors.forEach(color => {
            const img = document.createElement("img");
            img.src = color.mainImage;
            if (color.name === colorData.name) img.classList.add("selected");
            colorContainer.appendChild(img);
            img.addEventListener("click", () => {
                selectedColor = color;
                updateProductDisplay(color);
            });
        });

        // Set size options
        sizeContainer.innerHTML = "";
        selectedColor.sizes.forEach(size => {
            const btn = document.createElement("button");
            btn.textContent = size;
            if (size === selectedSize) btn.classList.add("selected");
            sizeContainer.appendChild(btn);
            btn.addEventListener("click", () => {
                document.querySelectorAll(".size-options button").forEach(el => el.classList.remove("selected"));
                btn.classList.add("selected");
                selectedSize = size;
            });
        });
    }

    // Set product data in page
    titleEl.textContent = productData.title;
    priceEl.textContent = productData.price;
    descriptionEl.textContent = productData.description;

    // Call function to update display
    updateProductDisplay(selectedColor);

    // Add product to cart when button is clicked
    addToCartBtn.addEventListener("click", () => {
        addToCart(productData, selectedColor, selectedSize);
    });
}

// Function to add product to the cart
function addToCart(product, color, size) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || []; // Get current cart

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === product.id && item.color === color.name && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if exists
    } else {
        // Add new item to cart
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: color.mainImage,
            color: color.name,
            size: size,
            quantity: 1
        });
    }
    sessionStorage.setItem("cart", JSON.stringify(cart)); // Save cart to session
    updateCartBadge(); // Update cart badge icon
}

// Function to display cart page
function displayCart() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || []; // Get cart
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalEl = document.querySelector(".subtotal");
    const grandTotalEl = document.querySelector(".grand-total");

    cartItemsContainer.innerHTML = "";

    // If cart is empty
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        subtotalEl.textContent = "0 EGP";
        grandTotalEl.textContent = "0 EGP";
        return;
    }

    let subtotal = 0; // Start subtotal at 0

    cart.forEach((item, index) => {
        // Clean the price from formatting to convert it to number
        const cleanPrice = parseFloat(
            item.price
                .replace(/\./g, '')
                .replace(',', '.')
                .replace(/[^\d.]/g, '')
        );

        const itemTotal = cleanPrice * item.quantity; // Calculate item total price
        subtotal += itemTotal; // Add to subtotal

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        // Set HTML for each item in cart
        cartItem.innerHTML = `
            <div class="product">
                <img src="${item.image}">
                <div class="item-detail">
                    <p>${item.title}</p>
                    <div class="size-color-box">
                        <span class="size">${item.size}</span>
                        <span class="color">${item.color}</span>
                    </div>
                </div>
            </div>
            <span class="price">${item.price}</span>
            <div class="quantity"><input type="number" value="${item.quantity}" min="1" data-index="${index}"></div>
            <span class="total-price">${itemTotal.toFixed(2)} EGP</span>
            <button class="remove" data-index="${index}"><i class="ri-close-line"></i></button>
        `;

        cartItemsContainer.appendChild(cartItem); // Add item to cart container
    });

    // Show subtotal and total
    subtotalEl.textContent = `${subtotal.toFixed(2)} EGP`;
    grandTotalEl.textContent = `${subtotal.toFixed(2)} EGP`;
    updateCartQuantity(); // Update input events for quantity

    // Handle change in quantity
    document.querySelectorAll(".quantity input").forEach(input => {
        input.addEventListener("change", (e) => {
            const index = e.target.getAttribute("data-index");
            const newQuantity = parseInt(e.target.value);
            if (newQuantity > 0) {
                cart[index].quantity = newQuantity;
                sessionStorage.setItem("cart", JSON.stringify(cart));
                displayCart(); // Re-display cart
            }
        });
    });

    // Handle item removal from cart
    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.currentTarget.getAttribute("data-index");
            cart.splice(index, 1);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}

// Function to update cart quantities from input
function updateCartQuantity() {
    document.querySelectorAll(".quantity input").forEach(input => {
        input.addEventListener("change", function () {
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart[index].quantity = parseInt(this.value);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}

// Function to update the cart icon/badge
function updateCartBadge() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0); // Total items
    const badge = document.querySelector(".cart-item-count"); // Badge element

    if (badge) {
        if (cartCount > 0) {
            badge.textContent = cartCount;
            badge.style.display = "block"; // Show badge
        }else {
        badge.style.display = "none"; // Hide badge
    }
}

// Always update badge on page load
updateCartBadge();

}

const menuIcon = document.getElementById("menu-icon");
const nav = document.querySelector(".nav");

menuIcon.addEventListener("click", () => {
    nav.classList.toggle("active");
});
