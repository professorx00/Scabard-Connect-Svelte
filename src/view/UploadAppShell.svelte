<script>
    import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
    import UserStores from '../stores/UserStores'
    import JournalStore from "../stores/JournalStore"
    import { onMount } from 'svelte';
    import axios from 'axios';
    export let elementRoot;

    export let username = '';
    export let accessKey = '';
    export let campaigns = null;
    export let step = 0;
    export let validator='';
    export let selectedCampaign;
    export let selectedCampaignDetails;
    export let dataStore;

    export let id;
    export let uri;
    export let data;
    export let concept;

    console.log(id,uri,concept,data)
 
    UserStores.subscribe((value)=>{
     dataStore = value
     step = value.step
     username = value.username
     accessKey = value.accessKey
     campaigns = value.campaigns
     selectedCampaign= value.selectedCampaign
     selectedCampaignDetails =value.selectedCampaignDetails
    })

    JournalStore.subscribe((value)=>{
      id=value.id
      uri=value.uri
      concept=value.concept
      data=value.data
    })
 
    onMount(async ()=>{
       accessKey = game.settings.get("scabardconnect", "accessKey")
       username = game.settings.get("scabardconnect", "username")
       validator = game.settings.get("scabardconnect", "validator")
       if(accessKey === "" || username ===""){
          UserStores.set({step: step, username: username, accessKey: accessKey, validator: validator, campaigns: null, selectedCampaign: null, selectedCampaignDetails: null})
       }else{
          try{
            
          }catch(err){
             UserStores.set({step: step, username: username, accessKey: accessKey, validator: validator, campaigns: null, selectedCampaign: null, selectedCampaignDetails: null})
          }
       }
    })

    const removeHTML = (text)=>{
      var temp = document.createElement('div');
      temp.innerHTML = text;
      return temp.textContent;
    }

    const formatBody = (data, concept)=>{
      let fBody = {}
      let pages = data.data.pages
      console.log(pages)
      for(let page in pages){
         console.log("name", pages[page])
         if( pages[page].name == 'Description'){
            fBody['description'] =  removeHTML(pages[page].text.content)
         }
         if( pages[page].name == "GM Secrets"){
            fBody['gmSecrets'] =  removeHTML(pages[page].text.content)
         }
         if( pages[page].name == "Secrets"){
            fBody['secrets'] =  removeHTML(pages[page].text.content)
         }
      }

      fBody['name'] =data.data.name
      fBody['briefSummary'] = 'Upload From Foundry'
      fBody['concept']= 'Character'

      return fBody
    }
 
    const handleClick = async(e)=>{
        try{

            let body = formatBody(data, concept)

            let formattedBody = []
            for(var property in body){
                var encodedKey = encodeURIComponent(property)
                var encodedValue = body[property];
                formattedBody.push(encodedKey + "=" + encodedValue);
            }
            
            formattedBody = formattedBody.join('&');
            console.log(formattedBody)
            // const campaign = await axios.get("https://www.scabard.com/api/v0/campaign", {headers: {"accessKey": accessKey, "username":username}})
            const response = await axios.post(`https://www.scabard.com/api/v0/campaign/1038131/character/2473526`,formattedBody,{ headers: { username: username, accessKey: accessKey, "content-type": "application/x-www-form-urlencoded"  }})
        }catch(err){
            console.error(err)
        }
    }
 
 
 </script>
 
 <!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
 <svelte:options accessors={true}/>
 
 <!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
 <!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
 <ApplicationShell bind:elementRoot>
    <div class="containerDiv">
    <nav>
       <h1>Upload To Scabard</h1>
    </nav>
    <main>
      <button on:click={handleClick}>Upload</button>
    </main>
 </div>
 </ApplicationShell>
 
 <style>
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