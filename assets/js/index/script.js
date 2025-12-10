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
  if ($(window).width() < 1024) return;

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
  const popup = $(".intruction");
  if (!popup.length) return;

  const btnClose = popup.find(".icon-close");
  const title = popup.find(".title");
  const action1 = popup.find(".action").not(".action-2");
  const action2 = popup.find(".action-2");
  const desc1 = popup.find(".desc").not(".desc-2");
  const desc2 = popup.find(".desc-2");

  const isInstruction = popup.hasClass("popup-intruction");

  // SplitText
  let splitTitle = null;
  if (title.length) splitTitle = new SplitText(title, { type: "words, chars" });

  let splitDesc1 = [];
  desc1.each(function () {
    splitDesc1.push(new SplitText($(this), { type: "words, chars" }));
  });

  let splitDesc2 = [];
  desc2.each(function () {
    splitDesc2.push(new SplitText($(this), { type: "words, chars" }));
  });

  if (splitTitle) gsap.set(splitTitle.chars, { opacity: 0 });
  splitDesc1.forEach((s) => gsap.set(s.chars, { opacity: 0 }));
  splitDesc2.forEach((s) => gsap.set(s.chars, { opacity: 0 }));
  gsap.set(action1, { opacity: 0 });
  gsap.set(action2, { opacity: 0 });

  let delayBefore = isInstruction ? 3300 : 1800;

  setTimeout(() => {
    popup.addClass("open");
  }, delayBefore - 800);

  setTimeout(() => {
    const tl = gsap.timeline();

    // Title
    if (splitTitle) {
      tl.to(splitTitle.chars, {
        opacity: 1,
        duration: 1,
        stagger: 1 / splitTitle.chars.length,
        ease: "power2.out"
      });
    }

    // Action 1
    if (action1.length) {
      tl.to(action1, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }

    // Desc 1
    splitDesc1.forEach((s) => {
      tl.to(s.chars, {
        opacity: 1,
        duration: 2,
        stagger: 2 / s.chars.length,
        ease: "power1.out"
      });
    });

    // Action 2
    if (action2.length) {
      tl.to(action2, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }

    // Desc 2
    splitDesc2.forEach((s) => {
      tl.to(s.chars, {
        opacity: 1,
        duration: 2,
        stagger: 2 / s.chars.length,
        ease: "power1.out"
      });
    });
  }, delayBefore);

  btnClose.on("click", function () {
    popup.removeClass("open");
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

  const images = section.querySelectorAll(".image img");
  const imageBlocks = section.querySelectorAll(".facilities-wrapper .image");
  const items360 = section.querySelectorAll(".facilities-wrapper .item-360");
  const tabs = section.querySelectorAll(".facilities-tabs.desktop .tab-item");
  const tooltips = section.querySelector(".tooltips");
  const tooltipAreas = section.querySelectorAll(".tooltip-area");

  /* DEFAULT */
  function showDefault() {
    tabs.forEach((t) => t.classList.remove("active"));

    const defaultTab = section.querySelector('.tab-item[data-tab="all"]');
    if (defaultTab) defaultTab.classList.add("active");

    images.forEach((img) =>
      img.classList.toggle("active", img.dataset.tab === "all")
    );

    items360.forEach((item) => item.classList.add("d-none"));
    imageBlocks.forEach((block) => block.classList.remove("d-none"));

    tooltipAreas.forEach((t) => t.classList.remove("hide"));
    if (tooltips) tooltips.classList.remove("hide");
  }

  showDefault();

  /* SHOW 360 */
  function show360(tabData) {
    const item360 = section.querySelector(
      `.facilities-wrapper .item-360[data-tab="${tabData}"]`
    );

    if (!item360) return false;

    items360.forEach((i) => i.classList.add("d-none"));
    item360.classList.remove("d-none");

    imageBlocks.forEach((b) => b.classList.add("d-none"));

    tooltipAreas.forEach((t) => t.classList.add("hide"));
    if (tooltips) tooltips.classList.add("hide");

    return true;
  }

  /* ===========================
        DESKTOP: CLICK
  ============================ */
  if (window.innerWidth > 991) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabData = tab.dataset.tab;

        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const have360 = show360(tabData);
        if (have360) return;

        // Không có 360 → show hình ảnh
        items360.forEach((i) => i.classList.add("d-none"));
        imageBlocks.forEach((b) => b.classList.remove("d-none"));

        if (tabData === "all") {
          images.forEach((img) =>
            img.classList.toggle("active", img.dataset.tab === "all")
          );
          tooltipAreas.forEach((t) => t.classList.remove("hide"));
          if (tooltips) tooltips.classList.remove("hide");
          return;
        }

        // Tab khác ALL
        images.forEach((img) =>
          img.classList.toggle("active", img.dataset.tab === tabData)
        );

        tooltipAreas.forEach((t) =>
          t.classList.toggle("hide", t.dataset.tab !== tabData)
        );

        if (tooltips) tooltips.classList.add("hide");
      });
    });
  }

  /* ===========================
        MOBILE: CLICK DROPDOWN
  ============================ */
  if (window.innerWidth < 992) {
    const mobileTabsWrap = section.querySelector(".facilities-tabs.mobile");
    if (mobileTabsWrap) {
      const dropdownItems = mobileTabsWrap.querySelectorAll(
        ".dropdown-custom-item"
      );
      const dropdownToggleLabel = mobileTabsWrap.querySelector(
        ".dropdown-custom-text"
      ); // nếu bạn có phần hiển thị label

      dropdownItems.forEach((item) => {
        // lắng nghe click trên toàn item (bao gồm span)
        item.addEventListener("click", function (e) {
          // tìm element chứa data-tab (ưu tiên span[data-tab], fallback data-tab trên item)
          const span = this.querySelector("span[data-tab]");
          const tabData = span ? span.dataset.tab : this.dataset.tab;
          if (!tabData) return;

          // bật active cho dropdown item đã chọn, tắt các item khác
          dropdownItems.forEach((it) => it.classList.remove("active"));
          this.classList.add("active");

          // cập nhật label trên dropdown (nếu có)
          if (dropdownToggleLabel) {
            const labelText = span
              ? span.textContent.trim()
              : this.textContent.trim();
            dropdownToggleLabel.textContent = labelText;
          }

          // xử lý 360 / ảnh giống desktop
          const have360 = show360(tabData);
          if (have360) return; // nếu có 360 thì dừng

          // không có 360 -> show ảnh + tooltip
          items360.forEach((i) => i.classList.add("d-none"));
          imageBlocks.forEach((b) => b.classList.remove("d-none"));

          if (tabData === "all") {
            images.forEach((img) =>
              img.classList.toggle("active", img.dataset.tab === "all")
            );
            tooltipAreas.forEach((t) => t.classList.remove("hide"));
            if (tooltips) tooltips.classList.remove("hide");
            return;
          }

          // tab cụ thể
          images.forEach((img) =>
            img.classList.toggle("active", img.dataset.tab === tabData)
          );
          tooltipAreas.forEach((t) =>
            t.classList.toggle("hide", t.dataset.tab !== tabData)
          );
          if (tooltips) tooltips.classList.add("hide");
        });
      });
    }
  }
}

