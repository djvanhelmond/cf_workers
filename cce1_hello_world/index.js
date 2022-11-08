export default {
	fetch(request) {
		if (request.method == "POST") {
			var body = "POST Hello"
			var content_type = "application/json"
		} else {
			var body = "GET Hello"
			var content_type = "text/plain"
		}
		return new Response(body, {
			headers: {
				'content-type': content_type,
			},
		});
	},
};
