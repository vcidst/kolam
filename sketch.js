/********
Ported from the Processing Sketch by
Bárbara Almeida
https://www.openprocessing.org/sketch/296103/
with minor changes

A generative Kolam pattern
********/

var link;
var nlink;
var idx;
var pg;
var bgcolor;
var kolam;
var gui_kolam;

/**/
function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log("I think the window dimensions are "+windowWidth+" x "+windowHeight);
  // make Dat.GUI control with four options
  kolam = new Kolam();
  gui_kolam = new dat.GUI();
  gui_kolam.add(kolam, 'tsize', 30, 60).name('Size').onChange(function() {
    setupTiles();
  });
  gui_kolam.add(kolam, 'margin', 2, 200).name('Margin').onChange(function() {
    setupTiles();
  });  
  gui_kolam.add(kolam, 'tnumber').name('Tiles').min(3).max(20).step(1).onChange(function() {
    setupTiles();
  });
  gui_kolam.add(kolam, 'rotation').name('Rotation').min(0).max(2*Math.PI).step(QUARTER_PI/4).onChange(function() {
    setupTiles();
  });  
  gui_kolam.add(kolam, 'refreshRate').name('Refresh Rate').min(10).max(200).step(10);


  bgcolor = color(random(50), random(50), random(50));
  setupTiles();
  configTiles();
}

/**/
function draw() {
  if (idx <= 1) drawTile();
  
  push();
  translate(width / 2, height / 2);
  rotate(kolam.rotation);
  imageMode(CENTER);
  image(pg, 0, 0);
  pop();

  if (frameCount % kolam.refreshRate == 0) {
    configTiles();
  }
}

/**/
function Kolam() {
  this.tsize = 45;
  this.margin = 5;
  this.tnumber = 5;
  this.refreshRate = 100;
  this.rotation = QUARTER_PI;
}

/**/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupTiles();
}

/**/
function setupTiles() {
  background(bgcolor);
  rectMode(CORNERS);
  textSize(32);
  fill(255);
  text('Kolam', 30, 60);
  textSize(12);
  text('"Kolam is a form of drawing that is drawn by using rice flour, chalk, chalk powder or rock powder, \
often using naturally or synthetically colored powders, in Sri Lanka, the Indian states of Tamil Nadu,\
Karnataka, Telangana, Andhra Pradesh, Kerala and some parts of Goa, Maharashtra as well as Indonesia, \
Malaysia, Thailand and a few other Asian countries. A Kolam is a geometrical line drawing composed of \
curved loops, drawn around a grid pattern of dots." \n\nTaken as-is from Wikipedia - Kolam', 30, 70, 400, 200);
  text('No Rights Reserved; Ported from a Processing Sketch by Bárbara Almeida', 30, windowHeight - 30);
  pg = createGraphics(
    kolam.tsize * kolam.tnumber + 2 * kolam.margin,
    kolam.tsize * kolam.tnumber + 2 * kolam.margin
    );

  link = [];
  nlink = [];
  // populate the array with 1s
  for (var i = 0; i < (kolam.tnumber + 1); i++) {
    var pushThis = [];
    for (var j = 0; j < (kolam.tnumber + 1); j++) {
      pushThis.push(1);
    }
    link.push(pushThis);
    nlink.push(pushThis);
  }
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

  for (var i = 0; i < kolam.tnumber; i++) {
    for (var j = 0; j < kolam.tnumber; j++) {
      if ((i + j) % 2 == 0) {
        var top_left = kolam.tsize / 2 * lerp(link[i][j], nlink[i][j], idx);
        var top_right = kolam.tsize / 2 * lerp(link[i + 1][j], nlink[i + 1][j], idx);
        var bottom_right = kolam.tsize / 2 * lerp(link[i + 1][j + 1], nlink[i + 1][j + 1], idx);
        var bottom_left = kolam.tsize / 2 * lerp(link[i][j + 1], nlink[i][j + 1], idx);

        pg.rect(i * kolam.tsize + kolam.margin, j * kolam.tsize + kolam.margin, kolam.tsize, kolam.tsize, top_left, top_right, bottom_right, bottom_left);
        pg.point(i * kolam.tsize + kolam.tsize / 2 + kolam.margin, j * kolam.tsize + kolam.tsize / 2 + kolam.margin);
      }
    }
  }

  idx += 0.02;
  idx = constrain(idx, 0, 1);
}