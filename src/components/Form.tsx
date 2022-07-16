import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, LinearProgress, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { FC, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useDispatch } from "react-redux";
import { actions, getEntries, getTimezones, saveEntry } from "../app/reducers";
import { useAppDispatch, useTypesSelector } from "../app/redux-store";
import { formApi } from "../packages/storage/index"
import SendIcon from '@mui/icons-material/Send';
import { ManageAlerts } from "./ManageAlerts";

let testForm: {
	getFormData: () => ICacheFormData;
	setFormData: (formData: ICacheFormData) => void;
} = formApi

export interface ICacheFormData {
	selectTz: string
	sign: string
}

interface formData {
	selectTz: string
	sign: string
	text: string
}



export let Form: FC = () => {
	let { register, reset, handleSubmit, control } = useForm<formData>({ defaultValues: formApi.getFormData() })
	let dispatch = useAppDispatch()
	let [successAlert, setSuccessAlert] = useState<null | string>(null)

	let onSubmit = async (data: formData) => {
		let CacheFormData: ICacheFormData = { selectTz: data.selectTz, sign: data.sign }
		formApi.setFormData(CacheFormData)
		let action = await dispatch(saveEntry(data.text, data.sign, data.selectTz))
		if (!action.payload.error) {
			reset()
			setSuccessAlert("Новая запись успешно сохранена")
		}
	}


	let timezones = useTypesSelector(state => state.timeZones)
	let pendingGetTz = useTypesSelector(state => state.pendingGetTz)
	let errorSave = useTypesSelector(state => state.errorSaveEntry)
	let errorGetTz = useTypesSelector(state => state.errorGetTz)

	useEffect(() => {
		let id: NodeJS.Timeout
		let cleanErr = () => setSuccessAlert(null)
		if (successAlert) {
			id = setTimeout(() => cleanErr(), 3000)
		}
		return () => {
			if (id) clearTimeout(id)
			if (successAlert) cleanErr()
		}
	}, [successAlert])

	useEffect(() => {
		dispatch(getTimezones())
	}, [])

	useEffect(() => {
		let id: NodeJS.Timeout
		let cleanErr = () => dispatch(actions.setSaveEntryError(null))
		if (errorSave) {
			id = setTimeout(() => cleanErr(), 3000)
		}
		return () => {
			if (id) clearTimeout(id)
			if (errorSave) cleanErr()
		}
	}, [errorSave])

	useEffect(() => {
		let id: NodeJS.Timeout
		let cleanErr = () => dispatch(actions.setGetTzError(null))
		if (errorGetTz) {
			id = setTimeout(() => cleanErr(), 3000)
		}
		return () => {
			if (id) clearTimeout(id)
			if (errorGetTz) cleanErr()
		}
	}, [errorGetTz])

	return <Box
		onSubmit={handleSubmit(onSubmit)}
		component="form" sx={{
			position: "relative",
			display: "flex",
			flexWrap: "wrap",
			padding: 1,
			...(!timezones ? {
				alignItems: "center",
				justifyContent: "center"
			} : {})
		}}>

		<ManageAlerts>
			{successAlert && <Alert
				variant="filled"
				severity="success">
				{successAlert}
			</Alert>}

			{errorSave && <Alert
				variant="filled"
				severity="error">
				{errorSave}
			</Alert>}

			{errorGetTz && <Alert
				variant="filled"
				severity="error">
				{errorGetTz}
			</Alert>}
		</ManageAlerts>

		{(!timezones || pendingGetTz) && <Box sx={{
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			backgroundColor: "#6060609e",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 10,
			borderRadius: 1,
		}}>
			<CircularProgress />
		</Box>}

		<TextField
			sx={{ flex: "1 1 auto", mb: 2 }}
			label="Запись"
			multiline
			rows={6}
			fullWidth
			{...register("text")}
		/>

		<TextField
			sx={{
				flex: {
					xs: "0 1 70%"
				},
				"> div": {
					marginRight: 1
				}
			}}
			{...register("sign")}
			label="Required"
		/>

		<Box sx={{
			flex: {
				xs: "0 1 30%"
			}
		}}>
			<Controller
				control={control}
				name="selectTz"
				render={({ field: { ref, onChange, ...rest } }) => (
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Точное время по</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							label="Точное время по"
							onChange={(e) => onChange(e.target.value)}
							{...rest}
						>
							{timezones?.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
						</Select>
					</FormControl>
				)}
			/>
		</Box>

		<Button
			sx={{ ml: "auto", mt: 1 }}
			variant="contained"
			endIcon={<SendIcon />}
			type="submit"
		>Создать</Button>
	</Box>
}