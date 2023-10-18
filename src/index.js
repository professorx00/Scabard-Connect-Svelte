import BasicApplication from "./view/BasicApplication.js";
import UploadApplication from "./view/UploadApplication.js"
import registerSettings from "../src/shared/settings";
import { saveChangestoScabard } from "./scripts/journal.js";
import JournalStore from './stores/JournalStore.js'



Hooks.on("renderJournalDirectory", (app, html, data) => {
   const button =
      $(`<div style="display:flex;margin: 5px;"><button type="button" style="width:90px;height:50px;border:0;border-radius:10px;background:white;" id="scabardconnect">
    <img src="../modules/scabardconnect/public/images/Scabard.png" style="height:50px;width:90px;border:0" alt="scabard"/>
  </button></div>`);
   button.on("click", (event) => {
      event.stopImmediatePropagation();
      new BasicApplication().render(true, { focus: true });
   });
   if(game.user.role === 4 || game.user.role === 3){
      html.find(".directory-header .action-buttons").append(button);
   }
});

Hooks.on('renderJournalSheet', (app, html, data)=>{
   let accessKey = "";
   let username = "";
   if(data?.data?.flags?.scabard){
      console.log(data)
      const id = data.data.flags.scabard?.id
      const uri = data.data.flags.scabard?.uri
      const concept = data.data.flags.scabard?.concept
      JournalStore.set({id:id,uri:uri,concept:concept, data:data})
      const button = $(`<button type"button" id="update-${id}" data-id="${id}" data-uri="${uri}" data-concept="${concept}">Scabard Upload</button>`)
      button.on("click", (event) => {
         event.stopImmediatePropagation();
         new UploadApplication().render(true, { focus: true });
        
      });
      if(game.user.role === 4 || game.user.role === 3 && button){
         html.find(".directory-header").append(button)
      }
   }
  
})

Hooks.once("init", async () => {
   registerSettings();
});