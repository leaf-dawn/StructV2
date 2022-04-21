import { EventBus } from '../Common/eventBus';
import { Util } from '../Common/util';
import { Engine } from '../engine';
import { LayoutGroupTable } from '../Model/modelConstructor';
import { SVLink } from '../Model/SVLink';
import { SVModel } from '../Model/SVModel';
import { SVNode } from '../Model/SVNode';
import { SVAddressLabel, SVMarker, SVNodeAppendage } from '../Model/SVNodeAppendage';
import { handleUpdate } from '../sources';
import { Animations } from './animation';
import { Renderer } from './renderer';

export interface DiffResult {
	CONTINUOUS: SVModel[];
	APPEND: SVModel[];
	REMOVE: SVModel[];
	FREED: SVNode[];
	LEAKED: SVModel[];
	UPDATE: SVModel[];
}

export class Reconcile {
	private engine: Engine;
	private renderer: Renderer;
	private isFirstPatch: boolean;

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
	 * 获取新增的节点，这些节点有可能来自泄漏区（上一步的情况）
	 * @param prevModelList
	 * @param modelList
	 * @param accumulateLeakModels
	 * @returns
	 */
	private getAppendModels(
		prevModelList: SVModel[],
		modelList: SVModel[],
		accumulateLeakModels: SVModel[]
	): SVModel[] {
		const appendModels = modelList.filter(item => !prevModelList.find(model => model.id === item.id));

		// 看看新增的节点是不是从泄漏区来的
		// 目前的判断方式比较傻：看看泄漏区有没有相同id的节点，但是发现这个方法可能不可靠，不知道还有没有更好的办法
		appendModels.forEach(item => {
			const removeIndex = accumulateLeakModels.findIndex(leakModel => item.id === leakModel.id),
				svModel = accumulateLeakModels[removeIndex];

			if (removeIndex > -1) {
				svModel.leaked = false;
				accumulateLeakModels.splice(removeIndex, 1);
			}
		});

		return appendModels;
	}

	/**
	 * 获取被泄露的节点
	 * @param layoutGroupTable
	 * @param prevModelList
	 * @param modelList
	 * @returns
	 */
	private getLeakModels(
		layoutGroupTable: LayoutGroupTable,
		prevModelList: SVModel[],
		modelList: SVModel[]
	): SVModel[] {
		let potentialLeakModels: SVModel[] = prevModelList.filter(
			item => !modelList.find(model => model.id === item.id) && !item.freed
		);
		const leakModels: SVModel[] = [];

		// 先把节点拿出来
		const potentialLeakNodes = potentialLeakModels.filter(item => item.isNode()) as SVNode[],
			groups = Util.groupBy<SVNode>(potentialLeakNodes, 'group');

		// 再把非节点的model拿出来
		potentialLeakModels = potentialLeakModels.filter(item => item.isNode() === false);

		Object.keys(groups).forEach(key => {
			const leakRule = layoutGroupTable.get(key).layoutCreator.defineLeakRule;
			if (leakRule && typeof leakRule === 'function') {
				potentialLeakModels.push(...leakRule(groups[key]));
			}
		});

		potentialLeakModels.forEach(item => {
			if (item instanceof SVNode) {
				item.leaked = true;
				leakModels.push(item);

				item.getAppendagesList().forEach(appendage => {
					// 外部指针先不加入泄漏区（这个需要讨论一下，我觉得不应该）
					if (appendage instanceof SVMarker) {
						return;
					}

					appendage.leaked = true;
					leakModels.push(appendage);
				});
			}
		});

		potentialLeakModels.forEach(item => {
			if (item instanceof SVLink && item.node.leaked !== false && item.target.leaked !== false) {
				item.leaked = true;
				leakModels.push(item);
			}
		});

		return leakModels;
	}

