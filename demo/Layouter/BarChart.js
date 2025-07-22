SV.registerLayout('BarChart', {

    sourcesPreprocess(sources) {
        const firstElement = sources[0];

        if (firstElement.external) {
            firstElement.headExternal = firstElement.external;
            delete firstElement.external;
        }

        return sources;
    },

    defineOptions() {
        return {
            node: {
                default: {
                    type: 'bar-chart-node',
                    label: '[data]',
                    size: [40, 80], // 柱状图默认尺寸
                    labelOptions: {
                        style: { fontSize: 12 }
                    },
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3'
                    }
                }
            },
            marker: {
                headExternal: {
                    type: 'pointer',
                    offset: 50,
                    anchor: 2,
                    style: {
                        fill: '#f08a5d'
                    }
                },
                external: {
                    type: 'pointer',
                    offset: 50,
                    anchor: 2,
                    style: {
                        fill: '#f08a5d'
                    }
                }
            },
            indexLabel: {
                index: { 
                    position: 'bottom',
                    style: { fontSize: 10, fill: '#666' }
                },
                indexRight: { position: 'right' }
            },
            behavior: {
                dragNode: false
            }
        };
    },

    layout(elements) {
        let arr = elements;

        for (let i = 0; i < arr.length; i++) {
            let width = arr[i].get('size')[0];

            if (i > 0) {
                arr[i].set('x', arr[i - 1].get('x') + width + 10); // 添加间距
            }
        }
    }
});