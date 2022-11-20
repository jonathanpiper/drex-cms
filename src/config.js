export const SERVERPATH = 'http://192.168.168.180:9000/';
export const DREXPATH = SERVERPATH + 'drex/';
export const MEDIAPATH = SERVERPATH + 'mediapool/';

export const DEFAULTS = {
	categoryIcons: [
		'stories',
		'artifacts',
		'watch+listen'
	], emptyContentType: {
		title: 'New content type',
		contentType: 'stories',
		content: [],
	}, typeEditingDisabled: {
		stories: '',
		media: 'true',
		artifacts: 'true',
	}, mediaTypes: [
		'musicalmoment',
		'factoryfootage',
		'oralhistory',
		'custom'
	],
	typePlurals: {
		story: 'stories',
		artifact: 'artifacts',
		object: 'objects',
		musicalmoment: 'musicalmoments',
		factoryfootage: 'factoryfootage',
		oralhistory: 'oralhistories',
		custom: 'custom'
	}, prettyMediaTypes: {
		musicalmoments: 'Musical Moments',
		factoryfootage: 'Factory Footage',
		oralhistories: 'Oral Histories',
		custom: 'custom'
	}
};