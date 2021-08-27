import React from 'react'

const RowObsEnem = ({ item, ...rest }: any) => {
    return (
        <>
            {item.section && <span className="number">{item.section}</span>}
            <span className="text">{item.text}</span>
            <style global jsx>
                {`
                    .popCompetencia {
                        display: flex;
                        flex-direction: row;
                        background: #c3ddea;
                        align-items: center;
                        margin: 1rem 0;
                        min-height: 80px;
                    }

                    .popCompetencia span {
                        align-self: stretch;
                        display: flex;
                        align-items: center;
                    }
                    
                    .popCompetencia .number{
                      display: flex;
                      flex: 1;
                      font-weight: 700;
                      font-size: 1.2rem;
                      padding: 1rem 0.5rem;
                      justify-content: center;
                    }
                    
                    .popCompetencia .text{
                      display: flex;
                      flex: 5;
                      font-weight: 300;
                      font-size: 0.8rem;
                      padding: 1rem 0.5rem;
                      border-right: 2px solid #fff;
                      border-left: 2px solid #fff;
                    }
                    
                    .popCompetencia .divisor{
                      display: flex;
                      flex: 1;
                      font-weight: 700;
                      font-size: 1.2rem;
                      padding: 1rem 0.5rem;
                      justify-content: center;
                    }
                    
                    .popCompetencia .text:last-child{
                      border-right: none;
                    }
                    
                    .ciano{background: #dfbad6;}
                    .blue{background: #dfeef5;}
                    .green{background: #cde1d4;}
                    .orange{background: #f8d2c5;}
                    .pink{background: #f9e2e8;}
                    `}
            </style>
        </>
    )
}

export default RowObsEnem
