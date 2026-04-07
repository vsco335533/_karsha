/**
 * Calculate area in acres using the Shoelace formula and a conversion factor
 * for square degrees to acres (tuned for South India ~18N).
 */
export const calcArea = (points) => {
    if (!points || points.length < 3) return "0.0";

    // Sort points by angle from centroid to ensure the shoelace formula works
    const cx = points.reduce((s, p) => s + (p.lat || p[0]), 0) / points.length;
    const cy = points.reduce((s, p) => s + (p.lng || p[1]), 0) / points.length;

    const normalizedPoints = points.map(p => ({
        x: p.lat || p[0],
        y: p.lng || p[1]
    }));

    const sorted = [...normalizedPoints].sort((a, b) =>
        Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx)
    );

    let area = 0;
    for (let i = 0; i < sorted.length; i++) {
        let j = (i + 1) % sorted.length;
        area += sorted[i].x * sorted[j].y;
        area -= sorted[j].x * sorted[i].y;
    }

    // Conversion factor for sq-degrees to acres in South India (~18N)
    const sqDegreeToAcres = 2900000;
    const result = (Math.abs(area) / 2) * sqDegreeToAcres;

    return result.toFixed(1);
};

export const formatCoordinates = (points) => {
    return points.map(p => [p.lat || p[0], p.lng || p[1]]);
};
