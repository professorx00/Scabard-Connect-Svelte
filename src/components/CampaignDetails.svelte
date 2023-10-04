<script>
    import ConceptCards from './ConceptCards.svelte';
    import {createJournalEntry} from '../scripts/journal'
    import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

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

    let loading = false;
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
        adventuresData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Adventure")
        characterData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Character")
        eventData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Event")
        groupData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Group")
        itemsData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Item")
        placesData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Place")
        vehiclesData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Vehicle")
        notesData = selectedCampaignDetails.rows.filter((item)=>item.concept==="Note")
    })

       document.addEventListener("addScabardJournal", (async e=>{
        e.stopImmediatePropagation()
        if(!loading){
            loading=true
            //Retrieves the Data
            const item = e.detail.item
            const response = await axios(`https://www.scabard.com/api/v0${item.uri}`,{ headers: { username: username, accessKey: accessKey }})
            const data = response.data
            const uri = item.uri;
            const id =  item.uri.split('/')[4]
            const concept = item.uri.split("/")[3]

            /**
             * A
             * @function createJournalEntry
             * @param {String} concept
             * @param {Object} data   Data that is coming from scabards API
             * @param {String} id   Scabard Id for the document 
             * @param {String} uri Scabard uri to get all the data
             */
            const entry = await createJournalEntry(concept, data, id,uri);
            if(entry){
                TJSDialog.prompt({
                    title: 'Success',
                    draggable: false,
                    modal: true,
                    content: 'Your Journal Entry has been imported',  // You can set content with a Svelte component!
                    label: 'Ok'
                });
                loading=false;
            }else{
                TJSDialog.prompt({
                    title: 'Failure',
                    draggable: false,
                    modal: true,
                    content: 'Not able to import the Scabard Journal',  // You can set content with a Svelte component!
                    label: 'Ok'
                });
                loading=false;
            }
        }
       }));
</script>

    <div class="main">
    <Tabs {tabs} {activeTab} on:tabChange={tabChange}/>
    {#if activeTab==="Adventures"}
        <ConceptCards data={adventuresData} on:addScabardJournal />
    {:else if activeTab==="Characters"}
        <ConceptCards data={characterData} on:addScabardJournal />
    {:else if activeTab==="Events"}
        <ConceptCards data={eventData} on:addScabardJournal />
    {:else if activeTab==="Groups"}
        <ConceptCards data={groupData} on:addScabardJournal />
    {:else if activeTab==="Items"}
        <ConceptCards data={itemsData} on:addScabardJournal />
    {:else if activeTab==="Places"}
        <ConceptCards data={placesData} on:addScabardJournal/>
    {:else if activeTab==="Vehicles"}
        <ConceptCards data={vehiclesData} on:addScabardJournal />
    {:else if activeTab==="Notes"}
        <ConceptCards data={notesData} on:addScabardJournal />
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