document.addEventListener("DOMContentLoaded", () => {
  const appShell = document.querySelector(".app-shell");
  const sidebar = document.querySelector("#sidebar") || document.querySelector(".sidebar");

  // 1. Check saved collapse state on desktop
  const isCollapsed = localStorage.getItem("madt_sidebar_collapsed") === "true";
  if (isCollapsed && appShell && window.innerWidth > 760) {
    appShell.classList.add("sidebar-collapsed");
  }

  // 2. Ensure Mobile Header exists
  let mobileHeader = document.querySelector(".mobile-header");
  if (!mobileHeader && appShell) {
    mobileHeader = document.createElement("header");
    mobileHeader.className = "mobile-header";
    mobileHeader.innerHTML = `
      <button class="mobile-menu-toggle" id="mobile-menu-toggle" type="button" aria-label="Open navigation menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <a class="mobile-brand" href="index.html">
        <span class="brand-mark">M</span>
        <strong>MADT notes</strong>
      </a>
    `;
    appShell.prepend(mobileHeader);
  }

  // 3. Ensure Backdrop exists
  let backdrop = document.querySelector(".sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    backdrop.id = "sidebar-backdrop";
    document.body.appendChild(backdrop);
  }

  // 4. Ensure Sidebar Header & Toggle Button exist in Sidebar
  if (sidebar) {
    let sidebarHeader = sidebar.querySelector(".sidebar-header");
    let brand = sidebar.querySelector(".brand");

    if (!sidebarHeader && brand) {
      sidebarHeader = document.createElement("div");
      sidebarHeader.className = "sidebar-header";
      brand.parentNode.insertBefore(sidebarHeader, brand);
      sidebarHeader.appendChild(brand);
    }

    if (brand && !brand.querySelector(".brand-text")) {
      const textChildren = Array.from(brand.childNodes).filter(
        (node) => node.nodeName === "SPAN" && !node.classList.contains("brand-mark")
      );
      if (textChildren.length > 0) {
        textChildren[0].classList.add("brand-text");
      }
    }

    if (sidebarHeader && !sidebarHeader.querySelector(".sidebar-toggle")) {
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "sidebar-toggle";
      toggleBtn.id = "sidebar-toggle";
      toggleBtn.type = "button";
      toggleBtn.setAttribute("aria-label", "Fold / Expand sidebar");
      toggleBtn.setAttribute("title", "Fold / Expand sidebar");
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="M9 3v18"/>
          <path d="m14 9-3 3 3 3"/>
        </svg>
      `;
      sidebarHeader.appendChild(toggleBtn);
    }
  }

  // 5. Ensure data-title attribute and active link handling
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".unit-link").forEach((link) => {
    const num = link.querySelector(".unit-number")?.textContent.trim() || "";
    const name = link.querySelector(".unit-name")?.textContent.trim() || "";
    if (num && name && !link.getAttribute("data-title")) {
      link.setAttribute("data-title", `${num}: ${name}`);
    }

    const href = link.getAttribute("href");
    const isActive = href === currentPage || (currentPage === "" && href === "index.html");
    link.classList.toggle("active", isActive);
  });

  // 6. Sidebar Fold / Expand & Mobile Drawer Event Delegation
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("#sidebar-toggle");
    if (toggle && appShell) {
      if (window.innerWidth <= 760) {
        appShell.classList.remove("mobile-nav-open");
        return;
      }
      const collapsed = appShell.classList.toggle("sidebar-collapsed");
      localStorage.setItem("madt_sidebar_collapsed", collapsed ? "true" : "false");
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }

    const mobileToggle = e.target.closest("#mobile-menu-toggle");
    if (mobileToggle && appShell) {
      appShell.classList.toggle("mobile-nav-open");
    }

    if (e.target.closest("#sidebar-backdrop") && appShell) {
      appShell.classList.remove("mobile-nav-open");
    }

    if (e.target.closest(".sidebar .unit-link") && window.innerWidth <= 760) {
      appShell?.classList.remove("mobile-nav-open");
    }
  });

  // Close mobile drawer on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && appShell?.classList.contains("mobile-nav-open")) {
      appShell.classList.remove("mobile-nav-open");
    }
  });

  // 7. Search filter logic
  const search = document.querySelector("#topic-search");
  const cards = [...document.querySelectorAll(".topic-card")];
  const emptyState = document.querySelector("#empty-state");

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

  // 8. Copy code logic
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
