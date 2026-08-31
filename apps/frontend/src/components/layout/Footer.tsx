import Link from "next/link";

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-columns">
                    <div className="footer-column">
                        <h3>DevAI Store</h3>
                        <div className="footer-links">
                            <span className="footer-link">
                                &copy; {new Date().getFullYear()} DevAI Store. Todos os direitos reservados.
                            </span>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h3>Institucional</h3>
                        <div className="footer-links">
                            <Link href="/" className="footer-link">Sobre Nós</Link>
                            <Link href="/" className="footer-link">Carreiras</Link>
                            <Link href="/" className="footer-link">Imprensa</Link>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h3>Suporte</h3>
                        <div className="footer-links">
                            <Link href="/" className="footer-link">Termos</Link>
                            <Link href="/" className="footer-link">Privacidade</Link>
                            <Link href="/" className="footer-link">Contato</Link>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h3>Promoções</h3>
                        <div className="footer-links">
                            <Link href="/" className="footer-link">Ofertas da Semana</Link>
                            <Link href="/" className="footer-link">Programa de Fidelidade</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-fineprint">
                        © {new Date().getFullYear()} DevAI Store. Termos de Uso · Política de Privacidade · Código de Defesa do Consumidor
                    </div>
                </div>
            </div>
        </footer>
    );
}