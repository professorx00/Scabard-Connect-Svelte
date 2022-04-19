const registerSettings = function () {
   // Register any custom module settings here
   const modulename = "scabard-connect";

   // game.settings.register(modulename, "allow-player", {
   //    name: "Allow",
   //    hint: "hippi",
   //    scope: "world",
   //    config: true,
   //    default: false,
   //    type: Boolean,
   // });

   // game.settings.register(modulename, "open-new-tab", {
   //    name: "monkey",
   //    hint: "friday",
   //    scope: "world",
   //    config: true,
   //    default: false,
   //    type: Boolean,
   // });

   game.settings.register(modulename, "placesMaps", {
      name: "Places as Maps",
      hint: "Allows to import Maps instead of Images in the journal entry for places",
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
   });

   game.settings.register(modulename, "accessKey", {
      name: "Access Key",
      hint: "24hr Scabard access key to your campaign found on the profile page under the triangle",
      scope: "world",
      config: true,
      default: "",
      type: String,
   });
   game.settings.register(modulename, "username", {
      name: "Scabard Username",
      hint: "your scabard username that the campaign is under",
      scope: "world",
      config: true,
      default: "",
      type: String,
   });

   game.settings.register(modulename, "validator", {
      name: "24hr Validator",
      hint: "24hr validator",
      scope: "world",
      config: false,
      default: "",
      type: String,
   });
   // game.settings.register(modulename, "loot-folder", {
   //    name: "youmd",
   //    hint: "popop",
   //    scope: "world",
   //    config: true,
   //    default: "",
   //    type: String,
   // });

   // game.settings.register(modulename, "currency", {
   //    scope: "world",
   //    config: false,
   //    default: [],
   //    type: Array,
   // });
};

export default registerSettings;
