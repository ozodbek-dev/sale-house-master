import React from "react"
import { motion } from "framer-motion"
import { textVariant } from "utils/motion"

export const SectionTitleText = ({ title, textStyles, duration = 0.15 }) => (
	<p className={textStyles}>
		{Array.from(title).map((letter, index) => (
			<motion.span
				variants={textVariant(index * (duration / Array.from(title).length))}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.25 }}
				key={index}
			>
				{letter === " " ? "\u00A0" : letter}
			</motion.span>
		))}
	</p>
)
