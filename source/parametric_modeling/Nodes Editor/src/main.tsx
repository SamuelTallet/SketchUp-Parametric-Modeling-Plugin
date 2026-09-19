import './polyfills'
import './styles/index.css'

import { createRoot } from 'react-dom/client'

import { installPublicApi } from './api/PublicApi'
import { App } from './components/App'

installPublicApi()

const container = document.getElementById('root')

if (!container) {
  throw new Error('Nodes Editor root element is missing.')
}

createRoot(container).render(<App />)
