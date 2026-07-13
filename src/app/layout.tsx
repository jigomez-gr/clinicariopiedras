import type { Metadata } from 'next'
import { Fraunces, Instrument_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
    subsets: ['latin'],
    variable: '--font-fraunces',
    display: 'swap',
})

const instrumentSans = Instrument_Sans({
    subsets: ['latin'],
    variable: '--font-instrument-sans',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Clínica Dental Ríos Piedras · Cuatro décadas cuidando tu sonrisa en Madrid',
    description: 'Odontología moderna, cercana y basada en evidencia científica. En el corazón del Pasillo Verde, tecnología de última generación con el trato de barrio de toda la vida.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" className={`${fraunces.variable} ${instrumentSans.variable}`}>
            <body>{children}</body>
        </html>
    )
}
