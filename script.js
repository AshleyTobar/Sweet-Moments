
// ================= MENÚ MÓVIL =================

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

// ================= BUSCADOR =================

const searchBtn = document.getElementById("searchBtn");
const searchPanel = document.getElementById("searchPanel");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {
  searchPanel.classList.toggle("open");

  if (searchPanel.classList.contains("open")) {
    searchInput.focus();
  }
});

closeSearch.addEventListener("click", () => {
  searchPanel.classList.remove("open");
  searchInput.value = "";
  filterProducts("");
});

searchInput.addEventListener("input", () => {
  filterProducts(searchInput.value.toLowerCase());
});

function filterProducts(search) {
  const products = document.querySelectorAll(".product-card");

  products.forEach(product => {
    const name = product.dataset.name.toLowerCase();
    const category = product.dataset.category.toLowerCase();

    if (name.includes(search) || category.includes(search)) {
      product.classList.remove("hidden");
    } else {
      product.classList.add("hidden");
    }
  });
}

// ================= FILTROS DE CATEGORÍAS =================

const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {

    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const selectedCategory = button.dataset.category;
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
      if (
        selectedCategory === "todos" ||
        product.dataset.category === selectedCategory
      ) {
        product.classList.remove("hidden");
      } else {
        product.classList.add("hidden");
      }
    });

    searchInput.value = "";
  });
});

// ================= FAVORITOS =================

const favoriteButtons = document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("liked");

    if (button.classList.contains("liked")) {
      button.textContent = "♥";
    } else {
      button.textContent = "♡";
    }
  });
});

// ================= CARRITO =================

let cart = [];

const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

document.querySelectorAll(".add-cart").forEach(button => {
  button.addEventListener("click", () => {

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    addToCart(name, price);
  });
});

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();

  // Pequeña animación visual
  cartBtn.style.transform = "scale(1.2)";

  setTimeout(() => {
    cartBtn.style.transform = "scale(1)";
  }, 200);
}

function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
  } else {
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
        </div>
        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
        <button class="remove-item" data-index="${index}">Eliminar</button>
      `;

      cartItems.appendChild(cartItem);
    });
  }

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  cartTotal.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = totalItems;

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index);
      cart.splice(index, 1);
      updateCart();
    });
  });
}

cartBtn.addEventListener("click", () => {
  cartModal.classList.add("open");
});

closeCart.addEventListener("click", () => {
  cartModal.classList.remove("open");
});

// ================= MODAL DE PRODUCTOS =================

const productModal = document.getElementById("productModal");
const closeProduct = document.getElementById("closeProduct");

const modalProductImage = document.getElementById("modalProductImage");
const modalProductCategory = document.getElementById("modalProductCategory");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById("modalProductDescription");
const modalProductPrice = document.getElementById("modalProductPrice");
const modalAddCart = document.getElementById("modalAddCart");

let selectedProduct = null;

document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", event => {

    // Si se hizo clic en favoritos o agregar al carrito, no abre el modal
    if (
      event.target.closest(".favorite-btn") ||
      event.target.closest(".add-cart")
    ) {
      return;
    }

    const image = card.querySelector("img").src;
    const category = card.querySelector(".product-category").textContent;
    const name = card.dataset.name;
    const description = card.querySelector(".product-info p").textContent;
    const price = card.querySelector(".product-bottom strong").textContent;

    selectedProduct = {
      name: name,
      price: parseFloat(card.querySelector(".add-cart").dataset.price)
    };

    modalProductImage.src = image;
    modalProductImage.alt = name;
    modalProductCategory.textContent = category;
    modalProductName.textContent = name;
    modalProductDescription.textContent = description;
    modalProductPrice.textContent = price;

    productModal.classList.add("open");
  });
});

closeProduct.addEventListener("click", () => {
  productModal.classList.remove("open");
});

modalAddCart.addEventListener("click", () => {
  if (selectedProduct) {
    addToCart(selectedProduct.name, selectedProduct.price);
    productModal.classList.remove("open");
    cartModal.classList.add("open");
  }
});

// ================= CERRAR MODALES =================

window.addEventListener("click", event => {
  if (event.target === cartModal) {
    cartModal.classList.remove("open");
  }

  if (event.target === productModal) {
    productModal.classList.remove("open");
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    cartModal.classList.remove("open");
    productModal.classList.remove("open");
    searchPanel.classList.remove("open");
  }
});

// ================= FORMULARIO =================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  formMessage.textContent = "¡Gracias! Tu mensaje ha sido enviado. ♡";
  contactForm.reset();

  setTimeout(() => {
    formMessage.textContent = "";
  }, 5000);
});

// ================= PEDIDO =================

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío. Agrega un postre primero.");
    return;
  }

  alert("¡Gracias por tu pedido! Pronto podrás conectar este botón con WhatsApp.");
});

// ================= NAVEGACIÓN ACTIVA =================

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;

    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});