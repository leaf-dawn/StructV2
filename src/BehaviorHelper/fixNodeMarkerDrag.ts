import { Graph } from "@antv/g6";
import { SVNode } from "../Model/SVNode";


/**
 * 在初始化渲染器之后，修正节点拖拽时，外部指针没有跟着动的问题
 * 
 */
export function FixNodeMarkerDrag(g6Instance: Graph) {
    let dragActive: boolean = false;

    const nodeData = {
        node: null,
        startX: 0,
        startY: 0
    };

    const markerData = {
        marker: null,
        startX: 0,
        startY: 0
    };

    const freedLabelData = {
        freedLabel: null,
        startX: 0,
        startY: 0
    };

    g6Instance.on('node:dragstart', event => {
        nodeData.node = event.item['SVModel'];
        let node: SVNode = nodeData.node;

        if (node.isNode() === false || node.leaked) {
            return false;
        }

        dragActive = true;
        nodeData.startX = event.canvasX;
        nodeData.startY = event.canvasY;

        if (node.marker) {
            markerData.marker = node.marker;
            markerData.startX = markerData.marker.get('x');
            markerData.startY = markerData.marker.get('y');
        }

        if(node.freedLabel) {
            freedLabelData.freedLabel = node.freedLabel;
            freedLabelData.startX = freedLabelData.freedLabel.get('x');
            freedLabelData.startY = freedLabelData.freedLabel.get('y');
        }
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

        nodeData.node = null;
        nodeData.startX = 0;
        nodeData.startY = 0;
        markerData.marker = null;
        markerData.startX = 0;
        markerData.startY = 0;
        freedLabelData.freedLabel = null;
        freedLabelData.startX = 0;
        freedLabelData.startY = 0;
        dragActive = false;
    });

    g6Instance.on('node:drag', ev => {
        if (!dragActive) {
            return false;
        }

        let dx = ev.canvasX - nodeData.startX,
            dy = ev.canvasY - nodeData.startY,
            zoom = g6Instance.getZoom();

        if(markerData.marker) {
            markerData.marker.set({
                x: markerData.startX + dx / zoom,
                y: markerData.startY + dy / zoom
            });
        }

        if(freedLabelData.freedLabel) {
            freedLabelData.freedLabel.set({
                x: freedLabelData.startX + dx / zoom,
                y: freedLabelData.startY + dy / zoom
            });
        }
    });
}