import { registerNode } from '@antv/g6';


export default registerNode('tri-tree-node', {
    draw(cfg, group) {
        cfg.size = cfg.size;

        const width = cfg.size[0],
              height = cfg.size[1];

        const wrapperRect = group.addShape('rect', {
            attrs: {
                x: width / 2,
                y: height / 2,
                width: width,
                height: height,
                stroke: cfg.style.stroke || '#333',
                cursor: cfg.style.cursor,
                fill: '#eee'
            },
            name: 'wrapper'
        });

        group.addShape('rect', {
            attrs: {
                x: width / 4 + width / 2,
                y: height / 2,
                width: width / 2,
                height: height / 4,
                fill: '#eee',
                stroke: cfg.style.stroke || '#333',
                cursor: cfg.style.cursor
            },
            name: 'top',
            draggable: true
        });

        group.addShape('rect', {
            attrs: {
                x: width / 4 + width / 2,
                y: height / 2 + height / 4,
                width: width / 2,
                height: height / 4 * 3,
                fill: cfg.color || cfg.style.fill,
                stroke: cfg.style.stroke || '#333',
                cursor: cfg.style.cursor
            },
            name: 'bottom',
            draggable: true
        });

        if (cfg.label) {
            const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            group.addShape('text', {
                attrs: {
                    x: width, // 居中
                    y: height + height / 8,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: cfg.label,
                    fill: style.fill || '#000',
                    fontSize: style.fontSize || 16,
                    cursor: cfg.style.cursor
                },
                name: 'text',
                draggable: true
            });
        }

        if (cfg.root) {
            const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            group.addShape('text', {
                attrs: {
                    x: width, // 居中
                    y: height / 4 * 3,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: "^",
                    fill: style.fill || '#000',
                    fontSize: style.fontSize || 14,
                    cursor: cfg.style.cursor
                },
                name: 'parent',
                draggable: true
            });
        }

        return wrapperRect;
    },

    getAnchorPoints() {
        return [
            [0.125, 0.5],
            [0.875, 0.5],
            [0.5, 1],
            [0.5, 0],
            [0.5, 0.125]
        ];
    },
});