import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Robinson Suites Parking',
  description: 'Real-time parking system status for Robinson Suites',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer with Legal Links */}
        <footer className="mt-auto py-6 px-4 border-t bg-white">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center items-center gap-4 text-xs text-gray-500 mb-3">
              <Link href="/terms" className="hover:text-gray-700 hover:underline transition-colors">
                Terms
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/privacy" className="hover:text-gray-700 hover:underline transition-colors">
                Privacy
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/disclaimer" className="hover:text-gray-700 hover:underline transition-colors">
                Disclaimer
              </Link>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Robinson Suites Parking Assistant
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Unofficial community tool • Not affiliated with building management
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
