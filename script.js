//constants
const NUMBLOCKS = 16;
const ROW_MAX = 4;
const COL_MAX = 4;
const gameBoard = document.querySelector(".game");

function createGrid(){
    //create string of html code to create the grid of cells
    let gridHTML = "";
    for(let i = 0; i < NUMBLOCKS; i++){
        gridHTML += "<li class=\"cell cell";
        if(i < 10){
            gridHTML += "0" + i.toString();
        }
        else{
            gridHTML += i.toString();
        }
        gridHTML += "\"></li>";
    }
    return gridHTML;
}

function setUpBlocks(){
     //create string of html code to create the grid of colored blocks
     let blockHTML = "";
     for(let i = 0; i < NUMBLOCKS; i++){
        blockHTML += "<li class=\"block block";
         if(i < 10){
            blockHTML += "0" + i.toString();
         }
         else{
            blockHTML += i.toString();
         }
         blockHTML += "\">0</li>";
     }
     return blockHTML;
}

//set up the game and get variables for website objects
let gameGrid = document.createElement("ul");
gameGrid.classList.add("grid");
gameGrid.innerHTML = createGrid();
gameGrid.setAttribute("style", "grid-template-columns: repeat(" + ROW_MAX + ", 6rem);");
gameBoard.append(gameGrid);

//add the blocks to the board
let blockElement = document.createElement("ul");
blockElement.classList.add("grid");
blockElement.innerHTML = setUpBlocks();
blockElement.setAttribute("style", "top: 0.5rem; gap: 1.8rem; grid-template-columns: repeat(" + ROW_MAX + ", 5rem);");
gameBoard.append(blockElement);

//remove all blocks
var gameBlocks = document.querySelectorAll(".block");
gameBlocks.forEach(function (block) {
    block.setAttribute("Style", "opacity: 0");
});

//----------------------game play------------------------
//game board variables
var available = NUMBLOCKS;
//all open slots stored before position 'available'
var openSlots = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
//variable to keep track of the score
var score = 0;
//variable to store users best score
var highScore = 0;
//boolean value to state if the game is over
var gameOver = false;
//variable to keep track of time passed
var secondElapsed = 0;
var minutesElapsed = 0;
//map 2D grid coordinates to array index
var positionMap2D = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];

function updateSlots(){
    let open = 0, used = available;
    for(let i = 0; i < NUMBLOCKS; i++){
        //check if the position is shown or not
        if(gameBlocks[i].style.opacity === "0"){
            openSlots[open] = i;
            open++;
        }
        else{
            openSlots[used] = i;
            used++;
        }
    }
}

function updateScore(){
    let scoreDisplay = document.querySelector(".score");
    scoreDisplay.innerText = "Score: " + score.toString();
}

function updateColour(block){
    let newColour = "";
    switch (block.innerText){
        case "2":
            newColour = "khaki";
            break;
        case "4":
            newColour = "lightsalmon";
            break;
        case "8":
            newColour = "aquamarine";
            break;
        case "16":
            newColour = "dodgerblue";
            break;
        case "32":
            newColour = "mediumslateblue";
            break;
        case "64":
            newColour = "teal";
            break;
        case "128":
            newColour = "olivedrab";
            break;
        case "256":
            newColour = "coral"; //too similar to #4
            break;
        case "512":
            newColour = "rgb(95, 39, 4)"
            break;
        case "1024":
            newColour = "crimson";
            break;
        case "2048":
            newColour = "gold";
            break;
        default:
            newColour = "blue";
    }
    block.style.backgroundColor = newColour;
}

function addBlock(){
    //get random number between 0 and NUMBLOCKS
    let index = Math.floor(Math.random() * available);
    let pos = openSlots[index];
    //move element to 'available'-1 position 
    for(let i = index; i < available-1; i++){
        openSlots[i] = openSlots[i+1];
    }
    openSlots[available-1] = pos;
    available--;

    //set block 'pos' to be visible
    gameBlocks[pos].style.opacity = 1;

    //add 2 with 75% chance, 4 with 20% chance, 8 with 5% chance
    let blockChoice = Math.random();
    if(blockChoice < 0.75){
        gameBlocks[pos].innerText = "2";
         //increase the score by 2
        score += 2;
    }
    else if(blockChoice >= 0.75 && blockChoice < 0.95){
        gameBlocks[pos].innerText = "4";
         //increase the score by 2
        score += 4;
    }
    else{
        gameBlocks[pos].innerText = "8";
         //increase the score by 2
        score += 8;
    }
    updateColour(gameBlocks[pos]);
}

