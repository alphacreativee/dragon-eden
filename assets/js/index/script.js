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
    defaults: { ease: "power2.inOut" }
  });

  tl.fromTo(
    ".loading .logo",
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.8,
      ease: "none"
    }
  ).to(".loading", {
    clipPath: "inset(0% 0% 0% 100%)",
    duration: 1.7,
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

  var lightboxDescription = GLightbox({
    selector: ".glightbox",
    loop: true,
    touchNavigation: true,
    autoplayVideos: true
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  magicCursor();
  sectionOverview();
  loading();
  popupIntruction();
  sectionGallery();
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
