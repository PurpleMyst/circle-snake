/* jshint browser: true, esnext: true */

const SNAKE_PART_RADIUS = 15;
class Snake {
  constructor() {
    this.parts = [];
    for (let i = 0; i < 10; ++i) {
       this.parts.push(createVector(width / 2, height / 2 + SNAKE_PART_RADIUS * i));
    }
    this.angle = 0;
    this.missingParts = 0;
  }

  update() {
    this.angle = p5.Vector.sub(foods[0].pos, this.parts[0]).heading();

    // TODO: Figure out how to make snakes slower.
    let v = p5.Vector.fromAngle(this.angle);
    v.setMag(SNAKE_PART_RADIUS);
    if (this.missingParts === 0) {
      this.parts.pop();
    } else {
      this.missingParts -= 1;
    }
    this.parts.unshift(p5.Vector.add(this.parts[0], v));
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

  update() {
    for (let snake of snakes) {
      if (p5.Vector.dist(snake.parts[0], this.pos) < SNAKE_PART_RADIUS + FOOD_RADIUS) {
        snake.partsMissing += 1;
        this.placeRandomly();
        break;
      }
    }
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
  snakes = [new Snake()];
  foods = [new Food()];
}

function draw() {
  background(0);

  for (let food of foods) {
    food.update();
    food.draw();
  }

  for (let snake of snakes) {
    snake.update();
    snake.draw();
  }
}
