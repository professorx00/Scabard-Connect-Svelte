<script>
    import { createEventDispatcher } from 'svelte'
    import SearchBar from '../shared/SeachBar.svelte'
    import Card from '../shared/Card.svelte';
    import NoResults from "./NoResults.svelte";
    export let data;

    // For Search input
    let filterResults = [];
    let searchTerm = "";

    const searchConcept = ()=>{
        return filterResults = data.filter((item)=>{
            return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
    }

    

</script>

<div class="main">
    <SearchBar bind:searchTerm on:input={searchConcept}/>
    {#if searchTerm && filterResults.length === 0}
        <NoResults />
    {:else if filterResults.length >0}
        {#each filterResults as item }
            <Card bind:item on:addScabardJournal/>
        {/each}
    {:else}
        {#each data as item }
            <Card bind:item />
        {/each}
    {/if}
</div>

<style>
    .main{
        width: auto;
        height: auto;
        max-height: 750px;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
    }
    
</style>