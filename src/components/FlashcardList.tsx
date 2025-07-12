import Flashcard from './Flashcard';
import type { FlashcardType } from '../App';

type FlashcardProps = {
    flashcards: Array<FlashcardType>
}

const FlashcardList = ({ flashcards }: FlashcardProps) => {
    return (
        <div className="card-grid">
            {flashcards.map(flashcard => (
                <Flashcard flashcard={flashcard} key={flashcard.id} />
            ))}
        </div>
    )
}

export default FlashcardList;
