// Sistema de Carrito de Compras Nativa
(function() {
  const CART_STORAGE_KEY = 'nativa_cart_v1';

  // Obtener carrito de localStorage
  function getStoredCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer el carrito de localStorage:', e);
      return [];
    }
  }

  // Guardar carrito en localStorage
  function saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      updateCartUI();
    } catch (e) {
      console.error('Error al guardar el carrito:', e);
    }
  }

  // Formateador de moneda en pesos
  function formatMoney(amount) {
    return '$' + Number(amount).toLocaleString('es-CL');
  }

  // Agregar producto al carrito
  function addToCart(productId, quantity = 1) {
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;
    if (!product) {
      console.warn('Producto no encontrado:', productId);
      return;
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    let cart = getStoredCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        priceNum: product.priceNum,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: qty
      });
    }

    saveCart(cart);
    showToast(`✓ "${product.name}" agregado al carrito (${qty} un.)`);
    openCart();
  }

  // Remover producto del carrito
  function removeFromCart(productId) {
    let cart = getStoredCart();
    const removedItem = cart.find(i => i.id === productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    if (removedItem) {
      showToast(`Producto eliminado del carrito`);
    }
  }

  // Modificar cantidad
  function updateQuantity(productId, delta) {
    let cart = getStoredCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      saveCart(cart);
    }
  }

  // Vaciar carrito
  function clearCart() {
    saveCart([]);
    showToast('El carrito ha sido vaciado');
  }

  // Obtener totales
  function getCartTotals() {
    const cart = getStoredCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
    const shipping = subtotal > 0 && subtotal < 25000 ? 2990 : 0;
    const total = subtotal + shipping;
    return { count, subtotal, shipping, total };
  }

  // Mostrar Toast
  function showToast(message) {
    let toast = document.getElementById('nativa-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'nativa-toast';
      toast.className = 'nativa-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Abrir y cerrar Drawer
  function openCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      renderCartDrawer();
    }
  }

  function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Renderizar contenido del Drawer
  function renderCartDrawer() {
    const cart = getStoredCart();
    const { count, subtotal, shipping, total } = getCartTotals();
    const itemsContainer = document.getElementById('cart-items-container');
    const countBadge = document.getElementById('cart-drawer-count');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');
    const emptyState = document.getElementById('cart-empty-state');
    const footerEl = document.getElementById('cart-drawer-footer');

    if (countBadge) countBadge.textContent = `${count} producto${count === 1 ? '' : 's'}`;

    if (!itemsContainer) return;

    if (cart.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';

    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <a href="producto.html?id=${item.id}" class="cart-item-img-link" title="Ver producto">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        </a>
        <div class="cart-item-info">
          <div class="cart-item-header">
            <a href="producto.html?id=${item.id}" class="cart-item-name">${item.name}</a>
            <button class="cart-item-remove-btn" data-action="remove" data-id="${item.id}" title="Eliminar del carrito" aria-label="Eliminar ${item.name}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="cart-item-price-unit">${formatMoney(item.priceNum)} c/u</div>
          <div class="cart-item-controls">
            <div class="cart-qty-selector">
              <button class="cart-qty-btn" data-action="decrease" data-id="${item.id}" title="Disminuir">-</button>
              <span class="cart-qty-number">${item.quantity}</span>
              <button class="cart-qty-btn" data-action="increase" data-id="${item.id}" title="Aumentar">+</button>
            </div>
            <div class="cart-item-subtotal">${formatMoney(item.priceNum * item.quantity)}</div>
          </div>
        </div>
      </div>
    `).join('');

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? '¡Gratis!' : formatMoney(shipping);
    if (totalEl) totalEl.textContent = formatMoney(total);
  }

  // Actualizar badges en navbar
  function updateCartUI() {
    const { count } = getCartTotals();
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
    renderCartDrawer();
  }

  // Inyectar HTML del Drawer y Modal si no están en el DOM
  function injectCartDOM() {
    if (document.getElementById('cart-drawer')) return;

    const dom = `
      <!-- Overlay -->
      <div id="cart-drawer-overlay" class="cart-drawer-overlay"></div>

      <!-- Drawer Carrito -->
      <aside id="cart-drawer" class="cart-drawer" role="dialog" aria-labelledby="cart-title">
        <div class="cart-drawer-header">
          <div class="cart-drawer-title-box">
            <i class="fas fa-shopping-basket"></i>
            <h3 id="cart-title">Tu Carrito</h3>
            <span id="cart-drawer-count" class="cart-items-tag">0 productos</span>
          </div>
          <button id="cart-close-btn" class="cart-close-btn" aria-label="Cerrar carrito">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="cart-drawer-body">
          <div id="cart-empty-state" class="cart-empty-state">
            <div class="cart-empty-icon"><i class="fas fa-shopping-cart"></i></div>
            <h4>Tu carrito está vacío</h4>
            <p>Aún no has agregado productos naturales a tu carrito.</p>
            <a href="index.html#portfolio" class="btn btn-nativa" id="btn-browse-catalog">Explorar Catálogo</a>
          </div>
          <div id="cart-items-container" class="cart-items-list"></div>
        </div>

        <div id="cart-drawer-footer" class="cart-drawer-footer">
          <div class="cart-summary-line">
            <span>Subtotal:</span>
            <strong id="cart-subtotal">$0</strong>
          </div>
          <div class="cart-summary-line">
            <span>Envío estimado:</span>
            <span id="cart-shipping" class="free-shipping-tag">¡Gratis!</span>
          </div>
          <div class="cart-summary-total">
            <span>Total a Pagar:</span>
            <strong id="cart-total">$0</strong>
          </div>

          <div class="cart-footer-actions">
            <button id="btn-checkout" class="btn btn-checkout">
              <i class="fas fa-credit-card"></i> Comprar Ahora
            </button>
            <button id="btn-clear-cart" class="btn-clear-cart">
              <i class="fas fa-trash"></i> Vaciar Carrito
            </button>
          </div>
        </div>
      </aside>

      <!-- Modal de Checkout / Compra -->
      <div id="checkout-modal" class="checkout-modal-overlay">
        <div class="checkout-modal-card">
          <div class="checkout-modal-header">
            <h3><i class="fas fa-leaf"></i> Finalizar Compra en Nativa</h3>
            <button id="checkout-close-btn" class="checkout-close-btn" aria-label="Cerrar">&times;</button>
          </div>
          
          <div id="checkout-step-form" class="checkout-body">
            <div class="checkout-products-summary" id="checkout-products-summary"></div>
            
            <form id="checkout-form" class="checkout-form">
              <h4>Datos de Envío y Contacto</h4>
              <div class="form-row">
                <div class="form-group">
                  <label for="order-name">Nombre Completo *</label>
                  <input type="text" id="order-name" required placeholder="Ej. Camila Pérez">
                </div>
                <div class="form-group">
                  <label for="order-phone">Teléfono / WhatsApp *</label>
                  <input type="tel" id="order-phone" required placeholder="+56 9 1234 5678">
                </div>
              </div>
              <div class="form-group">
                <label for="order-email">Correo Electrónico *</label>
                <input type="email" id="order-email" required placeholder="ejemplo@correo.com">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="order-address">Dirección de Entrega *</label>
                  <input type="text" id="order-address" required placeholder="Calle, número, depto">
                </div>
                <div class="form-group">
                  <label for="order-city">Ciudad / Comuna *</label>
                  <input type="text" id="order-city" required placeholder="Santiago, Valparaíso...">
                </div>
              </div>
              <div class="form-group">
                <label for="order-notes">Notas especiales (opcional)</label>
                <textarea id="order-notes" rows="2" placeholder="Indicaciones para la entrega..."></textarea>
              </div>

              <div class="form-group payment-options">
                <label>Método de Pago:</label>
                <div class="payment-radios">
                  <label class="radio-label">
                    <input type="radio" name="payment-method" value="transfer" checked>
                    <span><i class="fas fa-university"></i> Transferencia Bancaria Directa</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="payment-method" value="card">
                    <span><i class="fas fa-credit-card"></i> Tarjeta Débito / Crédito</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="payment-method" value="cash">
                    <span><i class="fas fa-money-bill-wave"></i> Pago Contra Entrega</span>
                  </label>
                </div>
              </div>

              <div class="checkout-footer-buttons">
                <button type="button" id="btn-cancel-checkout" class="btn btn-secondary-outline">Volver al Carrito</button>
                <button type="submit" id="btn-confirm-order" class="btn btn-confirm-order">
                  <i class="fas fa-check-circle"></i> Confirmar Pedido (<span id="modal-order-total">$0</span>)
                </button>
              </div>
            </form>
          </div>

          <!-- Pantalla de Éxito / Confirmación -->
          <div id="checkout-step-success" class="checkout-body success-state" style="display: none;">
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <h3>¡Gracias por tu compra en Nativa!</h3>
            <p class="success-order-num">Número de Pedido: <strong id="order-id-display">#NAT-8492</strong></p>
            <p class="success-lead">Hemos recibido tu solicitud de pedido. Nos contactaremos de inmediato por WhatsApp/Email para coordinar el despacho de tus productos naturales.</p>
            
            <div id="success-order-details" class="success-order-box"></div>

            <div class="success-actions">
              <a href="index.html" class="btn btn-nativa" id="btn-return-home">Volver al Catálogo</a>
            </div>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.id = 'nativa-cart-root';
    container.innerHTML = dom;
    document.body.appendChild(container);

    // Eventos del DOM inyectado
    document.getElementById('cart-drawer-overlay').addEventListener('click', closeCart);
    document.getElementById('cart-close-btn').addEventListener('click', closeCart);
    document.getElementById('btn-browse-catalog')?.addEventListener('click', closeCart);
    
    // Vaciar carrito
    document.getElementById('btn-clear-cart').addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
        clearCart();
      }
    });

    // Delegación de eventos en la lista de items
    document.getElementById('cart-items-container').addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
      const action = button.dataset.action;
      const id = button.dataset.id;
      if (action === 'remove') {
        removeFromCart(id);
      } else if (action === 'increase') {
        updateQuantity(id, 1);
      } else if (action === 'decrease') {
        updateQuantity(id, -1);
      }
    });

    // Abrir checkout
    document.getElementById('btn-checkout').addEventListener('click', openCheckoutModal);

    // Eventos del modal
    document.getElementById('checkout-close-btn').addEventListener('click', closeCheckoutModal);
    document.getElementById('btn-cancel-checkout').addEventListener('click', closeCheckoutModal);

    // Submit del pedido
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
      e.preventDefault();
      processOrder();
    });
  }

  // Abrir modal de checkout
  function openCheckoutModal() {
    const cart = getStoredCart();
    if (cart.length === 0) {
      showToast('Tu carrito está vacío');
      return;
    }

    closeCart();

    const { subtotal, shipping, total } = getCartTotals();
    const modal = document.getElementById('checkout-modal');
    const summaryContainer = document.getElementById('checkout-products-summary');
    const modalTotal = document.getElementById('modal-order-total');
    const stepForm = document.getElementById('checkout-step-form');
    const stepSuccess = document.getElementById('checkout-step-success');

    if (stepForm) stepForm.style.display = 'block';
    if (stepSuccess) stepSuccess.style.display = 'none';

    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div class="checkout-summary-card">
          <h5>Resumen de tu pedido (${cart.length} tipo${cart.length === 1 ? '' : 's'} de producto):</h5>
          <ul class="checkout-mini-list">
            ${cart.map(i => `
              <li>
                <span>${i.quantity}x ${i.name}</span>
                <strong>${formatMoney(i.priceNum * i.quantity)}</strong>
              </li>
            `).join('')}
          </ul>
          <div class="checkout-mini-total">
            <span>Subtotal: ${formatMoney(subtotal)} | Envío: ${shipping === 0 ? 'Gratis' : formatMoney(shipping)}</span>
            <h4>Total: ${formatMoney(total)}</h4>
          </div>
        </div>
      `;
    }

    if (modalTotal) modalTotal.textContent = formatMoney(total);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Procesar pedido
  function processOrder() {
    const cart = getStoredCart();
    const { total, subtotal, shipping } = getCartTotals();
    const name = document.getElementById('order-name').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const email = document.getElementById('order-email').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const city = document.getElementById('order-city').value.trim();
    const notes = document.getElementById('order-notes').value.trim();
    const payment = document.querySelector('input[name="payment-method"]:checked')?.value || 'transfer';

    const orderNum = 'NAT-' + Math.floor(100000 + Math.random() * 900000);
    const paymentLabels = {
      'transfer': 'Transferencia Bancaria',
      'card': 'Tarjeta Débito / Crédito',
      'cash': 'Pago Contra Entrega'
    };

    const detailsContainer = document.getElementById('success-order-details');
    if (detailsContainer) {
      detailsContainer.innerHTML = `
        <div class="order-confirm-box">
          <p><strong>Cliente:</strong> ${name}</p>
          <p><strong>Contacto:</strong> ${phone} | ${email}</p>
          <p><strong>Despacho:</strong> ${address}, ${city}</p>
          <p><strong>Forma de Pago:</strong> ${paymentLabels[payment] || payment}</p>
          <hr style="margin: 10px 0; border: none; border-top: 1px dashed #ccc;">
          <p><strong>Total Cancelado:</strong> <span style="font-size: 1.2em; color: #285943; font-weight: bold;">${formatMoney(total)}</span></p>
        </div>
      `;
    }

    document.getElementById('order-id-display').textContent = `#${orderNum}`;
    document.getElementById('checkout-step-form').style.display = 'none';
    document.getElementById('checkout-step-success').style.display = 'block';

    // Limpiar carrito en almacenamiento
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartUI();
  }

  // Setup de listeners globales en página
  function setupPageListeners() {
    // Botones de agregar al carrito por clase o atributo
    document.addEventListener('click', (e) => {
      // Botón agregar al carrito
      const addBtn = e.target.closest('[data-add-cart]');
      if (addBtn) {
        e.preventDefault();
        const productId = addBtn.dataset.addCart;
        const qtyInput = document.getElementById('product-quantity-input');
        const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
        addToCart(productId, qty || 1);
        return;
      }

      // Botón abrir carrito desde header o nav
      const openBtn = e.target.closest('#open-cart-btn, .open-cart-trigger');
      if (openBtn) {
        e.preventDefault();
        openCart();
        return;
      }
    });
  }

  // Inicialización cuando carga el DOM
  document.addEventListener('DOMContentLoaded', () => {
    injectCartDOM();
    setupPageListeners();
    updateCartUI();
  });

  // Exportar API global
  window.NativaCart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    getCart: getStoredCart,
    getTotals: getCartTotals,
    formatMoney
  };
})();
