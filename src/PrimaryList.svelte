<script>
	import { PlusCircle, ArrowDown, ArrowUp, MinusCircle, ArrowRight } from 'lucide-svelte';
	import { Form, Badge, FormGroup, Row, Input, Button, Accordion, AccordionItem } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import { RailMap, state, typePlurals, mediaTypes, DREXItem } from './stores';
	import { arrayMoveMutable } from 'array-move';

	const dispatch = createEventDispatcher();

	const typeEditingDisabled = {
		stories: '',
		media: 'true',
		artifacts: 'true',
	};

	function getItem(item, type) {
		dispatch('getItem', {
			type: type,
			item: item,
		});
	}

	function resetDREXItem() {
		dispatch('resetDREXItem');
	}

	function modifyRailItem(action, item, type) {
		dispatch('modifyRailItem', {
			action: action,
			item: item,
			type: type,
		});
	}

	function initializeNewItem(type) {
		dispatch('initializeNewItem', {
			type: type,
		});
	}

	const emptyContentType = {
		title: 'New content type',
		contentType: 'stories',
		content: [],
	};

	function expandRail() {
		$RailMap.content = [...$RailMap.content, emptyContentType];
		console.log($RailMap);
	}

	function removeRailMapType(type) {
		const confirmation = confirm('Remove "' + type.title + '" from rail ' + $state.activeRail + '? This CANNOT be undone!');
		const typeIndex = $RailMap.content.findIndex((t) => t.title == type);
		if (confirmation) {
			$RailMap.content.splice(typeIndex, 1);
			$RailMap.content = $RailMap.content;
			resetDREXItem();
		}
	}

	function moveRailMapType(direction, type) {
		console.log(type);
		var increment = direction == 'up' ? -1 : 1;
		const typeIndex = $RailMap.content.findIndex((t) => t.title == type);
		console.log(typeIndex);
		arrayMoveMutable($RailMap.content, typeIndex, typeIndex + increment);
		$RailMap.content = $RailMap.content;
	}

	function setActivePrimary(title) {
		$state.activePrimary = title;
		console.log($state.activePrimary);
	}
</script>

{#each $RailMap.content as RMContent}
	<Form>
		<FormGroup>
			<div class="item-row">
				<Input bsSize="lg" type="text" disabled={typeEditingDisabled[RMContent.contentType]} bind:value={RMContent.title} />
				{#if $RailMap.content.indexOf(RMContent) != 0}
					<div
						on:click={() => {
							moveRailMapType('up', RMContent.title);
						}}
					>
						<ArrowUp />
					</div>
				{:else}
					<div class="blank-icon" />
				{/if}
				{#if $RailMap.content.indexOf(RMContent) != $RailMap.content.length - 1}
					<div
						on:click={() => {
							moveRailMapType('down', RMContent.title);
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
						removeRailMapType(RMContent.title);
					}}
				>
					<MinusCircle color="red" />
				</div>
			</div>
			<Input type="select" bind:value={RMContent.contentType}>
				<option>stories</option>
				<option>artifacts</option>
				<option>media</option>
			</Input>
			<div on:click={() => setActivePrimary(RMContent.title)}>
				<ArrowRight size="42" />
			</div>
		</FormGroup>
	</Form>
{/each}
<button on:click={expandRail}>Add</button>

<style>
	.item-row {
		display: grid;
		width: 100%;
		grid-template-columns: 12fr 2fr 1fr 3fr;
		align-items: right;
	}
	.delete-button {
		justify-self: right;
	}
	/* ol {
		margin: 10px 10px;
	}
	li {
		margin-bottom: 8px;
	} */
	.blank-icon {
		width: 24px;
	}
</style>
