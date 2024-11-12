/**
 * 三叉树
 */
SV.registerLayout('TriTree', {
    defineOptions() {
        return {
            node: {
                default: {
                    type: 'tri-tree-node',
                    size: [60, 30],
                    label: '[data]',
                    style: {
                        fill: '#95e1d3',
                        stroke: '#333',
                        cursor: 'pointer',
                        backgroundFill: '#eee'
                    },
                    labelOptions: {
                        style: { fontSize: 16 }
                    }
                }
            },
            link: {
                child: {
                    sourceAnchor: index => index,
                    targetAnchor: 3,
                    type: 'line',
                    style: {
                        stroke: '#333',
                        lineAppendWidth: 10,
                        lineWidth: 1.6,
                        endArrow: 'default',
                        startArrow: {
                            path: G6.Arrow.circle(2, -1),
                            fill: '#333'
                        }
                    }
                },
                parent: {
                    type: 'line',
                    sourceAnchor: 4,
                    targetAnchor: 6,
                    style: {
                        stroke: '#999',
                        lineAppendWidth: 10,
                        lineWidth: 1.6,
                        endArrow: 'default',
                        startArrow: {
                            path: G6.Arrow.circle(2, -1),
                            fill: '#999'
                        }
                    }
                },
                r_parent: {
                    type: 'quadratic',
                    sourceAnchor: 4,
                    targetAnchor: 5,
                    curveOffset: -20,
                    style: {
                        stroke: '#999',
                        lineAppendWidth: 10,
                        lineWidth: 1.6,
                        endArrow: 'default',
                        startArrow: {
                            path: G6.Arrow.circle(2, -1),
                            fill: '#999'
                        }
                    }
                },
                l_parent: {
                    type: 'quadratic',
                    sourceAnchor: 4,
                    targetAnchor: 2,
                    curveOffset: 20,
                    style: {
                        stroke: '#999',
                        lineAppendWidth: 10,
                        lineWidth: 1.6,
                        endArrow: 'default',
                        startArrow: {
                            path: G6.Arrow.circle(2, -1),
                            fill: '#999'
                        }
                    }
                },
            },
            marker: {
                external: {
                    type: 'pointer',
                    anchor: 3,
                    offset: 14,
                    labelOffset: 2,
                    style: {
                        fill: '#f08a5d'
                    },
                    labelOptions: {
                        style: {
                            fontSize: 15,
                            fill: '#999'
                        }
                    }
                }
            },
            layout: {
                xInterval: 40,
                yInterval: 40,
            }
        };
    },

    /**
     * 对子树进行递归布局
     */
    layoutItem(node, parent, index, layoutOptions) {
        // 次双亲不进行布局
        if (!node) {
            return null;
        }

        let bound = node.getBound(), //获取包围盒
            width = bound.width,
            height = bound.height,
            group = new Group(node); //创建分组

        //有双亲，设置结点的位置
        if (parent) {
            // 纵坐标
            node.set('y', parent.get('y') + layoutOptions.yInterval + height);
            // 左节点横坐标
            if (index === 0) {
                node.set('x', parent.get('x') - layoutOptions.xInterval / 2 - width / 2);
            }
            // 右结点横坐标
            if (index === 1) {
                node.set('x', parent.get('x') + layoutOptions.xInterval / 2 + width / 2);
            }
        }
        //有孩子
        if (node.child && (node.child[0] || node.child[1])) {
            let leftChild = node.child[0],
                rightChild = node.child[1],
                leftGroup = this.layoutItem(leftChild, node, 0, layoutOptions),
                rightGroup = this.layoutItem(rightChild, node, 1, layoutOptions),
                intersection = null,
                move = 0;

            // 处理左子树中子树相交问题
            if (leftGroup && rightChild) {
                //求出包围盒相交部分
                intersection = Bound.intersect(leftGroup.getBound(), rightGroup.getBound());
                move = 0;
                //处理
                if (intersection && intersection.width > 0) {
                    move = (intersection.width + layoutOptions.xInterval) / 2;
                    // console.log(move,intersection.width,layoutOptions.xInterval);
                    leftGroup.translate(-move, 0);
                    rightGroup.translate(move, 0);
                }
            }

            //加入分组
            if (leftGroup) {
                group.add(leftGroup);
            }
            if (rightGroup) {
                group.add(rightGroup)
            }

        }
        //返回分组
        return group;
    },

    /**
     * 布局函数
     * @param {*} elements 
     * @param {*} layoutOptions 
     */
    layout(elements, layoutOptions) {
        let root = elements[0];
        this.layoutItem(root, null, -1, layoutOptions);
    }
});