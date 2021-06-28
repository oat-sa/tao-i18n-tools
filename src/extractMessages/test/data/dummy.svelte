<script>
    const string = __('More dummy strings');
</script>

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

<div>
    <section>
        <h5>{__('All work is done!')}</h5>
        <p>{__('You have no more pending tasks for now!')}</p>
        <button label={__('Logout')} />
        <span>{__.tc('Plural translation')}</span>
    </section>
</div>

<svelte:window on:focus={() => {}} />

<svelte:head>
    <style>
        p {
            color: red;
        }
    </style>
</svelte:head>

<svelte:body on:blur={() => {}} />
