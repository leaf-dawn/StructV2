/*
 * @Author: your name
 * @Date: 2022-01-26 01:58:25
 * @LastEditTime: 2022-01-26 02:06:16
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \测试数据c:\Users\13127\Desktop\最近的前端文件\可视化0126\StructV2\src\StructV.ts
 */
import { Engine } from "./engine";
import { Bound } from "./Common/boundingRect";
import { Group } from "./Common/group";
import G6 from '@antv/g6';
import Pointer from "./RegisteredShape/pointer";
import LinkListNode from "./RegisteredShape/linkListNode";
import BinaryTreeNode from "./RegisteredShape/binaryTreeNode";
import ForceNode from "./RegisteredShape/force";
import TriTreeNode from "./RegisteredShape/triTreeNode";
import IntendedTreeNode from "./RegisteredShape/intendedTreeNode";
import CLenQueuePointer from "./RegisteredShape/clenQueuePointer";
import ThreeCellNode from "./RegisteredShape/threeCellNode";
import ArrayNode from "./RegisteredShape/arrayNode";
import BarChartNode from "./RegisteredShape/barChartNode";
import Cursor from "./RegisteredShape/cursor";
import { Vector } from "./Common/vector";
import { EngineOptions, LayoutCreator } from "./options";
import { SourceNode } from "./sources";
import { Util } from "./Common/util";
import { SVNode } from "./Model/SVNode";




export interface StructV {
    (DOMContainer: HTMLElement, engineOptions: EngineOptions, isForce: boolean): Engine;
    Group: typeof Group;
    Bound: typeof Bound;
    Vector: typeof Vector,
    Mat3: any;
    G6: any;

    registeredShape: any[];

    registeredLayout: { [key: string]: LayoutCreator },

    registerShape: Function,

    /**
     * 注册一个布局器
     * @param name 
     * @param layout
     */
    registerLayout(name: string, layoutCreator: LayoutCreator);
}


export const SV: StructV = function(DOMContainer: HTMLElement, engineOptions: EngineOptions = { }, isForce: boolean) {
    return new Engine(DOMContainer, engineOptions, isForce);
}

SV.Group = Group;
SV.Bound = Bound;
SV.Vector = Vector;
SV.Mat3 = G6.Util.mat3;
SV.G6 = G6;

SV.registeredLayout = {};
SV.registeredShape = [
    Pointer, 
    LinkListNode, 
    BinaryTreeNode, 
    TriTreeNode,
    ThreeCellNode,
    Cursor,
    ArrayNode,
    BarChartNode,
    CLenQueuePointer,
    ForceNode,
    IntendedTreeNode
];

SV.registerShape = Util.registerShape;
SV.registerLayout = function(name: string, layoutCreator: LayoutCreator) {

    if(typeof layoutCreator.sourcesPreprocess !== 'function') {
        layoutCreator.sourcesPreprocess = function(data: SourceNode[]): SourceNode[] {
            return data;
        }
    }

    if(typeof layoutCreator.defineOptions !== 'function' || typeof layoutCreator.layout !== 'function') {
        return;
    }
    
    SV.registeredLayout[name] = layoutCreator;
    
};

