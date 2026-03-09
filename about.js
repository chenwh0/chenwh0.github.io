const video = document.querySelector("#clip-video");
const masks = document.querySelectorAll(".mask");
let isHoveringMask = false;
const state = new Map();


function updateCoordinates (mask) {
    const s = state.get(mask);
    mask.querySelector(".coordinates").textContent = `X: ${Math.round(s.x)} Y: ${Math.round(s.y)}`;

}

function drawClipped(ctx, video, rect) {
    const videoAspect = video.videoWidth / video.videoHeight;
    const windowAspect = window.innerWidth / window.innerHeight;

    let dw, dh, dx, dy;
    if (videoAspect > windowAspect) {
        dh = window.innerHeight;
        dw = dh * videoAspect;
        dx = (window.innerWidth - dw) / 2;
        dy = 0;
    }
    else {
        dw = window.innerWidth;
        dh = dw * videoAspect;
        dx = 0;
        dy = (window.innerHeight - dh) / 2;
    }

    const scaleX = video.videoWidth / dw;
    const scaleY = video.videoHeight / dh;

    ctx.drawImage(
        video,
        (rect.x - dx) * scaleX,
        (rect.y - dy) * scaleY,
        rect.w * scaleX,
        rect.h * scaleY,
        0,
        0,
        rect.w,
        rect.h
    );
}

function initMasks() {
    masks.forEach(mask => {
        const r = mask.getBoundingClientRect();
        state.set(mask, {
            x: r.left,
            y: r.top,
            w: r.width,
            h: r.height
        });
        mask.style.left = "0";
        mask.style.top = "16vh";
        mask.style.transform = `translate(${r.left}px, ${r.top}px, 0)`;

    });
}

function initCanvases() {
    masks.forEach(mask => {
        const s = state.get(mask);
        const canvas = mask.querySelector("canvas");
        canvas.width = s.w;
        canvas.height = s.h;
    });
}

function draw() {
    masks.forEach(mask => {
        const s = state.get(mask);
        const canvas = mask.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawClipped(ctx, video, s);
        updateCoordinates(mask);
    });

    requestAnimationFrame(draw);
}

masks.forEach(mask => {
    let dragging = false;
    let ox = 0, oy = 0;
    mask.addEventListener("mouseenter", () => isHoveringMask = true);
    mask.addEventListener("mouseleave", () => isHoveringMask = false);

    mask.addEventListener("mousedown", element => {
        dragging = true;
        const s = state.get(mask);
        ox = element.clientX - s.x;
        oy = element.clientY - s.y;
        mask.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", element => {
        if (!dragging) return;
        const s = state.get(mask);
        s.x = element.clientX - ox;
        s.y = element.clientY - oy;
        mask.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;

    });
    document.addEventListener("mouseup", () => {
        dragging = false;
        mask.style.cursor = "grab";
    });
});

video.addEventListener("playing", () => {
    initMasks();
    initCanvases();
    draw();
});
