const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#733";

let clickedCirclesCount = 0;
document.body.insertAdjacentHTML("beforeend", "<div id='counter' style='color: white; font-size: 20px; position: absolute; top: 10px; left: 10px;'>Círculos clickeados: 0</div>");

// Agregar música de fondo desde archivo local
let audio = new Audio("game.mp3"); // Asegúrate de que el archivo esté en la misma carpeta o en una accesible
audio.loop = true;
audio.play();

// Cargar efecto de sonido para la explosión
let explosionSound = new Audio("pop.mp3"); // Asegúrate de que el archivo esté en la misma carpeta
document.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    }
});

class Circle {
    constructor(x, radius, color, speed) {
        this.posX = x;
        this.posY = -radius;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.exploding = false;
        this.explosionFrame = 0;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
    }

    update(context) {
        if (this.exploding) {
            this.explosionFrame++;
            this.radius += 3;
            this.color = `rgba(255, 165, 0, ${1 - this.explosionFrame / 10})`;
            if (this.explosionFrame > 10) {
                return false;
            }
        } else {
            this.posY += this.speed;
        }
        this.draw(context);
        return true;
    }

    isClicked(x, y) {
        const distance = Math.sqrt((x - this.posX) ** 2 + (y - this.posY) ** 2);
        return distance <= this.radius;
    }
}

let circles = [];

function generateCircle() {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    let speed = Math.random() * 4 + 1;
    circles.push(new Circle(x, radius, color, speed));
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles = circles.filter(circle => circle.update(ctx));
    requestAnimationFrame(animate);
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    circles.forEach(circle => {
        if (circle.isClicked(mouseX, mouseY) && !circle.exploding) {
            circle.exploding = true;
            explosionSound.currentTime = 0;
            explosionSound.play();
            clickedCirclesCount++;
            document.getElementById("counter").innerText = `Círculos clickeados: ${clickedCirclesCount}`;
        }
    });
});

setInterval(generateCircle, 1000);
animate();
