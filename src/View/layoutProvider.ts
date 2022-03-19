import { IPoint, INode } from '@antv/g6-core';
import { Bound, BoundingRect } from '../Common/boundingRect';
import { Group } from '../Common/group';
import { Util } from '../Common/util';
import { Vector } from '../Common/vector';
import { Engine } from '../engine';
import { LayoutGroupTable, ModelConstructor } from '../Model/modelConstructor';
import { SVModel } from '../Model/SVModel';
import { SVAddressLabel, SVFreedLabel, SVIndexLabel, SVMarker } from '../Model/SVNodeAppendage';
import { AddressLabelOption, IndexLabelOption, LayoutOptions, MarkerOption, ViewOptions } from '../options';
import { ViewContainer } from './viewContainer';

export class LayoutProvider {
	private engine: Engine;
	private viewOptions: ViewOptions;
	private viewContainer: ViewContainer;
	private leakAreaXoffset: number = 20;
	private leakClusterXInterval = 25;

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
	 * @param marker
	 * @param markerOptions
	 */
	private layoutMarker(markers: SVMarker[], markerOptions: { [key: string]: MarkerOption }) {
		markers.forEach(item => {
			const options: MarkerOption = markerOptions[item.sourceType],
				offset = options.offset ?? 8,
				anchor = item.anchor ?? 0,
				labelOffset = options.labelOffset ?? 2;

			let target = item.target,
				targetBound: BoundingRect = target.getBound(),
				g6AnchorPosition = (<INode>item.target.shadowG6Item).getAnchorPoints()[anchor] as IPoint,
				center: [number, number] = [
					targetBound.x + targetBound.width / 2,
					targetBound.y + targetBound.height / 2,
				],
				markerPosition: [number, number],
				markerEndPosition: [number, number];

			let anchorPosition: [number, number] = [g6AnchorPosition.x, g6AnchorPosition.y];

			let anchorVector = Vector.subtract(anchorPosition, center),
				angle = 0,
				len = Vector.length(anchorVector) + offset;

			if (anchorVector[0] === 0) {
				angle = anchorVector[1] > 0 ? -Math.PI : 0;
			} else {
				angle = Math.sign(anchorVector[0]) * (Math.PI / 2 - Math.atan(anchorVector[1] / anchorVector[0]));
			}

			const markerHeight = item.get('size')[1],
				labelRadius = item.getLabelSizeRadius() / 2;

			anchorVector = Vector.normalize(anchorVector);
			markerPosition = Vector.location(center, anchorVector, len);
			markerEndPosition = Vector.location(center, anchorVector, markerHeight + len + labelRadius + labelOffset);
			markerEndPosition = Vector.subtract(markerEndPosition, markerPosition);

			item.set({
				x: markerPosition[0],
				y: markerPosition[1],
				rotation: angle,
				markerEndPosition,
			});
		});
	}

	/**
	 * 布局节点的‘已释放’文本
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
					x: nodeBound.x - labelBound.width / 2- offset,
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
	 * 布局泄漏区节点上面的address label
	 * @param leakAddress
	 */
	private layoutAddressLabel(leakAddress: SVAddressLabel[], addressLabelOption: AddressLabelOption) {
		const offset = addressLabelOption.offset || 16;

		leakAddress.forEach(item => {
			const nodeBound = item.target.getBound();

			item.set({
				x: nodeBound.x + nodeBound.width / 2,
				y: nodeBound.y - offset,
			});
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
				indexLabelOptions = group.options.indexLabel || {},
				addressLabelOption = group.options.addressLabel || {};

			const indexLabel = group.appendage.filter(item => item instanceof SVIndexLabel) as SVIndexLabel[],
				freedLabel = group.appendage.filter(item => item instanceof SVFreedLabel) as SVFreedLabel[],
				addressLabel = group.appendage.filter(item => item instanceof SVAddressLabel) as SVAddressLabel[],
				marker = group.appendage.filter(item => item instanceof SVMarker) as SVMarker[];

			this.layoutIndexLabel(indexLabel, indexLabelOptions);
			this.layoutFreedLabel(freedLabel);
			this.layoutAddressLabel(addressLabel, addressLabelOption);
			this.layoutMarker(marker, markerOptions); // 布局外部指针
		});

		return modelGroupList;
	}

