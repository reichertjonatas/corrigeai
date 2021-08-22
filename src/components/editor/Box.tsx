export const Box = ({ children, geometry, style }: any) => (
    <div style={{
        ...style,
        position: 'absolute',
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        height: `${geometry.height}%`,
        width: `${geometry.width}%`,
    }}>{children}</div>
)