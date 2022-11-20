<script>
	import { Form, Badge, FormGroup, Row, Input, Button, Accordion, AccordionItem, Label, Icon, Col } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import { state, DREXItem, activeFile } from './stores';
	import { MEDIAPATH, DEFAULTS } from './config';
	import { arrayMoveMutable } from 'array-move';
	import SecondaryList from './SecondaryList.svelte';
	import { MinusCircle, ArrowUp, ArrowDown, PlusCircle } from 'lucide-svelte';
	export let railContent;

	const dispatch = createEventDispatcher();

	function dispatchSend(f, p = {}) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}
</script>

<Accordion>
	{#each railContent as RMContent, Index}
		<div>
			<AccordionItem
				header={RMContent.title}
				on:toggle={() => {
					dispatchSend('confirmMoveAwayFromItem');
				}}
			>
				<div class="category-controls">
					{#if Index != 0}
						<div
							on:click={() => {
								dispatchSend('moveRailMapType', { direction: 'up', type: RMContent.title });
							}}
						>
							<ArrowUp size="32" />
						</div>
					{:else}
						<ArrowUp size="32" color="#bbb" />
					{/if}
					{#if Index != railContent.length - 1}
						<div
							on:click={() => {
								dispatchSend('moveRailMapType', { direction: 'down', type: RMContent.title });
							}}
						>
							<ArrowDown size="32" />
						</div>
					{:else}
						<ArrowDown size="32" color="#bbb" />
					{/if}
					<div
						on:click={() => {
							dispatchSend('removeRailMapType', { type: RMContent.title });
						}}
					>
						<MinusCircle color="red" size="32" />
					</div>
				</div>
				<Form>
					<div class="category-properties">
						<div>
							<FormGroup>
								<Label size="sm" for="categoryTitle">Category title</Label>
								<Input name="categoryTitle" type="text" disabled={DEFAULTS.typeEditingDisabled[RMContent.contentType]} bind:value={RMContent.title} />
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
				<SecondaryList bind:categoryContent={RMContent} categoryIndex={Index} on:getItem on:modifyRailItem on:initializeNewItem on:toggleModal on:execute />
			</AccordionItem>
		</div>
	{/each}
</Accordion>
<Button
	class="mt-4"
	on:click={() => {
		dispatchSend('expandRail');
	}}>Add new category</Button
>

<style>
	.category-controls {
		margin: 10px 8px;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		column-gap: 6px;
		justify-items: center;
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
