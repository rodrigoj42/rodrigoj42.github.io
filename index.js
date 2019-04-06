var fillColor;
var canvasSize = {
  width: 600,
  height: 600
}

var shapes = [new Shape()];
var shapeCursor = 0;

var rays = []
var rayCursor = 0;

var phaseSelection, showIntersections;
var phaseOptions = ['Insert Shape', 'Insert Ray', 'Edit Mode']
var phase = phaseOptions[0];

var editVertex, editRayPosition, editRayDirection;

function setup() {
  let canvas = createCanvas(canvasSize.width, canvasSize.height);
  canvas.parent('canvas');
  // click interactions should only occur inside canvas
  canvas.mousePressed(click);
  canvas.doubleClicked(doubleClick);
  //frameRate(5)
  background(220);

  phaseSelection = createSelect();
  phaseSelection.parent('buttons')
  phaseOptions.forEach(option => {
    phaseSelection.option(option)
  });
  phaseSelection.changed(function() {
    phase = phaseOptions[phaseSelection.elt.selectedIndex]
    console.log(phase)
  })

  showIntersections = createButton('Show Intersections');
  showIntersections.parent('buttons')
  showIntersections.mousePressed(function() {
    if (showIntersections.elt.textContent == 'Show Intersections') {
      showIntersections.elt.textContent = 'Hide Intersections';
    } else {
      showIntersections.elt.textContent = 'Show Intersections'
    }
  })

  fillColor = color('#FF0000')
  fillColor.setAlpha(100);
  fill(fillColor)
}

function draw() {
  background(220);

  let editMode = (phase == phaseOptions[2])

  // draw shapes
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    let isLast = (i == shapeCursor && phase == phaseOptions[0]);
    shape.draw(isLast, editMode);
  }

  // draw rays
  rays.forEach(r => {
   r.draw() 
  });

}

function click() {
  switch (phase) {

    case phaseOptions[0]: // draw shapes
      shapes[shapeCursor].addVertex(
        new Vertex(mouseX, mouseY)
      );
      break
    
    case phaseOptions[1]: // draw rays 
      rays.push(new Ray(mouseX, mouseY)) 
      break

    case phaseOptions[2]: // edit 
      editVertex = null;
      editRayDirection = null;
      editRayPosition = null;
      let found = false;
      let threshold = 10;
      let shapePoints = shapes.flatMap(
        (shape) => shape.vertices.map(
          (v) => {
            return {
              vertex: v,
              distance: dist(mouseX, mouseY, v.x, v.y)
            }
          }
        )
      )
      if (shapePoints.length > 0) {
        var closestPoint = shapePoints.reduce((p, c) => p.distance < c.distance ? p : c)
      }
      if (shapePoints.length > 0 && closestPoint.distance < threshold) {
        editVertex = closestPoint.vertex;
        found = true;
      } else {
        for (let i = 0; i < rays.length; i++) {
          const ray = rays[i];
          let endDistance = dist(mouseX, mouseY, ray.end.x, ray.end.y)
          let startDistance = dist(mouseX, mouseY, ray.start.x, ray.start.y)
          if (startDistance < threshold) {
            editRayPosition = rays[i];
            found = true;
          }
          if (!found && endDistance < threshold) {
            editRayDirection = rays[i]
            found = true;
          }
        }
      }
  }
}

function mouseDragged() {
  if (phase == phaseOptions[2]) {
    if (editVertex) {
      editVertex.x = mouseX;
      editVertex.y = mouseY;
    } else if (editRayDirection) {
      editRayDirection.pointTo(mouseX, mouseY)
    } else if (editRayPosition) {
      editRayPosition.newPosition(mouseX, mouseY)
    }
  }
}

function mouseReleased() {
  if (phase == phaseOptions[1] && rays[rayCursor]) {
    rays[rayCursor].pointTo(mouseX, mouseY)
    rayCursor += 1;
  }
}

function doubleClick() {
  shapes[shapeCursor].vertices.pop()  // double click adds vertex twice 
  shapes.push(new Shape());
  shapeCursor += 1;
}