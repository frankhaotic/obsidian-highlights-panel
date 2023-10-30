<script lang="ts">
	import type { Highlight } from "src/interfaces";
	import { createEventDispatcher } from "svelte";

    export let highlight: Highlight;

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch("click", highlight)
    }

</script>

<style>
    .highlight-item {
        margin-left: 0px;
        padding-left: 24px;
    }
</style>

<div class="tree-item-self is-clickable highlight-item">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="tree-item-inner" on:click={handleClick}>
        {highlight.text} 
    </div>
</div>