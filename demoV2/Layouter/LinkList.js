

SV.registerLayouter('LinkList', {
    
    sourcesPreprocess(sources) {
        let root = sources[0];

        if(root.external) {
            root.rootExternal = root.external;
            delete root.external;
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
                        fill: '#eaffd0',
                        cursor: 'pointer'
                    }
                }
            },
            link: {
                next: { 
                    type: 'line',
                    sourceAnchor: 2,
                    targetAnchor: 6,
                    style: {
                        stroke: '#333',
                        endArrow: 'default',
                        startArrow: {
                            path: G6.Arrow.circle(2, -1), 
                            fill: '#333'
                        }
                    }
                },
                loopNext: {
                    type: 'arc',
                    curveOffset: 50,
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
                }
            },
            marker: {
                rootExternal: {
                    type: 'cursor',
                    anchor: 6,
                    offset: 8,
                    style: {
                        fill: '#f08a5d'
                    }
                },
                external: {
                    type: 'cursor',
                    anchor: 0,
                    offset: 8,
                    style: {
                        fill: '#f08a5d'
                    }
                }
            },
            layout: {
                xInterval: 50,
                yInterval: 50
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
        let root = elements[0];

        this.layoutItem(root, null, layoutOptions);
    }
});





















