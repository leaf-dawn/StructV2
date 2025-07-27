

SV.registerLayout('Link', {

    sourcesPreprocess(sources) {
        let root = sources[0];

        if (root.external) {
            root.rootExternal = root.external;
            delete root.external;
        }

        return sources;
    },

    defineOptions() {
        return {
            node: {
                default: {
                    type: 'link-list-node',
                    label: '[data]',
                    size: [60, 30],
                    labelOptions: {
                        style: { 
                            fontSize: 14,
                            fontWeight: 400,
                            fill: '#2c3e50'
                        },
                    },
                    style: {
                        stroke: '#8b5cf6',
                        strokeWidth: 1,
                        fill: '#f3e8ff',
                        cursor: 'pointer',
                        radius: 4,
                        // 悬停效果
                        hover: {
                            stroke: '#7c3aed',
                            strokeWidth: 2,
                            fill: '#ede9fe',
                        }
                    }
                }
            },
            link: {
                next: {
                    type: 'line',
                    sourceAnchor: 6,
                    targetAnchor: 4,
                    style: {
                        stroke: '#7f8c8d',
                        strokeWidth: 1,
                        lineAppendWidth: 6,
                        cursor: 'pointer',
                        endArrow: 'default',
                        preventOverlap: true, //防重叠
                        startArrow: {
                            path: G6.Arrow.circle(2, -1),
                            fill: '#7f8c8d',
                        },
                    }
                },
                pre: {
                    type: 'line',
                    sourceAnchor: 7,
                    targetAnchor: 1,
                    style: {
                        stroke: '#7f8c8d',
                        strokeWidth: 1,
                        lineAppendWidth: 6,
                        cursor: 'pointer',
                        endArrow: 'default',
                        preventOverlap: true, //防重叠
                        startArrow: {
                            path: G6.Arrow.circle(2, -1),
                            fill: '#7f8c8d',
                        },
                    }
                }
            },
            marker: {
                rootExternal: {
                    type: 'pointer',
                    anchor: 6,
                    offset: 8,
                    style: {
                        fill: '#f08a5d'
                    }
                },
                external: {
                    type: 'pointer',
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
        if (!node) {
            return null;
        }

        let width = node.get('size')[0];

        if (prev) {
            node.set('y', prev.get('y'));
            node.set('x', prev.get('x') + layoutOptions.xInterval + width);
        }

        if (node.next) {
            this.layoutItem(node.next, node, layoutOptions);
        }
    },


    layout(elements, layoutOptions) {
        let root = elements[0];
        this.layoutItem(root, null, layoutOptions);
    }
});





















