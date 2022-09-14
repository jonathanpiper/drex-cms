import { writable } from 'svelte/store';

const serverPath = 'http://192.168.168.180:9000/';

export const drexPath = writable(serverPath + 'drex/');

export const mediaPath = writable(serverPath + 'mediapool/');

export const activeMediaCategory = writable('');

export const DREXItem = writable({
	identifier: '',
	type: '',
	content: {},
});

export var state = writable({
	activeRail: '',
	activePrimary: '',
	railSaved: false,
	itemSaved: false,
	objectModalOpen: false,
	fileBrowserModalOpen: false,
	flagNewOrExisting: 'existing',
	activeCategory: '',
	errorMessage: '',
	railMapMediaIndex: 0,
	railMapMediaTypeIndex: 0
})

export var fileList = writable({});

export var activeFile = writable({
	type: '',
	role: '',
	index: 0
});

export var newItem = writable({
	identifier: '',
	type: '',
	content: {},
});

export var listItemsOfType = writable([]);

export var RailMap = writable({});

export var typePlurals = writable({
	story: 'stories',
	artifact: 'artifacts',
	object: 'objects',
	musicalmoment: 'musicalmoments',
	factoryfootage: 'factoryfootage',
	oralhistory: 'oralhistories'
})

export var mediaTypes = writable([
	'musicalmoment',
	'factoryfootage',
	'oralhistory'
]);

export var prettyMediaTypes = writable({
	musicalmoments: 'Musical Moments',
	factoryfootage: 'Factory Footage',
	oralhistories: 'Oral Histories'
});