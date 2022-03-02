const SOURCES_DATA = [
	{
		LinkList0: {
			data: [
				{
					id: '0x617eb0',
					data: 'Z',
					next: '0x617ef0',
					rootExternal: ['L'],
					type: 'default',
				},
				{
					id: '0x617ef0',
					data: 'A',
					next: '0x617f10',
					type: 'default',
				},
				{
					id: '0x617f10',
					data: 'B',
					next: '0x617f30',
					type: 'default',
				},
				{
					id: '0x617f30',
					data: 'C',
					external: ['r', 't'],
					next: null,
					type: 'default',
				},
			],
			layouter: 'LinkList',
		},
		LinkList1: {
			data: [
				{
					id: '0x617ed0',
					data: 'Y',
					next: '0x617f50',
					rootExternal: ['L2'],
					type: 'default',
				},
				{
					id: '0x617f50',
					data: 'a',
					next: '0x617f70',
					type: 'default',
				},
				{
					id: '0x617f70',
					data: 'b',
					external: ['r2', 't2'],
					loopNext: 'LinkList0#0x617f30',
					type: 'default',
				},
			],
			layouter: 'LinkList',
		},
		isEnterFunction: false,
	},
	{
		LinkList0: {
			data: [
				{
					id: '0x617eb0',
					data: 'Z',
					next: '0x617ef0',
					rootExternal: ['L'],
					type: 'default',
				},
				{
					id: '0x617ef0',
					data: 'A',
					next: '0x617f10',
					type: 'default',
				},
				{
					id: '0x617f10',
					data: 'B',
					next: '0x617f30',
					type: 'default',
				},
				{
					id: '0x617f30',
					data: 'C',
					external: ['r', 't'],
					next: null,
					type: 'default',
				},
			],
			layouter: 'LinkList',
		},
		LinkList1: {
			data: [
				{
					id: '0x617ed0',
					data: 'Y',
					next: '0x617f50',
					rootExternal: ['L2'],
					type: 'default',
				},
				{
					id: '0x617f50',
					data: 'a',
					next: '0x617f70',
					type: 'default',
				},
				{
					id: '0x617f70',
					data: 'b',
					external: ['r2', 't2'],
					next: null,
					type: 'default',
				},
			],
			layouter: 'LinkList',
		},
		isEnterFunction: false,
	},
];
