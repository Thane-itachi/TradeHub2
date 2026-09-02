// Search Function

function searchProducts() {

    const searchInput = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const products = document.querySelectorAll(".product-card");

    products.forEach((product) => {

        const productName = product
            .querySelector("h3")
            .textContent
            .toLowerCase();

        if (productName.includes(searchInput)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });


    // Scroll to marketplace

    document
        .getElementById("marketplace")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// Explore Marketplace Button

function scrollToMarketplace() {

    document
        .getElementById("marketplace")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// Favorite Buttons

const favoriteButtons =
    document.querySelectorAll(".favorite-btn");


favoriteButtons.forEach((button) => {

    button.addEventListener("click", () => {

        button.classList.toggle("active");

        const icon = button.querySelector("i");

        if (button.classList.contains("active")) {

            icon.classList.remove("fa-regular");

            icon.classList.add("fa-solid");

        } else {

            icon.classList.remove("fa-solid");

            icon.classList.add("fa-regular");

        }

    });

});


// Allow Enter Key for Search

document
    .getElementById("searchInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {

            searchProducts();

        }

    });

// Login Form

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert("Login successful!");

       window.location.href = "dashboard.html";

    });

}
