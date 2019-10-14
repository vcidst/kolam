/********
Ported from the Processing Sketch by
Bárbara Almeida
https://www.openprocessing.org/sketch/296103/
with minor changes

A generative Kolam pattern
********/

let tsize = 45;
let margin = 5;
let tnumber = 5;
var link = [];
var nlink = [];
var idx;
var pg;
var bgcolor;
var a;

/**/
function setup() {
  a = random(45);
  bgcolor = color(random(50), random(50), random(50));
  setupTiles(windowWidth, windowHeight);
  configTiles();  
}

/**/
function draw() {
  //background(bgcolor);
  if (idx <= 1) drawTile();
  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(pg, 0, 0);

  if (frameCount % 100 == 0) {
    configTiles();
  }

}

/**/
function mouseClicked() {
  tnumber++;
  setupTiles(windowWidth, windowHeight);
  configTiles();
}

/**/
function setupTiles(w, h) {
  createCanvas(w, h);
  background(bgcolor);
  pg = createGraphics(
    tsize * tnumber + 2 * margin,
    tsize * tnumber + 2 * margin
  );

  // populate the array with 1s
  for (var i = 0; i < (tnumber + 1); i++) {
    var pushThis = [];
    for (var j = 0; j < (tnumber + 1); j++) {
      pushThis.push(1);
    }
    link.push(pushThis);
    nlink.push(pushThis);
  }

  rectMode(CORNERS);
  textSize(32);
  fill(255);
  text('Kolam', 30, 60);
  textSize(12);
  text('Kolam is a form of drawing that is drawn by using rice flour, chalk, chalk powder or rock powder, often using naturally or synthetically colored powders, in Sri Lanka, the Indian states of Tamil Nadu, Karnataka, Telangana, Andhra Pradesh, Kerala and some parts of Goa, Maharashtra as well as Indonesia, Malaysia, Thailand and a few other Asian countries. A Kolam is a geometrical line drawing composed of curved loops, drawn around a grid pattern of dots.', 30, 70, 400, 200);
  text('No Rights Reserved; Ported from a Processing Sketch by Bárbara Almeida', 30, windowHeight - 30);
}

function configTiles() {
  idx = 0;
  var i, j;

  // update links
  for (i = 0; i < link.length; i++) {
    for (j = 0; j < link[0].length; j++) {
      link[i][j] = nlink[i][j]
    }
  }

  // create new links
  var limit = random(0.4, 0.7);

  for (i = 0; i < nlink.length; i++) {
    for (j = 0; j < nlink.length / 2; j++) {

      // randomly link or unlink
      let l = 0;
      if (random(1) > limit) l = 1;

      nlink[i][j] = l;
      nlink[i][nlink.length - j - 1] = l;
      nlink[j][i] = l;
      nlink[nlink.length - j - 1][i] = l;
      nlink[nlink.length - 1 - i][j] = l;
      nlink[nlink.length - 1 - i][nlink.length - j - 1] = l;
      nlink[j][nlink.length - 1 - i] = l;
      nlink[nlink.length - 1 - j][nlink.length - 1 - i] = l;
    }
  }
}

function drawTile() {
  pg.background(bgcolor);
  pg.noFill();
  pg.stroke(255);
  pg.strokeWeight(5);

  for (var i = 0; i < tnumber; i++) {
    for (var j = 0; j < tnumber; j++) {
      if ((i + j) % 2 == 0) {
        var top_left = tsize / 2 * lerp(link[i][j], nlink[i][j], idx);
        var top_right = tsize / 2 * lerp(link[i + 1][j], nlink[i + 1][j], idx);
        var bottom_right = tsize / 2 * lerp(link[i + 1][j + 1], nlink[i + 1][j + 1], idx);
        var bottom_left = tsize / 2 * lerp(link[i][j + 1], nlink[i][j + 1], idx);

        pg.rect(i * tsize + margin, j * tsize + margin, tsize, tsize, top_left, top_right, bottom_right, bottom_left);
        pg.point(i * tsize + tsize / 2 + margin, j * tsize + tsize / 2 + margin);
      }
    }
  }

  idx += 0.02;
  idx = constrain(idx, 0, 1);
}

window.onresize = function() {
  setupTiles(windowWidth, windowHeight);
};