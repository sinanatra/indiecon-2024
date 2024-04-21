import { persisted } from 'svelte-persisted-store'

export const question = persisted('question', 'Should there be more printed books or more websites?')