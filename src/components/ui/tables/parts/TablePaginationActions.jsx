import { Box, IconButton } from "@mui/material"
import BaseTooltip from "components/ui/tooltips/BaseTooltip"
import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"

const TablePaginationActions = (props) => {
	const { count, page, rowsPerPage, onPageChange } = props
	const { t } = useTranslation()

	const handleFirstPageButtonClick = (event) => {
		onPageChange(event, 0)
	}

	const handleBackButtonClick = (event) => {
		onPageChange(event, page - 1)
	}

	const handleNextButtonClick = (event) => {
		onPageChange(event, page + 1)
	}

	const handleLastPageButtonClick = (event) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
	}

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<BaseTooltip title={t("common.pagination.firstPage")}>
				<span>
					<IconButton
						onClick={handleFirstPageButtonClick}
						disabled={page === 0}
						aria-label="first page"
					>
						<i className="bi bi-chevron-double-left" />
					</IconButton>
				</span>
			</BaseTooltip>
			<BaseTooltip title={t("common.pagination.prev")}>
				<span>
					<IconButton
						onClick={handleBackButtonClick}
						disabled={page === 0}
						aria-label="previous page"
					>
						<i className="bi bi-chevron-left" />
					</IconButton>
				</span>
			</BaseTooltip>
			<BaseTooltip title={t("common.pagination.next")}>
				<span>
					<IconButton
						onClick={handleNextButtonClick}
						disabled={page >= Math.ceil(count / rowsPerPage) - 1}
						aria-label="next page"
					>
						<i className="bi bi-chevron-right" />
					</IconButton>
				</span>
			</BaseTooltip>
			<BaseTooltip title={t("common.pagination.lastPage")}>
				<span>
					<IconButton
						onClick={handleLastPageButtonClick}
						disabled={page >= Math.ceil(count / rowsPerPage) - 1}
						aria-label="last page"
					>
						<i className="bi bi-chevron-double-right" />
					</IconButton>
				</span>
			</BaseTooltip>
		</Box>
	)
}

TablePaginationActions.propTypes = {
	count: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired
}

export default TablePaginationActions
