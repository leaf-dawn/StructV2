 
SV.registerLayout('PCTree', {

    sourcesPreprocess(sources) {

        let headNodes = sources.filter(item => item.type === 'PCTreeHead');

        for(let i = 0; i < headNodes.length; i++){

            let dataNode = {
                type: 'PCTreePreHead',
                id: headNodes[i].id + '_0',
                data: headNodes[i].preData,
                indexLeft: headNodes[i].index,
                root: headNodes[i].root
            }
            
            if(dataNode.root){
                dataNode.indexTop = 'data';
                headNodes[i].indexTop = ' parent  firstChild'
            }
            sources.push(dataNode)
        }

        return sources;
    },

    defineOptions() {
        return {
            node: {
                PCTreePreHead: {
                    type: 'rect',
                    label: '[data]',
                    size: [60, 34],
                    labelOptions: {
                        style: { fontSize: 16 }
                    },
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3',
                        offset: 25
                    }
                },
                PCTreeHead: {
                    type: 'two-cell-node',
                    label: '[data]',
                    size: [120, 34],
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
            indexLabel: {
                indexTop: { position: 'top' },
                indexLeft: { position: 'left' }
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
            marker: {
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
                yInterval: 86
            },
            behavior: {
                dragNode: ['PCTreeNode']
            }
        };
    },

    //判断node节点是否之前布局过
    isUnique(value, allNodeIdValue){
        let re = new RegExp("" + value);
        return !re.test(allNodeIdValue);
    },
    
    /**
     * 对子树进行递归布局
     * @param node 
     * @param parent 
     */
    layoutItem(node, prev, layoutOptions, allNodeId) {
        if(!node) {
            return null;
        }
        let width = node.get('size')[0],
            idValue = node.id.split('(')[1].slice(0, -1);
        
        //有y型链表的情况不用再布局
        if(this.isUnique(idValue, allNodeId.value)){
            if(prev) {
                node.set('y', prev.get('y'));
                node.set('x', prev.get('x') + layoutOptions.xInterval + width);
            }
    
            allNodeId.value += idValue;
    
            if(node.next) {
                this.layoutItem(node.next, node, layoutOptions, allNodeId);
            }
        }
    },  

    layout(elements, layoutOptions) {
        let headNode = elements.filter(item => item.type === 'PCTreeHead'),
            preHeadNode =  elements.filter(item => item.type === 'PCTreePreHead'),
            roots = elements.filter(item => item.type === 'PCTreeNode' && item.root),
            height = headNode[0].get('size')[1],
            width = headNode[0].get('size')[0],
            i,
            allNodeId = { value: ''};  //引用类型用于传参
    
        for(i = 0; i < headNode.length; i++) {
            let node = headNode[i],
                preNode = preHeadNode[i];

            node.set({
                x:  0,
                y: i * height
            });

            preNode.set({
                x:  width  / 4,
                y:  (i + 1) * height
            })

            if(node.headNext) {
                let y = node.get('y') + height - node.headNext.get('size')[1],
                    x = width + layoutOptions.xInterval * 2;

                node.headNext.set({ x, y });
                this.layoutItem(node.headNext, null, layoutOptions, allNodeId);
            }
        }

        for(i = 0; i < roots.length; i++) {
            let nodeWidth = roots[0].get('size')[0],
                nodeInternalSum = i * (nodeWidth + layoutOptions.xInterval);

            roots[i].set({
                x: headNode[0].get('x') + width + layoutOptions.xInterval * 2 + nodeInternalSum, 
                y: headNode[0].get('y') - layoutOptions.yInterval 
            })
        }
    }
});



