document.addEventListener("DOMContentLoaded", function () {
    // --- Código de la navbar ---
    const navbarButton = document.querySelector("#navbar-toggle");
    const navbarLinks = document.querySelector("#navbar-links");
    const links = document.querySelectorAll(".navbar-link");
  
    navbarButton.addEventListener("click", () => {
      navbarLinks.classList.toggle("show-navbar-links");
    });
  
    links.forEach(link => {
      link.addEventListener("click", () => {
        navbarLinks.classList.remove("show-navbar-links");
      });
    });
  
    // --- Código del formulario de contacto ---
    const form = document.getElementById("contactoForm");
  
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
        .then(response => {
          if (response.ok) {
            alertify.success("Mensaje enviado correctamente.");
            form.reset(); // Limpia los campos
          } else {
            alertify.error("Hubo un error al enviar el mensaje. Intenta nuevamente.");
          }
        })
        .catch(error => {
          alertify.error("Error de conexión. Revisa tu internet.");
        });
    });
  });
  