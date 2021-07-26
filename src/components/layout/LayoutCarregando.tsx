import React from 'react'
import MainLayout from './MainLayout'
interface CarregandoProps {
    isDashboard?: boolean;
}
function LayoutCarregando({isDashboard = false } : CarregandoProps) {
    return ( isDashboard ? 
        (<MainLayout> <h1>Carregando...</h1></MainLayout>)
            : 
        (
            <div style={{"background" : "var(--green) !important", minHeight: "100vh", minWidth: "100vw",display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                <h1>Carregando...</h1>
            </div>
        ) 
    )
}

export default LayoutCarregando
