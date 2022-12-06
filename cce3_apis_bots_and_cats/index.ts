export default {
    async fetch(request:any, env: any, context:any) {
        console.log("Bot score: ", request.cf.botManagement.score, "verified: ", request.cf.botManagement.verifiedBot)
        const url = new URL(request.url)
        const myCacheKey = `https://${url.hostname}${url.pathname}`


		// Define some variable that we will need
        let targetUrl:string
        let contentType:string
        let httpStatus:string
        let makeJson:boolean
        let cf_storeInCache:boolean
        let cf_cacheTtl:number


		// Figure out who we are dealing with 
		// 1 Verified Bot
		// 2 Bad Bot
		// 3 Likely Automated
		// 4 Likely Human
		// 5 catch all
        if  (request.cf.botManagement.verifiedBot) {
            console.log("This is a verified bot, let us give it what it wants directly from the origin")            
            targetUrl = "https://httpbin.org/get"
            contentType = 'application/json'
            httpStatus = '200' // OK
            makeJson = false
            cf_storeInCache = false
            cf_cacheTtl = 0
        } 
        else if (( ! request.cf.botManagement.verifiedBot) && (request.cf.botManagement.score === 1)) {
            console.log("This is a unverified bot with a score of 1 - we treat him as a bad bot and don't serve it")            
            targetUrl = "https://http.cat/401"
            contentType = 'image/jpeg'
            httpStatus = '401' // Unauthorized
            makeJson = false
            cf_storeInCache = false
            cf_cacheTtl = 0
        } 
        else if ((request.cf.botManagement.score >= 2) && (request.cf.botManagement.score <= 29)) {
            console.log("This is likely automated, better return some JSON and cache the response from the origin")         
            targetUrl = "https://httpbin.org/get"
            contentType = 'application/json'
            httpStatus = '200' // OK
            makeJson = true
            cf_storeInCache = true
            cf_cacheTtl = 30
        } 
        else if ((request.cf.botManagement.score >= 30) && (request.cf.botManagement.score <= 99)) {
            console.log("This most probably a human, let's cache the response from the origin")         
            targetUrl = "https://httpbin.org/get"
            contentType = 'application/json'
            httpStatus = '200' // OK
            makeJson = false
            cf_storeInCache = true
            cf_cacheTtl = 30
        } 
        else {
            console.log("Something went wrong, let;s serve a HTTP 500")
            targetUrl = "https://http.cat/500"
            contentType = 'image/jpeg'
            httpStatus = '500' // Server Error
            makeJson = false
            cf_storeInCache = false
            cf_cacheTtl = 0
        } 

		// Pull the content from the Origin, cache if needed
		const originContent = await fetch(targetUrl, {
			cf: {
				cacheTtl: cf_cacheTtl,
				cacheEverything: true,
				cacheKey: myCacheKey,
			}	
		})

		// Cache the request if required
		if (cf_storeInCache) {context.waitUntil(caches.default.put(request, originContent.clone()))}     

		// Transform the body to JSON if likely automated
		let newBody:any
        if (makeJson) {
            const jsonBody = await originContent.json()
            newBody = JSON.stringify({ Sentiment: 'I, For One, Welcome Our JSON-parsing Overlords', ...jsonBody })
        } else {
            newBody = originContent.body
        }

		// Construct a response and send it out
		let response:any
		response = new Response(newBody, originContent)
		response.headers.append('cf-bm-score', request.cf.botManagement.score)
		response.headers.append('status', httpStatus)
		return response
	}
}

