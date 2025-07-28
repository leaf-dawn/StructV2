import { IPoint, INode } from '@antv/g6-core';
import { Bound, BoundingRect } from '../Common/boundingRect';
import { Group } from '../Common/group';
import { Util } from '../Common/util';
import { Vector } from '../Common/vector';
import { Engine } from '../engine';
import { LayoutGroupTable, ModelConstructor } from '../Model/modelConstructor';
import { SVModel } from '../Model/SVModel';
import { SVFreedLabel, SVIndexLabel, SVMarker } from '../Model/SVNodeAppendage';
import { IndexLabelOption, LayoutOptions, MarkerOption, ViewOptions } from '../options';
import { ViewContainer } from './viewContainer';

export enum ELayoutMode {
	HORIZONTAL = 'hor',
	VERTICAL = 'ver',
}

export class LayoutProvider {
	private engine: Engine;
	private viewOptions: ViewOptions;
	private viewContainer: ViewContainer;

	constructor(engine: Engine, viewContainer: ViewContainer) {
		this.engine = engine;
		this.viewOptions = this.engine.viewOptions;
		this.viewContainer = viewContainer;
	}

	/**
	 * 布局前处理
	 * @param layoutGroupTable
	 */
	private preLayoutProcess(layoutGroupTable: LayoutGroupTable) {
		const modelList = Util.convertGroupTable2ModelList(layoutGroupTable);

		modelList.forEach(item => {
			item.preLayout = true;

			item.set('rotation', item.get('rotation'));
			item.set({ x: 0, y: 0 });
		});
	}

	/**
	 * 布局后处理
	 * @param layoutGroupTable
	 */
	private postLayoutProcess(layoutGroupTable: LayoutGroupTable) {
		const modelList = Util.convertGroupTable2ModelList(layoutGroupTable);

		modelList.forEach(item => {
			item.preLayout = false;

			// 用两个变量保存节点布局完成后的坐标，因为拖拽节点会改变节点的x，y坐标
			// 然后当节点移动到泄漏区的时候，不应该保持节点被拖拽后的状态，应该恢复到布局完成后的状态，不然就会很奇怪
			item.layoutX = item.get('x');
			item.layoutY = item.get('y');
		});
	}

	/**
 * 布局外部指针
 * @param markers 指针数组
 * @param markerOptions 指针配置选项
 */
private layoutMarker(markers: SVMarker[], markerOptions: { [key: string]: MarkerOption }) {
	markers.forEach(item => {
			// 获取指针配置选项
			const options: MarkerOption = markerOptions[item.sourceType],
					offset = options.offset ?? 8,        // 指针距离节点的偏移量
					anchor = item.anchor ?? 0,           // 锚点索引（对应节点的锚点数组）
					labelOffset = options.labelOffset ?? 2, // 标签偏移量
					configuredRotation = options.rotation; // 配置的旋转角度（可选）

			let target = item.target,
					targetBound: BoundingRect = target.getBound(),
					// 获取目标节点的锚点位置
					g6AnchorPosition = (<INode>item.target.shadowG6Item).getAnchorPoints()[anchor] as IPoint,
					// 计算节点中心点
					center: [number, number] = [
							targetBound.x + targetBound.width / 2,
							targetBound.y + targetBound.height / 2,
					],
					markerPosition: [number, number],    // 指针位置
					markerEndPosition: [number, number]; // 指针标签位置

			// 锚点相对于节点中心的位置
			let anchorPosition: [number, number] = [g6AnchorPosition.x, g6AnchorPosition.y];

			// 计算从节点中心到锚点的向量
			let anchorVector = Vector.subtract(anchorPosition, center),
					angle = 0,  // 指针旋转角度
					len = Vector.length(anchorVector) + offset; // 指针距离（包含偏移量）

			// 计算指针旋转角度
			// 如果配置了旋转角度，则使用配置的角度；否则通过计算得到
			if (configuredRotation !== undefined) {
					// 使用配置的旋转角度
					angle = configuredRotation;
			} else {
					// 通过计算得到旋转角度
					// 角度计算逻辑：根据锚点相对于节点中心的位置确定指针的朝向
					if (anchorVector[0] === 0) {
							// 垂直方向：锚点在节点正上方或正下方
							angle = anchorVector[1] > 0 ? -Math.PI : 0;
					} else {
							// 其他方向：使用反正切函数计算角度
							// Math.sign(anchorVector[0]) 确定水平方向（左/右）
							// Math.PI / 2 - Math.atan(anchorVector[1] / anchorVector[0]) 计算垂直角度
							angle = Math.sign(anchorVector[0]) * (Math.PI / 2 - Math.atan(anchorVector[1] / anchorVector[0]));
					}
			}

			const markerHeight = item.get('size')[1],    // 指针高度
					labelRadius = item.getLabelSizeRadius() / 2; // 标签半径

			// 标准化锚点向量（单位向量）
			anchorVector = Vector.normalize(anchorVector);
			// 计算指针位置：从节点中心沿锚点向量方向偏移指定距离
			markerPosition = Vector.location(center, anchorVector, len);
			
			// 计算标签位置
			if (configuredRotation !== undefined) {
					// 自定义旋转角度的情况：使用旋转角度创建新的方向向量
					const pointerDirection: [number, number] = Vector.normalize([Math.sin(angle), Math.cos(angle)]);
					const titleDistance = labelOffset + labelRadius + markerHeight;
					
					// 计算标签位置：从指针位置沿指针方向的反方向偏移
					markerEndPosition = Vector.location(
							markerPosition,
							[pointerDirection[0], pointerDirection[1]],
							titleDistance
					);
					
					// 将标签位置转换为相对于指针位置的坐标
					markerEndPosition = Vector.subtract(markerEndPosition, markerPosition);
			} else {
					// 原有逻辑：使用锚点向量计算标签位置
					markerEndPosition = Vector.location(center, anchorVector, markerHeight + len + labelRadius + labelOffset);
					markerEndPosition = Vector.subtract(markerEndPosition, markerPosition);
			}

			// 设置指针的位置、旋转角度和标签位置
			item.set({
					x: markerPosition[0],
					y: markerPosition[1],
					rotation: angle,        // 指针旋转角度（弧度）
					markerEndPosition,      // 标签相对位置
			});
	});
}

