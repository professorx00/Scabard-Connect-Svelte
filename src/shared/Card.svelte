<script>
    	import { scale, fade } from 'svelte/transition';
        import { expoInOut } from 'svelte/easing'; 
        export let item; 
        let loading = false;
        let ref;
    
        const handleClick = (item)=>{
            loading = true;
            const event  = new CustomEvent('addScabardJournal', {
                    detail: {
                        item: item
                    }, 
                    bubbles: true
                });
            ref.dispatchEvent(event);
            loading = false;
        }


 
    const handleScabardClick = async (item)=>{
        window.open(`https://www.scabard.com/pbs${item.uri}`);
    } 
</script>
<section class="card" in:fade out:scale|local={{duration: 1000, easing: expoInOut}}>
     <div class="item">
                <div class="itemName">
                    {item.name}
                </div>
                <div class="buttons">
                    <div bind:this={ref} on:click={()=>{if(!loading){handleClick(item)}}} class="button tooltip"><img src="modules/scabard-connect/public/images/journal.png" class="buttonImg" alt="Journal"><span class="tooltiptext">Import a Journal</span></div>
                    <div on:click={()=>{handleScabardClick(item)}} class="button tooltip"><img src="modules/scabard-connect/public/images/favicon.ico" class="buttonImg" alt="Scabard"><span class="tooltiptext">Open on Scabard</span></div>
                </div>
            </div>
</section>


<style>
    .item{
        width: 220px;
        height:auto;
        min-height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        background: white;
        border-radius: 5px;
        border: 1px solid #000;
        box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
        padding: 3px;
        margin-bottom: 3px;
    }
    .itemName{
        width: 60%;
    }
    .buttons{
        display: flex;
        flex-direction: row;
    }
    .buttonImg{
        width:28px;
        height: 28px;
        margin: 0 auto;
        padding: 2px;
        border: 0;
    }
    .button{
        width:32px;
        height: 32px;
        border-radius: 5px;
        background: #0197a7;
        padding: 2px;
        margin: 4px;
        border: 1px solid #000;
    }
    .button:hover{
        background: #ffa500;
        box-shadow: none;
    }
    /* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 3;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>