<script lang="ts">
	import { DREXItem, activeMediaCategory, mediaPath } from './stores';
	import { createEventDispatcher } from 'svelte';
	var clip = $DREXItem.content.clip;

	$: if (Object.keys($DREXItem).length != 0) {
		if (clip != $DREXItem.content.clip) {
			const video = document.getElementById('video');
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
</script>

{#if Object.keys($DREXItem).length != 0}
	{#if $activeMediaCategory == 'music'}
		<div>
			Clip name:
			<h4 contenteditable="true" bind:innerHTML={$DREXItem.content.title} />
		</div>
		<div>
			Person/performer:
			<h5 contenteditable="true" bind:innerHTML={$DREXItem.content.person} />
		</div>
		<div>
			Instrument featured:
			<h5 contenteditable="true" bind:innerHTML={$DREXItem.content.instrument} />
		</div>
		<div>
			Credit of:
			<h5 contenteditable="true" bind:innerHTML={$DREXItem.content.credit} />
		</div>
	{:else if $activeMediaCategory == 'factory'}
		<div>
			Clip label:
			<h4 contenteditable="true" bind:innerHTML={$DREXItem.content.label} />
		</div>
		<div>
			Caption:
			<p contenteditable="true" bind:innerHTML={$DREXItem.content.caption} />
		</div>
	{:else if $activeMediaCategory == 'oralhistory'}
		<div>
			Clip label:
			<h4 contenteditable="true" bind:innerHTML={$DREXItem.content.label} />
		</div>
		<div>
			Summary:
			<p contenteditable="true" bind:innerHTML={$DREXItem.content.summary} />
		</div>
	{/if}
	<div>
		<p>Thumbnail image:</p>
		<img src={$mediaPath + 'images/' + $DREXItem.content.thumbnail} alt={$DREXItem.content.thumbnail} />
		<p
			class="filelink"
			on:click={() => {
				dispatchFileBrowser('images', 'thumbnail');
			}}
		>
			{$DREXItem.content.thumbnail}
		</p>
	</div>
	<video id="video" controls>
		<source src={$mediaPath + 'videos/' + $DREXItem.content.clip} />
		<track kind="captions" />
	</video>
	<p
		class="filelink"
		on:click={() => {
			dispatchFileBrowser('videos', 'clip');
		}}
	>
		{$DREXItem.content.clip}
	</p>
{/if}
