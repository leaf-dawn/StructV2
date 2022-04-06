import { G6Event, Graph, INode } from '@antv/g6';
import { EventBus } from '../Common/eventBus';
import { LayoutGroupTable } from '../Model/modelConstructor';
import { SVModel } from '../Model/SVModel';
import { SVNode } from '../Model/SVNode';
import { ViewContainer } from '../View/viewContainer';

/**
 * 判断当前节点是否可以单独拖拽
 * @param node
 * @param dragNodeOption
 */
const checkNodeDragAlone = function (node: SVNode, dragNodeOption: boolean | string[]): boolean {
	const nodeSourceType = node.sourceType;

	if (Array.isArray(dragNodeOption)) {
		return dragNodeOption.includes(nodeSourceType);
	}

	if (dragNodeOption === undefined || dragNodeOption === true) {
		return true;
	}

	return false;
};

/**
 * 判定该节点是否可以被拖拽
 * 1. 当 dragNodeOption 为 true 或者 undefined时，所有节点都可单独拖拽
 * 2. 当 dragNodeOption 声明了某些节点的type时（字符数组），这些节点可以单独拖拽
 * 3. 当 dragNodeOption 为 false 或者不包含在声明的type的节点，只能批量拖拽
 */
export const DetermineNodeDrag = function (
	layoutGroupTable: LayoutGroupTable,
	node: SVNode,
	brushSelectedModels: SVModel[]
) {
	const layoutGroup = layoutGroupTable.get(node.group),
		dragNodeOption = layoutGroup.options.behavior?.dragNode,
		canNodeDragAlone = checkNodeDragAlone(node, dragNodeOption);

	if (canNodeDragAlone) {
		return true;
	}

	const nodeSourceType = node.sourceType,
		nodeModelType = node.getModelType(),
		modelList = (<SVModel[]>layoutGroup[nodeModelType]).filter(item => item.sourceType === nodeSourceType),
		brushSelectedSameTypeModels = brushSelectedModels.filter(item => {
			return (
				item.group === node.group && item.getModelType() === nodeModelType && item.sourceType === nodeSourceType
			);
		});

	return modelList.length === brushSelectedSameTypeModels.length;
};

/**
 * 在初始化渲染器之后，修正节点拖拽时，外部指针或者其他 appendage 没有跟着动的问题
 *
 */
export function SolveNodeAppendagesDrag(viewContainer: ViewContainer) {
	const g6Instance: Graph = viewContainer.getG6Instance();

	g6Instance.on('node:dragstart', event => {
		let node: SVNode = event.item['SVModel'];

		if (node instanceof SVNode === false) {
			return;
		}

		const isNodeSelected = viewContainer.brushSelectedModels.find(item => item.id === node.id);

		// 如果在框选完成之后，拖拽了被框选之外的其他节点，那么取消已框选的节点的选中状态
		if (isNodeSelected === undefined) {
			viewContainer.brushSelectedModels.forEach(item => {
				item.setSelectedState(false);

				if (item instanceof SVNode) {
					item.getAppendagesList().forEach(appendage => appendage.setSelectedState(false));
				}
			});
			viewContainer.brushSelectedModels.length = 0;
		}
	});

	g6Instance.on('node:dragend', event => {
		let node: SVNode = event.item['SVModel'];

		if (node instanceof SVNode === false) {
			return;
		}

		const isNodeSelected = viewContainer.brushSelectedModels.find(item => item.id === node.id);

		// 如果当前拖拽的节点是在已框选选中的节点之中，那么不需要取消选中的状态，否则需要取消
		if (isNodeSelected === undefined) {
			node.setSelectedState(false);
			node.set({
				x: node.G6Item.getModel().x,
				y: node.G6Item.getModel().y,
			});

			node.getAppendagesList().forEach(item => {
				item.setSelectedState(false);
				item.set({
					x: item.G6Item.getModel().x,
					y: item.G6Item.getModel().y,
				});
			});
		}

		viewContainer.brushSelectedModels.forEach(item => {
			item.set({
				x: item.G6Item.getModel().x,
				y: item.G6Item.getModel().y,
			});

			if (item instanceof SVNode) {
				item.getAppendagesList().forEach(appendage => {
					appendage.set({
						x: appendage.G6Item.getModel().x,
						y: appendage.G6Item.getModel().y,
					});
				});
			}
		});
	});
}

/**
 * 检测框选到的节点是不是都可以被选中
 * @param viewContainer
 */
export function SolveBrushSelectDrag(viewContainer: ViewContainer) {
	const g6Instance: Graph = viewContainer.getG6Instance();

	// 当框选完成后，监听被框选节点的数量变化事件，将被框选的节点添加到 brushSelectedModels 数组里面
	g6Instance.on('nodeselectchange' as G6Event, event => {
		const selectedItems = event.selectedItems as { nodes: INode[] },
			tmpSelectedModelList = [];

		// 如果是点击选中，不理会
		if (event.target) {
			return;
		}

		// 先清空上一次框选保存的内容
		viewContainer.brushSelectedModels.length = 0;

		// 首先将已框选中的节点加到一个临时队列
		selectedItems.nodes.forEach(item => {
			tmpSelectedModelList.push(item['SVModel']);
		});

		// 之后逐个检测被框选中的节点是否可以拖拽，可以拖拽的才加入到真正的框选队列
		selectedItems.nodes.forEach(item => {
			const node: SVNode = item['SVModel'];

			if (DetermineNodeDrag(viewContainer.getLayoutGroupTable(), node, tmpSelectedModelList)) {
				viewContainer.brushSelectedModels.push(node);
			} else {
				node.setSelectedState(false);
			}
		});
	});
}

/**
 * 解决泄漏区随着视图拖动的问题
 * @param g6Instance
 * @param hasLeak
 */
export function SolveDragCanvasWithLeak(viewContainer: ViewContainer) {
	let g6Instance = viewContainer.getG6Instance();

	g6Instance.on('viewportchange', event => {
		if (event.action !== 'translate') {
			return false;
		}

		let translateY = event.matrix[7],
			dy = translateY - viewContainer.lastLeakAreaTranslateY;

        viewContainer.lastLeakAreaTranslateY = translateY;

		viewContainer.leakAreaY = viewContainer.leakAreaY + dy;
		if (viewContainer.hasLeak) {
			EventBus.emit('onLeakAreaUpdate', {
				leakAreaY: viewContainer.leakAreaY,
				hasLeak: viewContainer.hasLeak,
			});
		}
	});
}

/**
 * 解决泄漏区随着视图缩放的问题（这里搞不出来，尽力了）
 * @param g6Instance
 * @param generalModelsGroup
 */
export function SolveZoomCanvasWithLeak(viewContainer: ViewContainer) {}
