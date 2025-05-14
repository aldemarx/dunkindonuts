// Script para la página de Mis Pedidos
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar controlador de pestañas
    initTabs();
    
    // Cargar datos del carrito guardado
    loadSavedCartItems();
    
    // Cargar historial de pedidos de ejemplo
    loadOrderHistory();
    
    // Inicializar eventos para filtros y búsqueda
    initFilters();
});

// Función para inicializar las pestañas
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Añadir clase activa al botón clickeado
            button.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const targetTab = button.dataset.tab;
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Función para cargar los elementos del carrito guardado
function loadSavedCartItems() {
    const savedCartItems = document.getElementById('savedCartItems');
    if (!savedCartItems) return;
    
    // Obtener datos del carrito desde localStorage
    const cartItems = JSON.parse(localStorage.getItem('dunkinCart')) || [];
    
    if (cartItems.length === 0) {
        // Mostrar mensaje si no hay productos en el carrito
        savedCartItems.innerHTML = `
            <div class="no-orders-message">
                <img src="empty-cart.png" alt="Carrito vacío" class="empty-icon">
                <h2>Tu carrito está vacío</h2>
                <p>No tienes productos guardados en tu carrito</p>
                <a href="index.html" class="order-now-button">Explorar productos</a>
            </div>
        `;
        
        // Ocultar botones de acción
        document.querySelector('.saved-cart-actions').style.display = 'none';
        return;
    }
    
    // Mostrar botones de acción
    document.querySelector('.saved-cart-actions').style.display = 'flex';
    
    // Limpiar el contenedor
    savedCartItems.innerHTML = '';
    
    // Calcular el total del carrito
    let total = 0;
    
    // Crear elementos del carrito
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'saved-cart-item';
        itemElement.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}">
            <div class="saved-cart-item-info">
                <h3>${item.title}</h3>
                <p>Precio unitario: S/ ${item.price.toFixed(2)}</p>
            </div>
            <div class="saved-cart-item-quantity">
                <span>Cantidad: ${item.quantity}</span>
            </div>
            <div class="saved-cart-item-price">
                S/ ${itemTotal.toFixed(2)}
            </div>
        `;
        
        savedCartItems.appendChild(itemElement);
    });
    
    // Agregar resumen del carrito
    const summaryElement = document.createElement('div');
    summaryElement.className = 'order-summary';
    summaryElement.innerHTML = `
        <div class="order-total">
            Total: <span>S/ ${total.toFixed(2)}</span>
        </div>
    `;
    
    savedCartItems.appendChild(summaryElement);
    
    // Inicializar botones de acción del carrito
    initCartButtons();
}

// Función para inicializar botones del carrito
function initCartButtons() {
    const clearButton = document.getElementById('clearSavedCart');
    const restoreButton = document.getElementById('restoreSavedCart');
    
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
                // Vaciar el carrito en localStorage
                localStorage.setItem('dunkinCart', JSON.stringify([]));
                
                // Recargar la página
                loadSavedCartItems();
                
                // Actualizar el contador del carrito en el header
                if (window.shoppingCart) {
                    window.shoppingCart.items = [];
                    window.shoppingCart.calculateTotal();
                    window.shoppingCart.updateCartDisplay();
                }
            }
        });
    }
    
    if (restoreButton) {
        restoreButton.addEventListener('click', () => {
            // Redirigir a la página de checkout
            window.location.href = 'checkout.html';
        });
    }
}

// Función para cargar el historial de pedidos (datos de ejemplo)
function loadOrderHistory() {
    const ordersList = document.getElementById('ordersHistoryList');
    if (!ordersList) return;
    
    // Datos de pedidos de ejemplo
    const orderHistory = [
        {
            id: 'DD-7896',
            date: '10 mayo, 2025',
            status: 'Entregado',
            items: [
                { 
                    title: 'Donuts Clásicas x6', 
                    price: 27.50, 
                    quantity: 1,
                    imgSrc: 'assets/images/productos/producto1.webp'
                },
                { 
                    title: 'Lunes de dulzura', 
                    price: 36.90, 
                    quantity: 1,
                    imgSrc: 'assets/images/productos/producto2.webp'
                }
            ],
            total: 64.40
        },
        {
            id: 'DD-7532',
            date: '30 abril, 2025',
            status: 'Entregado',
            items: [
                { 
                    title: 'Duo Dunkin', 
                    price: 20.90, 
                    quantity: 2,
                    imgSrc: 'assets/images/productos/producto4.webp'
                }
            ],
            total: 41.80
        },
        {
            id: 'DD-7125',
            date: '15 abril, 2025',
            status: 'Cancelado',
            items: [
                { 
                    title: 'Big Deal', 
                    price: 59.50, 
                    quantity: 1,
                    imgSrc: 'assets/images/productos/producto6.webp'
                },
                { 
                    title: 'Brown Shakin', 
                    price: 12.90, 
                    quantity: 2,
                    imgSrc: 'assets/images/novedad/novedad1.webp'
                }
            ],
            total: 85.30
        }
    ];
    
    // Limpiar la lista
    ordersList.innerHTML = '';
    
    // Verificar si hay pedidos
    if (orderHistory.length === 0) {
        ordersList.innerHTML = `
            <div class="no-orders-message">
                <img src="empty-orders.png" alt="No hay pedidos" class="empty-icon">
                <h2>No tienes pedidos anteriores</h2>
                <p>Una vez que realices un pedido, aparecerá aquí</p>
                <a href="index.html" class="order-now-button">Hacer mi primer pedido</a>
            </div>
        `;
        return;
    }
    
    // Crear tarjetas de pedidos
    orderHistory.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Header del pedido
        const orderHeader = document.createElement('div');
        orderHeader.className = 'order-header';
        
        const statusClass = order.status === 'Cancelado' ? 'cancelled' : 
                           order.status === 'En proceso' ? 'processing' : '';
        
        orderHeader.innerHTML = `
            <div>
                <div class="order-number">Pedido #${order.id}</div>
                <div class="order-date">${order.date}</div>
            </div>
            <div class="order-status ${statusClass}">${order.status}</div>
        `;
        
        // Contenido del pedido
        const orderContent = document.createElement('div');
        orderContent.className = 'order-content';
        
        // Items del pedido
        const orderItems = document.createElement('div');
        orderItems.className = 'order-items';
        
        order.items.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.title}">
                <div class="order-item-info">
                    <h3>${item.title}</h3>
                    <div>
                        <span class="order-item-price">S/ ${item.price.toFixed(2)}</span>
                        <span class="order-quantity">x ${item.quantity}</span>
                    </div>
                </div>
            `;
            
            orderItems.appendChild(orderItem);
        });
        
        // Resumen y acciones
        const orderSummary = document.createElement('div');
        orderSummary.className = 'order-summary';
        orderSummary.innerHTML = `
            <div class="order-total">
                Total: <span>S/ ${order.total.toFixed(2)}</span>
            </div>
            <div class="order-actions">
                <button class="order-action-button secondary-button" data-order="${order.id}" id="view-details-${order.id}">Ver Detalles</button>
                <button class="order-action-button primary-button" data-order="${order.id}" id="reorder-${order.id}">Volver a Pedir</button>
            </div>
        `;
        
        // Agregar elementos al contenido
        orderContent.appendChild(orderItems);
        orderContent.appendChild(orderSummary);
        
        // Agregar elementos a la tarjeta
        orderCard.appendChild(orderHeader);
        orderCard.appendChild(orderContent);
        
        // Agregar tarjeta a la lista
        ordersList.appendChild(orderCard);
        
        // Agregar eventos a los botones
        document.getElementById(`view-details-${order.id}`).addEventListener('click', () => {
            alert(`Detalles del pedido #${order.id} - Función en desarrollo`);
        });
        
        document.getElementById(`reorder-${order.id}`).addEventListener('click', () => {
            reorderItems(order.items);
        });
    });
}

