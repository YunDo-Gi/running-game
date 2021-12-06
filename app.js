const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const HI_SCORE = 'highscore';

let cactusImage = new Image(50, 50);
cactusImage.src = 'cactus.png'

canvas.width = 600;
canvas.height = 150;

let player =  {
    x: 10,
    y: 100,
    width: 50,
    height: 50,
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height); 
    }
}

class Obstacle {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {
        ctx.fillStyle = 'red';
        //ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(cactusImage, this.x, this.y);
    }
}



let score = 0;
let highScore = localStorage.getItem(HI_SCORE);


let timer = 0;
let velocity = 1.00; // 한 화면 내의 요소들 속도 통일 시켜야할 듯 + 속도에 따라 장애물들의 등장 간격을 달리해야함
// 캔버스 내에서 장애물이 특정 위치를 지나면 다음 장애물 등장?
let obstacles = [];  
let jumpSwitch = false;
let jumpTimer = 0;
let myReq;

function move() {
    myReq = requestAnimationFrame(move); // 1초당 60번 동작
    timer++;
    score++;
    velocity += 0.01;
    ctx.clearRect(0,0,canvas.width, canvas.height);

    if(timer % 120 === 0) {
        let cactus = new Obstacle(canvas.width, 100, 50, 50);
        obstacles.push(cactus); 
    }
    obstacles.forEach((cur, index, arr) => {
        if(cur.x+50 < 0) {
            arr.splice(index, 1); // 이거 사라질 때 다른애들 껌벅거리는데?
        } 
        cur.x -= velocity;
        collision(player, cur);
        cur.draw();
    }) 

    // jump
    if(jumpSwitch === true) {
        player.y -= 2;
        jumpTimer += 2;
    }
    if(jumpTimer > 100) {
        jumpSwitch = false;
        jumpTimer = 0;
    }
    if(jumpSwitch === false && player.y < 100) {
        player.y += 2;
    }

    // score
    ctx.font = '20px Pacifico'
    ctx.fillStyle = 'grey'
    if(highScore && highScore >= score) {
        ctx.fillText(highScore.toString().padStart(5,'0'), 470, 20);
    }
    ctx.fillText(score.toString().padStart(5,'0'), 530, 20);
    if(highScore) {
        if(highScore < score) {
            ctx.fillText(score.toString().padStart(5,'0'), 470, 20);
        }
    }

    player.draw();
} 

function collision(a, b) {
    let distanceX = b.x - (a.x + a.width);
    let distanceY = b.y - (a.y + a.height);
    if(distanceX < 0 && distanceY <0) {
        if(highScore) {
            if(highScore < score) {
                localStorage.setItem(HI_SCORE, score);
            }
        }
        if(highScore === null) {
            localStorage.setItem(HI_SCORE, score);  
        }
        cancelAnimationFrame(myReq);
    }
}

document.addEventListener('keydown', function(event) {
    switch(event.code){
        case 'Space':
            if(player.y === 100) {
                jumpSwitch = true;
            } 
            break;
		case 'ArrowUp':
            if(player.y === 100) {
                jumpSwitch = true;
            } 
			break;
		case 'ArrowDown':
			break;
    }
})
