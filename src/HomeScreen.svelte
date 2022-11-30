<script>
	import { Accordion, AccordionItem, FormGroup, Input, Label } from 'sveltestrap';
	import { RailMap } from './stores.js';
	export let title;
	export let body;
	export let dateRange;
</script>

<Accordion>
	<AccordionItem active header="Home Screen">
		<FormGroup>
			<Label for="railTitle">Rail title</Label>
			<Input name="railTitle" bind:value={title} />
		</FormGroup>
		<FormGroup>
			<Label for="homeScreenText">Home screen text</Label>
			<Input name="homeScreenText" type="textarea" rows="8" bind:value={body} />
		</FormGroup>
		{#if dateRange}
			<FormGroup>
				<Label for="railDateRange">Date range</Label>
				<Input name="railDateRange" type="text" bind:value={dateRange} />
			</FormGroup>
		{/if}
	</AccordionItem>
</Accordion>
