export function http (method, resource, data) {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.onreadystatechange = () => {
			if (request.readyState === 4) {
				let result;
				try {
					result = JSON.parse(request.responseText);
				} catch (error) {
					result = request.responseText;
				}

				if (request.status === 200) {
					resolve(result);
				} else {
					reject(result);
				}
			}
		}
		request.open(method, `/api/main/${resource}`, true);
		request.setRequestHeader("Content-type", "application/json");

		// don't send body for GET requests
		const body = method === 'get' ? '' : JSON.stringify(data);
		request.send(body);
	});
}

export function get (resource, data) {
	return http('get', resource, data);
}

export function post (resource, data) {
	return http('post', resource, data);
}

export function put (resource, data) {
	return http('put', resource, data);
}

export function remove (resource, data) {
	return http('delete', resource, data);
}
