export default {
	async fetch(request:any) {
		console.log("Bot score: ", request.cf.botManagement.score, "verified: ", request.cf.botManagement.verifiedBot)
		const url = new URL(request.url)
		const myCacheKey = `https://${url.hostname}${url.pathname}`
		let response:any
		
		if (request.cf.botManagement.verifiedBot) {
			// This is a verified bot. We want to send him to the origin
			console.log("Verified Bot")
			const targetUrl = "https://httpbin.org/get"
			const http200 = await fetch(targetUrl)
			response = new Response(http200.body, http200)
		}

		if (( ! request.cf.botManagement.verifiedBot) && (request.cf.botManagement.score === 1)) {
			// This is a bad bot. We want to deline access politely by serving him a 401
			const targetUrl = "https://http.cat/401"
			console.log("baaaaaad bot!")
			const http401 = await fetch(targetUrl, {
				cf: {
					cacheTtl: 600,
					cacheEverything: true,
					cacheKey: myCacheKey,
				}	
			})
			response = new Response(http401.body, {
				headers: {
					'content-type': 'image/jpeg',
					'status': '401',
				},
			})
		}

		if ((request.cf.botManagement.score >= 2) && (request.cf.botManagement.score <= 29)) {
			// This request is likely automated. Better return some JSON for the silicon-for-brains
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
			const modifiedBody = JSON.stringify({ Sentiment: 'I, For One, Welcome Our JSON-parsing Overlords', ...jsonBody })
			response = new Response(modifiedBody, http200)
		}

		if ((request.cf.botManagement.score >= 30) && (request.cf.botManagement.score <= 99)) {
			// Showtime! This is the real deal! Likely a human!
			const targetUrl = "https://httpbin.org/get"
			console.log("Likely a bag of meat with eyeballs and such")			
			const http200 = await fetch(targetUrl, {
				cf: {
					cacheTtl: 20,
					cacheEverything: true,
					cacheKey: myCacheKey,
				}	
			})
			response = new Response(http200.body, http200)
		}

		if ( response == null ) {
			// Something went horribly wrong and we didn't hit any of the if statements above
			// a new integer somewhere between 0 and 99 must have been discovered
			const targetUrl = "https://http.cat/500"
			console.log("missed all the if's, universe broken")			
			const http500 = await fetch(targetUrl, {
				cf: {
					cacheTtl: 600,
					cacheEverything: true,
					cacheKey: myCacheKey,
				}	
			})
			response = new Response(http500.body, {
				headers: {
					'content-type': 'image/jpeg',
					'status': '500',
				},
			})
		}

		return response
	}
}