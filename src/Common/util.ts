import { EdgeConfig, GraphData, NodeConfig, registerNode } from "@antv/g6-core";
import { LayoutGroup, LayoutGroupTable } from "../Model/modelConstructor";
import { SVLink } from "../Model/SVLink";
import { SVModel } from "../Model/SVModel";
import { Util as G6Util } from '@antv/g6';


/**
 * 工具函数
 */
export const Util = {

    /**
     * 生成唯一id
     */
    generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * 乞丐版对象克隆
     * @param obj 
     */
    objectClone<T extends Object>(obj: T): T {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    },

    /**
     * 从列表中移除元素
     * @param list 移除列表
     * @param fn 移除判断规则
     */
    removeFromList<T>(list: T[], fn: (item: T) => boolean): T[] {
        const res: T[] = [];

        for (let i = 0; i < list.length; i++) {
            if (fn(list[i])) {
                let removeItem = list.splice(i, 1);
                res.push(...removeItem);
                i--;
            }
        }

        return res;
    },

    /**
     * 将列表分类
     * @param list 
     * @param category 
     * @returns 
     */
    groupBy<T>(list: T[], category: string): { [key: string]: T[] } {
        const result = {} as { [key: string]: T[] };

        list.forEach(item => {
            let value = item[category];

            if(result[value] === undefined) {
                result[value] = [];
            }

            result[value].push(item);
        });

        return result;
    },

    /**
     * 断言函数
     * @param assertFn 
     * @param errorText 
     */
    assert(condition: boolean, errorText: string): void | never {
        if (condition) {
            throw errorText;
        }
    },

    /**
     * 文本解析
     * @param text 
     */
    textParser(text: string): string[] | string {
        let fieldReg = /\[[^\]]*\]/g;

        if (fieldReg.test(text)) {
            let contents = text.match(fieldReg),
                values = contents.map(item => item.replace(/\[|\]/g, ''));
            return values;
        }
        else {
            return text;
        }
    },

    /**
     * 牵制某个值
     * @param value 
     */
    clamp(value: number, max: number, min: number): number {
        if (value <= max && value >= min) return value;
        if (value > max) return max;
        if (value < min) return min;
    },

    /**
     * 
     * @param groupTable 
     * @returns 
     */
    convertGroupTable2ModelList(groupTable: LayoutGroupTable): SVModel[] {
        const list: SVModel[] = [];

        groupTable.forEach(item => {
            list.push(...item.modelList);
        });

        return list;
    },

    /**
     * 将 modelList 转换到 G6Data
     * @param modelList
     */
    convertModelList2G6Data(modelList: SVModel[]): GraphData {
        return {
            nodes: <NodeConfig[]>(modelList.filter(item => !(item instanceof SVLink)).map(item => item.getG6ModelProps())),
            edges: <EdgeConfig[]>(modelList.filter(item => item instanceof SVLink).map(item => item.getG6ModelProps()))
        }
    },

    /**
     * 计算旋转矩阵
     * @param matrix 
     * @param rotation 
     */
    calcRotateMatrix(matrix: number[], rotation: number): number[] {
        const Mat3 = G6Util.mat3;
        Mat3.rotate(matrix, matrix, rotation);
        return matrix;
    },

    registerShape(shapeName: string, shapeDefinition, extendShapeType?: string) {
        if(!shapeDefinition.update) {
            // 因为大多数节点继承了rect，rect的update有时候会和选定高亮功能有冲突，所以打个补丁
            shapeDefinition.update = undefined;
        }

        return registerNode(shapeName, shapeDefinition, extendShapeType);
    }
};


