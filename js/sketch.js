/* jshint browser: true, esnext: true */

const SNAKE_PART_RADIUS = 10;
class Snake {
  constructor() {
    this.angle = 0;
    this.missingParts = 0;
    this.parts = [];
    this.target = null;

    const headX = random(width);
    const headY = random(height);
    for (let i = 0; i < 10; ++i) {
       this.parts.push(createVector(headX, headY + SNAKE_PART_RADIUS * 2 * i));
    }
  }

  isValidAngle(a) {
    let v = p5.Vector.fromAngle(a);
    v.setMag(SNAKE_PART_RADIUS * 2);

    const newHead = p5.Vector.add(this.parts[0], v);

    for (let part of this.parts) {
      if (newHead.dist(part) < SNAKE_PART_RADIUS * 2) return false;
    }

    return true;
  }

  seekNewTarget() {
    // TODO: Switch to something like Dijkstra or A* for pathfinding.
    // The current solution sometimes leaves snakes stuck.

    const head = this.parts[0];
    let bestFood = null;
    let bestDistance = Infinity;

    for (let food of foods) {
      if (food.hunter !== null) continue;
      const d = head.dist(food.pos);
      const a = p5.Vector.sub(food.pos, head).heading();
      if (d < bestDistance && this.isValidAngle(a)) {
        bestFood = food;
        bestDistance = d;
      }
    }

    if (bestFood !== null) {
      this.target = bestFood;
      bestFood.hunter = this;
    }
  }

  eatFood() {
    for (let food of foods) {
      if (p5.Vector.dist(this.parts[0], food.pos) < SNAKE_PART_RADIUS + FOOD_RADIUS) {
        this.missingParts += 1;

        // Food::gotEaten handles setting Snake::target.
        food.gotEaten();
      }
    }
  }

  move() {
    // TODO: Figure out how to make snakes slower.
    if (this.target !== null) {
      this.angle = p5.Vector.sub(this.target.pos, this.parts[0]).heading();

      let v = p5.Vector.fromAngle(this.angle);
      v.setMag(SNAKE_PART_RADIUS * 2);
      if (this.missingParts === 0) {
        this.parts.pop();
      } else {
        this.missingParts -= 1;
      }
      this.parts.unshift(p5.Vector.add(this.parts[0], v));
    }
  }

  isColliding() {
    const head = this.parts[0];

    for (let i = 2, l = this.parts.length; i < l; ++i) {
      if (head.dist(this.parts[i]) < SNAKE_PART_RADIUS * 2) {
        return true;
      }
    }

    // TODO: Check collision with other sneks?

    return false;
  }

  update() {
    if (this.target === null) {
      this.seekNewTarget();
    }

    this.eatFood();

    this.move();
  }

  draw() {
    fill(0, 150, 0);
    noStroke();
    this.parts.forEach(p => ellipse(p.x, p.y, SNAKE_PART_RADIUS * 2));

    const head = this.parts[0];
    push();
    stroke(255, 0, 0);
    translate(head.x, head.y);
    rotate(this.angle);
    line(SNAKE_PART_RADIUS, 0, SNAKE_PART_RADIUS + 100, 0);
    pop();
  }
}
let snakes;

const FOOD_RADIUS = 10;
class Food {
  constructor() {
    this.placeRandomly();
    this.hunter = null;
  }

  placeRandomly() {
    this.pos = createVector(random(width), random(height));
  }

  gotEaten() {
    this.placeRandomly();
    // Works when food is stolen.
    if (this.hunter !== null && this.hunter.target === this) this.hunter.target = null;
    this.hunter = null;
  }

  draw() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, FOOD_RADIUS * 2);
  }
}
let foods;

function setup() {
  createCanvas(600, 400);
  snakes = [];
  foods = [];

  for (let i = 0; i < 5; ++i) snakes.push(new Snake());
  for (let i = 0; i < 10; ++i) foods.push(new Food());
}

function draw() {
  background(0);

  for (let food of foods) {
    food.draw();
  }

  for (let i = snakes.length - 1; i >= 0; --i) {
    const snake = snakes[i];

    snake.update();
    snake.draw();

    if (snake.isColliding()) {
      snakes.splice(i, 1);
    }
  }
}
