document.addEventListener("DOMContentLoaded", () => {
  const search = document.querySelector("#topic-search");
  const cards = [...document.querySelectorAll(".topic-card")];
  const emptyState = document.querySelector("#empty-state");

  document.querySelectorAll(".unit-link").forEach((link) => {
    const currentPage = window.location.pathname.split("/").pop() || "unit1.html";
    link.classList.toggle("active", link.getAttribute("href") === currentPage);
  });

  function filterTopics() {
    const query = (search?.value || "").toLowerCase().trim();
    let visible = 0;
    cards.forEach((card) => {
      const matches = card.textContent.toLowerCase().includes(query);
      card.classList.toggle("is-hidden", !matches);
      if (matches) visible += 1;
    });
    emptyState?.classList.toggle("visible", visible === 0);
  }

  search?.addEventListener("input", filterTopics);

  document.querySelectorAll(".copy-code").forEach((button) => {
    button.addEventListener("click", async () => {
      const code = button.closest(".code-card")?.querySelector("pre")?.innerText || "";
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied";
        window.setTimeout(() => { button.textContent = "Copy"; }, 1400);
      } catch {
        button.textContent = "Select code";
      }
    });
  });
});
