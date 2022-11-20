<script>
	import { Nav, NavItem, NavLink, Spinner } from 'sveltestrap';
	export let listRails;
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function gotoRail(railIdentifier) {
		dispatch('gotoRail', {
			railIdentifier: railIdentifier,
		});
	}

	function dispatchSend(f, p) {
		dispatch('execute', {
			f: f,
			p: p,
		});
	}
</script>

<p class="text-2xl pt-2 pb-3">Available Digital Rails</p>
<ul>
{#await listRails}
	<Spinner />
{:then}
	{#each listRails as Rail}
		<li>
			<p class="text-lg pb-3 cursor-pointer underline" on:click={() => dispatchSend('gotoRail', { railID: Rail.identifier })}>{Rail.title}</p>
		</li>
	{/each}
{/await}
<hr />
	<p class="text-lg pt-3 cursor-pointer underline" on:click={() => dispatchSend('gotoRail', { railID: 'config' })}>Configuration</p>

</ul>