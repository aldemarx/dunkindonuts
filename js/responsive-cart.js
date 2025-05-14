document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos
  const menuToggle = document.getElementById('menuToggle');
  const cartButton = document.getElementById('cartButton');
  const closeMenu = document.getElementById('closeMenu');
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const nav = document.querySelector('nav');
  
  // Función para manejar el carrito en modo móvil
  function setupMobileCart() {
    // Crear un botón específico para móviles si no existe
    let mobileCartBtn = document.getElementById('mobileCartButton');
    
    if (!mobileCartBtn) {
      mobileCartBtn = document.createElement('div');
      mobileCartBtn.id = 'mobileCartButton';
      mobileCartBtn.className = 'mobile-cart-button';
   mobileCartBtn.innerHTML = `
  <img src="assets/images/icons/cart.png" alt="Carrito de Compras">
`;
      
      // Agregar el botón al body
      document.body.appendChild(mobileCartBtn);
      
      // Actualizar el total del carrito móvil
      const cartTotal = document.getElementById('cartTotal');
      const mobileCartTotal = document.getElementById('mobileCartTotal');
      
      if (cartTotal && mobileCartTotal) {
        mobileCartTotal.textContent = cartTotal.textContent;
      }
      
      // Evento para abrir el carrito en móvil
      mobileCartBtn.addEventListener('click', function() {
        if (window.shoppingCart && typeof window.shoppingCart.toggleCartPanel === 'function') {
          window.shoppingCart.toggleCartPanel();
        } else {
          // Fallback si no existe la instancia del carrito
          const cartPanel = document.getElementById('cartPanel');
          const cartOverlay = document.getElementById('cartOverlay');
          
          if (cartPanel) {
            cartPanel.classList.add('active');
            if (cartOverlay) {
              cartOverlay.style.display = 'block';
              setTimeout(() => {
                cartOverlay.classList.add('active');
              }, 10);
            }
          }
        }
      });
    }
    
    // Asegurarse de que el botón del carrito móvil esté visible
    if (mobileCartBtn) {
      mobileCartBtn.style.display = 'flex';
    }
  }
  
  // Función para ajustar el comportamiento según el tamaño de la pantalla
  function adjustForScreenSize() {
    if (window.innerWidth <= 768) {
      // Comportamiento móvil
      setupMobileCart();
      document.body.classList.add('mobile-view');
      
      // Aplicar clase para layout móvil al nav
      if (nav) {
        nav.classList.add('mobile-nav');
      }
    } else {
      // Comportamiento desktop
      document.body.classList.remove('mobile-view');
      
      // Quitar clase de layout móvil al nav
      if (nav) {
        nav.classList.remove('mobile-nav');
      }
      
      // Ocultar el menú lateral si está abierto y cambiamos a desktop
      if (sideMenu && sideMenu.classList.contains('active')) {
        sideMenu.classList.remove('active');
        if (menuOverlay) {
          menuOverlay.classList.remove('active');
          setTimeout(() => {
            menuOverlay.style.display = 'none';
          }, 300);
        }
      }
      
      // Ocultar el carrito móvil
      const mobileCartBtn = document.getElementById('mobileCartButton');
      if (mobileCartBtn) {
        mobileCartBtn.style.display = 'none';
      }
    }
  }
  
  // Ejecutar ajustes al cargar la página
  adjustForScreenSize();
  
  // Ejecutar ajustes al cambiar el tamaño de la ventana
  window.addEventListener('resize', function() {
    adjustForScreenSize();
  });
  
  // Integración con el carrito existente
  function integrateWithExistingCart() {
    if (window.shoppingCart) {
      const originalUpdateDisplay = window.shoppingCart.updateCartDisplay;
      
      // Sobreescribir el método original para actualizar ambos contadores
      window.shoppingCart.updateCartDisplay = function() {
        // Llamar al método original primero
        if (typeof originalUpdateDisplay === 'function') {
          originalUpdateDisplay.call(window.shoppingCart);
        }
        
        // Actualizar también el contador móvil
        const mobileCartTotal = document.getElementById('mobileCartTotal');
        if (mobileCartTotal) {
          mobileCartTotal.textContent = `S/ ${this.total.toFixed(2)}`;
        }
      };
      
      // Actualizar la visualización inicial
      window.shoppingCart.updateCartDisplay();
    }
  }
  
  // Integrar con el carrito existente
  integrateWithExistingCart();
  
  // Detectar cambios en el DOM para mantener la integración cuando shoppingCart se inicialice después
  if (!window.shoppingCart) {
    // Usar un MutationObserver para detectar cuando el carrito esté disponible
    const observer = new MutationObserver(function(mutations) {
      if (window.shoppingCart && !window.shoppingCart._integrated) {
        integrateWithExistingCart();
        window.shoppingCart._integrated = true;
        observer.disconnect(); // Dejar de observar una vez integrado
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Como respaldo, verificar periódicamente
    const checkInterval = setInterval(function() {
      if (window.shoppingCart && !window.shoppingCart._integrated) {
        integrateWithExistingCart();
        window.shoppingCart._integrated = true;
        clearInterval(checkInterval);
      }
    }, 1000);
  }

  // Asegurar que el panel del carrito se cierre correctamente en móvil
  document.addEventListener('click', function(e) {
    // Si es un clic en el overlay del carrito
    if (e.target.classList.contains('cart-overlay') && e.target.classList.contains('active')) {
      const cartPanel = document.getElementById('cartPanel');
      if (cartPanel) {
        cartPanel.classList.remove('active');
        e.target.classList.remove('active');
        setTimeout(() => {
          e.target.style.display = 'none';
        }, 300);
      }
    }
  });

  // Agregar los estilos CSS necesarios
  function injectResponsiveStyles() {
    let cartStyles = document.getElementById('responsiveCartStyles');
    
    if (!cartStyles) {
      cartStyles = document.createElement('style');
      cartStyles.id = 'responsiveCartStyles';
      cartStyles.textContent = `
        /* Estilos para el botón de carrito en móvil */
        .mobile-cart-button {
        
          position: fixed;
          bottom: 20px;
          right: 20px;
         background-color: #e91e63;
          color: white;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: none;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
          z-index: 990;
          cursor: pointer;
          flex-direction: column;
          transition: transform 0.3s ease;
        }
        
        .mobile-cart-button:hover, .mobile-cart-button:active {
          transform: scale(1.05);
        }
        
        .mobile-cart-button img {
        filter: brightness(0) invert(1);
          width: 24px;
          height: 24px;
          margin-top: 4px;
          margin-bottom: 4px;
        }
        
        .mobile-cart-button span {
          font-size: 0.75em;
          font-weight: bold;
        }
        
        /* Ajustes responsivos generales */
        @media (max-width: 768px) {
          /* Layout de navegación para móvil */
          nav.mobile-nav {
            display: grid !important;
            grid-template-columns: auto 1fr auto !important;
            align-items: center !important;
            padding: 10px 15px !important;
          }
          
          /* Botón de menú hamburguesa */
          nav.mobile-nav .menu-toggle {
            grid-column: 1;
            grid-row: 1;
            display: block !important;
            margin-right: 10px !important;
            font-size: 24px !important;
            background: none !important;
            border: none !important;
          }
          
          /* Logo centrado */
          nav.mobile-nav .logo {
            grid-column: 2;
            grid-row: 1;
            justify-self: center;
            margin: 0 !important;
            max-height: 35px !important;
          }
          
          /* Ocultar elementos en móvil */
          nav.mobile-nav .nav-links,
          nav.mobile-nav .contact-info,
          nav.mobile-nav .order-button {
            display: none !important;
          }
          
          /* Mostrar carrito móvil */
          .mobile-cart-button {
            display: flex !important;
          }
          
          /* Estilo del carrito móvil */
          .cart-panel {
            width: 100% !important;
            max-width: 100% !important;
            right: -100% !important;
            z-index: 1001 !important;
          }
          
          .cart-panel.active {
            right: 0 !important;
          }
          
          /* Mejorar usabilidad del overlay */
          .cart-overlay.active {
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 1000 !important;
          }
          
          /* Ajustes para items del carrito */
          .cart-item {
            padding: 15px 10px !important;
          }
          
          .cart-item-quantity {
            margin: 10px 0 !important;
          }
          
          /* Botón de cerrar carrito más grande */
          .close-cart {
            top: 15px !important;
            right: 15px !important;
            font-size: 28px !important;
            z-index: 10 !important;
          }
          
          /* Evitar superposición del título y botón cerrar */
          .cart-content h2 {
            padding-right: 40px !important;
          }
        }
      `;
      
      document.head.appendChild(cartStyles);
    }
  }
  
  injectResponsiveStyles();
});