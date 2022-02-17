


SV.registerLayout('PCTree', {

    sourcesPreprocess(sources) {
        
        sources[0].rootLabel = ['data', 'parent', 'firstChild'];

        return sources;
    },

    defineOptions() {
        return {
            node: {
                PCTreeHead: {
                    type: 'three-cell',
                    label: ['[data]','[parent]'],
                    size: [210, 33],
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3'
                    }
                },
                PCTreeNode: {
                    type: 'link-list-node',
                    label: '[data]',
                    size: [60, 27],
                    style: {
                        stroke: '#333',
                        fill: '#00AF92'
                    }
                }
            },
            link: {
                headNext: { 
                    sourceAnchor: 1,
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
                next: {
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
                }
            },
            layout: {
                xInterval: 50
            },
            behavior: {
                dragNode: ['PCTreeNode']
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
        let headNode = elements.filter(item => item.type === 'PCTreeHead'),
            i;

        for(i = 0; i < headNode.length; i++) {
            let node = headNode[i],
                height = node.get('size')[1],
                width = node.get('size')[0];

            node.set({
                x:  0,
                y:  i * height
            });

            if(node.headNext) {
                let y = node.get('y') + height - node.headNext.get('size')[1],
                    x = width + layoutOptions.xInterval * 3;

                node.headNext.set({ x, y });
                this.layoutItem(node.headNext, null, layoutOptions);
            }
        }
    }
});



