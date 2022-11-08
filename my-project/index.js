export default {
	fetch() {
		return new Response('Hello worker! Big Success!', {
			headers: {
				'content-type': 'application/json',
			},
		});
	},
};
