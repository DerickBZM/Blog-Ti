(() => {
  document.documentElement.classList.add("js");

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

    if (!id) {
      slot.hidden = true;
      return;
    }

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

  document.querySelectorAll("[data-exploder]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".machine-card");
      if (!card) return;

      const isOpen = card.classList.toggle("is-open");
      button.setAttribute("aria-pressed", String(isOpen));
    });
  });

  const revealItems = document.querySelectorAll(".reveal-on-scroll, .machine-card, .news-section");

  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const newsList = document.getElementById("news-list");
  const newsStatus = document.getElementById("news-status");

  const fallbackNews = [
    {
      title: "Como IA e automação estão mudando o suporte técnico",
      source: "Radar editorial",
      date: new Date().toISOString(),
      description: "Ferramentas de diagnóstico, assistentes e checklists inteligentes ajudam técnicos e usuários a resolver problemas com mais rapidez.",
      link: "tutoriais.html"
    },
    {
      title: "Por que drivers oficiais continuam sendo a opção mais segura",
      source: "Radar editorial",
      date: new Date().toISOString(),
      description: "Baixar o pacote no fabricante reduz riscos de arquivos modificados, instaladores confusos e versões incompatíveis.",
      link: "drivers.html"
    },
    {
      title: "Impressora Wi-Fi instável: rede 2.4 GHz ainda importa",
      source: "Radar editorial",
      date: new Date().toISOString(),
      description: "Muitos modelos domésticos funcionam melhor em redes 2.4 GHz, com sinal estável e sem isolamento de cliente no roteador.",
      link: "suporte.html"
    }
  ];

  function cleanText(value) {
    const div = document.createElement("div");
    div.innerHTML = value || "";
    return (div.textContent || "").replace(/\s+/g, " ").trim();
  }

  function safeUrl(value, fallback = "#") {
    try {
      const url = new URL(value, window.location.href);
      const safeProtocols = ["http:", "https:"];
      const isLocalFile = window.location.protocol === "file:" && url.protocol === "file:";
      return safeProtocols.includes(url.protocol) || isLocalFile ? url.href : fallback;
    } catch {
      return fallback;
    }
  }

  function formatNewsDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Hoje";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function renderNews(items, mode = "feed") {
    if (!newsList || !newsStatus) return;

    newsList.textContent = "";

    items.slice(0, 6).forEach((item) => {
      const article = document.createElement("article");
      article.className = "news-card reveal-on-scroll is-visible";

      const meta = document.createElement("span");
      meta.className = "news-source";
      meta.textContent = `${item.source || "Fonte externa"} • ${formatNewsDate(item.date)}`;

      const title = document.createElement("h3");
      const link = document.createElement("a");
      link.href = safeUrl(item.link, "#noticias");
      link.textContent = cleanText(item.title || "Notícia de tecnologia");

      if (link.href.startsWith("http")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      title.append(link);

      const description = document.createElement("p");
      description.textContent = cleanText(item.description || "Abra a notícia para ler mais detalhes na fonte original.").slice(0, 180);

      article.append(meta, title, description);
      newsList.append(article);
    });

    newsStatus.textContent = mode === "feed"
      ? "Manchetes carregadas automaticamente."
      : "Feed externo indisponível; exibindo sugestões editoriais.";
  }

  async function fetchNewsFeed() {
    if (!newsList || !newsStatus) return;

    const feeds = [
      { source: "TecMundo", url: "https://rss.tecmundo.com.br/feed" },
      { source: "Canaltech", url: "https://canaltech.com.br/rss/" },
      { source: "Olhar Digital", url: "https://olhardigital.com.br/feed/" }
    ];

    try {
      newsStatus.textContent = "Buscando manchetes de tecnologia...";

      const results = await Promise.allSettled(feeds.map(async (feed) => {
        const proxy = "https://api.allorigins.win/raw?url=" + encodeURIComponent(feed.url);
        const response = await fetch(proxy, { headers: { Accept: "application/rss+xml,text/xml,*/*" } });
        if (!response.ok) throw new Error("feed unavailable");

        const xmlText = await response.text();
        const xml = new DOMParser().parseFromString(xmlText, "text/xml");
        if (xml.querySelector("parsererror")) throw new Error("invalid feed");

        return Array.from(xml.querySelectorAll("item")).slice(0, 5).map((item) => ({
          title: cleanText(item.querySelector("title")?.textContent || ""),
          source: feed.source,
          date: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
          description: cleanText(item.querySelector("description")?.textContent || ""),
          link: item.querySelector("link")?.textContent || "#"
        })).filter((item) => item.title && item.link);
      }));

      const items = results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => result.value)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (!items.length) throw new Error("empty feed");
      renderNews(items, "feed");
    } catch {
      renderNews(fallbackNews, "fallback");
    }
  }

  fetchNewsFeed();
})();
