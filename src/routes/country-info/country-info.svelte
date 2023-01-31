<script>
    import { authUser,isBarsActive,isProtectedRoute } from "$lib/store";
    import { onMount } from "svelte";
    import User from "$svgComponents/icons/user.svelte";
	import router from 'page';
    import supabase from "$lib/supabase";
    import WorldMap from "$components/world-map.svelte";
    import BottomMenu from "$components/bottom-menu.svelte";
    onMount(async () => {
        isProtectedRoute.set(true);
            if (!$authUser) router.redirect('/');
            console.log(authUser);
            isBarsActive.set(false);
           await getAllImages();
           await getAllCountries();
            let url = new URL(window.location.toString());
            Id = url.searchParams.get("countryId");
            if(Id){
                let country = countries.find((country)=>country.id == Id);
                if(country){
                   showCountryDetails(country);
                }
            }
    
    });
    //get all countries
    let countries = [];
       async function getAllCountries(){
         let {data,error} = await   supabase.from('countries').select('*');
            if(error){
                console.log(error);
            }else{
                countries = data;
            }
            
       }
    //show country details
        let clicked = false;
        let lang = '';
        let capital = '';
        let religion = '';
        let Id = '';
        let countryName = '';
        function showCountryDetails(item) {
            numberOfImages = 0;
            Id = item.id;
            capital = item.capital;
            lang = item.language;
            religion = item.religion;
            countryName = item.name;
            getNumberOfImages();
            clicked = true;
        }
        //get All images
        let images = [];
        let numberOfImages = 0;
        async function getAllImages() {
            const { data, error } = await supabase.from('places').select('*');
            if (error) {
                console.log(error);
            } else {
                images = data;
            }
        }
        //get number of images for each country
        function getNumberOfImages() {
            let count = 0;
            images.forEach((item) => {
                if (item.countries_id == Id) {
                    count++;
                }
            });
            numberOfImages = count;
        }
    </script>
    <div class="home-root flex-1 flex flex-col mt-20">
    {#if $authUser}
    <span
        class="profile  mx-5 cursor-pointer"
        title="Profile"
        on:click|preventDefault={() => router.redirect('/profile')}
    >
        <User />
    </span>
    {/if}
    <WorldMap/>
    <div>
            <!-- country details modal -->
            <div
                class={clicked ? 'modal-det1 show-1 shadow-xl text-center' : 'modal-det1 shadow-lg'}
            >
         <div class="cntry-name">
            {countryName}
         </div>   
                <div>
                    <img
                        class="modal-img-1"
                        src="https://th.bing.com/th/id/OIP.tOnQyCdKsO8xHBtsy-yYCQHaFj?w=271&h=203&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                        alt=""
                    />
                </div>
                <div class="pic-1"><span class="data-1">{numberOfImages} Pics</span> For this country</div>
                <div class="lang-1">Language Spoken: <span class="data-1">{lang}</span></div>
                <div class="rel-1">Religion: <span class="data-1">{religion}</span></div>
                <div class="cap-1">Country Capital: <span class="data-1">{capital}</span></div>
            </div>
            </div> 
    
            <BottomMenu />
    </div>
    <style>
        /*country details modal css*/
        .modal-det1 {
            position: fixed;
            top: 35%;
            left: 30%;
            width: 45%;
            height: 40%;
            background-color: rgb(28, 36, 48, 0.6);
            z-index: 999;
            display: none;
            text-align: center;
        }
        .show-1 {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: #fff;
            font-family: 'Times New Roman', Times, serif;
        }
        .data-1 {
            color: #bdf5c7;
        }
        /*modal img css*/
        .modal-img-1 {
            width: 80px;
            height: 80px;
            border-radius: 100%;
        }
        .cntry-name{
            font-size: 1.5rem;
            font-weight: 600;
            color:#bdf5c7;
        }
        @media screen and (max-width: 500px) {
            .modal-det1 {
                left: 10%;
                width: 80%;
            }
        }
    </style>