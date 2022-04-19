<svelte:head>
	<script src="module/scabard-connect/dist/luxon.js"></script>
</svelte:head>


<script>
   import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import LoginForm from '../components/LoginForm.svelte';
   import CampaignDetails from '../components/CampaignDetails.svelte';
   import CamapignsForm from '../components/CamapignsForm.svelte';
   import UserStores from '../stores/UserStores'
   import { onMount } from 'svelte';
   export let elementRoot;

   export let username = '';
   export let accessKey = '';
   export let campaigns = null;
   export let step = 0;
   let validator;

   export let selectedCampaign;
   export let selectedCampaignDetails;
   export let dataStore;

   UserStores.subscribe((value)=>{
    dataStore = value
    step = value.step
    username = value.username
    accessKey = value.accessKey
    campaigns = value.campaigns
    selectedCampaign= value.selectedCampaign
    selectedCampaignDetails =value.selectedCampaignDetails
   })

   onMount(async ()=>{
      accessKey = game.settings.get("scabard-connect", "accessKey")
      username = game.settings.get("scabard-connect", "username")
      validator = game.settings.get("scabard-connect", "validator")
      if(accessKey === "" || username ===""){
         step=0
         UserStores.set({step: step, username: username, accessKey: accessKey, validator: validator, campaigns: null, selectedCampaign: null, selectedCampaignDetails: null})
      }else{
         try{
            const res = await axios.get("https://www.scabard.com/api/v0/campaign", {headers: {"accessKey": accessKey, "username":username}})
            if(res.data){
               step = 1
                UserStores.set({step: step, username: username, accessKey: accessKey, validator: validator, campaigns: [...res.data.rows], selectedCampaign: null, selectedCampaignDetails: null})
            }
         }catch(err){
            step=0
            UserStores.set({step: step, username: username, accessKey: accessKey, validator: validator, campaigns: null, selectedCampaign: null, selectedCampaignDetails: null})
         }
      }
   })



</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
   <div class="containerDiv">
   <nav>
      <h1>Scabard Connect</h1>
   </nav>
   <main>
       {#if dataStore.step === 0 }  
         <LoginForm />
      {/if}
      {#if dataStore.step === 1}
         <CamapignsForm />
      {/if}
      {#if dataStore.step === 2}
      <CampaignDetails />
      {/if} 
   </main>
</div>
</ApplicationShell>

<style lang="scss">
   .containerDiv{
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
   }
   main {
      display: flex;
      height: "auto";
      width: "auto";
      margin: 0 0;
   }
   nav{
      text-align: center;
      height: 50px;
      width: 600;
      align-items: center;
   }
  
</style>