// responsive-menu.js - Script para el menú responsivo de Dunkin Donuts

document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos
  const menuToggle = document.getElementById('menuToggle');
  const closeMenu = document.getElementById('closeMenu');
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  // Verificar si los elementos existen
  if (!menuToggle || !closeMenu || !sideMenu || !menuOverlay) {
    console.error('Alguno de los elementos del menú no fue encontrado');
    return;
  }
  
  // Abrir menú
  menuToggle.addEventListener('click', function() {
    sideMenu.classList.add('active');
    menuOverlay.style.display = 'block';
    setTimeout(() => {
      menuOverlay.classList.add('active');
    }, 10);
    document.body.classList.add('menu-open');
  });
  
  // Cerrar menú (por botón X)
  closeMenu.addEventListener('click', function() {
    closeMenuFunction();
  });
  
  // Cerrar menú (al hacer clic en overlay)
  menuOverlay.addEventListener('click', function() {
    closeMenuFunction();
  });
  
  // Función para cerrar menú
  function closeMenuFunction() {
    menuOverlay.classList.remove('active');
    sideMenu.classList.remove('active');
    
    // Esperar a que termine la transición antes de ocultar completamente
    setTimeout(() => {
      menuOverlay.style.display = 'none';
      document.body.classList.remove('menu-open');
    }, 300);
  }
  
  // Cerrar menú al hacer clic en un enlace
  const menuLinks = document.querySelectorAll('.side-menu-items a');
  menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenuFunction();
    });
  });
  
  // Gestionar redimensionamiento de la ventana
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && sideMenu.classList.contains('active')) {
      // Si se cambia a vista de escritorio y el menú está abierto, cerrarlo
      closeMenuFunction();
    }
  });
  
  // Inicializar el menú según el tamaño de pantalla al cargar
  if (window.innerWidth <= 768) {
    // En móviles, asegurarse de que el menú lateral esté configurado correctamente
    sideMenu.classList.remove('active');
    menuOverlay.style.display = 'none';
    menuOverlay.classList.remove('active');
  }
});