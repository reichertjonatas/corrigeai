export const getColorActivite = (competencia:any) => {
    switch (competencia) {
        case 2:
            return '#fb5400';
            break;
        case 3:
            return '#b5179e';
        case 4:
            return '#fcbe21';
        case 5:
            return '#8ac925';
        default:
            return '#3f37c9';
    }
}