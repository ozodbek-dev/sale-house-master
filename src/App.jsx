import { ThemeProvider, createTheme } from "@mui/material"
import { SnackbarProvider } from "notistack"
import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { RouterProvider } from "react-router-dom"
import router from "routes/router"
import { lightMode } from "utils/customTheme"

function App() {
	const lightTheme = createTheme(lightMode)
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false
			}
		}
	})

	const snackBarOptions = {
		iconVariant: {
			error: (
				<i className="bi bi-x-octagon" style={{ marginInlineEnd: "8px" }} />
			)
		},
		maxSnack: 3
	}

	return (
		<ThemeProvider theme={lightTheme}>
			<QueryClientProvider client={queryClient}>
				<SnackbarProvider {...snackBarOptions}>
					<RouterProvider router={router} />
				</SnackbarProvider>
			</QueryClientProvider>
		</ThemeProvider>
	)
}

export default App
