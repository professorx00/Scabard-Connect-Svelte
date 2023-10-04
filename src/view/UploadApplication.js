import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';

import UploadAppShell from './UploadAppShell.svelte'
export default class UploadApplication extends SvelteApplication {
   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    * 
    */
   static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
         title: "Upload Test", // Automatically localized from `lang/en.json`.
         width: 700,
         height: "auto",
         scrollY: [".scabard-container"],

         svelte: {
            class: UploadAppShell,
            target: document.body,
         },
      });
   }

}