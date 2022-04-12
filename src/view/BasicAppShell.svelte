<script>
   import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';

   function onClick(){
      console.log("Button Clicked")
   }

   export let elementRoot;
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
   <main>
      <h1>Scabard Connect</h1>
      <button class="testButton" on:click={onClick}>Test2</button>
   </main>
</ApplicationShell>

<style lang="scss">
   main {
      text-align: center;
      display: flex;
      flex-direction: column;
      height: 500;
   }
   .testButton {
      width: 160px;
      border: 10px;
      border-radius: 10px;
      box-shadow: 20px;
   }
</style>