function moveUp(){
    for(let row = 1; row < ROW_MAX; row++){
        for(let col = 0; col < COL_MAX; col++){
            let current = gameBlocks[positionMap2D[row][col]].innerText;
            let above = gameBlocks[positionMap2D[row-1][col]].innerText
            while((above === "0" && current != "0") || (current === above && current != "0")){
                //position above is the same number so combine them
                if(current === above && current != "0"){
                    //combine with block above
                    gameBlocks[positionMap2D[row-1][col]].innerText = parseInt(gameBlocks[positionMap2D[row-1][col]].innerText) * 2;
                    gameBlocks[positionMap2D[row-1][col]].style.opacity = "1";
                    updateColour(gameBlocks[positionMap2D[row-1][col]]);
                    //remove current block
                    gameBlocks[positionMap2D[row][col]].innerText = "0";
                    gameBlocks[positionMap2D[row][col]].style.opacity = "0";
                    //add 1 to available slots
                    available++;
                }
                else{
                    //slide block up
                    gameBlocks[positionMap2D[row-1][col]].innerText = current;
                    gameBlocks[positionMap2D[row-1][col]].style.opacity = "1";
                    updateColour(gameBlocks[positionMap2D[row-1][col]]);
                    //remove current block
                    gameBlocks[positionMap2D[row][col]].innerText = "0";
                    gameBlocks[positionMap2D[row][col]].style.opacity = "0";
                    //make sure to check again
                    if(row > 1) row--;
                }
                
                current = gameBlocks[positionMap2D[row][col]].innerText;
                above = gameBlocks[positionMap2D[row-1][col]].innerText;
            }
        }
    }
}
function moveDown(){
    for(let row = ROW_MAX-2; row >= 0; row--){
        for(let col = 0; col < COL_MAX; col++){
            let current = gameBlocks[positionMap2D[row][col]].innerText;
            let below = gameBlocks[positionMap2D[row+1][col]].innerText
            while((below === "0" && current != "0") || (current === below && current != "0")){
                //position below is the same number so combine them
                if(current === below && current != "0"){
                    //combine with block below
                    gameBlocks[positionMap2D[row+1][col]].innerText = parseInt(gameBlocks[positionMap2D[row+1][col]].innerText) * 2;
                    gameBlocks[positionMap2D[row+1][col]].style.opacity = "1";
                    updateColour(gameBlocks[positionMap2D[row+1][col]]);
                    //remove current block
                    gameBlocks[positionMap2D[row][col]].innerText = "0";
                    gameBlocks[positionMap2D[row][col]].style.opacity = "0";
                    //add 1 to available slots
                    available++;
                }
                else{
                    //slide block up
                    gameBlocks[positionMap2D[row+1][col]].innerText = current;
                    gameBlocks[positionMap2D[row+1][col]].style.opacity = "1";
                    updateColour(gameBlocks[positionMap2D[row+1][col]]);
                    //remove current block
                    gameBlocks[positionMap2D[row][col]].innerText = "0";
                    gameBlocks[positionMap2D[row][col]].style.opacity = "0";
                    //make sure to check again
                    if(row < ROW_MAX-2) row++;
                }
            
                current = gameBlocks[positionMap2D[row][col]].innerText;
                below = gameBlocks[positionMap2D[row+1][col]].innerText;
            }
        }
    }
}
function moveLeft(){
    for(let row = 0; row < ROW_MAX; row++){
        for(let col = 1; col < COL_MAX; col++){
            let current = gameBlocks[positionMap2D[row][col]].innerText;
            let left = gameBlocks[positionMap2D[row][col-1]].innerText
            while((left === "0" && current != "0") || (current === left && current != "0")){
                //position left is the same number so combine them
                if(current === left && current != "0"){
                    //combine with block to the left
                    gameBlocks[positionMap2D[row][col-1]].innerText = parseInt(gameBlocks[positionMap2D[row][col-1]].innerText) * 2;
                    gameBlocks[positionMap2D[row][col-1]].style.opacity = "1";
                    updateColour( gameBlocks[positionMap2D[row][col-1]]);
                    //remove current block
                    gameBlocks[positionMap2D[row][col]].innerText = "0";
                    gameBlocks[positionMap2D[row][col]].style.opacity = "0";
                    //add 1 to available slots
                    available++;
                }
                else{
                    //slide left
                    gameBlocks[positionMap2D[row][col-1]].innerText = current;
                    gameBlocks[positionMap2D[row][col-1]].style.opacity = "1";
                    updateColour( gameBlocks[positionMap2D[row][col-1]]);
                    //remove current block
                    gameBlocks[positionMap2D[row][col]].innerText = "0";
                    gameBlocks[positionMap2D[row][col]].style.opacity = "0";
                    //make sure to check again
                    if(col > 1) col--;
                }

                current = gameBlocks[positionMap2D[row][col]].innerText;
                left = gameBlocks[positionMap2D[row][col-1]].innerText;
            }
        }
    }
}
function moveRight(){
    for(let row = 0; row < ROW_MAX; row++){
        for(let col = COL_MAX -2; col >= 0; col--){
            let current = gameBlocks[positionMap2D[row][col]].innerText;
            let right = gameBlocks[positionMap2D[row][col+1]].innerText
            while((right === "0" && current != "0") || (current === right && current != "0")){
                //position right is the same number so combine them
                if(current === right && current != "0"){
                    //combine with block to the right
                    gameBlocks[positionMap2D[row][col+1]].innerText = parseInt(gameBlocks[positionMap2D[row][col+1]].innerText) * 2;
                    gameBlocks[positionMap2D[row][col+1]].style.opacity = "1";
                    updateColour( gameBlocks[positionMap2D[row][col+1]]);
                    //remove current block
                    gameBlocks[positionMap2D[row][col]].innerText = "0";
                    gameBlocks[positionMap2D[row][col]].style.opacity = "0";
                    //add 1 to available slots
                    available++;
                }
                else{
                    //slide right
                    gameBlocks[positionMap2D[row][col+1]].innerText = current;
                    gameBlocks[positionMap2D[row][col+1]].style.opacity = "1";
                    updateColour( gameBlocks[positionMap2D[row][col+1]]);
                    //remove current block
                    gameBlocks[positionMap2D[row][col]].innerText = "0";
                    gameBlocks[positionMap2D[row][col]].style.opacity = "0";
                    //make sure to check again
                    if(col < COL_MAX-2) col++;
                }
                current = gameBlocks[positionMap2D[row][col]].innerText;
                right = gameBlocks[positionMap2D[row][col+1]].innerText;
            }
        }
    }
}

