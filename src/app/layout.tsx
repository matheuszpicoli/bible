import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Bíblia"
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
    return (
        <html lang="pt-BR">
            <body>
                {children}
            </body>
        </html>
    )
}
