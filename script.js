var score = 0;
var rows = 10;
var cols = 10;
var pacman = {
                x: 1,
                y: 1,
                angle: '0'
            }

var pacman2 = {
                x: cols-2,
                y: 1,
                angle: '180'

}

var ghost1 = {
                x: null,
                y: null
}

function randomWorld(rows, cols) {
    let world = [];
    for(let i=0; i<rows; i++) {
        world.push([]);
        for(let j=0; j<cols; j++){
            let prob = Math.floor(Math.random()*100 + 1);
            if (prob < 21) {
                world[i].push(0)
            }
            else if(prob < 73) {
                world[i].push(1);
            }
            else if(prob < 91) {
                world[i].push(2);
            }
            else {
                world[i].push(3);
            }
        }

        world[i][0] = 2;
        world[i][cols-1] = 2;
    }

    world[1][1] = 0;
    world[1][cols-2] = 0;
    world[0].fill(2)
    world[rows-1].fill(2);

    return world;
}
function booleanWorld(oldWorld) {
    let world = [];
    for(let a = 0; a < oldWorld.length; a++){
        world.push([]);
        for(let b = 0; b < oldWorld[a].length; b++){
            world[a].push(oldWorld[a][b]);
        }
    }

    let boolArr = [];
    for(let i=0; i<world.length; i++) {
        boolArr[i] = world[i].slice();
        for(let j=0; j<boolArr[i].length; j++) {
            if (world[i][j] == 2) {
                boolArr[i][j] = 0;
            }
            else {
                boolArr[i][j] = 1;
            }
        }
    }
    return boolArr;
}
function recursiveFill(boolWorld,y,x, recursiveArr) {
    if(x < 0 || x > boolWorld[0].length-1 || y < 0 || y > boolWorld.length-1){
        return null;
    }

    if(boolWorld[y][x] == 0 || boolWorld[y][x] == 2) {
        return null;
    }

    boolWorld[y][x] = 2;

    recursiveFill(boolWorld,y,x+1,recursiveArr);
    recursiveFill(boolWorld,y,x-1,recursiveArr);
    recursiveFill(boolWorld,y+1,x,recursiveArr);
    recursiveFill(boolWorld,y-1,x,recursiveArr);
    recursiveArr.push([y,x]);
}
function fillWorld(boolArr) {
  let worldArr = [];
  //in this while loop
  do {
    worldArr = [];
    //Recursive fill every island and record its blocks' coords with an array and push into worldArr
    for(let i = 0; i < boolArr.length; i++) {
      for(let j = 0; j < boolArr[i].length; j++) {
        let recursiveArr = [];
        if(boolArr[i][j] == 1) {
          recursiveFill(boolArr,i,j,recursiveArr);
        }
        if(recursiveArr.length > 0) {
          worldArr.push(recursiveArr);
        }
      }
    }

    //Find the largest island (aka the continent) and remove it from worldArr
    let max = -1;
    let max_k = -1;
    for(let k = 0; k < worldArr.length; k++) {
      if(worldArr[k].length > max) {
        max = worldArr[k].length;
        max_k = k;
      }
    }

    worldArr.splice(max_k,1);
    
    //How we get out of the loop and avoid the code below this next line
    if(worldArr.length < 1) continue;
  
    //Pick a wall around each island randomly and turn it into not wall
    for(let m = 0; m < worldArr.length; m++) {
      let wallArr = [];
      for(let n = 0; n < worldArr[m].length; n++) {
        let y = worldArr[m][n][0];
        let x = worldArr[m][n][1];
      
        if(y-1 != 0 && boolArr[y-1][x] == 0) wallArr.push([y-1,x]);
        if(y+1 != boolArr.length-1 && boolArr[y+1][x] == 0) wallArr.push([y+1,x]);
        if(x-1 != 0 && boolArr[y][x-1] == 0) wallArr.push([y,x-1]);
        if(x+1 != boolArr[0].length-1 && boolArr[y][x+1] == 0) wallArr.push([y,x+1]);
      }
    
      let dstrWall = Math.floor(Math.random()*wallArr.length);
      boolArr[wallArr[dstrWall][0]][wallArr[dstrWall][1]] = 1;
    }
    
    //Turn the boolArr back into an array of 0s and 1s in case recursiveFill is run again
    for(let d = 0; d < boolArr.length; d++) {
      for(let e = 0; e < boolArr[d].length; e++) {
        if (boolArr[d][e] != 0) boolArr[d][e] = 1;
      }
    }  
  } while(worldArr.length > 0)

  for(let d = 0; d < boolArr.length; d++) {
    for(let e = 0; e < boolArr[d].length; e++) {
      if (boolArr[d][e] != 0) boolArr[d][e] = 1;
    }
  }  

  return boolArr;
}
function breakWall(world, boolArr) {
    for(let i = 0; i < boolArr.length; i++) {
        for(let j = 0; j< boolArr[i].length; j++) {
            if(boolArr[i][j] && world[i][j] == 2) {
                world[i][j] = 0;
            }
        }
    }
    return world;
}
function displayWorld(newWorld) {
    let world = [];
    for(let a = 0; a < newWorld.length; a++){
        world.push([]);
        for(let b = 0; b < newWorld[a].length; b++){
            world[a].push(newWorld[a][b]);
        }
    }
    // console.log(world)

    let output = "";
    for(let i=0; i<world.length; i++) {
        output += '\n<div class="row">\n';
        for(let j=0; j<world[i].length; j++) {
            if(world[i][j] == 3)
                output += '<div class="cherry"></div>';
            else if(world[i][j] == 2)
                output += '<div class="brick"></div>';
            else if(world[i][j] == 1)
                output += '<div class="coin"></div>';
            else if(world[i][j] == 0)
                output += '<div class="empty"></div>';
        }
        output += '\n</div>';
    }
    document.getElementById('world').innerHTML = output;
}
function displayPacman() {
    document.getElementById('pacman').style.top = pacman.y*20+"px";
    document.getElementById('pacman').style.left = pacman.x*20+"px";
    $('#pacman').css('transform', 'rotate(' + pacman.angle + 'deg)');
}
function displayPacman2() {
    document.getElementById('pacman2').style.top = pacman2.y*20+"px";
    document.getElementById('pacman2').style.left = pacman2.x*20+"px";
    $('#pacman2').css('transform', 'rotate(' + pacman2.angle + 'deg)');
}
function displayGhost1() {
    $('#ghost1').css('top', ghost1.y * 20 + 'px');
    $('#ghost1').css('left', ghost1.x * 20 + 'px');
}
function displayScore() {
    document.getElementById('score').innerHTML = score;
    $('#score').css('left', cols*20 + 50 + 'px');
}
function placeGhost(){
    let x = 0;
    let y = 0;
    while(world[y][x] == 2) {
        x = Math.floor(Math.random()*cols);
        y = Math.floor(Math.random()*rows);
    }
    ghost1.x = x;
    ghost1.y = y;
}
function touchGhost() {
    if((pacman.x == ghost1.x && pacman.y == ghost1.y) || (pacman2.x == ghost1.x && pacman2.y == ghost1.y)) {
        $('body').append("<div style='color: white'>You have lost the game.</div>")
        // alert('You have lost the game')
        return true
    }
    return false
}
function collectAll(world) {
    for(let i = 0; i < world.length; i++) {
        for(let j = 0; j < world[i].length; j++) {
            if(world[i][j] == 1 || world[i][j] == 3) {
                return false
            }
        }
    }
    return true
}

