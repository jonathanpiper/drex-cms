<script>
	import {
		Badge,
		Form,
		FormGroup,
		Input,
		Label,
		Container,
		Row,
		Col,
		Button,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Navbar,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		Styles,
		Accordion,
		AccordionItem,
		Spinner,
		Icon,
		TabContent,
		TabPane,
	} from 'sveltestrap';
	import { titleCase, getKeyByValue, gotoRail, modifyDwellImageArray, moveRailMapType, removeRailMapType, expandRail, modifyImageArray } from './functions';
	import Modals from './Modals.svelte';
	import PrimaryList from './PrimaryList.svelte';
	import SecondaryList from './SecondaryList.svelte';
	import DwellCarousel from './DwellCarousel.svelte';
	import RailsList from './RailsList.svelte';
	import HomeScreen from './HomeScreen.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { RailMap, state, DREXItem, activeMediaCategory, fileList, activeFile, newItem, listItemsOfType, mediaTypes, defaults, backupItem } from './stores';
	import { DREXPATH, MEDIAPATH } from './config';
	import { PlusCircle, MinusCircle, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, RefreshCw, Save, Send, XCircle } from 'lucide-svelte';
	import { arrayMoveMutable } from 'array-move';
	import ItemEditor from './ItemEditor.svelte';
	import ConfigurationEditor from './ConfigurationEditor.svelte';
	import PrimaryNavigation from './PrimaryNavigation.svelte';
	import TailwindCss from './TailwindCSS.svelte';
	import Header from './Header.svelte';
	var LoadTrigger;
	var itemSaved = false;
	var activeFileRole;
	var activeFileIndex;
	var listRails = [];
	var railContentObject = {};

	var backupRail = {};
	var configurationObject = {};

	onMount(async () => {
		listRails = await getAllItemsOfType('rail');
		listRails = listRails.filter((rail) => {
			return rail.hasOwnProperty('identifier') === true;
		});
		listRails.sort((a, b) => {
			var fa = a.identifier,
				fb = b.identifier;
			if (fa < fb) {
				return -1;
			}
			if (fa > fb) {
				return 1;
			}
			return 0;
		});
	});

	//Functions for handling modal windows.
	const toggleObjectModal = () => ($state.objectModalOpen = !$state.objectModalOpen);
	const toggleFileBrowserModal = () => ($state.fileBrowserModalOpen = !$state.fileBrowserModalOpen);
	// const toggleEditorModal = () => ({)$state.editorModalOpen = !$state.editorModalOpen);

	async function toggleModal(modal, options) {
		if (modal == 'object') {
			toggleObjectModal();
		} else if (modal == 'file') {
			console.log(options);
			$activeFile.type = options.type;
			$activeFile.role = options.role;
			$activeFile.index = options.index ? options.index : 0;
			$activeFile.categoryIndex = options.categoryIndex ? options.categoryIndex : 0;
			$state.fileUploadResult = '';
			$state.fileUploadMessage = '';
			console.log($activeFile.type);
			$fileList = await getFileList($activeFile.type);
			console.log($fileList);
			toggleFileBrowserModal();
		} else if (modal == 'editor') {
			toggleEditorModal();
		}
	}

	//Functions for handling dispatched events from components.
	function dispatchToggleModal(event) {
		var modal = event.detail.modal;
		var options = {};
		if (event.detail.options) {
			options = JSON.parse(JSON.stringify(event.detail.options));
		}
		toggleModal(modal, options);
	}

	async function dispatchGetFileList(event) {
		var fileType = event.detail.fileType;
		$fileList = await getFileList($activeFile.type);
	}

	async function dispatchGetItem(event) {
		console.log(event.detail);
		const type = event.detail.type;
		const item = event.detail.item;
		getItem(item, type);
	}

	function modifyRailItem(options) {
		console.log(options);
		const action = options.action;
		const item = options.item;
		const type = options.type;
		const categoryTitle = options.categoryTitle;
		switch (action) {
			case 'remove':
				$RailMap = removeRailMapItem($RailMap, item, type, categoryTitle);
				break;
			case 'moveUp':
				$RailMap = moveRailMapItem($RailMap, 'up', item, type, categoryTitle);
				break;
			case 'moveDown':
				$RailMap = moveRailMapItem($RailMap, 'down', item, type, categoryTitle);
				break;
		}
	}

	function dispatchSaveRail(event) {
		const rail = event.detail.rail;
		saveRail(rail);
	}

	function dispatchInitializeNewItem(event) {
		const type = event.detail.type;
		const categoryTitle = event.detail.categoryTitle;
		initializeNewItem(type, categoryTitle);
	}

	async function getRail(rail) {
		var response = await fetch(DREXPATH + 'map/' + rail);
		var promise = await response.json();
		return promise;
	}

	async function getRailContent(rail) {
		var response = await fetch(DREXPATH + 'rail/' + rail);
		var promise = await response.json();
		return promise;
	}

	async function getConfig() {
		var response = await fetch(DREXPATH + 'config');
		var promise = await response.json();
		return promise;
	}

	async function loadRail(rail) {
		LoadTrigger = false;
		if (rail != 'config') {
			$RailMap = await getRail(rail);
			backupRail = JSON.parse(JSON.stringify($RailMap));
			$state.mediaIndex = $RailMap.content.findIndex((t) => t.contentType == 'media');
			LoadTrigger = 'go';
		} else {
			configurationObject = await getConfig();
			console.log(configurationObject);
			$RailMap = {};
			LoadTrigger = 'go';
		}
	}

	function undoRailChanges() {
		$RailMap = JSON.parse(JSON.stringify(backupRail));
	}

	async function getItem(item, type = '') {
		var request = await fetch(DREXPATH + 'item/' + type + '/' + item);
		var promise = await request.json();
		console.log(promise);
		return promise;
	}

	async function saveItem(item) {
		try {
			$state.saveItemInProgress = true;
			var request = await fetch(DREXPATH + 'update/item/' + item.identifier, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(item),
			});
			var promise = await request.json();
			if (promise.success) {
				itemSaved = true;
			} else {
				$state.errors['saveItem'] = true;
			}
			$state.saveItemInProgress = false;
			return true;
		} catch (err) {
			console.log(err);
		}
	}

	async function saveRail(rail) {
		$state.updateRailInProgress = true;
		var request = await fetch(DREXPATH + 'update/rail/' + $state.activeRail, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(rail),
		});
		var promise = await request.json();
		if (promise.success) {
			$state.railSaved = true;
		} else {
			$state.errors['saveRail'] = true;
		}
		$state.updateRailInProgress = false;
	}

	async function createItem(item) {
		$state.createItemInProgress = true;
		var request = await fetch(DREXPATH + 'create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(item),
		});
		var promise = await request.json();
		$state.errors['createNewItem'] = !promise.success;
		console.log('ba');
		// if (promise.success) {
		// 	$state.errors['createNewItem'] = false;
		// } else {
		// 	$state.errors['createNewItem'] = true;
		// }
		$state.createItemInProgress = false;
	}

	async function getAllItemsOfType(type) {
		var request = await fetch(DREXPATH + 'item/' + type + '/all');
		var promise = await request.json();
		return promise;
	}

	async function initializeNewItem(typePlural, categoryTitle) {
		resetNewItem();
		$newItem.type = getKeyByValue($defaults.typePlurals, typePlural);
		$state.activeCategory = categoryTitle;
		$listItemsOfType = await getAllItemsOfType($newItem.type);
		toggleModal('object');
	}

	async function addExistingItem(item, type) {
		if ($mediaTypes.indexOf(type) == -1) {
			const typeIndex = $RailMap.content.findIndex((t) => t.title == $state.activeCategory);
			const itemIndex = $RailMap.content[typeIndex].content.indexOf(item.identifier);
			if (itemIndex == -1) {
				$RailMap.content[typeIndex].content = [...$RailMap.content[typeIndex].content, item.identifier];
				const saveRailResult = await saveRail($RailMap);
				$DREXItem = item;
				toggleModal('object');
			} else {
				$state.errorMessage = 'Item is already in rail.';
			}
		} else {
			const typeIndex = $RailMap.content[$state.mediaIndex].content.findIndex((t) => t.title == $state.activeCategory);
			const itemIndex = $RailMap.content[$state.mediaIndex].content[typeIndex].content.indexOf(item.identifier);
			if (itemIndex == -1) {
				$RailMap.content[$state.mediaIndex].content[typeIndex].content = [...$RailMap.content[$state.mediaIndex].content[typeIndex].content, item.identifier];
				const saveRailResult = await saveRail($RailMap);
				$DREXItem = item;
				toggleModal('object');
			} else {
				$state.errorMessage = 'Item is already in rail.';
			}
		}
	}

	function resetNewItem() {
		$newItem = {
			identifier: '',
			type: '',
			content: {},
		};
	}

	function resetDREXItem() {
		$DREXItem = {
			identifier: '',
			type: '',
			content: {},
		};
		$state.errors = {};
	}

	function confirmMoveAwayFromItem() {
		// var confirmation = confirm(`Moving away from this item will reset any changes you've made. Do you want to proceed?`);
		// if (confirmation) {
		// 	resetDREXItem();
		// } else {
		// 	return;
		// }
	}

	async function addNewItem(item) {
		const itemIndex = $listItemsOfType.findIndex((i) => i.identifier == item.identifier);
		console.log(item, itemIndex);
		if (itemIndex != -1) {
			$state.errors.createNewItem = true;
			return;
		} else {
			const createItemResult = await createItem(item);
			var typeIndex;
			if ($mediaTypes.indexOf(item.type) == -1) {
				typeIndex = $RailMap.content.findIndex((t) => t.title == $state.activeCategory);
				$RailMap.content[typeIndex].content = [...$RailMap.content[typeIndex].content, item.identifier];
			} else {
				typeIndex = $RailMap.content[$state.mediaIndex].content.findIndex((t) => t.contentType == $defaults.typePlurals[item.type]);
				$RailMap.content[$state.mediaIndex].content[typeIndex].content = [...$RailMap.content[$state.mediaIndex].content[typeIndex].content, item.identifier];
			}
			const saveRailResult = await saveRail($RailMap);
			$DREXItem = item;
			toggleModal('object');
		}
	}

	async function getFileList(fileType) {
		console.log(fileType);
		var request = await fetch(DREXPATH + 'filelist/' + fileType);
		var promise = await request.json();
		return promise;
	}

	function setObjectImageFile(imageArray = [], imageFile, imageIndex) {
		if (!imageArray[imageIndex]) {
			imageArray = [...imageArray, {}];
		}
		const image = new Image();
		image.src = MEDIAPATH + 'objects/' + imageFile;
		imageArray[imageIndex].name = imageFile.slice(0, -4).split('_')[1];
		imageArray[imageIndex].width = image.width;
		imageArray[imageIndex].height = image.height;
		imageArray[imageIndex].altsizes = ['_half', '_quarter', '_threequarter'];
		return imageArray;
	}

	function setItemImageFile(imageArray = [], imageFile, imageIndex) {
		console.log(imageArray, imageIndex);
		if (!imageArray[imageIndex]) {
			imageArray = [...imageArray, {}];
		}
		imageArray[imageIndex].full = imageFile;
		imageArray[imageIndex].thumbnail = imageFile.slice(0, -4) + '-THUMB' + imageFile.slice(-4);
		imageArray[imageIndex].caption = '';
		return imageArray;
	}

	function setFile(file, fileRole, fileType, fileIndex, categoryIndex) {
		if (fileRole == 'images') {
			if (fileType == 'objects') {
				$DREXItem.content.images = setObjectImageFile($DREXItem.content.images, file, fileIndex);
				// if (!$DREXItem.content.images) {
				// 	$DREXItem.content.images = [];
				// }
				// if (!$DREXItem.content.images[fileIndex]) {
				// 	$DREXItem.content.images = [...$DREXItem.content.images, {}];
				// }
				// const image = new Image();
				// image.src = MEDIAPATH + 'objects/' + file;
				// $DREXItem.content.images[fileIndex].name = file.slice(0, -4).split('_')[1];
				// $DREXItem.content.images[fileIndex].width = image.width;
				// $DREXItem.content.images[fileIndex].height = image.height;
				// $DREXItem.content.images[fileIndex].altsizes = ['_half', '_quarter', '_threequarter'];
				// console.log($DREXItem.content.images[fileIndex]);
			} else {
				$DREXItem.content.images = setItemImageFile($DREXItem.content.images, file, fileIndex);
				// if (!$DREXItem.content.images) {
				// 	$DREXItem.content.images = [];
				// }
				// if (!$DREXItem.content.images[fileIndex]) {
				// 	$DREXItem.content.images = [...$DREXItem.content.images, {}];
				// }
				// $DREXItem.content.images[fileIndex].full = file;
				// $DREXItem.content.images[fileIndex].thumbnail = file.slice(0, -4) + '-THUMB' + file.slice(-4);
				// $DREXItem.content.images[fileIndex].caption = '';
			}
		} else if (fileRole == 'mediaTypeHeroImage') {
			$RailMap.content[$state.mediaIndex].content[$activeFile.index].heroImage = file;
		} else if (fileRole == 'dwellImages') {
			console.log(file, fileRole, fileIndex);
			$RailMap.dwell.images[fileIndex] = file;
		} else if (fileRole == 'icon') {
			$RailMap.content[categoryIndex].icon = file;
		} else {
			$DREXItem.content[fileRole] = file;
		}
		toggleFileBrowserModal();
	}

	function removeRailMapItem(map, item, type, categoryTitle) {
		const confirmation = confirm('Remove ' + item + ' from rail ' + $state.activeRail + '? Note that this only removes the item from this rail; it does not delete the item from the database.');
		const typeIndex = map.content.findIndex((t) => t.title == categoryTitle);
		console.log(categoryTitle, typeIndex);
		if (confirmation) {
			if ($mediaTypes.indexOf(getKeyByValue($defaults.typePlurals, type)) == -1) {
				const itemIndex = map.content[typeIndex].content.indexOf(item);
				map.content[typeIndex].content.splice(itemIndex, 1);
				map.content = map.content;
			} else {
				const mediaTypeIndex =
					categoryTitle == ''
						? map.content[$state.mediaIndex].content.findIndex((t) => t.contentType == type)
						: map.content[$state.mediaIndex].content.findIndex((t) => t.title == categoryTitle);
				const itemIndex = map.content[$state.mediaIndex].content[mediaTypeIndex].content.indexOf(item);
				map.content[$state.mediaIndex].content[mediaTypeIndex].content.splice(itemIndex, 1);
				map.content[$state.mediaIndex].content[mediaTypeIndex].content = $RailMap.content[$state.mediaIndex].content[mediaTypeIndex].content;
			}
			if ($DREXItem.identifier == item) {
				resetDREXItem();
			}
		}
		return map;
	}

	function moveRailMapItem(map, direction, item, type, categoryTitle = '') {
		console.log(direction, item, type, categoryTitle);
		const increment = direction == 'up' ? -1 : 1;
		const typeIndex = map.content.findIndex((t) => t.title == categoryTitle);
		console.log(typeIndex);
		var itemIndex;
		if ($mediaTypes.indexOf(getKeyByValue($defaults.typePlurals, type)) == -1) {
			if (type == 'media') {
				itemIndex = map.content[typeIndex].content.findIndex((t) => t.contentType == item);
			} else {
				itemIndex = map.content[typeIndex].content.indexOf(item);
			}
			arrayMoveMutable(map.content[typeIndex].content, itemIndex, itemIndex + increment);
		} else {
			const mediaTypeIndex =
				categoryTitle == ''
					? map.content[$state.mediaIndex].content.findIndex((t) => t.contentType == type)
					: map.content[$state.mediaIndex].content.findIndex((t) => t.title == categoryTitle);
			const itemIndex = map.content[$state.mediaIndex].content[mediaTypeIndex].content.indexOf(item);
			arrayMoveMutable(map.content[$state.mediaIndex].content[mediaTypeIndex].content, itemIndex, itemIndex + increment);
		}
		return map;
	}

	async function publishRail(rail) {
		await fetch(DREXPATH + 'push/media/' + rail);
	}

	async function refreshRail(rail) {
		await fetch(DREXPATH + 'reload/' + rail);
	}

	async function dispatchManager(event) {
		const { f, p } = event.detail;
		// const p = event.detail.p;
		console.log(f, p);
		switch (f) {
			case 'modifyDwellImageArray':
				$RailMap = modifyDwellImageArray($RailMap, p.image, p.action, p.index);
				break;
			case 'toggleModal':
				if (!p.options) {
					p.options = {};
				}
				toggleModal(p.modal, p.options);
				break;
			case 'gotoRail':
				$state.railSelection = p.railID;
				if ($state.railSelection != $state.activeRail) {
					$state.activeRail = $state.railSelection;
					railContentObject = await getRailContent($state.activeRail);
					loadRail($state.activeRail);
					$DREXItem = JSON.parse(JSON.stringify($newItem));
				}
				console.log($DREXItem);
				break;
			case 'addExistingItem':
				addExistingItem(p.item, p.type);
				break;
			case 'addNewItem':
				addNewItem(p.item);
				break;
			case 'setFile':
				setFile(p.file, p.role, p.type, p.index, p.categoryIndex);
				break;
			case 'confirmMoveAwayFromItem':
				confirmMoveAwayFromItem();
				break;
			case 'moveRailMapType':
				$RailMap = moveRailMapType($RailMap, p.direction, p.type);
				break;
			case 'removeRailMapType':
				$RailMap = removeRailMapType($RailMap, $state.activeRail, p.type);
				resetDREXItem();
				return;
			case 'expandRail':
				$RailMap = expandRail($RailMap, $defaults.emptyContentType);
				break;
			case 'initializeNewItem':
				resetNewItem();
				console.log(p.contentType);
				if (p.contentType == 'custom') {
					$newItem.type = 'custom';
				} else {
					$newItem.type = getKeyByValue($defaults.typePlurals, p.contentType.toLowerCase());
				}
				$state.activeCategory = p.categoryTitle;
				console.log($state.activeCategory, $newItem.type);
				$listItemsOfType = await getAllItemsOfType($newItem.type);
				toggleModal('object');
				break;
			case 'getItem':
				resetDREXItem();
				$DREXItem = await getItem(p.item, p.contentType);
				$backupItem = JSON.parse(JSON.stringify($DREXItem));
				break;
			case 'undoItemChanges':
				$DREXItem = JSON.parse(JSON.stringify($backupItem));
				$state.itemChanged = false;
				break;
			case 'modifyRailItem':
				modifyRailItem(p);
				console.log(p);
				break;
			case 'saveItem':
				if (saveItem(p.item)) {
					$backupItem = JSON.parse(JSON.stringify($DREXItem));
				}
				break;
			case 'modifyImageArray':
				$DREXItem = modifyImageArray(p.item, p.image, p.action);
				break;
		}
	}
