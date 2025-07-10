// === SETUP ===
const slides = document.querySelectorAll(".holder > .details");
const slideHeight = 2.4; // rem

const u = document.querySelector(".hero-img");
const c = u ? u.offsetWidth : 484;
const d = u ? u.offsetHeight : 660;

const f = window.innerWidth < 1025 ? "100%" : "47%";
const h =
  window.innerWidth < 551
    ? "76px"
    : window.innerWidth < 1025
    ? "76px"
    : "110px";
const _ =
  window.innerWidth < 551
    ? "76px"
    : window.innerWidth < 1025
    ? "76px"
    : "110px";
const p = window.innerWidth < 551 ? "2.5%" : "4%";

// === TIMELINE ===
const tl = gsap.timeline({ ease: "power2.inOut" });

// Counter: 0 → 50 → pause → 100
let counterObj = { value: 0 };
tl.to(
  counterObj,
  {
    value: 50,
    duration: 2.5,
    onUpdate: () => {
      document.getElementById("counter").textContent = `${Math.round(
        counterObj.value
      )}%`;
    },
    ease: "none",
  },
  0
);

tl.to({}, { duration: 2 }); // pause

tl.to(counterObj, {
  value: 100,
  duration: 2.5,
  onUpdate: () => {
    document.getElementById("counter").textContent = `${Math.round(
      counterObj.value
    )}%`;
  },
  ease: "none",
});

// Holder slides
slides.forEach((_, i) => {
  tl.to(
    ".holder",
    {
      y: `-${slideHeight * (i + 1)}rem`,
      duration: 1,
      delay: 2,
    },
    "<"
  ); // runs with counter
});

// === IMAGES: run OUTSIDE timeline, so they start at same time ===

// 1) Images appear from bottom
gsap.to(".images img", {
  duration: 2,
  stagger: 0.1,
  opacity: 1,
  y: 0,
  ease: "elastic.out(1, 0.5)",
});

// 2) Container shrinks
gsap.to(".images", {
  width: f,
  duration: 1,
  ease: "power4.inOut",
  delay: 2, // adjust if needed to match holder slide steps
});

// 3) Images resize
gsap.to(".images img", {
  width: h,
  height: _,
  duration: 1,
  ease: "power4.inOut",
  delay: 2, // same as container
});

// 4) Hide images 1, 2, 4, 5
[1, 2, 4, 5].forEach((i) => {
  gsap.to(`.images img:nth-child(${i})`, {
    delay: 3, // adjust to match your flow
    duration: i % 2 === 0 ? 0.6 : 0.9,
    clipPath: "inset(0 0 100% 0)",
    ease: "power4.inOut",
    onComplete: () => {
      gsap.set(`.images img:nth-child(${i})`, {
        position: "absolute",
      });
    },
  });
});

// 5) Center image scales up
gsap.to(".images img.relative", {
  width: `${c}px`,
  height: `${d}px`,
  duration: 1,
  y: p,
  ease: "power4.inOut",
  delay: 4, // adjust to match wipe
});

// 6) Wipe out preloader
gsap.to(".preloader", {
  duration: 1,
  ease: "power4.inOut",
  clipPath: "inset(0 0 100% 0)",
  delay: 5, // adjust to match final scale up
});
