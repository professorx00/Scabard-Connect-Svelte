import { SessionStorage } from "@typhonjs-fvtt/runtime/svelte/store";

const store = SessionStorage.createStore("UserData", { testing: "testing" });

export default store;
