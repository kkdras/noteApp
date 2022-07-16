import { Alert, Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { FC, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { actions, createEntry, getTimezones } from "../app/reducers";
import { useAppDispatch, useTypesSelector } from "../app/redux-store";
import { formApi } from "../packages/storage/index"
import SendIcon from '@mui/icons-material/Send';
import { ManageAlerts } from "./ManageAlerts";
import LoadingButton from "@mui/lab/LoadingButton";

let testFormApi: {
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
		let action = await dispatch(createEntry(data.text, data.sign, data.selectTz))
		if (!action.payload.error) {
			reset()
			setSuccessAlert("Новая запись успешно сохранена")
		}
	}


	let timezones = useTypesSelector(state => state.timeZones)
	let pendingGetTz = useTypesSelector(state => state.pendingGetTz)
	let pendingSaveEntry = useTypesSelector(state => state.pendingSaveEntry)
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
			flexWrap: "wrap"
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

		<TextField
			disabled={pendingGetTz || pendingSaveEntry}
			sx={{ flex: "1 1 auto", mb: 2 }}
			label="Запись"
			multiline
			rows={6}
			fullWidth
			{...register("text")}
		/>

		<TextField
			disabled={pendingGetTz || pendingSaveEntry}
			sx={{
				flex: {
					xs: "1 1 auto",
					md: "0 1 70%"
				},
				"> div": {
					marginRight: {
						md: 1
					}
				},
				mb: {
					xs: 2,
					md: 0
				}
			}}
			{...register("sign")}
			label="Required"
		/>

		<Box sx={{

			flex: {
				xs: "1 1 100%",
				md: "0 1 30%"
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
							disabled={pendingGetTz || pendingSaveEntry}
							onChange={(e) => onChange(e.target.value)}
							{...rest}
						>
							{timezones?.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
						</Select>
					</FormControl>
				)}
			/>
		</Box>

		<LoadingButton
			sx={{ ml: "auto", mt: 1 }}
			variant="contained"
			loadingPosition="end"
			loading={(!timezones || pendingGetTz || pendingSaveEntry)}
			endIcon={<SendIcon />}
			type="submit"
		>Создать</LoadingButton>

	</Box>
}