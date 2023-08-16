let rectangleVertices = [];
let dots = [];
let numDots = 200;
let displacement = 100;
let returnSpeed = 0.05;
let bombRadius = 50;
let displayText = false; // Flag to control text display

function setup() {
  createCanvas(1690, 1080); // Set canvas size to 1080x1920
  let canvasCenter = createVector(width / 2, height / 2); // Center of the canvas
  let boxSize = min(350, 350); // Size of the square

  // Define vertices of the square centered on the canvas
  rectangleVertices.push(p5.Vector.add(canvasCenter, createVector(-boxSize / 2, -boxSize / 2)));
  rectangleVertices.push(p5.Vector.add(canvasCenter, createVector(boxSize / 2, -boxSize / 2)));
  rectangleVertices.push(p5.Vector.add(canvasCenter, createVector(boxSize / 2, boxSize / 2)));
  rectangleVertices.push(p5.Vector.add(canvasCenter, createVector(-boxSize / 2, boxSize / 2)));

  // Arrange the dots to form the sides of the rectangle
  for (let i = 0; i < 4; i++) {
    let start = rectangleVertices[i];
    let end = rectangleVertices[(i + 1) % 4];
    for (let j = 0; j <= numDots; j++) {
      let pct = j / numDots;
      let x = lerp(start.x, end.x, pct);
      let y = lerp(start.y, end.y, pct);
      dots.push({ 
        position: createVector(x, y), 
        original: createVector(x, y), 
        color: color(255)
      });
    }
  }
}

function draw() {
  background(0); // Set a black background

  // Check if the mouse touches any of the dots
  let bombTouched = false;
  for (let d of dots) {
    let distance = dist(d.position.x, d.position.y, mouseX, mouseY);
    if (distance < bombRadius) {
      bombTouched = true;
      break;
    }
  }

  // Displace the dots significantly when the bomb area is touched
  if (bombTouched) {
    displayText = true; // Set the flag to display the text
    for (let d of dots) {
      let distance = dist(d.position.x, d.position.y, mouseX, mouseY);
      if (distance < bombRadius) {
        let force = createVector(mouseX - d.position.x, mouseY - d.position.y);
        let maxForce = map(distance, 0, bombRadius, displacement, 0, true);
        force.normalize().mult(maxForce);
        d.position.add(force);

        // Adjust color based on displacement
        let colorAmt = map(distance, 0, bombRadius, 255, 0);
        d.color = color(colorAmt, 0, 0);
      }
    }
  } else {
    // Gradually return the dots to their original positions
    for (let d of dots) {
      d.position.lerp(d.original, returnSpeed);

      // Reset color
      d.color = color(255);
    }
  }

  // Draw the dots with the gradient color based on distance
  noStroke();
  for (let d of dots) {
    fill(d.color);
    ellipse(d.position.x, d.position.y, 5);
  }

  // Draw the red gradient around the cursor when the bomb area is touched
  if (bombTouched) {
    noFill();
    for (let r = bombRadius; r > 0; r--) {
      let alpha = map(r, bombRadius, 0, 100, 0);
      stroke(255, 0, 0, alpha);
      ellipse(mouseX, mouseY, r * 2);
    }
  }

  // Display the text in the center of the canvas if the flag is set
  if (displayText) {
    fill(255); // White
    textSize(24);
    textAlign(CENTER, CENTER);
    text("disorient to reorient.", width / 2, height / 2);
  }
}
