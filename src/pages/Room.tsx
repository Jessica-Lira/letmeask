import { FormEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../asserts/images/logo.svg';
import { Button }  from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

type RoomParams = {
    id: string;    
}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    const roomId = params.id;

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            console.log(room.val());
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
        

    }, [roomId]) //o id precisa estar no array pro efeito ser aplicado em qq sala


    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === '') { //verifica questao esta vazia
            return;
        }

        if(!user) {
            throw new Error('You most be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion(''); //apaga o campo
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logo} alt="Letmeask" />
                    <RoomCode code={roomId}/>                   
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length && <span>{questions.length} pergunta(s) </span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea  
                        placeholder="O que você quer perguntar?" 
                        onChange={event => setNewQuestion(event.target.value)} 
                        value={newQuestion}
                    />

                    <div className="div form-footer">
                        {
                            user ? 
                            (
                                <div className="user-info"> 
                                    <img src={user.avatar} alt={user.name} />
                                    <span>{user.name}</span>
                                </div>    
                            ) :                                
                            (
                                <span>Para enviar uma pergunta, <button>faça seu login.</button></span>
                            )
                        }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                {/* {JSON.stringify(questions)} */}
            </main>
        </div>
    );
}