</script>

<TailwindCss />

<Modals on:execute={dispatchManager} />
<div class="fixed w-full z-50">
	<Header />
</div>
<div class="h-full w-96 px-3 py-2 bg-gray-200 fixed top-24 z-10">
	<RailsList {listRails} on:execute={dispatchManager} />
</div>
<div class="absolute top-24 w-full pl-96">
	<div class="p-3">
		{#if LoadTrigger}
			{#if $state.activeRail != 'config'}
				<div class="w-full">
					<HomeScreen bind:title={$RailMap.title} bind:body={$RailMap.body} />
				</div>
				<div class="w-full">
					<DwellCarousel bind:images={$RailMap.dwell.images} on:execute={dispatchManager} />
				</div>
				<div class="mt-4 w-full grid grid-cols-3 gap-4">
					<div>
						<PrimaryList
							on:getItem={dispatchGetItem}
							on:initializeNewItem={dispatchInitializeNewItem}
							on:resetDREXItem={resetDREXItem}
							on:toggleModal={dispatchToggleModal}
							on:execute={dispatchManager}
						/>
					</div>
					<div class="col-span-2">
						<ItemEditor on:execute={dispatchManager} />
					</div>
				</div>
				<div class="mt-12 w-full grid grid-cols-4 gap-4">
					<Button
						size="lg"
						color="success"
						on:click={() => {
							saveRail($RailMap);
						}}
						><div class="flex content-center justify-center">
							<Save class="inline" />
							<p class="inline ml-2">Save {titleCase($state.activeRail)}</p>
							{#if $state.updateRailInProgress}<div class="spinner-container inline">
									<Spinner size="sm" />
								</div>{/if}{#if $state.errors.saveRail}<Icon name="x-circle" class="inline" />{/if}
						</div></Button
					>
					<Button
						size="lg"
						color="warning"
						on:click={() => {
							undoRailChanges();
						}}
						><div class="flex content-center justify-center">
							<XCircle class="inline" />
							<p class="inline ml-2">Reset all changes</p>
						</div></Button
					>
					<Button
						size="lg"
						color="info"
						on:click={() => {
							publishRail($state.activeRail);
						}}
					>
						<div class="flex content-center justify-center">
							<Send class="inline" />
							<p class="inline ml-2">Publish {titleCase($state.activeRail)}</p>
						</div></Button
					>
					<Button
						size="lg"
						color="primary"
						on:click={() => {
							refreshRail($state.activeRail);
						}}
					>
						<div class="flex content-center justify-center">
							<RefreshCw class="inline" />
							<p class="inline ml-2">Refresh {titleCase($state.activeRail)}</p>
						</div></Button
					>
				</div>
			{:else}
				<ConfigurationEditor {configurationObject} />
				{configurationObject['dr-title-font']}
			{/if}
		{/if}
	</div>
</div>

<style>
	:global(.container-fluid) {
		padding: 0 !important;
	}
	:global(.filelink) {
		text-decoration: underline;
	}
	:global(a) {
		text-decoration: underline !important;
	}
	:global(video) {
		width: 100%;
	}
	:global(html) {
		background-color: white !important;
	}
	:global(.clickable) {
		cursor: pointer;
	}
	.spinner-container {
		display: inline;
		padding-left: 10px !important;
	}
	@font-face {
		font-family: 'Montserrat';
		src: url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap') format('truetype');
	}

	@font-face {
		font-family: 'Signika';
		src: url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap') format('truetype');
	}

	@font-face {
		font-family: 'OpenSans';
		src: url('/mediapool/OpenSans-VariableFont_wdthwght.ttf') format('truetype');
	}
	:global(:root) {
		--dr-title-font: '';
		--dr-body-font: '';
		--dr-gallery-color: '';
		--dr-gallery-color-active: '';
		--dr-gallery-color-dateRange: '';
	}
</style>
