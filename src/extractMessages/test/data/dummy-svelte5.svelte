<script>
    const string = __('Svelte 5 dummy string');
    let myString = $state(string);

    $effect(() => {
        console.log('myString value: ', myString);
    });
</script>

<div>
    <section>
        <h5>{__('All work is done!')}</h5>
        <p>{__('You have no more pending tasks for now!')}</p>

        <button onclick={() => (myString = 'modified string')}>
            myString value: {myString}
        </button>
        <button aria-label="logout" label={__('Logout')}></button>
        <span>{__.p('Key', 'Plural key', 5)}</span>
    </section>
</div>

<svelte:window onfocus={() => {}} />

<svelte:head>
    <style>
        p {
            color: red;
        }
    </style>
</svelte:head>

<svelte:body onblur={() => {}} />

<style>
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        min-height: 100vh;
    }

    h5 {
        font-size: 5rem;
        padding: 0;
        margin: 0;
    }

    p {
        padding-bottom: 2rem;
    }
</style>
