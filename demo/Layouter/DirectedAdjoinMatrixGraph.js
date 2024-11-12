const isNeighborDAM = function(itemA, itemB) {
    let neighborA = itemA.neighbor,
        neighborB = itemB.neighbor;

    if (neighborA === undefined && neighborB === undefined) {
        return false;
    }

    if (neighborA && neighborA.includes(itemB.id)) {
        return true;
    }

    return false;
}

SV.registerLayout('DirectedAdjoinMatrixGraph', {
    sourcesPreprocess(sources) {
        let dataLength = sources.length;
        let matrixNodeLength = dataLength * dataLength;
        let matrixNodes = [];
        let i, j;

        for (i = 0; i < matrixNodeLength; i++) {
            matrixNodes.push({
                id: `mn-${i}`,
                type: 'matrixNode',
                indexTop: i < dataLength ? sources[i].data : undefined,
                indexLeft: i % dataLength === 0 ? sources[i / dataLength].data : undefined,
                data: 0
            });
        }

        for (i = 0; i < dataLength; i++) {
            for (j = 0; j < dataLength; j++) {
                let itemI = sources[i],
                    itemJ = sources[j];

                if (itemI.id !== itemJ.id && isNeighborDAM(itemI, itemJ)) {
                    matrixNodes[i * dataLength + j].data = 1;
                }
            }
        }

        sources.push(...matrixNodes);

        return sources;
    },

    defineOptions() {
        return {
            node: {
                default: {
                    type: 'circle',
                    size: 40,
                    label: '[data]',
                    style: {
                        fill: '#95e1d3',
                        stroke: '#333',
                        cursor: 'pointer',
                        backgroundFill: '#ddd'
                    },
                    labelOptions: {
                        style: { fontSize: 16 }
                    }
                },
                matrixNode: {
                    type: 'array-node',
                    size: [40, 40],
                    label: '[data]',
                    style: {
                        fill: '#95e1d3',
                        stroke: '#333',
                        cursor: 'pointer',
                        backgroundFill: '#ddd'
                    },
                    labelOptions: {
                        style: { fontSize: 16 }
                    }
                }
            },
            link: {
                neighbor: {
                    type: 'line',
                    style: {
                        endArrow: 'default',
                        lineAppendWidth: 10,
                        lineWidth: 1.6,
                        stroke: '#333',
                    }
                }
            },
            indexLabel: {
                indexTop: {
                    position: 'top',
                    style: {
                        fill: '#bbb'
                    }
                },
                indexLeft: {
                    position: 'left',
                    style: {
                        fill: '#bbb'
                    }
                }
            },
            layout: {
                radius: 150,
                interval: 250
            },
            behavior: {
                dragNode: ['default']
            }
        };
    },
    layout(elements, layoutOptions) {
        let nodes = elements.filter(item => item.type === 'default'),
            matrixNodes = elements.filter(item => item.type === 'matrixNode'),
            nodeLength = nodes.length,
            matrixNodeLength = matrixNodes.length,
            { interval, radius } = layoutOptions,
            intervalAngle = 2 * Math.PI / nodes.length,
            matrixNodeSize = matrixNodes[0].get('size')[0],
            i;

        const matrixY = -radius,
            matrixX = interval;

        for (i = 0; i < nodeLength; i++) {
            let [x, y] = Vector.rotation(-intervalAngle * i, [0, -radius]);

            nodes[i].set({ x, y });
        }

        for (i = 0; i < matrixNodeLength; i++) {
            let x = matrixX + (i % nodeLength) * matrixNodeSize,
                y = matrixY + Math.floor(i / nodeLength) * matrixNodeSize;

            matrixNodes[i].set({ x, y });
        }
    }
});