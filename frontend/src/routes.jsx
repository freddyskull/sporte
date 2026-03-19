import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { Inicio } from './pages/Inicio'
import { Tecnicos } from './pages/Tecnicos'
import { Departamentos } from './pages/Departamentos'
import { Historial } from './pages/Historial'
import { EstadisticasTecnicosPage } from './pages/EstadisticasTecnicosPage'
import { Mapa } from './pages/Mapa'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Inicio />,
  },
  {
    path: "/tecnicos",
    element: <Tecnicos />,
  },
  {
    path: "/departamentos",
    element: <Departamentos />,
  },
  {
    path: "/historial",
    element: <Historial />,
  },
  {
    path: "/estadisticas-tecnicos",
    element: <EstadisticasTecnicosPage />,
  },
  {
    path: "/mapa",
    element: <Mapa />,
  },
])

export default router