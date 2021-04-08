//Score
var scoreBox;
var score=0;

//Tetris_setting
var duration=500;//떨어지는 속도
var downInterval;//떨어지는
var minoTypeArr;//아이템 잠깐 담아두는 용도

//setting
var tableWidth=35;
var tableHeight=35;
var divArray=[];
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
    type : "mino_L",
    direction : 0,
    top : 0,
    left : 4
};


function init(){
    tempMovingMinos={...movingMinos};//스프레드오퍼레이터(...)<-배열 복사인데, 객체자체는 복사되지 않고 원본값을 참조하는 것!
    // movingMinos 값을 변경하면 tempMovingMinos의 값도 반영이 되기 때문에
    // tempMovingMinos 값과 movingMinos 값을 따로 사용하기 위해서 ... 을 사용 함!!!
    // console.log(tempMovingMinos);
    createDiv(); //테이블 생성
    renderDiv();
    createScore();
    renderMinos();
}


function createScore(){
    scoreBox = document.getElementById("scoreBox");
    scoreBox.innerText=score+"점";
}


//div 생성 및 배열에 저장
function createDiv(){
    for(var i=0;i<rows;i++){
        divArray[i]=[]; //divArray 2차원 배열 초기화
        for(var j=0;j<cols;j++){
            var div = document.createElement("div"); //<div> 태그 생성

            //div 의 style 지정
            div.style.width = tableWidth + "px";
            div.style.height = tableHeight + "px";
            div.style.left = tableWidth*j + "px";
            div.style.top = tableHeight*i + "px";
            // div.style.background = "white";
            div.style.border = 1 + "px solid gray";
            div.style.boxSizing = "border-box";
            div.style.position = "absolute";

            divArray[i][j] = div; //divArray에 div 값 저장
        }
    }
}


//div 출력
function renderDiv(){
    for(var i=0; i<divArray.length; i++){
        for(var j=0;j<divArray[i].length;j++){
            document.getElementById("content").appendChild(divArray[i][j]);
        }
    }
}


//블럭에 색을 입혀 출력
function renderMinos(moveType=""){
    var { type, direction, top, left, flag} = tempMovingMinos; //객체 디스트럭처링을 사용하여 tempMovingMinos의 키 값들을 받아오자!!
    // console.log(type, direction, top, left);

    var movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving =>{
        moving.classList.remove(type, "moving");
    });

    minos[type][direction].some(mino => { //블럭의 direction에 따른 좌표 값
        var x = mino[0] + left; //x값
        var y = mino[1] + top; //y값
        // console.log(content);

        var target =  (divArray[y])? divArray[y][x] : null; //target 지정
        // console.log(target);

        var isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type, "moving");
        }else{
            tempMovingMinos={...movingMinos};
            setTimeout(()=> {
                renderMinos();
                if(moveType = "top"){
                    stopMino();
                }
            },0)
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
    createNewMino();
}

function createNewMino(){
    // movingMinos.type = ;
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

//블럭 아래로 하강시키기
// function minoDown(){
//     tempMovingMinos.top++;
//     renderMinos();
// }

//방향키를 누름에 따라 블럭의 위치를 변경시키고 모양을 찍는다
function moveMinos(moveType, amount){ //moveType: 좌,우,아래(left,top)  , amount: 움직일(더할) left,top 값
    tempMovingMinos[moveType] +=amount;
    renderMinos(moveType); //블럭 출력
}


//방향키를 누르는 이벤트 발생
document.addEventListener("keydown", e =>{
    // console.log(e.keyCode);
    switch(e.keyCode){
        case 39:moveMinos("left",1);break; //오른쪽
        case 37:moveMinos("left",-1);break; //왼쪽
        case 40:moveMinos("top",1);break; //아래쪽
        case 38:changeDirection();break; //위쪽
    }
});


//위쪽 방향키를 눌렀을 때 direction을 변경시킨다
//direction이 3이 되면 원래 방향으로 돌아와서 drection 값을 0으로 초기화 시켜준다
function changeDirection(){
    var direction = tempMovingMinos.direction;
    (direction===3)? tempMovingMinos.direction=0 : tempMovingMinos.direction+=1;
    renderMinos(); //블럭 출력
}


window.addEventListener("load", function(){
    init();
    // setInterval("minoDown()", 500);
});
