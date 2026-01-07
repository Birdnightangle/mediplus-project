
const CART_KEY = "med_cart";
const ORDERS_KEY = "med_orders";

// ===== Helpers =====
function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function getOrders() { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); }
function saveOrders(o) { localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); }
function clearAllData() { localStorage.clear(); location.reload(); }

// ===== Sample Medicine Data =====
const medicines = [
  { id: 'm1', name: 'Paracetamol 500mg', price: 20, img: 'https://www.shutterstock.com/image-photo/ibuprofeno-acetaminophen-pill-box-paper-260nw-2091336592.jpg' },
  { id: 'm2', name: 'Cough Syrup 100ml', price: 45, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWQY22NUhU5TEXbRxPbY2LHMPSxeVX5pxG5w&s' },
  { id: 'm3', name: 'Vitamin C Tablets', price: 80, img: 'https://media.gettyimages.com/id/2112483848/photo/vitamin-d.jpg?s=612x612&w=gi&k=20&c=iz9k5vq7pDGCKnyFsCb7CcukzqZkvovhsna3AxQiyh4=' },
];

// ===== UI Rendering =====
const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const orderHistory = document.getElementById("orderHistory");

function renderProducts() {
  productGrid.innerHTML = medicines.map(p => `
    <div class="card p-4 flex flex-col">
      <img src="${p.img}" class="rounded-lg h-40 object-cover mb-3">
      <h3 class="font-semibold">${p.name}</h3>
      <p class="text-gray-600">₹${p.price}</p>
      <button class="btn-main mt-3" onclick="addToCart('${p.id}')">Add to Cart</button>
    </div>
  `).join('');
}

function renderCart() {
  const cart = getCart();
  if (cart.length === 0) {
    cartList.innerHTML = `<p class="text-gray-500">Your cart is empty 😢</p>`;
    cartTotal.textContent = "";
    return;
  }

  cartList.innerHTML = cart.map(item => `
    <div class="flex justify-between items-center border-b pb-2">
      <span>${item.name}</span>
      <span>₹${item.price}</span>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `Total: ₹${total}`;
}

function renderOrders() {
  const orders = getOrders();
  if (orders.length === 0) {
    orderHistory.innerHTML = `<p class="text-gray-500">No previous orders yet.</p>`;
    return;
  }

  orderHistory.innerHTML = orders.map(order => `
    <div class="border p-3 rounded-lg">
      <div class="font-semibold">🧾 Order #${order.id}</div>
      <div class="text-gray-600 text-sm">Payment: ${order.paymentMode}</div>
      <div class="mt-1">Items: ${order.items.map(i => i.name).join(', ')}</div>
      <div class="font-medium mt-1">Total: ₹${order.total}</div>
    </div>
  `).join('');
}

// ===== Cart Functions =====
function addToCart(id) {
  const med = medicines.find(m => m.id === id);
  const cart = getCart();
  cart.push(med);
  saveCart(cart);
  renderCart();
}

const paymentModal = document.getElementById('paymentModal');

document.getElementById("checkoutBtn").addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) return alert("Cart is empty!");
  paymentModal.classList.remove('hidden');
});

function closePaymentModal() {
  paymentModal.classList.add('hidden');
}

function processPayment(method) {
  const cart = getCart();
  if (cart.length === 0) return alert("Cart is empty!");

  const order = {
    id: "ORD" + Math.floor(Math.random() * 100000),
    date: new Date().toLocaleString(),
    items: cart.map(c => {
      const med = medicines.find(m => m.id === c.id);
      return { ...med, qty: 1 };
    }),
    total: cart.reduce((sum, c) => sum + (medicines.find(m => m.id === c.id).price * 1), 0),
    paymentMode: method
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
  localStorage.removeItem(CART_KEY);
  
  alert(`Payment of ₹${order.total} with ${method} Successful! Order placed.`);
  
  closePaymentModal();
  renderCart();
  renderOrders();
}

// ===== Initialize =====
renderProducts();
renderCart();
renderOrders();