<script>
	import { Badge, Form, FormGroup, Input, Label, Container, Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader, Navbar, NavbarBrand, Nav, NavItem, NavLink, Styles } from 'sveltestrap';
	import { titleCase, getKeyByValue } from './functions';
	import StoryItems from './StoryItems.svelte';
	import VideoItems from './VideoItems.svelte';
	import ObjectItems from './ObjectItems.svelte';
	import Modals from './Modals.svelte';
	import PrimaryList from './PrimaryList.svelte';
	import SecondaryList from './SecondaryList.svelte';
	import DwellCarousel from './DwellCarousel.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { RailMap, state, DREXItem, activeMediaCategory, mediaPath, drexPath, fileList, activeFile, newItem, listItemsOfType, typePlurals, mediaTypes } from './stores';
	import { PlusCircle, MinusCircle, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, RefreshCw, Save, Send } from 'lucide-svelte';
	import { arrayMoveMutable } from 'array-move';
	var railSelection = '';
	var LoadTrigger;
	var itemSaved = false;
	var activeFileRole;
	var activeFileIndex;
	var listRails = [];

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

	async function toggleModal(modal, options = {}) {
		if (modal == 'object') {
			toggleObjectModal();
		} else if (modal == 'file') {
			$activeFile.type = options.type;
			$activeFile.role = options.role;
			$activeFile.index = options.index ? options.index : 0;
			$fileList = await getFileList($activeFile.type);
			//$fileList.files = $fileList.files.filter((file) => file.indexOf('-THUMB') == -1);
			console.log($fileList);
			toggleFileBrowserModal();
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

	async function dispatchGetItem(event) {
		console.log(event.detail);
		const type = event.detail.type;
		const item = event.detail.item;
		getItem(item, type);
	}

	function dispatchModifyRailItem(event) {
		const action = event.detail.action;
		const item = event.detail.item;
		const type = event.detail.type;
		const categoryTitle = event.detail.categoryTitle;
		switch (action) {
			case 'remove':
				removeRailMapItem(item, type, categoryTitle);
				break;
			case 'moveUp':
				moveRailMapItem('up', item, type, categoryTitle);
				break;
			case 'moveDown':
				moveRailMapItem('down', item, type, categoryTitle);
				break;
		}
	}

	function dispatchSaveRail(event) {
		const rail = event.detail.rail;
		saveRail(rail);
	}

	function dispatchModifyDwellImageArray(event) {
		const image = event.detail.image;
		const action = event.detail.action;
		const index = event.detail.index;
		modifyDwellImageArray(image, action, index);
	}

	function dispatchInitializeNewItem(event) {
		const type = event.detail.type;
		const categoryTitle = event.detail.categoryTitle;
		initializeNewItem(type, categoryTitle);
	}

	async function getRail(rail) {
		var response = await fetch($drexPath + 'map/' + rail);
		var promise = await response.json();
		return promise;
	}

	async function loadRail(rail) {
		console.log($state.activeRail); // = rail;
		$RailMap = await getRail(rail);
		$state.railMapMediaIndex = $RailMap.content.findIndex((t) => t.contentType == 'media');
		LoadTrigger = 'go';
	}

	async function getItem(item, type) {
		$DREXItem = { identifier: '', type: '', content: {} };
		var request = await fetch($drexPath + 'item/' + type + '/' + item);
		var promise = await request.json();
		$DREXItem = promise;
		console.log($DREXItem);
		$state.itemSaved = false;
	}

	async function saveItem(item) {
		var request = await fetch($drexPath + 'update/item/' + item.identifier, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(item),
		});
		var promise = await request.json();
		if (promise.result == 'success') {
			itemSaved = true;
		}
	}

	async function saveRail(rail) {
		var request = await fetch($drexPath + 'update/rail/' + $state.activeRail, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(rail),
		});
		var promise = await request.json();
		if (promise.result == 'success') {
			$state.railSaved = true;
		}
	}

	async function createItem(item) {
		var request = await fetch($drexPath + 'create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(item),
		});
		var promise = await request.json();
		if (promise.result == 'success') {
			$state.railSaved = true;
		}
	}

	async function getAllItemsOfType(type) {
		var request = await fetch($drexPath + 'item/' + type + '/all');
		var promise = await request.json();
		return promise;
	}

	async function initializeNewItem(typePlural, categoryTitle) {
		resetNewItem();
		$newItem.type = getKeyByValue($typePlurals, typePlural);
		console.log('hi', categoryTitle);
		$state.activeCategory = categoryTitle;
		console.log($newItem);
		$listItemsOfType = await getAllItemsOfType($newItem.type);
		toggleModal('object');
	}

	async function addExistingItem(event) {
		const item = event.detail.item;
		const type = event.detail.type;
		if ($mediaTypes.indexOf(type) == -1) {
			const typeIndex = $RailMap.content.findIndex((t) => t.title == $state.activeCategory);
			console.log($state.activeCategory);
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
			const typeIndex = $RailMap.content[$state.railMapMediaIndex].content.findIndex((t) => t.contentType == $typePlurals[type]);
			const itemIndex = $RailMap.content[$state.railMapMediaIndex].content[typeIndex].content.indexOf(item.identifier);
			if (itemIndex == -1) {
				$RailMap.content[$state.railMapMediaIndex].content[typeIndex].content = [...$RailMap.content[$state.railMapMediaIndex].content[typeIndex].content, item.identifier];
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
	}

	async function addNewItem(event) {
		const item = event.detail.item;
		const itemIndex = $listItemsOfType.findIndex((i) => i.identifier == item.identifier);
		if (itemIndex != -1) {
			$state.errorMeesage = 'Identifier already exists.';
			return;
		} else {
			const createItemResult = await createItem(item);
			var typeIndex;
			if ($mediaTypes.indexOf(item.type) == -1) {
				typeIndex = $RailMap.content.findIndex((t) => t.contentType == $typePlurals[item.type]);
				$RailMap.content[typeIndex].content = [...$RailMap.content[typeIndex].content, item.identifier];
			} else {
				typeIndex = $RailMap.content[$state.railMapMediaIndex].content.findIndex((t) => t.contentType == $typePlurals[item.type]);
				$RailMap.content[$state.railMapMediaIndex].content[typeIndex].content = [...$RailMap.content[$state.railMapMediaIndex].content[typeIndex].content, item.identifier];
			}
			const saveRailResult = await saveRail($RailMap);
			$DREXItem = item;
			toggleModal('object');
		}
	}

	async function getFileList(fileType) {
		var request = await fetch($drexPath + 'filelist/' + fileType);
		var promise = await request.json();
		return promise;
	}

	function setFile(event) {
		var file = event.detail.file;
		var fileRole = event.detail.fileRole;
		var fileIndex = event.detail.fileIndex;
		if (fileRole == 'images') {
			if (!$DREXItem.content.images) {
				$DREXItem.content.images = [];
			}
			if (!$DREXItem.content.images[fileIndex]) {
				$DREXItem.content.images = [...$DREXItem.content.images, {}];
			}
			$DREXItem.content.images[fileIndex].full = file;
			$DREXItem.content.images[fileIndex].thumbnail = file.slice(0, -4) + '-THUMB' + file.slice(-4);
			$DREXItem.content.images[fileIndex].caption = 'Insert caption.';
		} else if (fileRole == 'mediaTypeHeroImage') {
			//console.log($activeFile.index, $RailMap.content[$state.railMapMediaIndex].content[$activeFile.index]);
			$RailMap.content[$state.railMapMediaIndex].content[$activeFile.index].heroImage = file;
		} else if (fileRole == 'dwellImages') {
			$RailMap.dwell.images[fileIndex] = file;
		} else {
			$DREXItem.content[fileRole] = file;
		}
		toggleFileBrowserModal();
	}

	function removeRailMapItem(item, type, categoryTitle) {
		const confirmation = confirm('Remove ' + item + ' from rail ' + $state.activeRail + '? Note that this only removes the item from this rail; it does not delete the item from the database.');
		const typeIndex = $RailMap.content.findIndex((t) => t.title == categoryTitle);
		console.log(categoryTitle, typeIndex);
		if (confirmation) {
			if ($mediaTypes.indexOf(getKeyByValue($typePlurals, type)) == -1) {
				const itemIndex = $RailMap.content[typeIndex].content.indexOf(item);
				$RailMap.content[typeIndex].content.splice(itemIndex, 1);
				$RailMap.content = $RailMap.content;
			} else {
				const mediaTypeIndex = $RailMap.content[$state.railMapMediaIndex].content.findIndex((t) => t.contentType == type);
				const itemIndex = $RailMap.content[$state.railMapMediaIndex].content[mediaTypeIndex].content.indexOf(item);
				$RailMap.content[$state.railMapMediaIndex].content[mediaTypeIndex].content.splice(itemIndex, 1);
				$RailMap.content[$state.railMapMediaIndex].content[mediaTypeIndex].content = $RailMap.content[$state.railMapMediaIndex].content[mediaTypeIndex].content;
			}
			if ($DREXItem.identifier == item) {
				resetDREXItem();
			}
		}
	}

	function moveRailMapItem(direction, item, type, categoryTitle) {
		var increment = direction == 'up' ? -1 : 1;
		const typeIndex = $RailMap.content.findIndex((t) => t.title == categoryTitle);
		var itemIndex;
		if ($mediaTypes.indexOf(getKeyByValue($typePlurals, type)) == -1) {
			if (type == 'media') {
				itemIndex = $RailMap.content[typeIndex].content.findIndex((t) => t.contentType == item);
			} else {
				itemIndex = $RailMap.content[typeIndex].content.indexOf(item);
			}
			arrayMoveMutable($RailMap.content[typeIndex].content, itemIndex, itemIndex + increment);
		} else {
			const mediaTypeIndex = $RailMap.content[$state.railMapMediaIndex].content.findIndex((t) => t.contentType == type);
			const itemIndex = $RailMap.content[$state.railMapMediaIndex].content[mediaTypeIndex].content.indexOf(item);
			arrayMoveMutable($RailMap.content[$state.railMapMediaIndex].content[mediaTypeIndex].content, itemIndex, itemIndex + increment);
		}
		$RailMap.content[typeIndex].content = $RailMap.content[typeIndex].content;
	}

	function modifyImageArray(event) {
		const image = event.detail.image;
		const action = event.detail.action;
		const imageIndex = $DREXItem.content.images.indexOf(image);
		console.log(imageIndex);
		if (imageIndex != -1) {
			switch (action) {
				case 'remove':
					$DREXItem.content.images.splice(imageIndex, 1);
					console.log($DREXItem.content.images);
					break;
				case 'moveup':
					arrayMoveMutable($DREXItem.content.images, imageIndex, imageIndex - 1);
					break;
				case 'movedown':
					arrayMoveMutable($DREXItem.content.images, imageIndex, imageIndex + 1);
					break;
			}
			$DREXItem.content.images = $DREXItem.content.images;
		}
	}

	function modifyDwellImageArray(image, action, imageIndex) {
		if (imageIndex != -1) {
			switch (action) {
				case 'remove':
					$RailMap.dwell.images.splice(imageIndex, 1);
					break;
				case 'moveup':
					arrayMoveMutable($RailMap.dwell.images, imageIndex, imageIndex - 1);
					break;
				case 'movedown':
					arrayMoveMutable($RailMap.dwell.images, imageIndex, imageIndex + 1);
					break;
			}
			$RailMap.dwell.images = $RailMap.dwell.images;
		}
	}

	$: if ($state.activeRail != railSelection.split(' ')[0]) {
		$state.activeRail = railSelection.split(' ')[0];
		if ($state.activeRail != '') {
			loadRail($state.activeRail);
		}
		resetDREXItem();
	}

	async function publishRail(rail) {
		await fetch($drexPath + 'push/media/' + rail);
	}

	async function reloadRail(rail) {
		await fetch($drexPath + 'reload/' + rail);
	}

	function gotoRail(railIdentifier) {
		railSelection = railIdentifier;
	}
</script>

<Styles />

<Modals on:toggleModal={dispatchToggleModal} on:setFile={setFile} on:addExistingItem={addExistingItem} on:addNewItem={addNewItem} />
<Container fluid>
	<Navbar color="light" light>
		<NavbarBrand>DREX Content Management System</NavbarBrand>
	</Navbar>
	<Row>
		<Col xs="1">
			<Nav vertical>
				{#each listRails as Rail}
				<NavItem>
					<NavLink on:click={() => gotoRail(Rail.identifier)}>{Rail.title}</NavLink>
				</NavItem>
				{/each}
			</Nav>
		</Col>
		<Col>
			{#if LoadTrigger}
			<Row>
				<Input bsSize="lg" bind:value={$RailMap.title} />
				<Input type="textarea" rows="6" bind:value={$RailMap.body} />
			</Row>
			<Row>
				<DwellCarousel on:modifyDwellImageArray={dispatchModifyDwellImageArray} on:toggleModal={dispatchToggleModal} />
			</Row>
			<div class="app-content top-spacer">
				<div>
					<PrimaryList on:getItem={dispatchGetItem} on:modifyRailItem={dispatchModifyRailItem} on:initializeNewItem={dispatchInitializeNewItem} on:resetDREXItem={resetDREXItem} />
				</div>
				<div>
					{#if $state.activePrimary != ''}
						<SecondaryList on:getItem={dispatchGetItem} on:modifyRailItem={dispatchModifyRailItem} on:initializeNewItem={dispatchInitializeNewItem} on:toggleModal={dispatchToggleModal} />
					{/if}
				</div>
				<div>
					<Row>
						{#await $DREXItem then}
							{#if typeof $DREXItem === 'object' && $DREXItem.type}
								{#if $DREXItem.type == 'artifact'}
									<ObjectItems />
								{:else if $DREXItem.type == 'story'}
									<StoryItems on:toggleModal={dispatchToggleModal} on:modifyImageArray={modifyImageArray} on:setFile={setFile} />
								{:else if $DREXItem.type == 'oralhistory' || $DREXItem.type == 'factoryfootage' || $DREXItem.type == 'musicalmoment'}
									<VideoItems on:toggleModal={dispatchToggleModal} />
								{/if}
								<div class="top-spacer">
									<br />
									<Button
										color="primary"
										on:click={() => {
											saveItem($DREXItem);
										}}>Save</Button
									>
									{#if $state.itemSaved}<Badge color="success">Saved!</Badge>{/if}
								</div>
							{/if}
						{/await}
					</Row>
				</div>
			</div>
			<div class="bottom-buttons">
				<div />
				<Button
					size="lg"
					color="success"
					on:click={() => {
						saveRail($RailMap);
					}}><Save /> Save {titleCase($state.activeRail)}</Button
				>
				<Button
					size="lg"
					color="info"
					on:click={() => {
						publishRail($state.activeRail);
					}}><Send /> Publish {titleCase($state.activeRail)}</Button
				>
				<Button
					size="lg"
					color="primary"
					on:click={() => {
						reloadRail($state.activeRail);
					}}><RefreshCw /> Reload {titleCase($state.activeRail)}</Button
				>
			</div>
		{/if}
		</Col>
	</Row>

</Container>

<style>
	.bottom-buttons {
		margin-top: 60px;
		width: 100%;
		display: grid;
		grid-template-columns: 7fr 1fr 1fr 1fr;
		column-gap: 60px;
	}
	.app-content {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 4fr;
		column-gap: 60px;
	}
	.top-spacer {
		margin-top: 20px;
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
</style>
