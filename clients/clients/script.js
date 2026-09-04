// ========================================
// TRADEHUB MAIN JAVASCRIPT
// ========================================


// ========================================
// POST PRODUCT SYSTEM
// ========================================

const postProductForm =
    document.getElementById("postProductForm");


if (postProductForm) {

    postProductForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const title =
                document.getElementById("productTitle")?.value;

            const category =
                document.getElementById("productCategory")?.value;

            const description =
                document.getElementById("productDescription")?.value;

            const price =
                document.getElementById("productPrice")?.value;

            const condition =
                document.getElementById("productCondition")?.value;

            const state =
                document.getElementById("productState")?.value;

            const location =
                document.getElementById("productLocation")?.value;

            const phone =
                document.getElementById("sellerPhone")?.value;

            const imageInput =
                document.getElementById("productImages");


            // CHECK REQUIRED FIELDS

            if (!title || !category || !price) {

                alert(
                    "Please fill in all required fields."
                );

                return;

            }


            // DEFAULT IMAGE

            let image =
                "https://images.unsplash.com/photo-1560393464-5c69a73c5770";


            // CREATE PRODUCT

            const newProduct = {

                id: Date.now(),

                title: title,

                category: category,

                description:
                    description ||
                    "No description provided.",

                price: Number(price),

                condition:
                    condition ||
                    "Not specified",

                state:
                    state ||
                    "Not specified",

                location:
                    location ||
                    "Not specified",

                phone:
                    phone ||
                    "Not provided",

                image: image,

                createdAt:
                    new Date().toISOString()

            };


            // GET SAVED PRODUCTS

            const savedProducts =
                JSON.parse(
                    localStorage.getItem(
                        "tradehubProducts"
                    )
                ) || [];


            // ADD PRODUCT

            savedProducts.push(
                newProduct
            );


            // SAVE PRODUCTS

            localStorage.setItem(
                "tradehubProducts",
                JSON.stringify(savedProducts)
            );


            alert(
                "Product published successfully!"
            );


            // REDIRECT

            window.location.href =
                "marketplace.html";

        }
    );

}


// ========================================
// MARKETPLACE SYSTEM
// ========================================

