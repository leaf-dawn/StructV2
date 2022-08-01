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
    let labelCfg = Util.objectClone<LinkLabelOption>(options.labelOptions || ({} as LinkLabelOption));
    // let labelCfg = this.label? { position: 'middle', autoRotate: true, refY: 7, style: { fontSize: 20, opacity: 0.8 } }
    // : Util.objectClone<LinkLabelOption>(options.labelOptions || ({} as LinkLabelOption));
    
    let freed = this.target.sourceNode.freed;
    // 简陋版：解决图的权值问题和freed结点的问题（因为结点freed后边需要显示‘freed’文本，边的权值也边也需要显示权值文本，这两个的样式有冲突），更好的解决方法（freed自己写实现逻辑，而不是用label的方案显示）
    let label;
    if (freed && this.label) {
      label = this.label + '(freed)';
    } else if(!freed && this.label) {
      label = this.label;
    } else if (freed && !this.label) {
      label = 'freed'
      labelCfg ={ position: 'start', autoRotate: true, refY: 7, refX: 0, style: { fontSize: 11, opacity: 0.8 } }
      console.log(labelCfg);
      
    }

		return {
			id: this.id,
			type: options.type,
			source: this.node.id,
			target: this.target.id,
			sourceAnchor,
			targetAnchor,
			label:label,
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
