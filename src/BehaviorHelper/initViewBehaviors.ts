import { SVModel } from "../Model/SVModel";
import { LayoutGroupOptions } from "../options";



/**
 * 初始化g6 交互options
 * @param optionsTable 
 * @returns 
 */
export function InitViewBehaviors(optionsTable: { [key: string]: LayoutGroupOptions }) {
    const dragNodeTable: { [key: string]: boolean | string[] } = {},
        selectNodeTable: { [key: string]: boolean | string[] } = {},
        defaultModes = [];

    Object.keys(optionsTable).forEach(item => {
        dragNodeTable[item] = optionsTable[item].behavior.dragNode;
        selectNodeTable[item] = optionsTable[item].behavior.selectNode;
    });

    const dragNodeFilter = event => {
        let g6Item = event.item,
            node: SVModel = g6Item.SVModel;

        if (g6Item === null || node.isNode() === false || node.leaked) {
            return false;
        }

        let dragNode = optionsTable[node.layout].behavior.dragNode;

        if (typeof dragNode === 'boolean') {
            return dragNode;
        }

        if (Array.isArray(dragNode) && dragNode.indexOf(node.sourceType) > -1) {
            return true;
        }

        return false;
    }

    const selectNodeFilter = event => {
        let g6Item = event.item,
            node: SVModel = g6Item.SVModel;

        if (g6Item === null || node.isNode() === false || node.leaked) {
            return false;
        }

        let selectNode = optionsTable[node.layout].behavior.selectNode;

        if (typeof selectNode === 'boolean') {
            return selectNode;
        }

        if (Array.isArray(selectNode) && selectNode.indexOf(node.sourceType) > -1) {
            return true;
        }

        return false;
    }

    defaultModes.push({
        type: 'drag-node',
        shouldBegin: dragNodeFilter
    });

    defaultModes.push({
        type: 'drag-canvas'
    });

    defaultModes.push({
        type: 'click-select',
        shouldBegin: selectNodeFilter
    });

    return defaultModes;
}