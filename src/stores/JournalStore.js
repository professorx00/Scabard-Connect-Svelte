import { writable } from "svelte/store";

const JournalStore = writable({
   id: null,
   uri: null,
   data: null,
   concept:null
});

export default JournalStore;
