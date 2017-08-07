/* jshint browser: true, esnext: true */

const SNAKE_PART_RADIUS = 10;
class Snake {
  constructor() {
    this.parts = [];
    for (let i = 0; i < 10; ++i) {
       this.parts.push([width / 2, height / 2 + SNAKE_PART_RADIUS * i]);
    }
    this.angle = -PI / 4;
  }

  update() {
    const [hx, hy] = this.parts[0];
    let v = p5.Vector.fromAngle(this.angle);
    v.setMag(SNAKE_PART_RADIUS);
    this.parts.pop();
    this.parts.unshift([hx + v.x, hy + v.y]);
  }

  draw() {
    fill(255);
    noStroke();
    this.parts.forEach(p => ellipse(p[0], p[1], SNAKE_PART_RADIUS));

    push();
    stroke(255, 0, 0);
    const [hx, hy] = this.parts[0];
    translate(hx, hy);
    rotate(this.angle);
    line(0, 0, 100, 0);
    pop();
  }
}
let snake;

function setup() {
  createCanvas(600, 400);
  snake = new Snake();
}

function draw() {
  background(0);
  const [hx, hy] = snake.parts[0];
  snake.angle = p5.Vector.sub(createVector(mouseX, mouseY), createVector(hx, hy)).heading();
  snake.update();
  snake.draw();
}
