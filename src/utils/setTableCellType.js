import { Chip } from "@mui/material"
import { Stack } from "@mui/system"
import moment from "moment"
import { Link } from "react-router-dom"
import { NumericFormat } from "react-number-format"
import { Trans } from "react-i18next"
import i18n from "config/i18n"

const setTableCellType = (column, item, row) => {
	switch (column.type) {
		case "array": {
			return (
				<Stack direction="column" spacing={1}>
					{item.map((item, itemIndex) => (
						<Chip
							label={item}
							variant="tableBadge"
							key={`${column.code}-item-${itemIndex}`}
							color="primary"
						/>
					))}
				</Stack>
			)
		}
		case "date": {
			return moment(item).format("DD/MM/YYYY")
		}
		case "dateTime": {
			return moment(item).format("DD/MM/YYYY HH:mm")
		}
		case "status": {
			return item ? (
				<Chip label={column.label.true} variant="tableBadge" color="success" />
			) : (
				<Chip label={column.label.false} variant="tableBadge" color="primary" />
			)
		}
		case "customStatus": {
			if (column.variants && column.variants.length > 0 && !isNaN(item)) {
				let result = column.variants.filter((variant) => variant.code === item)
				if (result.length > 0) {
					return (
						<Chip
							label={i18n.t(result[0].label)}
							variant="tableBadge"
							color={result[0].color}
						/>
					)
				}
			}
			return ""
		}
		case "code": {
			return <code>{item}</code>
		}
		case "badge": {
			return <Chip label={item} variant="tableBadge" color="info" />
		}
		case "textLimit": {
			return <div className="text-line-[4]">{item}</div>
		}
		case "html": {
			return (
				<div
					className="html-content"
					dangerouslySetInnerHTML={{ __html: item }}
				/>
			)
		}
		case "price": {
			return (
				<NumericFormat
					value={item}
					displayType={"text"}
					allowNegative={false}
					thousandSeparator={" "}
					decimalScale={3}
					className="bg-transparent whitespace-nowrap"
					suffix={" UZS"}
				/>
			)
		}
		case "priceCurrency": {
			return (
				<NumericFormat
					value={(parseFloat(item) * 10) % 10 > 0 ? item : parseInt(item)}
					displayType={"text"}
					allowNegative={false}
					thousandSeparator={" "}
					decimalScale={1}
					className="bg-transparent whitespace-nowrap"
					suffix={row?.isvalute === "1" ? " $" : " UZS"}
				/>
			)
		}
		case "area": {
			if (item) {
				return (
					<span className="whitespace-nowrap">
						<NumericFormat
							value={item}
							displayType={"text"}
							allowNegative={false}
							thousandSeparator={""}
							decimalScale={2}
							className="bg-transparent whitespace-nowrap"
						/>{" "}
						<Trans i18nKey="common.global.meter">
							m<sup>2</sup>
						</Trans>
					</span>
				)
			}
			return ""
		}
		case "link": {
			return (
				<code>
					<Link to={item} target="_blank">
						{item}
					</Link>
				</code>
			)
		}
		case "multiply": {
			return column.childStrings.reduce((acc, el, index) => {
				let value = el
					? !isNaN(getObjField(row[column.fields[index]], el))
						? parseInt(getObjField(row[column.fields[index]], el))
						: 1
					: parseInt(row[column.fields[index]])
				return acc * value
			}, 1)
		}
		case "nested": {
			return getObjField(item, column.childStr)
		}
		case "nestedChain": {
			return column.childStrings
				.map((el) => {
					return getObjField(item, el)
				})
				.join(" ")
		}
		default: {
			return null
		}
	}
}

function getField(obj, field) {
	return obj[field]
}

function getObjField(obj, str) {
	if (obj) {
		let a = str.split(".")
		let b = obj
		for (let i = 0; i < a.length; i++) {
			b = getField(b, a[i])
		}
		return b
	}
	return ""
}

export default setTableCellType
