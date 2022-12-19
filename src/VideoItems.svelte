<script>
	import { DREXItem } from './stores';
	import { MEDIAPATH } from './config';
	import { Input } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	export let editItem;
	var clip = editItem.content.clip;

	$: if (Object.keys(editItem).length != 0) {
		if (clip != editItem.content.clip) {
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
	console.log(editItem.type);
</script>

{#if editItem.content}
	{#if editItem.type == 'musicalmoment'}
		<div class="mb-3">
			<p>Clip name:</p>
			<Input type="text" bind:value={editItem.content.title} />
		</div>
		<div class="mb-3">
			<p>Person/performer:</p>
			<Input type="text" bind:value={editItem.content.person} />
		</div>
		<div class="mb-3">
			<p>Instrument featured:</p>
			<Input type="text" bind:value={editItem.content.instrument} />
		</div>
		<div class="mb-3">
			<p>Credit of:</p>
			<Input type="text" bind:value={editItem.content.credit} />
		</div>
		<div class="mb-3">
			<p>Year:</p>
			<Input type="text" bind:value={editItem.content.year} />
		</div>
	{:else if editItem.type == 'factoryfootage'}
		<div class="mb-3">
			<p>Clip label:</p>
			<Input type="text" bind:value={editItem.content.label} />
		</div>
		<div class="mb-3">
			<p>Caption:</p>
			<Input type="text" bind:value={editItem.content.caption} />
		</div>
	{:else if editItem.type == 'oralhistory'}
		<div class="mb-3">
			<p>Clip label:</p>
			<Input type="text" bind:value={editItem.content.label} />
		</div>
		<div class="mb-3">
			<p>Summary:</p>
			<Input type="text" bind:value={editItem.content.summary} />
		</div>
	{:else if editItem.type == 'custom'}
		<div class="mb-3">
			<p>Clip label:</p>
			<Input type="text" bind:value={editItem.content.label} />
		</div>
	{/if}
	<div class="mb-3">
		<p>Thumbnail image:</p>
		{#if editItem.content.thumbnail}
			<img src={MEDIAPATH + 'images/' + editItem.content.thumbnail} alt={editItem.content.thumbnail} />
		{/if}
		<p
			class="filelink"
			on:click={() => {
				dispatchSend('toggleModal', { modal: 'file', options: { type: 'images', role: 'thumbnail' } });
			}}
		>
			{#if editItem.content.thumbnail}
				{editItem.content.thumbnail}
			{:else}
				Add thumbnail image
			{/if}
		</p>
	</div>
	<div class="mb-3 w-96">
		<video id="video" controls style="w-24">
			{#if editItem.content.clip}
				<source src={MEDIAPATH + 'videos/' + editItem.content.clip} />
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
			{#if editItem.content.clip}
				{editItem.content.clip}
			{:else}
				Add clip file
			{/if}
		</p>
		<input type="checkbox" bind:checked={editItem.content.staticClip} /> Is this a static clip (i.e. music with a static image rather than video)?
	</div>
{/if}
