<script>
	//import { PlusCircle, ArrowDown, ArrowUp, MinusCircle, ArrowRight } from 'lucide-svelte';
	import { Form, Badge, FormGroup, Row, Input, Button, Accordion, AccordionItem, Label, Icon, Col } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import { RailMap, state, typePlurals, mediaTypes, DREXItem, defaults, activeFile } from './stores';
	import { MEDIAPATH } from './config';
	import { arrayMoveMutable } from 'array-move';
	import SecondaryList from './SecondaryList.svelte';
	import ItemEditor from './ItemEditor.svelte';

	const dispatch = createEventDispatcher();

	function dispatchSend(f, p = {}) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}
</script>

<Accordion>
	{#each $RailMap.content as RMContent, Index}
		<div>
			<AccordionItem
				header={RMContent.title}
				on:toggle={() => {
					dispatchSend('confirmMoveAwayFromItem');
				}}
			>
				<Form>
					<div class="category-properties">
						<div>
							<FormGroup>
								<Label size="sm" for="categoryTitle">Category title</Label>
								<Input name="categoryTitle" type="text" disabled={$defaults.typeEditingDisabled[RMContent.contentType]} bind:value={RMContent.title} />
								<Label size="sm" for="categoryContentType">Category type</Label>
								<Input name="categoryContentType" type="select" bind:value={RMContent.contentType}>
									<option>stories</option>
									<option>artifacts</option>
									<option>media</option>
									<option>special</option>
								</Input>
							</FormGroup>
						</div>
						<FormGroup>
							<Label size="sm" for="categoryIcon">Icon</Label>
							<div class="icon-display">
								<img src="{MEDIAPATH}icons/{RMContent.icon ? RMContent.icon : RMContent.title.toLowerCase() + '.svg'}" class="category-icon" alt="Category icon" />
							</div>
							<p
								class="filelink"
								on:click={() => {
									dispatchSend('toggleModal', { modal: 'file', options: { type: 'icons', role: 'icon', categoryIndex: Index } });
								}}
							>
								Change icon
							</p>
						</FormGroup>
					</div>
				</Form>
				<SecondaryList contentType={RMContent.title} on:getItem on:modifyRailItem on:initializeNewItem on:resetDREXItem on:toggleModal on:execute />

				<div class="category-controls">
					{#if $RailMap.content.indexOf(RMContent) != 0}
						<Button
							color="primary"
							size="sm"
							on:click={() => {
								dispatchSend('moveRailMapType', { direction: 'up', type: RMContent.title });
								//moveRailMapType('up', RMContent.title);
							}}
							>Move up
							<Icon name="arrow-up" />
						</Button>
					{:else}
						<div class="blank-icon" />
					{/if}
					{#if $RailMap.content.indexOf(RMContent) != $RailMap.content.length - 1}
							<Button
								color="primary"
								size="sm"
								on:click={() => {
									dispatchSend('moveRailMapType', { direction: 'down', type: RMContent.title });
								}}
								>Move down
								<Icon name="arrow-down" />
							</Button>
					{:else}
						<div class="blank-icon" />
					{/if}
					<Button
						color="danger"
						size="sm"
						class="delete-button"
						on:click={() => {
							dispatchSend('removeRailMapType', { type: RMContent.title });
						}}
						>Remove
						<Icon name="x-circle" />
					</Button>
				</div>
			</AccordionItem>
		</div>
	{/each}
</Accordion>
<Button class="mt-4"
	on:click={() => {
		dispatchSend('expandRail');
	}}>Add new category</Button
>

<style>
	.blank-icon {
		width: 24px;
	}
	.category-controls {
		margin: 10px 8px;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 98px);
		column-gap: 6px;
		justify-content: end;
	}
	.category-properties {
		display: grid;
		grid-template-columns: 4fr 1fr;
		column-gap: 10px;
		margin-bottom: 0;
	}
	.icon-display {
		background-color: black;
		align-content: center;
		height: 100px;
	}
	.category-icon {
		height: 100%;
		margin: auto;
		display: block;
	}
</style>
