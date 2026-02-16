// Simple SPA-like view switching (no scrolling)
const navButtons = Array.from(document.querySelectorAll(".nav-btn"));
const views = Array.from(document.querySelectorAll(".view"));
const yearEl = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const formHint = document.getElementById("formHint");

yearEl.textContent = new Date().getFullYear();

// Basic router: updates active view + URL hash
function go(route) {
  // Update active nav button
  navButtons.forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.route === route);
  });

  // Update active view
  views.forEach(v => {
    v.classList.toggle("is-active", v.dataset.view === route);
  });

  // Update hash for shareable links + back button support
  if (location.hash !== `#${route}`) {
    history.pushState({ route }, "", `#${route}`);
  }
}

// Navbar click handling (event delegation keeps it simple)
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-route]");
  if (!btn) return;
  const route = btn.dataset.route;
  if (!route) return;
  go(route);
});

// Back/forward support
window.addEventListener("popstate", () => {
  const route = (location.hash || "#home").replace("#", "");
  go(route);
});

// Initial route
const initial = (location.hash || "#home").replace("#", "");
go(initial);

// Simple contact helper: copy message to clipboard (no backend)
contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  formHint.textContent = "";

  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const message = String(data.get("message") || "").trim();

  const text = `Hi, I'm ${name}.\n\n${message}\n\n— Sent from my portfolio site`;

  try {
    await navigator.clipboard.writeText(text);
    formHint.textContent = "Copied! Paste it into email/DM.";
    contactForm.reset();
  } catch {
    // Fallback if clipboard blocked
    formHint.textContent = "Couldn't copy automatically. Select and copy manually:";
    prompt("Copy this message:", text);
  }
});
