<script>
    import World from "$svgComponents/world.svelte";
    import supabase from '$lib/supabase'
    import { toast } from '$lib/toast-helper'
	import router from 'page';
    import { isProtectedRoute } from '$lib/store'
	import { onMount } from "svelte";
    import { countriesStore } from '$lib/store';
	import { t } from '$translations/i18n';

    let formObj = {
        email : "",
        password : "",
        name : "",
        country : ""
    }

	onMount(async () => {
		isProtectedRoute.set(false)
	})




    /** @type {svelte.JSX.FormEventHandler<HTMLFormElement>} */
    async function handleSubmit(event){
        const {error} = await supabase.auth.signUp({
            email : formObj.email,
            password : formObj.password,
            data : {
                country : formObj.country,
                name : formObj.name
            }
        })
        if(error){
            console.log(error)
            toast.error(error.message)
            return
        }
        toast.success("signed up successfully")
        router.redirect("/home")
    }

</script>


<div class="flex-1 flex flex-col md:flex-row justify-around md:items-center">
<World absolute />
<form class="sign-up-root flex-1 flex flex-col justify-center space-y-3 md:max-w-xl md:px-8" on:submit|preventDefault={handleSubmit}>
    <p class="text-center text-orange uppercase text-3xl" > {$t("register.register")} </p>
    <input class="inp" type="name" id="sign-up-name" name="sign-up-name" bind:value={formObj.name} placeholder="name" autofocus required />

    <input class="inp" type="email" id="sign-up-email" name="sign-up-email" placeholder='{$t("register.email")}' bind:value={formObj.email}  required />
    <input class="inp" type="password" id="sign-up-password" name="sign-up-password" placeholder='{$t('register.password')}' minlength="{6}" bind:value={formObj.password} required />
    <button class="text-right text-red uppercase text-3xl place-self-end" type="submit"> '{$t("register.go")}' </button>
</form>
</div>

<style>
    form.sign-up-root > p {
        letter-spacing: .15em;
    }

    form.sign-up-root option:not(:disabled){
        color: var(--primary-orange);
    }


    form.sign-up-root > button {
        letter-spacing: .075em;
    }

</style>