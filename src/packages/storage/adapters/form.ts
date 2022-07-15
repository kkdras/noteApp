import storage from "../storage";

function setFormData<T>(formData: T): void {
	storage.setItem("formData", JSON.stringify(formData))
}

function getFormData<T>(): T {
	let tmp = storage.getItem("formData")
	return tmp ? JSON.parse(tmp) : null
}

export default {
	setFormData,
	getFormData
}