import type { Metadata } from "next"
import "./scss/index.scss"
import Header from "./components/Header"

export const metadata: Metadata = {
    title: "MP Bible"
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
    return (
        <html lang="pt-BR">
            <body>
                <Header />
                {children}
            </body>
        </html>
    )
}
