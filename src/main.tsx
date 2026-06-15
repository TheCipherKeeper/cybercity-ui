import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from '@/app/providers/Root'
import App from '@/app/App'
import '@/app/styles/index.css'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <Root>
      <App />
    </Root>
  </StrictMode>,
)
