<script>
	import { Badge, Button, Spinner, Icon } from 'sveltestrap';
	import StoryItems from './StoryItems.svelte';
	import VideoItems from './VideoItems.svelte';
	import ObjectItems from './ObjectItems.svelte';
	import { state, backupItem } from './stores';
	import { createEventDispatcher } from 'svelte';
	export let editItem;

	const dispatch = createEventDispatcher();

	function dispatchSend(f, p = {}) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}
</script>

<div class="w-full border rounded-md p-4">
	{#if editItem.type != ''}
		{#if typeof editItem === 'object' && editItem.type}
			{#if editItem.type == 'artifact'}
				<ObjectItems bind:editItem={editItem} on:execute />
			{:else if editItem.type == 'story'}
				<StoryItems bind:editItem={editItem} on:execute />
			{:else if editItem.type == 'oralhistory' || editItem.type == 'factoryfootage' || editItem.type == 'musicalmoment' || editItem.type == 'custom'}
				<VideoItems bind:editItem={editItem} on:execute />
			{/if}
		{/if}
		<Button
			color="success"
			on:click={() => {
				dispatchSend('saveItem', { item: editItem });
			}}>Save item</Button
		>
		{#if $state.saveItemInProgress}<div class="spinner-container"><Spinner size="sm" /></div>{/if}
		{#if JSON.stringify(editItem) !== JSON.stringify($backupItem)}<Badge color="warning">Item has unsaved changes.</Badge>{/if}
		<Button
			color="warning"
			on:click={() => {
				dispatchSend('undoItemChanges', { item: editItem });
			}}>Reset all changes to item</Button
		>
	{:else}
		<p>Please select an item from the left.</p>
	{/if}
</div>

<style>
	.spinner-container {
		display: inline;
		padding-left: 10px !important;
	}
</style>
