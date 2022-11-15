export default {
	fetch(request) {
		let body:string
		let contentType:string
		if (request.method == "POST") {
			const { searchParams } = new URL(request.url)
			const name = searchParams.get('name') || "Anon"
			body = JSON.stringify({ greeting: "POST Hello", name: name })
			contentType = "application/json"
		} else {
			body = "GET Hello"
			contentType = "text/plain"
		}
		return new Response(body, {
			headers: {
				'content-type': contentType,
			},
		})
	},
};
