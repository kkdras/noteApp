import { Box, LinearProgress, MenuItem, NativeSelect, Pagination, Select, SelectChangeEvent, Typography } from "@mui/material";
import React, { ChangeEvent, FC, memo, useEffect, useState } from "react";
import { getEntries, IEntry } from "../app/reducers";
import { store, useAppDispatch, useTypesSelector } from "../app/redux-store";
import { entriesCashedDataApi } from "../packages/storage";
import entries from "../packages/storage/adapters/entries";

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

		{entries?.length && !pendingGetEntries && <Box sx={{
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
		</Box>
		}
	</Box>
}

let EntryWoMemo: FC<{ entry: IEntry }> = ({ entry: item }) => {
	return <Box
		sx={{
			"> *:not(:last-child)": {
				mb: 1
			},
			border: "1px solid",
			borderColor: (theme) => theme.palette.grey[400],
			p: 2,
			borderRadius: "3px",
		}}>
		<Typography sx={{
			color: (theme) => theme.palette.grey[600]
		}} variant="body2">
			{item.sign}
		</Typography>
		<Typography variant="h6">
			{item.entryCounter || "Записть с неопределенным номером"}
		</Typography>
		<Typography sx={{
			color: (theme) => theme.palette.grey[600]
		}}>
			{item.date}
		</Typography>

		<Typography variant="body2">
			{item.text}
		</Typography>
	</Box>
}
let Entry = memo(EntryWoMemo)

