class Product {
    // Product class
    constructor(info) {
        this.name = info.name
        this.cost = info.cost
        this.url = info.url
        this.category = info.category
        this.id = info.id
    }
}

// Declaration of variables
const productsSection = document.getElementById("productsSection");

// Gets data from a local JSON and renders the website homepage using showIndexProducts
const fetchDataAndRenderProducts = async () => {
    try {
        const response = await fetch("./data/data.json");
        const data = await response.json();

        // Create objects using Products and add them to productsArray
        // This isn't necessary in this case but if Product class was bigger it should be the case
        const productsArray = data.map((productInfo) => new Product(productInfo));

        // Renders products on the DOM
        showIndexProducts(productsArray);
        renderAmountOfItems();
    } catch (error) {
        console.error("Error fetching or rendering products:", error);
        const productsArray = []
        showIndexProducts(productsArray)
        renderAmountOfItems();
    }
};

// Function to render the products on the website homepage
// It only renders the 8 first products
const showIndexProducts = (allProducts) => {
    productsSection.innerHTML = "";
    let productsRendered = 0;
    allProducts.forEach( product => {
        if (productsRendered < 8) {
        let card = document.createElement("article");
        card.classList.add("text-center", "mb-8", "pb-4", "rounded-md", "overflow-hidden");
        card.innerHTML =`<div>
                            <img class="mb-1" src="./assets/img/${product.url}" alt="${product.name}">
                        </div>
                        <p class="my-1 font-bebasneue">${product.name}</p>
                        <h3 class="my-1 font-bebasneue text-2xl">$${product.cost}</h3>
                        <button class="bg-[#C07F00] font-bebasneue text-white px-5 py-2 hover:bg-[#FFD95A]" id="addProduct${product.id}">AGREGAR AL CARRITO</button>`
        productsSection.appendChild(card);
        // We add the EventListener to every button
        let button = document.getElementById(`addProduct${product.id}`);
        button.addEventListener("click", () => {
            addProduct(product.id, allProducts)
            Toastify({
                text: "Producto agregado al carrito",
                duration: 2000,
                gravity: "bottom",
                position: "left",
                style: {
                    background: "radial-gradient(circle, rgba(76,61,61,1) 0%, rgba(45,42,42,1) 100%)",
                },
                ariaLive: "polite",
            }).showToast();
        });
        productsRendered++;
        }
    })
};

// Execution: Show the products on the DOM
fetchDataAndRenderProducts();