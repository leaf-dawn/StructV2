import { INode, NodeConfig, EdgeConfig } from '@antv/g6-core';
import { Bound, BoundingRect } from '../Common/boundingRect';
import { Util } from '../Common/util';
import { AddressLabelOption, IndexLabelOption, MarkerOption, NodeLabelOption, Style } from '../options';
import { SVModel } from './SVModel';
import { SVNode } from './SVNode';

export class SVNodeAppendage extends SVModel {
    public targetId: string;
	public target: SVNode;
    public label: string;

	constructor(id: string, type: string, group: string, layout: string, modelType: string, target: SVNode, label: string | string[]) {
		super(id, type, group, layout, modelType);

		this.target = target;
        this.targetId = target.id;
        this.label = typeof label === 'string' ? label : label.join(', ');

		if (this.target.appendages[modelType] === undefined) {
			this.target.appendages[modelType] = [];
		}

		this.target.appendages[modelType].push(this);
	}

	beforeDestroy(): void {
		const targetAppendageList = this.target.appendages[this.getModelType()];

		if (targetAppendageList) {
            Util.removeFromList(targetAppendageList, item => item.id === this.id);
		}

		this.target = null;
	}

    isEqual(appendage: SVNodeAppendage): boolean {
		return appendage.targetId === this.targetId && appendage.label === this.label;
	}
}

/**
 * 已释放节点下面的文字（“已释放‘）
 */
export class SVFreedLabel extends SVNodeAppendage {
	constructor(id: string, type: string, group: string, layout: string, target: SVNode) {
		super(id, type, group, layout, 'freedLabel', target, '已释放');
		this.G6ModelProps = this.generateG6ModelProps();
	}

	generateG6ModelProps() {
		return {
			id: this.id,
			x: 0,
			y: 0,
			type: 'rect',
			label: this.label,
			labelCfg: {
				style: {
					fill: '#b83b5e',
					opacity: 0.6,
				},
			},
			size: [0, 0],
			style: {
				opacity: 0,
				stroke: null,
				fill: 'transparent',
			},
		};
	}
}

/**
 * 被移动到泄漏区的节点上面显示的地址
 */
export class SVAddressLabel extends SVNodeAppendage {
	constructor(id: string, type: string, group: string, layout: string, target: SVNode, options: AddressLabelOption) {
		super(id, type, group, layout, 'addressLabel', target, target.sourceId);
		this.G6ModelProps = this.generateG6ModelProps(options);
	}

	getBound(): BoundingRect {
		const textBound = this.shadowG6Item.getContainer().getChildren()[1].getBBox(),
			keyBound = this.shadowG6Item.getBBox();
		return {
			x: keyBound.x + textBound.x,
			y: keyBound.y + textBound.y,
			width: textBound.width,
			height: textBound.height,
		};
	}

	generateG6ModelProps(options: AddressLabelOption) {
		return {
			id: this.id,
			x: 0,
			y: 0,
			type: 'rect',
			label: this.label,
			labelCfg: {
				style: {
					fill: '#666',
					fontSize: 16,
					...options.style,
				},
			},
			size: [0, 0],
			style: {
				stroke: null,
				fill: 'transparent',
			},
		};
	}
}

/**
 * 节点的下标文字
 */
export class SVIndexLabel extends SVNodeAppendage {
	constructor(
		id: string,
		indexName: string,
		group: string,
		layout: string,
		value: string,
		target: SVNode,
		options: IndexLabelOption
	) {
		super(id, indexName, group, layout, 'indexLabel', target, value);
		this.G6ModelProps = this.generateG6ModelProps(options) as NodeConfig;
	}

	generateG6ModelProps(options: IndexLabelOption): NodeConfig | EdgeConfig {
		return {
			id: this.id,
			x: 0,
			y: 0,
			type: 'rect',
			label: this.label,
			labelCfg: {
				style: {
					fill: '#bbb',
					textAlign: 'center',
					textBaseline: 'middle',
					fontSize: 14,
					fontStyle: 'italic',
					...options.style,
				},
			},
			size: [0, 0],
			style: {
				stroke: null,
				fill: 'transparent',
			},
		};
	}
}

/**
 * 外部指针
 */
export class SVMarker extends SVNodeAppendage {
	public anchor: number;

	public shadowG6Item: INode;
	public G6Item: INode;

	constructor(
		id: string,
		type: string,
		group: string,
		layout: string,
		label: string | string[],
		target: SVNode,
		options: MarkerOption
	) {
		super(id, type, group, layout, 'marker', target, label);
		this.G6ModelProps = this.generateG6ModelProps(options);
	}

	generateG6ModelProps(options: MarkerOption): NodeConfig {
		this.anchor = options.anchor;

		const type = options.type,
			defaultSize: [number, number] = type === 'pointer' ? [8, 30] : [12, 12];

		return {
			id: this.id,
			x: 0,
			y: 0,
			rotation: 0,
			type: options.type || 'marker',
			size: options.size || defaultSize,
			anchorPoints: null,
			label: this.label,
			style: Util.objectClone<Style>(options.style),
			labelCfg: Util.objectClone<NodeLabelOption>(options.labelOptions),
            targetSourceNode: this.target.sourceNode
		};
	}

	public getLabelSizeRadius(): number {
		const { width, height } = this.shadowG6Item.getContainer().getChildren()[2].getBBox();
		return Math.max(width, height);
	}
}
