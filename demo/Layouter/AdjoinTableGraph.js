SV.registerLayout('AdjoinTableGraph', {

    sourcesPreprocess(sources, options, group) {
        
        // let dataLength = sources.length;
        // let tableHeadNodes = [];
        // let nodeMap = {};
        // let i;


        // for (i = 0; i < dataLength; i++) {
        //     let graphNode = sources[i];

        //     tableHeadNodes.push({
        //         id: `table-head-node-${i}`,
        //         type: 'tableHeadNode',
        //         data: graphNode.id
        //     });

        //     nodeMap[graphNode.id] = {
        //         node: graphNode,
        //         order: i,
        //         neighbor: []
        //     };
        // }

        // Object.keys(nodeMap).map(key => {
        //     let nodeData = nodeMap[key],
        //         neighbor = nodeData.node.neighbor;

        //     if (neighbor === undefined) {
        //         return;
        //     }

        //     neighbor.forEach((item, index) => {
        //         let targetNodeData = nodeMap[item];

        //         nodeData.neighbor.push({
        //             id: `${key}-table-node-${item}`,
        //             type: 'tableNode',
        //             data: item.toString(),
        //             order: targetNodeData.order
        //         });

        //         targetNodeData.neighbor.push({
        //             id: `${item}-table-node-${key}`,
        //             type: 'tableNode',
        //             data: key.toString(),
        //             order: nodeData.order
        //         });
        //     });

        //     Object.keys(nodeMap).map(key => {
        //         let nodeData = nodeMap[key],
        //             neighbor = nodeData.neighbor;

        //         if (neighbor === undefined) {
        //             return;
        //         }

        //         neighbor.sort((n1, n2) => {
        //             return n1.order - n2.order;
        //         });

        //         for (let i = 0; i < neighbor.length; i++) {
        //             if (neighbor[i + 1]) {
        //                 neighbor[i].next = `tableNode#${neighbor[i + 1].id}`;
        //             }
        //         }
        //     });

        //     tableHeadNodes.forEach(item => {
        //         let nodeData = nodeMap[item.data],
        //             neighbor = nodeData.neighbor;

        //         if (neighbor.length) {
        //             item.headNext = `tableNode#${neighbor[0].id}`;
        //         }
        //     });
        // });

        // sources.push(...tableHeadNodes);
        // Object.keys(nodeMap).map(key => {
        //     let nodeData = nodeMap[key],
        //         neighbor = nodeData.neighbor;

        //     sources.push(...neighbor);
        // });

        // return sources;
    },

    defineOptions() {
        return {
            element: {
                default: {
                    type: 'circle',
                    label: '[id]',
                    size: 40,
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3'
                    }
                },
                tableHeadNode: {
                    type: 'two-cell-node',
                    label: '[data]',
                    size: [70, 40],
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3'
                    }
                },
                tableNode: {
                    type: 'link-list-node',
                    label: '[data]',
                    size: [60, 30],
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3'
                    }
                }
            },
            link: {
                neighbor: {
                    style: {
                        stroke: '#333'
                    }
                },
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
                radius: 150,
                interval: 250,
                xInterval: 50,
                yInterval: 50
            },
            behavior: {
                dragNode: ['default', 'tableNode']
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
        let nodes = elements.filter(item => item.type === 'default'),
            tableHeadNode = elements.filter(item => item.type === 'tableHeadNode'),
            nodeLength = nodes.length,
            { radius } = layoutOptions,
            intervalAngle = 2 * Math.PI / nodes.length,
            i;

        for (i = 0; i < nodeLength; i++) {
            let [x, y] = Vector.rotation(-intervalAngle * i, [0, -radius]);

            nodes[i].set({ x, y });
        }

        const tableY = -radius,
            tableX = radius + 20;

        for (i = 0; i < tableHeadNode.length; i++) {
            let node = tableHeadNode[i],
                height = node.get('size')[1];

            node.set({
                x: tableX,
                y: tableY + node.get('y') + i * height
            });

            if (node.headNext) {
                let y = node.get('y') + height - node.headNext.get('size')[1],
                    x = tableX + layoutOptions.xInterval * 2.5;

                node.headNext.set({ x, y });
                this.layoutItem(node.headNext, null, layoutOptions);
            }
        }

    }
});