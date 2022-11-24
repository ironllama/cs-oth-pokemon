const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

const camera = {
    x_offset: 0,
    y_offset: 0,
}


// ========== BACKGROUND ==========
const background = new Background();
const foreground = new Background("./assets/images/map_elements/island_town_fg.png");  // Foreground, so Characters can go "behind" high features. Fake 3d.


// ========== CHARACTERS ==========
const player = new Character(4000, 2525);
const npc1 = new Character(3520, 1920, 8);
const npc2 = new Character(2857, 1980, 5);
const npc3 = new Character(3400, 1022, 2);


// ========== GAME MAIN ==========

// Place the camera in the proper place.
camera.x_offset = player.curr_position.upperLeft.x - (canvas.width / 2);
camera.y_offset = player.curr_position.upperLeft.y - (canvas.height / 2);

function animate() {
    window.requestAnimationFrame(animate);

    background.draw(camera);

    npc1.randomMove();
    npc2.randomMove();
    npc3.randomMove();
    npc1.draw(camera);
    npc2.draw(camera);
    npc3.draw(camera);

    if (lastKey != "") {
        if (lastKey == keys.UP) {
            if (player.moveUp()) camera.y_offset -= player.movement_speed;
        } else if (lastKey == keys.RIGHT) {
            if (player.moveRight()) camera.x_offset += player.movement_speed;
        } else if (lastKey == keys.DOWN) {
            if (player.moveDown()) camera.y_offset += player.movement_speed;
        } else if (lastKey == keys.LEFT) {
            if (player.moveLeft()) camera.x_offset -= player.movement_speed;
        }

        player.animate();
    }
    player.draw(camera);

    foreground.draw(camera);

    // For debugging.
    // background.drawBoundaries(camera);
    // player.drawBorder(camera);
}


// ========== KEY CONTROLS ==========
const keys = {
    NONE: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4,
}
let lastKey = "";

window.addEventListener('keydown', function (e) {
    if (e.key === "ArrowUp" || e.key === "w") {
        lastKey = keys.UP;
    }
    else if (e.key === "ArrowRight" || e.key === "d") {
        lastKey = keys.RIGHT;
    }
    else if (e.key === "ArrowDown" || e.key === "s") {
        lastKey = keys.DOWN;
    }
    else if (e.key === "ArrowLeft" || e.key === "a") {
        lastKey = keys.LEFT;
    }
    else lastKey = "";
});

window.addEventListener('keyup', function (e) {
    lastKey = "";
});

animate();
