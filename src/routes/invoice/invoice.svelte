<script>
	import BottomMenu from '$components/bottom-menu.svelte';
	import WorldMap from '$components/world-map.svelte';
	import { isProtectedRoute, authUser, } from '$lib/store';
	import { onMount } from 'svelte';
	import router from 'page';
	import User from '$svgComponents/icons/user.svelte';
    import AutoComplete from "simple-svelte-autocomplete"
    import { products, invoiceDetail, totalPrice, insertSales } from '$lib/supabase-api';

    let qty 
    let selectedProduct
    let isSeniorCitizen = false
    let seniorCitizenDiscount = .10


	onMount(() => {
		isProtectedRoute.set(true);
		if (!$authUser) router.redirect('/');
		console.log($authUser);
	});

    async function addProductToInvoice() {

        if(!selectedProduct) return
        let invoices = []
        invoices =  [  ...$invoiceDetail]
        invoices.push({
            product_name: selectedProduct.name,
            qty: qty,
            price: selectedProduct.price,
        })
        invoiceDetail.set(invoices)
        console.log('changing', $invoiceDetail)

        selectedProduct = null
        qty = null
        updateTotal()
    }

    async function updateTotal() {
        let total = 0
        for(var i in $invoiceDetail) {
            total += $invoiceDetail[i].price * $invoiceDetail[i].qty
        }
        totalPrice.set(total)
    }

    async function removeInvoice(i) {
        let invoices = []
        invoices =  [  ...$invoiceDetail]
        invoices.splice(i, 1)
        invoiceDetail.set(invoices)
    }

    async function clearInvoice() {
        invoiceDetail.set([])
        qty = null
        totalPrice.set(0)
        isSeniorCitizen = false
    }

    async function submitInvoice() {
        let finalTotal = $totalPrice
        if(isSeniorCitizen) finalTotal = $totalPrice - ($totalPrice * seniorCitizenDiscount)
        
        let finalInsert = {
            type: 'Invoice',
            cashier: $authUser.email,
            total: finalTotal,
            senior_discount: isSeniorCitizen ? seniorCitizenDiscount : null
        }
        await insertSales(finalInsert, $invoiceDetail)

        clearInvoice()
    }

</script>


<div class="max-w-sm p-6 bg-white p-5">
    <h5 class="text-black"> Search Medicine</h5>
    <AutoComplete items="{$products}" labelFieldName="name"  bind:selectedItem="{selectedProduct}" />
    <input type="number"
    class="
      form-control
      z-50
      px-3  
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
    "
    id="exampleNumber0"
    placeholder="qty"
    bind:value={qty}
    />
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-5"
    on:click={() =>addProductToInvoice()}> Add </button>
</div>
{ #if $totalPrice}

<div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <div class="relative overflow-x-auto shadow-lg sm:rounded-lg p-5 custom-table">

        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-5"
            on:click={() => isSeniorCitizen = !isSeniorCitizen}> Senior Citizen </button>

        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>

                    <th scope="col" class="px-6 py-3">
                        Product name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Price
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Qty
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Total
                    </th>
                    <th scope="col" class="p-4">
                        <div class="flex items-center">
                            <label for="checkbox-all-search" class="sr-only">Actions</label>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each $invoiceDetail as item, i}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                    <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {item.product_name}
                    </td>
                    <td class="px-6 py-4">
                        P{item.price}
                    </td>
                    <td class="px-6 py-4">
                        {item.qty}
                    </td>
                    <td class="px-6 py-4">
                        P{item.price * item.qty}
                    </td>
                    <td class="w-4 p-4">
                        <div class="flex items-center">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-5" on:click={() =>removeInvoice(i)}>Delete</button>
                        </div>
                    </td>
                </tr>
                {/each}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="w-4 p-4 text-lg">Total</td>
                    <td class="w-4 p-4"></td>
                    <td class="w-4 p-4"></td>
                    <td class="w-4 p-4"> <h2 class="text-lg"> <strong> P{$totalPrice} </strong>  </h2> </td>
                    <td class="w-4 p-4"></td>
                </tr>
                {#if isSeniorCitizen}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="w-4 p-4 text-lg">Senior Discount</td>
                    <td class="w-4 p-4"></td>
                    <td class="w-4 p-4"></td>
                    <td class="w-4 p-4"> <h2 class="text-lg"> <strong> - {$totalPrice * seniorCitizenDiscount} </strong>  </h2> </td>
                    <td class="w-4 p-4"></td>
                </tr>       
        
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="w-4 p-4 text-lg">Grand Total</td>
                    <td class="w-4 p-4"></td>
                    <td class="w-4 p-4"></td>
                    <td class="w-4 p-4"> <h2 class="text-lg"> <strong> P{$totalPrice - ($totalPrice * seniorCitizenDiscount)} </strong>  </h2> </td>
                    <td class="w-4 p-4"></td>
                </tr>
                {/if}
                {#if !isSeniorCitizen}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="w-4 p-4 text-lg">Grand Total</td>
                    <td class="w-4 p-4"></td>
                    <td class="w-4 p-4"></td>
                    <td class="w-4 p-4"> <h2 class="text-lg"> <strong> P{$totalPrice} </strong>  </h2> </td>
                    <td class="w-4 p-4"></td>
                </tr>
                {/if}
            </tbody>
        </table>
        
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-5"
        on:click={()=> submitInvoice()}>
        Submit
        </button>

        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            on:click={()=> clearInvoice()}>
        Clear
        </button> 
    </div>
</div>
{ /if}

<style>
	.home-root {
		position: relative;
	}
</style>
