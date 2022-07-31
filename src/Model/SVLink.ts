import { EdgeConfig, IEdge } from '@antv/g6-core';
import { Util } from '../Common/util';
import { LinkLabelOption, LinkOption, Style } from '../options';
import { SVModel } from './SVModel';
import { SVNode } from './SVNode';

export class SVLink extends SVModel {
	public node: SVNode;
	public target: SVNode;
  public label: string; //边的权值
	public linkIndex: number;

	public shadowG6Item: IEdge;
	public G6Item: IEdge;

	public nodeId: string;
	public targetId: string;

	constructor(
		id: string,
		type: string,
		group: string,
		layout: string,
		node: SVNode,
		target: SVNode,
		index: number,
		options: LinkOption,
    label: string,
	) {
		super(id, type, group, layout, 'link');

    console.log(id);
    
		this.node = node;
		this.target = target;
		this.nodeId = node.id;
		this.targetId = target.id;
		this.linkIndex = index;
    this.label = label; //边的权值

		node.links.outDegree.push(this);
		target.links.inDegree.push(this);
		this.G6ModelProps = this.generateG6ModelProps(options);
	}

	generateG6ModelProps(options: LinkOption): EdgeConfig {
		let sourceAnchor = options.sourceAnchor,
			targetAnchor = options.targetAnchor;

		if (options.sourceAnchor && typeof options.sourceAnchor === 'function' && this.linkIndex !== null) {
			sourceAnchor = options.sourceAnchor(this.linkIndex);
		}

		if (options.targetAnchor && typeof options.targetAnchor === 'function' && this.linkIndex !== null) {
			targetAnchor = options.targetAnchor(this.linkIndex);
		}
    let labelCfg = this.label? { position: 'middle', autoRotate: true, refY: 7, style: { fontSize: 20, opacity: 0.8 } }
    : Util.objectClone<LinkLabelOption>(options.labelOptions || ({} as LinkLabelOption));
    

		// let label = this.target.sourceNode.freed ? 'freed' : '',
		// 	labelCfg = this.target.sourceNode.freed
		// 		? { position: 'start', autoRotate: true, refY: 7, style: { fontSize: 11, opacity: 0.8 } }
		// 		: Util.objectClone<LinkLabelOption>(options.labelOptions || ({} as LinkLabelOption));

		return {
			id: this.id,
			type: options.type,
			source: this.node.id,
			target: this.target.id,
			sourceAnchor,
			targetAnchor,
			label:this.label,
			style: Util.objectClone<Style>(options.style),
			labelCfg,
			curveOffset: options.curveOffset,
      loopCfg: options.loopCfg,
		};
	}

	triggerHighlight(changeHighlightColor: string) {
		this.originStyle = Util.objectClone(this.G6ModelProps.style);
		this.set('style', {
			stroke: changeHighlightColor,
		});
	}

	isEqual(link: SVLink): boolean {
		return (link.sourceType.toLowerCase().includes(this.sourceType.toLocaleLowerCase())|| this.sourceType.toLowerCase().includes(link.sourceType.toLowerCase())) && link.targetId === this.targetId && link.nodeId === this.nodeId && link.linkIndex === this.linkIndex;
	}

	beforeDestroy(): void {
		Util.removeFromList(this.target.links.inDegree, item => item.id === this.id);
		Util.removeFromList(this.node.links.outDegree, item => item.id === this.id);
		this.node = null;
		this.target = null;
	}
}
