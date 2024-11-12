import { EventBus } from '../Common/eventBus';
import { Util } from '../Common/util';
import { Engine } from '../engine';
import { LayoutGroupTable } from '../Model/modelConstructor';
import { SVLink } from '../Model/SVLink';
import { SVModel } from '../Model/SVModel';
import { SVNode } from '../Model/SVNode';
import { SVMarker, SVNodeAppendage } from '../Model/SVNodeAppendage';
import { handleUpdate } from '../sources';
import { Animations } from './animation';
import { Renderer } from './renderer';

export interface DiffResult {
	CONTINUOUS: SVModel[];
	APPEND: SVModel[];
	REMOVE: SVModel[];
	FREED: SVNode[];
	UPDATE: SVModel[];
}

export class Reconcile {
	private engine: Engine;
	private renderer: Renderer;
	private isFirstPatch: boolean;
	private prevUpdate: string[][] = [];

	constructor(engine: Engine, renderer: Renderer) {
		this.engine = engine;
		this.renderer = renderer;
		this.isFirstPatch = true;
	}

	/**
	 * 获取上一次渲染存在的，这一次渲染也存在的models
	 * @param prevModelList
	 * @param modelList
	 */
	private getContinuousModels(prevModelList: SVModel[], modelList: SVModel[]): SVModel[] {
		const continuousModels = modelList.filter(item => prevModelList.find(prevModel => item.id === prevModel.id));
		return continuousModels;
	}

	/**
	 * 获取新增的节点
	 * @param prevModelList
	 * @param modelList
	 * @returns
	 */
	private getAppendModels(
		prevModelList: SVModel[],
		modelList: SVModel[],
	): SVModel[] {
		const appendModels = modelList.filter(item => !prevModelList.find(model => model.id === item.id));

		return appendModels;
	}

	/**
	 * 找出需要移除的节点
	 * @param prevModelList
	 * @param modelList
	 */
	private getRemoveModels(
		prevModelList: SVModel[],
		modelList: SVModel[],
	): SVModel[] {
		let removedModels: SVModel[] = [];

		for (let i = 0; i < prevModelList.length; i++) {
			let prevModel = prevModelList[i],
				target = modelList.find(item => item.id === prevModel.id);

			if (target === undefined) {
				removedModels.push(prevModel);
			}
		}

		removedModels.forEach(item => {
			item.beforeDestroy();
		});

		return removedModels;
	}

  // 在视图上所有model中根据id查找model
	private getModelsById(ids: string[], modelList: SVModel[]): SVModel[] {
		const updateModels = modelList.filter(item =>
			ids?.find(id => {
				return id === item.id;
			})
		);
    return [ ...updateModels];
	}

	/**
	 * 找出重新指向的外部指针
	 * @param prevModelList
	 * @param modelList
	 * @returns
	 */
	private getReTargetMarkers(prevModelList: SVModel[], modelList: SVModel[]): SVMarker[] {
		const prevMarkers: SVMarker[] = prevModelList.filter(item => item instanceof SVMarker) as SVMarker[],
			markers: SVMarker[] = modelList.filter(item => item instanceof SVMarker) as SVMarker[];

		return markers.filter(item =>
			prevMarkers.find(prevItem => {
				return prevItem.id === item.id && prevItem.target.id !== item.target.id;
			})
		);
	}

	/**
	 * 找出前后 label 发生变化的 model
	 * @param prevModelList
	 * @param modelList
	 * @returns
	 */
	private getLabelChangeModels(prevModelList: SVModel[], modelList: SVModel[]): SVModel[] {
		let labelChangeModels: SVModel[] = [];

		modelList.forEach(item => {
			const prevItem = prevModelList.find(prevItem => prevItem.id === item.id);

			if (prevItem === undefined) {
				return;
			}

			const prevLabel = prevItem.get('label'),
				label = item.get('label');

			if (String(prevLabel) !== String(label)) {
				labelChangeModels.push(item);
			}
		});

		return labelChangeModels;
	}

	/**
	 * 获取被 free 的节点
	 * @param prevModelList
	 * @param modelList
	 * @returns
	 */
	private getFreedModels(prevModelList: SVModel[], modelList: SVModel[]): SVNode[] {
		const freedNodes = modelList.filter(item => item instanceof SVNode && item.freed) as SVNode[];

		freedNodes.forEach(item => {
			const prev = prevModelList.find(prevModel => item.id === prevModel.id);

			if (prev) {
				item.set('label', prev.get('label'));
			}
		});

		return freedNodes;
	}

	public setPrevUpdateId(prevUpdateId: string[]) {
		this.prevUpdate.push(prevUpdateId);
	}

	// ------------------------------------------------------------------------------------------------

	/**
	 * 处理不变的models
	 * @param continuousModels
	 */
	private handleContinuousModels(continuousModels: SVModel[]) {
		for (let i = 0; i < continuousModels.length; i++) {
			let model = continuousModels[i];

			if (model instanceof SVNode) {
				const group = model.G6Item.getContainer();
				group.attr({ opacity: 1 });
			}
		}
	}

