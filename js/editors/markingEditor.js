class MarkingEditor {
    constructor(viewport, world, targetSegments) {
        this.viewport = viewport;

        this.canvas = viewport.canvas;

        this.world = world;

        this.ctx = this.canvas.getContext('2d');

        this.mouse = null;

        this.intent = null;

        this.targetSegments = targetSegments;

        this.markings = world.markings;
    }

    createMarking(center, directionVector) {
        return center;
    }

    enable() {
        this._addEventListeners();
    }

    disable() {
        this._removeEventListeners();
    }

    _addEventListeners() {
        this.boundMouseDown = this._handleMouseDown.bind(this);
        this.boundMouseMove = this._handleMouseMove.bind(this);

        this.boundContextMenu = e => e.preventDefault();

        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mouseup', this.boundMouseUp);

        this.canvas.addEventListener('contextmenu', this.boundContextMenu);
    }

    _removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);

        this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
    }

    _handleMouseMove(e) {
        this.mouse = this.viewport.getMouse(e, true);

        const seg = getNearestSegment(
            this.mouse,
            this.targetSegments,
            10 * this.viewport.zoom
        );

        if (seg) {
            const proj = seg.projectPoint(this.mouse);

            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = this.createMarking(proj.point, seg.directionVector());
            } else {
                this.intent = null;
            }
        } else {
            this.intent = null;
        }
    }

    _handleMouseDown(e) {
        if (e.button === 0) {
            if (this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        }

        if (e.button === 2) {
            for (let i = 0; i < this.markings.length; i++) {
                const poly = this.markings[i].poly;

                if (poly.containsPoint(this.mouse)) {
                    this.markings.splice(i, 1);
                    return;
                }
            }
        }
    }

    display() {
        if (this.intent) {
            this.intent.draw(this.ctx);
        }
    }
}