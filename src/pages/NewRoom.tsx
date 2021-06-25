import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button/index';
import '../styles/auth.scss';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState(''); //resgata nome da sala

    
    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault(); //evitar q form seja enviado a outra page, o q faz a pagina piscar

        if(newRoom.trim() === '') { //valida sala, se vazia n faz nada
            return;
        }

        const roomRef = database.ref('rooms'); //banco de dados das salas
        
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        });
        
        history.push(`/rooms/${firebaseRoom.key}`); //redireciona o usuario pra sala criada
    }

    async function fillToCreateRoom(event: FormEvent) {
        event.preventDefault();

        if(newRoom.trim() === '') { 
            alert('Enter the room name.');
            return;
        }
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
                <h2>Criar uma nova sala</h2>
                <form onClick={handleCreateRoom}>
                    <input
                        type="text"
                        placeholder="Nome da sala"
                        onChange = {event => setNewRoom(event.target.value)}
                        value = {newRoom}
                    />
                    <Button type="submit" onClick={fillToCreateRoom}>
                        Criar sala
                    </Button>
                </form>
                <p>
                    Quer entrar em uma sala existente? 
                    <Link to="/"><strong> Clique aqui</strong></Link>
                </p>
                </div>
            </main>
        </div>
    )
}