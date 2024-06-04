class Viewport {
    constructor(canvas,zoom = 1, offset = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.zoom = zoom;

        this.center = new Point(canvas.width / 2, canvas.height / 2);

        this.offset = offset ? offset : scale(this.center, -1);

        this.drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false
        };

        this._addEventListeners();
    }

    getMouse(e, subtractDragOffset = false) {
        const p = new Point(
            (e.offsetX - this.center.x) * this.zoom - this.offset.x,
            (e.offsetY - this.center.y) * this.zoom - this.offset.y
        );

        return subtractDragOffset ? subtract(p, this.drag.offset) : p;
    }

    getOffset() {
        return add(this.offset, this.drag.offset);
    }

    reset() {
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.center.x, this.center.y);
        this.ctx.scale(1 / this.zoom, 1 / this.zoom);
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y);
    }

    _addEventListeners() {
        this.canvas.addEventListener('mousewheel', this._handleMouseWheel.bind(this));
        this.canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this._handleMouseUp.bind(this));
    }

    _handleMouseDown(e) {
        if (e.button === 1) {
            this.drag.start = this.getMouse(e);
            this.drag.active = true;
        }
    }

    _handleMouseMove(e) {
        if (this.drag.active) {
            this.drag.end = this.getMouse(e);
            this.drag.offset = subtract(this.drag.end, this.drag.start);
        }
    }

    _handleMouseUp(e) {
        if (this.drag.active) {
            this.offset = add(this.offset, this.drag.offset);
            this.drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false
            };
        }
    }

    _handleMouseWheel(e) {
        const dir = Math.sign(e.deltaY);
        const step = 0.1;

        this.zoom += dir * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom));
    }
}