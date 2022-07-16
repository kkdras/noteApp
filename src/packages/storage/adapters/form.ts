import { ICacheFormData } from "../../../components/Form";
import storage from "../storage";

function setFormData(formData: ICacheFormData): void {
	storage.setItem("formData", JSON.stringify(formData))
}

function getFormData() {
	let tmp: null | ICacheFormData = JSON.parse(storage.getItem("formData") || "null")

	let returnValue: ICacheFormData = tmp || { selectTz: "", sign: "" }
	return returnValue
}

export default {
	setFormData,
	getFormData
}