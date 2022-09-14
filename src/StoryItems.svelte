<script>
	import { DREXItem, mediaPath } from './stores';
	import { createEventDispatcher } from 'svelte';
	import { FormGroup, Label, Input, TabContent } from 'sveltestrap';
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
			options: options,
		});
	}

	function dispatchModifyImageArray(image, action) {
		dispatch('modifyImageArray', {
			image: image,
			action: action,
		});
	}

	$: if (!$DREXItem.content.images) {
		$DREXItem.content.images = [];
	}
</script>

{#if Object.keys($DREXItem).length != 0}
	<div
		class="hero-image"
		on:click={() => {
			toggleModal('file', { type: 'images', role: 'heroImage' });
		}}
	>
		{#if $DREXItem.content.heroImage}
			<p>Story hero image:</p>
			<img src={$mediaPath + 'images/' + $DREXItem.content.heroImage} alt={$DREXItem.content.heroImage} />
		{/if}
		<p class="filelink">
			{#if $DREXItem.content.heroImage}
				{$DREXItem.content.heroImage}
			{:else}
				Add hero image
			{/if}
		</p>
	</div>
	<div class="top-spacer" />
	<FormGroup>
		<Label for="story-title">Story title</Label>
		<Input id="story-title" type="text" bsSize="lg" bind:value={$DREXItem.content.title} />
	</FormGroup>
	<FormGroup>
		<Label for="story-body">Story body</Label>
		<Input id="story-body" type="textarea" rows="10" bind:value={$DREXItem.content.body} />
	</FormGroup>

	<p class="top-spacer">Story images:</p>
	<div class="image-container">
		{#if $DREXItem.content.images}
			{#each $DREXItem.content.images as Image (Image)}
				<div class="grid-container-item">
					<img src={$mediaPath + 'images/' + Image.full} class="storyThumbnail" alt={Image.full} />
					<p
						class="filelink"
						on:click={() => {
							toggleModal('file', { type: 'images', role: 'images', index: $DREXItem.content.images.indexOf(Image) });
						}}
					>
						{Image.full}
					</p>
					{#if Image.caption}
						<Input type="textarea" rows="3" bind:value={Image.caption} />
					{/if}
					<div class="grid-container-item-controls">
						<div />

						{#if $DREXItem.content.images.indexOf(Image) != 0}
							<div
								on:click={() => {
									dispatchModifyImageArray(Image, 'moveup');
								}}
							>
								<ArrowLeft />
							</div>
						{:else}
							<div class="blank-icon" />
						{/if}
						{#if $DREXItem.content.images.indexOf(Image) != $DREXItem.content.images.length - 1}
							<div
								on:click={() => {
									dispatchModifyImageArray(Image, 'movedown');
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
			toggleModal('file', { type: 'images', role: 'images', index: $DREXItem.content.images.length });
		}}
	>
		Add image
	</p>
	<audio id="audio" controls>
		{#if $DREXItem.content.inlineAudioClip}
			<source src={$mediaPath + 'audio/' + $DREXItem.content.inlineAudioClip.source} />
		{/if}
		<track kind="captions" />
	</audio>
	{#if $DREXItem.content.inlineAudioClip}
		<Input type="text" bind:value={$DREXItem.content.inlineAudioClip.caption} />
	{/if}
	<p
		class="filelink"
		on:click={() => {
			toggleModal('file', { type: 'audio', role: 'embeddedAudioClip' });
		}}
	>
		{#if $DREXItem.content.inlineAudioClip}
			{$DREXItem.content.inlineAudioClip.source}
		{:else}
			Add embedded audio clip
		{/if}
	</p>
{/if}

<style>
	.blank-icon {
		width: 24px;
	}
	.hero-image {
		width: 100%;
		height: 100%;
	}
	.top-spacer {
		margin-top: 20px;
	}
	.image-container {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-bottom: 10px;
	}
	.image-container img {
		height: 200px;
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
