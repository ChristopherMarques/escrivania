import type React from "react"
import type { Metadata } from "next"
import { 
  Inter, 
  Poppins, 
  Roboto, 
  Open_Sans, 
  Lato, 
  Montserrat, 
  Playfair_Display, 
  Merriweather, 
  Crimson_Text, 
  Libre_Baskerville 
} from "next/font/google"
import { ProjectsProvider } from "@/lib/contexts/projects-context"
import { ActiveProjectProvider } from "@/lib/contexts/active-project-context"
import { SettingsProvider } from "@/lib/contexts/settings-context"
import { ReactQueryProvider } from "@/lib/react-query"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-merriweather",
})

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-crimson-text",
})

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-libre-baskerville",
})

export const metadata: Metadata = {
  title: "Escrivania Digital - Hub Criativo para Escritores",
  description: "Plataforma completa para escritores brasileiros organizarem e criarem suas obras",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="pt-BR" 
      className={`
        ${inter.variable} 
        ${poppins.variable} 
        ${roboto.variable} 
        ${openSans.variable} 
        ${lato.variable} 
        ${montserrat.variable} 
        ${playfairDisplay.variable} 
        ${merriweather.variable} 
        ${crimsonText.variable} 
        ${libreBaskerville.variable} 
        antialiased
      `}
    >
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <SettingsProvider>
            <ProjectsProvider>
              <ActiveProjectProvider>{children}</ActiveProjectProvider>
            </ProjectsProvider>
          </SettingsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
