// Sistema de Carrito de Compras Nativa
(function() {
  const CART_STORAGE_KEY = 'nativa_cart_v1';

  // Obtener carrito de localStorage (sincronizando con precios actuales)
  function getStoredCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      const list = data ? JSON.parse(data) : [];
      if (Array.isArray(list) && typeof getProductById === 'function') {
        let changed = false;
        list.forEach(item => {
          const prod = getProductById(item.id);
          if (prod && item.priceNum !== prod.priceNum) {
            item.priceNum = prod.priceNum;
            item.price = prod.price;
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(list));
        }
      }
      return list;
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

  // Formateador de moneda en pesos colombianos (COP)
  function formatMoney(amount) {
    const num = Math.round(Number(amount) || 0);
    return '$ ' + num.toLocaleString('es-CO');
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
  function updateQuantity(productId, delta, isAbsolute = false) {
    let cart = getStoredCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
      if (isAbsolute) {
        cart[index].quantity = delta;
      } else {
        cart[index].quantity += delta;
      }
      
      if (cart[index].quantity > 50) {
        cart[index].quantity = 50;
        showToast('Máximo 50 unidades por producto');
      }

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
    const shipping = subtotal > 0 && subtotal < 70000 ? 9000 : 0;
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
              <input type="number" class="cart-qty-number" data-action="manual" data-id="${item.id}" value="${item.quantity}" min="1" max="50">
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

      const colombianCities = [
      "Bogotá, D.C.",
      "Medellín, Antioquia",
      "Cali, Valle del Cauca",
      "Barranquilla, Atlántico",
      "Cartagena, Bolívar",
      "Bucaramanga, Santander",
      "Pereira, Risaralda",
      "Santa Marta, Magdalena",
      "Manizales, Caldas",
      "Cúcuta, Norte de Santander",
      "Ibagué, Tolima",
      "Villavicencio, Meta",
      "Pasto, Nariño",
      "Montería, Córdoba",
      "Neiva, Huila",
      "Armenia, Quindío",
      "Popayán, Cauca",
      "Valledupar, Cesar",
      "Tunja, Boyacá",
      "Riohacha, La Guajira",
      "Quibdó, Chocó",
      "Sincelejo, Sucre",
      "Florencia, Caquetá",
      "Yopal, Casanare",
      "Arauca, Arauca",
      "San José del Guaviare, Guaviare",
      "Mocoa, Putumayo",
      "Leticia, Amazonas",
      "Inírida, Guainía",
      "Mitú, Vaupés",
      "Puerto Carreño, Vichada",
      "San Andrés, San Andrés y Providencia"
    ];

    const cityOptionsHtml = colombianCities.map(c => `<option value="${c}">${c}</option>`).join('');

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
            
            <form id="checkout-form" class="checkout-form">
              <h4>Datos de Envío y Contacto</h4>
              <div class="form-row">
                <div class="form-group">
                  <label for="order-name">Nombre Completo *</label>
                  <input type="text" id="order-name" required placeholder="Ej. Camila Pérez">
                </div>
                <div class="form-group">
                  <label for="order-phone">Teléfono / WhatsApp *</label>
                  <input type="tel" id="order-phone" required placeholder="+57 300 123 4567">
                </div>
              </div>
              <div class="form-group">
                <label for="order-email">Correo Electrónico *</label>
                <input type="email" id="order-email" required placeholder="ejemplo@correo.com">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="order-address">Dirección de Entrega *</label>
                  <input type="text" id="order-address" required placeholder="Calle, carrera, número, apto">
                </div>
                <div class="form-group">
                  <label for="order-city">Ciudad / Municipio *</label>
                  <select id="order-city" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;">
                    <option value="" disabled selected>Selecciona tu ciudad...</option>
                    ${cityOptionsHtml}
                  </select>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-bottom: 15px; margin-top: -5px;">
                <button type="button" id="btn-save-user-info" style="background: transparent; border: 1px solid #285943; color: #285943; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
                  <i class="fas fa-save"></i> Guardar mis datos
                </button>
              </div>

              <div class="form-group">
                <label for="order-notes">Notas especiales (opcional)</label>
                <textarea id="order-notes" rows="2" placeholder="Indicaciones para la entrega..."></textarea>
              </div>

              <!-- Moved summary here -->
              <div class="checkout-products-summary" id="checkout-products-summary"></div>

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

                <!-- Expanded details for transfer -->
                <div id="transfer-details" class="payment-details-box" style="display: block; margin-top: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 6px; background: #fdfdfd;">
                  <label for="bank-selection" style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display: block;">Selecciona tu banco:</label>
                  <select id="bank-selection" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;">
                    <option value="" disabled selected>Elige un banco...</option>
                    <option value="nequi">Nequi</option>
                    <option value="bancolombia">Bancolombia</option>
                    <option value="davivienda">Davivienda</option>
                    <option value="nubank">Nu Bank</option>
                    <option value="bbva">BBVA</option>
                    <option value="breb">BRE-B</option>
                  </select>
                  <div id="bank-logo-container" style="margin-top: 12px; text-align: center; display: none;">
                    <img id="bank-logo" src="" alt="Bank Logo" style="max-height: 35px; max-width: 150px; object-fit: contain;">
                  </div>
                </div>

                <!-- Expanded details for card -->
                <div id="card-details" class="payment-details-box" style="display: none; margin-top: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 6px; background: #fdfdfd;">
                  <div style="position: relative;">
                    <label for="card-number" style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display: block;">Número de tarjeta:</label>
                    <input type="text" id="card-number" placeholder="0000 0000 0000 0000" maxlength="19" style="width: 100%; padding: 10px; padding-right: 50px; border: 1px solid #ddd; border-radius: 4px;">
                    <i id="card-brand-icon" class="fab fa-cc-visa" style="position: absolute; right: 12px; top: 38px; font-size: 24px; color: #ccc; display: none;"></i>
                  </div>
                  <div class="form-row" style="margin-top: 12px; display: flex; gap: 10px;">
                    <div class="form-group" style="flex: 1;">
                      <label for="card-expiry" style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display: block;">Expiración:</label>
                      <input type="text" id="card-expiry" placeholder="MM/AA" maxlength="5" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div class="form-group" style="flex: 1;">
                      <label for="card-cvc" style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display: block;">CVC:</label>
                      <input type="password" id="card-cvc" placeholder="***" maxlength="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                  </div>
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
      // confirm() is blocked in some iframes, replacing with a custom confirmation or just clearing
      clearCart();
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

    // Delegación de evento change para inputs numéricos manuales
    document.getElementById('cart-items-container').addEventListener('change', (e) => {
      if (e.target.classList.contains('cart-qty-number')) {
        const id = e.target.dataset.id;
        let qty = parseInt(e.target.value, 10);
        if (isNaN(qty) || qty < 1) qty = 1;
        updateQuantity(id, qty, true);
      }
    });

    // Abrir checkout
    document.getElementById('btn-checkout').addEventListener('click', openCheckoutModal);

    // Eventos del modal
    document.getElementById('checkout-close-btn').addEventListener('click', closeCheckoutModal);
    document.getElementById('btn-cancel-checkout').addEventListener('click', closeCheckoutModal);

    // Guardar información del usuario
    const btnSaveInfo = document.getElementById('btn-save-user-info');
    if (btnSaveInfo) {
      btnSaveInfo.addEventListener('click', () => {
        const info = {
          name: document.getElementById('order-name').value.trim(),
          phone: document.getElementById('order-phone').value.trim(),
          email: document.getElementById('order-email').value.trim(),
          address: document.getElementById('order-address').value.trim(),
          city: document.getElementById('order-city').value.trim()
        };
        localStorage.setItem('nativa_user_info', JSON.stringify(info));
        
        const originalText = btnSaveInfo.innerHTML;
        btnSaveInfo.innerHTML = '<i class="fas fa-check"></i> ¡Datos Guardados!';
        btnSaveInfo.style.background = '#285943';
        btnSaveInfo.style.color = '#fff';
        
        showToast('Tus datos han sido guardados para la próxima compra');
        
        setTimeout(() => {
          btnSaveInfo.innerHTML = originalText;
          btnSaveInfo.style.background = 'transparent';
          btnSaveInfo.style.color = '#285943';
        }, 2500);
      });
    }

    // Submit del pedido
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
      e.preventDefault();
      processOrder();
    });

    // Lógica de medios de pago expandidos
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    const transferDetails = document.getElementById('transfer-details');
    const cardDetails = document.getElementById('card-details');

    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'transfer') {
          transferDetails.style.display = 'block';
          cardDetails.style.display = 'none';
        } else if (e.target.value === 'card') {
          transferDetails.style.display = 'none';
          cardDetails.style.display = 'block';
        } else {
          transferDetails.style.display = 'none';
          cardDetails.style.display = 'none';
        }
      });
    });

    // Lógica del banco para transferencia
    const bankSelection = document.getElementById('bank-selection');
    const bankLogoContainer = document.getElementById('bank-logo-container');
    const bankLogo = document.getElementById('bank-logo');

    const bankLogos = {
      'nequi': 'https://upload.wikimedia.org/wikipedia/commons/1/14/Nequi_Logo.svg',
      'bancolombia': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo-Bancolombia.svg',
      'davivienda': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Logo_Davivienda.svg',
      'nubank': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Nubank_logo_2021.svg',
      'bbva': 'https://upload.wikimedia.org/wikipedia/commons/0/05/BBVA_2019.svg',
      'breb': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Banrep_logo.svg/1024px-Banrep_logo.svg.png' // BRE-B is backed by Banco de la República
    };

    bankSelection.addEventListener('change', (e) => {
      const selectedBank = e.target.value;
      if (bankLogos[selectedBank]) {
        bankLogo.src = bankLogos[selectedBank];
        bankLogoContainer.style.display = 'block';
      } else {
        bankLogoContainer.style.display = 'none';
      }
    });

    // Lógica de tarjeta (Visa / Mastercard)
    const cardNumber = document.getElementById('card-number');
    const cardBrandIcon = document.getElementById('card-brand-icon');

    cardNumber.addEventListener('input', (e) => {
      // Formato #### #### #### ####
      let val = e.target.value.replace(/\D/g, '');
      let formatted = '';
      for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += val[i];
      }
      e.target.value = formatted;

      // Detección de marca
      if (val.startsWith('4')) {
        cardBrandIcon.className = 'fab fa-cc-visa';
        cardBrandIcon.style.display = 'block';
        cardBrandIcon.style.color = '#1a1f71';
      } else if (val.startsWith('5')) {
        cardBrandIcon.className = 'fab fa-cc-mastercard';
        cardBrandIcon.style.display = 'block';
        cardBrandIcon.style.color = '#eb001b';
      } else {
        cardBrandIcon.style.display = 'none';
      }
    });

    const cardExpiry = document.getElementById('card-expiry');
    cardExpiry.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      e.target.value = val;
    });

  }

  // Cupones de descuento disponibles
  const AVAILABLE_COUPONS = {
    'NATIVAMA': { percent: 20, label: '20% de descuento' },
    'CAMILOMRK': { percent: 80, label: '80% de descuento' }
  };
  let appliedCoupon = null;
  let couponFeedback = null;

  // Renderizar resumen de checkout con cupón y totales
  function renderCheckoutSummary() {
    const cart = getStoredCart();
    const { subtotal, shipping } = getCartTotals();
    const summaryContainer = document.getElementById('checkout-products-summary');
    const modalTotal = document.getElementById('modal-order-total');

    let discount = 0;
    if (appliedCoupon) {
      discount = Math.round(subtotal * (appliedCoupon.percent / 100));
    }
    const finalTotal = Math.max(0, subtotal - discount + shipping);

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

          <!-- Apartado de Cupón de Descuento -->
          <div class="checkout-coupon-card">
            ${appliedCoupon ? `
              <div class="coupon-badge-active">
                <span><i class="fas fa-tag"></i> Cupón <strong>${appliedCoupon.code}</strong> (${appliedCoupon.percent}% OFF) aplicado: -${formatMoney(discount)}</span>
                <button type="button" id="btn-remove-coupon" class="btn-remove-coupon">Quitar cupón</button>
              </div>
            ` : `
              <label for="coupon-code-input"><i class="fas fa-tags"></i> ¿Tienes un cupón de descuento?</label>
              <div class="checkout-coupon-input-group">
                <input type="text" id="coupon-code-input" placeholder="Ingresa tu cupón" maxlength="20">
                <button type="button" id="btn-apply-coupon" class="btn-apply-coupon">Aplicar</button>
              </div>
            `}
            ${couponFeedback ? `
              <div class="coupon-msg-feedback ${couponFeedback.isError ? 'error' : 'success'}">
                <i class="fas ${couponFeedback.isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${couponFeedback.text}
              </div>
            ` : ''}
          </div>

          <div class="checkout-mini-total">
            <span>
              Subtotal: ${formatMoney(subtotal)}
              ${discount > 0 ? ` | <span class="checkout-discount-row">Desc. (${appliedCoupon.code} -${appliedCoupon.percent}%): -${formatMoney(discount)}</span>` : ''}
              | Envío: ${shipping === 0 ? 'Gratis' : formatMoney(shipping)}
            </span>
            <h4>Total: ${formatMoney(finalTotal)}</h4>
          </div>
        </div>
      `;

      // Eventos del cupón
      const btnApply = document.getElementById('btn-apply-coupon');
      const inputCoupon = document.getElementById('coupon-code-input');
      const btnRemove = document.getElementById('btn-remove-coupon');

      if (btnApply && inputCoupon) {
        const handleApply = () => {
          const rawCode = (inputCoupon.value || '').trim().toUpperCase();
          if (!rawCode) {
            couponFeedback = { text: 'Ingresa un código de cupón', isError: true };
            renderCheckoutSummary();
            return;
          }
          if (AVAILABLE_COUPONS[rawCode]) {
            appliedCoupon = {
              code: rawCode,
              percent: AVAILABLE_COUPONS[rawCode].percent,
              label: AVAILABLE_COUPONS[rawCode].label
            };
            couponFeedback = { text: `¡Cupón ${rawCode} aplicado! (${AVAILABLE_COUPONS[rawCode].percent}% de descuento)`, isError: false };
          } else {
            couponFeedback = { text: 'Cupón no válido o expirado', isError: true };
          }
          renderCheckoutSummary();
        };

        btnApply.addEventListener('click', handleApply);
        inputCoupon.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleApply();
          }
        });
      }

      if (btnRemove) {
        btnRemove.addEventListener('click', () => {
          appliedCoupon = null;
          couponFeedback = null;
          renderCheckoutSummary();
        });
      }
    }

    if (modalTotal) {
      modalTotal.textContent = formatMoney(finalTotal);
    }
  }

  // Abrir modal de checkout
  function openCheckoutModal() {
    const cart = getStoredCart();
    if (cart.length === 0) {
      showToast('Tu carrito está vacío');
      return;
    }

    closeCart();

    // Cargar datos guardados si existen
    try {
      const savedData = localStorage.getItem('nativa_user_info');
      if (savedData) {
        const info = JSON.parse(savedData);
        if (info.name) document.getElementById('order-name').value = info.name;
        if (info.phone) document.getElementById('order-phone').value = info.phone;
        if (info.email) document.getElementById('order-email').value = info.email;
        if (info.address) document.getElementById('order-address').value = info.address;
        if (info.city) document.getElementById('order-city').value = info.city;
      }
    } catch (e) { console.error('Error loading user info:', e); }

    couponFeedback = null;
    renderCheckoutSummary();

    const modal = document.getElementById('checkout-modal');
    const stepForm = document.getElementById('checkout-step-form');
    const stepSuccess = document.getElementById('checkout-step-success');

    if (stepForm) stepForm.style.display = 'block';
    if (stepSuccess) stepSuccess.style.display = 'none';

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
  async function processOrder() {
    const cart = getStoredCart();
    const { subtotal, shipping } = getCartTotals();
    const discount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.percent / 100)) : 0;
    const total = Math.max(0, subtotal - discount + shipping);
    const couponCode = appliedCoupon ? appliedCoupon.code : null;

    const name = document.getElementById('order-name').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const email = document.getElementById('order-email').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const city = document.getElementById('order-city').value.trim();
    const notes = document.getElementById('order-notes').value.trim();
    const payment = document.querySelector('input[name="payment-method"]:checked')?.value || 'transfer';

    const orderNum = 'NAT-' + Math.floor(100000 + Math.random() * 900000);
    
    let paymentLabel = '';
    if (payment === 'transfer') {
      const bank = document.getElementById('bank-selection')?.value;
      const bankNames = {
        'nequi': 'Nequi',
        'bancolombia': 'Bancolombia',
        'davivienda': 'Davivienda',
        'nubank': 'Nu Bank',
        'bbva': 'BBVA',
        'breb': 'BRE-B'
      };
      const bankName = bankNames[bank] || 'Transferencia Bancaria';
      paymentLabel = `Transferencia (${bankName})`;
    } else if (payment === 'card') {
      const cardNum = document.getElementById('card-number')?.value.replace(/\s/g, '');
      const last4 = cardNum ? cardNum.slice(-4) : 'XXXX';
      
      let brand = 'Tarjeta';
      if (cardNum && cardNum.startsWith('4')) brand = 'Visa';
      else if (cardNum && cardNum.startsWith('5')) brand = 'MasterCard';
      
      paymentLabel = `${brand} terminada en ${last4}`;
    } else {
      paymentLabel = 'Pago Contra Entrega';
    }

    // Cambiar estado del botón mientras procesa
    const btnSubmit = document.querySelector('#checkout-form button[type="submit"]');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Procesando...';
    }

    try {
      // Enviar solicitud de factura al backend
      const response = await fetch('/api/enviar-factura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          orderNum,
          total,
          subtotal,
          discount,
          couponCode,
          shipping,
          paymentLabel,
          cart
        })
      });

      if (!response.ok) {
        console.error('Error al enviar factura por correo');
        alert('Hubo un problema al enviar la factura a tu correo. Por favor, verifica tu conexión o tus credenciales SMTP.');
      }
    } catch (error) {
      console.error('Error de red al enviar factura:', error);
      alert('Error de red al intentar enviar la factura.');
    }

    const detailsContainer = document.getElementById('success-order-details');
    if (detailsContainer) {
      detailsContainer.innerHTML = `
        <div class="order-confirm-box">
          <p><strong>Cliente:</strong> ${name}</p>
          <p><strong>Contacto:</strong> ${phone} | ${email}</p>
          <p><strong>Despacho:</strong> ${address}, ${city}</p>
          <p><strong>Forma de Pago:</strong> ${paymentLabel}</p>
          <hr style="margin: 10px 0; border: none; border-top: 1px dashed #ccc;">
          <p><strong>Subtotal:</strong> ${formatMoney(subtotal)}</p>
          ${discount > 0 ? `<p style="color: #285943; font-weight: 600;"><strong>Descuento (${couponCode} -${appliedCoupon.percent}%):</strong> -${formatMoney(discount)}</p>` : ''}
          <p><strong>Envío:</strong> ${shipping === 0 ? 'Gratis' : formatMoney(shipping)}</p>
          <p><strong>Total Cancelado:</strong> <span style="font-size: 1.2em; color: #285943; font-weight: bold;">${formatMoney(total)}</span></p>
        </div>
      `;
    }

    document.getElementById('order-id-display').textContent = `#${orderNum}`;
    
    // Configuración para WhatsApp
    let whatsappText = `¡Hola Nativa! Quiero confirmar mi pedido *#${orderNum}*\n\n`;
    whatsappText += `*Mis datos:*\n`;
    whatsappText += `- Nombre: ${name}\n`;
    whatsappText += `- Teléfono: ${phone}\n`;
    whatsappText += `- Envío: ${address}, ${city}\n`;
    whatsappText += `- Medio de pago: ${paymentLabel}\n\n`;
    whatsappText += `*Mi compra:*\n`;
    cart.forEach(item => {
      whatsappText += `- ${item.quantity}x ${item.name} (${formatMoney(item.priceNum * item.quantity)})\n`;
    });
    whatsappText += `\n*Subtotal:* ${formatMoney(subtotal)}\n`;
    if (discount > 0) {
      whatsappText += `*Descuento (${couponCode} -${appliedCoupon.percent}%):* -${formatMoney(discount)}\n`;
    }
    whatsappText += `*Envío:* ${shipping === 0 ? 'Gratis' : formatMoney(shipping)}\n`;
    whatsappText += `*Total a pagar:* ${formatMoney(total)}`;
    
    const whatsappUrl = `https://wa.me/573005427742?text=${encodeURIComponent(whatsappText)}`;

    // Modificar el mensaje principal para avisar del correo y actualizar botones
    const leadMessage = document.querySelector('.success-lead');
    if (leadMessage) {
      leadMessage.innerHTML = 'Hemos recibido tu solicitud de pedido. <strong>Te hemos enviado una copia de la factura a tu correo electrónico.</strong> Por favor, envíanos un mensaje por WhatsApp para coordinar el despacho rápidamente.';
    }

    const successActions = document.querySelector('.success-actions');
    if (successActions) {
      successActions.innerHTML = `
        <a href="${whatsappUrl}" target="_blank" class="btn btn-nativa" style="background-color: #25D366; border-color: #25D366; margin-bottom: 10px;">
          <i class="fab fa-whatsapp"></i> Enviar pedido por WhatsApp
        </a>
        <a href="index.html" class="btn btn-secondary-outline" id="btn-return-home" style="display: block; margin-top: 10px;">Volver al Catálogo</a>
      `;
    }

    document.getElementById('checkout-step-form').style.display = 'none';
    document.getElementById('checkout-step-success').style.display = 'block';

    // Limpiar carrito en almacenamiento y reiniciar cupón
    appliedCoupon = null;
    couponFeedback = null;
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
