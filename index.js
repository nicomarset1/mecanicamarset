const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const menuBackdrop = document.querySelector(".menu-backdrop");
const sectionLinks = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
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

if ("IntersectionObserver" in window) {
  const visibleSections = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      const activeSection = Array.from(visibleSections.entries()).sort((a, b) => b[1] - a[1])[0];

      if (activeSection) {
        setActiveSection(activeSection[0]);
      }
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0.1, 0.25, 0.5, 0.75],
    }
  );

  sections.forEach((section) => observer.observe(section));
} else {
  window.addEventListener("scroll", () => {
    const navOffset = nav.offsetHeight + 48;
    const activeSection = sections
      .slice()
      .reverse()
      .find((section) => section.offsetTop <= window.scrollY + navOffset);

    if (activeSection) {
      setActiveSection(activeSection.id);
    }
  });
}
