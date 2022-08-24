<script>
	import { Badge, Form, FormGroup, Input, Label, Container, Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
	import StoryItems from './StoryItems.svelte';
	import VideoItems from './VideoItems.svelte';
	import ObjectItems from './ObjectItems.svelte';
	import Modals from './Modals.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { state, DREXItem, activeMediaCategory, mediaPath, drexPath, fileList, activeFile, newItem, listItemsOfType } from './stores';
	import { PlusCircle, MinusCircle, ArrowDown, ArrowUp } from 'lucide-svelte';
	import { arrayMoveMutable } from 'array-move';
	var flagNewOrExisting = 'existing';
	var ActiveRail = 'rail1b';
	var RailMap;
	var LoadTrigger;
	var itemSaved = false;
	var railSaved = false;
	var activeFileRole;
	var activeFileIndex;

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
			$fileList.files = $fileList.files.filter((file) => file.indexOf('-THUMB') == -1);
			console.log($fileList);
			toggleFileBrowserModal();
		}
	}

	function dispatchToggleModal(event) {
		var modal = event.detail.modal;
		var options = {};
		if (event.detail.options) {
			options = JSON.parse(JSON.stringify(event.detail.options));
		}
		toggleModal(modal, options);
	}

	function toggleNewOrExistingItem() {
		flagNewOrExisting = flagNewOrExisting == 'new' ? 'existing' : 'new';
	}

	async function getRail() {
		var response = await fetch($drexPath + 'map/' + ActiveRail);
		var promise = await response.json();
		console.log(promise);
		return promise;
	}

	onMount(async () => {
		RailMap = await getRail();
		LoadTrigger = 'go';
		//console.log(RailMap);
	});

	async function getItem(type, item, category) {
		$DREXItem = {};
		var request = await fetch($drexPath + 'item/' + type + '/' + item);
		var promise = await request.json();
		$DREXItem = promise;
		if (category != '') {
			$activeMediaCategory = category;
		}
		itemSaved = false;
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
		var request = await fetch($drexPath + 'update/rail/' + ActiveRail, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(rail),
		});
		var promise = await request.json();
		if (promise.result == 'success') {
			railSaved = true;
		}
	}

	function titleCase(str) {
		return str[0].toUpperCase() + str.slice(1);
	}

	async function createItem(item) {
		var request = await fetch($drexPath + 'create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(item),
		});
		var promise = await request.json();
		if (promise.result == 'success') {
			railSaved = true;
		}
	}

	async function getAllItemsOfType(type) {
		var request = await fetch($drexPath + 'item/' + type + '/all');
		var promise = await request.json();
		return promise;
	}

	async function initializeNewItem(contentType) {
		resetNewItem();
		$state.activeCategory = contentType;
		switch ($state.activeCategory) {
			case 'stories':
				$newItem.type = 'story';
				$newItem.content['images'] = [];
				$newItem.content['heroImage'] = '';
				break;
		}
		$listItemsOfType = $state.flagNewOrExisting == 'existing' ? await getAllItemsOfType($newItem.type) : [];
		console.log($listItemsOfType);
		toggleModal('object');
	}

	async function addExistingItem(event) {
		const item = event.detail.item;
		const category = event.detail.category;
		const categoryIndex = RailMap.content.findIndex((cat) => cat.contentType.toLowerCase() == category);
		console.log(item.identifier, RailMap.content[categoryIndex].content);
		const itemIndex = RailMap.content[categoryIndex].content.indexOf(item.identifier);
		if (itemIndex == -1) {
			RailMap.content[categoryIndex].content = [...RailMap.content[categoryIndex].content, item.identifier];
			const saveRailResult = await saveRail(RailMap);
			$DREXItem = item;
			toggleModal('object');
		} else {
			$state.errorMessage = 'Item is already in rail.';
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
		const category = event.detail.category;
		const categoryIndex = RailMap.content.findIndex((cat) => cat.contentType.toLowerCase() == category);
		const itemIndex = $listItemsOfType.findIndex((i) => i.identifier.toLowerCase() == item.identifier);
		if (itemIndex == -1) {
			RailMap.content[categoryIndex].content = [...RailMap.content[categoryIndex].content, item.identifier];
			const saveRailResult = await saveRail(RailMap);
			const createItemResult = await createItem(item);
			$DREXItem = item;
			toggleModal('object');
		} else {
			$state.errorMessage = 'Identifier already exists.';
		}
	}

	// async function buildItem(item, category) {
	// 	console.log(category);
	// 	activeCategory = category;
	// 	if (!storyModalOpen) {
	// 		switch (category) {
	// 			case 'stories':
	// 				item.type = 'story';
	// 				item.content['images'] = [];
	// 				item.content['heroImage'] = '';
	// 				break;
	// 			case 'artifacts':
	// 				item.type = 'artifact';
	// 				break;
	// 			case 'media':
	// 				item.type = 'media';
	// 				break;
	// 		}
	// 		if (flagNewOrExisting == 'existing') {
	// 			listItemsOfType = await getAllItemsOfType(item.type);
	// 		}
	// 		toggleStoryModal();
	// 	} else {
	// 		console.log(category, item);
	// 		const categoryIndex = RailMap.content.findIndex((cat) => cat.contentType.toLowerCase() == category);
	// 		console.log(categoryIndex);
	// 		RailMap.content[categoryIndex].content = [...RailMap.content[categoryIndex].content, item.identifier];
	// 		var saveRailResult = await saveRail(RailMap);
	// 		if (flagNewOrExisting == 'new') {
	// 			var createItemResult = await createItem(item);
	// 		}
	// 		toggleStoryModal();
	// 	}
	// }

	async function getFileList(fileType) {
		var request = await fetch($drexPath + 'filelist/' + fileType);
		var promise = await request.json();
		return promise;
	}

	async function openFileBrowser(event) {}

	function setFile(event) {
		console.log('hi', event.detail);
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
			console.log(fileIndex, $DREXItem.content.images);
			$DREXItem.content.images[fileIndex].full = file;
			$DREXItem.content.images[fileIndex].thumbnail = file.slice(0, -4) + '-THUMB' + file.slice(-4);
		} else {
			$DREXItem.content[fileRole] = file;
		}
		console.log($DREXItem.content);
		toggleFileBrowserModal();
	}

	function removeRaiLMapItem(item, itemCategory, itemSubcategory = '') {
		const confirmation = confirm('Confirm deletion');
		const categoryIndex = RailMap.content.findIndex((cat) => cat.contentType.toLowerCase() == itemCategory);
		if (confirmation) {
			if (itemSubcategory == '') {
				const itemIndex = RailMap.content[categoryIndex].content.indexOf(item);
				RailMap.content[categoryIndex].content.splice(itemIndex, 1);
				RailMap.content = RailMap.content;
				console.log(RailMap.content);
			}
			if ($DREXItem.identifier == item) {
				resetDREXItem();
			}
		}
	}

	function moveRailMapItemUp(item, itemCategory, itemSubcategory = '') {
		const categoryIndex = RailMap.content.findIndex((cat) => cat.contentType.toLowerCase() == itemCategory);
		if (itemSubcategory == '') {
			const itemIndex = RailMap.content[categoryIndex].content.indexOf(item);
			arrayMoveMutable(RailMap.content[categoryIndex].content, itemIndex, itemIndex - 1);
		} else {
			const subcategoryIndex = RailMap.content[categoryIndex].content.findIndex((subcat) => subcat.name.toLowerCase() == itemSubcategory);
			const itemIndex = RailMap.content[categoryIndex].content[subcategoryIndex].content.indexOf(item);
			arrayMoveMutable(RailMap.content[categoryIndex].content[subcategoryIndex].content, itemIndex, itemIndex - 1);
		}
		RailMap.content[categoryIndex].content = RailMap.content[categoryIndex].content;
	}

	function moveRailMapItemDown(item, itemCategory, itemSubcategory = '') {
		const categoryIndex = RailMap.content.findIndex((cat) => cat.contentType.toLowerCase() == itemCategory);
		if (itemSubcategory == '') {
			const itemIndex = RailMap.content[categoryIndex].content.indexOf(item);
			arrayMoveMutable(RailMap.content[categoryIndex].content, itemIndex, itemIndex + 1);
		} else {
			const subcategoryIndex = RailMap.content[categoryIndex].content.findIndex((subcat) => subcat.name.toLowerCase() == itemSubcategory);
			const itemIndex = RailMap.content[categoryIndex].content[subcategoryIndex].content.indexOf(item);
			arrayMoveMutable(RailMap.content[categoryIndex].content[subcategoryIndex].content, itemIndex, itemIndex + 1);
		}
		RailMap.content[categoryIndex].content = RailMap.content[categoryIndex].content;
	}

	function modifyImageArray(event) {
		console.log(event.detail);
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
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" />
</svelte:head>

<main>
	<Modals on:toggleModal={dispatchToggleModal} on:setFile={setFile} on:addExistingItem={addExistingItem} on:addNewItem={addNewItem} />
	<Container xxl>
		{#if LoadTrigger}
			<Row>
				<h1 contenteditable="true" type="text" bind:innerHTML={RailMap.title} />
				<Input type="textarea" rows="6" bind:value={RailMap.body} />
			</Row>
			<div class="top-spacer" />
			<Row cols={2} class="justify-content-center">
				<Col sm="3">
					{#each RailMap.content as RMContent}
						<FormGroup>
							<Row class="form-group">
								<h3 contenteditable="true" type="text" bind:innerHTML={RMContent.title} />
							</Row>
							<Row>
								<Input type="select" bind:value={RMContent.contentType}>
									<option>stories</option>∏
									<option>artifacts</option>
									<option>media</option>
								</Input>
							</Row>
							<Row>
								{#if RMContent.contentType != 'media'}
									<ol>
										{#each RMContent.content as Content (Content)}
											<li>
												<div class="item-row">
													<span
														class="list"
														on:click={() => {
															RMContent.contentType == getItem(RMContent.contentType, Content);
														}}>{Content}</span
													>
													{#if RMContent.content.indexOf(Content) != 0}
														<div
															on:click={() => {
																moveRailMapItemUp(Content, RMContent.contentType);
															}}
														>
															<ArrowUp />
														</div>
													{:else}
														<div class="blank-icon" />
													{/if}
													{#if RMContent.content.indexOf(Content) != RMContent.content.length - 1}
														<div
															on:click={() => {
																moveRailMapItemDown(Content, RMContent.contentType);
															}}
														>
															<ArrowDown />
														</div>
													{:else}
														<div class="blank-icon" />
													{/if}
													<div
														class="delete-button"
														on:click={() => {
															removeRaiLMapItem(Content, RMContent.contentType);
														}}
													>
														<MinusCircle color="red" />
													</div>
												</div>
											</li>
										{/each}
										<div class="add-button">
											<p
												on:click={() => {
													initializeNewItem(RMContent.contentType);
												}}
											>
												<PlusCircle color="green" />
											</p>
										</div>
									</ol>
								{:else}
									{#each RMContent.content as Category, Index}
										<h5>{Category.name}</h5>
										<ol>
											{#each Category.content as Content (Content)}
												<li>
													<div class="item-row">
														<span
															class="list"
															on:click={() => {
																getItem('media', Content, Category.name);
															}}
														>
															{Content}
														</span>
														{#if Category.content.indexOf(Content) != 0}
															<div
																on:click={() => {
																	moveRailMapItemUp(Content, RMContent.contentType, Category.name);
																}}
															>
																<ArrowUp />
															</div>
														{:else}
															<div class="blank-icon" />
														{/if}
														{#if Category.content.indexOf(Content) != Category.content.length - 1}
															<div
																on:click={() => {
																	moveRailMapItemDown(Content, RMContent.contentType, Category.name);
																}}
															>
																<ArrowDown />
															</div>
														{:else}
															<div class="blank-icon" />
														{/if}
														<div class="delete-button">
															<MinusCircle color="red" />
														</div>
													</div>
												</li>
											{/each}
										</ol>
									{/each}
								{/if}
							</Row>
						</FormGroup>
					{/each}
					<div class="top-spacer">
						<Button
							color="primary"
							on:click={() => {
								saveRail(RailMap);
							}}>Save {titleCase(ActiveRail)}</Button
						>
						{#if railSaved}<Badge color="success">Saved!</Badge>{/if}
					</div>
				</Col>
				<Col sm={{ size: 8, offset: 1 }}>
					<Row>
						{#await $DREXItem then}
							{#if typeof $DREXItem === 'object' && $DREXItem.type}
								{#if $DREXItem.type == 'artifact'}
									<ObjectItems />
								{:else if $DREXItem.type == 'story'}
									<StoryItems on:toggleModal={dispatchToggleModal} on:modifyImageArray={modifyImageArray} on:setFile={setFile} />
								{:else if $DREXItem.type == 'video'}
									<VideoItems on:fileBrowser={openFileBrowser} />
								{/if}
								<div class="top-spacer">
									<br />
									<Button
										color="primary"
										on:click={() => {
											saveItem($DREXItem);
										}}>Save {titleCase($DREXItem.type)}</Button
									>
									{#if itemSaved}<Badge color="success">Saved!</Badge>{/if}
								</div>
							{/if}
						{/await}
					</Row>
				</Col>
			</Row>
		{/if}
	</Container>
</main>

<style>
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
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
	.item-row {
		display: grid;
		width: 100%;
		grid-template-columns: 12fr 2fr 1fr 3fr;
	}
	.delete-button {
		justify-self: right;
	}
	ol {
		margin: 10px 10px;
	}
	li {
		margin-bottom: 8px;
	}
	.blank-icon {
		width: 24px;
	}
</style>
