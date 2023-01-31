import supabase from '$lib/supabase';
import { ITINERARY } from '../constant';
export const getItineraryList = async () => {
	const { data, error } = await supabase.from(ITINERARY).select('*').eq('status', true);
	return { data, error };
};
