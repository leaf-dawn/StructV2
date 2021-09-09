

SV.registerShape('three-cell-node', {
    draw(cfg, group) {
        cfg.size = cfg.size || [30, 10];

        const width = cfg.size[0],
              height = cfg.size[1];

        const wrapperRect = group.addShape('rect', {
            attrs: {
                x: width / 2,
                y: height / 2,
                width: width,
                height: height,
                stroke: cfg.style.stroke,
                fill: '#eee'
            },
            name: 'wrapper',
            draggable: true
        });

        group.addShape('rect', {
            attrs: {
                x: width / 2,
                y: height / 2,
                width: width / 3,
                height: height,
                fill: cfg.style.fill,
                stroke: cfg.style.stroke
            },
            name: 'left-rect',
            draggable: true
        });

        group.addShape('rect', {
            attrs: {
                x: width * (5 / 6),
                y: height / 2,
                width: width / 3,
                height: height,
                fill: '#eee',
                stroke: cfg.style.stroke
            },
            name: 'mid-rect',
            draggable: true
        });

        if (cfg.label) {
            const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            group.addShape('text', {
                attrs: {
                    x: width * (2 / 3), 
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
});



SV.registerLayouter('GeneralizedList', {

    defineOptions() {
        return {
            element: { 
                table: {
                    type: 'three-cell-node',
                    label: '[id]',
                    size: [90, 30],
                    style: {
                        stroke: '#333',
                        fill: '#b83b5e'
                    }
                },
                atom: {
                    type: 'two-cell-node',
                    label: ['[id]', 'dcd'],
                    size: [60, 30],
                    style: {
                        stroke: '#333',
                        fill: '#b83b5e'
                    }
                }
            },
            link: {
                loopSub: {},
                loopNext: {
                    type: 'quadratic',
                    curveOffset: -50,
                    sourceAnchor: 2,
                    targetAnchor: 4,
                    style: {
                        stroke: '#333',
                        endArrow: 'default',
                        startArrow: {
                            path: G6.Arrow.circle(2, -1), 
                            fill: '#333'
                        }
                    }
                },
                sub: {
                    type: 'line',
                    sourceAnchor: 2,
                    targetAnchor: 0,
                    style: {
                        stroke: '#333',
                        endArrow: {
                            path: G6.Arrow.triangle(8, 6, 0), 
                            fill: '#333'
                        },
                        startArrow: {
                            path: G6.Arrow.circle(2, -1), 
                            fill: '#333'
                        }
                    }
                },
                next: { 
                    type: 'line',
                    sourceAnchor: 3,
                    targetAnchor: 5,
                    style: {
                        stroke: '#333',
                        endArrow: {
                            path: G6.Arrow.triangle(8, 6, 0), 
                            fill: '#333'
                        },
                        startArrow: {
                            path: G6.Arrow.circle(2, -1), 
                            fill: '#333'
                        }
                    }
                }
            },
            layout: {
                xInterval: 40,
                yInterval: 20,
            }
        };
    },

    /**
     * 对子树进行递归布局
     * @param node 
     * @param parent 
     */
    layoutItem(node, prev, layoutOptions) {
        if(!node) {
            return;
        }

        let [width, height] = node.get('size');

        if(prev) {
            node.set('y', prev.get('y'));
            node.set('x', prev.get('x') + layoutOptions.xInterval + width)
        }

        if(node.next) {
            this.layoutItem(node.next, node, layoutOptions);
        }

        // 存在子节点
        if(node.sub) {
            node.sub.set('y', node.get('y') + layoutOptions.yInterval + height);
            
            // 子结点还是广义表
            if(node.sub.tag === 1) {
                node.sub.set('x', node.get('x') + width / 3);
                this.layoutItem(node.sub, null, layoutOptions);
            }
            else {
                let subWidth = node.sub.get('size')[0];
                node.sub.set('x', node.get('x') + width - subWidth);
            }
        }
    },   

    layout(elements, layoutOptions) {
        let tableNodes = elements.filter(item => item.type === 'table'),
            tableRootNode = tableNodes.filter(item => item.root)[0];
            
        this.layoutItem(tableRootNode, null, layoutOptions);
    }
}) 
