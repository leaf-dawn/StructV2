import { Engine } from '../engine';
import { LayoutProvider } from './layoutProvider';
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
	SolveDragCanvasWithLeak,
	SolveNodeAppendagesDrag,
	SolveZoomCanvasWithLeak,
} from '../BehaviorHelper/behaviorIssueHelper';
import { handleUpdate } from '../sources';

export class ViewContainer {
    private engine: Engine;
    private layoutProvider: LayoutProvider;
    private reconcile: Reconcile;
    public renderer: Renderer;

    private layoutGroupTable: LayoutGroupTable;
    private prevModelList: SVModel[];
    private accumulateLeakModels: SVModel[];

    public hasLeak: boolean;
    public leakAreaY: number;
	public lastLeakAreaTranslateY: number;
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
        this.accumulateLeakModels = [];
        this.hasLeak = false; // 判断是否已经发生过泄漏
        this.brushSelectedModels = [];
        this.clickSelectNode = null;

        const g6Instance = this.renderer.getG6Instance(),
            leakAreaHeight = this.engine.viewOptions.leakAreaHeight,
            height = g6Instance.getHeight(),
            { drag, zoom } = this.engine.behaviorOptions;

        this.leakAreaY = height - leakAreaHeight;

        SolveNodeAppendagesDrag(this);
        SolveBrushSelectDrag(this);
        drag && SolveDragCanvasWithLeak(this);
        zoom && SolveZoomCanvasWithLeak(this);
    }


    // ----------------------------------------------------------------------------------------------

    /**
     * 对主视图进行重新布局
     */
    reLayout() {
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

        const leakAreaHeight = this.engine.viewOptions.leakAreaHeight,
			height = g6Instance.getHeight();

		this.leakAreaY = height - leakAreaHeight;
		this.lastLeakAreaTranslateY = 0;
		this.layoutProvider.layoutAll(this.layoutGroupTable, this.accumulateLeakModels);
		g6Instance.refresh();

		EventBus.emit('onLeakAreaUpdate', {
            leakAreaY: this.leakAreaY,
            hasLeak: this.hasLeak,
        });
    }


    /**
     * 获取 g6 实例
     */
    getG6Instance(): Graph {
        return this.renderer.getG6Instance();
    }

    /**
     * 获取泄漏区里面的元素
     * @returns 
     */
    getAccumulateLeakModels(): SVModel[] {
        return this.accumulateLeakModels;
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

        globalGroup.add(...this.prevModelList, ...this.accumulateLeakModels);
        this.renderer.changeSize(width, height);

        const containerHeight = g6Instance.getHeight(),
            dy = containerHeight - prevContainerHeight;

        globalGroup.translate(0, dy);
        this.renderer.refresh();

        this.leakAreaY += dy;
        EventBus.emit('onLeakAreaUpdate', {
            leakAreaY: this.leakAreaY,
            hasLeak: this.hasLeak,
        });
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

	/**
	 * 渲染所有视图
	 * @param models
	 * @param layoutFn
	 */
	render(layoutGroupTable: LayoutGroupTable, isSameSources: boolean, handleUpdate: handleUpdate) {
		const modelList = Util.convertGroupTable2ModelList(layoutGroupTable);

		this.restoreHighlight([...modelList, ...this.accumulateLeakModels]);

		// 如果数据没变的话，直接退出
		if (isSameSources) {
			return;
		}

		const diffResult = this.reconcile.diff(
				this.layoutGroupTable,
				this.prevModelList,
				modelList,
				this.accumulateLeakModels,
				handleUpdate?.isEnterFunction
			),
			renderModelList = [...modelList, ...diffResult.REMOVE, ...diffResult.LEAKED, ...this.accumulateLeakModels];

		// 从有泄漏区变成无泄漏区
		if (this.hasLeak === true && this.accumulateLeakModels.length === 0) {
			this.hasLeak = false;
			EventBus.emit('onLeakAreaUpdate', {
				leakAreaY: this.leakAreaY,
				hasLeak: this.hasLeak,
			});
		}

		// 从无泄漏区变成有泄漏区
		if (diffResult.LEAKED.length) {
			this.hasLeak = true;
			EventBus.emit('onLeakAreaUpdate', {
				leakAreaY: this.leakAreaY,
				hasLeak: this.hasLeak,
			});
		}

		this.accumulateLeakModels.push(...diffResult.LEAKED); // 对泄漏节点进行向后累积
		this.renderer.build(renderModelList); // 首先在离屏canvas渲染先
		this.layoutProvider.layoutAll(layoutGroupTable, this.accumulateLeakModels); // 进行布局（设置model的x，y，样式等）

		this.beforeRender();
		this.renderer.render(renderModelList); // 渲染视图
		this.reconcile.patch(diffResult, handleUpdate); // 对视图上的某些变化进行对应的动作，比如：节点创建动画，节点消失动画等
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
		this.accumulateLeakModels.length = 0;
		this.brushSelectedModels.length = 0;
	}

	// ------------------------------------------------------------------------------

	/**
	 * 把渲染后要触发的逻辑放在这里
	 */
	private afterRender() {
		this.prevModelList.forEach(item => {
			if (item.leaked === false) {
				item.discarded = true;
			}
		});
	}

	/**
	 * 把渲染前要触发的逻辑放在这里
	 */
	private beforeRender() {}
}
