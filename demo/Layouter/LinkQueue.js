



SV.registerLayout('LinkQueue', {

    defineOptions() {
        return {
            element: { 
                head: {
                    type: 'rect',
                    label: '[label]',
                    size: [60, 40],
                    anchorPoints: [
                        [0.5, 0],
                        [1, 0.5],
                        [0.5, 1],
                        [0, 0.5]
                    ],
                    style: {
                        stroke: '#333',
                        fill: null
                    }
                },
                node: {
                    type: 'link-list-node',
                    label: '[data]',
                    size: [60, 30],
                    style: {
                        stroke: '#333',
                        fill: '#b83b5e'
                    }
                }
            },
            link: {
                front: {
                    type: 'polyline',
                    sourceAnchor: 1,
                    targetAnchor: 5,
                    style: {
                        stroke: '#333',
                        endArrow: {
                            path: G6.Arrow.triangle(8, 6, 0), 
                            fill: '#333'
                        }
                    }
                },
                rear: {
                    type: 'polyline',
                    sourceAnchor: 1,
                    targetAnchor: 5,
                    style: {
                        stroke: '#333',
                        endArrow: {
                            path: G6.Arrow.triangle(8, 6, 0), 
                            fill: '#333'
                        }
                    }
                },
                next: { 
                    type: 'line',
                    sourceAnchor: 2,
                    targetAnchor: 6,
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
                loopNext: {
                    type: 'quadratic',
                    curveOffset: -100,
                    sourceAnchor: 2,
                    targetAnchor: 7,
                    style: {
                        stroke: '#333',
                        endArrow: 'default',
                        startArrow: {
                            path: G6.Arrow.circle(2, -1),
                            fill: '#333'
                        }
                    }
                }
            },
            marker: {
                external: {
                    type: 'pointer',
                    offset: 8,
                    style: {
                        fill: '#f08a5d'
                    }
                }
            },
            layout: {
                xInterval: 50,
                yInterval: 58
            },
            behavior: {
                dragNode: ['node']
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
            return null;
        }

        let width = node.get('size')[0];

        if(prev) {
            node.set('y', prev.get('y'));
            node.set('x', prev.get('x') + layoutOptions.xInterval + width);
        }

        if(node.next) {
            this.layoutItem(node.next, node, layoutOptions);
        }
    },


    layout(elements, layoutOptions) {
        let head = elements.filter(item => item.type === 'head'),
            head1 = head[0],
            head2 = head[1],
            nodes = elements.filter(item => item.type !== 'head'),
            mainRoot = nodes.findIndex(item => item.root && head1.front === item),
            roots = nodes.filter(item => item.root),
            headHeight = head1.get('size')[1],
            nodeHeight = 0,
            x = 0, y = 0;

        if(nodes.length) {
            mainRoot = roots.splice(mainRoot, 1)[0];
            roots.unshift(mainRoot);

            x = -50;
            y = mainRoot.get('y');
            nodeHeight = mainRoot.get('size')[1];

            roots.forEach((item, index) => {
                item.set('y', -index * (nodeHeight + layoutOptions.yInterval));
                this.layoutItem(item, null, layoutOptions);
            });
        }
        
        head1.set({ x, y: y + nodeHeight * 3 });
        head2.set({ x, y: head1.get('y') + headHeight });
    }
});

