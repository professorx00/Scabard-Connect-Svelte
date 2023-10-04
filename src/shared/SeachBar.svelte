<script>
    export let searchTerm;
</script>

<div id="search-input-btn-cont">
    <input type="text" id="search-field" placeholder="Search.." autocomplete="off" bind:value={searchTerm} on:input />
</div>

<style>
    div{
        width: 80%;
        margin: 10px auto;
    }
</style>