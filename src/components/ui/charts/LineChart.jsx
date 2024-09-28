import { Line } from "react-chartjs-2"
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const LineChart = ({ chartDatasets = [], chartLabels = [], options = {} }) => {
	return (
		<Line
			options={{
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				...options
			}}
			data={{ labels: chartLabels, datasets: chartDatasets }}
		/>
	)
}

export default LineChart
