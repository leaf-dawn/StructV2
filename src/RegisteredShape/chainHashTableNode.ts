import { Util } from '../Common/util';
export default Util.registerShape(
    'chain-hashtable-node',
    {
        draw(cfg, group) {
            cfg.size = cfg.size || [30, 30];
    
            const width = cfg.size[0],
                height = cfg.size[1];
    
            const wrapperRect = group.addShape('rect', {
                attrs: {
                    x: width / 2,
                    y: height / 2,
                    width: width,
                    height: height,
                    stroke: cfg.style.stroke,
                    fill: cfg.style.backgroundFill || '#eee'
                },
                name: 'wrapper',
                draggable: true
            });
    
            const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            
            if (cfg.label) {
                group.addShape('text', {
                    attrs: {
                        x: width,
                        y: height,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        text: cfg.label,
                        fill: style.fill || '#000',
                        fontSize: style.fontSize || 16
                    },
                    name: 'text',
                    draggable: true
                });
            }

            //节点没有后续指针时
			if (!cfg.next && !cfg.loopNext) {
				group.addShape('text', {
					attrs: {
						x: width,
                        y: height,
						textAlign: 'center',
						textBaseline: 'middle',
						text: '^',
						fill: style.fill || '#000',
						fontSize: 16,
						cursor: cfg.style.cursor,
					},
					name: 'text',
					draggable: true,
				});
			}
    
            return wrapperRect;
        },

        getAnchorPoints() {
            return [
                [1 / 6, 0],
                [0.5, 0],
                [0.5, 0.5],
                [5 / 6, 0.5],
                [0.5, 1],
                [0, 0.5]
            ];
        }
    }
)