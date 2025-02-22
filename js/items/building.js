class Building {
    constructor(poly, heightCoeff = 0.22) {
        this.base = poly;
        this.heightCoeff = heightCoeff;
    }

    static load(info) {
        return new Building(Polygon.load(info.base), info.height);
    }

    draw(ctx, viewPoint) {
        const topPoints = this.base.points.map(p => 
            add(p, scale(subtract(p, viewPoint), this.heightCoeff))
        );
        const ceiling = new Polygon(topPoints);

        const sides = [];

        for (let i = 0; i < this.base.points.length; i++) {
            const nextI = (i + 1) % this.base.points.length;
            const poly = new Polygon([
                this.base.points[i], this.base.points[nextI],
                topPoints[nextI], topPoints[i]
             ]);

             sides.push(poly);
        }

        sides.sort(
            (a, b) => b.distanceToPoint(viewPoint) - 
            a.distanceToPoint(viewPoint)
        );

        this.base.draw(ctx, { fill: 'white', stroke: '#AAA' });

        for (const side of sides) {
            side.draw(ctx, { fill: 'white', stroke: '#AAA' });

        }

        ceiling.draw(ctx, { fill: 'white', stroke: '#AAA' });
    }
}