var playground = document.querySelector(".playground > ul");
var gameText = document.querySelector(".game-text");
var scoreDisplay = document.querySelector(".score");
var restartButton = document.querySelector(".game-text > button");



//Score
var score=0;

//Tetris_setting
var duration=500;//떨어지는 속도
var downInterval;//떨어지는

//setting
var rows = 20;
var cols = 10;
var tempMovingMinos;


//블록 모양 잡을 곳
var minos = {
    mino_O : [
        [[0,0], [0,1],[1,0],[1,1]],
        [[0,0], [0,1],[1,0],[1,1]],
        [[0,0], [0,1],[1,0],[1,1]],
        [[0,0], [0,1],[1,0],[1,1]]
    ],
    mino_i :[
        [[0,0], [0,1],[0,2],[0,3]],
        [[0,0], [1,0],[2,0],[3,0]],
        [[0,0], [0,1],[0,2],[0,3]],
        [[0,0], [1,0],[2,0],[3,0]]
    ],
    mino_T :[
        [[0,1], [1,0],[1,1],[1,2]],
        [[0,0], [1,0],[2,0],[1,1]],
        [[0,0], [0,1],[0,2],[1,1]],
        [[1,0], [0,1],[1,1],[2,1]]
    ],
    mino_Z :[
        [[1,0], [2,0],[0,1],[1,1]],
        [[0,0], [0,1],[1,1],[1,2]],
        [[1,0], [2,0],[0,1],[1,1]],
        [[0,0], [0,1],[1,1],[1,2]]
    ],
    mino_S :[
        [[0,0], [1,0],[1,1],[2,1]],
        [[0,1], [0,2],[1,0],[1,1]],
        [[0,0], [1,0],[1,1],[2,1]],
        [[0,1], [0,2],[1,0],[1,1]]
    ],
    mino_J :[
        [[0,2], [1,0],[1,1],[1,2]],
        [[0,0], [1,0],[2,0],[2,1]],
        [[0,0], [0,1],[0,2],[1,0]],
        [[0,0], [0,1],[1,1],[2,1]]
    ],
    mino_L :[
        [[0,0], [1,0],[1,1],[1,2]],
        [[0,0], [0,1],[1,0],[2,0]],
        [[0,0], [0,1],[0,2],[1,2]],
        [[2,0], [0,1],[1,1],[2,1]]
    ]
}


//움직이는 블럭의 Json 값
var movingMinos = {
    type : "",
    direction : 0,
    top : 0,
    left : 4
};


function init(){

    for(var i=0; i<rows; i++){
        prependNewLine();
    }
    
    tempMovingMinos={...movingMinos};//스프레드오퍼레이터(...)<-배열 복사인데, 객체자체는 복사되지 않고 원본값을 참조하는 것!
    // movingMinos 값을 변경하면 tempMovingMinos의 값도 반영이 되기 때문에
    // tempMovingMinos 값과 movingMinos 값을 따로 사용하기 위해서 ... 을 사용 함!!!

    createNewMino();
}

//playground에 들어갈 십자선을 만듬
function prependNewLine(){
    var li = document.createElement("li");
    var ul = document.createElement("ul");
    for(var j=0; j<cols; j++){
        var matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}


//블럭에 색을 입혀 출력
function renderMinos(moveType=""){
    var { type, direction, top, left} = tempMovingMinos; //객체 디스트럭처링을 사용하여 tempMovingMinos의 키 값들을 받아오자!!
    // console.log(type, direction, top, left);

    var movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving =>{
        moving.classList.remove(type, "moving");
    });

    minos[type][direction].some(mino => { //블럭의 direction에 따른 좌표 값
        var x = mino[0] + left; //x값
        var y = mino[1] + top; //y값
        var target = (playground.childNodes[y])? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        // console.log(target);
        
        var isAvailable = checkEmpty(target);
        // console.log(isAvailable);
        if(isAvailable){
            target.classList.add(type, "moving");
        }else{
            tempMovingMinos={...movingMinos};
            if(moveType =='retry'){
                clearInterval(downInterval);
                showGameoverText();
            }
            setTimeout(()=> {
                renderMinos("retry");
                if(moveType == "top"){
                    stopMino();
                }
            },0);
            return true;
        }
    });
    movingMinos.left = left;
    movingMinos.top = top;
    movingMinos.direction = direction;
}

function stopMino(){
    var movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving =>{
        moving.classList.remove("moving");
        moving.classList.add("stopped");
    });
    checkMatch();
}

function checkMatch(){
    var childNodes = playground.childNodes;
    childNodes.forEach(child =>{
        var matched = true;
        child.childNodes[0].childNodes.forEach(li => {
            if(!li.classList.contains("stopped")){
                matched = false;
            }
        });
        if(matched){
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerText = score;
        }
    });
    createNewMino();
}

function createNewMino(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveMinos('top', 1);
    }, duration);


    var minoArray = Object.entries(minos);
    var randomIndex = getRandom(minoArray.length);

    movingMinos.type = minoArray[randomIndex][0];
    movingMinos.left = 4;
    movingMinos.top = 0;
    movingMinos.direction = 0;
    tempMovingMinos={...movingMinos};
    renderMinos();
}

function checkEmpty(target){
    if(!target || target.classList.contains("stopped")){
        return false;
    }
    return true;
}


//방향키를 누름에 따라 블럭의 위치를 변경시키고 모양을 찍는다
function moveMinos(moveType, amount){ //moveType: 좌,우,아래(left,top)  , amount: 움직일(더할) left,top 값
    tempMovingMinos[moveType] +=amount;
    renderMinos(moveType); //블럭 출력
}

function dropMino(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveMinos('top', 1)
    }, 10);
}

function showGameoverText(){
    gameText.style.display = "flex";
}

//방향키를 누르는 이벤트 발생
document.addEventListener("keydown", e =>{
    // console.log(e.keyCode);
    switch(e.keyCode){
        case 39: //오른쪽
            moveMinos("left",1);
            break; 
        case 37: //왼쪽
            moveMinos("left",-1);
            break; 
        case 40: //아래쪽
            moveMinos("top",1);
            break; 
        case 38: //위쪽
            changeDirection();
            break; 
        case 32: //스페이스바
            dropMino();
            break; 
        default:
            break;
    }
});


//위쪽 방향키를 눌렀을 때 direction을 변경시킨다
//direction이 3이 되면 원래 방향으로 돌아와서 drection 값을 0으로 초기화 시켜준다
function changeDirection(){
    var direction = tempMovingMinos.direction;
    (direction===3)? tempMovingMinos.direction=0 : tempMovingMinos.direction+=1;
    renderMinos(); //블럭 출력
}

restartButton.addEventListener("click", ()=>{
    playground.innerHTML="";
    gameText.style.display = "none";
    score = 0;
    scoreDisplay.innerText = score;
    init();
});

window.addEventListener("load", function(){
    init();
});