	/**
	 * 处理新增的 models
	 * @param appendData
	 */
	private handleAppendModels(appendModels: SVModel[]) {
		let { duration, timingFunction } = this.engine.animationOptions;

		appendModels.forEach(item => {
			const G6Item = item.G6Item;

			if (item instanceof SVNodeAppendage) {
				G6Item.enableCapture(false);

				Animations.APPEND(G6Item, {
					duration,
					timingFunction,
					callback: () => item.afterRender(),
				});
			}
		});
	}

	/**
	 * 处理被移除 models
	 * @param removeData
	 */
	private handleRemoveModels(removeModels: SVModel[]) {
		let { duration, timingFunction } = this.engine.animationOptions;

		removeModels.forEach(item => {
			Animations.REMOVE(item.G6Item, {
				duration,
				timingFunction,
				callback: () => {
					this.renderer.removeModel(item);
					item.afterDestroy();
				},
			});
		});
	}



	/**
	 * 处理被释放的节点 models
	 * @param freedModes
	 */
	private handleFreedModels(freedModes: SVNode[]) {
		const { duration, timingFunction } = this.engine.animationOptions,
			alpha = 0.4;

		freedModes.forEach(item => {
			const nodeGroup = item.G6Item.getContainer();

			item.set('style', { fill: '#ccc' });
			nodeGroup.attr({ opacity: alpha });

			if (item.appendages.marker) {
				item.appendages.marker.forEach(marker => {
					const markerGroup = marker.G6Item.getContainer();
					marker.set('style', { fill: '#ccc' });
					markerGroup.attr({ opacity: alpha + 0.5 });
				});
			}

			if (item.appendages.freedLabel) {
				item.appendages.freedLabel.forEach(freedLabel => {
					freedLabel.G6Item.toFront();
					Animations.FADE_IN(freedLabel.G6Item, { duration, timingFunction });
				});
			}
		});

		EventBus.emit('onFreed', freedModes);
	}

	/**
	 * 处理发生变化的 models
	 * @param models
	 */
	private handleChangeModels(models: SVModel[]) {
		const changeHighlightColor: string = this.engine.viewOptions.updateHighlight;

		if (!changeHighlightColor || typeof changeHighlightColor !== 'string') {
			return;
		}

		models.forEach(item => {
			item.triggerHighlight(changeHighlightColor);
		});
	}

	/**
	 * 过滤新增model中那些不需要高亮的model（比如target和node都一样的link，marker等）
	 * @param appendModels
	 */
	private filterUnChangeModelsOfAppend(appendModels: SVModel[], prevModelList: SVModel[]): SVModel[] {
		return appendModels.filter(item => !prevModelList.some(prev => item.isEqual(prev)));
	}

	/**
	 * 进行diff
	 * @param layoutGroupTable
	 * @param prevModelList
	 * @param modelList
	 * @returns
	 */
	public diff(
		layoutGroupTable: LayoutGroupTable,
		prevModelList: SVModel[],
		modelList: SVModel[],
		hasTriggerLastStep: boolean
	): DiffResult {
		if (hasTriggerLastStep) {
			this.prevUpdate.pop();
		}
		const continuousModels: SVModel[] = this.getContinuousModels(prevModelList, modelList);
		const appendModels: SVModel[] = this.getAppendModels(prevModelList, modelList);
		const removeModels: SVModel[] = this.getRemoveModels(prevModelList, modelList);
		const updateModels: SVModel[] = hasTriggerLastStep
			? [...this.getModelsById(this.prevUpdate.pop(), modelList)]
			: [
					...this.getReTargetMarkers(prevModelList, modelList),
					...this.getLabelChangeModels(prevModelList, modelList),
					...this.filterUnChangeModelsOfAppend(appendModels, prevModelList),
			  ];
		
		let UpdateModelsId: string[] = [];
		for (let model of updateModels) {
			UpdateModelsId.push(model.id);
		}
		this.prevUpdate?.push(UpdateModelsId);

		const freedModels: SVNode[] = this.getFreedModels(prevModelList, modelList);

		return {
			CONTINUOUS: continuousModels,
			APPEND: appendModels,
			REMOVE: removeModels,
			FREED: freedModels,
			UPDATE: updateModels,
		};
	}

	/**
	 * 执行调和操作
	 * @param diffResult
	 * @param isFirstRender
	 */
	public patch(diffResult: DiffResult, handleUpdate: handleUpdate) {
		const { APPEND, REMOVE, FREED, UPDATE, CONTINUOUS } = diffResult;

		// 第一次渲染和进入函数的时候不高亮变化的元素
		if (this.isFirstPatch === false && !handleUpdate?.isEnterFunction && !handleUpdate?.isFirstDebug) {
			this.handleChangeModels(UPDATE);
		}

		this.handleContinuousModels(CONTINUOUS);
		this.handleFreedModels(FREED);
		this.handleAppendModels(APPEND);
		this.handleRemoveModels(REMOVE);

		if (this.isFirstPatch) {
			this.isFirstPatch = false;
		}
	}

	public destroy() {}
}
