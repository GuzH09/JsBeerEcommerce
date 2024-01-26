// Declaration of variables
const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
const shoppingCartContainer = document.getElementById("cartContent")
const totalCostText = document.getElementById("totalCostText");
const itemsAmount = document.getElementById("itemsAmount");

// Function to get the current page name - used to get the correct URL for every image
const getCurrentPageName = () => {
    const pathArray = window.location.pathname.split('/');
    const currentPage = pathArray[pathArray.length - 1].split('.')[0];
    return currentPage;
};

// Function that returns the amount of products in the shopping cart
const renderAmountOfItems = () => {
    let totalQuantity = shoppingCart.reduce((accumulator, product) => {
        return accumulator + (product.amount || 1)
    }, 0);
    totalQuantity>0 ? itemsAmount.innerText = `Tu Carrito(${totalQuantity})` : itemsAmount.innerText = `Tu Carrito`;
}

// Function to render the total cost of the shopping cart
const renderTotalCost = () => {
    const totalCost = shoppingCart.reduce((accumulator, product) => {
        return accumulator + (product.cost * product.amount)
    }, 0);
    totalCostText.innerText = `Costo Total: $${totalCost}`;
}

// Function to empty shopping cart
const emptyShoppingCart = () => {
    if (shoppingCart.length > 0) {
    Swal.fire({
        title: "Estas seguro de vaciar el carrito?",
        text: "No podrás revertirlo una vez eliminado!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, estoy seguro!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Vaciado!",
                    text: "Tu carrito ha sido vaciado.",
                    icon: "success"
                    });
                }
                shoppingCart.length = 0;
                saveShoppingCartToLocalStorage();
                showProductsShoppingCart();
                console.log(shoppingCart);
            });
    }
}

// Function to empty shopping cart when buying the cart
const buyShoppingCart = () => {
    if (shoppingCart.length > 0) {
    Swal.fire({
        title: "Estas seguro de finalizar tu compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, estoy seguro!",
        cancelButtonColor: "#d33",
        cancelButtonText: "No, aun no"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Gracias por tu compra!",
                    icon: "success"
                    });
                }
                shoppingCart.length = 0;
                saveShoppingCartToLocalStorage();
                showProductsShoppingCart();
                console.log(shoppingCart);
            });
    }
}

// Function to delete a single item from the shopping cart
const deleteProduct = (id) => {
    // We check if the product is already in the shopping cart
    const existingProductIndex = shoppingCart.findIndex((item) => item.id === id);
    if (existingProductIndex !== -1) {
        if (shoppingCart[existingProductIndex].amount <= 1) {
            // If the product quantity is 1 or less, remove the entire product from the cart
            shoppingCart.splice(existingProductIndex, 1);
        } else {
            // If the product quantity is greater than 1, decrement the amount
            shoppingCart[existingProductIndex].amount -= 1;
        }
    }
    saveShoppingCartToLocalStorage();
    showProductsShoppingCart();
    console.log(shoppingCart);
};

// Function to toggle the shopping cart visibility
const toggleShoppingCart = () => {
    const cart = document.getElementById("shoppingCartSection");
    const overlay = document.getElementById("overlay");
    cart.classList.toggle("right-[0px]");
    cart.classList.toggle("-right-full");
    overlay.classList.toggle("hidden");
    showProductsShoppingCart()
};

// Function to close the shopping cart
const closeShoppingCart = () => {
    const cart = document.getElementById("shoppingCartSection");
    const overlay = document.getElementById("overlay");
    cart.classList.toggle("right-[0px]");
    cart.classList.toggle("-right-full");
    overlay.classList.add("hidden");
};

// Save the shopping cart to localStorage
const saveShoppingCartToLocalStorage = () => {
    const cartString = JSON.stringify(shoppingCart);
    localStorage.setItem("shoppingCart", cartString);
};

// Add products to the Shopping Cart
const addProduct = (id, productsArray) => {
    // We search the product with the id
    const product = productsArray.find((item) => item.id === id);
    // We check if the product is already in the shopping cart
    const existingProductIndex = shoppingCart.findIndex((item) => item.id === id);

    if (existingProductIndex !== -1) {
        // If the product is already in the cart, increment the amount
        shoppingCart[existingProductIndex].amount += 1;
    } else {
        // If the product is not in the cart, create a copy and add it with amount set to 1
        const productCopy = { ...product, amount: 1};
        shoppingCart.push(productCopy);
    }
    
    // Save the updated shopping cart to localStorage
    renderAmountOfItems();
    saveShoppingCartToLocalStorage();
    console.log(shoppingCart);
};

// Function to render the products on the shopping cart
const showProductsShoppingCart = () => {
    if (shoppingCart.length > 0) {
        const currentPage = getCurrentPageName();
        currentPage === 'index' ? imageBaseURL = './assets/img' : imageBaseURL = '../assets/img'

        shoppingCartContainer.innerHTML = "";
        shoppingCart.forEach(product => {
            let card = document.createElement("article");
            card.classList.add("flex", "text-center", "pb-4", "items-center");
            card.innerHTML =`<div class="w-1/3 rounded-md overflow-hidden mr-4">
                                <img src="${imageBaseURL}/${product.url}" alt="${product.name}">
                            </div>
                            <div class="w-2/3 text-left">
                                <h2 class="font-bebasneue text-white">${product.name}(${product.amount})</p>
                                <h3 class="font-bebasneue text-white text-2xl">$${product.cost*product.amount}</h3>
                                <button class="material-symbols-outlined text-white" id="deleteProduct${product.id}">delete</button>
                            </div>`
            shoppingCartContainer.appendChild(card);
            // We add the EventListener to every button
            let button = document.getElementById(`deleteProduct${product.id}`);
            button.addEventListener("click", () => deleteProduct(product.id));
        })
    } else {
        shoppingCartContainer.innerHTML = `<div class="flex justify-center">
                                            <h2 class="font-bebasneue text-lg text-white font-light">Tu carrito está vacío.</h2>
                                            </div>`;
    }
    renderTotalCost();
    renderAmountOfItems();
}