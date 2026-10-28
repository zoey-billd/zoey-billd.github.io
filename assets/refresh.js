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
    injectOpenSource();
    fixResumeLink();
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
      injectOpenSource();
      fixResumeLink();
    } finally {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // —— Open Source 板块（refresh 层注入；React 端自带 #open-source 后自动让位） ——
  const ossTools = [
    {
      title: "ue-terrain-bridge",
      text: "一键地形管线:Gaea → Houdini → UE5。高度图处理、权重图生成、Landscape 导入与 PCG 重生成串成一条命令。",
      tags: "Python · Houdini · UE5 Landscape · PCG",
      href: "https://github.com/zoey-billd/ue-terrain-bridge",
    },
    {
      title: "mech-bench-demo",
      text: "Blender 机械验收台:5 套驱动机构、限位约束、BVH 干涉扫描与刚体跌落测试,全部经 bpy 脚本驱动与校验。",
      tags: "Blender bpy · Rigid Body · Validation",
      href: "https://github.com/zoey-billd/mech-bench-demo",
    },
    {
      title: "UE Agent Toolchain",
      text: "LLM 经带闸门的工具层操作 UE 编辑器:命名/缩放/间距/删除保护,ScopedTransaction 整体可回滚,JSONL 全量审计。整理中,即将开源。",
      tags: "UE5.6 · Ollama · Gates · Rollback",
      href: "https://github.com/zoey-billd",
    },
  ];

  const OSS_GITHUB_ICON =
    '<svg viewBox="0 0 16 16" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>';

  function injectOpenSource() {
    // 幂等：React 自带板块（源码仓已加）或已注入过则跳过
    if (document.getElementById("open-source")) return;
    const contact = document.querySelector("section#contact, .contact-section");
    if (!contact || !contact.parentNode) return;

    const section = document.createElement("section");
    section.className = "section strengths-section";
    section.id = "open-source";
    section.innerHTML =
      '<div class="section-inner">' +
      '<div class="section-heading compact-heading">' +
      '<p class="eyebrow">Open Source</p>' +
      "<h2>把管线上的工具拆出来，开源可用。</h2>" +
      "</div>" +
      '<div class="strength-grid">' +
      ossTools
        .map(
          (t) =>
            '<a class="strength-card oss-card" href="' + t.href + '" target="_blank" rel="noreferrer">' +
            OSS_GITHUB_ICON +
            "<h3>" + t.title + "</h3>" +
            "<p>" + t.text + "</p>" +
            '<span class="oss-tags">' + t.tags + "</span>" +
            "</a>",
        )
        .join("") +
      "</div>" +
      '<div class="skill-ribbon" aria-label="All repositories">' +
      '<a href="https://github.com/zoey-billd" target="_blank" rel="noreferrer">github.com/zoey-billd · 全部仓库</a>' +
      "</div>" +
      "</div>";
    contact.parentNode.insertBefore(section, contact);

    const nav = document.querySelector(".nav-links");
    if (nav && !nav.querySelector('a[href="#open-source"]')) {
      const a = document.createElement("a");
      a.href = "#open-source";
      a.textContent = "Open Source";
      const contactLink = nav.querySelector('a[href="#contact"]');
      if (contactLink) nav.insertBefore(a, contactLink);
      else nav.appendChild(a);
    }
  }

  // —— 简历链接直连 PDF（GitHub blob 页打开慢且不触发下载） ——
  function fixResumeLink() {
    document.querySelectorAll('a[href*="Resume_Zoey"]').forEach((a) => {
      if (a.href.indexOf("raw.githubusercontent") !== -1) return;
      a.href =
        "https://raw.githubusercontent.com/zoey-billd/Portfolio/main/Resume_Zoey_UE_TA.pdf";
      a.target = "_blank";
      a.rel = "noreferrer";
    });
  }

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

/* ============================================================
   Y2K WEBCORE GARNISH v17 — 星星/代码碎片漂浮层 + 脉冲星 + 流星 + 五线谱 Thanks
   ============================================================ */
(function () {
  if (window.__webcoreGarnish) return;
  window.__webcoreGarnish = true;

  var STAR = "M50 4 L60 37 L95 37 L67 58 L77 93 L50 71 L23 93 L33 58 L5 37 L40 37 Z";
  var SPARK = "M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0 Z";

  var STARS = [
    { top: "9%", left: "3.5%", size: 26, rot: -14, soft: false },
    { top: "26%", left: "96.2%", size: 34, rot: 10, soft: true },
    { top: "47%", left: "1.8%", size: 18, rot: 24, soft: true },
    { top: "62%", left: "96.8%", size: 22, rot: -8, soft: false },
    { top: "78%", left: "3.2%", size: 30, rot: 18, soft: false },
    { top: "93%", left: "90%", size: 18, rot: -20, soft: true },
    { top: "15%", left: "90%", size: 16, rot: 30, soft: false },
    { top: "70%", left: "8%", size: 14, rot: -30, soft: true },
    { top: "38%", left: "12%", size: 12, rot: 12, soft: true }
  ];

  var FRAGS = [
    { top: "12%", left: "72%", text: "dear, my own feelings", bare: false, rot: -3 },
    { top: "23%", left: "4.5%", text: "if (love) print('*')", bare: true, rot: 2 },
    { top: "38%", left: "92%", text: "N_ADA IZE", bare: false, rot: 5 },
    { top: "55%", left: "5.5%", text: "0x2 // riso_blu", bare: false, rot: -4 },
    { top: "67%", left: "86%", text: "MAX_NL 3:)", bare: true, rot: 3 },
    { top: "86%", left: "10%", text: "X, DT -> WEIGH", bare: false, rot: -2 },
    { top: "94%", left: "72%", text: "endless conversations", bare: true, rot: 2 },
    { top: "33%", left: "1.5%", text: "@seed 0x2F", bare: false, rot: -6 }
  ];

  function make(tag, cls, styles) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (styles) for (var k in styles) n.style.setProperty(k, styles[k]);
    return n;
  }

  function svgWrap(path, rot) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 100 100");
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", path);
    p.setAttribute("fill", "currentColor");
    s.appendChild(p);
    s.style.transform = "rotate(" + rot + "deg)";
    return s;
  }

  function buildDecor() {
    var layer = make("div", "webcore-decor");
    layer.setAttribute("aria-hidden", "true");

    STARS.forEach(function (st, i) {
      var sp = make("span", "wc-star" + (st.soft ? " is-soft" : ""), {
        top: st.top, left: st.left, width: st.size + "px", height: st.size + "px"
      });
      sp.appendChild(svgWrap(i % 3 === 1 ? SPARK : STAR, st.rot));
      layer.appendChild(sp);
    });

    FRAGS.forEach(function (fg) {
      var fr = make("span", "wc-frag" + (fg.bare ? " is-bare" : ""), {
        top: fg.top, left: fg.left, transform: "rotate(" + fg.rot + "deg)"
      });
      fr.textContent = fg.text;
      layer.appendChild(fr);
    });

    // 脉冲星放射图（旅行者金唱片同款，手绘线）
    var pulsar = make("span", "wc-pulsar", { top: "5%", right: "2.5%" });
    pulsar.innerHTML =
      '<svg viewBox="0 0 200 160" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<line x1="66" y1="82" x2="196" y2="82"/>' +
      '<line x1="66" y1="82" x2="128" y2="10" stroke-dasharray="1 4"/>' +
      '<line x1="66" y1="82" x2="150" y2="26" stroke-dasharray="4 3"/>' +
      '<line x1="66" y1="82" x2="104" y2="6" stroke-dasharray="2 3"/>' +
      '<line x1="66" y1="82" x2="46" y2="8" stroke-dasharray="4 4"/>' +
      '<line x1="66" y1="82" x2="14" y2="40" stroke-dasharray="1 4"/>' +
      '<line x1="66" y1="82" x2="4" y2="76" stroke-dasharray="5 3"/>' +
      '<line x1="66" y1="82" x2="18" y2="122" stroke-dasharray="2 4"/>' +
      '<line x1="66" y1="82" x2="52" y2="152" stroke-dasharray="4 3"/>' +
      '<line x1="66" y1="82" x2="98" y2="148" stroke-dasharray="1 5"/>' +
      '<line x1="66" y1="82" x2="122" y2="120" stroke-dasharray="3 4"/>' +
      '<circle cx="66" cy="82" r="2.4" fill="currentColor" stroke="none"/>' +
      "</svg>";
    layer.appendChild(pulsar);

    // 流星（自绘：大四角星 + 渐小拖尾）
    var shoot = make("span", "wc-shoot", { top: "56%", right: "4%" });
    shoot.innerHTML =
      '<svg viewBox="0 0 200 130" fill="currentColor">' +
      '<path d="M58 44 C61 62 70 71 88 74 C70 77 61 86 58 104 C55 86 46 77 28 74 C46 71 55 62 58 44 Z"/>' +
      '<path d="M96 52 l2.4 7.2 7.2 2.4 -7.2 2.4 -2.4 7.2 -2.4 -7.2 -7.2 -2.4 7.2 -2.4 Z"/>' +
      '<path d="M118 38 l1.8 5.4 5.4 1.8 -5.4 1.8 -1.8 5.4 -1.8 -5.4 -5.4 -1.8 5.4 -1.8 Z" opacity="0.85"/>' +
      '<path d="M138 26 l1.4 4.2 4.2 1.4 -4.2 1.4 -1.4 4.2 -1.4 -4.2 -4.2 -1.4 4.2 -1.4 Z" opacity="0.7"/>' +
      '<path d="M156 16 l1.1 3.3 3.3 1.1 -3.3 1.1 -1.1 3.3 -1.1 -3.3 -3.3 -1.1 3.3 -1.1 Z" opacity="0.55"/>' +
      '<path d="M172 8 l0.9 2.6 2.6 0.9 -2.6 0.9 -0.9 2.6 -0.9 -2.6 -2.6 -0.9 2.6 -0.9 Z" opacity="0.4"/>' +
      "</svg>";
    layer.appendChild(shoot);

    // 五线谱 Thanks 贴纸
    var thanks = make("span", "wc-thanks", { bottom: "3.5%", right: "5%" });
    thanks.innerHTML =
      '<svg viewBox="0 0 220 84" fill="none">' +
      '<g stroke="currentColor" stroke-width="1.1">' +
      '<line x1="10" y1="24" x2="212" y2="24"/><line x1="10" y1="34" x2="212" y2="34"/>' +
      '<line x1="10" y1="44" x2="212" y2="44"/><line x1="10" y1="54" x2="212" y2="54"/>' +
      '<line x1="10" y1="64" x2="212" y2="64"/></g>' +
      '<path d="M22 64 C18 44 20 30 34 22 C28 34 28 50 26 64 Z" fill="currentColor"/>' +
      '<circle cx="24" cy="66" r="4.5" fill="currentColor"/>' +
      '<text x="48" y="56" font-family="Georgia, serif" font-style="italic" font-size="40" fill="currentColor">Thanks</text>' +
      '<ellipse cx="150" cy="24" rx="4.5" ry="3.4" fill="currentColor"/>' +
      '<ellipse cx="196" cy="20" rx="4.5" ry="3.4" fill="currentColor"/>' +
      "</svg>";
    layer.appendChild(thanks);

    document.body.appendChild(layer);
  }

  function initGarnish() {
    buildDecor();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGarnish);
  } else {
    initGarnish();
  }
})();

