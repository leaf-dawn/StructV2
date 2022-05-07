import { INode, NodeConfig } from '@antv/g6-core';
import { Util } from '../Common/util';
import { NodeLabelOption, NodeOption, Style } from '../options';
import { SourceNode } from '../sources';
import { ModelConstructor } from './modelConstructor';
import { SVLink } from './SVLink';
import { SVModel } from './SVModel';
import { SVNodeAppendage } from './SVNodeAppendage';

export class SVNode extends SVModel {
	public sourceId: string;
	public sourceNode: SourceNode;
	public links: {
		inDegree: SVLink[];
		outDegree: SVLink[];
	};

	private label: string | string[];
	public appendages: { [key: string]: SVNodeAppendage[] };

	constructor(
		id: string,
		type: string,
		group: string,
		layout: string,
		sourceNode: SourceNode,
		label: string | string[],
		options: NodeOption
	) {
		super(id, type, group, layout, 'node');

		this.group = group;
		this.layout = layout;

		Object.keys(sourceNode).map(prop => {
			if (prop !== 'id') {
				this[prop] = sourceNode[prop];
			}
		});

		this.sourceNode = sourceNode;
		this.sourceId = sourceNode.id.toString();
    
		this.links = { inDegree: [], outDegree: [] };
		this.appendages = {};
		this.sourceNode = sourceNode;
		this.label = label;
		this.G6ModelProps = this.generateG6ModelProps(options);
	}

	generateG6ModelProps(options: NodeOption): NodeConfig {
		const style = Util.objectClone<Style>(options.style);

		return {
			...this.sourceNode,
			id: this.id,
			x: 0,
			y: 0,
			rotation: options.rotation || 0,
			type: options.type,
			size: options.size || [60, 30],
			anchorPoints: options.anchorPoints,
			label: this.label as string,
			style: {
				...style,
			},
			labelCfg: Util.objectClone<NodeLabelOption>(options.labelOptions),
		};
	}

	isNode(): boolean {
		return true;
	}

	/**
	 * 设置是否被选中的状态
	 * @param isSelected
	 */
	setSelectedState(isSelected: boolean) {
		if (this.G6Item === null) {
			return;
		}

		this.G6Item.setState('selected', isSelected);
		this.getAppendagesList().forEach(item => {
			item.setSelectedState(isSelected);
		});
	}

	getSourceId(): string {
		return this.sourceId;
	}

    getAppendagesList(): SVNodeAppendage[] {
        const list = [];

        Object.entries(this.appendages).forEach(item => {
            list.push(...item[1]);
        });

        return list;
    }

	/**
	 * 判断这个节点是否来自相同group
	 * @param node
	 */
	isSameGroup(node: SVNode): boolean {
        return ModelConstructor.isSameGroup(this, node);
    }

    beforeDestroy(): void {
        this.sourceNode = null;
        this.links.inDegree.length = 0;
        this.links.outDegree.length = 0;
        this.appendages = {};
    }
}
