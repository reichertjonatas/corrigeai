export function RenderOverlay() {
    return (
        <div
            style={{
                background: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                padding: 5,
                pointerEvents: 'none',
                position: 'absolute',
                top: 5,
                left: 5,
                borderRadius: 8,
            }}
        >
            corrigeaí - {(new Date()).toLocaleDateString('pt')}
        </div>
    )
}