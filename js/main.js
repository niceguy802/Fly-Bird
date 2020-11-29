var title = document.getElementById("title");
var start = document.getElementById("start");
var flyBird = document.getElementById("flyBird");
var box = document.getElementById("box");
var ul = document.getElementsByTagName("ul")[0];
var scoreBoard = document.getElementById("scoreBoard");
var audios = document.getElementsByTagName("audio");
var over = document.getElementsByClassName("over")[0];
var mask = document.getElementById("mask");
// 定时器
var downTimer = null;
var upTimer = null;
var pipeTimer = null;
var crashTimer = null;
var speed = 0;
var maxSpeed = 8;
var scoreNum = 0;


// 小鸟向下
function downBird() {
  flyBird.src = "img/bird1.png";
  speed += 0.3;
  if (speed >= maxSpeed) {
    speed = maxSpeed;
  }
  flyBird.style.top = flyBird.offsetTop + speed + "px";
}

// 加分
function addScore() {
  scoreNum++;
  // 每次都先加空内容
  scoreBoard.innerHTML = "";
  // 将number转化成string类型
  var scoreNumStr = scoreNum + "";
  for (let i = 0; i < scoreNumStr.length; i++) {
    var img = document.createElement("img");
    img.src = `img/${scoreNumStr[i]}.jpg`;
    scoreBoard.appendChild(img);
  }
}

// 碰撞
// (,bird)
function crash(a, b) {
  // 返回true
  return !(a.parentNode.offsetLeft > b.offsetLeft + b.offsetWidth || b.offsetLeft > a.parentNode.offsetLeft + a.offsetWidth || a.offsetTop > b.offsetTop + b.offsetHeight || b.offsetTop > a.offsetTop + a.offsetHeight)
}

// 生成随机数
function random(max, min) {
  return Math.random() * (max - min) + min;
}

// 生成管道
function createPipe() {
  // 出现管道
  var li = document.createElement("li");
  var TopHeight = random(230, 70);
  var BottomHeight = 300 - TopHeight;
  li.innerHTML = `<div class="pipeTop" style="height:${TopHeight}px">
          <img src="./img/up_pipe.png" alt="">
          </div>
        <div class="pipeBottom" style="height:${BottomHeight}px">
          <img src="./img/down_pipe.png" alt="">
        </div>`;
  // 加分记号
  li.lock = false;
  ul.appendChild(li);
  var pipeTop = document.getElementsByClassName("pipeTop")[0];
  var pipeBottom = document.getElementsByClassName("pipeBottom")[0];
  // 柱子后移
  li.moveTimer = setInterval(function () {
    li.style.left = li.offsetLeft - 3 + "px";
    li.style.left = `${li.offsetLeft - 3}px`;
    // 移出删除
    if (li.offsetLeft < -70) {
      ul.removeChild(li);
    }
    //计分
    if (flyBird.offsetLeft > li.offsetLeft + li.offsetWidth && li.lock == false) {
      addScore();
      li.lock = true;
    }
    if (crash(pipeTop, flyBird) || crash(pipeBottom, flyBird)) {
      gameOver();
    }
  }, 30);
}

function gameStart() {
  start.style.display = "none";
  title.style.display = "none";

  // 开始游戏音乐
  audios[1].play();
  // 出现小鸟
  flyBird.style.display = "block";

  downTimer = setInterval(downBird, 30);
  pipeTimer = setInterval(createPipe, 1600);

  crashTimer = setInterval(function () {
    if (flyBird.offsetTop <= 0 || flyBird.offsetTop + flyBird.offsetHeight >= 422) {
      gameOver();
    }
  }, 30)

}

// 游戏结束
function gameOver() {
  console.log("结束");
  clearInterval(downTimer);
  clearInterval(upTimer);
  clearInterval(pipeTimer);
  clearInterval(crashTimer);
  over.style.display = "block";
  // mask.style.display = "block";
  // 关闭音乐
  audios[1].pause();
  audios[2].play();
  var lis = document.getElementsByTagName("li");
  for (var i = 0; i < lis.length; i++) {
    clearInterval(lis[i].moveTimer)
  }
  box.onclick = null;
}

// 开始按钮
start.onclick = function (event) {
  // 取消事件冒泡
  var ev = event || window.event;//判断浏览器兼容性
  if (ev.stopPropagation) {
    ev.stopPropagation()
  } else {
    ev.cancelBubble = true;
  }
  gameStart();
  box.onclick = function () {

    // 小鸟停止下降
    clearInterval(downTimer);
    // 防止速度持續加快
    clearInterval(upTimer);

    // 点击向上音效
    audios[0].pause();
    audios[0].play();

    flyBird.src = "img/up_bird1.png";
    speed = maxSpeed;
    // 上升
    upTimer = setInterval(() => {
      speed -= 0.7;
      if (speed <= 0) {
        // 防止上升
        clearInterval(upTimer);
        downTimer = setInterval(() => {
          downBird();
        }, 30);
      }
      flyBird.style.top = flyBird.offsetTop - speed + "px";
    }, 30);

  }
}