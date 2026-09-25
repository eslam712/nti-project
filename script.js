const SOCIAL_LINKS = {
  behance: "REPLACE_WITH_BEHANCE_URL",
  instagram: "REPLACE_WITH_INSTAGRAM_URL",
  linkedin: "REPLACE_WITH_LINKEDIN_URL",
};

const CONTACT_EMAIL = "REPLACE_WITH_EMAIL";

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const menuClose = document.querySelector(".menu-close");
const modal = document.querySelector("#project-modal");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalCategory = document.querySelector("#modal-category");
const modalType = document.querySelector("#modal-type");
const modalDescription = document.querySelector("#modal-description");
const modalClose = document.querySelector(".modal-close");

function setMenuState(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  if (isOpen) menuClose.focus();
  else menuToggle.focus();
}

menuToggle.addEventListener("click", () => setMenuState(true));
menuClose.addEventListener("click", () => setMenuState(false));
mobileMenu
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenuState(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (mobileMenu.classList.contains("is-open")) setMenuState(false);
    if (modal.open) modal.close();
  }
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelector(".filter-button.is-active")
      .classList.remove("is-active");
    button.classList.add("is-active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".project-card").forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

function openProject(card) {
  modalImage.src = card.dataset.image;
  modalImage.alt = card.querySelector("img").alt;
  modalTitle.textContent = card.dataset.title;
  modalCategory.textContent = card.dataset.categoryLabel;
  modalType.textContent = card.dataset.type;
  modalDescription.textContent = card.dataset.description;
  modal.showModal();
}

document.querySelectorAll(".project-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () =>
    openProject(trigger.closest(".project-card")),
  );
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

modalClose.addEventListener("click", () => modal.close());
modal.addEventListener("cancel", (event) => {
  event.preventDefault();
  modal.close();
});

modalImage.addEventListener("error", () => {
  modalImage.alt = "Project image unavailable";
  modalImage.style.display = "none";
});

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.closest(".project-image")?.classList.add("image-fallback");
  });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-social]").forEach((link) => {
  const key = link.dataset.social;
  link.href = SOCIAL_LINKS[key];
  if (!SOCIAL_LINKS[key].startsWith("REPLACE_")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});

document.querySelectorAll("[data-email-link]").forEach((link) => {
  link.href = `mailto:${CONTACT_EMAIL}`;
});
