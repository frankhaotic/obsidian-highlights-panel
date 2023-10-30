import { ItemView, WorkspaceLeaf } from "obsidian";

import HighlightsComponent from './HighlightsComponent.svelte';
import { pluginStore } from "src/stores/store";
import type HighlightsPlugin from "src/main";

export const HIGHLIGHTS_VIEW_TYPE = "highlights-view";

export class HighlightsView extends ItemView {
    component: HighlightsComponent;

    constructor(leaf: WorkspaceLeaf, private plugin: HighlightsPlugin) {
        super(leaf);
    }

    getViewType(): string {
        return HIGHLIGHTS_VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Highlights panel";
    }

    getIcon(): string {
        return "pencil";
    }

    async onOpen(): Promise<void> {
        pluginStore.set(this.plugin);

        this.renderView();
    }

    renderView(): void {
        this.addConventionalObsidianLeafStyles();

        this.component = new HighlightsComponent({ target: this.contentEl })
    }

    async onClose(): Promise<void> {
        this.component.$destroy(); 
    }

    addConventionalObsidianLeafStyles() {
        this.contentEl.classList.add('node-insert-event');
        this.contentEl.style.position = 'relative';
        this.contentEl.style.padding = 'var(--size-4-3) var(--size-4-3) var(--size-4-8)';
    }
}