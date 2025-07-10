const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth ease out
  smooth: true,
});

// GSAP Ticker or requestAnimationFrame
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
// === CONFIG ===
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

// === 1️⃣ COUNTER + HOLDER (TIMELINE) ===
const holderTL = gsap.timeline({ ease: "power2.inOut" });

let counterObj = { value: 0 };

holderTL.to(counterObj, {
  value: 50,
  duration: 1,
  onUpdate: () => {
    document.getElementById("counter").textContent = `${Math.round(
      counterObj.value
    )}%`;
  },
  ease: "none",
});

holderTL.to({}, { duration: 2 }); // pause

holderTL.to(counterObj, {
  value: 100,
  duration: 2.5,
  onUpdate: () => {
    document.getElementById("counter").textContent = `${Math.round(
      counterObj.value
    )}%`;
  },
  ease: "none",
});

slides.forEach((_, i) => {
  gsap.to(
    ".holder",
    {
      y: `-${slideHeight * (i + 1)}rem`,
      duration: 1,
      delay: 2,
    },
    "<"
  );
});

// === 2️⃣ IMAGES (RUN OUTSIDE TIMELINE) ===
const imageAnimations = [];

// 1) Images slide in from bottom
imageAnimations.push(
  gsap.to(".images img", {
    duration: 2,
    stagger: 0.1,
    opacity: 1,
    y: 0,
    ease: "elastic.out(1, 0.5)",
  })
);

// 2) Container shrinks
imageAnimations.push(
  gsap.to(".images", {
    width: f,
    duration: 1,
    ease: "power4.inOut",
    delay: 2,
  })
);

// 3) Images resize
imageAnimations.push(
  gsap.to(".images img", {
    width: h,
    height: _,
    duration: 1,
    ease: "power4.inOut",
    delay: 2,
  })
);

// 4) Hide images 1, 2, 4, 5
[1, 2, 4, 5].forEach((i) => {
  imageAnimations.push(
    gsap.to(`.images img:nth-child(${i})`, {
      delay: 3.2,
      duration: i % 2 === 0 ? 0.6 : 0.9,
      clipPath: "inset(0 0 100% 0)",
      ease: "power4.inOut",
      onComplete: () => {
        gsap.set(`.images img:nth-child(${i})`, { position: "absolute" });
      },
    })
  );
});

// 5) Center image scales up
imageAnimations.push(
  gsap.to(".images img.relative", {
    width: `${c}px`,
    height: `${d}px`,
    duration: 1,
    y: p,
    ease: "power4.inOut",
    delay: 4,
  })
);

// === 3️⃣ WAIT FOR ALL, THEN PRELOADER ===
Promise.all([
  new Promise((resolve) => holderTL.eventCallback("onComplete", resolve)),
  ...imageAnimations.map((anim) =>
    anim.then
      ? anim
      : new Promise((resolve) => anim.eventCallback("onComplete", resolve))
  ),
]).then(() => {
  // Preloader wipes away
  gsap.to(".preloader", {
    duration: 1,
    ease: "power4.inOut",
    clipPath: "inset(0 0 100% 0)",
    onComplete: () => {
      // 1) Reveal hero section
      // gsap.to(".hero-section", {
      //   opacity: 1,
      //   pointerEvents: "auto",
      //   duration: 1,
      //   ease: "power2.out",
      // });

      // 2) Reveal hero image
      // gsap.to(".hero-img", {
      //   opacity: 1,
      //   duration: 1.2,
      //   ease: "power2.out",
      // });

      // 3) Animate heading text letters
      runHeroTextAnimation();
    },
  });
});

function runHeroTextAnimation() {
  const splitHeadings = new SplitType(".text-heading", { types: "chars" });

  gsap.from(".text-heading .char", {
    y: "100%",
    opacity: 0,
    duration: 0.8,
    ease: "power4.out",
    stagger: 0.05,
  });
}
