// arrays to store colors, deviations, and coordinates, and set the base values of Size and radius
let colors = [];
let deviations = [];
let coordinates = [];
// canvas size
let size = 1000;
let radius = size * 0.27;
//Create mouseStartTime and duration and set the base to 0.
let mouseStartTime, duration = 0;

function setup() {
  // Create a canvas with a specified size of 1000x1000
  createCanvas(size, size);
  // Generate random color array of size 500
  for (let i = 0; i < 500; i++) {
    let r = random(125, 255);
    let g = random(125, 255);
    let b = random(125, 255);
    //Use similar pale colors to create a dreamy feel
    //Enter random rgb values into the color array
    colors.push([r,g,b]);
    //Enter random rgb values into the deviations array
    deviations.push(random(-6, 6))
  }
  //Generates a set of coordinates for the circle
  for (let i = 0; i < 6; i++) {
    //When even numbers are 0, odd numbers are radius / 2. Make a staggered effect.
    let diff = i % 2 === 0 ? 0 : radius / 2;
    for (let j = 0; j < 6; j++) {
      //Enter the coordinates of the circle for the loop effect in the coordinate array
      coordinates.push([radius * j + j * 20 + diff, radius * i - i * 10])
    }
  }
}

function draw() {
  // rotate and translate canvas
  rotate(-PI / 11);
  translate(-350, -100);
  // Set the background color to a dark blue
  background(3, 79, 120)
  // Draw all circle based on coordinates
  for (let i = 0; i < coordinates.length; i++) {
    drawCircle(coordinates[i][0], coordinates[i][1], i);
  }
}

/*
* Draw circle
* x: the position of the horizontal coordinate axis
* y: the position of the vertical coordinate axis
* index: index of the current circle in the array
*/
function drawCircle(x, y, index) {
  //Set two different easing values
  let easing=duration*0.1;
  let easing1=duration*0.005;
  push()
  // background circle
  stroke(0, 0, 0, 0)
  fill(colors[index * 10]);
  //Add the easing1 element to the background base circle during animation time
  circle(x, y, radius+easing1);
  // center circle
  fill(colors[index * 10 + 1]);
  circle(x, y, 20);
  // outer rings
  for (let i = 0; i < 8; i++) {
    fill(0, 0, 0, 0);
    stroke(colors[index * 10 + i + 1]);
    strokeWeight(10);
    ellipse(x, y, (i + 1) * (15 + duration / size * 30) + deviations[i], (i + 1) * (15 + duration / size * 30) + + deviations[i + 1])
  }
  translate(x, y);
  // Draw the serration line in the middle of every four circles
  if (index % 4 === 0) {
    circleLine(colors[index * 10 + 10])
  } else {
    // Draw dashed circle
    for (let i = 0; i < 4; i++) {
      stroke(colors[index * 10 + 10]);
      //Add the dotted line element to the changing easing element during the animation time
      dashedCircle(75 + i * (radius - 180) / 5+easing, 2, 4);
    }
  }
 
  pop()
}

/*
* Draw dashed circle
* radius: radius size of a circle
* dashWidth: dash width size
* dashSpacing: spacing between dashed line segments
*/
function dashedCircle(radius, dashWidth, dashSpacing) {
  // 200 dashed line segments
  let steps = 200;
  let dashPeriod = dashWidth + dashSpacing;
  let lastDashed = false;
  // Draw all segments
  for(let i = 0; i < steps; i++) {
    // Decide whether to beginShape or endShape
    let curDashed = (i % dashPeriod) < dashWidth;
    if(curDashed && !lastDashed) {
      beginShape();
    }
    if(!curDashed && lastDashed) {
      endShape();
    }
    // Draw vertex by calculate result
    if(curDashed) {
      let theta = map(i, 0, steps, 0, TWO_PI);
      vertex(cos(theta) * radius, sin(theta) * radius);
    }
    lastDashed = curDashed;
  }
  if(lastDashed) {
    endShape();
  }
}

/*
* Draw serration line circle
* color: color of line
*/
function circleLine(color) {
  stroke(color)
  strokeWeight(3);
  // initialize small/large circle points array
  let smallCirclePoints = [[65, 0]];
  let largeCirclePoints = [[132, 0]];
  let angle = Math.PI * 2 / 30;
  // add 30 new point to small circle points array
  for (let i = 0; i <= 30; i++) {
    smallCirclePoints.push([65 * cos(angle * i), 65 * sin(angle * i)])
  }
  // add 30 new point to large circle points array
  for (let i = 0; i <= 30; i++) {
    largeCirclePoints.push([132 * cos(angle * i), 132 * sin(angle * i)])
  }
  // Form a jagged shape based on the interaction and connection of points in two arrays
  for (let i = 0; i < 31; i++) {
    line(smallCirclePoints[i][0], smallCirclePoints[i][1], largeCirclePoints[i][0], largeCirclePoints[i][1]);
    line(largeCirclePoints[i][0], largeCirclePoints[i][1], smallCirclePoints[i + 1][0], smallCirclePoints[i + 1][1]);
  }
}



function mousePressed() {
  // Record the time when the mouse is pressed
  mouseStartTime = Date.now();
}

function mouseReleased() {
  //Record the time between mouse press and release as duration
  duration = Date.now() - mouseStartTime;

  const interval = setInterval(() => {
    //Clear when it is less than or equal to 0
    if (duration <= 0) {
      clearInterval(interval);
    } else {
      //Continuously reduce the value by 1
      duration -= 1;
    }
  }, 10)
  // Run every 0.01 seconds
}