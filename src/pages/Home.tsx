import { useHistory } from 'react-router-dom';
import illustrationImg from '../asserts/images/illustration.svg';
import logoImg from '../asserts/images/logo.svg';
import googleIconImg from '../asserts/images/google-icon.svg';
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from "../hooks/useAuth";

export function Home() {

    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();

    async function handleCreateRoom() {

        if(!user) {
            await signInWithGoogle();
        }
        //redireciona o usuario para outra tela
        history.push('/rooms/new');  
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                <img src={logoImg} alt="letmeask" />
                <button onClick={handleCreateRoom} className="create-room">
                    <img src={googleIconImg} alt="logo do google" />
                    Crie sua sala com o Google
                </button>
                <div className="separator">ou entre em uma sala</div>
                <form>
                    <input
                        type="text"
                        placeholder="Digite o código da sala"
                    />
                    <Button type="submit">
                        Entrar na sala
                    </Button>
                </form>
                </div>
            </main>
        </div>
    )
}