import { Graph, INode, Modes } from "@antv/g6";
import { Engine } from "../engine";
import { SVModel } from "../Model/SVModel";
import { SVNode } from "../Model/SVNode";
import { ViewContainer } from "../View/viewContainer";
import { DetermineNodeDrag } from "./behaviorIssueHelper";







/**
 * 初始化g6 交互options
 * @param optionsTable 
 * @returns 
 */
export function InitG6Behaviors(engine: Engine, viewContainer: ViewContainer): Modes {
    
    const dragNodeFilter = event => {
        let g6Item = event.item,
            node: SVNode = g6Item.SVModel;

        if (g6Item === null || node.isNode() === false) {
            return false;
        }

        const enableDrag = DetermineNodeDrag(viewContainer.getLayoutGroupTable(), node, viewContainer.brushSelectedModels);

        if(enableDrag === false) {
            return false;
        }

        // 在拖拽某个节点前，先处理一下上次点击选中的节点，不然会上次选中的节点会跟着一起拖，产生bug
        if(viewContainer.clickSelectNode) {
            const isPrevSelectInBrush = viewContainer.brushSelectedModels.find(item => item.id === viewContainer.clickSelectNode.id);
            
            if(isPrevSelectInBrush === undefined) {
                viewContainer.clickSelectNode.setSelectedState(false);
                viewContainer.clickSelectNode = null;
            }
        }

        // 这里之所以要把节点和其 appendages 的选中状态设置为true，是因为 g6 处理拖拽节点的逻辑是将所以已选中的元素一起拖动，
        // 这样 appendages 就可以很自然地跟着节点动（我是看源码才知道的）
        node.setSelectedState(true);
        node.getAppendagesList().forEach(item => {
            item.setSelectedState(true);
        });

        return true;
    };

    const selectNodeFilter = event => {
        let g6Item = event.item;

        if(g6Item === null) {
            return false
        }

        let node: SVNode = g6Item.SVModel;

        if (node.isNode() === false) {
            return false;
        }

        viewContainer.clickSelectNode = node;

        return true;
    };

    const brushSelectNodeFilter = G6Item => {
        const model: SVModel = G6Item.SVModel;

        // 泄漏的元素不能被框选
        if (model.leaked || model.isNode() === false) {
            return false;
        }

        model.setSelectedState(true);

        return true;
    };

    // --------------------------------------------------------------------------------

    const dragNode = {
        type: 'drag-node',
        shouldBegin: dragNodeFilter
    };

    const dragCanvas = {
        type: 'drag-canvas'
    };

    const zoomCanvas = {
        type: 'zoom-canvas'
    };

    const clickSelect = {
        type: 'click-select',
        multiple: false,
        shouldBegin: selectNodeFilter
    };

    const brushSelect = {
        type: 'brush-select',
        trigger: 'drag',
        includeEdges: false,
        shouldUpdate: brushSelectNodeFilter
    }

    return {
        default: [dragNode, dragCanvas, clickSelect],
        brush: [brushSelect, dragNode]
    };
}