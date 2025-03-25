const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const container = document.querySelector(".container");
const canvasWidth = container.offsetWidth;  // Obtenemos el ancho del contenedor
const canvasHeight = container.offsetHeight * 13;  // Aumentamos la altura del canvas un 50% respecto al contenedor
canvas.width = canvasWidth;
canvas.height = canvasHeight;

document.body.style.cursor = "url('assets/img/imgs/punteria.png'), auto"; // Ruta de la imagen del puntero

let clickedImagesCount = 0;
document.body.insertAdjacentHTML("beforeend", "<div id='counter' style='color: white; font-size: 20px; position: absolute; top: 140px; left: 200px;'>Imágenes clickeadas: 0</div>");

let audio = new Audio("assets/img/sounds/nightgoth.mp3"); 
audio.loop = true;
audio.play();

let explosionSound = new Audio("assets/img/sounds/batsound.mp3");
document.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    }
});

const backgroundImageSrc = "assets/img/imgs/darck.gif"; // Ruta del GIF de fondo
const backgroundImage = new Image();
backgroundImage.src = backgroundImageSrc;

const imageSrc = "assets/img/imgs/bat.png"; // Reemplaza con la ruta de tu imagen
const image = new Image();
image.src = imageSrc;

class FloatingImage {
    constructor(size, speed) {
        this.size = size;
        this.speedX = (Math.random() - 0.5) * speed * 2;
        this.speedY = (Math.random() - 0.5) * speed * 2;
        this.clicked = false;
        this.spawn();
    }

    spawn() {
        this.posX = Math.random() * (canvas.width - this.size);
        this.posY = Math.random() * (canvas.height - this.size);
    }

    draw(context) {
        if (!this.clicked) {
            context.drawImage(image, this.posX, this.posY, this.size, this.size);
        }
    }

    update(context) {
        if (this.clicked) return false;
        
        this.posX += this.speedX;
        this.posY += this.speedY;

        if (this.posX <= 0 || this.posX + this.size >= canvas.width) {
            this.speedX *= -1;
        }
        if (this.posY <= 0 || this.posY + this.size >= canvas.height) {
            this.speedY *= -1;
        }
        
        this.draw(context);
        return true;
    }

    isClicked(x, y) {
        let pointerSize = 50;
        return (
            x + pointerSize >= this.posX && x <= this.posX + this.size &&
            y + pointerSize >= this.posY && y <= this.posY + this.size
        );
    }
}

let floatingImages = [];

function generateImage() {
    let size = 50; // Tamaño fijo de las imágenes del juego
    let speed = Math.random() * 6 + 1;
    floatingImages.push(new FloatingImage(size, speed));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Dibujar imagen de fondo
    floatingImages = floatingImages.filter(image => image.update(ctx));
    requestAnimationFrame(animate);
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    floatingImages.forEach(img => {
        if (img.isClicked(mouseX, mouseY) && !img.clicked) {
            img.clicked = true;
            explosionSound.currentTime = 0;
            explosionSound.play();
            clickedImagesCount++;
            document.getElementById("counter").innerText = `Imágenes clickeadas: ${clickedImagesCount}`;
        }
    });
});

setInterval(generateImage, 1000);
animate();
