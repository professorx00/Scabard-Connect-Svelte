import BasicApplication from "./view/BasicApplication.js";

// Hooks.once("ready", () => new BasicApplication().render(true, { focus: true }));

Hooks.on("renderJournalDirectory", (app, html, data) => {
   const button = $(`<button type="button" style="height: 80px" id="scabard-connect">
    <img src="modules/scabard-connect/public/images/Scabard.png" alt="scabard"/>
  </button>`);
   button.on("click", (ev) => {
      new BasicApplication().render(true, { focus: true });
   });
   html.find(".directory-header .action-buttons").append(button);
});

