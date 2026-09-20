(function () {
  const asciiFlows = {
    "PCG Forest Framework": [
      "terrain  ->  water",
      "  |            |",
      "road  ->  normalize",
      "  |",
      "ecoregion  ->  place"
    ],
    "Corner Weathering HDA": [
      "seed_corner",
      "     |",
      "geodesic_distance",
      "     |",
      "chip_growth",
      "     |",
      "CSG_subtract"
    ],
    "Industrial Ivy Generator": [
      "surface_mask",
      "     |",
      "vine_curves  ->  leaf_points",
      "                    |",
      "             wind_attributes"
    ]
  };

  const imageCards = {
    "PCG Forest Framework": "./assets/pcg/forest-hero.jpg",
    "Corner Weathering HDA": "./assets/houdini/portfolio/corner-weathering-demo.png",
    "Industrial Ivy Generator": "./assets/houdini/portfolio/ivy-ue5-demo.png"
  };

  function getFlow(title) {
    for (const key of Object.keys(asciiFlows)) {
      if (title && title.includes(key)) return asciiFlows[key].join("\n");
    }
    return [
      "input  ->  process",
      "             |",
      "          output"
    ].join("\n");
  }

  function refreshCards() {
    document.querySelectorAll(".card").forEach((card) => {
      const media = card.querySelector(".card-media");
      const titleEl = card.querySelector(".card-title");
      if (!media || media.hasAttribute("data-ascii")) return;
      const title = titleEl ? titleEl.textContent.trim() : "";

      for (const key of Object.keys(imageCards)) {
        if (title.includes(key)) {
          titleEl.setAttribute("data-image", key);
          card.setAttribute("data-image", key);
          media.style.backgroundImage = `url("${imageCards[key]}")`;
          return;
        }
      }

      media.setAttribute("data-ascii", getFlow(title));
    });
  }

  function cleanCapabilities() {
    document.querySelectorAll(".cap-card svg, .cap-card img, .cap-card .icon").forEach((el) => {
      el.remove();
    });
  }

  // 按简历内容重写能力卡片
  const capabilityData = {
    PROCEDURAL: [
      "Houdini SOP / VEX",
      "PCG Framework",
      "Niagara",
      "Ecosystem / Biome Rules",
      "HDA Delivery"
    ],
    "REAL-TIME": [
      "Unreal Engine 5",
      "VAT (Vertex Animation Textures)",
      "Runtime Generation",
      "Instance Budget Optimization",
      "Material Editor"
    ],
    ART: [
      "Character Thick Painting",
      "Scene Thick Painting"
    ],
    PIPELINE: [
      "Cross-engine Handoff",
      "Tool UX Design",
      "Rollback Snapshots",
      "Python / C# Scripting"
    ]
  };

  function rewriteCapabilities() {
    const cards = document.querySelectorAll(".cap-card");
    if (!cards.length) return;

    const entries = Object.entries(capabilityData);
    cards.forEach((card, idx) => {
      if (idx >= entries.length) {
        card.style.display = "none";
        return;
      }
      const [label, items] = entries[idx];
      const group = card.querySelector(".cap-group");
      if (group) group.textContent = label;

      const list = card.querySelector("ul") || card.querySelector(".cap-list");
      if (list) {
        list.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
      }
    });
  }

  function replaceFooterText() {
    document.querySelectorAll(".footer-title, .footer h2, [class*=footer] h2").forEach((el) => {
      const t = el.textContent?.trim();
      if (t && (t.includes("有合适的岗位") || t.includes("过程记录"))) {
        el.textContent = "欢迎合作与联系";
      }
    });
  }

  function replaceModalIvyImage() {
    document.querySelectorAll(".modal-card").forEach((modal) => {
      const title = modal.querySelector(".modal-title, h2");
      if (!title) return;
      const t = title.textContent?.trim() || "";
      if (!t.includes("Ivy") && !t.includes("Ivy Generator")) return;

      modal.querySelectorAll("img").forEach((img) => {
        const src = img.src || "";
        if (src.includes("industrial-ivy") || src.includes("ivy-ue5") || src.includes("portfolio/ivy")) {
          img.src = "./assets/houdini/portfolio/ivy-modal-detail.png";
        }
      });
    });
  }

  // —— 拼贴装饰层：噪点 / 套准标记 / 星尘 / 半调条带 / 胶带贴纸 ——
  function initCollage() {
    if (document.querySelector(".collage-deco")) return;

    const deco = document.createElement("div");
    deco.className = "collage-deco";

    const grain = document.createElement("div");
    grain.className = "collage-grain";
    deco.appendChild(grain);

    ["tl", "tr", "bl", "br"].forEach((pos) => {
      const m = document.createElement("div");
      m.className = "reg-mark reg-" + pos;
      deco.appendChild(m);
    });

    const sideL = document.createElement("div");
    sideL.className = "side-text side-left";
    sideL.textContent = "ZOEY XIE — TECHNICAL ARTIST · PCG / HOUDINI / UE5";
    const sideR = document.createElement("div");
    sideR.className = "side-text side-right";
    sideR.textContent = "PROCEDURAL ART / HDA / ECOSYSTEM / RUNTIME";
    deco.append(sideL, sideR);

    const glyphs = ["✦", "✧", "☆", "+", "·", "✦"];
    for (let i = 0; i < 11; i++) {
      const st = document.createElement("span");
      st.className = "collage-star" + (i % 3 === 0 ? " gold" : i % 3 === 1 ? " teal" : "");
      st.textContent = glyphs[i % glyphs.length];
      st.style.left = (4 + Math.random() * 92).toFixed(1) + "%";
      st.style.top = (3 + Math.random() * 90).toFixed(1) + "%";
      st.style.fontSize = (11 + Math.random() * 10).toFixed(1) + "px";
      st.style.setProperty("--d", (8 + Math.random() * 6).toFixed(1) + "s");
      st.style.setProperty("--dly", (-Math.random() * 8).toFixed(1) + "s");
      deco.appendChild(st);
    }
    document.body.appendChild(deco);

    // 半调网点条带：hero 底部 + 各 section 标题旁
    const hero = document.querySelector(".hero-inner");
    if (hero && !hero.querySelector(".halftone")) {
      const h = document.createElement("div");
      h.className = "halftone";
      hero.appendChild(h);
    }
    document.querySelectorAll(".section-head").forEach((sh, idx) => {
      if (sh.querySelector(".halftone")) return;
      const h = document.createElement("div");
      h.className = "halftone" + (idx % 2 ? " ht-l" : "");
      sh.appendChild(h);
    });

    // 贴纸徽章
    const hero2 = document.querySelector(".hero-inner");
    if (hero2 && !hero2.querySelector(".sticker")) {
      const st = document.createElement("div");
      st.className = "sticker";
      st.textContent = "✦ PCG / HDA / RUNTIME ✦";
      hero2.appendChild(st);
    }
    const work = document.querySelector("#work .section-head");
    if (work && !work.querySelector(".sticker")) {
      const st = document.createElement("div");
      st.className = "sticker sticker-alt";
      st.textContent = "EST. 2026 · 4 PROJECTS";
      work.appendChild(st);
    }

    // 胶带：贴到卡片 / 能力卡上沿（含交叉胶带）
    document.querySelectorAll(".card, .cap-card").forEach((el, idx) => {
      if (!el.querySelector(".tape")) {
        const t = document.createElement("span");
        t.className = "tape";
        t.setAttribute("aria-hidden", "true");
        el.appendChild(t);
      }
      if (idx % 2 === 0 && !el.querySelector(".tape-x")) {
        const tx = document.createElement("span");
        tx.className = "tape tape-x";
        tx.setAttribute("aria-hidden", "true");
        el.appendChild(tx);
      }
    });

    // CMYK 印刷色标条
    const cmykHero = document.querySelector(".hero-inner");
    if (cmykHero && !cmykHero.querySelector(".cmyk-bar")) {
      const bar = document.createElement("div");
      bar.className = "cmyk-bar";
      bar.setAttribute("aria-hidden", "true");
      ["cmyk-c", "cmyk-m", "cmyk-y", "cmyk-k"].forEach((c) => {
        const s = document.createElement("span");
        s.className = c;
        bar.appendChild(s);
      });
      cmykHero.appendChild(bar);
    }
    const footer = document.querySelector(".footer");
    if (footer && !footer.querySelector(".cmyk-bar")) {
      const bar = document.createElement("div");
      bar.className = "cmyk-bar";
      bar.setAttribute("aria-hidden", "true");
      ["cmyk-c", "cmyk-m", "cmyk-y", "cmyk-k"].forEach((c) => {
        const s = document.createElement("span");
        s.className = c;
        bar.appendChild(s);
      });
      footer.appendChild(bar);
    }

    // 手写圈注（自动描边动画）
    function makeScribble(text) {
      const sc = document.createElement("div");
      sc.className = "scribble";
      sc.setAttribute("aria-hidden", "true");
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 150 64");
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute(
        "d",
        "M8 36 C 26 12, 74 8, 100 14 C 122 20, 130 32, 124 40 C 116 50, 62 52, 30 46 C 14 42, 9 38, 8 36 Z"
      );
      svg.appendChild(path);
      const span = document.createElement("span");
      span.textContent = text;
      sc.append(svg, span);
      return sc;
    }
    const hero3 = document.querySelector(".hero-inner");
    if (hero3 && !hero3.querySelector(".scribble")) {
      hero3.appendChild(makeScribble("PCG OK"));
    }
    const work2 = document.querySelector("#work .section-head");
    if (work2 && !work2.querySelector(".scribble")) {
      work2.appendChild(makeScribble("all procedural"));
    }

    // ASCII 花体背景水印
    const heroWm = document.querySelector(".hero-inner");
    if (heroWm && !heroWm.querySelector(".ascii-watermark")) {
      const pre = document.createElement("pre");
      pre.className = "ascii-watermark";
      pre.setAttribute("aria-hidden", "true");
      pre.textContent =
        "▄▀█ █▀█ █░█ █▀█   ▄▀█ █▀▀ █▀█\n" +
        "█▀█ █▀▄ █░█ █▀▀   █▀█ ██▄ █▀▄\n" +
        "▀▀▀ ▀░▀ ░▀░ ▀░░   ▀▀▀ ▀▀▀ ▀░▀\n" +
        "∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿";
      heroWm.appendChild(pre);
    }
  }

  function init() {
    refreshCards();
    cleanCapabilities();
    rewriteCapabilities();
    replaceFooterText();
    replaceModalIvyImage();
    initCollage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  const observer = new MutationObserver(() => {
    // 先断开再处理，避免对 DOM 的写入再次触发观察回调导致死循环
    observer.disconnect();
    try {
      refreshCards();
      cleanCapabilities();
      rewriteCapabilities();
      replaceFooterText();
      replaceModalIvyImage();
      initCollage();
    } finally {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // —— 低调的画作入口：藏在首页 hero 链接行里，点开才看得到 ——
  function initSketch() {
    if (document.querySelector(".sketch-link")) return;
    const btn = document.createElement("button");
    btn.className = "sketch-link";
    btn.setAttribute("aria-label", "sketch");
    btn.textContent = "✏ sketch";
    const host =
      document.querySelector(".hero-actions") ||
      document.querySelector(".hero-links") ||
      document.querySelector(".hero") ||
      document.body;
    host.appendChild(btn);

    const modal = document.createElement("div");
    modal.className = "sketch-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.src = "./assets/art/xiangxiang.jpg";
    img.alt = "personal sketch";
    const close = document.createElement("button");
    close.className = "sketch-close";
    close.textContent = "✕";
    modal.append(img, close);
    document.body.appendChild(modal);

    btn.addEventListener("click", () => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
    close.addEventListener("click", closeSketch);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeSketch();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeSketch();
    });
    function closeSketch() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSketch);
  } else {
    initSketch();
  }
})();
