import { Box } from "@mui/material"
import React, { FC } from "react"

interface IManegeAlerts {
	children: React.ReactNode
}

export let ManageAlerts: FC<IManegeAlerts> = ({ children }) => {
	return <Box sx={{
		zIndex: 10,
		bottom: 0,
		left: 0,
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		position: "fixed",
		overflow: "hidden",
		padding: 1.5,
		width: "100vw",
		"> div:not(:last-child)": {
			mb: 1
		},
		"> div": {
			maxWidth: "100%",
			"div + div": {
				whiteSpace: "nowrap",
				overflow: "hidden",
				textOverflow: "ellipsis"
			}
		}
	}}>
		{children}
	</Box>
}