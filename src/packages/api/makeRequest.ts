import axios from "axios"
import config from "./config"

let instance = axios.create({
	baseURL: config.url
})

export default <T>({
	url = "/",
	method = "get",
	params = {},
	data = {},
	headers = {}
}) => {
	return instance.request<T>({
		url,
		method,
		headers,
		params,
		data
	}).then(res => res.data)
}
