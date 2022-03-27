const SOURCES_DATA = [{
    "TriTree0": {
        "data": [{
                "external": [
                    "T"
                ],
                "parent": [
                    "0x0"
                ],
                "child": [
                    "0xfd9ee0",
                    "0xfd9f10"
                ],
                "id": "0xfd9eb0",
                "name": "T",
                "data": "A",
                "root": true,
                "type": "default"
            },
            {
                "child": [
                    "0x0",
                    "0x0"
                ],
                "id": "0xfd9ee0",
                "name": "T->lchild",
                "data": "B",
                "type": "default",
                "l_parent": [
                    "0xfd9eb0"
                ],
                "external": [
                    "T1"
                ]
            },
            {
                "child": [
                    "0x0",
                    "0x0"
                ],
                "id": "0xfd9f10",
                "name": "T->rchild",
                "data": "C",
                "type": "default",
                "r_parent": [
                    "0xfd9eb0"
                ],
                "external": [
                    "T2"
                ]
            }
        ],
        "layouter": "TriTree"
    },
    "TriTree3": {
        "data": [{
            "external": [
                "T3"
            ],
            "parent": [
                "0x0"
            ],
            "child": [
                "0x0",
                "0x0"
            ],
            "id": "0xfd9f40",
            "name": "T3",
            "data": "D",
            "root": true,
            "type": "default"
        }],
        "layouter": "TriTree"
    },
    "TriTree4": {
        "data": [{
            "external": [
                "T4"
            ],
            "parent": [
                "0x0"
            ],
            "child": [
                "0x0",
                "0x0"
            ],
            "id": "0xfd9f70",
            "name": "T4",
            "data": "E",
            "root": true,
            "type": "default"
        }],
        "layouter": "TriTree"
    },
    "handleUpdate": {
        "isEnterFunction": true,
        "isFirstDebug": true
    }
}, {
    "TriTree0": {
        "data": [{
                "external": [
                    "T"
                ],
                "parent": [
                    "0x0"
                ],
                "child": [
                    "0xfd9ee0",
                    "0xfd9f10"
                ],
                "id": "0xfd9eb0",
                "name": "T",
                "data": "A",
                "root": true,
                "type": "default"
            },
            {
                "child": [
                    "0x0",
                    "0x0"
                ],
                "id": "0xfd9ee0",
                "name": "T->lchild",
                "data": "B",
                "type": "default",
                "l_parent": [
                    "0xfd9eb0"
                ],
                "external": [
                    "T1"
                ]
            },
            {
                "child": [
                    "0x0",
                    "0x0"
                ],
                "id": "0xfd9f10",
                "name": "T->rchild",
                "data": "C",
                "type": "default",
                "r_parent": [
                    "0xfd9eb0"
                ],
                "external": [
                    "T2"
                ]
            }
        ],
        "layouter": "TriTree"
    },
    "TriTree3": {
        "data": [{
            "external": [
                "T3"
            ],
            "parent": [
                "0x0"
            ],
            "child": [
                "0x0",
                "0x0"
            ],
            "id": "0xfd9f40",
            "name": "T3",
            "data": "D",
            "root": true,
            "type": "default"
        }],
        "layouter": "TriTree"
    },
    "TriTree4": {
        "data": [{
            "external": [
                "T4"
            ],
            "parent": [
                "0xfd9f40"
            ],
            "child": [
                "0x0",
                "0x0"
            ],
            "id": "0xfd9f70",
            "name": "T4",
            "data": "E",
            "root": true,
            "type": "default"
        }],
        "layouter": "TriTree"
    },
    "handleUpdate": {
        "isEnterFunction": false,
        "isFirstDebug": false
    }
}, {
    "TriTree0": {
        "data": [{
                "external": [
                    "T"
                ],
                "parent": [
                    "0x0"
                ],
                "child": [
                    "0xfd9ee0",
                    "0xfd9f10"
                ],
                "id": "0xfd9eb0",
                "name": "T",
                "data": "A",
                "root": true,
                "type": "default"
            },
            {
                "child": [
                    "0x0",
                    "0x0"
                ],
                "id": "0xfd9ee0",
                "name": "T->lchild",
                "data": "B",
                "type": "default",
                "l_parent": [
                    "0xfd9eb0"
                ],
                "external": [
                    "T1"
                ]
            },
            {
                "child": [
                    "0x0",
                    "0x0"
                ],
                "id": "0xfd9f10",
                "name": "T->rchild",
                "data": "C",
                "type": "default",
                "r_parent": [
                    "0xfd9eb0"
                ],
                "external": [
                    "T2"
                ]
            }
        ],
        "layouter": "TriTree"
    },
    "TriTree3": {
        "data": [{
                "external": [
                    "T3"
                ],
                "parent": [
                    "0x0"
                ],
                "child": [
                    "0xfd9f70",
                    "0x0"
                ],
                "id": "0xfd9f40",
                "name": "T3",
                "data": "D",
                "root": true,
                "type": "default"
            },
            {
                "child": [
                    "0x0",
                    "0x0"
                ],
                "id": "0xfd9f70",
                "name": "T3->lchild",
                "data": "E",
                "type": "default",
                "l_parent": [
                    "0xfd9f40"
                ],
                "external": [
                    "T4"
                ]
            }
        ],
        "layouter": "TriTree"
    },
    "handleUpdate": {
        "isEnterFunction": false,
        "isFirstDebug": false
    }
}];