// —— TA 工具箱板块（refresh 层注入；React 端自带 #ta-toolbox 后自动让位） ——
(function () {
  var toolCards = [
    {
      title: "资产检查器 Asset Validator",
      img: "./assets/ta-tools/asset-validator.png",
      text: "UE 编辑器内一键扫描全工程或选中目录，按路径、类名、规格、材质、蓝图、引用多维校验，输出分类错误报告，并支持一键修复与重定向修复。",
      tags: "UE5 · Editor Utility · Python"
    },
    {
      title: "贴图导入审计 Texture Import Audit",
      img: "./assets/ta-tools/texture-import-audit.png",
      text: "贴图导入前体检 sRGB、压缩格式与尺寸，逐条列出问题资产并可一键定位到具体贴图，支持批量修复。",
      tags: "UE5 · 导入规范 · 自动修复"
    },
    {
      title: "PCG Agent 调优工作台",
      img: "./assets/ta-tools/pcg-agent-workbench.png",
      text: "用自然语言描述需求（如「把蕨类调密一点，灌木更饱满」），本地 LLM 解读后调整 PCG 参数；带参数闸门与快照回滚，改错可退回。所有 AI 能力本地离线部署，工程数据不外流。",
      tags: "Ollama · 本地 LLM · 参数闸门 · 快照回滚"
    },
    {
      title: "UnrealMCP Bridge",
      img: "./assets/ta-tools/unreal-mcp-bridge.png",
      text: "UE5.6 的 MCP 适配插件，另开一条 PCG 专用 Python 通道，专治 C++ 路径在 5.6 上的稳定性问题。已开源。",
      tags: "MCP · UE5.6 · PCG · MIT",
      href: "https://github.com/zoey-billd/UnrealMCPBridge"
    },
    {
      title: "AI 材质管线（本地部署）",
      img: "",
      text: "生成图经 ComfyUI / CHORD 推理出 BaseColor、Normal、Roughness，自动导入 UE 并校验色彩空间，AI 环节全程离线。",
      tags: "ComfyUI · PBR · 离线部署"
    }
  ];

  function injectToolbox() {
    if (document.getElementById("ta-toolbox")) return;
    var contact = document.querySelector("section#contact, .contact-section");
    if (!contact || !contact.parentNode) return;

    var cards = toolCards.map(function (t) {
      var shot = t.img
        ? '<figure class="toolbox-shot"><img src="' + t.img + '" alt="' + t.title + '" loading="lazy"></figure>'
        : '<div class="toolbox-shot is-empty" aria-hidden="true"></div>';
      var link = t.href
        ? '<a class="toolbox-link" href="' + t.href + '" target="_blank" rel="noreferrer">GitHub &#8599;</a>'
        : "";
      return '<div class="strength-card toolbox-card">' + shot +
        "<h3>" + t.title + "</h3>" +
        "<p>" + t.text + "</p>" +
        '<span class="oss-tags">' + t.tags + "</span>" + link +
        "</div>";
    }).join("");

    var section = document.createElement("section");
    section.className = "section strengths-section toolbox-section";
    section.id = "ta-toolbox";
    section.innerHTML =
      '<div class="section-inner">' +
      '<div class="section-heading compact-heading">' +
      '<p class="eyebrow">TA Tooling</p>' +
      "<h2>把重复的检查与调参，做成能直接用的工具。</h2>" +
      "</div>" +
      '<div class="strength-grid toolbox-grid">' + cards + "</div>" +
      '<div class="skill-ribbon"><a href="#open-source">开源仓库 &#8594;</a></div>' +
      "</div>";

    // 板块顺序：TA 工具箱 → Open Source → Contact（谁先注入都能归位）
    var ossSection = document.getElementById("open-source");
    var anchor = ossSection || contact;
    if (section.nextSibling !== anchor) contact.parentNode.insertBefore(section, anchor);

    // 导航项同样归位
    var nav = document.querySelector(".nav-links");
    if (nav) {
      var link = nav.querySelector('a[href="#ta-toolbox"]');
      if (!link) {
        link = document.createElement("a");
        link.href = "#ta-toolbox";
        link.textContent = "TA 工具箱";
      }
      var ossLink = nav.querySelector('a[href="#open-source"]');
      var contactLink = nav.querySelector('a[href="#contact"]');
      var navAnchor = ossLink || contactLink;
      if (navAnchor) {
        if (link.nextSibling !== navAnchor) nav.insertBefore(link, navAnchor);
      } else if (!link.parentNode) {
        nav.appendChild(link);
      }
    }
  }

  function boot() {
    injectToolbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  var observer = new MutationObserver(function () {
    observer.disconnect();
    try { injectToolbox(); } finally { observer.observe(document.body, { childList: true, subtree: true }); }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
