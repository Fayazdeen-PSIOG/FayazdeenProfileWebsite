const body = document.body;
const clubSwitch = document.getElementById("clubSwitch");
const clubCrest = document.getElementById("clubCrest");
const clubHint = document.getElementById("clubHint");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const clubs = {
  madrid: {
    theme: "madrid",
    crest: "images/real-madrid-crest.png",
    label: "REAL MADRID",
    next: "Switch club colourway. Current: Real Madrid"
  },
  manchester: {
    theme: "manchester",
    crest: "images/manchester-united-crest.png",
    label: "MANCHESTER UNITED",
    next: "Switch club colourway. Current: Manchester United"
  }
};
clubSwitch.addEventListener("click", () => {
  const next = body.dataset.club === "manchester" ? clubs.madrid : clubs.manchester;
  body.dataset.club = next.theme;
  clubCrest.src = next.crest;
  clubHint.textContent = next.label;
  clubSwitch.setAttribute("aria-label", next.next);
  clubSwitch.title = next.next;
});

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(item => observer.observe(item));
  const journey = document.getElementById("journey");
  if (journey) observer.observe(journey);
} else {
  document.querySelectorAll(".reveal").forEach(item => item.classList.add("visible"));
}

const lightbox = document.getElementById("lightbox");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById("lightboxDescription");
document.querySelectorAll(".hobby-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    lightboxTitle.textContent = tile.dataset.title;
    lightboxDescription.textContent = tile.dataset.description;
    if (typeof lightbox.showModal === "function") lightbox.showModal();
  });
});
document.getElementById("lightboxClose").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) lightbox.close();
});

const progress = document.getElementById("progress");
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();
document.getElementById("year").textContent = new Date().getFullYear();

function openReasonCard(card) {
  lightboxTitle.textContent = card.dataset.title || "A favourite";
  lightboxDescription.textContent = card.dataset.description || "";
  if (typeof lightbox.showModal === "function") lightbox.showModal();
}
document.querySelectorAll(".artist-card").forEach(card => card.addEventListener("click", () => openReasonCard(card)));
document.querySelectorAll(".club-love-card").forEach(card => {
  card.addEventListener("click", () => openReasonCard(card));
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openReasonCard(card); }
  });
});


/* Journey milestones are selectable: click, Enter or Space applies the active
   club colour treatment and exposes the selected state accessibly. */
const journeyCards = [...document.querySelectorAll("#journey .timeline-card")];
function selectJourneyCard(card) {
  journeyCards.forEach(item => {
    const selected = item === card;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
}
journeyCards.forEach(card => {
  card.addEventListener("click", () => selectJourneyCard(card));
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectJourneyCard(card);
    }
  });
});
