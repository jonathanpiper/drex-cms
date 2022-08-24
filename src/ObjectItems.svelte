<script>
	import { DREXItem, mediaPath } from "./stores";
	import { createEventDispatcher } from "svelte";
	import { Input } from "sveltestrap";

	let dispatch = createEventDispatcher();

	function dispatchFileBrowser(type, role, index = 0) {
		dispatch("fileBrowser", {
			type: type,
			role: role,
			index: index,
		});
	}
</script>

{#if Object.keys($DREXItem).length != 0}
	<h4>{$DREXItem.content.maker}</h4>
	<h4>{$DREXItem.content.title}</h4>
	<h4>{$DREXItem.content.date}</h4>
	<p>{$DREXItem.content.body}</p>
	<p><i>{$DREXItem.content.credit}</i></p>
	<h4>{$DREXItem.content.objectID}</h4>
	{#if $DREXItem.content.images}
		<div class="top-spacer image-container">
			{#each $DREXItem.content.images as Image}
				<img src={$mediaPath + "objects/" + $DREXItem.identifier + "_" + Image.name + ".jpg"} class="objectThumbnail" alt={Image.name} />
			{/each}
		</div>
	{/if}
{/if}

<style>
	.objectThumbnail {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.top-spacer {
		margin-top: 20px;
	}
	.image-container {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-rows: 280px;
		gap: 10px;
	}
	.image-container img {
		width: 100%;
	}
</style>