	/**
	 * 布局节点的'已释放'文本
	 * @param freedLabels
	 */
	private layoutFreedLabel(freedLabels: SVFreedLabel[]) {
		freedLabels.forEach(item => {
			const freedNodeBound = item.target.getBound();

			item.set({
				x: freedNodeBound.x + freedNodeBound.width / 2,
				y: freedNodeBound.y + freedNodeBound.height * 1.5,
				size: [freedNodeBound.width, 0],
			});
		});
	}

	/**
	 *
	 * @param indexLabels
	 * @param indexLabelOptions
	 */
	private layoutIndexLabel(indexLabels: SVIndexLabel[], indexLabelOptions: { [key: string]: IndexLabelOption }) {
		const indexLabelPositionMap: {
			[key: string]: (
				nodeBound: BoundingRect,
				labelBound: BoundingRect,
				offset: number
			) => { x: number; y: number };
		} = {
			top: (nodeBound: BoundingRect, labelBound: BoundingRect, offset: number) => {
				return {
					x: nodeBound.x + nodeBound.width / 2,
					y: nodeBound.y - offset,
				};
			},
			right: (nodeBound: BoundingRect, labelBound: BoundingRect, offset: number) => {
				return {
					x: nodeBound.x + nodeBound.width + offset,
					y: nodeBound.y + nodeBound.height / 2,
				};
			},
			bottom: (nodeBound: BoundingRect, labelBound: BoundingRect, offset: number) => {
				return {
					x: nodeBound.x + nodeBound.width / 2,
					y: nodeBound.y + nodeBound.height + offset,
				};
			},
			left: (nodeBound: BoundingRect, labelBound: BoundingRect, offset: number) => {
				return {
					x: nodeBound.x - labelBound.width / 2 - offset,
					y: nodeBound.y + nodeBound.height / 2,
				};
			},
		};

		indexLabels.forEach(item => {
			const options: IndexLabelOption = indexLabelOptions[item.sourceType],
				nodeBound = item.target.getBound(),
				// labelBound = item.getBound(),
				labelBound = item.shadowG6Item.getContainer().getChildren()[1].getBBox(),
				offset = options.offset ?? 20,
				position = options.position ?? 'bottom';

			const pos = indexLabelPositionMap[position](nodeBound, labelBound, offset);
			item.set(pos);
		});
	}


