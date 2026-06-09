const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const menuBackdrop = document.querySelector(".menu-backdrop");
let closeTimer;

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  navLinks.classList.remove("is-open");
  menuBackdrop.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  window.clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => {
    if (!navLinks.classList.contains("is-open")) {
      menuBackdrop.hidden = true;
    }
  }, 240);
};

const openMenu = () => {
  window.clearTimeout(closeTimer);
  document.body.classList.add("menu-open");
  menuBackdrop.hidden = false;
  requestAnimationFrame(() => {
    navLinks.classList.add("is-open");
    menuBackdrop.classList.add("is-open");
  });
  menuToggle.setAttribute("aria-expanded", "true");
};

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.contains("is-open");

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

menuBackdrop.addEventListener("click", closeMenu);

document.addEventListener("click", (event) => {
  const isOpen = navLinks.classList.contains("is-open");
  const clickedInsideNav = nav.contains(event.target);

  if (isOpen && !clickedInsideNav) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 12);
});
