let movement_speed = 5;
let map_width = 90; // the tile width of the map
let block_size = 60; // size of each block on the map
let collision_opacity = 0.0;

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const backgroundImage = document.createElement('img');
backgroundImage.src = "./assets/images/map_elements/island_town_bg.png";

const bg = {
    image: backgroundImage,
    dx: -4022 + (canvas.width / 2),
    dy: -2550 + (canvas.height / 2)
}

const playerDownImage = document.createElement('img');
playerDownImage.src = "./assets/images/character/playerDown.png";

const playerUpImage = document.createElement('img');
playerUpImage.src = "./assets/images/character/playerUp.png";

const playerLeftImage = document.createElement('img');
playerLeftImage.src = "./assets/images/character/playerLeft.png";

const playerRightImage = document.createElement('img');
playerRightImage.src = "./assets/images/character/playerRight.png";

const player = {
    image: playerDownImage,
    width: 192 / 4,
    height: 68,
    dx: (canvas.width / 2) - (48 / 2),
    dy: (canvas.height / 2) - (68 / 2),
    animate: false
}

const playerFrames = {
    current: 0,
    max: 4,
    elapsed: 0,
    hold: 7
}

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += map_width) {
    collisionsMap.push(collisions.slice(i, map_width + i));
}

const boundaries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((num, j) => {
        if (num === 1025) {
            boundaries.push({
                x: j * block_size + bg.dx,
                y: i * block_size + bg.dy
            })
        }
    });
});

console.log(boundaries);

function rectangularCollision({ playerRect, collisionRect }) {
    return (
        playerRect.x + playerRect.width >= collisionRect.x &&
        playerRect.x <= collisionRect.x + collisionRect.width &&
        playerRect.y + playerRect.height >= collisionRect.y &&
        playerRect.y <= collisionRect.y + collisionRect.height
    );
}

function detectCollisions(futureX, futureY) {
    let collision = false;
    for (let boundary of boundaries) {
        collision = rectangularCollision({
            playerRect: {
                x: player.dx,
                y: player.dy,
                width: player.width,
                height: player.height
            },
            collisionRect: {
                x: boundary.x + futureX,
                y: boundary.y + futureY,
                width: block_size,
                height: block_size
            }
        });
        if (collision) return true;
    }
    return false;
}

function animate() {
    window.requestAnimationFrame(animate);

    // Draw the background image onto the canvas
    c.drawImage(
        bg.image,
        bg.dx,
        bg.dy
    );

    // Draw the player onto the canvas
    //image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
    c.drawImage(
        player.image,
        playerFrames.current * player.width,
        0,
        player.width,
        player.height,
        player.dx,
        player.dy,
        player.width,
        player.height
    );

    // draw the collison objects onto the canvas
    boundaries.forEach(boundary => {
        c.fillStyle = `rgba(255,0,0,${collision_opacity})`;
        c.fillRect(boundary.x, boundary.y, block_size, block_size);
    });

    if (keys.up && lastKey == "up") {
        player.animate = true;
        player.image = playerUpImage;
        if (!detectCollisions(0, movement_speed)) {
            bg.dy += movement_speed;
            boundaries.forEach(boundary => {
                boundary.y += movement_speed;
            });
        }
    } else if (keys.down && lastKey == "down") {
        player.animate = true;
        player.image = playerDownImage;
        if (!detectCollisions(0, -movement_speed)) {
            bg.dy -= movement_speed;
            boundaries.forEach(boundary => {
                boundary.y -= movement_speed;
            });
        }
    } else if (keys.left && lastKey == "left") {
        player.animate = true;
        player.image = playerLeftImage;
        if (!detectCollisions(movement_speed, 0)) {
            bg.dx += movement_speed;
            boundaries.forEach(boundary => {
                boundary.x += movement_speed;
            });
        }
    } else if (keys.right && lastKey == "right") {
        player.animate = true;
        player.image = playerRightImage;
        if (!detectCollisions(-movement_speed, 0)) {
            bg.dx -= movement_speed;
            boundaries.forEach(boundary => {
                boundary.x -= movement_speed;
            });
        }
    } else {
        player.animate = false;
    }

    if (!player.animate) return;

    playerFrames.elapsed++;
    if (playerFrames.elapsed % playerFrames.hold == 0) {
        if (playerFrames.current < playerFrames.max - 1) {
            playerFrames.current++;
        } else {
            playerFrames.current = 0;
        }
    }


}

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
}
let lastKey = "";

window.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === "ArrowDown" || e.key === "s") {
        keys.down = true;
        lastKey = "down";
    }
    if (e.key === "ArrowUp" || e.key === "w") {
        keys.up = true;
        lastKey = "up";
    }
    if (e.key === "ArrowLeft" || e.key === "a") {
        keys.left = true;
        lastKey = "left";
    }
    if (e.key === "ArrowRight" || e.key === "d") {
        keys.right = true;
        lastKey = "right";
    }
});

window.addEventListener('keyup', function (e) {
    if (e.key === "ArrowDown" || e.key === "s") {
        keys.down = false;
    }
    if (e.key === "ArrowUp" || e.key === "w") {
        keys.up = false;
    }
    if (e.key === "ArrowLeft" || e.key === "a") {
        keys.left = false;
    }
    if (e.key === "ArrowRight" || e.key === "d") {
        keys.right = false;
    }
})

animate();
