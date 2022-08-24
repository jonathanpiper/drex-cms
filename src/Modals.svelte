<script>
	import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button } from 'sveltestrap';
	import { state, fileList, drexPath, activeFile, newItem, listItemsOfType } from './stores';
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

	function addExistingItem(item, category) {
		dispatch('addExistingItem', {
			item: item,
			category: category,
		});
	}

	function addNewItem(item, category) {
		dispatch('addNewItem', {
			item: item,
			category: category,
		});
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
		{#if $newItem.type == 'story'}
			{#if $state.flagNewOrExisting == 'existing'}
				<h4 class="top-spacer">Select an existing story</h4>
				{#if Object.keys($listItemsOfType).length > 0}
					{#each $listItemsOfType as Item}
						<div
							class="top-spacer"
							on:click={() => {
								addExistingItem(Item, $state.activeCategory);
							}}
						>
							<h5>{Item.identifier}</h5>
							<h6>{Item.content.title}</h6>
							<span>{Item.content.body.slice(0, 120)}...</span>
						</div>
					{/each}
				{/if}
			{:else}
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
			{/if}
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
					addNewItem($newItem, $state.activeCategory);
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
		{#each $fileList.files as file}
			<p
				on:click={() => {
					setFile(file, $activeFile.role, $activeFile.index);
				}}
			>
				{file}
			</p>
		{/each}
	</ModalBody>
	<ModalFooter />
</Modal>

<style>
	.link {
		text-decoration: 'underline';
	}
</style>
