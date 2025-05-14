class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('dunkinCart')) || [];
        this.total = 0;
        this.cartPanelCreated = false;
        this.calculateTotal();
        this.init();
    }

    init() {
        // Inicializar contadores y eventos
        this.updateCartDisplay();
        
        // Vincular eventos de agregar al carrito con delegación de eventos
        document.addEventListener('click', (e) => {
            const addButton = e.target.closest('.add-to-cart');
            if (addButton) {
                e.preventDefault();
                
                const productId = addButton.dataset.product;
                const productElement = addButton.closest('.carousel-item');
                
                if (productElement) {
                    const title = productElement.querySelector('h3').textContent;
                    const price = parseFloat(productElement.querySelector('.price strong').textContent.replace('S/ ', ''));
                    const imgSrc = productElement.querySelector('img').src;
                    
                    this.addItem({
                        id: productId,
                        title,
                        price,
                        imgSrc,
                        quantity: 1
                    });
                    
                    this.showAddedToCartMessage(title);
                }
            }
        });
        
        // Inicializar el botón del carrito para mostrar/ocultar
        const cartButton = document.getElementById('cartButton');
        if (cartButton) {
            cartButton.addEventListener('click', () => this.toggleCartPanel());
        }

        // Eventos para el panel del carrito con delegación
        document.addEventListener('click', (e) => {
            // Botón para cerrar el carrito
            if (e.target.classList.contains('close-cart')) {
                this.toggleCartPanel();
            }
            
            // Botones de incrementar/decrementar cantidad
            const decreaseBtn = e.target.closest('.decrease');
            if (decreaseBtn) {
                const itemId = decreaseBtn.closest('.cart-item').dataset.id;
                const currentItem = this.getItemById(itemId);
                if (currentItem) {
                    this.updateQuantity(itemId, currentItem.quantity - 1);
                }
            }
            
            const increaseBtn = e.target.closest('.increase');
            if (increaseBtn) {
                const itemId = increaseBtn.closest('.cart-item').dataset.id;
                const currentItem = this.getItemById(itemId);
                if (currentItem) {
                    this.updateQuantity(itemId, currentItem.quantity + 1);
                }
            }
            
            // Botón de eliminar item
            const removeBtn = e.target.closest('.remove-item');
            if (removeBtn) {
                const itemId = removeBtn.closest('.cart-item').dataset.id;
                this.removeItem(itemId);
            }
            
            // Botón de checkout
            if (e.target.classList.contains('checkout-button')) {
                this.proceedToCheckout();
            }
        });

        // Crear overlay del carrito si no existe
        let cartOverlay = document.getElementById('cartOverlay');
        if (!cartOverlay) {
            cartOverlay = document.createElement('div');
            cartOverlay.id = 'cartOverlay';
            cartOverlay.className = 'cart-overlay';
            cartOverlay.addEventListener('click', () => this.toggleCartPanel());
            document.body.appendChild(cartOverlay);
        }
    }
    
    // Obtener un item por su ID
    getItemById(itemId) {
        return this.items.find(item => item.id === itemId);
    }
    
    // Agregar un producto al carrito con optimización de rendimiento
    addItem(item) {
        // Verificar si el producto ya está en el carrito
        const existingItemIndex = this.items.findIndex(i => i.id === item.id);
        
        if (existingItemIndex > -1) {
            // Si ya existe, incrementar la cantidad
            this.items[existingItemIndex].quantity += 1;
        } else {
            // Si no existe, agregar nuevo item
            this.items.push(item);
        }
        
        // Actualizar estado del carrito
        this.saveCart();
        this.calculateTotal();
        this.updateCartDisplay();
        
        // Actualizar el panel del carrito si está abierto
        this.updateCartPanel();
    }
    
    // Eliminar un producto del carrito
    removeItem(itemId) {
        // Eliminar visualmente primero para mejor UX
        const cartItemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
        if (cartItemElement) {
            cartItemElement.style.opacity = '0';
            cartItemElement.style.height = '0';
            cartItemElement.style.overflow = 'hidden';
            
            setTimeout(() => {
                // Ahora actualizar los datos
                this.items = this.items.filter(item => item.id !== itemId);
                this.saveCart();
                this.calculateTotal();
                this.updateCartDisplay();
                
                // Actualizar todo el panel del carrito
                this.updateCartPanel();
            }, 300);
        } else {
            // Fallback si el elemento no existe en el DOM
            this.items = this.items.filter(item => item.id !== itemId);
            this.saveCart();
            this.calculateTotal();
            this.updateCartDisplay();
            this.updateCartPanel();
        }
    }
    
    // Verificar si el carrito está vacío y mostrar mensaje apropiado
    checkEmptyCart() {
        const cartItems = document.querySelector('.cart-items');
        if (!cartItems) return;
        
        if (this.items.length === 0) {
            let emptyMessage = cartItems.querySelector('.empty-cart-message');
            if (!emptyMessage) {
                emptyMessage = document.createElement('p');
                emptyMessage.className = 'empty-cart-message';
                emptyMessage.textContent = 'Tu carrito está vacío';
                cartItems.appendChild(emptyMessage);
            }
        } else {
            // Eliminar el mensaje de carrito vacío si existe y hay productos
            const emptyMessage = cartItems.querySelector('.empty-cart-message');
            if (emptyMessage) {
                cartItems.removeChild(emptyMessage);
            }
        }
    }
    
    // Actualizar la cantidad de un producto con optimización
    updateQuantity(itemId, quantity) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Si la cantidad es 0 o menos, eliminar el producto
                this.removeItem(itemId);
            } else {
                // Actualizar la cantidad
                this.items[itemIndex].quantity = quantity;
                
                this.saveCart();
                this.calculateTotal();
                this.updateCartDisplay();
                
                // Actualizar el panel del carrito
                this.updateCartPanel();
            }
        }
    }
    
    // Calcular el total de la compra
    calculateTotal() {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }
    
    // Guardar el carrito en localStorage con throttling para mejorar rendimiento
    saveCart() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        
        this.saveTimeout = setTimeout(() => {
            localStorage.setItem('dunkinCart', JSON.stringify(this.items));
        }, 300);
    }
    
    // Actualizar visualización del contador de carrito
    updateCartDisplay() {
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = `S/ ${this.total.toFixed(2)}`;
        }
    }
    
    // Actualizar todo el panel del carrito
    updateCartPanel() {
        // Si el panel no está creado o no está visible, no hacer nada
        const cartPanel = document.getElementById('cartPanel');
        if (!cartPanel || !cartPanel.classList.contains('active')) return;
        
        // Actualizar el total
        const cartTotalElement = cartPanel.querySelector('.cart-total strong');
        if (cartTotalElement) {
            cartTotalElement.textContent = `S/ ${this.total.toFixed(2)}`;
        }
        
        // Actualizar los items
        const cartItems = cartPanel.querySelector('.cart-items');
        if (cartItems) {
            // Limpiar contenido actual
            cartItems.innerHTML = '';
            
            if (this.items.length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.className = 'empty-cart-message';
                emptyMessage.textContent = 'Tu carrito está vacío';
                cartItems.appendChild(emptyMessage);
            } else {
                // Crear un fragment para mejor rendimiento
                const fragment = document.createDocumentFragment();
                
                this.items.forEach(item => {
                    const cartItem = this.createCartItemElement(item);
                    fragment.appendChild(cartItem);
                });
                
                cartItems.appendChild(fragment);
            }
        }
    }
    
    // Mostrar/ocultar panel del carrito
    toggleCartPanel() {
        let cartPanel = document.getElementById('cartPanel');
        let cartOverlay = document.getElementById('cartOverlay');
        
        if (cartPanel) {
            // Si ya existe, solo alternar visibilidad
            cartPanel.classList.toggle('active');
            if (cartOverlay) {
                cartOverlay.classList.toggle('active');
            }
            
            // Si se está mostrando, actualizar contenido
            if (cartPanel.classList.contains('active')) {
                this.updateCartPanel();
            }
        } else {
            // Si no existe, crearlo
            this.createCartPanel();
        }
    }
    
    // Crear el panel del carrito
    createCartPanel() {
        const cartPanel = document.createElement('div');
        cartPanel.id = 'cartPanel';
        cartPanel.className = 'cart-panel';
        
        const cartContent = document.createElement('div');
        cartContent.className = 'cart-content';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-cart';
        closeButton.innerHTML = '&times;';
        
        const cartTitle = document.createElement('h2');
        cartTitle.textContent = 'Tu Carrito';
        
        const cartItems = document.createElement('div');
        cartItems.className = 'cart-items';
        
        const cartSummary = document.createElement('div');
        cartSummary.className = 'cart-summary';
        
        const totalText = document.createElement('div');
        totalText.className = 'cart-total';
        totalText.innerHTML = `<span>Total:</span><strong>S/ ${this.total.toFixed(2)}</strong>`;
        
        const checkoutButton = document.createElement('button');
        checkoutButton.className = 'checkout-button';
        checkoutButton.textContent = 'Realizar Pedido';
        
        cartContent.appendChild(closeButton);
        cartContent.appendChild(cartTitle);
        cartContent.appendChild(cartItems);
        cartSummary.appendChild(totalText);
        cartSummary.appendChild(checkoutButton);
        cartContent.appendChild(cartSummary);
        cartPanel.appendChild(cartContent);
        
        document.body.appendChild(cartPanel);
        
        this.cartPanelCreated = true;
        
        // Importante: Primero añadir al DOM, luego activar la clase para la animación
        setTimeout(() => {
            cartPanel.classList.add('active');
            
            // Activar el overlay del carrito
            const cartOverlay = document.getElementById('cartOverlay');
            if (cartOverlay) {
                cartOverlay.classList.add('active');
            }
            
            // Ahora llenar con los productos
            this.updateCartPanel();
        }, 10);
    }
    
    // Crear un elemento de producto para el carrito
    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        
        // Usar innerHTML para mayor velocidad en este caso
        cartItem.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}">
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>S/ ${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-button decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-button increase">+</button>
            </div>
            <button class="remove-item">&times;</button>
        `;
        
        return cartItem;
    }
    
    // Mensaje de producto agregado con optimización
    showAddedToCartMessage(productTitle) {
        // Verificar si ya existe un mensaje y reutilizarlo
        let message = document.querySelector('.added-to-cart-message');
        
        if (message) {
            // Actualizar el mensaje existente
            message.textContent = `¡${productTitle} agregado al carrito!`;
            
            // Reiniciar la animación
            message.classList.remove('show');
            void message.offsetWidth; // Forzar reflow
            message.classList.add('show');
            
            // Reiniciar el temporizador
            clearTimeout(this.messageTimeout);
            
            this.messageTimeout = setTimeout(() => {
                message.classList.remove('show');
            }, 2000);
        } else {
            // Crear nuevo mensaje
            message = document.createElement('div');
            message.className = 'added-to-cart-message';
            message.textContent = `¡${productTitle} agregado al carrito!`;
            
            document.body.appendChild(message);
            
            // Mostrar animación y luego eliminar
            setTimeout(() => {
                message.classList.add('show');
                
                this.messageTimeout = setTimeout(() => {
                    message.classList.remove('show');
                    setTimeout(() => {
                        if (message.parentNode) {
                            document.body.removeChild(message);
                        }
                    }, 300);
                }, 2000);
            }, 10);
        }
    }
    
    // Ir al checkout
    proceedToCheckout() {
        // Verificar si hay productos en el carrito
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        // Redirigir a la página de checkout
        window.location.href = 'checkout.html';
    }
    
    // Vaciar el carrito
    clearCart() {
        this.items = [];
        this.saveCart();
        this.calculateTotal();
        this.updateCartDisplay();
        this.updateCartPanel();
    }
}

// Inicializar el carrito cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});
