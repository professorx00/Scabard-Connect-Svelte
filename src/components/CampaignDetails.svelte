<script>
    // import Adventures from './concepts/Adventures.svelte';
    // import Characters from './concepts/Characters.svelte';
    // import Events from './concepts/Events.svelte';
    // import Groups from './concepts/Groups.svelte';
    // import Items from './concepts/Items.svelte';
    // import Places from './concepts/Places.svelte';
    // import Vehicles from './concepts/Vehicles.svelte';
    // import Notes from './concepts/Notes.svelte';
    import ConceptCards from './ConceptCards.svelte';

    import UserStores from '../stores/UserStores'
    import Tabs from '../shared/Tabs.svelte';
import { onMount } from 'svelte';
    export let username = '';
    export let accessKey = '';
    export let campaigns = null;
    export let step = 0;

    export let selectedCampaign;
    export let selectedCampaignDetails;
    export let dataStore;
    let tabs = [
        'Adventures',
        'Characters',
        'Events',
        'Groups',
        'Items',
        'Places',
        'Vehicles',
        'Notes'
    ];
    let activeTab = 'Adventures'

    let adventuresData =[]
    let characterData =[]
    let eventData =[]
    let groupData =[]
    let itemsData =[]
    let placesData =[]
    let vehiclesData =[]
    let notesData =[]


    UserStores.subscribe((value)=>{
        dataStore = value
        step = value.step
        username = value.username
        accessKey = value.accessKey
        campaigns = value.campaigns
        selectedCampaign= value.selectedCampaign
        selectedCampaignDetails =value.selectedCampaignDetails
    })
    const tabChange=(e)=>{
        activeTab = e.detail;
    }
    onMount(()=>{
        console.log("campaign Details",selectedCampaignDetails)
        adventuresData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Adventure")
        characterData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Character")
        eventData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Event")
        groupData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Group")
        itemsData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Item")
        placesData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Place")
        vehiclesData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Vehicle")
        notesData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Note")
    })

       const handleJournalClick = async (e) => {
        // const data = await getArticleData(item.uri)
        console.log(accessKey, username, e.detail.item)
    }

</script>

    <div class="main">
    <Tabs {tabs} {activeTab} on:tabChange={tabChange}/>
    {#if activeTab==="Adventures"}
        <ConceptCards data={adventuresData} on:froggie={(e)=>handleJournalClick(e)} />
    {:else if activeTab==="Characters"}
        <ConceptCards data={characterData} on:froggie={(e)=>handleJournalClick(e)} />
    {:else if activeTab==="Events"}
        <ConceptCards data={eventData} on:froggie={(e)=>handleJournalClick(e)} />
    {:else if activeTab==="Groups"}
        <ConceptCards data={groupData} on:froggie={(e)=>handleJournalClick(e)} />
    {:else if activeTab==="Items"}
        <ConceptCards data={itemsData} on:froggie={(e)=>handleJournalClick(e)} />
    {:else if activeTab==="Places"}
        <ConceptCards data={placesData} on:froggie={(e)=>handleJournalClick(e)} />
    {:else if activeTab==="Vehicles"}
        <ConceptCards data={vehiclesData} on:froggie={(e)=>handleJournalClick(e)} />
    {:else if activeTab==="Notes"}
        <ConceptCards data={notesData} on:froggie={(e)=>handleJournalClick(e)} />
    {/if}
</div>


<style>
    .main{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>