document.onkeydown = function(e) {
    if(e.keyCode == 37 && pacman.x-1 > -1 && world[pacman.y][pacman.x-1] != 2) {
        pacman.x--;
        pacman.angle = '180';
    }
    else if(e.keyCode == 39 && pacman.x+1 < world[0].length && world[pacman.y][pacman.x+1] != 2) {
        pacman.x++;
        pacman.angle = '0';
    }
    else if(e.keyCode == 38 && pacman.y-1 > -1 && world[pacman.y-1][pacman.x] != 2) {
        pacman.y--;
        pacman.angle = '270';
    }
    else if(e.keyCode == 40 && pacman.y+1 < world.length && world[pacman.y+1][pacman.x] != 2) {
        pacman.y++;
        pacman.angle = '90';
    }
    else if(e.keyCode == 65 && pacman2.x-1 > -1 && world[pacman2.y][pacman2.x-1] != 2) {
        pacman2.x--;
        pacman2.angle = '180';
    }
    else if(e.keyCode == 68 && pacman2.x+1 < world[0].length && world[pacman2.y][pacman2.x+1] != 2) {
        pacman2.x++;
        pacman2.angle = '0';
    }
    else if(e.keyCode == 87 && pacman2.y-1 > -1 && world[pacman2.y-1][pacman2.x] != 2) {
        pacman2.y--;
        pacman2.angle = '270';
    }
    else if(e.keyCode == 83 && pacman2.y+1 < world.length && world[pacman2.y+1][pacman2.x] != 2) {
        pacman2.y++;
        pacman2.angle = '90';
    }

    let random_movement = Math.floor(Math.random() * 4);
    if([37, 38, 39, 40, 65, 68, 83, 87].includes(e.keyCode)) {
        if (random_movement == 0 && world[ghost1.y-1][ghost1.x] != 2) {
            ghost1.y--;
        }
        else if (random_movement == 1 && world[ghost1.y+1][ghost1.x] != 2) {
            ghost1.y++;
        }
        else if (random_movement == 2 && world[ghost1.y][ghost1.x-1] != 2) {
            ghost1.x--;
        }
        else if (random_movement == 3 && world[ghost1.y][ghost1.x+1] != 2) {
            ghost1.x++;
        }
    }

    if(world[pacman.y][pacman.x] == 1 || world[pacman.y][pacman.x] == 3) {
        if(world[pacman.y][pacman.x] == 3) {
            score += 50;
        }
        else {
            score += 10;
        }
        world[pacman.y][pacman.x] = 0;

        displayWorld(world);
        displayScore();
    }

    if(world[pacman2.y][pacman2.x] == 1 || world[pacman2.y][pacman2.x] == 3) {
        if(world[pacman2.y][pacman2.x] == 3) {
            score += 50;
        }
        else {
            score += 10;
        }
        world[pacman2.y][pacman2.x] = 0;

        displayWorld(world);
        displayScore();
    }


    displayPacman();
    displayPacman2();
    displayGhost1();
    touchGhost();
}

oldWorld = randomWorld(rows, cols);
boolArr = booleanWorld(oldWorld);
newBoolArr = fillWorld(boolArr);
world = breakWall(oldWorld,newBoolArr);
displayWorld(world);
displayScore()
placeGhost()
displayGhost1()
displayPacman2()