	/**
	 * 对每个组内部的model进行布局
	 * @param layoutGroupTable
	 */
	private layoutModels(layoutGroupTable: LayoutGroupTable): Group[] {
		const modelGroupList: Group[] = [];

		layoutGroupTable.forEach(group => {
			const modelList: SVModel[] = group.modelList,
				modelGroup: Group = new Group();

			const layoutOptions: LayoutOptions = group.options.layout;

			modelList.forEach(item => {
				modelGroup.add(item);
			});

			group.layoutCreator.layout(group.node, layoutOptions); // 布局节点
			modelGroupList.push(modelGroup);
		});

		layoutGroupTable.forEach(group => {
			const markerOptions = group.options.marker || {},
				indexLabelOptions = group.options.indexLabel || {};

			const indexLabel = group.appendage.filter(item => item instanceof SVIndexLabel) as SVIndexLabel[],
				freedLabel = group.appendage.filter(item => item instanceof SVFreedLabel) as SVFreedLabel[],
				marker = group.appendage.filter(item => item instanceof SVMarker) as SVMarker[];

			this.layoutIndexLabel(indexLabel, indexLabelOptions);
			this.layoutFreedLabel(freedLabel);
			this.layoutMarker(marker, markerOptions); // 布局外部指针
		});

		return modelGroupList;
	}

	/**
	 * 对所有组进行相互布局
	 * @param modelGroupList
	 * @param layoutMode 水平/垂直
	 */
	private layoutGroups(modelGroupList: Group[], layoutMode: ELayoutMode): Group {
		let wrapperGroup: Group = new Group(),
			group: Group,
			prevBound: BoundingRect,
			bound: BoundingRect,
			boundList: BoundingRect[] = [],
			groupPadding = this.viewOptions.groupPadding,
			dx = 0,
			dy = 0,
			prevCenterX = 0,
			prevCenterY = 0;

		for (let i = 0; i < modelGroupList.length; i++) {
			group = modelGroupList[i];
			bound = group.getPaddingBound(groupPadding);

			// 左往右水平布局
			if (layoutMode === ELayoutMode.HORIZONTAL) {
				if (prevBound) {
					dx = prevBound.x + prevBound.width - bound.x;
					dy = prevCenterY - (bound.y + bound.height / 2);
				} else {
					dx = bound.x;
				}

				group.translate(dx, dy);
				Bound.translate(bound, dx, dy);

				prevCenterY = bound.y + bound.height / 2;
			}

			// 上到下垂直布局
			if (layoutMode === ELayoutMode.VERTICAL) {
				if (prevBound) {
					dx = prevCenterX - (bound.x + bound.width / 2);
					dy = prevBound.y + prevBound.height - bound.y - groupPadding;
				} else {
					dy = bound.y;
				}

				group.translate(dx, dy);
				Bound.translate(bound, dx, dy);

				prevCenterX = bound.x + bound.width / 2;
			}

			boundList.push(bound);
			wrapperGroup.add(group);
			prevBound = bound;
		}

		return wrapperGroup;
	}

	/**
	 * 将视图调整至画布中心
	 * @param models
	 * @param offsetXPercent x方向偏移百分比（正数向右，负数向左）
	 * @param offsetYPercent y方向偏移百分比（正数向下，负数向上）
	 */
	private fitCenter(group: Group, offsetXPercent: number = 0, offsetYPercent: number = 0) {
		let width = this.viewContainer.getG6Instance().getWidth(),
			height = this.viewContainer.getG6Instance().getHeight(),
			viewBound: BoundingRect = group.getBound();

		const centerX = width / 2,
			centerY = height / 2,
			boundCenterX = viewBound.x + viewBound.width / 2;

		let dx = centerX - boundCenterX,
			dy = 0;

		const boundCenterY = viewBound.y + viewBound.height / 2;
		dy = centerY - boundCenterY;

		// 增加x/y百分比偏移
		dx += width * offsetXPercent;
		dy += height * offsetYPercent;

		group.translate(dx, dy);
	}

	/**
	 * 布局
	 * @param layoutGroupTable
	 */
	public layoutAll(layoutGroupTable: LayoutGroupTable, layoutMode: ELayoutMode) {
		this.preLayoutProcess(layoutGroupTable);

		const modelGroupList: Group[] = this.layoutModels(layoutGroupTable);
		const generalGroup: Group = this.layoutGroups(modelGroupList, layoutMode);

		// 根据配置决定是否居中
		if (this.viewOptions.fitCenter !== false) {
			const offsetX = this.viewOptions.centerOffsetXPercent || 0;
			const offsetY = this.viewOptions.centerOffsetYPercent || 0;
			this.fitCenter(generalGroup, offsetX, offsetY);
		}
		this.postLayoutProcess(layoutGroupTable);
	}
}
