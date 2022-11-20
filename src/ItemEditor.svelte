<script>
	import { Badge, Button, Spinner, Icon } from 'sveltestrap';
	import StoryItems from './StoryItems.svelte';
	import VideoItems from './VideoItems.svelte';
	import ObjectItems from './ObjectItems.svelte';
	import { DREXItem, state, backupItem } from './stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function dispatchSend(f, p = {}) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}

</script>

<div class="w-full border rounded-md p-4">
{#if $DREXItem.type != ''}
	{#if typeof $DREXItem === 'object' && $DREXItem.type}
		{#if $DREXItem.type == 'artifact'}
			<ObjectItems on:execute />
		{:else if $DREXItem.type == 'story'}
			<StoryItems on:execute />
		{:else if $DREXItem.type == 'oralhistory' || $DREXItem.type == 'factoryfootage' || $DREXItem.type == 'musicalmoment' || $DREXItem.type == 'custom'}
			<VideoItems on:execute />
		{/if}
	{/if}
	<Button
		color="success"
		on:click={() => {
			dispatchSend('saveItem', { item: $DREXItem });
		}}>Save item</Button
	>
	{#if $state.saveItemInProgress}<div class="spinner-container"><Spinner size="sm" /></div>{/if}
	{#if JSON.stringify($DREXItem) !== JSON.stringify($backupItem)}<Badge color="warning">Item has unsaved changes.</Badge>{/if}
	<Button
		color="warning"
		on:click={() => {
			dispatchSend('undoItemChanges', { item: $DREXItem });
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
