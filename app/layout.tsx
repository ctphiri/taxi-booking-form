import './globals.css'

export const metadata = {
  title: 'Prenota un Taxi',
  description: 'Sistema di prenotazione taxi online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
