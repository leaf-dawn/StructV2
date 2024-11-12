import { Engine } from '../engine';
import { SVModel } from '../Model/SVModel';
import { SVMarker } from '../Model/SVNodeAppendage'
import { Util } from '../Common/util';
import { Tooltip, Graph, GraphData, Modes } from '@antv/g6';
import { InitG6Behaviors } from '../BehaviorHelper/initG6Behaviors';

export interface RenderModelPack {
	generalModel: SVModel[];
}

export type g6Behavior =
	| string
	| { type: string; shouldBegin?: Function; shouldUpdate?: Function; shouldEnd?: Function };

export class Renderer {
	private engine: Engine;
	private g6Instance: Graph; // g6 实例
	private shadowG6Instance: Graph;

	constructor(engine: Engine, DOMContainer: HTMLElement, behaviorsModes: Modes, isForce: boolean) {
		this.engine = engine;

		const enable: boolean = this.engine.animationOptions.enable,
			duration: number = this.engine.animationOptions.duration,
			timingFunction: string = this.engine.animationOptions.timingFunction;

		const tooltip = new Tooltip({
			offsetX: 10,
			offsetY: 20,
			shouldBegin(event) {
				return event.item['SVModel'].isNode();
			},
			getContent: event => this.getTooltipContent(event.item['SVModel'], { address: 'sourceId', data: 'data' }),
			itemTypes: ['node'],
		});

		this.shadowG6Instance = new Graph({
			container: DOMContainer.cloneNode() as HTMLElement,
		});
		// 力导向的配置选项
		const forceOption = {
			type: 'force',
			linkDistance: 100, // 边长
			preventOverlap: true, // boolean，防止节点重叠
			// alphaDecay: 0, // 迭代阈值的衰减率。范围 [0, 1]。默认值0.028
			workEnabled: true, // 启用以防布局计算时间过长阻塞页面交互
			nodeStrength: -1, // 节点作用力，正数标识引力，负数表示斥力
			nodeSpacing: d => {
				// 设置了防止重叠后，节点边缘间距的最小值
				return 20;
			},
			center: [DOMContainer.offsetWidth / 2, DOMContainer.offsetHeight / 3],
		};
		// 布局配置
		const layout = isForce ? forceOption : null;
		// 初始化g6实例
		this.g6Instance = new Graph({
			container: DOMContainer,
			width: DOMContainer.offsetWidth,
			height: DOMContainer.offsetHeight,
			groupByTypes: false,
			animate: enable,
			animateCfg: {
				duration: duration,
				easing: timingFunction,
			},
			modes: behaviorsModes,
			plugins: [tooltip],
			layout, // 布局配置
		});
		/**
		 * 固定被拖拽节点
		 */
		function refreshDragedNodePosition(e) {
			const model = e.item.get('model');
			model.fx = e.x;
			model.fy = e.y;
		}
		this.g6Instance.on('node:dragstart', e => {
			this.g6Instance.layout();
			refreshDragedNodePosition(e);
		});
		this.g6Instance.on('node:drag', e => {
			refreshDragedNodePosition(e);
		});
		if (typeof window !== 'undefined') {
			window.onresize = () => {
				if (!this.g6Instance || this.g6Instance.get('destroyed')) return;
				if (!DOMContainer || !DOMContainer.scrollWidth || !DOMContainer.scrollHeight) return;
				this.g6Instance.changeSize(DOMContainer.scrollWidth, DOMContainer.scrollHeight);
			};
		}
	}

	/**
	 * 创造tooltip元素
	 * @param model
	 * @param items
	 * @returns
	 */
	private getTooltipContent(model: SVModel, items: { [key: string]: string }): HTMLDivElement {
		const wrapper = document.createElement('div');

		if (model === null || model === undefined) {
			return wrapper;
		}

		Object.keys(items).map(key => {
			let value = model[items[key]];
			if (value !== undefined && value !== null) {
				let item = document.createElement('div');
				item.innerHTML = `${key}：${value}`;
				wrapper.appendChild(item);
			}
		});

		return wrapper;
	}

	/**
	 * 对每一个 model 在离屏 Canvas 上构建 G6 item，用作布局
	 * @param renderModelList
	 */
	public build(renderModelList: SVModel[]) {
		const g6Data: GraphData = Util.convertModelList2G6Data(renderModelList);

		this.shadowG6Instance.clear();
		this.shadowG6Instance.read(g6Data);
		renderModelList.forEach(item => {
			item.G6Item = null;
			item.shadowG6Item = this.shadowG6Instance.findById(item.id);
			item.shadowG6Instance = this.shadowG6Instance;
		});
	}

	/**
	 * 渲染函数
	 * @param renderModelList
	 * @param isFirstRender
	 */
	public render(renderModelList: SVModel[]) {
		const renderData: GraphData = Util.convertModelList2G6Data(renderModelList);

		this.g6Instance.changeData(renderData);

		renderModelList.forEach(item => {
			item.g6Instance = this.g6Instance;
			item.G6Item = this.g6Instance.findById(item.id);
			item.G6Item['SVModel'] = item;
		});

		//外部指针在结点图层上方
		this.g6Instance.getNodes().forEach(item => {
			if (item['SVModel'] instanceof SVMarker) {
				item.toFront()
			}
		})
		this.g6Instance.getEdges().forEach(item => item.toFront());

		this.g6Instance.paint();
	}

	/**
	 * 从视图中移除一个 Model
	 * @param model
	 */
	public removeModel(model: SVModel) {
		this.g6Instance.removeItem(model.G6Item);
		this.shadowG6Instance.removeItem(model.shadowG6Item);
	}

	/**
	 * 获取 G6 实例
	 */
	public getG6Instance() {
		return this.g6Instance;
	}

	/**
	 *
	 */
	public refresh() {
		this.g6Instance.refresh();
		this.shadowG6Instance.refresh();
	}

	/**
	 *
	 * @param width
	 * @param height
	 */
	public changeSize(width: number, height: number) {
		this.g6Instance.changeSize(width, height);
		this.shadowG6Instance.changeSize(width, height);
	}

	/**
	 * 销毁
	 */
	public destroy() {
		this.shadowG6Instance.destroy();
		this.g6Instance.destroy();
	}
}
