import { Text } from "./text.js";
import { Particle } from "./particle.js";
import { hslToHex } from "./utils.js";

export class Visual {
  constructor(stageWidth) {
    this.stageWidth = stageWidth;

    this.text = new Text();

    this.particles = [];

    this.mouse = {
      x: 0,
      y: 0,
      radius: 100,
    };

    document.addEventListener("pointermove", this.onMove.bind(this), false);
    document.addEventListener("touchend", this.onTouchEnd.bind(this), false);
  }

  show(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.pos = this.text.setText("V", 20, stageWidth, stageHeight);
    this.posTotal = this.pos.length - 1;
  }

  animate(ctx) {
    if (!this.pos) {
      return;
    }

    const maxCnt = this.stageWidth > 400 ? 10 : 2;

    for (let i = 0; i < maxCnt; i++) {
      const myPos = this.pos[(Math.random() * this.posTotal) | 0];
      if (this.stageWidth > 400) {
        this.particles.push(new Particle(myPos, this.getColor(), 20));
      } else {
        this.particles.push(new Particle(myPos, this.getColor(), 5));
      }
    }
    console.log(this.particles.length);
    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];
      if (item.radius <= 1) {
        this.particles.splice(i, 1);
      }

      const dx = this.mouse.x - item.x;
      const dy = this.mouse.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = item.radius + this.mouse.radius;

      if (dist < minDist) {
        item.progress += 100;
      }

      item.draw(ctx);
    }
  }

  getColor() {
    const minHue = 80;
    const maxHue = 340;
    const hue = (maxHue - minHue) * Math.random() + minHue;
    return hslToHex(hue, 84, 50);
  }

  onMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  onTouchEnd() {
    this.mouse.x = 0;
    this.mouse.y = 0;
  }
}
