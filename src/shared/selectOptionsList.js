import CLIENT_TYPE from "./clientTypeList"
import CONTRACT_STATUS_TYPE from "./contractStatusTypeList"
import CURRENCY_TYPE from "./currencyTypeList"
import HOME_TYPE from "./homeTypeList"
import REPAIR_TYPE from "./repairTypeList"
import RESIDENT_TYPE from "./residentTypeList"

const clientTypeSelectOptions = [
	{
		code: CLIENT_TYPE.PHYSICAL.code,
		label: CLIENT_TYPE.PHYSICAL.label
	},
	{
		code: CLIENT_TYPE.LEGAL.code,
		label: CLIENT_TYPE.LEGAL.label
	}
]

const repairTypeSelectOptions = [
	{
		code: REPAIR_TYPE.REPAIRED.code,
		label: REPAIR_TYPE.REPAIRED.label
	},
	{
		code: REPAIR_TYPE.NOT_REPAIRED.code,
		label: REPAIR_TYPE.NOT_REPAIRED.label
	}
]

const residentTypeSelectOptions = [
	{
		code: RESIDENT_TYPE.RESIDENTIAL.code,
		label: RESIDENT_TYPE.RESIDENTIAL.label
	},
	{
		code: RESIDENT_TYPE.NON_RESIDENTIAL.code,
		label: RESIDENT_TYPE.NON_RESIDENTIAL.label
	}
]

const homeTypeSelectOptions = [
	{
		code: HOME_TYPE.ACTIVE.code,
		label: HOME_TYPE.ACTIVE.label,
		color: "success"
	},
	{
		code: HOME_TYPE.TIME.code,
		label: HOME_TYPE.TIME.label,
		color: "warning"
	},
	{
		code: HOME_TYPE.ORDERED.code,
		label: HOME_TYPE.ORDERED.label,
		color: "error"
	}
]

const currencyTypeSelectOptions = [
	{
		code: CURRENCY_TYPE.SUM.code,
		label: CURRENCY_TYPE.SUM.label
	},
	{
		code: CURRENCY_TYPE.VALUTE.code,
		label: CURRENCY_TYPE.VALUTE.label
	}
]

const contractStatusTypeSelectOptions = [
	{
		code: CONTRACT_STATUS_TYPE.ACTIVE.code,
		label: CONTRACT_STATUS_TYPE.ACTIVE.label
	},
	{
		code: CONTRACT_STATUS_TYPE.COMPLETE.code,
		label: CONTRACT_STATUS_TYPE.COMPLETE.label
	},
	{
		code: CONTRACT_STATUS_TYPE.CANCEL.code,
		label: CONTRACT_STATUS_TYPE.CANCEL.label
	}
]

export {
	clientTypeSelectOptions,
	repairTypeSelectOptions,
	residentTypeSelectOptions,
	homeTypeSelectOptions,
	currencyTypeSelectOptions,
	contractStatusTypeSelectOptions
}
