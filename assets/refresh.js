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
        el.textContent = "如果有合适的机会或合作 欢迎联系";
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

  function init() {
    refreshCards();
    cleanCapabilities();
    rewriteCapabilities();
    replaceFooterText();
    replaceModalIvyImage();
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
    } finally {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
