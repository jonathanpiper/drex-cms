<script>
	import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, FormText, Label, Input, Button, TabContent, Col, Row, Spinner, Icon, Badge } from 'sveltestrap';
	import { RailMap, state, fileList, activeFile, newItem, listItemsOfType, DREXItem } from './stores';
	import { DREXPATH, DEFAULTS } from './config';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let dispatch = createEventDispatcher();

	function dispatchSend(f, p) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}

	function validateForm() {
		let form = document.getElementById('form');
		let inputs = form.querySelectorAll('input, textarea');
		let errors = 0;
		inputs.forEach((input) => {
			if (input.value.length == 0) {
				input.style.borderColor = 'red';
				errors++;
			} else {
				input.style.borderColor = '#ced4da';
			}
		});
		if (errors == 0) {
			dispatchSend('addNewItem', { item: $newItem });
		}
	}

	function submitForm(e) {
		e.preventDefault();
		$state.fileUploadInProgress = true;
		const fileUpload = document.getElementById('newFileUpload');
		//console.log($activeFile.role)
		const formData = new FormData();
		formData.append('fileRole', $activeFile.role);
		formData.append('drexItemType', $activeFile.type);
		formData.append('fileUpload', fileUpload.files[0]);
		fetch(DREXPATH + 'upload', {
			method: 'POST',
			body: formData,
		})
			.then((res) => res.json())
			.then((res) => {
				$state.fileUploadResult = res.success;
				$state.fileUploadMessage = res.result;
				$state.fileUploadInProgress = false;
				dispatchSend('refreshItemsOfType', {});
			});
	}
</script>

<Modal
	isOpen={$state.objectModalOpen}
	toggle={() => {
		dispatchSend('toggleModal', { modal: 'object' });
	}}
	size="xl"
