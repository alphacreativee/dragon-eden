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
  if (!document.querySelector(".loading")) return;
  const logo = document.getElementById("logo");
  const loadingAfter = document.querySelector(".loading");
  // const yPos = window.innerHeight - 173;
  const YPOS = {
    mobile: window.innerHeight - 115,
    desktop: window.innerHeight - 173
  };

  const yPos = window.innerWidth < 991 ? YPOS.mobile : YPOS.desktop;
  const ASPECT_RATIOS = {
    mobile: 3,
    desktop: 145 / 28
  };
  const aspectRatio =
    window.innerWidth < 1024 ? ASPECT_RATIOS.mobile : ASPECT_RATIOS.desktop;
  const paddingTop = 15;

  gsap.set(logo, {
    y: yPos,
    scale: aspectRatio
  });

  gsap.set(loadingAfter, {
    "--after-height": "0px"
  });

  gsap.to(logo, {
    y: 0,
    duration: 2,
    ease: "expo.in",
    onUpdate: function () {
      const logoRect = logo.getBoundingClientRect();
      const logoTop = logoRect.top;
      const afterHeight = window.innerHeight - logoTop + paddingTop;
      gsap.set(loadingAfter, {
        "--after-height": afterHeight + "px"
      });
    },
    onComplete: () => {
      gsap.to(logo, {
        scale: 1,
        duration: 1,
        ease: "expo.in",
        onComplete: () => {
          document.querySelector(".loading").classList.add("loaded");
        }
      });
    }
  });
}

function popupIntruction() {
  if ($(".intruction").length < 1) return;

  const btnCloseIntruction = $(".intruction .icon-close");
  const popupIntruction = $(".intruction");

  setTimeout(() => {
    popupIntruction.addClass("open");
  }, 2000);

  btnCloseIntruction.on("click", function () {
    popupIntruction.removeClass("open");
  });
}

function sectionGallery() {
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
  // loading();
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
    console.log("1");
  }
});

$(window).on("beforeunload", function () {
  if (!isLinkClicked) {
    $(window).scrollTop(0);
  }
  isLinkClicked = false;
});
