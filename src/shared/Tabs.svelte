<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    export let tabs;
    export let activeTab ;
</script>

<div class="tabs">
    <ul>
        {#each tabs as tab }
            <li on:click={()=>{dispatch('tabChange', tab)}}>
                <div class:active={tab === activeTab}>{tab}</div>
            </li>
        {/each}
    </ul>
</div>
    
<style>
    ul{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        list-style-type: none;
    }
    li{
        font-size: 18px;
        color: #555;
        cursor: pointer;
        margin: 0 5px;
    }
     .active{
        color: #0197a7;
        border-bottom: 2px solid #0197a7;
        padding-bottom: 8px;
    }
</style>