import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton
} from "@mui/material"
import usePrevNext from "hooks/usePrevNext"
import React from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const ContractDocumentDownloadModal = (props) => {
	const { open, setOpen, data: contractData } = props
	const { t } = useTranslation()
	const { prev } = usePrevNext()

	const handleClose = () => {
		setOpen(false)
		prev()
	}
	const handleBack = () => {
		setOpen(false)
		prev()
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="lg"
			disableEscapeKeyDown={true}
		>
			<DialogTitle id="alert-dialog-title">
				<span className="pr-5">
					{t("contract.modal.documentDownload.title", {
						value: contractData?.name
					})}
				</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<dir className="flex flex-row justify-center">
					<Link
						to={`${process.env.REACT_APP_BACKEND_URL}/doc/${contractData?.id}`}
						className="mr-2 no-underline"
						onClick={prev}
					>
						<Button color="primary" variant="contained" fullWidth>
							<span className="leading-5 whitespace-nowrap">
								{t("contract.modal.documentDownload.uzbekContract")}
							</span>
						</Button>
					</Link>
					<Button color="inherit" variant="contained" onClick={handleBack}>
						<span className="leading-5">
							{t("contract.modal.documentDownload.homePage")}
						</span>
					</Button>
				</dir>
			</DialogContent>
		</Dialog>
	)
}

export default ContractDocumentDownloadModal