// Función para volver a pedir productos
function reorderItems(items) {
    // Verificar si existe el carrito
    if (!window.shoppingCart) {
        alert('Error al acceder al carrito de compras');
        return;
    }
    
    // Preguntar si desea reemplazar o agregar al carrito actual
    const action = confirm('¿Deseas reemplazar tu carrito actual? Presiona OK para reemplazar o Cancelar para agregar a tu carrito existente.');
    
    if (action) {
        // Reemplazar carrito
        window.shoppingCart.items = [];
    }
    
    // Agregar items al carrito
    items.forEach(item => {
        window.shoppingCart.addItem({
            id: item.title.replace(/\s+/g, '-').toLowerCase(), // Crear ID basado en título
            title: item.title,
            price: item.price,
            imgSrc: item.imgSrc,
            quantity: item.quantity
        });
    });
    
    // Mostrar mensaje de confirmación
    alert('productos agregados al carrito correctamente');
    
    // Abrir el carrito
    if (window.shoppingCart.toggleCartPanel) {
        window.shoppingCart.toggleCartPanel();
    }
}

// Función para inicializar filtros y búsqueda
function initFilters() {
    const dateFilter = document.getElementById('dateFilter');
    const searchInput = document.getElementById('orderSearch');
    const searchButton = document.getElementById('searchButton');
    
    if (dateFilter) {
        dateFilter.addEventListener('change', () => {
            // Aquí iría la lógica para filtrar por fecha
            // Como es solo una demo, simplemente recargamos los pedidos
            loadOrderHistory();
        });
    }
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm === '') {
                loadOrderHistory();
                return;
            }
            
            // Aquí iría la lógica para buscar pedidos
            // Como es solo una demo, simplemente mostramos un mensaje
            alert(`Buscando: "${searchTerm}" - Función en desarrollo`);
        });
        
        // También permitir búsqueda al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
}