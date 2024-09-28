import RESIDENT_TYPE from "./residentTypeList"
import CLIENT_TYPE from "./clientTypeList"
import HOME_TYPE from "./homeTypeList"
import ORDER_TYPE from "./orderTypeList"
import PAYMENT_TYPE from "./paymentTypeList"
import REPAIR_TYPE from "./repairTypeList"
import ROLE_TYPE_LIST from "./roleTypeList"

const clientTypeVariants = [
	{
		code: CLIENT_TYPE.PHYSICAL.code,
		label: CLIENT_TYPE.PHYSICAL.label,
		color: "secondary"
	},
	{
		code: CLIENT_TYPE.LEGAL.code,
		label: CLIENT_TYPE.LEGAL.label,
		color: "warning"
	}
]

const repairTypeVariants = [
	{
		code: REPAIR_TYPE.REPAIRED.code,
		label: REPAIR_TYPE.REPAIRED.label,
		color: "success"
	},
	{
		code: REPAIR_TYPE.NOT_REPAIRED.code,
		label: REPAIR_TYPE.NOT_REPAIRED.label,
		color: "warning"
	}
]

const residentTypeVariants = [
	{
		code: RESIDENT_TYPE.RESIDENTIAL.code,
		label: RESIDENT_TYPE.RESIDENTIAL.label,
		color: "success"
	},
	{
		code: RESIDENT_TYPE.NON_RESIDENTIAL.code,
		label: RESIDENT_TYPE.NON_RESIDENTIAL.label,
		color: "warning"
	}
]

const homeTypeVariants = [
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
	},
	{
		code: HOME_TYPE.DISABLED.code,
		label: HOME_TYPE.DISABLED.label,
		color: "default"
	}
]

const paymentTypeVariants = [
	{
		code: PAYMENT_TYPE.CASH.code,
		label: PAYMENT_TYPE.CASH.label,
		color: "success"
	},
	{
		code: PAYMENT_TYPE.P2P.code,
		label: PAYMENT_TYPE.P2P.label,
		color: "info"
	},
	{
		code: PAYMENT_TYPE.BANK.code,
		label: PAYMENT_TYPE.BANK.label,
		color: "warning"
	},
	{
		code: PAYMENT_TYPE.CARD.code,
		label: PAYMENT_TYPE.CARD.label,
		color: "secondary"
	},
	{
		code: PAYMENT_TYPE.ACT.code,
		label: PAYMENT_TYPE.ACT.label,
		color: "error"
	}
]

const orderTypeVariants = [
	{
		code: ORDER_TYPE.NEW.code,
		label: ORDER_TYPE.NEW.label,
		color: "success"
	},
	{
		code: ORDER_TYPE.ORDERED.code,
		label: ORDER_TYPE.ORDERED.label,
		color: "warning"
	},
	{
		code: ORDER_TYPE.CANCELLED.code,
		label: ORDER_TYPE.CANCELLED.label,
		color: "error"
	}
]

const roleTypeVariants = [
	{
		code: ROLE_TYPE_LIST.ADMIN.code,
		label: ROLE_TYPE_LIST.ADMIN.label,
		color: "secondary"
	},
	{
		code: ROLE_TYPE_LIST.ACCOUNTER.code,
		label: ROLE_TYPE_LIST.ACCOUNTER.label,
		color: "warning"
	},
	{
		code: ROLE_TYPE_LIST.BOSS.code,
		label: ROLE_TYPE_LIST.BOSS.label,
		color: "error"
	},
	{
		code: ROLE_TYPE_LIST.MANAGER.code,
		label: ROLE_TYPE_LIST.MANAGER.label,
		color: "success"
	},
	{
		code: ROLE_TYPE_LIST.OPERATOR.code,
		label: ROLE_TYPE_LIST.OPERATOR.label,
		color: "primary"
	}
]

export {
	clientTypeVariants,
	repairTypeVariants,
	residentTypeVariants,
	homeTypeVariants,
	paymentTypeVariants,
	orderTypeVariants,
	roleTypeVariants
}
