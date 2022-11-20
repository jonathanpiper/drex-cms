<script>
	import { DREXItem, state } from './stores';
	import { MEDIAPATH } from './config';
	import { createEventDispatcher, onMount } from 'svelte';
	import { FormGroup, Label, Input, TabContent } from 'sveltestrap';
	import { MinusCircle, ArrowLeft, ArrowRight } from 'lucide-svelte';
	export let editItem;

	let dispatch = createEventDispatcher();

	function dispatchModifyImageArray(image, action) {
		dispatch('modifyImageArray', {
			image: image,
			action: action,
		});
	}

	function dispatchSend(f, p = {}) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}

	$: if (!editItem.content.images) {
		editItem.content.images = [];
	}
</script>

{#if Object.keys(editItem).length != 0}
	<FormGroup>
		<Label for="story-title">Story title</Label>
		<Input id="story-title" type="text" bind:value={editItem.content.title} />
	</FormGroup>
	<FormGroup>
		<Label for="story-body">Story body</Label>
		<Input id="story-body" type="textarea" rows="10" bind:value={editItem.content.body} />
	</FormGroup>
	<div
		class="hero-image"
		on:click={() => {
			dispatchSend('toggleModal', { modal: 'file', options: { type: 'images', role: 'heroImage' } });
			dispatchSend('setChanged', { scope: 'item' });
		}}
	>
		{#if editItem.content.heroImage}
			<p class="image-label">Story hero image:</p>
			<img src={MEDIAPATH + 'images/' + editItem.content.heroImage} alt={editItem.content.heroImage} class="editor-hero-item" />
		{/if}
		<p class="filelink">
			{#if editItem.content.heroImage}
				{editItem.content.heroImage}
			{:else}
				Add hero image
			{/if}
		</p>
	</div>
	<p class="top-spacer image-label">Story images:</p>
	<div class="image-container mb-4">
		{#if editItem.content.images}
			{#each editItem.content.images as Image, Index}
				<div class="grid-container-item shado flex-col">
					<img src={MEDIAPATH + 'images/' + Image.full} class="object-contain m-auto" alt={Image.full} />
					<p
						class="filelink"
						on:click={() => {
							dispatchSend('toggleModal', { modal: 'file', options: { type: 'images', role: 'images', index: editItem.content.images.indexOf(Image) } });
						}}
					>
						{Image.full}
					</p>
					<Input type="textarea" rows="3" bind:value={Image.caption} placeholder="Caption (leave blank for no caption)" />
					<div class="grid-container-item-controls">
						<div />

						{#if Index != 0}
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
						{#if Index != editItem.content.images.length - 1}
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
		<p
			class="filelink"
			on:click={() => {
				dispatchSend('toggleModal', { modal: 'file', options: { type: 'images', role: 'images', index: editItem.content.images.length } });
			}}
		>
			Add image
		</p>
	</div>
	<div class="mb-4">
		<audio id="audio" controls class="mb-2">
			{#if editItem.content.inlineAudioClip}
				<source src={MEDIAPATH + 'audio/' + editItem.content.inlineAudioClip.source} />
			{/if}
			<track kind="captions" />
		</audio>
		{#if editItem.content.inlineAudioClip}
			<Input type="text" bind:value={editItem.content.inlineAudioClip.caption} />
		{/if}
		<p
			class="filelink"
			on:click={() => {
				dispatchSend('toggleModal', { modal: 'file', options: { type: 'audio', role: 'embeddedAudioClip' } });
			}}
		>
			{#if editItem.content.inlineAudioClip}
				{editItem.content.inlineAudioClip.source}
			{:else}
				Add embedded audio clip
			{/if}
		</p>
	</div>
{/if}

<style>
	.image-label {
		margin-bottom: 4px;
	}
	.blank-icon {
		width: 24px;
	}
	.hero-image {
		width: 100%;
	}
	.top-spacer {
		margin-top: 20px;
	}
	.image-container {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.image-container img {
		height: 200px;
		max-width: 200px;
	}
	.grid-container-item {
		border: 1px black solid;
		padding: 10px;
	}
	.grid-container-item-controls {
		display: grid;
		grid-template-columns: 4fr 1fr 1fr 3fr 1fr;
	}
	.editor-hero-item {
		max-width: 100%;
	}
</style>
