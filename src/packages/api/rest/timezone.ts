import makeRequest from "../makeRequest"

export let getTimeZones = () => {
	return makeRequest<string[]>({
		url: "timezone"
	})
}


export interface ISpecificTimezone {
	abbreviation: string
	client_ip: string
	datetime: string
	day_of_week: number
	day_of_year: number
	dst: boolean
	dst_from: any
	dst_offset: number
	dst_until: any
	raw_offset: number
	timezone: string
	unixtime: number
	utc_datetime: string
	utc_offset: string
	week_number: number
}
export let getSpecificTimezone = (timezone: string) => {
	return makeRequest<ISpecificTimezone>({
		url: "timezone" + `/${timezone}`
	})
}