gsap.registerPlugin(ScrollTrigger);

// Video background
const video = document.getElementById("video");
video.addEventListener("loadedmetadata", () => {
  const duration = video.duration;
  let targetTime = 0;

  const scrollLength = window.innerHeight * 4; // scroll factor

  gsap.to({}, {
    scrollTrigger: {
      trigger: ".scroll-section",
      start: "top top",
      end: "+=" + scrollLength,
      scrub: true,
      onUpdate: self => {
        targetTime = self.progress * duration;
      }
    }
  });

  function animate() {
    video.currentTime += (targetTime - video.currentTime) * 0.2; 
    requestAnimationFrame(animate);
  }

  animate();
});

// Resume item section fade in & out
const fadeIn = {yPercent: 0, opacity: 1, duration: 1}
const fadeOut = {yPercent: -100, opacity: 0, duration: 2}
gsap.set(".resume-item", {yPercent: 100, opacity: 0});
gsap.utils.toArray(".resume-item").forEach((element) => {
  ScrollTrigger.create({
    trigger: element,
    start: "top 75%",
    end: "bottom 60%",
    toggleActions: "play reverse play reverse",
    onEnter: () => gsap.to(element, fadeIn),
    onEnterBack: () => gsap.to(element, fadeIn),
    onLeave: () => gsap.to(element, fadeOut),
    onLeaveBack: () => gsap.to(element, {yPercent: 100, opacity: 0, duration: 2}),
  })
});