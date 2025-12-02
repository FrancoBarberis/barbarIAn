import { useState } from "react";
import {MainLayout} from "./layouts/MainLayout";
import {AuthLayout} from "./layouts/AuthLayout";
import "./App.css";

function App() {

	return (
		<div className="App">
			<MainLayout>
				{/* Aquí va el contenido principal de la aplicación */}
			</MainLayout>
		</div>
	);
}

export default App;
