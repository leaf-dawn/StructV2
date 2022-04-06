


SV.registerLayout('SqQueue', {
    defineOptions() {
        return {
            node: {
                head: {
                    type: 'rect',
                    anchorPoints: [
                        [0.5, 0],
                        [1, 0.5],
                        [0.5, 1],
                        [0, 0.5]
                    ],
                    size: [60, 30],
                    label: '[data]',
                    style: {
                        fill: '#95e1d3',
                        stroke: "#333",
                        cursor: 'pointer'
                    },
                },
                node: {
                    type: 'indexed-node',
                    size: [60, 30],
                    label: '[data]',
                    style: {
                        fill: '#95e1d3',
                        stroke: "#333",
                        cursor: 'pointer'
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
                        endArrow: 'default'
                    }
                },
                rear: {
                    type: 'polyline',
                    sourceAnchor: 1,
                    targetAnchor: 5,
                    style: {
                        stroke: '#333',
                        endArrow: 'default'
                    }
                }
            },
            marker: {
                external: {
                    type: 'pointer',
                    anchor: 0,
                    offset: 8,
                    labelOffset: 2,
                    style: {
                        fill: '#f08a5d'
                    }
                },
                cursor: {
                    type: 'cursor',
                    anchor: 0,
                    offset: 8,
                    labelOffset: 2,
                    style: {
                        fill: '#f08a5d'
                    }
                }
            }
        };
    },


    layout(elements) {
        let head = elements.filter(item => item.type === 'head'),
            head1 = head[0],
            head2 = head[1],
            nodes = elements.filter(item => item.type !== 'head'),
            headHeight = head1.get('size')[1],
            headWidth = head1.get('size')[0],
            nodeHeight = 0,
            x = 0, y = 0;

        if (nodes.length) {
            let firstNode = nodes[0];
            nodeHeight = firstNode.get('size')[1];
            x = -50;
            y = firstNode.get('y');

            for (let i = 1; i < nodes.length; i++) {
                let width = nodes[i].get('size')[0];
                nodes[i].set('x', nodes[i - 1].get('x') + width);

                if (nodes[i].empty) {
                    nodes[i].set('style', {
                        fill: null
                    });
                }
            }
        }


        head1.set({ x, y: y + nodeHeight * 3 });

        if (nodes.length) {
            head2.set({ x, y: head1.get('y') + headHeight });
        }
        else {
            head2.set({ x: x + headWidth, y });
        }
    }
});



