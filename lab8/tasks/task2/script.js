'use strict';

const sliderElement = document.getElementById("slider");
const trackElement = document.getElementById("track");
const sliderArrows = document.getElementById("sliderArrows");
const sliderDots = document.getElementById("sliderDots");
const speedInput = document.getElementById("speedInput");
const autoplayCheckbox = document.getElementById("autoplayCheckbox");
const showArrowsCheckbox = document.getElementById("showArrowsCheckbox");
const showDotsCheckbox = document.getElementById("showDotsCheckbox");
const imagesInput = document.getElementById("imagesInput");
const applyBtn = document.getElementById("applyConfigBtn");

const IMG_PATH = "../../img/";
const IMG_EXT = ".jpg";

let currentConfig = {
  images: ["mountains", "ocean", "forest", "city", "desert"],
  speed: 500,
  autoplay: true,
  autoplayDelay: 3000,
  showArrows: true,
  showDots: true,
};

let originalSlidesCount = 0;
let totalClonedSlides = 0;
let visibleIndex = 1;
let realIndex = 0;
let isTransitioning = false;
let autoInterval = null;
let mouseOnSlider = false;
let transitionDuration = currentConfig.speed;

function getImageUrl(imageName) {
  return `${IMG_PATH}${imageName}${IMG_EXT}`;
}

function createSlideElement(imageName, altText) {
  const slideDiv = document.createElement("div");
  slideDiv.className = "slide";
  const img = document.createElement("img");
  img.src = getImageUrl(imageName);
  img.alt = altText || imageName;
  img.onerror = () => {
    img.style.objectFit = "contain";
    img.style.background = "#2c3e50";
    img.style.padding = "20px";
    img.src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%2334495e"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3E⚠️ ' +
      imageName +
      "%3C/text%3E%3C/svg%3E";
  };
  slideDiv.appendChild(img);
  return slideDiv;
}

function getExtendedSlides(arr) {
  if (!arr.length) return [];
  return [arr[arr.length - 1], ...arr, arr[0]];
}

function computeRealIndex(visIdx, origLen) {
  if (visIdx === 0) return origLen - 1;
  if (visIdx === origLen + 1) return 0;
  return visIdx - 1;
}

function updateDotsUI(activeRealIdx) {
  if (!currentConfig.showDots) return;
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    if (i === activeRealIdx) dot.classList.add("active");
    else dot.classList.remove("active");
  });
}

function applyTransform(index, withTransition = true) {
  if (!trackElement) return;
  trackElement.style.transition = withTransition
    ? `transform var(--transition-duration, ${transitionDuration}ms) cubic-bezier(0.2,0.9,0.4,1.1)`
    : "none";
  trackElement.style.transform = `translateX(-${index * 100}%)`;
}

function setTransitionDuration(ms) {
  transitionDuration = ms;
  sliderElement?.style.setProperty("--transition-duration", `${ms}ms`);
}

function stopAutoplay() {
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
  }
}
function startAutoplay() {
  if (currentConfig.autoplay && !mouseOnSlider && autoInterval === null) {
    autoInterval = setInterval(() => {
      if (!isTransitioning && !mouseOnSlider) nextSlide();
    }, currentConfig.autoplayDelay);
  }
}
function resetAutoplay() {
  if (currentConfig.autoplay) {
    stopAutoplay();
    startAutoplay();
  }
}

function handleInfiniteCorrection() {
  if (isTransitioning) return;
  let corrected = false;
  if (visibleIndex === 0) {
    visibleIndex = originalSlidesCount;
    corrected = true;
  } else if (visibleIndex === totalClonedSlides - 1) {
    visibleIndex = 1;
    corrected = true;
  }
  if (corrected) {
    applyTransform(visibleIndex, false);
    realIndex = computeRealIndex(visibleIndex, originalSlidesCount);
    updateDotsUI(realIndex);
  }
}

function smoothMoveTo(newVisibleIdx) {
  if (isTransitioning || newVisibleIdx === visibleIndex) return false;
  isTransitioning = true;
  visibleIndex = newVisibleIdx;
  applyTransform(visibleIndex, true);
  const onEnd = () => {
    trackElement.removeEventListener("transitionend", onEnd);
    isTransitioning = false;
    realIndex = computeRealIndex(visibleIndex, originalSlidesCount);
    updateDotsUI(realIndex);
    handleInfiniteCorrection();
    resetAutoplay();
  };
  trackElement.addEventListener("transitionend", onEnd, { once: true });
  setTimeout(() => {
    if (isTransitioning) {
      trackElement.removeEventListener("transitionend", onEnd);
      isTransitioning = false;
      realIndex = computeRealIndex(visibleIndex, originalSlidesCount);
      updateDotsUI(realIndex);
      handleInfiniteCorrection();
      resetAutoplay();
    }
  }, transitionDuration + 50);
  return true;
}

