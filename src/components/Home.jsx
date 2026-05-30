import { Container, Col, Row } from "react-bootstrap";
import "../assets/css/Home.css";

function Home() {

    return (
        <>
            <div id="home" className="home-title home-padding">
                < h2 ><span className="" >Scambia Competenze,<br /> </span> <span className="orange">Crea Connessioni.</span></h2 >
                <p>Una community costruita sulla <span className="blue">condivisione</span>.</p>
                <img src="../home.png" alt="" />
            </div >

            <div id="how-it-works" className="home-padding">
                <h2 className="blue">COME FUNZIONA</h2>
                <div className="cards-container">
                    <div className="home-card">
                        <i className="bi bi-person-plus-fill card-icon"></i>
                        <h4>Crea un Profilo</h4>
                        <p>Registrati e crea un profilo. Aggiungi le competenze che possiedi e che desideri.</p>
                    </div>

                    <div className="home-card">
                        <i className="bi bi-people-fill card-icon"></i>
                        <h4>Fai Match</h4>
                        <p>SkillSwap mette in contatto persone con competenze complementari.</p>
                    </div>

                    <div className="home-card">
                        <i className="bi bi-chat-left-quote-fill card-icon"></i>
                        <h4>Contatta altri utenti</h4>
                        <p>Contatta gli utenti con cui desideri scambiare competenze.</p>
                    </div>

                    <div className="home-card">
                        <i className="bi bi-heart-fill card-icon"></i>
                        <h4>Cresci</h4>
                        <p>Scambia competenze con altri utenti per crescere insieme.</p>
                    </div>
                </div>
            </div>

            <div id="categories" className="home-padding">
                <h2 className="blue">CATEGORIE</h2>
                <p>Queste sono le categorie al momento disponibili. <br />
                    Molte altre saranno presto disponibili!</p>

                <Container className="mt-4">
                    <Row className="g-4">
                        <Col xs={6} sm={4} md={3} lg={2}>
                            <div className="category-card">
                                <i className="bi bi-code-slash"></i>
                                <p>Tech</p>
                            </div>
                        </Col>
                        <Col xs={6} sm={4} md={3} lg={2}>
                            <div className="category-card">
                                <i className="bi bi-house"></i>
                                <p>Casa</p>
                            </div>
                        </Col>
                        <Col xs={6} sm={4} md={3} lg={2}>
                            <div className="category-card">
                                <i className="bi bi-leaf"></i>
                                <p>Giardinaggio</p>
                            </div>
                        </Col>
                        <Col xs={6} sm={4} md={3} lg={2}>
                            <div className="category-card">
                                <i className="bi bi-pencil"></i>
                                <p>Scuola</p>
                            </div>
                        </Col>
                        <Col xs={6} sm={4} md={3} lg={2}>
                            <div className="category-card">
                                <i className="bi bi-fork-knife"></i>
                                <p>Cucina</p>
                            </div>
                        </Col>
                        <Col xs={6} sm={4} md={3} lg={2}>
                            <div className="category-card">
                                <i className="bi bi-hammer"></i>
                                <p>Fai da te</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div id="contatti" className="home-padding ">
                <h2 className="blue">CONTATTI</h2>
                <Container className="mt-4">
                    <Row className="g-4">
                        <Col xs={4}>
                            <div className="contact-card">
                                <i className="bi bi-envelope-fill contact-icon"></i>
                                <a className="contact-link" href="mailto:federico.lepore73@gmail.com"></a>
                            </div>
                        </Col>

                        <Col xs={4}>
                            <div className="contact-card">
                                <i className="bi bi-telephone-fill contact-icon"></i>
                                <a className="contact-link" href="tel:+393394665372"> </a>
                            </div>
                        </Col>

                        <Col xs={4}>
                            <div className="contact-card">
                                <i className="bi bi-linkedin contact-icon"></i>
                                <a
                                    className="contact-link"
                                    href="https://www.linkedin.com/in/federicolepore/"
                                >
                                </a>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <p className="mt-4">Sviluppato da <span className="fw-bold">Federico Lepore</span></p>
            </div>
        </>
    )
}

export default Home;