<script>
  import { onMount } from 'svelte';
  import supabase from '$lib/supabase';
  import { getCountries, getCurrentUser, getProducts } from '$lib/supabase-api';
  import { Geolocation } from '@capacitor/geolocation';
  import router from "page";
  import routes from "./routes.ts";
	import Header from './components/header.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
  import { App as CapacitorApp } from '@capacitor/app';
  import { authUser } from '$lib/store';
  import { t, locale, locales, availableLocale } from "$translations/i18n";
  import Sidebar from './components/sidebar.svelte';


  let page;
  let params;
  let props;
  let loc = null;

  async function initRouting () {
    routes.forEach(async (route) => {
      router(
        route.path,
        
        async (ctx, next) => {
          if(!$authUser?.id) { 
            let {data, error} = await supabase.auth.getUser()
            authUser.set(data.user);
          }
          params = ctx.params;
          props = ctx.props;
          next()
        },
        () => {
          if (!route.public) { // route needs auth
            if($authUser?.id) {
              page = route.component
              return
            }
            return router.redirect("/login");
          }
          if (route.public) {  // public routes 
            page = route.component
          }
        });
    });

    router.start();
  }
  


  async function initSupabaseAuth() {
    supabase.auth.onAuthStateChange((event, session) => {

      if(window.location.pathname === '/reset-password-user') return 

      if(session?.user && window.location.pathname === '/login') {  // redirect
        router.redirect('/')
      }

      if(!session?.user) { 
        authUser.set({})
        router.redirect('/login');
      }

    });

  }

  async function initLocale() {
    let currentLanguage = navigator.language.split('-')[0]
    if(!availableLocale.includes(currentLanguage)) currentLanguage = 'en'
    locale.set(currentLanguage)	
  }


  onMount(async () => {
    await initRouting()
    initLocale()
    await initSupabaseAuth()

    await getProducts()
    
		CapacitorApp?.addListener('backButton', ({ canGoBack }) => {
			if (!canGoBack) {
				CapacitorApp?.exitApp();
			} else {
				window?.history?.back();
			}
		});

    
  })

  
  async function getCurrentPosition(){
    const res = await Geolocation.getCurrentPosition()
    loc = res
  }
</script>

<div class="root">
  {#if $authUser?.id}
    <div class="grid grid-cols-12 gap-1">
      <div class="col-span-2">
        <Sidebar />
      </div>
      
      <div class="col-span-10 pt-10 pr-10">
        <svelte:component this={page} {...props, params}/>
      </div>
    </div>
  {/if}

  {#if !$authUser?.id}
      <svelte:component this={page} {...props, params}/>
  {/if}

</div>

<SvelteToast />


 <!-- global css moved to main.ts, need clean up  -->
