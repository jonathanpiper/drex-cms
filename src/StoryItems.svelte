<script>
	import { DREXItem, mediaPath } from './stores';
	import { createEventDispatcher } from 'svelte';
	import { Input, TabContent } from 'sveltestrap';
	import { MinusCircle, ArrowLeft, ArrowRight } from 'lucide-svelte';

	let dispatch = createEventDispatcher();

	function dispatchFileBrowser(type, role, index = 0) {
		dispatch('toggleModal', {
			type: type,
			role: role,
			index: index,
		});
	}

	function toggleModal(modal, options) {
		dispatch('toggleModal', {
			modal: modal,
			options: options
		});
	}

	function dispatchModifyImageArray(image, action) {
		dispatch('modifyImageArray', {
			image: image,
			action: action,
		});
	}

	var storyState = {
		flagHasHeroImage: false,
		flagHasImages: false,
	};

	$: if (Object.keys($DREXItem.content).length != 0) {
		console.log(Object.keys($DREXItem))
		if ($DREXItem.content.heroImage.length > 0) {
			storyState.flagHasHeroImage = true;
		}
		if ($DREXItem.content.images.length > 0) {
			storyState.flagHasImages = true;
		}
	}
</script>

{#if Object.keys($DREXItem).length != 0}
	{#if storyState.flagHasHeroImage}
		<img src={$mediaPath + 'images/' + $DREXItem.content.heroImage} alt={$DREXItem.content.heroImage} />
	{/if}
	<p
		class="filelink"
		on:click={() => {
			//dispatchFileBrowser('images', 'heroImage');
			toggleModal('file', {type: 'images', role: 'heroImage'});
		}}
	>
		{#if storyState.flagHasHeroImage}
			{$DREXItem.content.heroImage}
		{:else}
			Add hero image
		{/if}
	</p>
	<div class="top-spacer" />
	<h4 contenteditable="true" bind:innerHTML={$DREXItem.content.title} />
	<Input type="textarea" rows=20 bind:value={$DREXItem.content.body} />

	<p class="top-spacer">Story images:</p>
	<div class="image-container">
		{#if storyState.flagHasImages}
			{#each $DREXItem.content.images as Image (Image)}
				<div class="grid-container-item">
					<img src={$mediaPath + 'images/' + Image.full} class="storyThumbnail" alt={Image.full} />
					<p
						class="filelink"
						on:click={() => {
							toggleModal('file', {type: 'images', role: 'images', index: $DREXItem.content.images.indexOf(Image)});
							// dispatchFileBrowser('images', 'images', $DREXItem.content.images.indexOf(Image));
						}}
					>
						{Image.full}
					</p>
					<div class="grid-container-item-controls">
						<div />
						<div>
							{#if $DREXItem.content.images.indexOf(Image) != 0}
								<div
									on:click={() => {
										dispatchModifyImageArray(Image, 'moveup');
									}}
								>
									<ArrowLeft />
								</div>
							{/if}
							{#if $DREXItem.content.images.indexOf(Image) != $DREXItem.content.images.length - 1}
								<div
									on:click={() => {
										dispatchModifyImageArray(Image, 'movedown');
									}}
								>
									<ArrowRight />
								</div>
							{/if}
						</div>
						<div
							on:click={() => {
								dispatchModifyImageArray(Image, 'remove');
							}}
						>
							<MinusCircle color="red" />
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<p
		class="filelink"
		on:click={() => {
			toggleModal('file', {type: 'images', role: 'images', index: $DREXItem.content.images.length});
		}}
	>
		Add image
	</p>
{/if}

<style>
	.top-spacer {
		margin-top: 20px;
	}
	.image-container {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 10px;
		margin-bottom: 10px;
	}
	.image-container img {
		height: 200px;
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
		grid-template-columns: 1fr 7fr 1fr;
	}
</style>
