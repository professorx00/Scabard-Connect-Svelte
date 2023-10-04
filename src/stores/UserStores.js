import { writable } from "svelte/store";

const UserStore = writable({
   username: null,
   accessKey: null,
   campaigns: null,
   selectedCampaign: null,
   selectedCampaignDetails: null,
});

export default UserStore;
