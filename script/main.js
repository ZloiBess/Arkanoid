const blocks = document.querySelector(".blocks");
const platform = document.querySelector(".platform");
const container = document.querySelector(".container");
const containerRect = container.getBoundingClientRect();//assist
const ball = document.querySelector(".ball");
const startTap = document.querySelector(".textStart");
const heart1 = document.querySelector(".heart1");
const heart2 = document.querySelector(".heart2");
var arrBlocks;
//hp
var hearts = 3;
//size ball;
ball.style.height = platform.getBoundingClientRect().height + "px";
ball.style.width = platform.getBoundingClientRect().height + "px";
//start position for ball;
const startX = containerRect.left + (containerRect.width / 2) - ball.clientWidth / 2;
const startY = platform.getBoundingClientRect().top - ball.getBoundingClientRect().height - 10;
//speed ball;
const speedX = 2.5;
const speedY = 2.5;



/** 
 *  Create blocks and return arr from all blocks
*/


function createBlocks() {
    blocks.innerHTML = "";
    let arr = [];
    for (let i = 0; i < 100; i++) {
        let block = document.createElement("li");
        blocks.appendChild(block);
        arr[i] = block;
    };
    return arr;
};
arrBlocks = createBlocks();


/**
 * return all blocks if herts === 0
 */

function returnAllBlocks() {
    for (let i = 0; i < arrBlocks.length; i++) {
        arrBlocks[i].classList.remove("removeBlock");
    }
}



/** 
 * action platform 
 */


const platformWidth = platform.getBoundingClientRect().width;
function controlPlarform(e) {
    // calc current position and type;
    if (e.type === "touchstart" || e.type === "touchmove") {
        e.preventDefault();
        newLeft = e.touches[0].pageX - platformWidth / 2;
    } else {
        newLeft = e.pageX - platformWidth / 2;
    }
    // Робимо обмеження платформи, щоб та не виходила за кордони поля.
    // Поточній позиції платформі задається наступне значення:
    //  -Максимальне значення між (!КОНСТАНТА!координата лівого кордона поля,...
    //  ...або обирається мінімальне значення між (поточна позиція, або !КОНСТАНТА!координата правого кордона поля))
    //!Hard 8 !
    newLeft = Math.max(containerRect.left, Math.min(newLeft, (containerRect.left + containerRect.width - platformWidth)));
    // set value;
    platform.style.left = newLeft + "px";
};


/** 
 * action ball 
 */


//container border bottom;
const maxY = window.innerHeight - ball.clientHeight;
//container border left and right;
const leftBorder = containerRect.left;
const rightBorder = containerRect.left + containerRect.width - ball.scrollHeight;
//coordinate ball;
var x = startX;
var y = startY;
//speed ball
var localSpeedX = speedX;
var localSpeedY = speedY;

var randomReboundX = 0;

