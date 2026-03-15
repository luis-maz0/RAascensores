document.addEventListener("DOMContentLoaded", function () {
  // --- Código de la navbar ---
  const navbarButton = document.querySelector("#navbar-toggle");
  const navbarLinks = document.querySelector("#navbar-links");
  const links = document.querySelectorAll(".navbar-link");

  if (navbarButton && navbarLinks) {
    navbarButton.addEventListener("click", () => {
      navbarLinks.classList.toggle("show-navbar-links");
    });

    links.forEach((link) => {
      link.addEventListener("click", () => {
        navbarLinks.classList.remove("show-navbar-links");
      });
    });
  }

  // --- Código del formulario de contacto ---
  const form = document.getElementById("contactoForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Evita el envío inmediato

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      // Validaciones extra
      if (nombre.length < 3) {
        alertify.warning("El nombre debe tener al menos 3 caracteres.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alertify.warning("Por favor, introduce un email válido.");
        return;
      }

      if (mensaje.length < 10) {
        alertify.warning("El mensaje debe tener al menos 10 caracteres.");
        return;
      }

      // Si todo es válido, enviamos el formulario
      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            alertify.success("Mensaje enviado correctamente.");
            form.reset(); // Limpia los campos
          } else {
            alertify.error(
              "Hubo un error al enviar el mensaje. Intenta nuevamente.",
            );
          }
        })
        .catch((error) => {
          alertify.error("Error de conexión. Revisa tu internet.");
        });
    });
  }

  // --- Inicialización del Carrusel ---
  initPartnersCarousel();
  initMap();
});

/**
 * Función modular para manejar el carrusel de logos en bucle infinito.
 */
function initPartnersCarousel() {
  const track = document.querySelector(".partners-carousel");
  if (!track) return;

  // Clonamos los elementos originales para lograr el efecto infinito
  const items = Array.from(track.children);
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    // Añadimos aria-hidden al clon para mejorar la accesibilidad (lectores de pantalla)
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  let position = 0;
  const speed = 1; // Velocidad del movimiento en píxeles por frame
  let animationId;

  function animateCarousel() {
    position += speed;

    // Si la posición supera la mitad del ancho total (los elementos originales),
    // reiniciamos a 0 sin que el usuario lo note.
    if (position >= track.scrollWidth / 2) {
      position = 0;
    }

    track.style.transform = `translateX(-${position}px)`;
    animationId = requestAnimationFrame(animateCarousel);
  }

  // Iniciamos la animación
  animationId = requestAnimationFrame(animateCarousel);

  // UX extra: Pausar la animación cuando el usuario pasa el mouse por encima
  track.addEventListener("mouseenter", () => cancelAnimationFrame(animationId));
  track.addEventListener("mouseleave", () => {
    animationId = requestAnimationFrame(animateCarousel);
  });
}

function initMap() {
  const mapContainer = document.getElementById("mapa-cobertura");
  if (!mapContainer) return;

  // 1. Inicializamos el mapa centrado en zona oeste (ej: Morón) con zoom 10
  const map = L.map("mapa-cobertura").setView([-34.62, -58.65], 10);

  // 2. Capa base de OpenStreetMap (gratis y rápida)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // 3. Verificamos que el archivo zonas.js haya cargado bien
  if (typeof zonasGeoJSON !== "undefined") {
    // 4. Inyectamos el GeoJSON al mapa con 1 sola línea de código
    L.geoJSON(zonasGeoJSON, {
      // Le damos estilo dinámico leyendo los colores de TU propio GeoJSON
      style: function (feature) {
        return {
          color: feature.properties.stroke || "#34a853", // Borde
          weight: 2,
          fillColor: feature.properties.fill || "#34a853", // Relleno
          fillOpacity: feature.properties["fill-opacity"] || 0.4,
        };
      },

      // Le agregamos el popup interactivo a cada polígono
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(`<b>${feature.properties.name}</b>`);
        } else {
          // El primer elemento de tu JSON no tiene nombre, le ponemos uno genérico
          layer.bindPopup(`<b>Zona de Cobertura</b>`);
        }
      },
    }).addTo(map);
  } else {
    console.warn("No se pudo cargar el archivo de zonas (zonasGeoJSON).");
  }
}
