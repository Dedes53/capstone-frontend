import "../assets/css/Home.css";

function Home() {

    return (
        <>
            <div id="home" className="home-title home-padding">
                < h2 ><span className="" >Scambia competenze,<br /> </span> <span className="orange">crea connessioni.</span></h2 >
                <p>Una community costruita sulla <span className="blue">condivisione</span>.</p>
                <img src="../home.png" alt="" />
            </div >
            <div id="how-it-works" className="home-padding">
                <h2 className="blue">Come funziona</h2>
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
        </>
    )
}

export default Home;