function actionBall() {
    //coordinate platform;
    const platformXStart = platform.getBoundingClientRect().left;
    const platformXEnd = platform.getBoundingClientRect().left + platform.getBoundingClientRect().width;
    const platformY = platform.getBoundingClientRect().top;
    //coordinate ball
    let ballRect = ball.getBoundingClientRect();
    //shift ball;
    x += localSpeedX * randomReboundX; //random x-coordinate; first time x = 0 after collision platform x = random;
    y += localSpeedY;

    //collision left right;
    if (x <= leftBorder || x >= rightBorder) {
        localSpeedX = -localSpeedX;
    }
    //collision top
    if (y <= 1) {
        localSpeedY = -localSpeedY;
    }
    //collision down
    if (y >= maxY) {
        x = startX;
        y = startY;
        localSpeedX = 0;
        localSpeedY = 0;
        randomReboundX = 0;
        startTap.classList.remove("hidden");
        --hearts;
        if (hearts === 2) {
            heart1.classList.add("hidden");
        } 
        else if (hearts === 1) {
            heart2.classList.add("hidden");
        }
        if (hearts == 0) {
            returnAllBlocks();
            hearts = 3;
            heart1.classList.remove("hidden");
            heart2.classList.remove("hidden");
        }
    }
    //collision ball with platform;
    const bottomBall = y + ballRect.height;
    if (bottomBall > platformY) {
        if (x > platformXStart && x < platformXEnd) {
            localSpeedY = -localSpeedY;
            randomReboundX = Math.random() < 0.5 ? speedX : -speedX;
        }
    }
    //collision ball with blocks;
    for (let i = 0; i < arrBlocks.length; i++) {
        let block = arrBlocks[i];
        let blockRect = block.getBoundingClientRect();
        let blockYstart = blockRect.top;
        let blockYend = blockRect.top + blockRect.height;
        let blockXstart = blockRect.left;
        let blockXend = blockXstart + blockRect.width;

        // ball up
        if (localSpeedY < 0) {
            //coollision top ball and bottom block
            if (y >= blockYstart && y <= blockYend) {
                //top ball
                if (x >= blockXstart && (x + ballRect.width) <= blockXend) {
                    localSpeedY = -localSpeedY;
                    block.classList.add("removeBlock");
                }
                //left top corner ball
                else if (x >= blockXstart && x <= blockXend) {
                    // if x <-
                    if (localSpeedX < 0) {
                        localSpeedX = -localSpeedX;
                        localSpeedY = -localSpeedY;
                        block.classList.add("removeBlock");
                        console.log(" <- left top");
                    }
                    // if x ->
                    else {
                        localSpeedY = -localSpeedY;
                        block.classList.add("removeBlock");
                        console.log(" -> left top");
                    }
                }
                //right top corner ball
                else if (x + ballRect.width >= blockXstart && x + ballRect.width <= blockXend) {
                    // if x <-
                    if (localSpeedX < 0) {
                        localSpeedY = -localSpeedY;
                        block.classList.add("removeBlock");
                        console.log(" -> right top");
                    }
                    // if x ->
                    else {
                        localSpeedX = -localSpeedX;
                        localSpeedY = -localSpeedY;
                        block.classList.add("removeBlock");
                        console.log(" -> right top");
                    }
                }
            }
            //collision bottom ball and top block
            else if (y + ballRect.height >= blockYstart && y + ballRect.height <= blockYend) {
                //right bottom corner and left bottom corner 
                if (x + ballRect.width >= blockXstart && x + ballRect.width <= blockXend ||
                    x >= blockXstart && x <= blockXend) {
                    localSpeedX = -localSpeedX;
                    block.classList.add("removeBlock");
                    console.log(" bottom corner ");
                }
            }
        }

        //ball down
        else if (localSpeedY > 0) {
            //collision bottom ball and top block
            if (y + ballRect.height >= blockYstart && y + ballRect.height <= blockYend) {
                if (x >= blockXstart && x + ballRect.width <= blockXend) {
                    localSpeedY = -localSpeedY;
                    block.classList.add("removeBlock");
                }
                //left bottom corner ball
                else if (x >= blockXstart && x <= blockXend) {
                    //if x <-
                    if (localSpeedX < 0) {
                        localSpeedX = -localSpeedX;
                        localSpeedY = -localSpeedY;
                        block.classList.add("removeBlock");
                        console.log(" <- left bottom");
                    }
                    //if x ->
                    else {
                        localSpeedY = -localSpeedY;
                        block.classList.add("removeBlock");
                        console.log(" -> left bottom");
                    }
                }
                //right bottom corner ball
                else if (x + ballRect.width >= blockXstart && x + ballRect.width <= blockXend) {
                    //if x <-
                    if (localSpeedX < 0) {
                        localSpeedY = -localSpeedY;
                        block.classList.add("removeBlock");
                        console.log(" <- right bottom");
                    } else {
                        localSpeedX = -localSpeedX;
                        localSpeedY = -localSpeedY;
                        block.classList.add("removeBlock");
                        console.log(" -> right bottom");
                    }
                }

            }
            //collision top ball and bottom block
            else if (y >= blockYstart && y <= blockYend) {
                //left top corner and right top coner ball
                if (x >= blockXstart && x <= blockXend ||
                    x + ballRect.width >= blockXstart && x + ballRect.width <= blockXend) {
                    localSpeedX = -localSpeedX;
                    block.classList.add("removeBlock");
                }
            }

        }
    }

    ball.style.left = x + 'px';
    ball.style.top = y + 'px';

    requestAnimationFrame(actionBall);
};

startTap.addEventListener("click", function (e) {
    e.preventDefault();
    startTap.classList.add("hidden");
    localSpeedX = speedX;
    localSpeedY = speedY;
    actionBall();
    window.addEventListener("mousemove", controlPlarform);
    window.addEventListener("touchstart", controlPlarform);
    window.addEventListener("touchmove", controlPlarform);
});
