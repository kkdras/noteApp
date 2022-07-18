import { Typography, Box } from "@mui/material"
import React, { FC, memo } from "react"
import { IEntry } from "../app/reducers"

export let Entry: FC<{ entry: IEntry }> = memo(({ entry: item }) => {
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
})