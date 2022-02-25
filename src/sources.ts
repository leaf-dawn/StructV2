
// 连接目标信息
export type LinkTarget = number | string;

// 结点连接声明
export type sourceLinkData = LinkTarget | LinkTarget[];

// 结点指针声明
export type sourceMarkerData = string | string[];

// 源数据单元
export interface SourceNode {
    id: string | number;
    [key: string]: any | sourceLinkData | sourceMarkerData;
}


export type Sources = {
    enterFunction: any;
    [key: string]: { 
        data: SourceNode[]; 
        layouter: string; 
    };
    isEnterFunction?: any;
};
    


