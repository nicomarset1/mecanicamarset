const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const menuBackdrop = document.querySelector(".menu-backdrop");
const sectionLinks = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const desktopNavQuery = window.matchMedia("(min-width: 921px)");
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

const setActiveSection = (sectionId) => {
  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const clearActiveSection = () => {
  sectionLinks.forEach((link) => {
    link.classList.remove("is-active");
    link.removeAttribute("aria-current");
  });
};

const updateActiveSection = () => {
  if (!desktopNavQuery.matches) {
    clearActiveSection();
    return;
  }

  const navOffset = nav.offsetHeight + 64;
  const firstSection = sections[0];

  if (!firstSection || window.scrollY + navOffset < firstSection.offsetTop) {
    clearActiveSection();
    return;
  }

  const activeSection = sections
    .slice()
    .reverse()
    .find((section) => section.offsetTop <= window.scrollY + navOffset);

  if (activeSection) {
    setActiveSection(activeSection.id);
  }
};

window.addEventListener("scroll", updateActiveSection, { passive: true });
window.addEventListener("resize", updateActiveSection);
desktopNavQuery.addEventListener("change", updateActiveSection);
updateActiveSection();