function loadUserProducts() {

    const productsGrid =
        document.getElementById("productsGrid");


    if (!productsGrid) return;


    const savedProducts =
        JSON.parse(
            localStorage.getItem(
                "tradehubProducts"
            )
        ) || [];


    savedProducts.forEach(product => {


        const productCard =
            document.createElement("div");


        productCard.className =
            "product-card";


        productCard.dataset.category =
            product.category;

        productCard.dataset.price =
            product.price;

        productCard.dataset.location =
            product.state;

        productCard.dataset.name =
            product.title;


        productCard.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.title}"
                >

                <button class="favorite-btn">

                    <i class="fa-regular fa-heart"></i>

                </button>

            </div>


            <div class="product-info">

                <span class="product-category">

                    ${product.category}

                </span>


                <h3>

                    ${product.title}

                </h3>


                <p class="product-price">

                    ₦${Number(
                        product.price
                    ).toLocaleString()}

                </p>


                <div class="product-location">

                    <i class="fa-solid fa-location-dot"></i>

                    ${product.state}

                </div>

            </div>

        `;


        // OPEN PRODUCT DETAILS

        productCard.addEventListener(
            "click",
            function () {

                localStorage.setItem(
                    "selectedProduct",
                    JSON.stringify(product)
                );


                window.location.href =
                    "product-details.html";

            }
        );


        productsGrid.appendChild(
            productCard
        );

    });


    updateProductCount();

}


// ========================================
// PRODUCT FILTER SYSTEM
// ========================================

function filterProducts() {

    const marketplaceSearch =
        document.getElementById(
            "marketplaceSearch"
        );


    const categoryFilters =
        document.querySelectorAll(
            ".category-filter"
        );


    const minPrice =
        document.getElementById("minPrice");

    const maxPrice =
        document.getElementById("maxPrice");

    const locationFilter =
        document.getElementById(
            "locationFilter"
        );


    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    if (!productCards.length) return;


    const searchText =
        marketplaceSearch
            ? marketplaceSearch.value.toLowerCase()
            : "";


    const selectedCategories =
        Array.from(categoryFilters)
            .filter(filter => filter.checked)
            .map(filter => filter.value);


    const minimumPrice =
        minPrice && minPrice.value
            ? Number(minPrice.value)
            : 0;


    const maximumPrice =
        maxPrice && maxPrice.value
            ? Number(maxPrice.value)
            : Infinity;


    const selectedLocation =
        locationFilter
            ? locationFilter.value
            : "";


    let visibleProducts = 0;


    productCards.forEach(card => {


        const name =
            card.dataset.name.toLowerCase();


        const category =
            card.dataset.category;


        const price =
            Number(card.dataset.price);


        const location =
            card.dataset.location;


        const matchesSearch =
            name.includes(searchText);


        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(category);


        const matchesPrice =
            price >= minimumPrice &&
            price <= maximumPrice;


        const matchesLocation =
            !selectedLocation ||
            location === selectedLocation;


        if (
            matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesLocation
        ) {

            card.style.display = "block";

            visibleProducts++;

        } else {

            card.style.display = "none";

        }

    });


    const productCount =
        document.getElementById(
            "productCount"
        );


    if (productCount) {

        productCount.textContent =
            `${visibleProducts} product(s) found`;

    }


    const noProducts =
        document.getElementById(
            "noProducts"
        );


    if (noProducts) {

        noProducts.style.display =
            visibleProducts === 0
                ? "block"
                : "none";

    }

}


// ========================================
// UPDATE PRODUCT COUNT
// ========================================

function updateProductCount() {

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    const productCount =
        document.getElementById(
            "productCount"
        );


    if (productCount) {

        productCount.textContent =
            `${productCards.length} product(s) found`;

    }

}


// ========================================
// MARKETPLACE EVENTS
// ========================================

const marketplaceSearch =
    document.getElementById(
        "marketplaceSearch"
    );


if (marketplaceSearch) {

    marketplaceSearch.addEventListener(
        "input",
        filterProducts
    );

}


document
    .querySelectorAll(".category-filter")
    .forEach(filter => {

        filter.addEventListener(
            "change",
            filterProducts
        );

    });


const minPrice =
    document.getElementById("minPrice");


if (minPrice) {

    minPrice.addEventListener(
        "input",
        filterProducts
    );

}


const maxPrice =
    document.getElementById("maxPrice");


if (maxPrice) {

    maxPrice.addEventListener(
        "input",
        filterProducts
    );

}


const locationFilter =
    document.getElementById(
        "locationFilter"
    );


if (locationFilter) {

    locationFilter.addEventListener(
        "change",
        filterProducts
    );

}


// CLEAR FILTERS

const clearFilters =
    document.getElementById(
        "clearFilters"
    );


if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        function () {


            if (marketplaceSearch) {

                marketplaceSearch.value = "";

            }


            if (minPrice) {

                minPrice.value = "";

            }


            if (maxPrice) {

                maxPrice.value = "";

            }


            if (locationFilter) {

                locationFilter.value = "";

            }


            document
                .querySelectorAll(
                    ".category-filter"
                )
                .forEach(filter => {

                    filter.checked = false;

                });


            filterProducts();

        }
    );

}


// ========================================
// FAVORITE BUTTON SYSTEM
// ========================================

function setupFavoriteButtons() {

    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {


            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    const icon =
                        this.querySelector("i");


                    if (
                        icon.classList.contains(
                            "fa-regular"
                        )
                    ) {

                        icon.classList.remove(
                            "fa-regular"
                        );

                        icon.classList.add(
                            "fa-solid"
                        );

                        this.style.color =
                            "#ef4444";

                    } else {

                        icon.classList.remove(
                            "fa-solid"
                        );

                        icon.classList.add(
                            "fa-regular"
                        );

                        this.style.color =
                            "#475569";

                    }

                }
            );

        });

}


// ========================================
// PRODUCT DETAILS SYSTEM
// ========================================

function loadSelectedProduct() {


    const selectedProduct =
        JSON.parse(
            localStorage.getItem(
                "selectedProduct"
            )
        );


    if (!selectedProduct) return;


    const productName =
        document.getElementById(
            "detailsProductName"
        );


    if (productName) {

        productName.textContent =
            selectedProduct.title;

    }


    const productPrice =
        document.getElementById(
            "detailsProductPrice"
        );


    if (productPrice) {

        productPrice.textContent =
            "₦" +
            Number(
                selectedProduct.price
            ).toLocaleString();

    }


    const mainImage =
        document.getElementById(
            "mainProductImage"
        );


    if (mainImage) {

        mainImage.src =
            selectedProduct.image;

    }


    const description =
        document.querySelector(
            ".details-description p"
        );


    if (description) {

        description.textContent =
            selectedProduct.description;

    }


    const category =
        document.querySelector(
            ".details-category"
        );


    if (category) {

        category.textContent =
            selectedProduct.category;

    }

}


// ========================================
// IMAGE GALLERY
// ========================================

const mainProductImage =
    document.getElementById(
        "mainProductImage"
    );


const thumbnails =
    document.querySelectorAll(
        ".thumbnail"
    );


thumbnails.forEach(thumbnail => {

    thumbnail.addEventListener(
        "click",
        function () {


            if (mainProductImage) {

                mainProductImage.src =
                    this.src;

            }


            thumbnails.forEach(image => {

                image.classList.remove(
                    "active-thumbnail"
                );

            });


            this.classList.add(
                "active-thumbnail"
            );

        }
    );

});


// ========================================
// DETAILS FAVORITE
// ========================================

const detailsFavorite =
    document.getElementById(
        "detailsFavorite"
    );


if (detailsFavorite) {

    detailsFavorite.addEventListener(
        "click",
        function () {


            const icon =
                this.querySelector("i");


            icon.classList.toggle(
                "fa-solid"
            );


            icon.classList.toggle(
                "fa-regular"
            );

        }
    );

}


// ========================================
// CONTACT SELLER
// ========================================

const contactSeller =
    document.getElementById(
        "contactSeller"
    );


if (contactSeller) {

    contactSeller.addEventListener(
        "click",
        function () {

            alert(
                "Seller contact information will appear here."
            );

        }
    );

}


// MESSAGE SELLER

const messageSellerButton =
    document.querySelector(
        ".message-seller-btn"
    );


if (messageSellerButton) {

    messageSellerButton.addEventListener(
        "click",
        function () {

            alert(
                "Messaging system coming soon!"
            );

        }
    );

}


// ========================================
// DEFAULT PRODUCT CLICK EVENTS
// ========================================

function setupDefaultProductClicks() {

    document
        .querySelectorAll(".product-card")
        .forEach(card => {


            if (
                card.dataset.listenerAdded
            ) return;


            card.dataset.listenerAdded = true;


            card.addEventListener(
                "click",
                function () {


                    const product = {

                        title:
                            card.dataset.name,

                        category:
                            card.dataset.category,

                        price:
                            card.dataset.price,

                        state:
                            card.dataset.location,

                        image:
                            card.querySelector("img").src,

                        description:
                            "This product is available on TradeHub. Contact the seller for more information."

                    };


                    localStorage.setItem(
                        "selectedProduct",
                        JSON.stringify(product)
                    );


                    window.location.href =
                        "product-details.html";

                }
            );

        });

}


// ========================================
// SORT PRODUCTS
// ========================================

const sortProducts =
    document.getElementById(
        "sortProducts"
    );


if (sortProducts) {

    sortProducts.addEventListener(
        "change",
        function () {


            const grid =
                document.getElementById(
                    "productsGrid"
                );


            if (!grid) return;


            const cards =
                Array.from(
                    grid.querySelectorAll(
                        ".product-card"
                    )
                );


            if (
                this.value === "low-high"
            ) {

                cards.sort(
                    (a, b) =>
                        Number(
                            a.dataset.price
                        ) -
                        Number(
                            b.dataset.price
                        )
                );

            }


            if (
                this.value === "high-low"
            ) {

                cards.sort(
                    (a, b) =>
                        Number(
                            b.dataset.price
                        ) -
                        Number(
                            a.dataset.price
                        )
                );

            }


            cards.forEach(card => {

                grid.appendChild(card);

            });

        }
    );

}


// ========================================
// INITIALIZE APPLICATION
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserProducts();

        setupDefaultProductClicks();

        setupFavoriteButtons();

        loadSelectedProduct();

        updateProductCount();

    }
);