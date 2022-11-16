export default {
	fetch() {
		const lookupTable = {
			0: 'Response 0',
			1: 'Response 1',
			2: 'Response 2',
			3: 'Response 3',
		  };		  
		return new Response(lookupTable[Math.floor(Math.random() * Object.keys(lookupTable).length)], {
			headers: {
				'content-type': 'text/plain',
			},
		});
	},
};
