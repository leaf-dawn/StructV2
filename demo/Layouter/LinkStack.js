

/**
 * 单链表
 */
 SV.registerLayout('LinkStack', {
    sourcesPreprocess(sources) {
        const headNode = sources[0];

        if(headNode.external) {
            headNode.headExternal = headNode.external;
            delete headNode.external;
        }

        return sources;
    },

    defineOptions() {
        return {
            element: { 
                default: {
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
                next: { 
                    type: 'line',
                    sourceAnchor: 2,
                    targetAnchor: 4,
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
                headExternal: {
                    anchor: 5,
                    type: 'pointer',
                    offset: 8,
                    style: {
                        fill: '#f08a5d'
                    }
                },
                external: {
                    anchor: 3,
                    type: 'pointer',
                    offset: 8,
                    style: {
                        fill: '#f08a5d'
                    }
                }
            },
            layout: {
                yInterval: 30
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

        let height = node.get('size')[1];

        if(prev && node.isSameGroup(prev)) {
            node.set('x', prev.get('x'));
            node.set('y', prev.get('y') - layoutOptions.yInterval - height);
        }

        if(node.next) {
            this.layoutItem(node.next, node, layoutOptions);
        }
    },


    layout(elements, layoutOptions) {
        this.layoutItem(elements[0], null, layoutOptions);
    }
}) 





