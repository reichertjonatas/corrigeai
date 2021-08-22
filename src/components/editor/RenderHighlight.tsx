import React from "react";
import { Box } from "./Box";

export function RenderHighlight({ annotation, active }: any) {
    const { geometry } = annotation
    if (!geometry) return null

    var boxStyle: any = {
        border: 'solid 1px black',
        boxShadow: active
            && '0 0 20px 20px rgba(255, 255, 255, 0.3) inset'
    }

    var cor = 'red';

    switch (annotation.data.competencia) {
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

    switch (annotation.data.editorType) {
        case 2:
            boxStyle = {
                // borderRadius: '1rem',
                borderBottom: `solid 2px ${cor}`,
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                justifyContent: 'center',
                alignItems: 'center',
                color: cor,
                boxShadow: active && `0 0 12px 12px ${cor}90 inset`,
            }
            break;
        case 3:
            boxStyle = {
                borderRadius: '0.9rem',
                border: `solid 1px ${cor}`,
                backgroundColor: `${cor}90`,
                // padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: cor,
                boxShadow: active && `0 0 12px 12px ${cor}90 inset`,
            }
            break;

        default:
            boxStyle = {
                borderRadius: '1rem',
                // border: `solid 1px ${cor}`,
                backgroundColor: `${cor}90`,
                // padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                alignItems: 'center',
                color: cor,
                boxShadow: active && `0 0 12px 12px ${cor}90 inset`,
                '-webkit-text-stroke': '1.5px white'
            }
            break;
    }

    return (
        <Box
            key={annotation.data.id}
            geometry={geometry}
            style={boxStyle}
        >
            {annotation.data.editorType == 1 && 'X'}
        </Box>
    )
}