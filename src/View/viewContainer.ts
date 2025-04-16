import { Engine } from '../engine';
import { ELayoutMode, LayoutProvider } from './layoutProvider';
import { LayoutGroupTable } from '../Model/modelConstructor';
import { Util } from '../Common/util';
import { SVModel } from '../Model/SVModel';
import { Renderer } from './renderer';
import { Reconcile } from './reconcile';
import { EventBus } from '../Common/eventBus';
import { Group } from '../Common/group';
import { Graph, Modes } from '@antv/g6-pc';
import { InitG6Behaviors } from '../BehaviorHelper/initG6Behaviors';
import { SVNode } from '../Model/SVNode';
import {
	SolveBrushSelectDrag,
	SolveNodeAppendagesDrag,
} from '../BehaviorHelper/behaviorIssueHelper';
import { handleUpdate } from '../sources';

export class ViewContainer {
	private engine: Engine;
	private layoutProvider: LayoutProvider;
	private reconcile: Reconcile;
	public renderer: Renderer;

	private layoutGroupTable: LayoutGroupTable;
	private prevModelList: SVModel[];

	public brushSelectedModels: SVModel[]; // 保存框选过程中被选中的节点
	public clickSelectNode: SVNode; // 点击选中的节点

	constructor(engine: Engine, DOMContainer: HTMLElement, isForce: boolean) {
		const behaviorsModes: Modes = InitG6Behaviors(engine, this);

		this.engine = engine;
		this.layoutProvider = new LayoutProvider(engine, this);
		this.renderer = new Renderer(engine, DOMContainer, behaviorsModes, isForce);
		this.reconcile = new Reconcile(engine, this.renderer);
		this.layoutGroupTable = new Map();
		this.prevModelList = [];
		this.brushSelectedModels = [];
		this.clickSelectNode = null;

		SolveNodeAppendagesDrag(this);
		SolveBrushSelectDrag(this);
	}

	// ----------------------------------------------------------------------------------------------

	/**
	 * 对主视图进行重新布局
	 */
	reLayout(layoutMode: ELayoutMode) {
		const g6Instance = this.getG6Instance(),
			group = g6Instance.getGroup(),
			matrix = group.getMatrix(),
			bound = group.getCanvasBBox();

		const { duration, enable, timingFunction } = this.engine.animationOptions;

		if (matrix) {
			let dx = matrix[6],
				dy = matrix[7];

			g6Instance.moveTo(bound.minX - dx, bound.minY - dy, enable, {
				duration,
				easing: timingFunction,
			});
		}

		const height = g6Instance.getHeight();

		this.layoutProvider.layoutAll(this.layoutGroupTable, layoutMode);
		g6Instance.refresh();

	}
 

	/**
	 * 获取 g6 实例
	 */
	getG6Instance(): Graph {
		return this.renderer.getG6Instance();
	}

	/**
	 *
	 */
	getLayoutGroupTable(): LayoutGroupTable {
		return this.layoutGroupTable;
	}

	/**
	 * 刷新视图
	 */
	refresh() {
		this.renderer.getG6Instance().refresh();
	}

	/**
	 * 重新调整容器尺寸
	 * @param width
	 * @param height
	 */
	resize(width: number, height: number) {
		const g6Instance = this.getG6Instance(),
			prevContainerHeight = g6Instance.getHeight(),
			globalGroup: Group = new Group();

		globalGroup.add(...this.prevModelList);
		this.renderer.changeSize(width, height);

		const containerHeight = g6Instance.getHeight(),
			dy = containerHeight - prevContainerHeight;

		globalGroup.translate(0, 0);
		this.renderer.refresh();
	}

	/**
	 *
	 * @param models
	 */
	private restoreHighlight(models: SVModel[]) {
		models.forEach(item => {
			// 不是free节点才进行还原
			if (!item.freed) {
				item.restoreHighlight();
			}
		});
	}

  private setPrevUpdateId(prevUpdateId: string[]) {
    this.reconcile.setPrevUpdateId(prevUpdateId)
  }

	/**
	 * 渲染所有视图
	 * @param models
	 * @param layoutFn
	 */
	render(
		layoutGroupTable: LayoutGroupTable,
		isSameSources: boolean,
		handleUpdate: handleUpdate
	) {
		const modelList = Util.convertGroupTable2ModelList(layoutGroupTable);

		this.restoreHighlight(modelList);

		// 如果数据没变的话并且不是上一步调试时，直接退出，因为上一步调试可能虽然数据没变，但是高亮的model需要和原本的顺序执行时一致
		if (isSameSources && !handleUpdate?.hasTriggerLastStep) {
      this.setPrevUpdateId([])
			return;
		}

		let renderModelList = [...modelList];


    const layoutMode = this.engine.viewOptions.layoutMode;

		this.renderer.build(renderModelList); // 首先在离屏canvas渲染先
		this.layoutProvider.layoutAll(layoutGroupTable,  layoutMode); // 进行布局（设置model的x，y，样式等）

		this.beforeRender();
		this.renderer.render(renderModelList); // 渲染视图
		this.afterRender();

		this.layoutGroupTable = layoutGroupTable;
		this.prevModelList = modelList;
	}

	/**
	 * 销毁
	 */
	destroy() {
		this.renderer.destroy();
		this.reconcile.destroy();
		this.layoutProvider = null;
		this.layoutGroupTable = null;
		this.prevModelList.length = 0;
		this.brushSelectedModels.length = 0;
	}

	// ------------------------------------------------------------------------------

	/**
	 * 把渲染后要触发的逻辑放在这里
	 */
	private afterRender() {
		this.prevModelList.forEach(item => {
			item.discarded = true;
		});
	}

	/**
	 * 把渲染前要触发的逻辑放在这里
	 */
	private beforeRender() {}
}
