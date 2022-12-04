export default {
	async fetch(request:any) {
		console.log("Bot score: ", request.cf.botManagement.score, "verified: ", request.cf.botManagement.verifiedBot)
		const url = new URL(request.url)
		const myCacheKey = `https://${url.hostname}${url.pathname}`
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
		
		if ((request.cf.botManagement.score >= 1) && (request.cf.botManagement.score <= 29)) {
			// Likely automated
			const targetUrl = "https://httpbin.org/get"
			console.log("Likely automated")			
			const http200 = await fetch(targetUrl, {
				cf: {
					cacheTtl: 20,
					cacheEverything: true,
                    cacheKey: myCacheKey,
				}	
			})
			const jsonBody = await http200.json()
			const modifiedBody = JSON.stringify({ foo: 'bar', ...jsonBody })
			response = new Response(modifiedBody, http200)
		}

		if ((request.cf.botManagement.score >= 1) && (request.cf.botManagement.score <= 29)) {
			// Likely automated
			const targetUrl = "https://httpbin.org/get"
			console.log("Likely automated")			
			const http200 = await fetch(targetUrl, {
				cf: {
					cacheTtl: 20,
					cacheEverything: true,
                    cacheKey: myCacheKey,
				}	
			})
			const jsonBody = await http200.json()
			const modifiedBody = JSON.stringify({ foo: 'bar', ...jsonBody })
			response = new Response(modifiedBody, http200)
		}


		return response
	}
}