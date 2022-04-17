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

       document.addEventListener("froggie", (async e=>{
            //Retrieves the Data
            const item = e.detail.item
            const response = await axios(`https://www.scabard.com/api/v0${item.uri}`,{ headers: { username: username, accessKey: accessKey }})
            console.log(response.data)
            const data = response.data
            const uri = item.uri;
            const id =  item.uri.split('/')[4]
            const concept = item.uri.split("/")[3]
            // Checks If there is a folder if there is returns else return new
            let folder = await _findFolder(concept, id)
            console.log(folder)
            if(!folder){
                console.log("creating Folder")
                folder = await Folder.create({
                    name: `Scabard ${concept}`,
                    type: 'JournalEntry',
                    flags: {"scabard": concept}
                })
            }
            console.log(folder)

            const folderid = "";
            //Creates a new Journal Entry which I can render
            let entry = game.journal.find(e => {
                if(e.data.flags.scabard){
                    return e.data.flags.scabard.id === id
                }
                });
            if(entry) return await _updateExistingEntry(entry, data,id,uri, folder.id )
            entry = await JournalEntry.create({
                id: id,
                name: data.main.name,
                content: data.main.description,
                img: data.main.imageURL,
                flags: {"scabard": { id: id, uri: uri}},
                folder: folder.id
            }, {});
     
            return entry;          
       }))

    async function _findFolder(concept, id){
        const folders = game.folders.filter(f => (f.data.type === "JournalEntry") && f.data.flags["scabard"]);
        const filteredFolders = folders.filter((folder)=>folder.data.flags.scabard===concept);
        return filteredFolders[0] ? filteredFolders[0] : null;
    }
    async function _updateExistingEntry(entry, data, id, uri, folder) {
  /**
   * A hook event that fires when the user is updating an existing JournalEntry from a WorldAnvil article.
   * @function ScabardUpdateJournalEntry
   * @memberof hookEvents
   * @param {JournalEntry} entry            The JournalEntry document being updated
   * @param {Object} data              Scabard Document Object
   */
  Hooks.callAll(`ScabardUpdateJournalEntry`, entry, id, uri);

  // Update the entry
  await entry.update({
    id:id,
    name: data.main.name,
    content: data.main.description,
    img: data.main.imageURL,
    "scabard": { id: id, uri: uri},
    folder: folder
  });
}
</script>

    <div class="main">
    <Tabs {tabs} {activeTab} on:tabChange={tabChange}/>
    {#if activeTab==="Adventures"}
        <ConceptCards data={adventuresData} on:froggie />
    {:else if activeTab==="Characters"}
        <ConceptCards data={characterData} on:froggie />
    {:else if activeTab==="Events"}
        <ConceptCards data={eventData} on:froggie />
    {:else if activeTab==="Groups"}
        <ConceptCards data={groupData} on:froggie />
    {:else if activeTab==="Items"}
        <ConceptCards data={itemsData} on:froggie />
    {:else if activeTab==="Places"}
        <ConceptCards data={placesData} on:froggie/>
    {:else if activeTab==="Vehicles"}
        <ConceptCards data={vehiclesData} on:froggie />
    {:else if activeTab==="Notes"}
        <ConceptCards data={notesData} on:froggie />
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