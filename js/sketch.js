/* jshint browser: true, esnext: true */

let keys = {'A': false, 'D': false};

const SNAKE_PART_RADIUS = 10;
class Snake {
  constructor() {
    this.angle = 0;
    this.missingParts = 0;
    this.parts = [];

    const headX = random(width);
    const headY = random(height);
    for (let i = 0; i < 10; ++i) {
       this.parts.push(createVector(headX, headY + SNAKE_PART_RADIUS * 2 * i));
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
    let v = p5.Vector.fromAngle(this.angle);
    v.setMag(SNAKE_PART_RADIUS * 2);
    if (this.missingParts === 0) {
      this.parts.pop();
    } else {
      this.missingParts -= 1;
    }
    this.parts.unshift(p5.Vector.add(this.parts[0], v));
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
    if (keys['A']) {
      this.angle -= PI / 10;
    }
    if (keys['D']) {
      this.angle += PI / 10;
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
  }

  placeRandomly() {
    this.pos = createVector(random(width), random(height));
  }

  gotEaten() {
    this.placeRandomly();
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

  for (let i = 0; i < 1; ++i) snakes.push(new Snake());
  for (let i = 0; i < 10; ++i) foods.push(new Food());
}

function draw() {
  background(0);
  frameRate(10);

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

function keyPressed(event) {
  const key = event.key.toUpperCase();
  if (keys.hasOwnProperty(key)) {
    keys[key] = true;
  }
}

function keyReleased(event) {
  const key = event.key.toUpperCase();
  if (keys.hasOwnProperty(key)) {
    keys[key] = false;
  }
}
