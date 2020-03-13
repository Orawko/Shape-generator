const SCALE = 20;
const RATE_LINE = 1;
const RATE_SQUARE = 3;
const RATE_TURN = 5;
const START_POSITION = { x: 290, y: 210 };
const HORIZONTAL_BORDERS = { up: 40, down: 560 };
const VERTICAL_BORDERS = { left: 40, right: 360 };
const JUMP_GENERATIONS = 5;
const FIRST_GENERATION_SHAPE_SIZE = 20;
const FIRST_GENERATION_SHAPE_NUMBER = 30;
let coords;
let direction = 0; //0 north, 1 east, 2 south, 3 west
let generationCounter = 0;
let prevGenerationShapes = [];

function moveTo(rule, actualPosition) {
  coords.push(getNewPosition(rule, actualPosition));
}

function start() {
  d3.select("svg")
    .selectAll("*")
    .remove();
  coords = [];
  direction = 0;
  generationCounter = 0;
  prevGenerationShapes = [];
  coords.push({ x: START_POSITION.x, y: START_POSITION.y, type: "square" });
  drawSquare(1, getActualPosition());
}

function clear() {
  d3.select("svg")
    .selectAll("*")
    .remove();
  coords = [];
  direction = 0;
  coords.push({ x: START_POSITION.x, y: START_POSITION.y, type: "square" });
  drawSquare(1, getActualPosition());
}

function getActualPosition() {
  return coords.slice(-1)[0];
}

function getNewPosition(rule, actualPosition) {
  let newX = actualPosition.x;
  let newY = actualPosition.y;
  let newType = "line";

  switch (direction) {
    case 0:
      newY -= SCALE;
      break;
    case 1:
      newX += SCALE;
      break;
    case 2:
      newY += SCALE;
      break;
    case 3:
      newX -= SCALE;
      break;
    default:
      console.log("Invalid direction!");
      break;
  }

  checkCoordinates(newX, newY);

  if (rule === 1 || rule === 4) {
    newType = "square";
  }
  return {
    x: newX,
    y: newY,
    type: newType
  };
}

function drawSquare(rule, actualPosition) {
  let newX = actualPosition.x;
  let newY = actualPosition.y;

  switch (direction) {
    case 0:
      newY -= SCALE;
      break;
    case 1:
      break;
    case 2:
      newX -= SCALE;
      break;
    case 3:
      newY -= SCALE;
      newX -= SCALE;
      break;
    default:
      console.log("Invalid direction!");
      break;
  }
  d3.select("svg")
    .append("rect")
    .attr("x", newX)
    .attr("y", newY)
    .attr("width", SCALE)
    .attr("height", SCALE)
    .style("fill", "purple");

  moveTo(rule, getActualPosition());
}

function drawLine(rule, actualPosition) {
  let newX = actualPosition.x;
  let newY = actualPosition.y;

  switch (direction) {
    case 0:
      newY -= SCALE;
      break;
    case 1:
      newX += SCALE;
      break;
    case 2:
      newY += SCALE;
      break;
    case 3:
      newX -= SCALE;
      break;
    default:
      console.log("Invalid direction!");
      break;
  }

  d3.select("svg")
    .append("line")
    .attr("x1", actualPosition.x)
    .attr("y1", actualPosition.y)
    .attr("x2", newX)
    .attr("y2", newY)
    .attr("stroke-width", 2)
    .attr("stroke", "purple");

  moveTo(rule, getActualPosition());
}

function checkCoordinates(x, y) {
  if (
    x < HORIZONTAL_BORDERS.up ||
    x > HORIZONTAL_BORDERS.down ||
    y < VERTICAL_BORDERS.left || y > VERTICAL_BORDERS.right
  ) {
    return 1;
  }
  return 0;
}

function rule1() {
  if (getActualPosition().type === "square") {
    drawSquare(1, getActualPosition());
  }
}

function rule2() {
  if (getActualPosition().type === "square") {
    drawLine(2, getActualPosition());
  }
}

function rule3() {
  if (getActualPosition().type === "line") {
    drawLine(3, getActualPosition());
  }
}

function rule4() {
  if (getActualPosition().type === "line") {
    drawSquare(4, getActualPosition());
  }
}

function rule5() {
  if (getActualPosition().type === "line") {
    direction === 3 ? (direction = 0) : direction++;
    drawLine(5, getActualPosition());
  }
}

class Shape {
  constructor(rules = []) {
    this.rules = rules;
    this.rate = 0;
  }

  draw() {
    clear();
    for (let rule of this.rules) {
      switch (rule) {
        case 1:
          rule1();
          break;
        case 2:
          rule2();
          break;
        case 3:
          rule3();
          break;
        case 4:
          rule4();
          break;
        case 5:
          rule5();
          break;
        default:
          console.log("Invalid rule!");
          break;
      }
    }
  }

  createRandom(rulesNumber) {
    this.rules = [];
    if (isNaN(rulesNumber)) {
      rulesNumber = FIRST_GENERATION_SHAPE_SIZE;
    }
    for (let i = 0; i < rulesNumber; i++) {
      this.rules.push(Math.floor(Math.random() * 5) + 1);
    }
    this.filterInvalidRules();
  }

