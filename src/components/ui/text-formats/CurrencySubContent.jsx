import React from "react"
import CurrencyFormat from "./CurrencyFormat"
import useCurrency from "hooks/useCurrency"
import { fadeUp } from "utils/motion"
import { motion } from "framer-motion"

const CurrencySubContent = ({ value = "0", delay = 0, decimalScale = 1 }) => {
	const { currencyData } = useCurrency()
	return (
		currencyData &&
		currencyData.sum && (
			<motion.div
				className="currency-price-sub-content"
				delay={delay}
				variants={fadeUp(30, "tween", delay, 0.5)}
				initial="hidden"
				animate="show"
				viewport={{ once: true, amount: 0.25 }}
			>
				=
				<CurrencyFormat
					value={parseFloat(currencyData.sum * parseFloat(value || "0"))}
					className="ml-1"
					decimalScale={decimalScale}
				/>
			</motion.div>
		)
	)
}

export default CurrencySubContent
