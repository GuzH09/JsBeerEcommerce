// JavaScript to handle the shopping cart
import Swal from 'sweetalert2';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css";

document.addEventListener("astro:page-load", async () => {
  const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  const itemsAmount = document.getElementById("itemsAmount");
  const overlayCart = document.getElementById("overlayCart");
  const cart = document.getElementById("shoppingCartSection");
  const shoppingCartContainer = document.getElementById("cartContent");
  const totalCostText = document.getElementById("totalCostText");

  const closeCart = document.getElementById("closeCart");
  const emptyCart = document.getElementById("emptyCart");
  const buyingCart = document.getElementById("buyingCart");

  // Listener to toggle the shopping cart from the Header
  itemsAmount.addEventListener("click", (event) => {
    event.stopPropagation(); // Stop clicks from propagating
    toggleShoppingCart()
  })

  // Listener to close the shopping cart from the cart
  closeCart.addEventListener("click", (event) => {
    event.stopPropagation(); // Stop clicks from propagating
    toggleShoppingCart()
  });

  // Prevent clicks on the overlay from reaching the content below
  overlayCart.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleShoppingCart();
  });

  // Listener to empty the shopping cart from the cart
  emptyCart.addEventListener("click", (event) => {
    event.stopPropagation(); // Stop clicks from propagating
    emptyShoppingCart()
  });

  // Listener to buy the shopping cart from the cart
  buyingCart.addEventListener("click", (event) => {
    event.stopPropagation(); // Stop clicks from propagating
    buyShoppingCart()
  });

  // Function to toggle the shopping cart visibility
  const toggleShoppingCart = () => {
    document.startViewTransition()
    cart.classList.toggle("right-[0px]");
    cart.classList.toggle("-right-full");
    overlayCart.classList.toggle("hidden");
    showProductsShoppingCart()
  };

  // Function to render the products on the shopping cart
  const showProductsShoppingCart = () => {
    if (shoppingCart.length > 0) {

      shoppingCartContainer.innerHTML = "";
      shoppingCart.forEach(product => {
        let card = document.createElement("article");
        card.classList.add("flex", "text-center", "pb-4", "items-center");
        
        // Construct the URL for the optimized image using Astro's _image endpoint
        const optimizedImageSrc = `/_image?href=${encodeURIComponent(product.imageSrc.src)}&w=200&h=200&q=mid&f=webp`;
        
        card.innerHTML = `
        <div class="w-1/3 rounded-md overflow-hidden mr-4">
          <img 
            src="${optimizedImageSrc}"
            alt="${product.imageAlt}" 
            loading="lazy" 
            decoding="async"
            width="100" 
            height="100"
          >
        </div>
        <div class="w-2/3 text-left">
          <h2 class="font-bebasneue text-white">${product.name} (${product.amount})</h2>
          <h3 class="font-bebasneue text-white text-2xl">$${product.cost * product.amount}</h3>
          <button class="material-symbols-outlined text-white" id="deleteProduct${product.id}">delete</button>
        </div>`;

        shoppingCartContainer.appendChild(card);

        // Add event listener to delete button
        let deleteButton = document.getElementById(`deleteProduct${product.id}`);
        deleteButton.addEventListener("click", () => deleteProduct(product.id));
      });
    } else {
      shoppingCartContainer.innerHTML = `
      <div class="flex justify-center">
        <h2 class="font-bebasneue text-lg text-white font-light">Tu carrito está vacío.</h2>
      </div>
      `;
    }
    renderTotalCost();
    renderAmountOfItems();
  };

  // Function to render the total cost of the shopping cart
  const renderTotalCost = () => {
    const totalCost = shoppingCart.reduce((accumulator, product) => {
      return accumulator + (product.cost * product.amount)
    }, 0);
    totalCostText.innerText = `Costo Total: $${totalCost}`;
  };

  // Function that returns the amount of products in the shopping cart
  const renderAmountOfItems = () => {
    let totalQuantity = shoppingCart.reduce((accumulator, product) => {
      return accumulator + (product.amount || 1)
    }, 0);
    totalQuantity>0 ? itemsAmount.innerText = `Tu Carrito(${totalQuantity})` : itemsAmount.innerText = `Tu Carrito`;
  };

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
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Vaciado!",
            text: "Tu carrito ha sido vaciado.",
            icon: "success"
          });
          shoppingCart.length = 0;
          saveShoppingCartToLocalStorage();
          showProductsShoppingCart();
        }
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
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Gracias por tu compra!",
            icon: "success"
          });
          shoppingCart.length = 0;
          saveShoppingCartToLocalStorage();
          showProductsShoppingCart();
        }
      });
    }
  }

  // Function to add products to the Shopping Cart
  const addProduct = async (id) => {
    // Get the product with the exact same id
    const response = await fetch(`${window.location.origin}/api/products/${id}`);
    const product = await response.json();

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
  };

  // Save the shopping cart to localStorage
  const saveShoppingCartToLocalStorage = () => {
    const cartString = JSON.stringify(shoppingCart);
    localStorage.setItem("shoppingCart", cartString);
  };

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
  };

  if (window.location.pathname === "/") {
    const buttons = document.querySelectorAll('button[data-product-id]');

    // Listener for each button to add product to the shopping cart
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const productId = button.getAttribute('data-product-id');
        addProduct(Number(productId));
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
    });

  } else if (window.location.pathname === "/productos") {
    const productsSection = document.getElementById("productsSection");
    const categoryButtons = document.querySelectorAll("#sortCategories button");
    const costFilterButtons = document.querySelectorAll("#filterCategories button");
    const sortSelect = document.getElementById("sort");
    let filteredProducts = [] // This variable is used to keep track of filtered products

    // Gets data from a local JSON endpoint and renders the website
    const fetchProductsAndRenderPage = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/products/`);
        const productsArray = await response.json();
        filteredProducts = productsArray // This variable is used to keep track of filtered products

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
    };
  
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
  
        // Construct the URL for the optimized image using Astro's _image endpoint
        const optimizedImageSrc = `/_image?href=${encodeURIComponent(product.imageSrc.src)}&w=400&h=400&q=high&f=webp`;
  
        card.innerHTML =`
        <div>
          <img
            class="mb-1"
            src="${optimizedImageSrc}"
            alt="${product.imageAlt}" 
            loading="lazy" 
            decoding="async"
            width="300" 
            height="300"
          >
        </div>
        <p class="my-1 font-bebasneue">${product.name}</p>
        <h3 class="my-1 font-bebasneue text-2xl">$${product.cost}</h3>
        <button 
          class="bg-[#C07F00] font-bebasneue text-white px-5 py-2 hover:bg-[#FFD95A]" 
          id="addProduct${product.id}"
        >AGREGAR AL CARRITO
        </button>`;
  
        productsSection.appendChild(card);
        
        // We add the EventListener to every button
        let button = document.getElementById(`addProduct${product.id}`);
        button.addEventListener("click", () => {
          addProduct(product.id)
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

    fetchProductsAndRenderPage();
  }

  console.log("Products loaded - rendered page - javascript hydrated")
  renderAmountOfItems();
});