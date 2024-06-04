class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;

        this.canvas = viewport.canvas;

        this.graph = graph;

        this.ctx = this.canvas.getContext('2d');

        this.selected = null;

        this.hovered = null;

        this.dragging = false;

        this.mouse = null;
    }

    enable() {
        this._addEventListeners();
    }

    disable() {
        this._removeEventListeners();
        this.selected = false;
        this.hovered = false;
    }

    _addEventListeners() {
        this.boundMouseDown = this._handleMouseDown.bind(this);
        this.boundMouseMove = this._handleMouseMove.bind(this);
        this.boundMouseUp = () => this.dragging = false;

        this.boundContextMenu = e => e.preventDefault();

        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mouseup', this.boundMouseUp);

        this.canvas.addEventListener('contextmenu', this.boundContextMenu);
    }

    _removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('mouseup', this.boundMouseUp);

        this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
    }

    _handleMouseDown(e) {
        if (e.button === 2) {
            if (this.selected) {
                this.selected = null;
            } else if (this.hovered) {
                this._removePoint(this.hovered);
            }
        }

        if (e.button === 0) {
            if (this.hovered) {
                this._select(this.hovered);
                this.dragging = true;
                return;
            }

            this.graph.addPoint(this.mouse);

            this._select(this.mouse);

            this.hovered = this.mouse;
        }
    }

    _handleMouseMove(e) {
        this.mouse = this.viewport.getMouse(e, true);

            this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);

            if (this.dragging === true) {
                this.selected.x = this.mouse.x;
                this.selected.y = this.mouse.y;
            }
    }

    _select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }

        this.selected = point;
    }

    _removePoint(point) {
        this.graph.removePoint(point);
        this.hovered = null;

        if (this.selected === point) {
            this.selected = null;
        }
    }


    display() {
        this.graph.draw(this.ctx);

        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }

        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] });
            this.selected.draw(this.ctx, { outline: true });
        }
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }
}