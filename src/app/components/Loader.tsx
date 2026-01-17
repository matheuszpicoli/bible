import React from "react"

export default function Loader(): React.JSX.Element {
    return (
        <div className="loader">
            <div className="spinner"></div>
            Carregando...
        </div>
    )
}
