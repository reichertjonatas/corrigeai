import React from 'react'
import PreLoader from '../PreLoader'
import MainLayout from './MainLayout'
interface CarregandoProps {
    isDashboard?: boolean;
}
function LayoutCarregando({isDashboard = false } : CarregandoProps) {
    return ( isDashboard ? 
        (<MainLayout> 
            <PreLoader />
        </MainLayout>)
            : 
        (
            <div style={{"background" : "var(--green) !important", height: "100vh", width: "100vw",display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                <PreLoader />
            </div>
        ) 
    )
}

export default LayoutCarregando
