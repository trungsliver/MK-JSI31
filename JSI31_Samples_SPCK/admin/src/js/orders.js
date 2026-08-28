import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ordersRef = collection(db, "orders");
const ordersContainer = document.getElementById("ordersContainer");
const emptyBox = document.getElementById("emptyBox");
const loadingBox = document.getElementById("loadingBox");
const totalOrders = document.getElementById("totalOrders");
const canceledOrders = document.getElementById("canceledOrders");
const resultCount = document.getElementById("resultCount");
const userSearch = document.getElementById("userSearch");
const dateSearch = document.getElementById("dateSearch");
const totalSearch = document.getElementById("totalSearch");
const statusSearch = document.getElementById("statusSearch");
const clearFilters = document.getElementById("clearFilters");
const menuToggle = document.getElementById("menuToggle");
const adminNav = document.getElementById("adminNav");
let orders = [];
const statuses = ["Pending", "Confirmed", "Shipping", "Returning", "Delivered", "Canceled"];
menuToggle.addEventListener("click", () => adminNav.classList.toggle("show"));
userSearch.addEventListener("input", renderOrders);
dateSearch.addEventListener("change", renderOrders);
totalSearch.addEventListener("input", renderOrders);
statusSearch.addEventListener("change", renderOrders);
clearFilters.addEventListener("click", () => { userSearch.value = ""; dateSearch.value = ""; totalSearch.value = ""; statusSearch.value = ""; renderOrders(); });
function getValue(obj, keys) { for (const key of keys) { if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key]; } return ""; }
function getUserText(order) { const user = order.user || order.customer || {}; if (typeof user === "string") return user; return [getValue(user, ["name", "username", "displayName", "email", "phone"]), getValue(order, ["username", "email", "phone", "userId", "userEmail"])].filter(Boolean).join(" | "); }
function getDateValue(order) { const value = order.createdAt || order.createdAtISO || order.date || order.orderDate || ""; if (value?.toDate) return value.toDate(); if (typeof value === "string") { const date = new Date(value); if (!Number.isNaN(date.getTime())) return date; } return null; }
function formatDate(order) { const date = getDateValue(order); return date ? date.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "Chưa có thời gian"; }
function getProducts(order) { return Array.isArray(order.products) ? order.products : Array.isArray(order.items) ? order.items : []; }
function getProductTotal(product) { const price = Number(getValue(product, ["finalPrice", "price", "amount", "unitPrice"])) || 0; const quantity = Number(getValue(product, ["quantity", "qty"])) || 1; return price * quantity; }
function getOrderTotal(order) { const direct = Number(getValue(order, ["total", "totalPrice", "grandTotal", "amount"])); return direct || getProducts(order).reduce((sum, item) => sum + getProductTotal(item), 0); }
function formatMoney(value) { return Number(value || 0).toLocaleString("vi-VN") + " ₫"; }
function getStatus(order) { return statuses.includes(order.status) ? order.status : "Pending"; }
function getImage(product) { return product.image || "https://cdn-icons-png.flaticon.com/512/1170/1170678.png"; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[char])); }
function renderProducts(order) { const products = getProducts(order); if (!products.length) return '<div class="product-row"><div class="product-info"><div class="product-name">Không có thông tin sản phẩm</div></div></div>'; return products.map(product => { const name = getValue(product, ["name", "title"]) || "Sản phẩm"; const quantity = Number(getValue(product, ["quantity", "qty"])) || 1; const price = Number(getValue(product, ["finalPrice", "price", "amount", "unitPrice"])) || 0; return `<div class="product-row"><img src="${escapeHtml(getImage(product))}" alt=""><div class="product-info"><div class="product-name">${escapeHtml(name)}</div><div class="product-meta">SL: ${quantity} · ${formatMoney(price)}</div></div></div>`; }).join(""); }
function renderOrders() { const userText = userSearch.value.trim().toLowerCase(); const dateText = dateSearch.value; const totalText = totalSearch.value.trim(); const statusText = statusSearch.value; const filtered = orders.filter(order => { const user = getUserText(order).toLowerCase(); const date = getDateValue(order); const total = getOrderTotal(order); const dateValue = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : ""; const matchUser = !userText || user.includes(userText); const matchDate = !dateText || dateValue === dateText; const matchTotal = !totalText || String(Math.round(total)).includes(totalText); const matchStatus = !statusText || getStatus(order) === statusText; return matchUser && matchDate && matchTotal && matchStatus; }); resultCount.textContent = `${filtered.length} đơn hàng`; ordersContainer.innerHTML = filtered.map(renderOrder).join(""); emptyBox.classList.toggle("d-none", filtered.length > 0); document.querySelectorAll(".save-status").forEach(button => button.addEventListener("click", handleStatusUpdate)); }
function renderOrder(order) { const status = getStatus(order); const user = getUserText(order) || "Khách hàng chưa xác định"; const total = getOrderTotal(order); const id = escapeHtml(order.id); const payment = order.payment || {}; const paymentLabel = getValue(payment, ["label", "method"]) || "Chưa xác định"; return `<article class="order-card"><div class="order-top"><div><div class="order-id">#${id}</div><div class="order-user">${escapeHtml(user)}</div><div class="order-date"><i class="bi bi-clock"></i> ${formatDate(order)}</div></div><span class="status-badge status-${status}">${status}</span></div><div class="order-products">${renderProducts(order)}</div><div class="order-bottom"><div class="total-line"><span>Tổng thanh toán</span><strong>${formatMoney(total)}</strong></div><div class="order-actions"><select class="status-select" data-id="${id}">${statuses.map(item => `<option value="${item}" ${item === status ? "selected" : ""}>${item}</option>`).join("")}</select><button class="save-status" data-id="${id}" type="button"><i class="bi bi-check2"></i> Lưu</button></div><div class="payment-note"><i class="bi bi-credit-card"></i> ${escapeHtml(paymentLabel)}</div></div></article>`; }
async function loadOrders() { try { loadingBox.classList.remove("d-none"); const snapshot = await getDocs(ordersRef); orders = snapshot.docs.map(item => ({ id: item.id, ...item.data() })); updateStats(); renderOrders(); } catch (error) { console.error(error); ordersContainer.innerHTML = '<div class="alert alert-danger">Không thể tải đơn hàng từ Firebase Firestore.</div>'; } finally { loadingBox.classList.add("d-none"); } }
function updateStats() { totalOrders.textContent = orders.length; canceledOrders.textContent = orders.filter(order => getStatus(order) === "Canceled").length; }
async function handleStatusUpdate(event) { const button = event.currentTarget; const id = button.dataset.id; const select = document.querySelector(`.status-select[data-id="${id}"]`); const status = select.value; button.disabled = true; try { await updateDoc(doc(db, "orders", id), { status }); const order = orders.find(item => item.id === id); if (order) order.status = status; updateStats(); renderOrders(); showToast("Đã cập nhật trạng thái đơn hàng.", "success"); } catch (error) { console.error(error); showToast("Không thể cập nhật trạng thái đơn hàng.", "danger"); } finally { button.disabled = false; } }
function showToast(message, type) { const wrapper = document.createElement("div"); wrapper.className = `toast align-items-center text-bg-${type} border-0 show toast-message`; wrapper.setAttribute("role", "alert"); wrapper.innerHTML = `<div class="d-flex"><div class="toast-body">${escapeHtml(message)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.closest('.toast').remove()"></button></div>`; document.getElementById("toastContainer").appendChild(wrapper); setTimeout(() => wrapper.remove(), 3000); }
loadOrders();