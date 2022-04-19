<script>
import Button from '../shared/Button.svelte'
import UserStores from '../stores/UserStores'

export let username = '';
export let accessKey = '';
export let campaigns = null;
export let errors = null;
export let selectedCampaign;
export let selectedCampaignDetails;
export let dataStore;
UserStores.subscribe((value)=>{
    dataStore = value
    username = value.username
    accessKey = value.accessKey
    campaigns = value.campaigns
    selectedCampaign= value.selectedCampaign
    selectedCampaignDetails =value.selectedCampaignDetails
})

console.log(username)

const handleCampaignChoice = async (e)=>{
    try{
        const uri = `https://www.scabard.com/api/v0${selectedCampaign.uri}`
        const res= await axios.get(uri, {headers:{"accessKey": accessKey, "username": username}})
       UserStores.set({...dataStore,selectedCampaign:selectedCampaign, selectedCampaignDetails: res.data, step: 2})
    }catch(err){
        errors = err;
    }
}
</script>
<div class="container">
    Select Your Campaign
    <form on:submit|preventDefault={handleCampaignChoice}>
        <select bind:value={selectedCampaign}>
    {#each dataStore.campaigns as camp}
            <option value={camp}>
                {camp.name}
            </option>
    {/each}
    </select>
    {#if errors}<span class="errors">{JSON.stringify(errors)}</span>{/if}
    <Button>Submit</Button>
    </form>
</div>

<style>
    .container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 10px auto;
    }
    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    select{
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>