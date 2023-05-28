import BasicApplication from "./view/BasicApplication.js";
import registerSettings from "../src/shared/settings";
// Hooks.once("ready", () => new BasicApplication().render(true, { focus: true }));

Hooks.on("renderJournalDirectory", (app, html, data) => {
   const button =
      $(`<div style="display:flex;margin: 5px;"><button type="button" style="width:90px;height:50px;border:0;border-radius:10px;background:white;" id="scabardconnect">
    <img src="modules/scabardconnect/public/images/Scabard.png" style="height:50px;width:90px;border:0" alt="scabard"/>
  </button></div>`);
   button.on("click", (event) => {
      event.stopImmediatePropagation();
      new BasicApplication().render(true, { focus: true });
   });
   html.find(".directory-header .action-buttons").append(button);
});

Hooks.once("init", async () => {
   registerSettings();

});