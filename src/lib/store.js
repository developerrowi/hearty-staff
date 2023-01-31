import { writable } from 'svelte/store';
import supabase from './supabase';

/** @type { import('svelte/store').Writable< import('@supabase/gotrue-js').User > } */
export const authUser = writable({});
export const isProtectedRoute = writable(false);
export const isFromItineraryRoute = writable(false);
export const isBarsActive = writable(false);
export const isModalOpen = writable(false);
export const isPopupShown = writable(false);
export const isTripModalOpen = writable(false);

export const filterStore = writable([]);

export const countriesStore = writable([]);
