import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Robinson Suites Parking',
  description: 'Real-time parking system status for Robinson Suites',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {children}
        {/* We'll add Navigation back after it's fixed */}
      </body>
    </html>
  )
}