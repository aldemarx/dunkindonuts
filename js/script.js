
document.addEventListener('DOMContentLoaded', function() {

    function initializeProductCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        const container = carousel.querySelector('.carousel-container');
        const prevButton = carousel.querySelector('.prev');
        const nextButton = carousel.querySelector('.next');
        const items = carousel.querySelectorAll('.carousel-item');
        
        if (!container || !prevButton || !nextButton || items.length === 0) return;
        
       
        const itemWidth = items[0].offsetWidth + 20; 

        function scrollNext() {
            container.scrollBy({
                left: itemWidth,
                behavior: 'smooth'
            });
        }
        
        function scrollPrev() {
            container.scrollBy({
                left: -itemWidth,
                behavior: 'smooth'
            });
        }
        nextButton.addEventListener('click', scrollNext);
        prevButton.addEventListener('click', scrollPrev);
      
        carousel.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                scrollNext();
            } else if (e.key === 'ArrowLeft') {
                scrollPrev();
            }
        });
    }
    initializeProductCarousel('bestsellersCarousel');
    initializeProductCarousel('newItemsCarousel');
    
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const container = carousel.querySelector('.carousel-container');
        let startX, scrollLeft, isDown = false;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });
        
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; 
            container.scrollLeft = scrollLeft - walk;
        });
        

        container.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('touchend', () => {
            isDown = false;
        });
        
        container.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    });

    function setupBannerSlider() {
        console.log("Iniciando configuración del banner slider"); // Debug
        
        const bannerContainer = document.querySelector('.image-banner');
        if (!bannerContainer) {
            console.error("No se encontró el contenedor del banner");
            return;
        }
        const currentImage = bannerContainer.querySelector('img');
        if (!currentImage) {
            console.error("No se encontró la imagen dentro del banner");
            return;
        }
        const originalImageSrc = currentImage.src;
   
        const sliderHTML = `
            <div class="banner-slider" style="position: relative; width: 100%; overflow: hidden;">
                <div class="banner-slides" style="position: relative; width: 100%;">
                    <div class="banner-slide active" style="display: block;">
                        <img src="assets/images/banner.webp" alt="Banner Promocional 1" style="width: 100%; display: block;">
                    </div>
                    <div class="banner-slide" style="display: none;">
                        <img src="assets/images/banner2.webp" alt="Banner Promocional 2" style="width: 100%; display: block;">
                    </div>
                    <div class="banner-slide" style="display: none;">
                        <img src="assets/images/banner3.webp" alt="Banner Promocional 3" style="width: 100%; display: block;">
                    </div>
                </div>
                <div class="banner-navigation" style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; z-index: 10;">
                    <span class="banner-dot active" data-index="0" style="display: inline-block; width: 12px; height: 12px; margin: 0 5px; border-radius: 50%; background-color: #e91e63; cursor: pointer;"></span>
                    <span class="banner-dot" data-index="1" style="display: inline-block; width: 12px; height: 12px; margin: 0 5px; border-radius: 50%; background-color: rgba(255,255,255,0.6); cursor: pointer;"></span>
                    <span class="banner-dot" data-index="2" style="display: inline-block; width: 12px; height: 12px; margin: 0 5px; border-radius: 50%; background-color: rgba(255,255,255,0.6); cursor: pointer;"></span>
                </div>
                <button class="banner-prev" style="position: absolute; top: 50%; left: 15px; transform: translateY(-50%); background-color: rgba(233, 30, 99, 0.7); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer; z-index: 10;">❮</button>
                <button class="banner-next" style="position: absolute; top: 50%; right: 15px; transform: translateY(-50%); background-color: rgba(233, 30, 99, 0.7); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer; z-index: 10;">❯</button>
            </div>
        `;
        
        bannerContainer.innerHTML = sliderHTML;
        
        const slides = bannerContainer.querySelectorAll('.banner-slide');
        const dots = bannerContainer.querySelectorAll('.banner-dot');
        const prevButton = bannerContainer.querySelector('.banner-prev');
        const nextButton = bannerContainer.querySelector('.banner-next');
        
        let currentSlideIndex = 0;
        let slideInterval;
        
        function showSlide(index) {

            slides.forEach(slide => {
                slide.style.display = 'none';
            });
    
            dots.forEach(dot => {
                dot.style.backgroundColor = 'rgba(255,255,255,0.6)';
                dot.classList.remove('active');
            });
            
            slides[index].style.display = 'block';
            
            dots[index].style.backgroundColor = '#e91e63';
            dots[index].classList.add('active');
            
            currentSlideIndex = index;
        }

        function nextSlide() {
            let newIndex = currentSlideIndex + 1;
            if (newIndex >= slides.length) {
                newIndex = 0;
            }
            showSlide(newIndex);
        }
        
        function prevSlide() {
            let newIndex = currentSlideIndex - 1;
            if (newIndex < 0) {
                newIndex = slides.length - 1;
            }
            showSlide(newIndex);
        }
        
        prevButton.addEventListener('click', function() {
            prevSlide();
            resetInterval();
        });
        
        nextButton.addEventListener('click', function() {
            nextSlide();
            resetInterval();
        });
        
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.getAttribute('data-index'));
                showSlide(slideIndex);
                resetInterval();
            });
        });
        function startInterval() {
            slideInterval = setInterval(nextSlide, 5000); 
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        bannerContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        bannerContainer.addEventListener('mouseleave', function() {
            startInterval();
        });
        
        startInterval();
        
        console.log("Banner slider configurado correctamente"); // Debug
    }
    
    setTimeout(setupBannerSlider, 100);
});

// Menú hamburguesa - Funcionalidad
document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos
  const menuToggle = document.getElementById('menuToggle');
  const closeMenu = document.getElementById('closeMenu');
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  // Abrir menú
  menuToggle.addEventListener('click', function() {
    sideMenu.classList.add('active');
    menuOverlay.style.display = 'block';
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
    sideMenu.classList.remove('active');
    menuOverlay.style.display = 'none';
    document.body.classList.remove('menu-open');
  }
  
  // Cerrar menú al hacer clic en un link (opcional)
  const menuLinks = document.querySelectorAll('.side-menu-items a');
  menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenuFunction();
    });
  });
});
