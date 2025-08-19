import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { ProjectsProvider } from "@/lib/contexts/projects-context"
import { ActiveProjectProvider } from "@/lib/contexts/active-project-context"
import { SettingsProvider } from "@/lib/contexts/settings-context"
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
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body className="font-sans antialiased">
        <SettingsProvider>
          <ProjectsProvider>
            <ActiveProjectProvider>{children}</ActiveProjectProvider>
          </ProjectsProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
