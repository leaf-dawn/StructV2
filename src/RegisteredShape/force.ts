import { Util } from "../Common/util";


export default Util.registerShape('force-node', {
    draw(cfg, group) {
        // cfg.size = cfg.size;
        const size = 15;

        const wrapperRect = group.addShape('circle', {
            attrs: {
                r: size,
                stroke: 'rgb(35, 120, 180)',
                // cursor: cfg.style.cursor,
                fill: 'rgb(31, 119, 180)'
            },
            name: 'wrapper'
        });

        if (cfg.label) {
            const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            group.addShape('text', {
                attrs: {
                    x: 0, // 居中
                    y: 0,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: cfg.label,
                    fill: style.fill || '#000',
                    fontSize: style.fontSize || 10,
                    cursor: cfg.style.cursor
                },
                name: 'text',
                draggable: true
            });
        }

        return wrapperRect;
    },
    
    getAnchorPoints() {
        return [
            [0.5, 0.5],
            [0, 0.5],
            [1, 0]
        ];
    }
}, 'rect');