import React from 'react'

function LayoutCarregando() {
    return (
        <div style={{"background" : "var(--green) !important", minHeight: "100vh", minWidth: "100vw",display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
            <h1>Carregando...</h1>
        </div>
    )
}

export default LayoutCarregando
