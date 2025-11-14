import { preloadImages } from "../../libs/utils.js";
("use strict");
$ = jQuery;
// setup lenis

// const lenis = new Lenis();
// lenis.on("scroll", ScrollTrigger.update);
// gsap.ticker.add((time) => {
//   lenis.raf(time * 1000);
// });
// gsap.ticker.lagSmoothing(0);

// end lenis

function magicCursor() {
  if ($(window).width < 1024) return;

  var circle = document.querySelector(".magic-cursor");

  gsap.set(circle, {
    xPercent: -50,
    yPercent: -50
  });

  let mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(circle, {
      x: mouseX,
      y: mouseY,
      duration: 0.1
    });
  });

  const items = document.querySelectorAll(".modal, [data-cursor-text]");
  var cursorDot = document.querySelector(".magic-cursor .cursor");
  var cursorText = document.querySelector(".magic-cursor .cursor .text");

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      let text = "";
      if (item.classList.contains("modal")) {
        text = "Đóng";
      } else {
        text = item.getAttribute("data-cursor-text");
      }

      // const text = item.getAttribute("data-cursor-text");
      cursorText.innerHTML = `<span class="color-white">${text}</span>`;
      cursorDot.classList.add("show-text");
    });

    item.addEventListener("mouseleave", () => {
      cursorText.innerHTML = "";
      cursorDot.classList.remove("show-text");
    });
  });

  const itemsContent = document.querySelectorAll(".modal-dialog");
  itemsContent.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.remove("show-text");
    });
    item.addEventListener("mouseleave", () => {
      cursorText.innerHTML = `<span class="color-white">Đóng</span>`;
      cursorDot.classList.add("show-text");
    });
  });
}

function sectionOverview() {
  if ($("section.overview").length < 1) return;

  const toggleInput = $(".overview-switcher .toggle-checkbox");

  toggleInput.on("change", function () {
    const isDark = $(this).is(":checked");
    const theme = isDark ? "dark" : "light";

    $(".overview-main__item").removeClass("active");
    $(`.overview-main__${theme}`).addClass("active");
  });
}

function loading() {
  const loadingEl = document.querySelector(".loading");
  if (!loadingEl) return;

  const tl = gsap.timeline({
    defaults: { ease: "none" }
  });

  const namePaths = document.querySelectorAll(".logo-name");

  // RESET trạng thái
  gsap.set(".logo-image", { opacity: 0 });
  gsap.set(namePaths, { opacity: 0 });
  gsap.set(".logo-slogan", { opacity: 0 });

  tl.to(".logo-image", {
    opacity: 1,
    duration: 0.5
  })

    .to(
      namePaths,
      {
        opacity: 1,
        stagger: 0.06,
        duration: 0.6
      },
      ">-=0.1"
    )

    .to(
      ".logo-slogan",
      {
        opacity: 1,
        duration: 0.4
      },
      ">"
    )

    .to(".loading", {
      clipPath: "inset(0% 0% 0% 100%)",
      // opacity: 0,
      duration: 1,
      onComplete: () => loadingEl.classList.add("d-none")
    });
}

function popupIntruction() {
  if ($(".intruction").length < 1) return;

  const btnCloseIntruction = $(".intruction .icon-close");
  const popupIntruction = $(".intruction");

  setTimeout(() => {
    popupIntruction.addClass("open");
  }, 3000);

  btnCloseIntruction.on("click", function () {
    popupIntruction.removeClass("open");
  });
}

