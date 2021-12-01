
const isNeighbor = function (itemA, itemB) {
    let neighborA = itemA.neighbor,
        neighborB = itemB.neighbor;

    if (neighborA === undefined && neighborB === undefined) {
        return false;
    }

    if (neighborA && neighborA.includes(itemB.id)) {
        return true;
    }

    if (neighborB && neighborB.includes(itemA.id)) {
        return true;
    }

    return false;
}


SV.registerLayout('AdjoinMatrixGraph', {

    sourcesPreprocess(sources) {
        let dataLength = sources.length;
        let matrixNodeLength = dataLength * dataLength;
        let matrixNodes = [];
        let i, j;

        for (i = 0; i < matrixNodeLength; i++) {
            matrixNodes.push({
                id: `mn-${i}`,
                type: 'matrixNode',
                indexTop: i < dataLength ? sources[i].id : undefined,
                indexLeft: i % dataLength === 0?  sources[i / dataLength].id : undefined,
                data: 0
            });
        }

        for (i = 0; i < dataLength; i++) {
            for (j = 0; j < dataLength; j++) {
                let itemI = sources[i],
                    itemJ = sources[j];

                if (itemI.id !== itemJ.id && isNeighbor(itemI, itemJ)) {
                    matrixNodes[i * dataLength + j].data = 1;
                }
            }
        }

        sources.push(...matrixNodes);

        return sources;
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
                matrixNode: {
                    type: 'indexed-node',
                    label: '[data]',
                    size: [40, 40],
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3'
                    },
                    indexOptions: {
                        indexTop: { position: 'top' },
                        indexLeft: { position: 'left' }
                    }
                }
            },
            link: {
                neighbor: {
                    style: {
                        stroke: '#333'
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
            let x = matrixX + (i % nodeLength) * matrixNodeSize;
                y = matrixY + Math.floor(i / nodeLength) * matrixNodeSize;

            matrixNodes[i].set({ x, y });
        }
    }
});



