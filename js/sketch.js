/* jshint browser: true, esnext: true */

let keys = {'A': false, 'D': false};
let gameOver = false;

const SNAKE_PART_RADIUS = 10;
const INITIAL_SNAKE_PARTS = 10;

class Snake {
  constructor() {
    this.angle = random(-PI / 8, PI / 8);
    this.missingParts = 0;
    this.parts = [];

    let headX, headY;
    headX = random(width / 2);
    headY = random(height - INITIAL_SNAKE_PARTS * SNAKE_PART_RADIUS * 2);

    for (let i = 0; i < INITIAL_SNAKE_PARTS; ++i) {
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
let snake;

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
  frameRate(10);
  snake = new Snake();
  foods = [];

  for (let i = 0; i < 10; ++i) foods.push(new Food());
}

function draw() {
  background(0);

  fill(255);
  stroke(255);

  if (!gameOver) {
    textSize(20);
    text("Score: " + (snake.parts.length - INITIAL_SNAKE_PARTS), 0, 20);
  }

  for (let food of foods) {
    food.draw();
  }

  if (!gameOver) snake.update();
  snake.draw();

  if (snake.isColliding()) {
    gameOver = true;
  }

  if (gameOver) {
    push();
    fill(200, 0, 0);
    stroke(255);
    strokeWeight(10);
    textSize(170);
    text(" YOU\nLOSE", 80, 170);

    textSize(35);
    strokeWeight(5);
    text("Score: " + (snake.parts.length - INITIAL_SNAKE_PARTS), 0, 35);
    pop();
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
