<script>
	import { Row, Col, Button, Badge } from 'sveltestrap';
	import { MinusCircle, ArrowUp, ArrowDown, PlusCircle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { RailMap, state, DREXItem } from './stores';
	import { MEDIAPATH, DEFAULTS } from './config';
	import { arrayMoveMutable } from 'array-move';
	import { Input, Card, CardBody, CardFooter, CardHeader, CardTitle } from 'sveltestrap';
	export let categoryIndex;
	export let categoryContent;

	const dispatch = createEventDispatcher();

	function dispatchSend(f, p = {}) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}
</script>

{#if categoryContent}
	{#if categoryContent.content.length == 0}
		<div><p>No items yet.</p></div>
	{/if}
	{#if categoryContent.contentType != 'media'}
		<ol>
			{#each categoryContent.content as Item, Index}
				<li>
					<div class="item-row">
						<p
							class="list"
							on:click={() => {
								dispatchSend('getItem', { item: Item, contentType: categoryContent.contentType });
							}}
						>
							{Item}
						</p>
						<div class="item-controls">
							{#if categoryContent.content.indexOf(Item) != 0}
								<div
									on:click={() => {
										dispatchSend('modifyRailItem', { action: 'moveUp', itemIndex: Index, categoryIndex: categoryIndex });
									}}
								>
									<ArrowUp />
								</div>
							{:else}
								<div class="blank-icon" />
							{/if}
							{#if categoryContent.content.indexOf(Item) != categoryContent.content.length - 1}
								<div
									on:click={() => {
										dispatchSend('modifyRailItem', { action: 'moveDown', itemIndex: Index, categoryIndex: categoryIndex });
									}}
								>
									<ArrowDown />
								</div>
							{:else}
								<div class="blank-icon" />
							{/if}
							<div
								class="delete-button"
								on:click={() => {
									dispatchSend('modifyRailItem', { action: 'remove', item: Item, itemIndex: Index, categoryIndex: categoryIndex });
								}}
							>
								<MinusCircle color="red" />
							</div>
						</div>
					</div>
				</li>
			{/each}
			<div class="add-button clickable">
				<div
					on:click={() => {
						dispatchSend('initializeNewItem', { contentType: categoryContent.contentType, categoryTitle: categoryContent.title });
					}}
				>
					<PlusCircle color="green" class="inline" />
					<p class="align-middle inline ml-1 pt-0.5">Add new item</p>
				</div>
			</div>
		</ol>
	{:else}
		{#each categoryContent.content as mediaType, Index}
			<div class="border rounded-md p-1 mb-1">
				<div class="item-row">
					{#if mediaType.contentType == 'custom'}
						<Input type="text" bind:value={mediaType.title} class="w-full" />
					{:else}
						<p>{mediaType.title ? mediaType.title : DEFAULTS.prettyMediaTypes[mediaType.contentType]}</p>
					{/if}
					<div class="item-controls">
						{#if Index != 0}
							<div
								on:click={() => {
									dispatchSend('modifyRailItem', { action: 'moveUp', itemIndex: Index, categoryIndex: categoryIndex });
								}}
							>
								<ArrowUp />
							</div>
						{:else}
							<div class="blank-icon" />
						{/if}

						{#if Index != categoryContent.content.length - 1}
							<div
								on:click={() => {
									dispatchSend('modifyRailItem', { action: 'moveDown', itemIndex: Index, categoryIndex: categoryIndex });
								}}
							>
								<ArrowDown />
							</div>
						{:else}
							<div class="blank-icon" />
						{/if}
					</div>
				</div>
				<p
					class="filelink"
					on:click={() => {
						dispatchSend('toggleModal', { modal: 'file', options: { type: 'images', role: 'mediaTypeHeroImage', index: Index } });
					}}
				>
					{#if mediaType.heroImage}
						{mediaType.heroImage}
					{:else}
						Add thumbnail image
					{/if}
				</p>
				{#if mediaType.heroImage}
					<img src={MEDIAPATH + 'images/' + mediaType.heroImage} alt={mediaType.contentType} class="secondary-list-hero-image" />
				{/if}
				{#if $state.railSelection.substring(4, 5) == '2'}
					<Input type="textarea" bind:value={mediaType.summary} placeholder="Summary (used for G2 Musical Moments)" />
				{/if}
				<ol class="mt-2">
					{#each mediaType.content as Item, MediaItemIndex}
						<li>
							<div class="item-row">
								<p
									class="mt-1 ml-2"
									on:click={() => {
										dispatchSend('getItem', { item: Item, contentType: mediaType.contentType });
									}}
								>
									{Item.substring(0, 20)}{Item.length > 18 ? '...' : ''}
								</p>
								<div class="item-controls">
									{#if MediaItemIndex != 0}
										<div
											on:click={() => {
												dispatchSend('modifyRailItem', { action: 'moveUp', itemIndex: MediaItemIndex, categoryIndex: categoryIndex, mediaCategoryIndex: Index });
											}}
										>
											<ArrowUp />
										</div>
									{:else}
										<div class="blank-icon" />
									{/if}
									{#if MediaItemIndex != mediaType.content.length - 1}
										<div
											on:click={() => {
												dispatchSend('modifyRailItem', { action: 'moveDown', itemIndex: MediaItemIndex, categoryIndex: categoryIndex, mediaCategoryIndex: Index });
											}}
										>
											<ArrowDown />
										</div>
									{:else}
										<div class="blank-icon" />
									{/if}
									<div
										class="delete-button"
										on:click={() => {
											dispatchSend('modifyRailItem', { action: 'remove', item: Item, itemIndex: MediaItemIndex, categoryIndex: categoryIndex, mediaCategoryIndex: Index });
										}}
									>
										<MinusCircle color="red" />
									</div>
								</div>
							</div>
						</li>
					{/each}
					<div
						on:click={() => {
							dispatchSend('initializeNewItem', { contentType: mediaType.contentType, categoryTitle: mediaType.title });
						}}
						class="ml-2 mb-2 h-6 flex content-center"
					>
						<PlusCircle color="green" class="inline" />
						<p class="inline ml-1">Add new item</p>
					</div>
				</ol>
			</div>
		{/each}
	{/if}
{/if}

<style>
	.item-row {
		display: flex;
		flex-direction: row;
	}
	.item-row p {
		margin-bottom: 0;
	}
	.item-controls {
		display: grid;
		width: 100px;
		grid-template-columns: repeat(3, 1fr);
		justify-content: end;
		margin-left: auto;
		margin-right: 0;
	}
	li {
		margin-bottom: 8px;
	}
	.blank-icon {
		width: 24px;
	}
	.secondary-list-hero-image {
		max-width: 100%;
	}
</style>
