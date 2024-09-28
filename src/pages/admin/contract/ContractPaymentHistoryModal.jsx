import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import PaymentHistoryTable from "components/ui/tables/PaymentHistoryTable"
import { useTranslation } from "react-i18next"

const ContractPaymentHistoryModal = (props) => {
	const { open, setOpen, data } = props
	const { t } = useTranslation()

	const handleClose = () => {
		setOpen(false)
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
			<DialogTitle id="payment-dialog-title">
				<span className="pr-5">
					{t("contract.modal.paymentHistory.title", { value: data?.name })}
				</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<div className="mt-2">
					{data?.id && (
						<PaymentHistoryTable
							dataPath={`dictionary/paymentscontract/${data?.id}`}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ContractPaymentHistoryModal
