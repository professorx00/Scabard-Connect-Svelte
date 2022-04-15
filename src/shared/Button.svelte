<script>
    export let type = 'primary';
    export let flat = false;
    export let inverse = false;
</script>

<button class={type} class:flat={flat} class:inverse={inverse} >
    <slot></slot>
</button>

<style>
    button {
        border: 0px;
        width: 200px;
        cursor: pointer;
        border-radius: 10px;
        padding: 8px 12px;
        font-weight: bold;
        box-shadow: 1px 2px 3px rgba(0,0,0,0.2) ;
    }
    .primary{
        background: #0197a7;
        color: #f4f4f4;
    }
    .secondary{
        background: #ffa500;
        color: #000;
    }
    .flat{
        box-shadow: none;
    }
    .primary.inverse{
        background: #f4f4f4;
        color: #0197a7;
        border: 2px solid #0197a7
    }
    .secondary.inverse{
        color: #ffa500;
        background: #f4f4f4;
        border: 2px solid #ffa500;
    }
</style>