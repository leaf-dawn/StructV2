import { handleUpdate, Sources } from './sources';
import { LayoutGroupTable, ModelConstructor } from './Model/modelConstructor';
import { AnimationOptions, BehaviorOptions, EngineOptions, LayoutGroupOptions, ViewOptions } from './options';
import { EventBus } from './Common/eventBus';
import { ViewContainer } from './View/viewContainer';
import { SVNode } from './Model/SVNode';
import { Util } from './Common/util';
import { SVModel } from './Model/SVModel';
import { G6Event } from '@antv/g6';
import { ELayoutMode } from './View/layoutProvider';

export class Engine {
	private modelConstructor: ModelConstructor;
	private viewContainer: ViewContainer;
	private prevStringSource: string;

	public engineOptions: EngineOptions;
	public viewOptions: ViewOptions;
	public animationOptions: AnimationOptions;
	public behaviorOptions: BehaviorOptions;

	constructor(DOMContainer: HTMLElement, engineOptions: EngineOptions, isForce: boolean) {
		this.engineOptions = Object.assign({}, engineOptions);

		this.viewOptions = Object.assign(
			{
				fitCenter: true,
				fitView: false,
				groupPadding: 20,
				updateHighlight: '#fc5185',
                layoutMode: ELayoutMode.HORIZONTAL
			},
			engineOptions.view
		);

		this.animationOptions = Object.assign(
			{
				enable: true,
				duration: 750,
				timingFunction: 'easePolyOut',
			},
			engineOptions.animation
		);

		this.behaviorOptions = Object.assign(
			{
				drag: true,
				zoom: true,
				dragNode: true,
				selectNode: true,
			},
			engineOptions.behavior
		);

		this.modelConstructor = new ModelConstructor(this);
		this.viewContainer = new ViewContainer(this, DOMContainer, isForce);
	}

	/**
	 * 输入数据进行渲染
	 * @param sources
	 * @param prevStep
	 */
	public render(sources: Sources) {
		let isSameSources: boolean = false,
			layoutGroupTable: LayoutGroupTable;

		if (sources === undefined || sources === null) {
			return;
		}

		let handleUpdate: handleUpdate = sources.handleUpdate,
			stringSource = JSON.stringify(sources);

		if (this.prevStringSource === stringSource) {
			isSameSources = true;
		}

		this.prevStringSource = stringSource;

		if (isSameSources) {
			// 若源数据两次一样的，用回上一次的layoutGroupTable
			layoutGroupTable = this.modelConstructor.getLayoutGroupTable();
		} else {
			// 1 转换模型（data => model）
			layoutGroupTable = this.modelConstructor.construct(sources);
		}

  
    
		// 2 渲染（使用g6进行渲染）
		this.viewContainer.render(layoutGroupTable, isSameSources, handleUpdate);
	}

	/**
	 * 重新布局
	 */
	public reLayout(layoutMode?: ELayoutMode) {
        this.viewOptions.layoutMode = layoutMode || this.viewOptions.layoutMode;
		this.viewContainer.reLayout(this.viewOptions.layoutMode);
	}

	/**
	 * 获取 G6 实例
	 */
	public getGraphInstance() {
		return this.viewContainer.getG6Instance();
	}

	/**
	 * 隐藏某些组
	 * @param groupNames
	 */
	public hideGroups(groupNames: string | string[]) {
		const names = Array.isArray(groupNames) ? groupNames : [groupNames],
			instance = this.viewContainer.getG6Instance(),
			layoutGroupTable = this.modelConstructor.getLayoutGroupTable();

		layoutGroupTable.forEach(item => {
			const hasName = names.find(name => name === item.layout);

			if (hasName && !item.isHide) {
				item.modelList.forEach(model => instance.hideItem(model.G6Item));
				item.isHide = true;
			}

			if (!hasName && item.isHide) {
				item.modelList.forEach(model => instance.showItem(model.G6Item));
				item.isHide = false;
			}
		});
	}

	/**
	 *
	 */
	public getAllModels(): SVModel[] {
		const modelList = Util.convertGroupTable2ModelList(this.modelConstructor.getLayoutGroupTable());

		return [...modelList];
	}

	/**
	 * 根据配置变化更新视图
	 * @param modelType
	 * @returns
	 */
	public updateStyle(group: string, newOptions: LayoutGroupOptions) {
		const models = this.getAllModels(),
			layoutGroup = this.modelConstructor.getLayoutGroupTable().get(group);

		layoutGroup.options = newOptions;
		models.forEach(item => {
			if (item.group !== group) {
				return;
			}

			const modelType = item.getModelType(),
				optionsType = layoutGroup.options[modelType];

			if (optionsType) {
				const targetModelOption = optionsType[item.sourceType];
				if (targetModelOption) {
					item.updateG6ModelStyle(item.generateG6ModelProps(targetModelOption));
				}
			}
		});
	}

	/**
	 * 使用id查找某个节点
	 * @param id
	 */
	public findNode(id: string): SVNode {
		const modelList = this.getAllModels();
		const stringId = id.toString();
		const targetNode: SVNode = modelList.find(
			item => item instanceof SVNode && item.sourceId === stringId
		) as SVNode;

		return targetNode;
	}

	/**
	 * 调整容器尺寸
	 * @param width
	 * @param height
	 */
	public resize(width: number, height: number) {
		this.viewContainer.resize(width, height);
	}

	/**
	 * 绑定 G6 事件
	 * @param eventName
	 * @param callback
	 */
	public on(eventName: string, callback: Function) {
		if (typeof callback !== 'function') {
			return;
		}

		if (eventName === 'onFreed') {
			EventBus.on(eventName, callback);
			return;
		}

		this.viewContainer.getG6Instance().on(eventName as G6Event, event => {
			callback(event.item['SVModel']);
		});
	}

	/**
	 * 销毁引擎
	 */
	public destroy() {
		this.modelConstructor.destroy();
		this.viewContainer.destroy();
	}
}
