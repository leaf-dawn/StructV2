

SV.registerLayouter('Stack', {

    sourcesPreprocess(sources, options) {
        const stackBottomNode = sources[sources.length - 1];

        if(stackBottomNode.external) {
            stackBottomNode.bottomExternal = stackBottomNode.external;
            delete stackBottomNode.external;
        }

        if(options.layout.indexPosition) {
            sources.forEach(item => {
                item.indexPosition = options.layout.indexPosition;
            });
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
                    }
                }
            },
            pointer: {
                external: {
                    anchor: 1,
                    style: {
                        fill: '#f08a5d'
                    }
                },
                bottomExternal: {
                    anchor: 2,
                    style: {
                        fill: '#f08a5d'
                    }
                }
            },
            layout: {
                indexPosition: 'left'
            },
            behavior: {
                dragNode: false
            }
        };
    },

    layout(elements, layoutOptions) {
        let blocks = elements;

        for(let i = 1; i < blocks.length; i++) {
            let item = blocks[i],
                prev = blocks[i - 1],
                height = item.get('size')[1];

            item.set('y', prev.get('y') + height);
        }
    }
}) 


