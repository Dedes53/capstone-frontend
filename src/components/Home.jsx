import { Container, Col, Row } from "react-bootstrap";
import "../assets/css/Home.css";

function Home() {
    return (
        <>
            <section id="home" className="home-title home-padding">
                <Container>
                    <Row className="align-items-center gy-4">
                        <Col xs={12} lg={6}>
                            <h2>
                                <span>Scambia Competenze,<br /></span>
                                <span className="orange">Crea Connessioni.</span>
                            </h2>
                            <p>
                                Una community costruita sulla <span className="blue">condivisione</span>.
                            </p>
                        </Col>

                        <Col xs={12} lg={6} className="text-center text-lg-end">
                            <img src="/home.png" alt="SkillSwap Home" className="home-hero-img" />
                        </Col>
                    </Row>
                </Container>
            </section>

            <section id="come-funziona" className="home-padding">
                <Container>
                    <h2 className="blue">COME FUNZIONA</h2>

                    <div className="cards-container">
                        <div className="home-card">
                            <i className="bi bi-person-plus-fill card-icon"></i>
                            <h4>Crea un Profilo</h4>
                            <p>
                                Registrati e crea un profilo. Aggiungi le competenze che possiedi e che
                                desideri.
                            </p>
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
                </Container>
            </section>

            <section id="categorie" className="home-padding">
                <Container>
                    <h2 className="blue">CATEGORIE</h2>
                    <p>
                        Queste sono le categorie al momento disponibili. <br />
                        Molte altre saranno presto disponibili!
                    </p>

                    <Container className="mt-4 px-0">
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
                </Container>
            </section>

            <section id="contatti" className="home-padding">
                <Container>
                    <h2 className="blue">CONTATTI</h2>

                    <Container className="mt-4 px-0">
                        <Row className="g-4 justify-content-center">
                            <Col xs={4} md={3} lg={2}>
                                <div className="contact-card">
                                    <a
                                        className="contact-icon-link"
                                        href="mailto:federico.lepore73@gmail.com"
                                        aria-label="Email"
                                        title="Email"
                                    >
                                        <i className="bi bi-envelope-fill contact-icon"></i>
                                    </a>
                                </div>
                            </Col>

                            <Col xs={4} md={3} lg={2}>
                                <div className="contact-card">
                                    <a
                                        className="contact-icon-link"
                                        href="tel:+393394665372"
                                        aria-label="Telefono"
                                        title="Telefono"
                                    >
                                        <i className="bi bi-telephone-fill contact-icon"></i>
                                    </a>
                                </div>
                            </Col>

                            <Col xs={4} md={3} lg={2}>
                                <div className="contact-card">
                                    <a
                                        className="contact-icon-link"
                                        href="https://www.linkedin.com/in/federicolepore/"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="LinkedIn"
                                        title="LinkedIn"
                                    >
                                        <i className="bi bi-linkedin contact-icon"></i>
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    <p className="mt-4 autore">
                        Sviluppato da <span className="fw-bold">Federico Lepore</span>
                    </p>
                </Container>
            </section>
        </>
    );
}

export default Home;