function resetGame(){
    //reset score to 0
    score = 0;
    //reset timer to 0:00
    secondElapsed = 0;
    minutesElapsed = 0;
    //set all blocks to be available
    available = NUMBLOCKS;
    //all open slots stored before position 'available'
    openSlots = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    //remove all blocks
    gameBlocks.forEach(function (block) {
        block.setAttribute("Style", "opacity: 0");
        block.innerText = "0";
    });
    //set gameOver to false
    gameOver = false;
    //add 2 blocks
    addBlock();
    updateSlots();  
    addBlock();
    updateSlots();
    //reset UI
    document.querySelector(".endMessage").innerText = "00:00"; 
    document.querySelector(".score").innerText = "Score :" + score;
    document.querySelector(".endGame").remove(); 
}

addBlock(); //call it twice so there are 2 blocks on the board
updateSlots();
addBlock();
updateSlots();
updateScore();

//timer function
function displayTime(){
    if(gameOver === false){
        secondElapsed ++;
        if(secondElapsed > 60){
            secondElapsed = 0;
            minutesElapsed ++;
        }
        //format the time
        if(secondElapsed < 10) secondElapsed = '0' + secondElapsed;  
    }
    //if away for too long, tell them to come back
    if(minutesElapsed > 59){
        document.querySelector(".timeDisplay").innerText = "Come back and play";
    }
    //display time as 00:00 (minutes, seconds)
    else{
        if(minutesElapsed < 10){
            document.querySelector(".timeDisplay").innerText = "0" + minutesElapsed + ":" + secondElapsed; 
        }
        else{
            document.querySelector(".timeDisplay").innerText = minutesElapsed + ":" + secondElapsed; 
        }
    }
}
setInterval(displayTime, 1000);

//Events on key inputs
const body = document.body;
body.addEventListener("keydown", (event) => {
    if(gameOver === false){
        console.log(gameOver);
        switch(event.key){
            case "ArrowLeft":
                moveLeft();
                updateSlots();
                break;
            case "ArrowRight":
                moveRight();
                updateSlots();
                break;
            case "ArrowUp":
                moveUp();
                updateSlots();
                break;
            case "ArrowDown":
                moveDown();
                updateSlots();
                break;
        }
        if(available === 0){
            //display game over message and set high score
            if(score > highScore) highScore = score;
            document.querySelector(".highScore").innerText = "High Score: " + highScore;

            //add endGame element to HTML
            
            let gameEnded = document.createElement("div");
            gameEnded.classList.add("endGame");
            gameEnded.innerHTML = `<div class = "endMessage">Game Over</div>`;
            body.append(gameEnded);
            

            gameOver = true;
            return;
        }
    
        addBlock();
        updateSlots();
        updateScore();
    }
    
});