function updateImageWidth() {
  const sectionWidth = window.innerWidth;
  const sectionHeight = window.innerHeight - 69; // height = calc(100dvh - 69px)
  const aspectRatio = 2160 / 1111; // width / height

  if (sectionWidth > 992) return;

  const images = document.querySelectorAll(
    ".facilities .image, .location-wrapper .image"
  );

  images.forEach((img) => {
    const newWidth = sectionHeight * aspectRatio;
    img.style.height = sectionHeight + "px";
    img.style.width = newWidth + "px";
  });
}

function customDropdown() {
  const dropdowns = document.querySelectorAll(".dropdown-custom");

  dropdowns.forEach((dropdown) => {
    const btnDropdown = dropdown.querySelector(".dropdown-custom-btn");
    const dropdownMenu = dropdown.querySelector(".dropdown-custom-menu");
    const dropdownItems = dropdown.querySelectorAll(".dropdown-custom-item");
    const valueSelect = dropdown.querySelector(".value-select");

    // Toggle dropdown on button click
    btnDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      dropdownMenu.classList.toggle("dropdown--active");
      btnDropdown.classList.toggle("--active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    // Handle item selection
    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        // Kiểm tra dropdown này có nằm trong .section-model không
        const isInSectionModel = dropdown.closest(".section-model") !== null;

        // Lấy text trong item click
        const clickedText =
          item.querySelector("span")?.textContent.trim() || "";

        // Lấy data-tab (hoặc data khác)
        const clickedDataTab = item.dataset.tab || "";

        // ===============================
        // CASE 1: dropdown thuộc .section-model
        // => CHỈ đổi TEXT + DATA, KHÔNG đổi HTML
        // ===============================
        if (isInSectionModel) {
          const spanEl = valueSelect.querySelector("span");
          if (spanEl) spanEl.textContent = clickedText;

          if (clickedDataTab) valueSelect.dataset.tab = clickedDataTab;

          closeAllDropdowns();
          return; // IMPORTANT: không chạy xuống logic HTML swap
        }

        // ===============================
        // CASE 2: dropdown bình thường (giữ logic cũ)
        // ===============================
        const currentImgEl = valueSelect.querySelector("img");
        const currentImg = currentImgEl ? currentImgEl.src : "";
        const currentText =
          valueSelect.querySelector("span")?.textContent.trim() || "";
        const currentHtml = valueSelect.innerHTML;

        const clickedHtml = item.innerHTML;

        // Gán html clicked lên button
        valueSelect.innerHTML = clickedHtml;

        const isSelectTime = currentText === "Time";

        // Swap html ngược lại cho item
        if (!isSelectTime) {
          if (currentImg) {
            item.innerHTML = `<img src="${currentImg}" alt="" /><span>${currentText}</span>`;
          } else {
            item.innerHTML = currentHtml;
          }
        }

        closeAllDropdowns();
      });
    });

    // Close dropdown on scroll
    window.addEventListener("scroll", function () {
      if (dropdownMenu.closest(".header-lang")) {
        dropdownMenu.classList.remove("dropdown--active");
        btnDropdown.classList.remove("--active");
      }
    });
  });

  function closeAllDropdowns(exception) {
    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-custom-menu");
      const btn = dropdown.querySelector(".dropdown-custom-btn");

      if (!exception || dropdown !== exception) {
        menu.classList.remove("dropdown--active");
        btn.classList.remove("--active");
      }
    });
  }
}

function sectionModel() {
  if ($(".section-model").length < 1) return;

  $(".dropdown-custom-item").on("click", function () {
    // lấy span bên trong
    const span = $(this).find("span");
    if (!span.length) return;

    const tabId = span.data("tab");
    // console.log(tabId);

    const trigger = $(`[data-bs-target="#${tabId}"]`);

    if (trigger.length) {
      const tab = new bootstrap.Tab(trigger[0]);
      tab.show();
    }
  });
}

document.addEventListener("DOMContentLoaded", sectionModel);

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  magicCursor();
  sectionOverview();
  loading();
  popupIntruction();
  sectionGallery();
  sectionFacilities();
  updateImageWidth();
  customDropdown();
  // sectionModel();
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
