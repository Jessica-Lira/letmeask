import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import illustrationImg from '../asserts/images/illustration.svg';
import logoImg from '../asserts/images/logo.svg';
import googleIconImg from '../asserts/images/google-icon.svg';
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from "../hooks/useAuth";
import { database } from '../services/firebase';

export function Home() {

    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if(!user) {
            await signInWithGoogle();
        }
        history.push('/rooms/new');  //redireciona o usuario para outra tela
    }

    async function handleJoinRoom(event: FormEvent) { //entrar em uma sala
        event.preventDefault();

        if(roomCode.trim() === '') { 
            return;
        }

        //banco de dados das salas, verifica pelo id
        const roomRef = await database.ref(`/rooms/${roomCode}`).get(); 

        if(!roomRef.exists()) {
            alert("Room does not exists.");
            return;
        }
        history.push(`/rooms/${roomCode}`);
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
                <form onClick={handleJoinRoom}>
                    <input
                        type="text"
                        placeholder="Digite o código da sala"
                        onChange = {event => setRoomCode(event.target.value)}
                        value = {roomCode}
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