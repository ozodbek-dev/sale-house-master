import { Bar } from "react-chartjs-2"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
} from "chart.js"
import "chart.js/auto"
import { numericFormatter } from "react-number-format"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart = ({ chartDatasets = [], chartLabels = [] }) => {
	return (
		<Bar
			options={{
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					xAxis: {
						ticks: {
							color: "black"
						}
					},
					yAxis: {
						ticks: {
							color: "black",
							callback: function (value) {
								return numericFormatter(value.toString(), {
									decimalScale: 3,
									thousandSeparator: " ",
									allowNegative: false,
									suffix: " UZS"
								})
							}
						}
					}
				}
			}}
			data={{ labels: chartLabels, datasets: chartDatasets }}
		/>
	)
}

export default BarChart
