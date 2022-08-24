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
	objectModalOpen: false,
	fileBrowserModalOpen: false,
	flagNewOrExisting: 'existing',
	activeCategory: '',
	errorMessage: ''
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