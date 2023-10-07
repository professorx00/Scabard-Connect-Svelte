<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</svelte:head>



<script>
import CamapignsForm from '../components/CamapignsForm.svelte'
import Button from '../shared/Button.svelte'
import UserStores from '../stores/UserStores'



export let username = '';
export let accessKey = '';
export let campaigns = null;

export let selectedCampaign;
export let selectedCampaignDetails;
export let dataStore;

let errors = null;
UserStores.subscribe((value)=>{
    dataStore = value
    username = value.username
    accessKey = value.accessKey
    campaigns = value.campaigns
    selectedCampaign= value.selectedCampaign
    selectedCampaignDetails =value.selectedCampaignDetails
})
let loaded = false
const submitHandler = async ()=>{
    try{
        const uri = 'https://www.scabard.com/api/v0/campaign'
        const res = await axios.get(uri, {headers: {"accessKey":accessKey, "username": username}})
        await game.settings.set("scabardconnect", "accessKey", accessKey);
        await game.settings.set("scabardconnect", "username", username);
        if(res.status !== 200){
            UserStores.set({ username: username, accessKey: accessKey, campaigns: [], step: 0})
            errors = "Please verify that the Username and Access Key are correct. Access Keys are only good for 24 Hrs.";
        }else{
            UserStores.set({ username: username, accessKey: accessKey, campaigns: [...res.data.rows], step: 1})
        }
    }catch(err){
        if(err.request.status === 401){
            errors = "Please verify that the Username and Access Key are correct. Access Keys are only good for 24 Hrs.";
        }
        else{
            errors = err.message
        }
    }
}

</script>
<form on:submit|preventDefault={submitHandler}>
    <div class="inputs">
        <label for={accessKey}>Access Key</label>
        <input class="usernameInput" id="accessKeyInput" type="password" bind:value={accessKey} />
    </div>
    <div class="inputs">
        <label for={username}>Username </label>
        <input class="usernameInput" id="usernameInput" bind:value={username} />
    </div>
    {#if errors}<span class="error">{errors}</span>{/if}
    <Button>Submit</Button>
</form>


<style>
    form {
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 15px auto;
        width: auto;
    }
    label{
        text-align: left;
        align-self: flex-start;
        font-size: 1em;
        margin-bottom: 5px;
    }
    input{
        margin-bottom: 10px;
        border-radius: 5px;
    }
    .inputs{
        width: 200px;
    }
    .error{
        font-size: 20px;
        color: red;
        font-weight: bold;
        width:auto
    }
</style>