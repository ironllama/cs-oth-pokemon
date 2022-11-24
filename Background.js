class Background {
    image = null;
    block_size = 60; // size of each block on the map
    map_blocks_wide = 90; // the tile width of the map
    map_blocks_high = 60;
    map_px_width = 5404;
    map_px_height = 3602;

    constructor(newSrc = null) {
        const imageElem = document.createElement('img');
        if (newSrc) imageElem.src = newSrc;
        else imageElem.src = "./assets/images/map_elements/island_town_bg.png";

        this.image = imageElem;
    }

    // Convert the pixel coordinates into tile coordinates.
    getTilePosForPxPos(inX, inY) {
        const x = Math.floor((inX / this.map_px_width) * this.map_blocks_wide);
        const y = Math.floor((inY / this.map_px_height) * this.map_blocks_high);
        return { x, y };
    }

    // Determine whether a particular pixel is inside a boundary tile.
    pxPosHitsBoundary({ x, y }) {
        const newTile = this.getTilePosForPxPos(x, y);
        const newIdx = newTile.x + (newTile.y * this.map_blocks_wide);  // Get the index for the x, y in flattened matrix format.
        if (collisions[newIdx] == 1025) return true;
        return false;
    }

    draw() {
        c.drawImage(
            this.image,
            camera.x_offset,
            camera.y_offset,
            this.map_px_width,
            this.map_px_height,
            0,
            0,
            this.map_px_width,
            this.map_px_height
        );
    }

    // To draw the boundary tiles onto the background.
    boundary_opacity = 0.5;
    drawBoundaries() {
        collisions.forEach((block, idx) => {
            if (block == 1025) {
                c.fillStyle = `rgba(255,0,0,${this.boundary_opacity})`;
                c.fillRect(
                    0 - camera.x_offset + ((idx % this.map_blocks_wide) * this.block_size),
                    0 - camera.y_offset + ((Math.floor(idx / this.map_blocks_wide)) * this.block_size),
                    this.block_size,
                    this.block_size
                );
            }
        })
    }
}