export default {
	async fetch(request:any) {
		console.log("Bot score: ", request.cf.botManagement.score, "verified: ", request.cf.botManagement.verifiedBot)
		let response:any

		if (request.cf.botManagement.verifiedBot) {
			// This is a verified bot - it gets our page
			console.log("verified bot")
			const http200 = await fetch("https://httpbin.org/get")
			response = new Response(http200.body, {
				headers: {
					'content-type': 'text/plain',
					'status': '200',
				},
			})
		}	

		if (( ! request.cf.botManagement.verifiedBot) && (request.cf.botManagement.score === 1)) {
			// This is a bad bot - it gets a 401
			console.log("bad bot")
			const http401 = await fetch("https://http.cat/401")
			response = new Response(http401.body, {
				headers: {
					'content-type': 'image/jpeg',
					'status': '401',
				},
			})
			
		}

		if ( response == null ) {
			// This is anything else
			console.log("normal user")
			const http200 = await fetch("https://http.cat/200")
			response = new Response(http200.body, {
				headers: {
					'content-type': 'image/jpeg',
					'status': '200',
				},
			})
			
		}
		return response
	}
}












//		const newRequest = new Request("https://httpbin.org/get", {
//			body: request.body,
//			headers: request.headers,
//			}
//		)
//		
