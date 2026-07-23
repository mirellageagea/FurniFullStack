import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// KEY PIECE OF THE "ONE PROJECT" SETUP:
// `npm run build` here does NOT produce a local dist/ folder — it writes
// straight into ../FurniAPI/wwwroot, which is the same wwwroot ASP.NET
// already serves static files (and product images) from. That's what makes
// "run FurniAPI in Visual Studio" show the actual website afterward.
//
// emptyOutDir: false so a rebuild never wipes wwwroot/images/products
// (the folder where uploaded product photos live).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    outDir: '../FurniAPI/wwwroot',
    emptyOutDir: false
  }
})
