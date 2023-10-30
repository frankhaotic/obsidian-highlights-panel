<script lang="ts">
	import { pluginStore, highlightStore } from "src/stores/store";
    import HighlightItem from "./HighlightItem.svelte";
	import type { Highlight } from "src/interfaces";
	import HighlightsPlugin from "src/main";
	import { MarkdownView, Notice } from "obsidian";

    let myPlugin: HighlightsPlugin;

    pluginStore.subscribe(plugin => myPlugin = plugin)

    async function handleClick(highlight: Highlight) {
        const file = myPlugin.app.metadataCache.getFirstLinkpathDest(highlight.path, highlight.path)

        if(!file) {
            new Notice("File does not exist")
            return;
        }

        await myPlugin.app.workspace.getLeaf(false).openFile(file);

        const activeMarkdownView = myPlugin.app.workspace.getActiveViewOfType(MarkdownView);

        if(!activeMarkdownView) {
            new Notice("Failed to open")
            return;
        }

        try {
            activeMarkdownView.setEphemeralState({ line: highlight.line });
        } catch (error) {
            console.error(error);
        }
    }

    function compareHighlightOrder(a: Highlight, b: Highlight) {
        return a.line - b.line;
    }

</script>

<style>

</style>

<div style="min-height: 0px;"></div>

{#if $highlightStore.length === 0}
    <div class="pane-empty">No highlights found.</div>
{:else}
    {#each $highlightStore.sort(compareHighlightOrder) as highlight}
        <HighlightItem highlight={highlight} on:click={(event) => handleClick(event.detail)} />
    {/each}
{/if}