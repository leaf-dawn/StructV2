import * as G6 from "../Lib/g6.js";


export default G6.registerNode('clen-queue-pointer', {
    draw(cfg, group) {
        // console.log(cfg);
        const index = cfg.id.split('-')[1];
        const len = cfg.id.split('-')[2];
        const keyShape = group.addShape('path', {
            attrs: {
                x: 0,
                y: 0,
                path: this.getPath(cfg),
                fill: cfg.style.fill,
                // matrix: cfg.style.matrix
            },
            name: 'pointer-path'
        });
        const angle = index *  Math.PI * 2 / len;
        if (cfg.label) {
            const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            
            const bgRect = group.addShape('rect', {
                attrs: {
                    x: 0, 
                    y: 0,
                    width: 0,
                    height: 0,
                    text: cfg.label,
                    fill: null,
                    radius: 2
                },
                name: 'bgRect'
            });
            let pointerText = cfg.label.split('-')[0];
            let y = pointerText=="front"?30:15;
            const text = group.addShape('text', {
                attrs: {
                    x: culcuRotate(Math.PI/2 - angle, y).offsetX, 
                    y: culcuRotate(Math.PI/2 - angle, y).offsetY,
                    // x: 0, 
                    // y: 0,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: pointerText,
                    fill: style.fill || '#999',
                    fontSize: style.fontSize || 16
                },
                name: 'pointer-text-shape'
            });

            // rotate(text, angle, G6.Util.transform);
            translate(text, 0, -75, G6.Util.transform);
        }
        rotate(keyShape, angle, G6.Util.transform);
        translate(keyShape, 0, -75, G6.Util.transform);

        return keyShape;

        
    },
    
    getPath(cfg) {
        let width = 1,
            height = 38,
            arrowWidth = width + 4,
            arrowHeight = height * 0.3;

        const path = [
            ['M', 0, 0], 
            ['L', -width / 2, 0],
            ['L', -width / 2, -height],
            ['L', -width / 2 - (arrowWidth / 2), -height],
            ['L', 0, -height-arrowHeight],
            ['L', width / 2 + (arrowWidth / 2), -height],
            ['L', width / 2, -height],
            ['L', width / 2, 0],
            ['Z'], 
        ];

        return path;
    },

});

        
function rotate(shape, angle, transform) {
    const matrix1 = shape.getMatrix();
    const newMatrix1 = transform(matrix1, [
        ['r', angle],
    ]);
    shape.setMatrix(newMatrix1);
}
function translate(shape, x, y, transform) {
    const matrix1 = shape.getMatrix();
    const newMatrix1 = transform(matrix1, [
        ['t', x, y],
    ]);
    shape.setMatrix(newMatrix1);
}
function culcuRotate(angle, R) {
    let offsetX = Math.cos(angle) * R;
    let offsetY = -Math.sin(angle) * R;
    console.log(offsetX, offsetY, R);
    return {
        offsetX,
        offsetY,
    }
}