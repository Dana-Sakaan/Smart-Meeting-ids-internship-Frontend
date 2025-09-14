import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://localhost:5257',
=======
        target: 'https://smartmeeting20250913230032.azurewebsites.net',
>>>>>>> 5973c6c5332ffdab1997f188a950486b8b328641
        changeOrigin: true,
      }
    }
  }
})
