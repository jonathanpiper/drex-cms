<script>
	import { Accordion, AccordionItem, FormGroup, Input, Label } from 'sveltestrap';
	import { RailMap } from './stores.js';
	export let title;
	export let body;
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
	</AccordionItem>
</Accordion>
