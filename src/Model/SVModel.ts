import { Util } from "../Common/util";
import { ModelOption, Style } from "../options";
import { BoundingRect } from "../Common/boundingRect";
import { EdgeConfig, Item, NodeConfig } from "@antv/g6-core";
import { Point } from "@antv/g-base";





export class SVModel {
    public id: string;
    public sourceType: string;
    
    public group: string;
    public layout: string;
    public G6ModelProps: NodeConfig | EdgeConfig;
    public shadowG6Item: Item;
    public G6Item: Item;

    public discarded: boolean;
    public freed: boolean;
    public leaked: boolean;
    public generalStyle: Partial<Style>;

    private transformMatrix: number[];
    private modelType: string;

    constructor(id: string, type: string, group: string, layout: string, modelType: string) { 
        this.id = id;
        this.sourceType = type;
        this.group = group;
        this.layout = layout;
        this.shadowG6Item = null;
        this.G6Item = null;
        this.discarded = false;
        this.freed = false;
        this.leaked = false;
        this.transformMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        this.modelType = modelType;
    }

    /**
     * @override
     * 定义 G6 model 的属性
     * @param option 
     */
    protected generateG6ModelProps(options: ModelOption) {
        return null;
    }

    /**
     * 获取 G6 model 的属性
     * @param attr 
     */
    get(attr: string): any {
        return this.G6ModelProps[attr];
    }

    /**
     * 设置 G6 model 的属性
     * @param attr 
     * @param value 
     * @returns 
     */
    set(attr: string | object, value?: any) {
        if(this.discarded) {
            return;
        }

        if(typeof attr === 'object') {
            Object.keys(attr).map(item => {
                this.set(item, attr[item]);
            });
            return;
        }

        if(this.G6ModelProps[attr] === value) {
            return;
        }

        if(attr === 'style' || attr === 'labelCfg') {
            Object.assign(this.G6ModelProps[attr], value);
        }
        else {
            this.G6ModelProps[attr] = value;
        }

        if(attr === 'rotation') {
            const matrix = Util.calcRotateMatrix(this.getMatrix(), value);
            this.setMatrix(matrix);
        }

        // 更新G6Item
        if(this.G6Item) {
            if(attr === 'x' || attr === 'y') {
                this.G6Item.updatePosition({ [attr]: value } as Point);
                this.G6Item.refresh();
            }
            else {
                this.G6Item.update(this.G6ModelProps);
            }
        }

        // 更新shadowG6Item
        if(this.shadowG6Item) {
            if(attr === 'x' || attr === 'y') {
                this.shadowG6Item.updatePosition({ [attr]: value } as Point);
                this.shadowG6Item.refresh();
            }
            else {
                this.shadowG6Item.update(this.G6ModelProps);
            }
        }
    }

    /**
     * 获取包围盒
     * @returns 
     */
    getBound(): BoundingRect {
        return this.shadowG6Item.getBBox();
    }

    /**
     * 获取变换矩阵
     */
    getMatrix(): number[] {
        return [...this.transformMatrix];
    }
    
    /**
     * 设置变换矩阵
     * @param matrix 
     */
    setMatrix(matrix: number[]) {
        this.transformMatrix = matrix;
        this.set('style', { matrix });
    }

    /**
     * 
     * @returns 
     */
    getG6ModelProps(): NodeConfig | EdgeConfig {
        return Util.objectClone(this.G6ModelProps);
    }

    /**
     * 获取 model 类型
     * @returns 
     */
    getModelType(): string {
        return this.modelType;
    }

    /**
     * 判断是否为节点model（SVNode）
     */
    isNode(): boolean {
        return false;
    }
}

















