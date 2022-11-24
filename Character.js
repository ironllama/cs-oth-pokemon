class Character {
    image_up = null;
    image_right = null;
    image_down = null;
    image_left = null;
    curr_image = null;
    image_width = 192;
    image_height = 68;
    image_num_sprites = 4;
    sprite_width = 0;
    sprite_height = 0;
    sprite_frames = {
        total_frames_elapsed: 0,
        current: 0,
        max: 4,
        hold: 7,     // Animation delay
    };

    movement_speed = 5;
    curr_position = {}

    // For NPCs only
    move_queue = [];
    move_amt = 10;  // How many moves to add per new activity into the queue.
    prev_activity_secs = 0;  // When the last activity was added to the queue.
    activity_tick_secs = 1;  // How often to check whether to randomly add to the queue.
    activity_adj = 0;  // Chance (0 never, 10 always) that an activity will be added to queue.

    // If an x and y are privided to the constructor, it is assumed to be an NPC character.
    // If not, then it is assumed to be the player character.
    constructor(x = null, y = null, new_aa = null) {
        const upImageElem = document.createElement('img');
        upImageElem.src = "./assets/images/character/playerUp.png";
        this.image_up = upImageElem;

        const rightImageElem = document.createElement('img');
        rightImageElem.src = "./assets/images/character/playerRight.png";
        this.image_right = rightImageElem;

        const downImageElem = document.createElement('img');
        downImageElem.src = "./assets/images/character/playerDown.png";
        this.image_down = downImageElem;

        const leftImageElem = document.createElement('img');
        leftImageElem.src = "./assets/images/character/playerLeft.png";
        this.image_left = leftImageElem;

        this.curr_image = this.image_down;
        this.sprite_width = this.image_width / this.image_num_sprites;
        this.sprite_height = this.image_height;

        if (x == null || y == null) {
            this.setPosOnBackground(
                // camera.x_offset + (canvas.width / 2) - (this.sprite_width / 2),
                // camera.y_offset + (canvas.height / 2) - (this.sprite_height / 2)
                0,
                0
            );
        } else {
            this.setPosOnBackground(x, y);
            if (new_aa !== null) this.activity_adj = new_aa;
        }
    }

    // All movement functions. They will check for obstructions before allowing the move.
    moveUp() {
        this.curr_image = this.image_up;

        const futurePos = this.copyPosition();  // Get new copy -- don't try to edit existing!
        futurePos.upperLeft.y -= this.movement_speed;
        futurePos.upperRight.y -= this.movement_speed;
        if (!background.pxPosHitsBoundary(futurePos.upperLeft) && !background.pxPosHitsBoundary(futurePos.upperRight)) {
            futurePos.lowerRight.y -= this.movement_speed;
            futurePos.lowerLeft.y -= this.movement_speed;
            this.curr_position = futurePos;
            return true;
        }
        else return false;
    }
    moveRight() {
        this.curr_image = this.image_right;

        const futurePos = this.copyPosition();  // Get new copy -- don't try to edit existing!
        futurePos.upperRight.x += this.movement_speed;
        futurePos.lowerRight.x += this.movement_speed;
        if (!background.pxPosHitsBoundary(futurePos.upperRight) && !background.pxPosHitsBoundary(futurePos.lowerRight)) {
            futurePos.upperLeft.x += this.movement_speed;
            futurePos.lowerLeft.x += this.movement_speed;
            this.curr_position = futurePos;
            return true;
        }
        else return false;
    }
    moveDown() {
        this.curr_image = this.image_down;

        const futurePos = this.copyPosition();  // Get new copy -- don't try to edit existing!
        futurePos.lowerRight.y += this.movement_speed;
        futurePos.lowerLeft.y += this.movement_speed;
        if (!background.pxPosHitsBoundary(futurePos.lowerLeft) && !background.pxPosHitsBoundary(futurePos.lowerRight)) {
            futurePos.upperLeft.y += this.movement_speed;
            futurePos.upperRight.y += this.movement_speed;
            this.curr_position = futurePos;
            return true;
        }
        else return false;
    }
    moveLeft() {
        this.curr_image = this.image_left;

        const futurePos = this.copyPosition();  // Get new copy -- don't try to edit existing!
        futurePos.upperLeft.x -= this.movement_speed;
        futurePos.lowerLeft.x -= this.movement_speed;
        if (!background.pxPosHitsBoundary(futurePos.upperLeft) && !background.pxPosHitsBoundary(futurePos.lowerLeft)) {
            futurePos.upperRight.x -= this.movement_speed;
            futurePos.lowerRight.x -= this.movement_speed;
            this.curr_position = futurePos;
            return true;
        }
        else return false;
    }

    // Mainly for NPC Characters.
    randomMove() {
        if (this.move_queue.length <= 0) {
            const currSeconds = Math.floor(new Date().getTime() / 1000);
            if (currSeconds >= this.prev_activity_secs + this.activity_tick_secs) {  // Only add a new movement every thisActivitySeconds (rather than every frame).
                const shouldMove = (Math.random() * this.move_amt) < this.activity_adj;
                if (shouldMove) {
                    this.move_queue = new Array(10).fill(Math.floor(Math.random() * 4));
                }
                this.prev_activity_secs = currSeconds;
            }
        }

        if (this.move_queue.length > 0) {
            const direction = this.move_queue.pop();

            if (direction == 0) this.moveUp();
            else if (direction == 1) this.moveRight();
            else if (direction == 2) this.moveDown();
            else if (direction == 3) this.moveLeft();

            this.animate();
        }
    }

    // Returns an object with each of the corners, relative to the background, from the camera position.
    copyPosition() {
        const new_position = JSON.parse(JSON.stringify(this.curr_position));  // ICK! Quick deep copy.
        return new_position;
    }

    // Given a pixel x,y coordinate relative to the background, set this character to that x,y.
    setPosOnBackground(inX, inY) {
        const upperLeftX = inX;
        const upperLeftY = inY;

        this.curr_position = {
            upperLeft: {
                x: upperLeftX,
                y: upperLeftY,
            },
            upperRight: {
                x: upperLeftX + this.sprite_width,
                y: upperLeftY,
            },
            lowerRight: {
                x: upperLeftX + this.sprite_width,
                y: upperLeftY + this.sprite_height,
            },
            lowerLeft: {
                x: upperLeftX,
                y: upperLeftY + this.sprite_height,
            },
        };

        return this.curr_position;
    }

    draw() {
        c.drawImage(
            this.curr_image,
            this.sprite_frames.current * this.sprite_width,
            0,
            this.sprite_width,
            this.sprite_height,
            0 - camera.x_offset + this.curr_position.upperLeft.x,
            0 - camera.y_offset + this.curr_position.upperLeft.y,
            this.sprite_width,
            this.sprite_height
        );
    }

    // Makes the Character properly advance through the "walking" animation.
    animate() {
        this.sprite_frames.total_frames_elapsed++;
        if (this.sprite_frames.total_frames_elapsed % this.sprite_frames.hold == 0) {  // Skips frames to slow down animation.
            this.sprite_frames.current = (this.sprite_frames.current + 1) % this.sprite_frames.max;
        }
    }

    // Draws a box around the Character. Mainly for debugging.
    drawBorder() {
        c.beginPath();
        c.fillStyle = "rgba(0, 0, 0, 0.5)";
        c.strokeRect(
            0 - camera.x_offset + this.curr_position.upperLeft.x,
            0 - camera.y_offset + this.curr_position.upperLeft.y,
            this.sprite_width,
            this.sprite_height
        );
        // c.globalCompositeOperation = 'destination-over';
    }

}