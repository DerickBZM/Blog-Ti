(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  const AD_CLIENT = "ca-pub-4860278871336818";
  const AD_SLOTS = {
    "home-meio": "",
    "drivers-meio": "",
    "artigo-topo": "",
    "artigo-meio": "",
    "sidebar": "",
    "suporte-meio": "",
    "reset-meio": "",
    "tutoriais-topo": "",
    "tutoriais-meio": ""
  };

  document.querySelectorAll("[data-ad-slot-key]").forEach((slot) => {
    const key = slot.getAttribute("data-ad-slot-key");
    const id = AD_SLOTS[key];

    if (!id) return;

    slot.innerHTML = "";
    const label = document.createElement("span");
    label.className = "ad-label";
    label.textContent = "Publicidade";

    const ad = document.createElement("ins");
    ad.className = "adsbygoogle";
    ad.style.display = "block";
    ad.dataset.adClient = AD_CLIENT;
    ad.dataset.adSlot = id;
    ad.dataset.adFormat = "auto";
    ad.dataset.fullWidthResponsive = "true";

    slot.append(label, ad);
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  });

  const search = document.querySelector("#driver-search");
  const cards = Array.from(document.querySelectorAll("[data-driver-card]"));
  const status = document.querySelector("#driver-search-status");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter-brand]"));
  let activeBrand = "todos";

  function normalize(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function updateCards() {
    if (!cards.length) return;

    const query = normalize(search?.value || "");
    let visible = 0;

    cards.forEach((card) => {
      const brand = card.dataset.brand || "";
      const text = normalize(card.dataset.keywords || card.textContent || "");
      const matchesBrand = activeBrand === "todos" || brand === activeBrand;
      const matchesText = !query || text.includes(query);
      const shouldShow = matchesBrand && matchesText;

      card.hidden = !shouldShow;
      if (shouldShow) visible += 1;
    });

    if (status) {
      status.textContent = visible === 1 ? "1 guia encontrado." : visible + " guias encontrados.";
    }
  }

  if (search) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) search.value = query;
    search.addEventListener("input", updateCards);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeBrand = button.dataset.filterBrand || "todos";
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      updateCards();
    });
  });

  updateCards();
})();