	/**
	 * 对泄漏区进行布局
	 * @param accumulateLeakModels
	 * // todo: 部分元素被抽离后的泄漏区
	 */
	private layoutLeakArea(accumulateLeakModels: SVModel[]) {
		const containerHeight = this.viewContainer.getG6Instance().getHeight(),
			leakAreaHeight = this.engine.viewOptions.leakAreaHeight,
			leakAreaY = containerHeight - leakAreaHeight;

		let prevBound: BoundingRect;

		// 避免在泄漏前拖拽节点导致的位置变化，先把节点位置重置为布局后的标准位置
		accumulateLeakModels.forEach(item => {
			item.set({
				x: item.layoutX,
				y: item.layoutY,
			});
		});

		const clusters = ModelConstructor.getClusters(accumulateLeakModels);

        // 每一个簇从左往右布局就完事了，比之前的方法简单稳定很多
		clusters.forEach(item => {
			const bound = item.getBound(),
				x = prevBound ? prevBound.x + prevBound.width + this.leakClusterXInterval : this.leakAreaXoffset,
				dx = x - bound.x,
				dy = leakAreaY - bound.y;

			item.translate(dx, dy);
			Bound.translate(bound, dx, dy);
			prevBound = bound;
		});
	}

	/**
	 * 对所有组进行相互布局
	 * @param modelGroupTable
	 */
	private layoutGroups(modelGroupList: Group[]): Group {
		let wrapperGroup: Group = new Group(),
			group: Group,
			prevBound: BoundingRect,
			bound: BoundingRect,
			boundList: BoundingRect[] = [],
			dx = 0;

		// 左往右布局
		for (let i = 0; i < modelGroupList.length; i++) {
			group = modelGroupList[i];
			bound = group.getPaddingBound(this.viewOptions.groupPadding);

			if (prevBound) {
				dx = prevBound.x + prevBound.width - bound.x;
			} else {
				dx = bound.x;
			}

			group.translate(dx, 0);
			Bound.translate(bound, dx, 0);
			boundList.push(bound);
			wrapperGroup.add(group);
			prevBound = bound;
		}

		return wrapperGroup;
	}

	/**
	 * 将视图调整至画布中心
	 * @param models
	 * @param leakAreaHeight
	 */
	private fitCenter(group: Group) {
		let width = this.viewContainer.getG6Instance().getWidth(),
			height = this.viewContainer.getG6Instance().getHeight(),
			viewBound: BoundingRect = group.getBound(),
			leakAreaHeight = this.engine.viewOptions.leakAreaHeight;

		const centerX = width / 2,
			centerY = height / 2,
			boundCenterX = viewBound.x + viewBound.width / 2;

		let dx = centerX - boundCenterX,
			dy = 0;

		if (this.viewContainer.hasLeak) {
			const boundBottomY = viewBound.y + viewBound.height;
			dy = height - leakAreaHeight - 130 - boundBottomY;
		} else {
			const boundCenterY = viewBound.y + viewBound.height / 2;
			dy = centerY - boundCenterY;
		}

		group.translate(dx, dy);
	}

	/**
	 * 布局
	 * @param layoutGroupTable
	 * @param accumulateLeakModels
	 */
	public layoutAll(layoutGroupTable: LayoutGroupTable, accumulateLeakModels: SVModel[]) {
		this.preLayoutProcess(layoutGroupTable);

		const modelGroupList: Group[] = this.layoutModels(layoutGroupTable);
		const generalGroup: Group = this.layoutGroups(modelGroupList);

		this.layoutLeakArea(accumulateLeakModels);

		this.fitCenter(generalGroup);
		this.postLayoutProcess(layoutGroupTable);
	}
}
