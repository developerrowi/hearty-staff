
/** @type {import('@sveltejs/kit').PageLoad} */
export async function load({ url }) {
	return {
		host: url.host ? url.host : `http://localhost:3000/reset-password-user`
	};
}
