(() => {
    'use strict';
    
    let mainCanvas = document.getElementById('main');
    if (mainCanvas === null) {
        console.error('Canvas not found');
        return;
    }

    if (mainCanvas.getContext === undefined) {
        console.error('Canvas not supported');
        return;
    }
    let ctx = mainCanvas.getContext('2d');
    ctx.font = '30px serif';

    class FallingObject {
        constructor(maxX, maxY, borderWidth=100) {
            this.maxX = maxX;
            this.maxY = maxY;
            this.borderWidth = borderWidth;
            this.x = (Math.random() * 0.8 + 0.1) * maxX;
            this.y = -this.borderWidth;
            this.speedX = (Math.random() - 0.5) * 5;
            this.speedY = 0;
        }

        next() {
            this.speedY += 0.1;
            this.x += this.speedX;
            this.y += this.speedY;
        }
        
        out() {
            return this.x < -this.borderWidth || this.x > this.maxX + this.borderWidth || this.y > this.maxY + this.borderWidth;
        }

        draw(ctx) {
            throw Error('Not implemented!');
        }
    }

    class FallingText extends FallingObject {
        constructor(text, maxX, maxY) {
            super(maxX, maxY);
            this.text = text;
        }

        draw(ctx) {
            ctx.fillText(this.text, this.x, this.y);
        }
    }

    class FallingImage extends FallingObject {
        constructor(image, maxX, maxY, scale=1) {
            super(maxX, maxY);
            this.scale = scale;
            this.image = image;
        }

        draw(ctx) {
            ctx.drawImage(this.image, this.x, this.y, this.image.width * this.scale, this.image.height * this.scale);
        }
    }

    function getSampleFallingText() {
        return new FallingText('💖', mainCanvas.width, mainCanvas.height);
    }

    const getSampleFallingImage = () => {
        if (getSampleFallingImage.image === undefined) {
            let image = new Image();
            // That frisk image comes from https://www.pngitem.com/middle/iooRxxm_undertale-frisk-pixel-art-hd-png-download/
            image.src = 'frisk.png';
            getSampleFallingImage.image = image;
            console.log('Image loaded', image);
        }
        return new FallingImage(getSampleFallingImage.image, mainCanvas.width, mainCanvas.height, 0.1);
    }

    function spawnFallingObjects(fallingObjectSet) {
        let spawnCount = 1 + Math.floor(Math.random() * 2);
        console.log(fallingObjectSet);
        for (let fallingObject of fallingObjectSet) {
            if (fallingObject.out()) {
                fallingObjectSet.delete(fallingObject);
            }
        }
        for (let i = 0; i < spawnCount; i++) {
            if (Math.random() < 0.8) {
                fallingObjectSet.add(getSampleFallingText());
            } else {
                fallingObjectSet.add(getSampleFallingImage());
            }
        }
    }

    function refreshFallingObjects(fallingObjectSet) {
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        for (let fallingObject of fallingObjectSet) {
            fallingObject.next();
            // console.log('Write to (%d, %d)', fallingObject.x, fallingObject.y);
            fallingObject.draw(ctx);
        }
    }

    function run() {
        let fallingObjectSet = new Set();
        setInterval(() => spawnFallingObjects(fallingObjectSet), 200);
        setInterval(() => refreshFallingObjects(fallingObjectSet), 15);
    }

    console.log('Here we go!');
    run();
})();