<script>
	import { MEDIAPATH } from './config';
	import { Accordion, AccordionItem } from 'sveltestrap';
	import { ArrowLeft, ArrowRight, MinusCircle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	export let images;

	const dispatch = createEventDispatcher();

	function dispatchSend(f, p) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}
</script>

<Accordion>
	<AccordionItem header="Dwell screen images">
		<div class="image-container">
			{#each images as Image, Index}
				<div class="grid-container-item">
					<img src={MEDIAPATH + 'images/' + Image} class="storyThumbnail" alt={Image.full} />
					<p
						class="filelink"
						on:click={() => {
							dispatchSend('toggleModal', { modal: 'file', options: { type: 'images', role: 'dwellImages', index: images.indexOf(Image) } });
						}}
					>
						{Image}
					</p>
					<div class="grid-container-item-controls">
						<div />
						{#if images.indexOf(Image) != 0}
							<div
								on:click={() => {
									dispatchSend('modifyDwellImageArray', { image: Image, action: 'moveup', index: Index });
								}}
							>
								<ArrowLeft />
							</div>
						{:else}
							<div class="blank-icon" />
						{/if}
						{#if images.indexOf(Image) != images.length - 1}
							<div
								on:click={() => {
									dispatchSend('modifyDwellImageArray', { image: Image, action: 'movedown', index: Index });
								}}
							>
								<ArrowRight />
							</div>
						{:else}
							<div class="blank-icon" />
						{/if}
						<div />
						<div
							on:click={() => {
								dispatchSend('modifyDwellImageArray', { image: Image, action: 'remove', index: Index });
							}}
						>
							<MinusCircle color="red" />
						</div>
					</div>
				</div>
			{/each}
		</div>
		<p
			class="filelink"
			on:click={() => {
				dispatchSend('toggleModal', { modal: 'file', options: { type: 'images', role: 'dwellImages', index: images.length } });
			}}
		>
			Add image
		</p>
	</AccordionItem>
</Accordion>

<style>
	.blank-icon {
		width: 24px;
	}
	.image-container {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		margin-bottom: 10px;
	}
	.image-container img {
		height: 100px;
		max-width: 200px;
	}
	.storyThumbnail {
		object-fit: contain;
	}
	.grid-container-item {
		border: 1px black solid;
		width: 100%;
		text-align: center;
		padding: 10px;
	}
	.grid-container-item-controls {
		display: grid;
		grid-template-columns: 4fr 1fr 1fr 3fr 1fr;
	}
</style>
