import React,{useEffect} from 'react'
import Image from 'next/image'
import { LogoLogin } from '../../components/icons'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Seo from '../../components/layout/Seo';

function AguardandoPagamento() {
    const router = useRouter();
    useEffect(() => {
        import('react-facebook-pixel')
          .then((x) => x.default)
          .then((ReactPixel) => {
            ReactPixel.init('389741909374975') // facebookPixelId
            ReactPixel.pageView()
            ReactPixel.track('Purchase')
    
            router.events.on('routeChangeComplete', () => {
              ReactPixel.pageView()
            })
          })
      }, [router.events])

    const { boletoUrl } = router.query;

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>

            <Seo title="Processando pagamento" />
            <div className="checkout">
                <div className="box">
                    <span className="logo">
                        <Image src={LogoLogin}  className="img-responsive" alt="CorrigeAi" />
                    </span>
                    <h1>Processando pagamento</h1>
                    <div className="caixa" style={{textAlign: 'center'}}>
                        <p>
                            Estamos processando seu pagamento! <br />
                            Receberá um e-mail com mais instruções.
                        </p>
                    </div>

                    { boletoUrl && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <span className="botaofinalizar" style={{ maxWidth: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
                            <Link href={`${boletoUrl}`} passHref><button type="submit" style={{ padding: 12 }}>IMPRIMIR BOLETO BANCÁRIO</button></Link>
                        </span>
                    </div>}
                </div>
            </div>
            <style jsx>
                {
                    `
                    body{background: #edeeee !important;}

                    .checkout{display: block; width: 100%; min-height: 100vh; align-items: center; justify-content: center; }
                    .checkout .box{display: block; width: 100%; max-width: 600px; margin: 0 auto;}
                    .checkout .box h1{display: block; width: 100%; font-size: 1.53rem; text-align: center; margin: 2rem 0; color: var(--dark)}
                    .checkout .box .logo{display: block; width: 100%; text-align: center; margin: 2rem 0;}
                    .checkout .box .caixa{display: block; width: 100%; background: #fff; padding: 2rem; border-radius: 1rem; box-shadow: 0px 0px 15px 0px rgb(0 0 0 / 15%); margin: 0 0 2rem}
                    .checkout .box .caixa h2:first-child{display: block; width: 100%; font-size: 1.3rem; margin: 0 0 1.5rem}
                    .checkout .box .caixa h2{display: block; width: 100%; font-size: 1.3rem; margin: 1.5rem 0; color: var(--dark)}
                    .checkout .box .caixa .head{display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem}
                    .checkout .box .caixa .head .box_list{display: flex; flex-direction: column}
                    .checkout .box .caixa .head .box_list .bold{display: block; width: 100%; font-weight: 500; color: var(--dark); font-size: 1.2rem; margin: 0 0 0.5rem}
                    .checkout .box .caixa .head .box_list .regular{display: block; width: 100%; font-weight: 400; color: #929292; font-size: 0.9rem}
                    .checkout .box .caixa .form{display: block; width: 100%;}
                    .checkout .box .caixa .form .grid{display: grid; grid-template-columns: 1fr 1fr; gap: 1rem}
                    .checkout .box .caixa .form .grid .input{display: flex; flex-direction: column; width: 100%}
                    .checkout .box .caixa .form .grid .input input{margin: 0}
                    .checkout .box .caixa .form label{display: block; width: 100%; color: #495057}
                    .checkout .box .caixa .form input{display: block; width: 100%; border: 1px solid #ced4da; padding: .575rem .75rem; border-radius: 0.3rem; font-size: 0.9rem; color: var(--dark); margin: 0 0 1rem}
                    .checkout .box .caixa .form select{display: block; width: 100%; -webkit-appearance:none; border: 1px solid #ced4da; padding: .575rem .75rem; border-radius: 0.3rem; font-size: 0.9rem; color: var(--dark); margin: 0 0 1rem}

                    .hide_payment{display: none}

                    .botaofinalizar{display: block; width: 100%; margin: 0 0 4rem;}
                    .botaofinalizar button{cursor: pointer; border:none;  display: flex;border-radius: 0.5rem; max-width: 200px; align-items: center; justify-content: center; height: 40px; background: var(--green); color: var(--white);}
                    .botaofinalizar button:hover{cursor: pointer; border:none; background: var(--dark)}

                    .check{display: block; width: 100%; margin: 1rem 0}

                    .wrapper{
                    display: inline-flex;
                    height: 100px;
                    width: 100%;
                    align-items: center;
                    justify-content: space-evenly;
                    border-radius: 5px;
                    }
                    .wrapper .option{
                    background: #fff;
                    height: 4rem;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-evenly;
                    margin: 0 1rem 0 0;
                    border-radius: 5px;
                    cursor: pointer;
                    padding: 0 10px;
                    border: 2px solid lightgrey;
                    transition: all 0.3s ease;
                    }
                    .wrapper .option:last-child{
                        margin: 0
                    }
                    .wrapper .option .dot{
                    height: 20px;
                    width: 20px;
                    background: #d9d9d9;
                    border-radius: 50%;
                    position: relative;
                    }
                    .wrapper .option .dot::before{
                    position: absolute;
                    content: "";
                    top: 4px;
                    left: 4px;
                    width: 12px;
                    height: 12px;
                    background: var(--green);;
                    border-radius: 50%;
                    opacity: 0;
                    transform: scale(1.5);
                    transition: all 0.3s ease;
                    }
                    input[type="radio"]{
                    display: none;
                    }
                    #option-1:checked:checked ~ .option-1,
                    #option-2:checked:checked ~ .option-2{
                    border-color: var(--green);;
                    background: var(--green);;
                    }
                    #option-1:checked:checked ~ .option-1 .dot,
                    #option-2:checked:checked ~ .option-2 .dot{
                    background: #fff;
                    }
                    #option-1:checked:checked ~ .option-1 .dot::before,
                    #option-2:checked:checked ~ .option-2 .dot::before{
                    opacity: 1;
                    transform: scale(1);
                    }
                    .wrapper .option span{
                    font-size: 1rem;
                    color: #808080;
                    }
                    #option-1:checked:checked ~ .option-1 span,
                    #option-2:checked:checked ~ .option-2 span{
                    color: #fff;
                    }
                    `
                }
            </style>
        </div>
    )
}

export default AguardandoPagamento
