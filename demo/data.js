const SOURCES_DATA = [
    {
        Link: {
            "data": [{
                "id": "0x1",
                "data": "A",
                "next": "0x2",
            },
            { 
                "id": "0x2",
                "data": "B",
                "next": "0x3",
            },
            { 
                "id": "0x3",
                "data": "C",
                "next": "0x4",
            },
            { 
                "id": "0x4",
                "data": "D",
                "next": "",
            }],
            "layouter": "Link"
        }
    },
    {
        BinaryTree: {
            "data": [{
                "id": "1",
                "data": "A",
                "child": ["2", "3"]
            },
            {
                "id": "2",
                "data": "B",
                "child": ["4", "5"]
            },
            {
                "id": "3",
                "data": "C",
                "child": ["6", "7"]
            },
            {
                "id": "4",
                "data": "D",
                "child": []
            },
            {
                "id": "5",
                "data": "E",
                "child": []
            },
            {
                "id": "6",
                "data": "F",
                "child": []
            },
            {
                "id": "7",
                "data": "G",
                "child": []
            }],
            "layouter": "BinaryTree"
        }
    },
    {
        TriTree: {
            "data": [{
                "id": "1",
                "data": "A",
                "child": ["2", "3", "4"]
            },
            {
                "id": "2",
                "data": "B",
                "child": ["5", "6", "7"]
            },
            {
                "id": "3",
                "data": "C",
                "child": ["8", "9", "10"]
            },
            {
                "id": "4",
                "data": "D",
                "child": ["11", "12", "13"]
            },
            {
                "id": "5",
                "data": "E",
                "child": []
            },
            {
                "id": "6",
                "data": "F",
                "child": []
            },
            {
                "id": "7",
                "data": "G",
                "child": []
            },
            {
                "id": "8",
                "data": "H",
                "child": []
            },
            {
                "id": "9",
                "data": "I",
                "child": []
            },
            {
                "id": "10",
                "data": "J",
                "child": []
            },
            {
                "id": "11",
                "data": "K",
                "child": []
            },
            {
                "id": "12",
                "data": "L",
                "child": []
            },
            {
                "id": "13",
                "data": "M",
                "child": []
            }],
            "layouter": "TriTree"
        }
    },
    {
        Stack: {
            "data": [{
                "id": "1",
                "data": "A",
                "next": "2"
            },
            {
                "id": "2",
                "data": "B",
                "next": "3"
            },
            {
                "id": "3",
                "data": "C",
                "next": "4"
            },
            {
                "id": "4",
                "data": "D",
                "next": ""
            }],
            "layouter": "Stack"
        }
    },
    {
        LinkQueue: {
            "data": [{
                "id": "1",
                "data": "A",
                "next": "2"
            },
            {
                "id": "2",
                "data": "B",
                "next": "3"
            },
            {
                "id": "3",
                "data": "C",
                "next": "4"
            },
            {
                "id": "4",
                "data": "D",
                "next": ""
            }],
            "layouter": "LinkQueue"
        }
    },
    {
        LinkStack: {
            "data": [{
                "id": "1",
                "data": "A",
                "next": "2"
            },
            {
                "id": "2",
                "data": "B",
                "next": "3"
            },
            {
                "id": "3",
                "data": "C",
                "next": "4"
            },
            {
                "id": "4",
                "data": "D",
                "next": ""
            }],
            "layouter": "LinkStack"
        }
    },
    {
        SqQueue: {
            "data": [{
                "id": "1",
                "data": "A",
                "next": "2"
            },
            {
                "id": "2",
                "data": "B",
                "next": "3"
            },
            {
                "id": "3",
                "data": "C",
                "next": "4"
            },
            {
                "id": "4",
                "data": "D",
                "next": "5"
            },
            {
                "id": "5",
                "data": "E",
                "next": "6"
            },
            {
                "id": "6",
                "data": "F",
                "next": ""
            }],
            "layouter": "SqQueue"
        }
    },
    {
        Array: {
            "data": [{
                "id": "0",
                "data": "A",
                "index": 0
            },
            {
                "id": "1",
                "data": "B",
                "index": 1
            },
            {
                "id": "2",
                "data": "C",
                "index": 2
            },
            {
                "id": "3",
                "data": "D",
                "index": 3
            },
            {
                "id": "4",
                "data": "E",
                "index": 4
            }],
            "layouter": "Array"
        }
    },
    {
        BarChart: {
            "data": [{
                "id": "bar1",
                "value": 10,
                "data": "10",
                "index": 0,
                "external": "a"
            },
            { 
                "id": "bar2",
                "value": 45,
                "data": "45",
                "index": 1,
            },
            { 
                "id": "bar3",
                "value": 60,
                "data": "60",
                "index": 2,
            },
            { 
                "id": "bar4",
                "value": 30,
                "data": "30",
                "index": 3,
            },
            { 
                "id": "bar5",
                "value": 80,
                "data": "80",
                "index": 4,
            }],
            "layouter": "BarChart"
        }
    },
    {
        HashTable: {
            "data": [{
                "id": "0",
                "data": "A",
                "index": 0
            },
            {
                "id": "1",
                "data": "B",
                "index": 1
            },
            {
                "id": "2",
                "data": "C",
                "index": 2
            },
            {
                "id": "3",
                "data": "D",
                "index": 3
            },
            {
                "id": "4",
                "data": "E",
                "index": 4
            }],
            "layouter": "HashTable"
        }
    },
    {
        ChainHashTable: {
            "data": [{
                "id": "0",
                "data": "A",
                "index": 0,
                "next": "1"
            },
            {
                "id": "1",
                "data": "B",
                "index": 1,
                "next": "2"
            },
            {
                "id": "2",
                "data": "C",
                "index": 2,
                "next": ""
            },
            {
                "id": "3",
                "data": "D",
                "index": 3,
                "next": "4"
            },
            {
                "id": "4",
                "data": "E",
                "index": 4,
                "next": ""
            }],
            "layouter": "ChainHashTable"
        }
    },
    {
        GeneralizedList: {
            "data": [{
                "id": "1",
                "data": "A",
                "child": ["2", "3"]
            },
            {
                "id": "2",
                "data": "B",
                "child": ["4", "5"]
            },
            {
                "id": "3",
                "data": "C",
                "child": ["6", "7"]
            },
            {
                "id": "4",
                "data": "D",
                "child": []
            },
            {
                "id": "5",
                "data": "E",
                "child": []
            },
            {
                "id": "6",
                "data": "F",
                "child": []
            },
            {
                "id": "7",
                "data": "G",
                "child": []
            }],
            "layouter": "GeneralizedList"
        }
    },
    {
        PTree: {
            "data": [{
                "id": "1",
                "data": "A",
                "child": ["2", "3"]
            },
            {
                "id": "2",
                "data": "B",
                "child": ["4", "5"]
            },
            {
                "id": "3",
                "data": "C",
                "child": ["6", "7"]
            },
            {
                "id": "4",
                "data": "D",
                "child": []
            },
            {
                "id": "5",
                "data": "E",
                "child": []
            },
            {
                "id": "6",
                "data": "F",
                "child": []
            },
            {
                "id": "7",
                "data": "G",
                "child": []
            }],
            "layouter": "PTree"
        }
    },
    {
        PCTree: {
            "data": [{
                "id": "1",
                "data": "A",
                "child": ["2", "3"]
            },
            {
                "id": "2",
                "data": "B",
                "child": ["4", "5"]
            },
            {
                "id": "3",
                "data": "C",
                "child": ["6", "7"]
            },
            {
                "id": "4",
                "data": "D",
                "child": []
            },
            {
                "id": "5",
                "data": "E",
                "child": []
            },
            {
                "id": "6",
                "data": "F",
                "child": []
            },
            {
                "id": "7",
                "data": "G",
                "child": []
            }],
            "layouter": "PCTree"
        }
    },
    {
        Indented: {
            "data": [{
                "id": "1",
                "data": "A",
                "child": ["2", "3"]
            },
            {
                "id": "2",
                "data": "B",
                "child": ["4", "5"]
            },
            {
                "id": "3",
                "data": "C",
                "child": ["6", "7"]
            },
            {
                "id": "4",
                "data": "D",
                "child": []
            },
            {
                "id": "5",
                "data": "E",
                "child": []
            },
            {
                "id": "6",
                "data": "F",
                "child": []
            },
            {
                "id": "7",
                "data": "G",
                "child": []
            }],
            "layouter": "Indented"
        }
    },
    {
        AdjoinMatrixGraph: {
            "data": [{
                "id": "A",
                "data": "A",
                "index": 0
            },
            {
                "id": "B",
                "data": "B",
                "index": 1
            },
            {
                "id": "C",
                "data": "C",
                "index": 2
            },
            {
                "id": "D",
                "data": "D",
                "index": 3
            }],
            "matrix": [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [0, 1, 1, 0]
            ],
            "layouter": "AdjoinMatrixGraph"
        }
    },
    {
        DirectedAdjoinMatrixGraph: {
            "data": [{
                "id": "A",
                "data": "A",
                "index": 0
            },
            {
                "id": "B",
                "data": "B",
                "index": 1
            },
            {
                "id": "C",
                "data": "C",
                "index": 2
            },
            {
                "id": "D",
                "data": "D",
                "index": 3
            }],
            "matrix": [
                [0, 1, 1, 0],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 0]
            ],
            "layouter": "DirectedAdjoinMatrixGraph"
        }
    },
    {
        AdjoinTableGraph: {
            "data": [{
                "id": "A",
                "data": "A",
                "index": 0
            },
            {
                "id": "B",
                "data": "B",
                "index": 1
            },
            {
                "id": "C",
                "data": "C",
                "index": 2
            },
            {
                "id": "D",
                "data": "D",
                "index": 3
            }],
            "table": [
                ["B", "C"],
                ["A", "D"],
                ["A", "D"],
                ["B", "C"]
            ],
            "layouter": "AdjoinTableGraph"
        }
    },
    {
        Force: {
            "data": [{
                "id": "A",
                "data": "A"
            },
            {
                "id": "B",
                "data": "B"
            },
            {
                "id": "C",
                "data": "C"
            },
            {
                "id": "D",
                "data": "D"
            }],
            "links": [
                {"source": "A", "target": "B"},
                {"source": "A", "target": "C"},
                {"source": "B", "target": "D"},
                {"source": "C", "target": "D"}
            ],
            "layouter": "Force"
        }
    }
];

// 数据结构名称映射
const STRUCTURE_NAMES = {
    'Link': '链表',
    'BinaryTree': '二叉树',
    'TriTree': '三叉树',
    'Stack': '栈',
    'LinkQueue': '链队列',
    'LinkStack': '链栈',
    'SqQueue': '顺序队列',
    'Array': '数组',
    'BarChart': '柱状图',
    'HashTable': '哈希表',
    'ChainHashTable': '链式哈希表',
    'GeneralizedList': '广义表',
    'PTree': 'P树',
    'PCTree': 'PC树',
    'Indented': '缩进树',
    'AdjoinMatrixGraph': '邻接矩阵图',
    'DirectedAdjoinMatrixGraph': '有向邻接矩阵图',
    'AdjoinTableGraph': '邻接表图',
    'Force': '力导向图'
};

console.log('数据结构数据已加载:', SOURCES_DATA.length, '种结构');