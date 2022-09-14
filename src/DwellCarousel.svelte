<script>
	import { RailMap, mediaPath } from './stores';
	import { ArrowLeft, ArrowRight, MinusCircle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function toggleModal(modal, options) {
		dispatch('toggleModal', {
			modal: modal,
			options: options,
		});
	}

	function modifyDwellImageArray(image, action, index) {
		dispatch('modifyDwellImageArray', {
			image: image,
			action: action,
			index: index,
		});
	}
</script>

<div class="image-container">
	{#each $RailMap.dwell.images as Image, Index}
		<div class="grid-container-item">
			<img src={$mediaPath + 'images/' + Image} class="storyThumbnail" alt={Image.full} />
			<p
				class="filelink"
				on:click={() => {
					toggleModal('file', { type: 'images', role: 'images', index: $RailMap.dwell.images.indexOf(Image) });
				}}
			>
				{Image}
			</p>
			<div class="grid-container-item-controls">
				<div />
				{#if $RailMap.dwell.images.indexOf(Image) != 0}
					<div
						on:click={() => {
							modifyDwellImageArray(Image, 'moveup', Index);
						}}
					>
						<ArrowLeft />
					</div>
				{:else}
					<div class="blank-icon" />
				{/if}
				{#if $RailMap.dwell.images.indexOf(Image) != $RailMap.dwell.images.length - 1}
					<div
						on:click={() => {
							modifyDwellImageArray(Image, 'movedown', Index);
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
						modifyDwellImageArray(Image, 'remove', Index);
					}}
				>
					<MinusCircle color="red" />
				</div>
			</div>
		</div>
	{/each}
</div>
<p
	class="filelink"
	on:click={() => {
		toggleModal('file', { type: 'images', role: 'dwellImages', index: $RailMap.dwell.images.length });
	}}
>
	Add image
</p>

<style>
	.blank-icon {
		width: 24px;
	}
	.image-container {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		margin-bottom: 10px;
	}
	.image-container img {
		height: 100px;
		max-width: 200px;
	}
	.storyThumbnail {
		object-fit: contain;
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
