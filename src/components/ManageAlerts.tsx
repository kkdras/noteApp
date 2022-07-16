import { Box } from "@mui/material"
import React, { FC } from "react"

interface IManegeAlerts {
	children: React.ReactNode
}

export let ManageAlerts: FC<IManegeAlerts> = ({ children }) => {
	return <Box sx={{
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		position: "fixed",
		bottom: "10px",
		left: "10px",
		"> div:not(:last-child)": {
			mb: 1
		}
	}}>
		{children}
	</Box>
}