<script>
	import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, FormText, Label, Input, Button, TabContent } from 'sveltestrap';
	import { RailMap, state, fileList, drexPath, activeFile, newItem, listItemsOfType, DREXItem, typePlurals, mediaTypes } from './stores';
	import { createEventDispatcher, onMount } from 'svelte';

	let dispatch = createEventDispatcher();

	function toggleModal(modal) {
		dispatch('toggleModal', {
			modal: modal,
		});
	}

	function setFile(file, fileRole, fileIndex = 0) {
		dispatch('setFile', {
			file: file,
			fileRole: fileRole,
			fileIndex: fileIndex,
		});
	}

	function addExistingItem(item, type) {
		dispatch('addExistingItem', {
			item: item,
			type: type,
		});
	}

	function addNewItem(item) {
		dispatch('addNewItem', {
			item: item,
		});
	}

	function submitForm(e) {
		e.preventDefault();
		const fileUpload = document.getElementById('newFileUpload');
		console.log(fileUpload.files[0])
		const formData = new FormData();
		formData.append('fileUpload', fileUpload.files[0]);
		fetch($drexPath + 'upload', {
			method: 'POST',
			body: formData,
		})
			.then((res) => console.log(res))
			.catch((err) => ('Error occured', err));
	}
</script>

<Modal
	isOpen={$state.objectModalOpen}
	toggle={() => {
		toggleModal('object');
	}}
	size="xl"
>
	<ModalHeader
		toggle={() => {
			toggleModal('object');
		}}
	>
		New {$newItem.type} item
	</ModalHeader>
	<ModalBody>
		<p
			class="link"
			on:click={() => {
				$state.flagNewOrExisting = 'existing';
			}}
		>
			Add existing item
		</p>
		<p
			class="link"
			on:click={() => {
				$state.flagNewOrExisting = 'new';
			}}
		>
			Create new item
		</p>
		{#if $state.flagNewOrExisting == 'existing'}
			{#if Object.keys($listItemsOfType).length > 0}
				<h4 class="top-spacer">Select an existing {$newItem.type}</h4>
				{#each $listItemsOfType as Item}
					{#if $newItem.type == 'story'}
						{#if $RailMap.content[$RailMap.content.findIndex((t) => t.contentType == $typePlurals[$newItem.type])].content.indexOf(Item.identifier) == -1}
							<div
								class="top-spacer"
								on:click={() => {
									addExistingItem(Item, $newItem.type);
								}}
							>
								<h5>{Item.identifier}</h5>
								<h6>{Item.content.title}</h6>
								<span>{Item.content.body.slice(0, 120)}...</span>
							</div>
						{/if}
					{:else if $mediaTypes.indexOf($newItem.type) != -1}
						<!-- <h5>{ $RailMap.content[$state.railMapMediaIndex].content }</h5> -->
						{#if $RailMap.content[$state.railMapMediaIndex].content[$RailMap.content[$state.railMapMediaIndex].content.findIndex((t) => t.contentType == $typePlurals[$newItem.type])].content.indexOf(Item.identifier) == -1}
							<div
								class="top-spacer"
								on:click={() => {
									addExistingItem(Item, $newItem.type);
								}}
							>
								<h5>{Item.identifier}</h5>
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
		{/if}
		{#if $state.errorMessage != ''}
			{$state.errorMessage}
		{/if}
	</ModalBody>
	<ModalFooter>
		{#if $state.flagNewOrExisting == 'new'}
			<Button
				color="primary"
				on:click={() => {
					addNewItem($newItem);
				}}>Save</Button
			>
		{/if}
	</ModalFooter>
</Modal>
<Modal
	isOpen={$state.fileBrowserModalOpen}
	toggle={() => {
		toggleModal('file');
	}}
	scrollable
	size="xl"
>
	<ModalHeader
		toggle={() => {
			toggleModal('file');
		}}>Select file</ModalHeader
	>
	<ModalBody>
			<FormGroup>
				<Label for="newFileUpload">Upload new file</Label>
				<Input type="file" name="newFileUpload" id="newFileUpload" />
				<FormText color="muted">This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line.</FormText>
				<Button type="submit" on:click={submitForm}>Upload</Button>
			</FormGroup>
		{#each $fileList.files as file}
			{#if file.substring(0, 1) != '.'}
				<p
					on:click={() => {
						setFile(file, $activeFile.role, $activeFile.index);
					}}
				>
					{file}
				</p>
			{/if}
		{/each}
	</ModalBody>
	<ModalFooter />
</Modal>

<style>
	.link {
		text-decoration: 'underline';
	}
</style>
