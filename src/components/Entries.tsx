import { Box, LinearProgress, MenuItem, Pagination, Select } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { getEntries } from "../app/reducers";
import { useAppDispatch, useTypesSelector } from "../app/redux-store";
import { entriesCashedDataApi } from "../packages/storage";
import { Entry } from "./Entry";

let testEntriesCashedDataApi: {
	setEntriesCashedData: (data: { count: number }) => void
	getEntriesCashedData: () => { count: number | null }
} = entriesCashedDataApi

export let Entries: FC = () => {
	let [entriesPerView, setEntriesPerView] =
		useState(entriesCashedDataApi.getEntriesCashedData().count || 6)
	let [page, setPage] = useState(1)
	let [range, setRange] = useState(0)

	let dispatch = useAppDispatch()
	let entries = useTypesSelector(state => state.entries)
	let pendingGetEntries = useTypesSelector(state => state.pendingGetEntries)
	let paginationHandler = (_: any, page: number) => {
		setRange((page - 1) * entriesPerView)
		setPage(page)
	}

	useEffect(() => {
		dispatch(getEntries())
	}, [])

	return <Box sx={{
		display: "grid",
		gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
		gridAutoRows: "minmax(150px, auto)",
		gap: "10px"
	}}>
		{pendingGetEntries && <LinearProgress sx={{
			"@media (min-width: 657px)": {
				gridColumn: "span 2",
			},
			width: "100%"
		}} />}
		{!pendingGetEntries && entries?.slice(range, range + entriesPerView)
			?.map((item) => <Entry key={item.date} entry={item} />)}

		{!!entries?.length && !pendingGetEntries && <Box sx={{
			justifySelf: "center",
			alignSelf: "start",
			justifyItems: "center",
			mt: 2,
			"@media (min-width: 657px)": {
				gridColumn: "span 2",
			},
			display: "flex",
			flexWrap: "wrap",
			alignItems: "center"

		}}>
			<Pagination
				onChange={paginationHandler}
				page={page}
				count={Math.ceil(entries?.length / entriesPerView)}
				showFirstButton showLastButton />
			<Select onChange={(e) => {
				entriesCashedDataApi.setEntriesCashedData({ count: +e.target.value })
				setRange(0)
				setEntriesPerView(+e.target.value)
				setPage(1)
			}} value={entriesPerView}>
				{[6, 12, 18, 24, 30].map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
			</Select>
		</Box>}
	</Box>
}
