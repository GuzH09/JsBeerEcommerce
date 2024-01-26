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
const categoryButtons = document.querySelectorAll("#sortCategories button");
const costFilterButtons = document.querySelectorAll("#filterCategories button");
const sortSelect = document.getElementById("sort");
let filteredProducts = [] // This variable is used to keep track of filtered products

// Gets data from a local JSON and renders the website homepage using showIndexProducts
const fetchProductsAndRenderPage = async () => {
    try {
        const response = await fetch("../data/data.json");
        const data = await response.json();

        // Create objects using Products and add them to productsArray
        // This isn't necessary in this case but if the Product class class was bigger it should be the case
        const productsArray = data.map((productInfo) => new Product(productInfo));
        filteredProducts = productsArray // This variable is used to keep track of filtered products when using categories or cost buttons

        // Adds event listeners on buttons for sorting and filter
        sortSelect.addEventListener("change", handleSort);
        // This buttons are already on the HTML
        // But i think it would be best practice if the categories were created
        // based on the categories and costs of the products from the database
        // So, if we decide to create a new category, we don't need to change the HTML or the button filters manually
        categoryButtons.forEach((button) => {
            button.addEventListener("click", () => handleCategoryFilter(button, productsArray));
        });
        costFilterButtons.forEach((button) => {
            button.addEventListener("click", () => handleCostFilter(button, productsArray));
        });

        // Renders products on the DOM
        showProductsPage(productsArray)
        renderAmountOfItems();

    } catch (error) {
        console.error("Error fetching or rendering products:", error);
        const productsArray = []
        filteredProducts = productsArray // This variable is used to keep track of filtered products

        // Adds event listeners on buttons for sorting and filter
        sortSelect.addEventListener("change", handleSort);
        categoryButtons.forEach((button) => {
            button.addEventListener("click", () => handleCategoryFilter(button, productsArray));
        });
        costFilterButtons.forEach((button) => {
            button.addEventListener("click", () => handleCostFilter(button, productsArray));
        });

        // Renders products on the DOM
        showProductsPage(productsArray)
        renderAmountOfItems();
    }
};

const handleSort = () => {
    const selectedOption = sortSelect.value;

    switch (selectedOption) {
        case "price-ascending":
            // Sort by price in ascending order
            filteredProducts.sort((a, b) => a.cost - b.cost);
            break;

        case "price-descending":
            // Sort by price in descending order
            filteredProducts.sort((a, b) => b.cost - a.cost);
            break;

        case "alpha-ascending":
            // Sort alphabetically by product name (A - Z)
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;

        case "alpha-descending":
            // Sort alphabetically by product name (Z - A)
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;

        default:
            // Default sorting logic (e.g., by price in ascending order)
            filteredProducts.sort((a, b) => a.cost - b.cost);
            break;
    }

    // Call the function to render the sorted products on the page
    showProductsPage(filteredProducts);
};

const handleCategoryFilter = (button, productsArray) => {
    const buttonText = button.textContent;
    const category = mapButtonToCategory(buttonText);
    if (category === "todos") {
        // Show all products when "Todos" button is clicked
        filteredProducts = productsArray
        
    } else {
        // Filter products based on the mapped category
        filteredProducts = productsArray.filter((product) => product.category === category);
    }
    showProductsPage(filteredProducts);
};

const handleCostFilter = (button, productsArray) => {
    // Using regular expresions to get the int from the category text
    const minCost = parseInt(button.textContent.replace(/[^\d]/g, ''), 10);
    filteredProducts = productsArray.filter((product) => product.cost >= minCost);
    showProductsPage(filteredProducts);
}

// Function to map button text to product category
const mapButtonToCategory = (buttonText) => {
    const categoryMap = {
        "Latas": "lata",
        "Packs de Latas": "pack",
        "Vasos": "vaso",
        "Todos": "todos"
    };
    // Use the mapping or default to the button text if not found
    return categoryMap[buttonText] || buttonText.trim().toLowerCase();
};

// Function to render the products on the Products Page
// It only renders the 8 first products
const showProductsPage = (allProducts) => {
    productsSection.innerHTML = "";
    allProducts.forEach( product => {
        let card = document.createElement("article");
        card.classList.add("text-center", "mb-8", "pb-4", "rounded-md", "overflow-hidden");
        card.innerHTML =`<div>
                            <img class="mb-1" src="../assets/img/${product.url}" alt="${product.name}">
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
    })
};

// Execution: Show the products on the DOM
fetchProductsAndRenderPage();