function nextSlide() {
  if (isTransitioning) return;
  let next = visibleIndex + 1;
  if (next >= totalClonedSlides) next = totalClonedSlides - 1;
  smoothMoveTo(next);
}
function prevSlide() {
  if (isTransitioning) return;
  let prev = visibleIndex - 1;
  if (prev < 0) prev = 0;
  smoothMoveTo(prev);
}
function goToSlide(realIdx) {
  if (isTransitioning) return;
  if (realIdx < 0 || realIdx >= originalSlidesCount) return;
  const targetVis = realIdx + 1;
  if (targetVis === visibleIndex) return;
  smoothMoveTo(targetVis);
}

function renderArrowsAndDots() {
  sliderArrows.innerHTML = "";
  if (currentConfig.showArrows) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "arrow-btn";
    prevBtn.innerHTML = "←";
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prevSlide();
    });
    const nextBtn = document.createElement("button");
    nextBtn.className = "arrow-btn";
    nextBtn.innerHTML = "→";
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      nextSlide();
    });
    sliderArrows.append(prevBtn, nextBtn);
  }
  sliderDots.innerHTML = "";
  if (currentConfig.showDots) {
    for (let i = 0; i < originalSlidesCount; i++) {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === realIndex ? " active" : "");
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        goToSlide(i);
      });
      sliderDots.appendChild(dot);
    }
  }
}

function buildSlider(imagesArray) {
  if (!trackElement) return;
  trackElement.innerHTML = "";
  const extended = getExtendedSlides(imagesArray);
  totalClonedSlides = extended.length;
  originalSlidesCount = imagesArray.length;
  extended.forEach((imgName, idx) => {
    trackElement.appendChild(createSlideElement(imgName, `Slide ${idx + 1}`));
  });
  visibleIndex = 1;
  realIndex = 0;
  applyTransform(visibleIndex, false);
  renderArrowsAndDots();
}

function bindEvents() {
  window.removeEventListener("keydown", window._keyHandler);
  window._keyHandler = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };
  window.addEventListener("keydown", window._keyHandler);
  if (sliderElement) {
    sliderElement.removeEventListener("mouseenter", window._mouseEnter);
    sliderElement.removeEventListener("mouseleave", window._mouseLeave);
    window._mouseEnter = () => {
      mouseOnSlider = true;
      if (currentConfig.autoplay) stopAutoplay();
    };
    window._mouseLeave = () => {
      mouseOnSlider = false;
      if (currentConfig.autoplay) {
        stopAutoplay();
        startAutoplay();
      }
    };
    sliderElement.addEventListener("mouseenter", window._mouseEnter);
    sliderElement.addEventListener("mouseleave", window._mouseLeave);
  }
}

function initSlider(userConfig) {
  stopAutoplay();
  isTransitioning = false;
  currentConfig = { ...currentConfig, ...userConfig };
  setTransitionDuration(currentConfig.speed);
  buildSlider(currentConfig.images);
  bindEvents();
  if (currentConfig.autoplay && !mouseOnSlider) startAutoplay();
}

function applySettingsFromUI() {
  const rawImages = imagesInput.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  if (rawImages.length === 0) {
    alert("Введіть хоча б одну назву слайда!");
    return;
  }
  const newConfig = {
    images: rawImages,
    speed: parseInt(speedInput.value, 10) || 500,
    autoplay: autoplayCheckbox.checked,
    autoplayDelay: 3000,
    showArrows: showArrowsCheckbox.checked,
    showDots: showDotsCheckbox.checked,
  };
  initSlider(newConfig);
}

document.addEventListener("DOMContentLoaded", () => {
  initSlider({
    images: ["mountains", "ocean", "forest", "city", "desert"],
    speed: 500,
    autoplay: true,
    showArrows: true,
    showDots: true,
  });
  speedInput.value = currentConfig.speed;
  autoplayCheckbox.checked = currentConfig.autoplay;
  showArrowsCheckbox.checked = currentConfig.showArrows;
  showDotsCheckbox.checked = currentConfig.showDots;
  imagesInput.value = currentConfig.images.join(",");
  applyBtn.addEventListener("click", applySettingsFromUI);
});
