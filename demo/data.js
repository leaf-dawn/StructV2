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
}, {
    "force0": {
        "data": [
            {
                "id": "0x617eb1",
                "data": "A",
                "next": "0x617eb2"
            },
            {
                "id": "0x617eb2",
                "data": "B",
                "next": "0x617eb3"
            },
            {
                "id": "0x617eb3",
                "data": "C",
                "next": "0x617eb5"
            },
            {
                "id": "0x617eb5",
                "data": "D",
                "next": "0x617eb3" 
            },
            {
                "id": "0x617eb6",
                "data": "D",
                "next": "0x617eb5" 
            },
            {
                "id": "0x617eb7",
                "data": "D",
                "next": "0x617eb6" 
            },
            {
                "id": "0x617eb8",
                "data": "D",
                "next": "0x617eb7" 
            },
            {
                "id": "0x617eb9",
                "data": "D",
                "next": "0x617eb8" 
            },
            {
                "id": "0x617eba",
                "data": "D",
                "next": "0x617eb9" 
            },
            {
                "id": "0x617ebb",
                "data": "D",
                "next": "0x617eba" 
            },
            {
                "id": "0x617ebc",
                "data": "D",
                "next": "0x617ebb" 
            },
            {
                "id": "0x617ebd",
                "data": "D",
                "next": "0x617ebc" 
            },
            {
                "id": "0x617ebe",
                "data": "D",
                "next": "0x617ebd" 
            },
            {
                "id": "0x627ebe",
                "data": "D",
                "next": "0x617ebe" 
            },
            {
                "id": "0x637ebe",
                "data": "D",
                "next": "0x627ebe" 
            },
            {
                "id": "0x647ebe",
                "data": "D",
                "next": "0x637ebe" 
            },
            {
                "id": "0x657ebe",
                "data": "D",
                "next": "0x647ebe" 
            },
            {
                "id": "0x667ebe",
                "data": "D",
                "next": "0x657ebe" 
            },
            {
                "id": "0x677ebe",
                "data": "D",
                "next": "0x667ebe" 
            },
            {
                "id": "0x687ebe",
                "data": "D",
                "next": "0x677ebe" 
            },
            {
                "id": "0x697ebe",
                "data": "D",
                "next": "0x687ebe" 
            },
            {
                "id": "0x6a7ebe",
                "data": "D",
                "next": "0x697ebe" 
            },
            {
                "id": "0x6b7ebe",
                "data": "D",
                "next": "0x6a7ebe" 
            },
            {
                "id": "0x6c7ebe",
                "data": "D",
                "next": "0x6b7ebe" 
            },
            {
                "id": "0x6d7ebe",
                "data": "X",
                "next": "0x6c7ebe" 
            },
            {
                "id": "0x6e7ebe",
                "data": "Y",
                "next": "0x6d7ebe" 
            },
        ],
        "layouter": "Force"
    }
}];