<script>
	import {
		Badge,
		Form,
		FormGroup,
		Input,
		Label,
		Container,
		Row,
		Col,
		Button,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Navbar,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		Styles,
		Accordion,
		AccordionItem,
		Spinner,
		Icon,
		TabContent,
		TabPane,
	} from 'sveltestrap';
	export let railContentObject;
</script>

<div class="mx-2">
	<p class="text-xl py-2">{railContentObject.title}</p>
	<ul>
		<li class="pb-1">
			<p class="cursor-pointer underline">Home Screen</p>
		</li>
		<li class="pb-1">
			<p class="cursor-pointer underline">Content</p>
		</li>
		{#if railContentObject.hasOwnProperty('content')}
			{#each railContentObject.content as category}
				<NavItem>
					<NavLink>
						{category.title}
					</NavLink>
				</NavItem>
			{/each}
		{/if}
	</ul>
</div>

<style>
</style>
