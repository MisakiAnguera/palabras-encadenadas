import { Fragment, useEffect, useState } from 'react';
import { Block, Button, Columns, Container, Heading, Hero } from 'react-bulma-components';
import Layout from '../components/layout';

export default function Main() {
    const [sesionado, setSesionado] = useState(false);
    useEffect(() => setSesionado(sessionStorage.getItem("token")), []);
    return (
        <Layout>
            <Columns breakpoint="desktop" mx="0">
                <Columns.Column desktop={{ narrow: true }}>
                    <Hero size="medium">
                        <Hero.Body>
                            <Container>
                                <Heading size={1} spaced>
                                    Encadena palabras con&nbsp;
                                    <ruby title="kanji">
                                        漢
                                        <rp>(</rp>
                                        <rt>かん</rt>
                                        <rp>)</rp>
                                        字
                                        <rp>(</rp>
                                        <rt>じ</rt>
                                        <rp>)</rp>
                                    </ruby>
                                    .
                                </Heading>
                                <Heading size={3} subtitle>
                                    大学・学校・校長・長袖
                                </Heading>
                            </Container>
                        </Hero.Body>
                    </Hero>
                </Columns.Column>
                <Columns.Column my="auto" mx="5">
                    {!sesionado && <Fragment>
                        <Block>
                            <Heading mb="2" subtitle tablet={{ textSize: "4" }} mobile={{ textSize: "5" }}>
                                Empieza a encadenar palabras con 漢字.
                            </Heading>
                            <Button renderAs="a" href="/cuenta/inicio-sesion" className='is-responsive' color="primary" colorVariant="light" fullwidth size="large">
                                Iniciar sesión
                            </Button>
                        </Block>
                        <Block>
                            <Heading mb="2" subtitle tablet={{ textSize: "4" }} mobile={{ textSize: "5" }}>
                                ¿Aún no tienes cuenta? Crea una.
                            </Heading>
                            <Button renderAs="a" href="/cuenta/registro" className='is-responsive' color="primary" fullwidth size="large">
                                Registrarse
                            </Button>
                        </Block>
                    </Fragment>}
                    {sesionado && <Block>
                        <Heading mb="2" subtitle tablet={{ textSize: "4" }} mobile={{ textSize: "5" }}>
                            Encadenar palabras con 漢字.
                        </Heading>
                        <Button renderAs="a" href="/jugar" className='is-responsive' color="primary" fullwidth size="large">
                            Jugar
                        </Button>
                    </Block>}
                </Columns.Column>
            </Columns>
        </Layout>
    )
}