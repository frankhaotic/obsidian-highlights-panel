import { MarkdownView, Plugin, TFile } from 'obsidian';
import { HIGHLIGHTS_VIEW_TYPE, HighlightsView } from './views/highlights-view';
import { highlightStore } from './stores/store';
import type { Highlight } from './interfaces';

export default class HighlightsPlugin extends Plugin {
	workspace = this.app.workspace;
	vault = this.app.vault;

	async onload() {
		this.setHighlights();

        this.registerEvent(this.workspace.on('file-open', () => {
			this.setHighlights();
        }));

        this.registerEvent(this.vault.on('modify', () => {
			this.setHighlights();
        }));

		this.registerView(HIGHLIGHTS_VIEW_TYPE, (leaf) => new HighlightsView(leaf, this));

		this.openHighlightView();
	}

	onunload() {
		this.workspace.detachLeavesOfType(HIGHLIGHTS_VIEW_TYPE);
	}

	setHighlights() {
		const activeFile = this.workspace.getActiveFile() as TFile;
		const highlightsList = this.getHighlights(activeFile);
		highlightStore.set(highlightsList);
	}

	getHighlights(activeFile: TFile) {
		let highlightsPattern =  /==([^=]+)==/g;
		let editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
		let activeDocumentText = editor?.getValue();

		let highlight;
		let highlights: Highlight[] = [];
		let highlightTable: { [key: string]: boolean } = {};

		while (highlight = highlightsPattern.exec(activeDocumentText!)) {
			if(highlightTable[highlight[1]]) continue;

			const highlightLineNumbers = this.findLineNumber(activeDocumentText!, highlight[0]);

			const highlightItem = this.highlightConstructor(highlight[1], activeFile.path, highlightLineNumbers)

			highlightTable[highlight[1]] = true;

			highlights.push(...highlightItem);
		}

		return highlights;
	}

	highlightConstructor(text: string, path: string, lineNumbers: number[]): Highlight[] {
		const highlightList: Highlight[] = [];

		lineNumbers.forEach(line => {
			const highlightItem = { text, path, line }	
			highlightList.push(highlightItem)
		});

		return highlightList;
	}

	openHighlightView() {
		this.workspace.detachLeavesOfType(HIGHLIGHTS_VIEW_TYPE);

		const leaf = this.workspace.getRightLeaf(false);

		leaf.setViewState({ type: HIGHLIGHTS_VIEW_TYPE })

		this.workspace.revealLeaf(leaf);
	}


	findLineNumber(markdownContent: string, targetText: string): number[] {
        const lines = markdownContent.split('\n');

		const lineNumbers: number[] = [];

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(targetText)) {
				lineNumbers.push(i);
            }
        }

        return lineNumbers;
    }
}