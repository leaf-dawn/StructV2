import { Graph } from "@antv/g6";
import { SVNode } from "../Model/SVNode";
import { SVNodeAppendage } from "../Model/SVNodeAppendage";


/**
 * 在初始化渲染器之后，修正节点拖拽时，外部指针或者其他 appendage 没有跟着动的问题
 * 
 */
export function FixNodeMarkerDrag(g6Instance: Graph) {
    let dragActive: boolean = false,
        nodeData: { node: SVNode, startX: number, startY: number },
        appendagesData: { appendage: SVNodeAppendage, startX: number, startY: number }[] = [];

    g6Instance.on('node:dragstart', event => {
        let node: SVNode = event.item['SVModel'];

        if (node.isNode() === false || node.leaked) {
            return false;
        }

        dragActive = true;
        nodeData = {
            node,
            startX: event.canvasX,
            startY: event.canvasY
        };

        node.appendages.forEach(item => {
            appendagesData.push({
                appendage: item,
                startX: item.get('x'),
                startY: item.get('y')
            });
        });
    });

    g6Instance.on('node:dragend', event => {
        if(!dragActive) {
            return false;
        }

        let node: SVNode = nodeData.node;

        node.set({
            x: node.G6Item.getModel().x,
            y: node.G6Item.getModel().y
        });

        nodeData = null;
        appendagesData.length = 0;
        dragActive = false;
    });

    g6Instance.on('node:drag', ev => {
        if (!dragActive) {
            return false;
        }

        let dx = ev.canvasX - nodeData.startX,
            dy = ev.canvasY - nodeData.startY,
            zoom = g6Instance.getZoom();

        appendagesData.forEach(item => {
            item.appendage.set({
                x: item.startX + dx / zoom,
                y: item.startY + dy / zoom
            });
        });
    });
}