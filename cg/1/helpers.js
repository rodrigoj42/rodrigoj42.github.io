// taken from p5 docs: https://p5js.org/reference/#/p5.Vector/normalize
function drawArrow(base, vec) {
  push();
  translate(base.x, base.y);
  strokeWeight(3);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function middlePoint(l) {
  return {
    x: (l.start.x + l.end.x)/2,
    y: (l.start.x + l.end.y)/2
  }
}

// lineToExtend : {start: vector, end: vector}
function extendToBorder(lineToExtend) {
  for (let borderLine of borderLines) {
    var intersection = findIntersection(lineToExtend, borderLine)
    if (intersection) {
      return [lineToExtend.end.x, lineToExtend.end.y, intersection.x, intersection.y]
    }
  } return false
}

function SAME_SIGNS(a,b) {
  return (a < 0) == (b < 0)
}

// original C code by Mukesh Prasad
// http://www.realtimerendering.com/resources/GraphicsGems/gemsii/xlines.c
function findIntersection(line1, line2) {
  const {start: lineStart1, end: lineEnd1} = line1;
  const {x: x1, y: y1} = lineStart1;
  const {x: x2, y: y2} = lineEnd1;
  const {start: lineStart2, end: lineEnd2} = line2;
  const {x: x3, y: y3} = lineStart2;
  const {x: x4, y: y4} = lineEnd2;
  let x, y;

  let a1, a2, b1, b2, c1, c2; /* Coefficients of line eqns. */
  let r1, r2, r3, r4;         /* 'Sign' values */
  let denom, offset, num;     /* Intermediate values */

  /* Compute a1, b1, c1, where line joining points 1 and 2
   * is "a1 x  +  b1 y  +  c1  =  0".*/
  a1 = y2 - y1;
  b1 = x1 - x2;
  c1 = x2 * y1 - x1 * y2;

  // Compute r3 and r4.
  r3 = a1 * x3 + b1 * y3 + c1;
  r4 = a1 * x4 + b1 * y4 + c1;

  /* Check signs of r3 and r4.  If both point 3 and point 4 lie on
   * same side of line 1, the line segments do not intersect.*/
  if (r3 != 0 && r4 != 0 && SAME_SIGNS(r3, r4)) return false;

  /* Compute a2, b2, c2 */
  a2 = y4 - y3;
  b2 = x3 - x4;
  c2 = x4 * y3 - x3 * y4;

  /* Compute r1 and r2 */
  r1 = a2 * x1 + b2 * y1 + c2;
  r2 = a2 * x2 + b2 * y2 + c2;

  /* Line segments intersect: compute intersection point. */
  denom = a1 * b2 - a2 * b1;
  if ( denom == 0 ) return false; //collinear
  offset = denom < 0 ? - denom / 2 : denom / 2;

  /* The denom/2 is to get rounding instead of truncating.  It
   * is added or subtracted to the numerator, depending upon the
   * sign of the numerator.*/
  num = b1 * c2 - b2 * c1;
  x = ( num < 0 ? num - offset : num + offset ) / denom;

  num = a2 * c1 - a1 * c2;
  y = ( num < 0 ? num - offset : num + offset ) / denom;

  return {x, y}
}