>
	<ModalHeader
		toggle={() => {
			dispatchSend('toggleModal', { modal: 'object' });
		}}
	>
		New {$newItem.type} item
	</ModalHeader>
	<ModalBody>
		<button
			class="p-2 px-4 mr-2 bg-blue-200 text-lg font-bold mb-2 underline {$state.flagNewOrExisting == 'existing' ? 'bg-blue-700 text-white' : ''}"
			on:click={() => {
				$state.flagNewOrExisting = 'existing';
			}}
		>
			Add existing item
		</button>
		<button
			class="p-2 px-4 bg-blue-200 text-lg font-bold mb-2 underline {$state.flagNewOrExisting == 'new' ? 'bg-blue-700 text-white' : ''}"
			on:click={() => {
				$state.flagNewOrExisting = 'new';
			}}
		>
			Create new item
		</button>
		<div id="form" class="my-2">
			{#if $state.flagNewOrExisting == 'existing'}
				{#if Object.keys($listItemsOfType).length > 0}
					<p class="">Select an existing {$newItem.type}:</p>
					{#each $listItemsOfType as Item}
						{#if $newItem.type == 'story'}
							{#if $RailMap.content[$RailMap.content.findIndex((t) => t.title == $state.activeCategory)].content.indexOf(Item.identifier) == -1}
								<div
									class="mx-2 my-3 p-2 shadow-sm border rounded cursor-pointer"
									on:click={() => {
										dispatchSend('addExistingItem', { item: Item, type: $newItem.type });
									}}
								>
									<p class="font-bold">{Item.content.title}</p>
									<p>{Item.content.body.slice(0, 140)}...</p>
									<p class="text-gray-400">{Item.identifier}</p>
								</div>
							{/if}
						{:else if $newItem.type == 'artifact'}
							{#if $RailMap.content[$RailMap.content.findIndex((t) => t.title == $state.activeCategory)].content.indexOf(Item.identifier) == -1}
								<div
									class="mx-2 my-3 p-2 shadow-sm border rounded cursor-pointer"
									on:click={() => {
										dispatchSend('addExistingItem', { item: Item, type: $newItem.type });
									}}
								>
									<p class="font-bold">{Item.identifier}</p>
									<p>{Item.content.maker} {Item.content.title}, {Item.content.date}</p>
									{#if Item.content.body}
										<p>{Item.content.body.slice(0, 140)}...</p>
									{/if}
								</div>
							{/if}
						{:else if DEFAULTS.mediaTypes.indexOf($newItem.type) != -1}
							{#if $RailMap.content[$state.mediaIndex].content[$RailMap.content[$state.mediaIndex].content.findIndex((t) => t.title == $state.activeCategory)].content.indexOf(Item.identifier) == -1}
								<div
									class="mx-2 my-3 p-2 shadow-sm border rounded cursor-pointer"
									on:click={() => {
										dispatchSend('addExistingItem', { item: Item, type: $newItem.type });
									}}
								>
									<p>{Item.identifier}</p>
								</div>
							{/if}
						{/if}
					{/each}
				{/if}
			{:else if $newItem.type == 'story'}
				<FormGroup>
					<Label>Enter a unique identifier for the new {$newItem.type}:</Label>
					<Input type="text" bind:value={$newItem.identifier} />
				</FormGroup>
				<FormGroup>
					<Label>Title:</Label>
					<Input type="text" bind:value={$newItem.content['title']} />
				</FormGroup>
				<FormGroup>
					<Label>Body:</Label>
					<Input type="textarea" rows="6" bind:value={$newItem.content['body']} />
				</FormGroup>
			{:else if $newItem.type == 'musicalmoment'}
				<FormGroup>
					<Label>Enter a unique identifier for the new {$newItem.type}:</Label>
					<Input type="text" bind:value={$newItem.identifier} />
				</FormGroup>
				<FormGroup>
					<Label>Title:</Label>
					<Input type="text" bind:value={$newItem.content['title']} />
				</FormGroup>
				<FormGroup>
					<Label>Person:</Label>
					<Input type="text" bind:value={$newItem.content['person']} />
				</FormGroup>
				<FormGroup>
					<Label>Instrument:</Label>
					<Input type="text" bind:value={$newItem.content['instrument']} />
				</FormGroup>
				<FormGroup>
					<Label>Credit:</Label>
					<Input type="text" bind:value={$newItem.content['credit']} />
				</FormGroup>
			{:else if $newItem.type == 'factoryfootage'}
				<FormGroup>
					<Label>Enter a unique identifier for the new {$newItem.type}:</Label>
					<Input type="text" bind:value={$newItem.identifier} />
				</FormGroup>
				<FormGroup>
					<Label>Label:</Label>
					<Input type="text" bind:value={$newItem.content['label']} />
				</FormGroup>
				<FormGroup>
					<Label>Caption:</Label>
					<Input type="text" bind:value={$newItem.content['caption']} />
				</FormGroup>
			{:else if $newItem.type == 'oralhistory'}
				<FormGroup>
					<Label>Enter a unique identifier for the new {$newItem.type}:</Label>
					<Input type="text" bind:value={$newItem.identifier} />
				</FormGroup>
				<FormGroup>
					<Label>Label:</Label>
					<Input type="text" bind:value={$newItem.content['label']} />
				</FormGroup>
				<FormGroup>
					<Label>Summary:</Label>
					<Input type="text" bind:value={$newItem.content['summary']} />
				</FormGroup>
			{:else if $newItem.type == 'custom'}
				<FormGroup>
					<Label>Enter a unique identifier for the new {$newItem.type}:</Label>
					<Input type="text" bind:value={$newItem.identifier} />
				</FormGroup>
				<FormGroup>
					<Label>Label:</Label>
					<Input type="text" bind:value={$newItem.content['label']} />
				</FormGroup>
				<FormGroup>
					<Label>Summary:</Label>
					<Input type="text" bind:value={$newItem.content['summary']} />
				</FormGroup>
			{:else if $newItem.type == 'artifact'}
				<FormGroup>
					<Label>Enter the catalogue number for the new {$newItem.type} (e.g. "M2022.1.1"):</Label>
					<Input type="text" bind:value={$newItem.identifier} />
				</FormGroup>
				<FormGroup>
					<Label>Maker:</Label>
					<Input type="text" bind:value={$newItem.content['maker']} />
				</FormGroup>
				<FormGroup>
					<Label>Title:</Label>
					<Input type="text" bind:value={$newItem.content['title']} />
				</FormGroup>
				<FormGroup>
					<Label>Date:</Label>
					<Input type="text" bind:value={$newItem.content['date']} />
				</FormGroup>
				<FormGroup>
					<Label>Description:</Label>
					<Input type="textarea" bind:value={$newItem.content['body']} />
				</FormGroup>
				<FormGroup>
					<Label>Credit line:</Label>
					<Input type="text" bind:value={$newItem.content['credit']} />
				</FormGroup>
			{/if}
			<p>Note that all fields are required.</p>
		</div>
	</ModalBody>
	<ModalFooter>
		{#if $state.flagNewOrExisting == 'new'}
			{#if $state.errors.createNewItem}Error creating new item{/if}
			<Button color="primary" on:click={validateForm}
				>Save{#if $state.createItemInProgress}<div class="spinner-container"><Spinner size="sm" /></div>{/if}</Button
			>
		{/if}
	</ModalFooter>
</Modal>
<Modal
	isOpen={$state.fileBrowserModalOpen}
	toggle={() => {
		dispatchSend('toggleModal', { modal: 'file' });
	}}
	scrollable
	size="xl"
>
	<ModalHeader
		toggle={() => {
			dispatchSend('toggleModal', { modal: 'file' });
		}}>Select file</ModalHeader
	>
	<ModalBody>
		<FormGroup>
			<Label for="newFileUpload">Upload new file</Label>
			<Row>
				<Col xs="auto">
					<Input type="file" name="newFileUpload" id="newFileUpload" />
				</Col>
				<Col xs="auto">
					<Button type="submit" on:click={submitForm}
						>Upload{#if $state.fileUploadInProgress}<div class="spinner-container"><Spinner size="sm" /></div>{/if}</Button
					>
				</Col>
				<Col xs="auto"
					>{#if $state.fileUploadMessage}<div transition:fade>
							<p class="status-message">
								{#if $state.fileUploadResult}<Icon name="check-circle" color="green" />{/if}{$state.fileUploadMessage}
							</p>
						</div>{/if}</Col
				>
			</Row>
		</FormGroup>
		<ul class="file-list list-unstyled">
			{#each $fileList.files as file}
				{#if $activeFile.type == 'objects'}
					{#if file.indexOf($DREXItem.content.objectID) != -1 && !DEFAULTS.altSizes.some((size) => file.includes(size))}
						<li
							on:click={() => {
								console.log(file, $activeFile)
								dispatchSend('setFile', { file: file, role: $activeFile.role, type: $activeFile.type, index: $activeFile.index, categoryIndex: $activeFile.categoryIndex });
							}}
						>
							{file}
						</li>
					{/if}
				{:else if file.substring(0, 1) != '.' && file.indexOf('-THUMB') == -1}
					<li
						on:click={() => {
							dispatchSend('setFile', { file: file, role: $activeFile.role, type: $activeFile.type, index: $activeFile.index, categoryIndex: $activeFile.categoryIndex });
						}}
					>
						{file}
					</li>
				{/if}
			{/each}
		</ul>
	</ModalBody>
	<ModalFooter />
</Modal>

<style>
	.spinner-container {
		display: inline;
		padding-left: 10px !important;
	}
	.file-list {
		columns: 3;
	}
	.status-message {
		margin-top: 7px;
		margin-bottom: 0;
	}
</style>