function sectionGallery() {
  if ($(".gallery").length < 1) return;

  let lightboxInstance = null; // Lưu instance hiện tại của Glightbox

  function initLightboxForActiveTab() {
    // Hủy instance cũ nếu có
    if (lightboxInstance) {
      lightboxInstance.destroy();
      lightboxInstance = null;
    }

    // Lấy tab đang active
    const activeTab = document.querySelector(".tab-pane.active.show");
    if (!activeTab) return;

    // Đặt đúng selector (phải có dấu #)
    const selector = `#${activeTab.id} .glightbox`;

    // Nếu tab này không có phần tử nào thì bỏ qua
    if (!activeTab.querySelector(".glightbox")) return;

    // Khởi tạo Glightbox riêng cho tab đó
    lightboxInstance = GLightbox({
      selector: selector,
      loop: true,
      touchNavigation: true,
      autoplayVideos: true
    });
  }

  // Khởi tạo khi trang load
  initLightboxForActiveTab();

  // Re-init khi đổi tab
  const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
  tabButtons.forEach((btn) => {
    btn.addEventListener("shown.bs.tab", function () {
      initLightboxForActiveTab();
    });
  });
}

function sectionFacilities() {
  const section = document.querySelector(".facilities");
  if (!section) return;

  const svg = section.querySelector("svg");
  const tooltipsContainer = section.querySelector(".tooltips");
  if (!svg || !tooltipsContainer) return;

  // ===== TAB HOVER HANDLER =====
  const facilitiesTabs = section.querySelectorAll(".facilities-tabs .tab-item");

  function activateTab(tabData) {
    // remove active from all tabs
    facilitiesTabs.forEach((t) => t.classList.remove("active"));

    // add active to matched tab
    const matchedTab = section.querySelector(
      `.tab-item[data-tab='${tabData}']`
    );
    if (matchedTab) matchedTab.classList.add("active");

    // hide all svg areas
    const areas = section.querySelectorAll("svg .area");
    areas.forEach((area) => area.classList.add("hide"));

    // show only matched area
    if (tabData !== "all") {
      const activeArea = section.querySelector(
        `svg .area[data-tab='${tabData}']`
      );
      if (activeArea) activeArea.classList.remove("hide");
    }
  }

  // Tab hover event
  facilitiesTabs.forEach((tab) => {
    tab.addEventListener("mouseenter", function () {
      const tabData = tab.getAttribute("data-tab");
      activateTab(tabData);
    });
  });

  // ===== AREA HOVER HANDLER (NEW) =====
  const svgAreas = svg.querySelectorAll(".area");

  svgAreas.forEach((area) => {
    area.addEventListener("mouseenter", function () {
      const tabData = area.getAttribute("data-tab");
      activateTab(tabData);
    });
  });

  // ===== TOOLTIP CREATION =====
  const dots = svg.querySelectorAll(".dot");
  const svgRect = svg.getBoundingClientRect();

  tooltipsContainer.innerHTML = ""; // reset tooltips

  dots.forEach((dot) => {
    const box = dot.getBBox();
    const centerX = box.x + box.width / 2;
    const centerY = box.y;

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip-area";

    tooltip.innerHTML = dot.dataset.text;

    const lineHeight = dot.dataset.heightLine
      ? parseInt(dot.dataset.heightLine, 10)
      : 70;

    tooltip.style.setProperty("--line-height", `${lineHeight}px`);

    const pt = svg.createSVGPoint();
    pt.x = centerX;
    pt.y = centerY;
    const screenPoint = pt.matrixTransform(svg.getScreenCTM());

    tooltip.style.left = `${screenPoint.x - svgRect.left}px`;
    tooltip.style.top = `${screenPoint.y - svgRect.top - (lineHeight + 10)}px`;

    tooltipsContainer.appendChild(tooltip);
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  magicCursor();
  sectionOverview();
  loading();
  popupIntruction();
  sectionGallery();
  sectionFacilities();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

// loadpage
let isLinkClicked = false;
$("a").on("click", function (e) {
  // Nếu liên kết dẫn đến trang khác (không phải hash link hoặc javascript void)
  if (this.href && !this.href.match(/^#/) && !this.href.match(/^javascript:/)) {
    isLinkClicked = true;
  }
});

$(window).on("beforeunload", function () {
  if (!isLinkClicked) {
    $(window).scrollTop(0);
  }
  isLinkClicked = false;
});
