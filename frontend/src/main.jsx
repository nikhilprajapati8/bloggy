import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil"



const styles = {
	global: (props) => ({
		body: {
			color: mode("gray.800", "whiteAlpha.900")(props),
			bg: mode("gray.100", "#1f1f1f")(props),
		},
	}),
};

const config = {
	initialColorMode: "light",
	useSystemColorMode: true,
}

const theme = extendTheme({ styles, config })

ReactDOM.createRoot(document.getElementById('root')).render(

	
		<RecoilRoot>
			<BrowserRouter>
				<ChakraProvider theme={theme}>
					<App />
				</ChakraProvider>
			</BrowserRouter>
		</RecoilRoot>
	
)
