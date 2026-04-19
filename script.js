(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const newsList = document.getElementById("news-list");
  const newsStatus = document.getElementById("news-status");

  if (!newsList || !newsStatus) return;

  const feeds = [
    {
      source: "Google Notícias",
      url: "https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNREUxWm5JU0JYQjBMVUpTS0FBUAE?ceid=BR:pt-419&hl=pt-BR&gl=BR"
    },
    {
      source: "TecMundo",
      url: "https://rss.tecmundo.com.br/feed"
    }
  ];

  async function fetchFeed(feed) {
    const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(feed.url);
    const response = await fetch(proxyUrl, {
      headers: { Accept: "application/xml,text/xml,text/plain,*/*" }
    });

    if (!response.ok) throw new Error("Falha ao carregar " + feed.source);

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");

    if (xml.querySelector("parsererror")) throw new Error("XML inválido em " + feed.source);

    const itemSelector = xml.querySelectorAll("item").length ? "item" : "entry";
    const items = Array.from(xml.querySelectorAll(itemSelector)).slice(0, 5);

    return items.map((item) => {
      const title = item.querySelector("title")?.textContent?.trim() || "Sem título";
      const linkNode = item.querySelector("link");
      const link = linkNode?.getAttribute("href") || linkNode?.textContent?.trim() || "#";
      const pubDate =
        item.querySelector("pubDate")?.textContent?.trim() ||
        item.querySelector("published")?.textContent?.trim() ||
        item.querySelector("updated")?.textContent?.trim() ||
        "";
      const description =
        item.querySelector("description")?.textContent?.trim() ||
        item.querySelector("summary")?.textContent?.trim() ||
        "";

      return {
        source: feed.source,
        title,
        link,
        pubDate,
        description: description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180)
      };
    });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(dateString) {
    if (!dateString) return "Data não informada";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function renderNews(items) {
    newsList.innerHTML = items.map((item) => `
      <article class="news-card">
        <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a></h3>
        <p>${escapeHtml(item.description || "Abra a notícia completa para ver mais detalhes.")}</p>
        <div class="news-meta">
          <span>Fonte: ${escapeHtml(item.source)}</span>
          <span>${escapeHtml(formatDate(item.pubDate))}</span>
        </div>
      </article>
    `).join("");
  }

  async function loadNews() {
    try {
      newsStatus.textContent = "Buscando notícias em português...";
      const results = await Promise.allSettled(feeds.map(fetchFeed));
      const allNews = results.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);

      if (!allNews.length) throw new Error("Nenhuma notícia disponível.");

      allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      renderNews(allNews.slice(0, 6));
      newsStatus.textContent = "Notícias em pt-BR carregadas automaticamente.";
    } catch (error) {
      console.error(error);
      newsStatus.textContent = "Não foi possível carregar as notícias agora.";
      newsList.innerHTML = "";
    }
  }

  loadNews();
})();