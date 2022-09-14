<script>
	import { Row } from 'sveltestrap';
	import { MinusCircle, ArrowUp, ArrowDown, PlusCircle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { RailMap, state, typePlurals, mediaTypes, DREXItem, prettyMediaTypes, mediaPath } from './stores';
	import { arrayMoveMutable } from 'array-move';

	const dispatch = createEventDispatcher();

	function toggleModal(modal, options) {
		dispatch('toggleModal', {
			modal: modal,
			options: options,
		});
	}

	function getItem(item, type) {
		dispatch('getItem', {
			type: type,
			item: item,
		});
	}

	function modifyRailItem(action, item, type, categoryTitle = '') {
		dispatch('modifyRailItem', {
			action: action,
			item: item,
			type: type,
			categoryTitle: categoryTitle,
		});
	}

	function initializeNewItem(type, title) {
		dispatch('initializeNewItem', {
			type: type,
			categoryTitle: title,
		});
	}

	$: RMContent = $RailMap.content[$RailMap.content.findIndex((t) => t.title == $state.activePrimary)];
</script>

{#if RMContent}
	<Row>
		{#if RMContent.content.length == 0}
			<div><p>No items yet.</p></div>
		{/if}
		{#if RMContent.contentType != 'media'}
			<ol>
				{#each RMContent.content as Item (Item)}
					<li>
						<div class="item-row">
							<span
								class="list"
								on:click={() => {
									getItem(Item, RMContent.contentType);
								}}>{Item}</span
							>
							{#if RMContent.content.indexOf(Item) != 0}
								<div
									on:click={() => {
										modifyRailItem('moveUp', Item, RMContent.contentType, RMContent.title);
									}}
								>
									<ArrowUp />
								</div>
							{:else}
								<div class="blank-icon" />
							{/if}
							{#if RMContent.content.indexOf(Item) != RMContent.content.length - 1}
								<div
									on:click={() => {
										modifyRailItem('moveDown', Item, RMContent.contentType, RMContent.title);
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
									modifyRailItem('remove', Item, RMContent.contentType, RMContent.title);
								}}
							>
								<MinusCircle color="red" />
							</div>
						</div>
					</li>
				{/each}
				<div class="add-button clickable">
					<p
						on:click={() => {
							initializeNewItem(RMContent.contentType, RMContent.title);
						}}
					>
						<PlusCircle color="green" />
					</p>
				</div>
			</ol>
		{:else}
			{#each RMContent.content as mediaType, Index}
				<img src={$mediaPath + 'images/' + mediaType.heroImage} alt={mediaType.contentType} />
				<p
					class="filelink"
					on:click={() => {
						toggleModal('file', { type: 'images', role: 'mediaTypeHeroImage', index: Index });
					}}
				>
					{mediaType.heroImage}
				</p>
				<div class="item-row">
					<h5>{$prettyMediaTypes[mediaType.contentType]}</h5>
					{#if RMContent.content.findIndex((t) => t.contentType == mediaType.contentType) != 0}
						<div
							on:click={() => {
								modifyRailItem('moveUp', mediaType.contentType, RMContent.contentType);
							}}
						>
							<ArrowUp />
						</div>
					{:else}
						<div class="blank-icon" />
					{/if}

					{#if RMContent.content.findIndex((t) => t.contentType == mediaType.contentType) != RMContent.content.length - 1}
						<div
							on:click={() => {
								modifyRailItem('moveDown', mediaType.contentType, RMContent.contentType);
							}}
						>
							<ArrowDown />
						</div>
					{:else}
						<div class="blank-icon" />
					{/if}
				</div>
				<ol>
					{#each mediaType.content as Item (Item)}
						<li>
							<div class="item-row">
								<span
									class="list"
									on:click={() => {
										getItem(Item, mediaType.contentType);
									}}
								>
									{Item}
								</span>
								{#if mediaType.content.indexOf(Item) != 0}
									<div
										on:click={() => {
											modifyRailItem('moveUp', Item, mediaType.contentType);
										}}
									>
										<ArrowUp />
									</div>
								{:else}
									<div class="blank-icon" />
								{/if}
								{#if mediaType.content.indexOf(Item) != mediaType.content.length - 1}
									<div
										on:click={() => {
											modifyRailItem('moveDown', Item, mediaType.contentType);
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
										modifyRailItem('remove', Item, mediaType.contentType);
									}}
								>
									<MinusCircle color="red" />
								</div>
							</div>
						</li>
					{/each}
					<p
						on:click={() => {
							initializeNewItem(mediaType.contentType);
						}}
					>
						<PlusCircle color="green" />
					</p>
				</ol>
			{/each}
		{/if}
	</Row>
{/if}

<style>
	.item-row {
		display: grid;
		width: 100%;
		grid-template-columns: 12fr 2fr 1fr 3fr;
	}
	.delete-button {
		justify-self: right;
	}
	ol {
		margin: 10px 10px;
	}
	li {
		margin-bottom: 8px;
	}
	.blank-icon {
		width: 24px;
	}
</style>
