<script lang="ts">
	import { DREXItem, activeMediaCategory, mediaPath, typePlurals, prettyMediaTypes } from './stores';
	import { Input } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	var clip = $DREXItem.content.clip;

	$: if (Object.keys($DREXItem).length != 0) {
		if (clip != $DREXItem.content.clip) {
			const video = document.getElementById('video');
			video.load();
			video.pause();
			video.load();
		}
	}

	let dispatch = createEventDispatcher();

	function dispatchFileBrowser(type, role, index = 0) {
		dispatch('fileBrowser', {
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
</script>

{#if $DREXItem.content}
	{#if $DREXItem.type == 'musicalmoment'}
		<div>
			Clip name:
			<Input type="text" bind:value={$DREXItem.content.title} />
		</div>
		<div>
			Person/performer:
			<Input type="text" bind:value={$DREXItem.content.person} />
		</div>
		<div>
			Instrument featured:
			<Input type="text" bind:value={$DREXItem.content.instrument} />
		</div>
		<div>
			Credit of:
			<Input type="text" bind:value={$DREXItem.content.credit} />
		</div>
	{:else if $DREXItem.type == 'factoryfootage'}
		<div>
			Clip label:
			<Input type="text" bind:value={$DREXItem.content.label} />
		</div>
		<div>
			Caption:
			<Input type="text" bind:value={$DREXItem.content.caption} />
		</div>
	{:else if $DREXItem.type == 'oralhistory'}
		<div>
			Clip label:
			<Input type="text" bind:value={$DREXItem.content.label} />
		</div>
		<div>
			Summary:
			<Input type="text" bind:value={$DREXItem.content.summary} />
		</div>
	{/if}
	<div>
		<p>Thumbnail image:</p>
		{#if $DREXItem.content.thumbnail}
			<img src={$mediaPath + 'images/' + $DREXItem.content.thumbnail} alt={$DREXItem.content.thumbnail} />
		{/if}
		<p
			class="filelink"
			on:click={() => {
				toggleModal('file', { type: 'images', role: 'thumbnail' });
			}}
		>
			{#if $DREXItem.content.thumbnail}
				{$DREXItem.content.thumbnail}
			{:else}
				Add thumbnail image
			{/if}
		</p>
	</div>

	<video id="video" controls>
		{#if $DREXItem.content.clip}
			<source src={$mediaPath + 'videos/' + $DREXItem.content.clip} />
		{/if}
		<track kind="captions" />
	</video>

	<p
		class="filelink"
		on:click={() => {
			toggleModal('file', { type: 'videos', role: 'clip' });
		}}
	>
		{#if $DREXItem.content.clip}
			{$DREXItem.content.clip}
		{:else}
			Add clip file
		{/if}
	</p>
{/if}
