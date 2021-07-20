import React from 'react'

interface MainLayoutProps {
    children: React.ReactElement[]
}

function MainLayout({ children } : MainLayoutProps) {
    return (
        <div>
            { children }
        </div>
    )
}

export default MainLayout
