const WHATSAPP_NUMBER = "919810881161";

const siteHeader = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxPlaceholder = document.getElementById("lightboxPlaceholder");
const lightboxClose = document.getElementById("lightboxClose");
const reservationForm = document.getElementById("reservationForm");
const backToTop = document.getElementById("backToTop");

document.getElementById("year").textContent = new Date().getFullYear();

// Keep the header compact after the visitor starts scrolling.
function updateHeaderState() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("visible", window.scrollY > 640);
}

// Close the mobile menu after navigation or when Escape is pressed.
function closeMobileMenu() {
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("active");
  document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

// Lightweight image preview for the gallery.
galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    if (image) {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxImage.hidden = false;
      lightboxPlaceholder.hidden = true;
    } else {
      lightboxImage.hidden = true;
      lightboxPlaceholder.hidden = false;
    }
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  lightboxImage.hidden = false;
  lightboxPlaceholder.hidden = true;
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
    if (lightbox.classList.contains("active")) closeLightbox();
  }
});

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!reservationForm.checkValidity()) {
    reservationForm.reportValidity();
    return;
  }

  // No backend is used; WhatsApp receives the reservation details.
  const formData = new FormData(reservationForm);
  const message = [
    "Hello Dal Cheeni, I would like to reserve a table.",
    "",
    `Name: ${formData.get("name")}`,
    `Phone: ${formData.get("phone")}`,
    `Date: ${formData.get("date")}`,
    `Time: ${formData.get("time")}`,
    `Guests: ${formData.get("guests")}`,
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
