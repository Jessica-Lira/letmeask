import { useHistory, useParams } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'
import { Button }  from '../components/Button/index';
import { RoomCode } from '../components/RoomCode/index';
import { Question } from '../components/Question/index'
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;    
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    async function handleEndRoom () {
        database.ref(`rooms/${roomId}`).update({
          endedAt: new Date()
        })
        history.push('/') //redireciona pro home dps de fechar a sala
      }

      //pode ser substituida por um componente modal
      async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
          await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
      }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logo} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>    
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button> 
                    </div>             
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length && <span>{questions.length} pergunta(s) </span>}
                </div>

                <div className="question-list">
                    { questions.map(question => {
                        return(
                            <Question 
                                key={question.id} //algoritmo de reconciliacao
                                content={question.content}
                                author={question.author}
                            >
                                <button type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    }) }
                </div>
            </main>
        </div>
    );
}