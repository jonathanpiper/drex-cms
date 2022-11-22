<script>
	import { DREXItem } from './stores';
	import { MEDIAPATH } from './config';
	import { createEventDispatcher } from 'svelte';
	import { FormGroup, Label, Input, TabContent } from 'sveltestrap';
	import { MinusCircle, ArrowLeft, ArrowRight } from 'lucide-svelte';
	export let editItem;

	let dispatch = createEventDispatcher();

	function dispatchSend(f, p = {}) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}
</script>

{#if Object.keys(editItem).length != 0}
	<FormGroup>
		<Label for="story-title">Maker</Label>
		<Input id="story-title" type="text" bind:value={editItem.content.maker} />
	</FormGroup>
	<FormGroup>
		<Label for="story-title">Maker</Label>
		<Input id="story-title" type="text" bind:value={editItem.content.title} />
	</FormGroup>
	<FormGroup>
		<Label for="story-title">Maker</Label>
		<Input id="story-title" type="text" bind:value={editItem.content.date} />
	</FormGroup>
	<FormGroup>
		<Label for="story-title">Description</Label>
		<Input id="story-title" type="textarea" rows="5" bind:value={editItem.content.body} />
	</FormGroup>
	<FormGroup>
		<Label for="story-title">Credit line</Label>
		<Input id="story-title" type="text" bind:value={editItem.content.credit} />
	</FormGroup>
	<FormGroup>
		<Label for="story-title">Catalogue number</Label>
		<Input id="story-title" type="text" bind:value={editItem.content.objectID} />
	</FormGroup>
	<p class="font-bold clear-left inline">Note:</p>
	<p class="inline">Image files must be named cataloguenumber_view.jpg, e.g. "2022.1.1_Front.jpg," or they will not appear.</p>
	<div class="image-container mb-2">
		{#if editItem.content.images}
			{#each editItem.content.images as Image, Index}
				<div class="grid-container-item shadow-md rounded flex-col">
					<img src={MEDIAPATH + 'objects/' + editItem.content.objectID + '_' + Image.name + '.jpg'} class="h-48 object-contain m-auto" alt={Image.full} />
					<p
						class="filelink"
						on:click={() => {
							dispatchSend('toggleModal', { modal: 'file', options: { type: 'images', role: 'images', index: editItem.content.images.indexOf(Image) } });
						}}
					>
						{Image.name}
					</p>
					<div class="grid-container-item-controls">
						<div />

						{#if editItem.content.images.indexOf(Image) != 0}
							<div
								on:click={() => {
									dispatchSend('modifyImageArray', { item: editItem, image: Image, action: 'moveup' });
								}}
							>
								<ArrowLeft />
							</div>
						{:else}
							<div class="blank-icon" />
						{/if}
						{#if editItem.content.images.indexOf(Image) != editItem.content.images.length - 1}
							<div
								on:click={() => {
									dispatchSend('modifyImageArray', { item: editItem, image: Image, action: 'movedown' });
								}}
							>
								<ArrowRight />
							</div>
						{:else}
							<div class="blank-icon" />
						{/if}
						<div />
						<div
							on:click={() => {
								dispatchSend('modifyImageArray', { item: editItem, image: Image, action: 'remove' });
							}}
						>
							<MinusCircle color="red" />
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<div class="mb-4">
		<p
			class="filelink"
			on:click={() => {
				dispatchSend('toggleModal', { modal: 'file', options: { type: 'objects', role: 'images', index: editItem.content.images.length } });
			}}
		>
			Add image
		</p>
	</div>
{/if}

<style>
	.image-container {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-rows: 280px;
		gap: 10px;
	}
	.image-container img {
		width: 100%;
	}
	.grid-container-item {
		border: 1px black solid;
		width: 100%;
		text-align: center;
		padding: 10px;
	}
	.grid-container-item-controls {
		display: grid;
		grid-template-columns: 4fr 1fr 1fr 3fr 1fr;
	}
</style>
