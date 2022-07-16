import { AppBar, Box, Button, Container, IconButton, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import React, { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Entries } from "./Entries";
import { Form } from "./Form";


function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`
	};
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				children
			)}
		</div>
	);
}

export const App: FC = () => {
	let location = useLocation()
	let navigate = useNavigate()
	const handleChange = (event: React.SyntheticEvent, newValue: string) => {

		navigate(newValue)
	};


	return (
		<Box sx={{ minWidth: "100%" }}>
			<AppBar position="static">
				<Container
					sx={{
						display: "flex",
						alignItems: "center",
						minHeight: "64px",
					}}
					maxWidth="md"
				>
					<Typography variant="h5">Note manager</Typography>
				</Container>
			</AppBar>
			<Container maxWidth="md" sx={{
				pt: 2,
				pb: 2
			}}>
				<Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
					<Tabs
						value={location.pathname.slice(1)}
						onChange={handleChange}
						aria-label="basic tabs example"
					>
						<Tab value="createEntry" label="Создать запись" {...a11yProps(0)} />
						<Tab value="entries" label="Записи" {...a11yProps(1)} />
					</Tabs>
				</Box>

				<Routes>
					<Route path="createEntry" element={<TabPanel index={0} value={0}><Form /></TabPanel>} />
					<Route path="entries" element={<TabPanel index={1} value={1}><Entries /></TabPanel>} />
					<Route index element={<Navigate replace to={"/createEntry"} />} />
				</Routes>
			</Container>
		</Box>
	);
};