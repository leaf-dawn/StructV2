SV.registerLayout('BinaryTree', {
    defineOptions() {
        return {
            element: {
                default: {
                    type: 'binary-tree-node',
                    size: [60, 30],
                    label: '[data]',
                    style: {
                        fill: '#b83b5e',
                        stroke: "#333",
                        cursor: 'pointer'
                    }
                }
            },
            link: {
                child: {
                    type: 'line',
                    sourceAnchor: index => index === 0 ? 3 : 1,
                    targetAnchor: 0,
                    style: {
                        stroke: '#333',
                        lineAppendWidth: 6,
                        cursor: 'pointer',
                        endArrow: 'default',
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
                    offset: 14,
                    style: {
                        fill: '#f08a5d'
                    },
                    labelOptions: {
                        style: {
                            fill: '#000099'
                        }
                    }
                }
            },
            layout: {
                xInterval: 40,
                yInterval: 40
            },
            behavior: {
                // dragNode: false
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

        let bound = node.getBound(),
            width = bound.width,
            height = bound.height,
            group = new Group(node);

        if (node.visited) {
            return;
        }


        if (parent) {
            node.set('y', parent.get('y') + layoutOptions.yInterval + height);

            // 左节点
            if (index === 0) {
                node.set('x', parent.get('x') - layoutOptions.xInterval / 2 - width / 2);
            }

            // 右结点
            if (index === 1) {
                node.set('x', parent.get('x') + layoutOptions.xInterval / 2 + width / 2);
            }
        }

        node.visited = true;

        if (node.child && (node.child[0] || node.child[1])) {
            let leftChild = node.child[0],
                rightChild = node.child[1],
                leftGroup = this.layoutItem(leftChild, node, 0, layoutOptions),
                rightGroup = this.layoutItem(rightChild, node, 1, layoutOptions),
                intersection = null,
                move = 0;

            // 处理左右子树相交问题
            if (leftGroup && rightGroup) {
                intersection = Bound.intersect(leftGroup.getBound(), rightGroup.getBound());
                move = 0;

                if (intersection && intersection.width > 0) {
                    move = (intersection.width + layoutOptions.xInterval) / 2;
                    leftGroup.translate(-move, 0);
                    rightGroup.translate(move, 0);
                }
            }

            if (leftGroup) {
                group.add(leftGroup);
            }

            if (rightGroup) {
                group.add(rightGroup)
            }
        }

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





[{
    "id": 6385328,
    "data": "",
    "external": [
        "L"
    ],
    "root": true,
    "after": null,
    "next": null
}]