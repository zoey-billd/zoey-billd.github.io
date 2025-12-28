// 文件名: meteor-bg.js

let meteors = [];
let numMeteors = 200; // 如果你的博客比较卡，可以把这个数字改小，比如 100

function setup() {
  // 创建一个覆盖全屏的画布
  let canvas = createCanvas(windowWidth, windowHeight);
  
  // 关键：将画布固定在网页最底层
  canvas.position(0, 0);
  canvas.style('z-index', '-1'); // -1 保证它在文字后面
  canvas.style('position', 'fixed'); // 保证滚动页面时背景不动
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('pointer-events', 'none'); // 保证鼠标可以穿透画布点击博客链接

  for (let i = 0; i < numMeteors; i++) {
    meteors.push(new Meteor());
  }
}

function draw() {
  // 1. 绘制背景
  // 使用 gradient 模拟午夜蓝深空
  let bgGradient = drawingContext.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, "#020410"); 
  bgGradient.addColorStop(1, "#0a1525"); 
  drawingContext.fillStyle = bgGradient;
  drawingContext.fillRect(0, 0, width, height);

  // 2. 绘制流星
  for (let m of meteors) {
    m.update();
    m.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 窗口改变大小时重置，防止流星断裂
  meteors = [];
  for (let i = 0; i < numMeteors; i++) {
    meteors.push(new Meteor());
  }
}

// --- 流星类 (保持不变) ---
class Meteor {
  constructor() {
    this.reset();
    this.progress = random(-height, height);
  }

  reset() {
    this.x = random(width + 300) - 300;
    this.y = random(height + 300) - 300;
    this.z = random(0.2, 1) * random(0.5, 1.2); 
    this.angle = PI / 4;
    this.len = random(100, 400) * this.z;
    this.speed = random(15, 35) * this.z;
  }

  update() {
    this.progress += this.speed;
    if (this.progress > width * 1.5) {
      this.progress = -random(100, 300);
      this.reset();
      if(random() > 0.5) {
          this.x = random(width);
          this.y = -200;
      } else {
          this.x = -200;
          this.y = random(height);
      }
    }
  }

  display() {
    if (this.progress < 0) return;

    push();
    let currentX = this.x + cos(this.angle) * this.progress;
    let currentY = this.y + sin(this.angle) * this.progress;
    let tailX = this.x + cos(this.angle) * (this.progress - this.len);
    let tailY = this.y + sin(this.angle) * (this.progress - this.len);

    if (this.z > 0.4) {
        drawingContext.shadowBlur = 15 * this.z;
        drawingContext.shadowColor = "rgba(0, 255, 255, 0.6)";
    } else {
        drawingContext.shadowBlur = 0;
    }

    let gradient = drawingContext.createLinearGradient(tailX, tailY, currentX, currentY);
    gradient.addColorStop(0, "rgba(0, 10, 50, 0)"); 
    gradient.addColorStop(0.2, "rgba(20, 100, 200, 0.2)"); 
    gradient.addColorStop(0.8, "rgba(100, 255, 255, " + this.z + ")"); 
    gradient.addColorStop(1, "rgba(255, 255, 255, " + (this.z + 0.2) + ")");

    drawingContext.strokeStyle = gradient;
    drawingContext.lineCap = "round"; 
    drawingContext.lineWidth = 3 * this.z;

    drawingContext.beginPath();
    drawingContext.moveTo(tailX, tailY);
    drawingContext.lineTo(currentX, currentY);
    drawingContext.stroke();
    
    if (this.z > 0.8) {
        drawingContext.shadowBlur = 0;
        stroke(255, 200);
        strokeWeight(1);
        let flareSize = 6 * this.z;
        line(currentX - flareSize, currentY, currentX + flareSize, currentY);
        line(currentX, currentY - flareSize, currentX, currentY + flareSize);
    }
    pop();
  }
}
