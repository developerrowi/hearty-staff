<script>
    import { onMount } from 'svelte';
	import router from 'page';
    import supabase from '$lib/supabase';
    import mainLogo from '$static/logo.jpg'
    
  const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
    };
</script>

<div class="w-60 h-full shadow-lg bg-white px-1 absolute main-nav">
    <div class="grid mt-10 justify-center">
        <h4> Hearty Pharmacy</h4>
    </div>

    <ul class="relative z-50 ">

      <li class="relative">
        <span 
            class="cursor-pointer flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out" 
             data-mdb-ripple="true" data-mdb-ripple-color="dark"
             on:click={() => router.redirect('/invoice')}>
            Sales
        </span>
      </li>

      <li class="relative">
        <span 
            class="cursor-pointer flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out" 
             data-mdb-ripple="true" data-mdb-ripple-color="dark"
             on:click={handleLogout}>
            Logout
        </span>
      </li>

    </ul>
  </div>

  <style>
    
	.main-nav {
		background: var(--main-color);
		color: var(--white);
		cursor: default;
	}

  </style>