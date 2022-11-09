export default {
	fetch(request) {
		if (request.method == "POST") {
			const { searchParams } = new URL(request.url)
			let name = searchParams.get('name')
			if (name == null) {name = "Anon"} 
			var body = JSON.stringify({ greeting: "POST Hello", name: name })
			var content_type = "application/json"
		} else {
			var body = "GET Hello"
			var content_type = "text/plain"
		}
		return new Response(body, {
			headers: {
				'content-type': content_type,
			},
		})
	},
};
