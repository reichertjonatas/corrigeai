export function RenderEditor(props: any) {
    const { geometry } = props.annotation
    if (!geometry) return null

    var cor = 'black';
    var nomeCompetencia = '';

    switch (props.annotation.data.competencia) {
        case 2:
            cor = '#fb5400';
            break;
        case 3:
            cor = '#b5179e';
            break;
        case 4:
            cor = '#fcbe21';
            break;
        case 5:
            cor = '#8ac925';
            break;
        default:
            cor = '#3f37c9';
            break;
    }

    switch (props.annotation.data.competencia) {
        case 2:
            nomeCompetencia = 'Competência II';
            break;
        case 3:
            nomeCompetencia = 'Competência III';
            break;
        case 4:
            nomeCompetencia = 'Competência IV';
            break;
        case 5:
            nomeCompetencia = 'Competência V';
            break;
        default:
            nomeCompetencia = 'Competência I';
            break;
    }

    const inputStyle = {
        "&:focus": { outline: "none" },
        borderRadius: '0.25rem',
        border: 'none',
        padding: '0.2rem 0.4rem',
        minWidth: '100%',
        fontSize: '0.8rem'
    };

    return (
        <div
            style={{
                background: 'white',
                padding: 10,
                marginTop: 4,
                boxShadow: '7px 7px 5px 0px rgba(50, 50, 50, 0.75); inset',
                backgroundColor: cor,
                borderRadius: 6,
                position: 'absolute',
                left: `${geometry.x}%`,
                top: `${geometry.y + geometry.height}%`,
            }}
        >
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'start', color: 'white' }}>{nomeCompetencia}</div>
            <div style={{ fontSize: '0.75rem', color: 'white' }}>Descreva o motivo da nota:</div>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
                <textarea
                    rows={4}
                    cols={30}
                    style={inputStyle}
                    onChange={e => props.onChange({
                        ...props.annotation,
                        data: {
                            ...props.annotation.data,
                            text: e.target.value
                        }
                    })}
                />
            </div>
            <div style={{ textAlign: 'center' }}>
                <button style={{
                    padding: 2,
                    minWidth: '50%',
                    borderRadius: '0.5rem',
                    backgroundColor: `white`,
                    border: '1px solid white',
                    color: cor,
                    //textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    'fontFamily': "Poppins, sans-serif"

                }} onClick={props.onSubmit}>Salvar</button>
            </div>
        </div>
    )
}