import { EdgeConfig, IEdge } from "@antv/g6-core";
import { Util } from "../Common/util";
import { LinkLabelOption, LinkOption, Style } from "../options";
import { SVModel } from "./SVModel";
import { SVNode } from "./SVNode";

export class SVLink extends SVModel { 
    public node: SVNode;
    public target: SVNode;
    public linkIndex: number;

    public shadowG6Item: IEdge;
    public G6Item: IEdge;

    constructor(id: string, type: string, group: string, layout: string, node: SVNode, target: SVNode, index: number, options: LinkOption) { 
        super(id, type, group, layout);

        this.node = node;
        this.target = target;
        this.linkIndex = index;

        node.links.outDegree.push(this);
        target.links.inDegree.push(this);
        this.G6ModelProps = this.generateG6ModelProps(options);
    }


    protected generateG6ModelProps(options: LinkOption): EdgeConfig {
        let sourceAnchor = options.sourceAnchor, 
            targetAnchor = options.targetAnchor;

        if(options.sourceAnchor && typeof options.sourceAnchor === 'function' && this.linkIndex !== null) {
            sourceAnchor = options.sourceAnchor(this.linkIndex);
        }

        if(options.targetAnchor && typeof options.targetAnchor === 'function' && this.linkIndex !== null) {
            targetAnchor = options.targetAnchor(this.linkIndex);
        }

        return {
            id: this.id,
            type: options.type,
            source: this.node.id,
            target: this.target.id,
            sourceAnchor,
            targetAnchor,
            label: options.label,
            style: Util.objectClone<Style>(options.style),
            labelCfg: Util.objectClone<LinkLabelOption>(options.labelOptions),
            curveOffset: options.curveOffset
        };
    }
};
