import { writable } from 'svelte/store';
import type HighlightsPlugin from 'src/main';
import type { Highlight } from 'src/interfaces';

export const pluginStore = writable<HighlightsPlugin>();
export const highlightStore = writable<Highlight[]>([]);