import { writable } from 'svelte/store';

// const serverPath = 'http://192.168.168.180:9000/';

// export const DREXPATH = writable(serverPath + 'drex/');

// export const MEDIAPATH = writable(serverPath + 'mediapool/');

export const activeMediaCategory = writable('');

export const DREXItem = writable({
	identifier: '',
	type: '',
	content: {},
});

export const backupItem = writable({});

export var state = writable({
	activeRail: '',
	railSelection: '',
	activePrimary: '',
	railSaved: false,
	itemSaved: false,
	objectModalOpen: false,
	fileBrowserModalOpen: false,
	editorModalOpen: false,
	flagNewOrExisting: 'existing',
	activeCategory: '',
	errorMessage: '',
	mediaIndex: 0,
	mediaTypeIndex: 0,
	errors: {}
})

export var fileList = writable({});

export var activeFile = writable({
	type: '',
	role: '',
	index: 0
});

export const newItem = writable({
	identifier: '',
	type: '',
	content: {},
});

export var listItemsOfType = writable([]);

export var RailMap = writable({});

// export var defaults = writable({
// 	categoryIcons: [
// 		'stories',
// 		'artifacts',
// 		'watch+listen'
// 	], emptyContentType: {
// 		title: 'New content type',
// 		contentType: 'stories',
// 		content: [],
// 	}, typeEditingDisabled: {
// 		stories: '',
// 		media: 'true',
// 		artifacts: 'true',
// 	}, mediaTypes: [
// 		'musicalmoment',
// 		'factoryfootage',
// 		'oralhistory',
// 		'custom'
// 	],
// 	typePlurals: {
// 		story: 'stories',
// 		artifact: 'artifacts',
// 		object: 'objects',
// 		musicalmoment: 'musicalmoments',
// 		factoryfootage: 'factoryfootage',
// 		oralhistory: 'oralhistories',
// 		custom: 'custom'
// 	}, prettyMediaTypes: {
// 		musicalmoments: 'Musical Moments',
// 		factoryfootage: 'Factory Footage',
// 		oralhistories: 'Oral Histories',
// 		custom: 'custom'
// 	}
// })