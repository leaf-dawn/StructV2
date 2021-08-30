


SV.registerLayouter('Array', {

    sourcesPreprocess(sources) {
        const firstElement = sources[0];

        if(firstElement.external) {
            firstElement.headExternal = firstElement.external;
            delete firstElement.external;
        }

        return sources;
    },

    defineOptions() {
        return {
            element: { 
                default: {
                    type: 'indexed-node',
                    label: '[id]',
                    size: [60, 30],
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3'
                    },
                    indexOptions: {
                        index: { position: 'bottom' },
                        indexTop: { position: 'top' }
                    }
                }
            },
            marker: {
                headExternal: {
                    type: 'pointer',
                    anchor: 3,
                    style: {
                        fill: '#f08a5d'
                    }
                },
                external: {
                    type: 'pointer',
                    anchor: 0,
                    style: {
                        fill: '#f08a5d'
                    }
                }
            },
            behavior: {
                dragNode: false
            }
        };
    },

    layout(elements) {
        let arr = elements;

        for(let i = 0; i < arr.length; i++) {
            let width = arr[i].get('size')[0];

            if(i > 0) {
                arr[i].set('x', arr[i - 1].get('x') + width);
            }
        }
    }
}); 