  filterInvalidRules() {
    let newRules = [],
      prev = 1;
    for (let i = 0; i < this.rules.length; i++) {
      if (checkIfRuleIsValid(prev, this.rules[i])) {
        prev = this.rules[i];
        newRules.push(this.rules[i]);
      }
    }
    this.rules = newRules;
    this.sliceShapeOutsideCanvas();
  }

  printRulesAsArray() {
    console.log(this.rules);
  }

  getRate() {
    this.sliceShapeOutsideCanvas();
    let score = 0;
    for (let rule of this.rules) {
      if (rule === 2 || rule === 3) {
        score += RATE_LINE;
      } else if (rule === 1 || rule === 4) {
        score += RATE_SQUARE;
      } else {
        score += RATE_TURN;
      }
    }
    return score;
  }

  sliceShapeOutsideCanvas() {
    let index = 0;
    let currentCoords = getNewPosition(1, { x: 290, y: 210 });
    for (let rule of this.rules) {
      if (rule === 5) {
        direction === 3 ? (direction = 0) : direction++;
      }
      index++;
      currentCoords = getNewPosition(rule, currentCoords);
      if (checkCoordinates(currentCoords.x, currentCoords.y) === 1) {
        break;
      }
    }
    this.rules = this.rules.slice(0, index);
  }

  mutateShape() {
    let mutationIntensity = Math.floor(Math.random() * 10) + 1;
    while (mutationIntensity > 0) {
      let ruleIndexToMutate =
        Math.floor(Math.random() * (this.rules.length - 1)) + 1;
      let newRule = Math.floor(Math.random() * 5) + 1;
      if (mutationIntensity % 2 === 0) {
        this.rules[ruleIndexToMutate] = newRule;
      } else {
        this.rules.push(newRule);
      }
      mutationIntensity -= Math.floor(Math.random() * 5) + 1;
    }
    this.filterInvalidRules();
  }

  getRules() {
    return this.rules;
  }
}

window.onload = function() {
  start();
  document.getElementById("1").onclick = rule1;
  document.getElementById("2").onclick = rule2;
  document.getElementById("3").onclick = rule3;
  document.getElementById("4").onclick = rule4;
  document.getElementById("5").onclick = rule5;
  document.getElementById("back").onclick = start;

  document.getElementById("auto").onclick = function() {
    prevGenerationShapes.length <= 1
      ? geneticAlgorithm(generateShapes(FIRST_GENERATION_SHAPE_NUMBER), JUMP_GENERATIONS)
      : geneticAlgorithm(prevGenerationShapes, JUMP_GENERATIONS);
  };
  showCoords();
};

function showCoords() {
  for (let i = 0; i < coords.length; i++) {
    console.log(
      "x: ",
      coords[i].x,
      " y: ",
      coords[i].y,
      " type: ",
      coords[i].type
    );
  }
}

function geneticAlgorithm(shapes, jumpGenerations) {
  for (let i = 0; i < jumpGenerations; i++) {
    generationCounter++;
    shapes = filterShapes(shapes, getCutValue(shapes));
    shapes = mixShapes(shapes);
    console.log(
      "Generation: " + generationCounter + " shapesNo: " + shapes.length
    );
    drawBest(shapes);
    prevGenerationShapes = shapes;
  }
}

function generateShapes(numberOfShapes) {
  let shapes = [];
  for (let j = 0; j < numberOfShapes; j++) {
    let s = new Shape([]);
    s.createRandom();
    shapes.push(s);
  }
  return shapes;
}

function getCutValue(shapes) {
  return shapes.map(shape => shape.getRate()).sort()[
    Math.floor(shapes.length / 4)
  ];
}

function drawBest(shapes) {
  let maxRate = 0;
  for (let shape of shapes) {
    if (shape.getRate() > maxRate) maxRate = shape.getRate();
  }
  for (let shape of shapes) {
    if (shape.getRate() === maxRate) {
      //shape.printRulesAsArray();
      shape.draw();
      break;
    }
  }
}

function filterShapes(shapes, cutValue) {
  return shapes.filter(shape => shape.getRate() >= cutValue);
}

function mixShapes(shapes) {
  let to = shapes.length;
  let newGeneration = [];
  if (shapes.length % 2 !== 0) {
    to = shapes.length - 1;
    newGeneration.push(shapes[shapes.length - 1]);
  }
  for (let i = 0; i < to; i += 2) {
    let { s1, s2 } = mixTwoShapes(
      shapes[i].getRules(),
      shapes[i + 1].getRules()
    );
    s1.mutateShape();
    s2.mutateShape();
    newGeneration.push(s1, s2);
  }
  for (let i = newGeneration.length; i < 30; i++) {
    newGeneration.push(shapes[i - newGeneration.length]);
  }
  return newGeneration;
}

function mixTwoShapes(s1, s2) {
  let s1_2 = s1.slice(0, random(s1.length - 1));
  let s2_2 = s2.slice(0, random(s2.length - 1));
  return {
    s1: new Shape(s1.concat(s2_2)),
    s2: new Shape(s2.concat(s1_2))
  };
}

function checkIfRuleIsValid(prev, actual) {
  if (
    ((actual === 1 || actual === 2) && (prev === 1 || prev === 4)) ||
    ((actual === 3 || actual === 4 || actual === 5) &&
      (prev === 2 || prev === 3 || prev === 5))
  ) {
    return true;
  }
  return false;
}

function random(to) {
  return Math.floor(Math.random() * to) + 1;
}
