import axios from "axios"
import config from "./config"

let instance = axios.create({
	baseURL: config.url,
})

export default <T>({
	url = "/",
	method = "get",
	params = {},
	data = {},
	headers = {
		"Content-Type": "text/plain"
	}
}) => {
	return instance.request<T>({
		url,
		headers,
		method,
		params,
		data
	}).then(res => res.data)
}
