"use strict";

// just in case
{
    const noscript = document.getElementById("noscript");
    if (noscript)
        noscript.remove();
}

const TIME = document.timeline;
const ZERO = TIME.currentTime;
class AnimatedValue {
    constructor(initialValue = 0, duration = 0) {
        this.value = initialValue;
        this.duration = duration;
        this.finished = true;
    }

    change(newValue = 0, duration = undefined) {
        if (newValue === this.value) {
            this.finished = true;
            return;
        }
        if (duration !== undefined)
            this.duration = duration;
        this.targetValue = newValue;
        this.oldValue = this.value;
        this.start = TIME.currentTime;
        this.finished = false;
    }

    step() {
        if (this.finished) return;
        const t = TIME.currentTime - this.start;
        if (t < this.duration) {
            const e = ease(t / this.duration);
            this.value = this.targetValue * e + this.oldValue * (1 - e);
        } else {
            this.finished = true;
            this.value = this.targetValue;
        }
    }
}

const bgMix = document.getElementById("bg-mix");
const ring = document.getElementById("ring");
const iconContainer = document.getElementById("icon-container");
const containerStyle = iconContainer.style;

const icons = [
    document.getElementById("okazil"),
    document.getElementById("kizket"),
    document.getElementById("kiryo")
];
icons[0].addEventListener("mouseenter", () => {
    bgMix.classList.add("glub");
    icons[1].classList.add("shrink");
    icons[2].classList.add("shrink");
});
icons[0].addEventListener("mouseleave", () => {
    bgMix.classList.remove("glub");
    icons[1].classList.remove("shrink");
    icons[2].classList.remove("shrink");
});
icons[1].addEventListener("mouseenter", () => {
    bgMix.classList.add("critta");
    icons[0].classList.add("shrink");
    icons[2].classList.add("shrink");
});
icons[1].addEventListener("mouseleave", () => {
    bgMix.classList.remove("critta");
    icons[0].classList.remove("shrink");
    icons[2].classList.add("shrink");
});
icons[2].addEventListener("mouseenter", () => {
    bgMix.classList.add("cantharus");
    icons[0].classList.add("shrink");
    icons[1].classList.add("shrink");
});
icons[2].addEventListener("mouseleave", () => {
    bgMix.classList.remove("cantharus");
    icons[0].classList.remove("shrink");
    icons[1].classList.remove("shrink");
});

const INTRO_DUR = 3000;
const HOVER_DUR = 2000;

const ANGLE_DELTA_INTRO = 20;
const ANGLE_DELTA_MAIN = 0.75;
const angleDelta = new AnimatedValue(ANGLE_DELTA_INTRO);
angleDelta.change(ANGLE_DELTA_MAIN, INTRO_DUR);

const RADIUS_INTRO = 2;
const RADIUS_MAIN = 1;
const RADIUS_HOVER = 0.8;
const radius = new AnimatedValue(RADIUS_INTRO);
radius.change(RADIUS_MAIN, INTRO_DUR);

let introFinished;
let queueHover;

function hoverStart() {
    angleDelta.change(0, HOVER_DUR);
    radius.change(RADIUS_HOVER, HOVER_DUR);
    ring.style.scale = RADIUS_HOVER;
}

function hoverEnd() {
    angleDelta.change(ANGLE_DELTA_MAIN, HOVER_DUR);
    radius.change(RADIUS_MAIN, HOVER_DUR);
    ring.style.scale = RADIUS_MAIN;
}

iconContainer.addEventListener("mouseenter", () => {
    if (introFinished) {
        hoverStart();
    } else {
        queueHover = true;
    }
});
iconContainer.addEventListener("mouseleave", () => {
    if (introFinished) {
        hoverEnd();
    } else {
        queueHover = false;
    }
});

let angle = Math.random();

function animStep(ts) {
    const t = ts - ZERO;
    if (t >= INTRO_DUR && !introFinished) {
        introFinished = true;
        if (queueHover) hoverStart();
    }
    applyAnim(ts);
    requestAnimationFrame(animStep);
}
requestAnimationFrame(animStep);

let last = ZERO;
function applyAnim(ts) {
    const t = ts - last;
    last = ts;
    radius.step();
    angleDelta.step();
    angle = (angle + angleDelta.value * t * 0.0001) % 1;
    containerStyle.setProperty("--angle", angle);
    containerStyle.setProperty("--radius", radius.value);
}

function ease(x) {
    return 1 - Math.pow(1 - x, 3);
}