	/**
	 * 找出需要移除的节点
	 * @param prevModelList
	 * @param modelList
	 */
	private getRemoveModels(
		prevModelList: SVModel[],
		modelList: SVModel[],
		accumulateLeakModels: SVModel[]
	): SVModel[] {
		let removedModels: SVModel[] = [];

		for (let i = 0; i < prevModelList.length; i++) {
			let prevModel = prevModelList[i],
				target = modelList.find(item => item.id === prevModel.id);

			if (target === undefined && !prevModel.leaked) {
				removedModels.push(prevModel);
			}
		}

		// 假如某个节点从泄漏区移回可视化区域，那么与原来泄漏结构的连线应该消失掉
		for (let i = 0; i < accumulateLeakModels.length; i++) {
			let leakModel = accumulateLeakModels[i];
			if (leakModel instanceof SVLink) {
				if (leakModel.node.leaked === false || leakModel.target.leaked === false) {
					accumulateLeakModels.splice(i, 1);
					i--;
					removedModels.push(leakModel);
				}
			}
		}

		removedModels.forEach(item => {
			item.beforeDestroy();
		});

		return removedModels;
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

				// 先不显示泄漏区节点上面的地址文本
				if (item instanceof SVAddressLabel) {
					// 先将透明度改为0，隐藏掉
					const AddressLabelG6Group = G6Item.getContainer();
					AddressLabelG6Group.attr({ opacity: 0 });
				} else {
					Animations.FADE_IN(G6Item, {
						duration,
						timingFunction,
					});
				}
			} else {
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
	 * 处理泄漏区 models
	 * @param leakModels
	 */
	private handleLeakModels(leakModels: SVModel[]) {
		let { duration, timingFunction } = this.engine.animationOptions;

		leakModels.forEach(item => {
			if (item instanceof SVAddressLabel) {
				Animations.FADE_IN(item.G6Item, {
					duration,
					timingFunction,
				});
			}

			item.G6Item.enableCapture(false);
		});

		EventBus.emit('onLeak', leakModels);
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
	 * @param accumulateLeakModels
	 * @returns
	 */
	public diff(
		layoutGroupTable: LayoutGroupTable,
		prevModelList: SVModel[],
		modelList: SVModel[],
		accumulateLeakModels: SVModel[],
		isDiffLeak: boolean
	): DiffResult {
		const continuousModels: SVModel[] = this.getContinuousModels(prevModelList, modelList);
		const leakModels: SVModel[] = isDiffLeak ? [] : this.getLeakModels(layoutGroupTable, prevModelList, modelList);
		const appendModels: SVModel[] = this.getAppendModels(prevModelList, modelList, accumulateLeakModels);
		const removeModels: SVModel[] = this.getRemoveModels(prevModelList, modelList, accumulateLeakModels);
		const updateModels: SVModel[] = [
			...this.getReTargetMarkers(prevModelList, modelList),
			...this.getLabelChangeModels(prevModelList, modelList),
			...this.filterUnChangeModelsOfAppend(appendModels, prevModelList),
			...leakModels,
		];
		const freedModels: SVNode[] = this.getFreedModels(prevModelList, modelList);

		return {
			CONTINUOUS: continuousModels,
			APPEND: appendModels,
			REMOVE: removeModels,
			FREED: freedModels,
			LEAKED: leakModels,
			UPDATE: updateModels,
		};
	}

	/**
	 * 执行调和操作
	 * @param diffResult
	 * @param isFirstRender
	 */
	public patch(diffResult: DiffResult, handleUpdate: handleUpdate) {
		const { APPEND, REMOVE, FREED, LEAKED, UPDATE, CONTINUOUS } = diffResult;

		// 第一次渲染和进入函数的时候不高亮变化的元素
		if (this.isFirstPatch === false && !handleUpdate?.isEnterFunction && !handleUpdate?.isFirstDebug) {
			this.handleChangeModels(UPDATE);
		}

		this.handleContinuousModels(CONTINUOUS);
		this.handleFreedModels(FREED);
		this.handleAppendModels(APPEND);
		this.handleLeakModels(LEAKED);
		this.handleRemoveModels(REMOVE);

		if (this.isFirstPatch) {
			this.isFirstPatch = false;
		}
	}

	public destroy() {}
}
