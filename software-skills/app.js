document.addEventListener("DOMContentLoaded", () => {
  const appShell = document.querySelector(".app-shell");
  const sidebar = document.querySelector("#sidebar") || document.querySelector(".sidebar");

  // 1. Check saved collapse state on desktop
  const isCollapsed = localStorage.getItem("software_skills_sidebar_collapsed") === "true";
  if (isCollapsed && appShell && window.innerWidth > 760) {
    appShell.classList.add("sidebar-collapsed");
  }

  // 2. Ensure Mobile Header exists
  let mobileHeader = document.querySelector(".mobile-header");
  if (!mobileHeader && appShell) {
    mobileHeader = document.createElement("header");
    mobileHeader.className = "mobile-header";
    const isSoftwareSkills = window.location.pathname.includes("software-skills");
    mobileHeader.innerHTML = `
      <button class="mobile-menu-toggle" id="mobile-menu-toggle" type="button" aria-label="Open navigation menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <a class="mobile-brand" href="index.html">
        <span class="brand-mark">${isSoftwareSkills ? "S" : "M"}</span>
        <strong>${isSoftwareSkills ? "Software Skills" : "MADT notes"}</strong>
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
      localStorage.setItem("software_skills_sidebar_collapsed", collapsed ? "true" : "false");
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

  // 8. Android version timeline
  const versionDetails = {
    cupcake: ["Cupcake 1.5 (2009)", "The first version with a dessert name. It added the on-screen keyboard, home-screen widgets and video recording."],
    donut: ["Donut 1.6 (2009)", "Support for different screen sizes and resolutions, a universal search box, and text-to-speech."],
    eclair: ["Eclair 2.0–2.1 (2009)", "Free turn-by-turn navigation in Google Maps, live wallpapers, multiple accounts, and Bluetooth 2.1."],
    froyo: ["Froyo 2.2 (2010)", "A big speed boost from the JIT compiler, Wi-Fi hotspot tethering, and the option to install apps on the SD card."],
    gingerbread: ["Gingerbread 2.3 (2010)", "A cleaner interface, NFC support, a front-camera API for video calls, and a better copy/paste."],
    honeycomb: ["Honeycomb 3.0–3.2 (2011)", "A tablet-only release. It introduced the “Holo” design, on-screen navigation buttons and the action bar."],
    "ice-cream-sandwich": ["Ice Cream Sandwich 4.0 (2011)", "Brought phones and tablets together on one version. It added face unlock, data-usage tracking and the Roboto font."],
    "jelly-bean": ["Jelly Bean 4.1–4.3 (2012)", "“Project Butter” made the system much smoother. It also added Google Now, expandable notifications and multi-user support on tablets."],
    kitkat: ["KitKat 4.4 (2013)", "Tuned to run on cheap phones with only 512 MB of RAM. It added “OK Google” voice commands and full-screen immersive mode."],
    lollipop: ["Lollipop 5.0–5.1 (2014)", "One of the biggest redesigns, with Material Design. ART replaced Dalvik as the app runtime, and notifications appeared on the lock screen."],
    marshmallow: ["Marshmallow 6.0 (2015)", "Apps had to ask for permissions while running instead of at install. It added Doze mode to save battery, built-in fingerprint support and USB-C."],
    nougat: ["Nougat 7.0–7.1 (2016)", "Split-screen multitasking, quick replies from notifications, seamless background updates, and the first Google Assistant (on Pixel)."],
    oreo: ["Oreo 8.0–8.1 (2017)", "Picture-in-picture, notification dots, autofill, background limits to save battery, and Project Treble, which made updates easier for phone makers."],
    pie: ["Pie 9.0 (2018)", "Gesture navigation, Digital Wellbeing, Adaptive Battery and Adaptive Brightness that learn your habits, and support for notched screens. This was the last version with a public dessert name."],
    "android-10": ["Android 10 (2019)", "Dropped the dessert names. It added a system-wide dark theme, full gesture navigation, more privacy controls (such as allowing location only while an app is in use) and support for foldable phones."],
    "android-11": ["Android 11 (2020)", "A separate section for conversation notifications, chat bubbles, one-time permissions, a built-in screen recorder and a controls area for smart-home devices."],
    "android-12": ["Android 12 (2021)", "The “Material You” redesign, where the system's colors match your wallpaper. It added a privacy dashboard, indicators for when the camera or mic is in use, and approximate location sharing."],
    "android-13": ["Android 13 (2022)", "Per-app language settings, themed app icons, a permission prompt before apps can send notifications, and a better photo picker."],
    "android-14": ["Android 14 (2023)", "More lock-screen customization, bigger font scaling for accessibility, and the option to use your phone as a webcam."],
    "android-15": ["Android 15 (2024)", "Private Space (a hidden, locked area for sensitive apps), theft-protection features, partial screen sharing and satellite messaging support."],
    "android-16": ["Android 16 (2025)", "Launched on June 10, 2025, with Live Updates, notification improvements, hearing-aid controls, Advanced Protection, and desktop-style windowing on supported large screens. Later in the year it got the “Material 3 Expressive” redesign, which uses more animation, color and blur. A December 2025 update added AI notification summaries, Notification Organizer, custom icon shapes, expanded dark-theme behavior, and parental controls in Settings. It was also released earlier in the year than usual, and from this version on Google ships two developer releases a year: a major one and a minor one."],
    "android-17": ["Android 17 (2026)", "The current version. It began rolling out to supported Pixel phones on June 16, 2026. Main features include Bubbles, screen recording with a selfie-video overlay, foldable gaming mode, Gemini Intelligence, and privacy and security improvements such as a privacy-first contact picker, Encrypted Client Hello, and stronger lock-screen protection against guessing."]
  };
  const versionButtons = [...document.querySelectorAll(".version-node")];
  const versionDetail = document.querySelector("#version-detail");
  versionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const detail = versionDetails[button.dataset.version];
      if (!detail || !versionDetail) return;
      const isSelected = button.getAttribute("aria-expanded") === "true";
      versionButtons.forEach((item) => item.setAttribute("aria-expanded", "false"));
      if (isSelected) {
        versionDetail.classList.remove("is-open");
        versionDetail.innerHTML = '<p class="version-detail-placeholder">Select a version above to see its key features.</p>';
        return;
      }
      button.setAttribute("aria-expanded", "true");
      versionDetail.innerHTML = `<h4>${detail[0]}</h4><p>${detail[1]}</p>`;
      versionDetail.classList.add("is-open");
    });
  });

  // 9. Copy code logic
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
