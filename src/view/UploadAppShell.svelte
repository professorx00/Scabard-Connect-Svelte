<script>
    import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
    import { getContext }         from 'svelte';
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
    export let resError = false;

    export let uploaded = false;

    const application = getContext('#external').application;
 
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
      const modifiedText = addBreaks(text)
      const doc = new DOMParser().parseFromString(modifiedText, 'text/html');
      return doc.body.textContent || '';
    }

    const addBreaks = (text)=>{
      let result = text
      result = result.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n')
      return result
    }

    const formatBody = (data, concept)=>{
      let fBody = {}
      let pages = data.data.pages
      for(let page in pages){
         if(pages[page].name =="Brief Summary"){
            let bsum = pages[page].text.content
            if(bsum){
               fBody['briefSummary'] = bsum
            }else{
               fBody['briefSummary'] = " "
            }
            
         }
         if( pages[page].name == 'Description'){
            if(pages[page].ownership.default === 0){
               fBody['isSecret'] = "true"
            }else{
               fBody['isSecret'] = "false"
            }
            let des =  pages[page].text.content
            if(des){
               fBody['description'] = des
            }else{
               fBody['description'] = " "
            }
         }
         if( pages[page].name == "GM Secrets"){
            let gms =  pages[page].text.content
            if(gms){
               fBody['gmSecrets'] = gms
            }else{
               fBody['gmSecrets'] = " "
            }
         }
         if( pages[page].name == "Secrets"){
            let sec =  pages[page].text.content
            if(sec){
               fBody['secrets'] = sec
            }else{
               fBody['secrets'] = " "
            }

         }
      }

      fBody['name'] =data.data.name
      fBody['concept']= concept.charAt(0).toUpperCase() + concept.slice(1);

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
            console.log(body)
            const response = await axios.post(`https://www.scabard.com/api/v0${uri}`,body,{ headers: { username: username, accessKey: accessKey, "content-type": "application/json"  }})
            if(response && response.data?.isSuccess){
               uploaded = true
               application.close();
            }else{
               resError = true;
            }
        }catch(err){
            console.error(err)
            resError = true;
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
      {#if uploaded} <span>Upload Successful</span> {/if}
      {#if resError} <span style="color: red">Upload Failed</span> {/if}
      <span style="color: red">This upload to Scabard will not update images and possible not update if there are inline images in description, secret, or gm secrets. Please be advise we are working on a solution but have not come up with one yet. </span>
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
       flex-direction: column;
       justify-content: center;
    }
    nav{
       text-align: center;
       height: 50px;
       width: 600;
       align-items: center;
    }
   
 </style>