<script>
	import { DREXItem } from './stores';
	import { MEDIAPATH } from './config';
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

	// function dispatchFileBrowser(type, role, index = 0) {
	// 	dispatch('fileBrowser', {
	// 		type: type,
	// 		role: role,
	// 		index: index,
	// 	});
	// }

	// function toggleModal(modal, options) {
	// 	dispatch('toggleModal', {
	// 		modal: modal,
	// 		options: options,
	// 	});
	// }

	function dispatchSend(f, p = {}) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}
	console.log($DREXItem.type)
</script>

{#if $DREXItem.content}
	{#if $DREXItem.type == 'musicalmoment'}
		<div class="mb-3">
			<p>Clip name:</p>
			<Input type="text" bind:value={$DREXItem.content.title} />
		</div>
		<div class="mb-3">
			<p>Person/performer:</p>
			<Input type="text" bind:value={$DREXItem.content.person} />
		</div>
		<div class="mb-3">
			<p>Instrument featured:</p>
			<Input type="text" bind:value={$DREXItem.content.instrument} />
		</div>
		<div class="mb-3">
			<p>Credit of:</p>
			<Input type="text" bind:value={$DREXItem.content.credit} />
		</div>
	{:else if $DREXItem.type == 'factoryfootage'}
		<div class="mb-3">
			<p>Clip label:</p>
			<Input type="text" bind:value={$DREXItem.content.label} />
		</div>
		<div class="mb-3">
			<p>Caption:</p>
			<Input type="text" bind:value={$DREXItem.content.caption} />
		</div>
	{:else if $DREXItem.type == 'oralhistory'}
		<div class="mb-3">
			<p>Clip label:</p>
			<Input type="text" bind:value={$DREXItem.content.label} />
		</div>
		<div class="mb-3">
			<p>Summary:</p>
			<Input type="text" bind:value={$DREXItem.content.summary} />
		</div>
	{:else if $DREXItem.type == 'custom'}
		<div class="mb-3">
			<p>Clip label:</p>
			<Input type="text" bind:value={$DREXItem.content.label} />
		</div>
	{/if}
	<div class="mb-3">
		<p>Thumbnail image:</p>
		{#if $DREXItem.content.thumbnail}
			<img src={MEDIAPATH + 'images/' + $DREXItem.content.thumbnail} alt={$DREXItem.content.thumbnail} />
		{/if}
		<p
			class="filelink"
			on:click={() => {
				dispatchSend('toggleModal', { modal: 'file', options: { type: 'images', role: 'thumbnail' } });
			}}
		>
			{#if $DREXItem.content.thumbnail}
				{$DREXItem.content.thumbnail}
			{:else}
				Add thumbnail image
			{/if}
		</p>
	</div>
	<div class="mb-3 w-96">
	<video id="video" controls style="w-24">
		{#if $DREXItem.content.clip}
			<source src={MEDIAPATH + 'videos/' + $DREXItem.content.clip} />
		{/if}
		<track kind="captions" />
	</video>

	<p
		class="filelink"
		on:click={() => {
			dispatchSend('toggleModal', { modal: 'file', options: { type: 'videos', role: 'clip' } });
			//toggleModal('file', { type: 'videos', role: 'clip' });
		}}
	>
		{#if $DREXItem.content.clip}
			{$DREXItem.content.clip}
		{:else}
			Add clip file
		{/if}
	</p>
	</div>
{/if}
