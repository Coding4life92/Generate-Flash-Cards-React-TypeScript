import { useState, useEffect, useRef } from 'react'
import type { FlashcardType } from '../App'

type FlashcardProps = {
    flashcard: FlashcardType
}

const Flashcard = ({ flashcard }: FlashcardProps) => {
    const [flip, setFlip] = useState<boolean>(false);
    const [height, setHeight] = useState<string | number>('initial');

    const frontEl = useRef<HTMLDivElement>(null)
    const backEl = useRef<HTMLDivElement>(null)

    const setMaxHeight = () => {
        if (frontEl.current && backEl.current) {
            const frontHeight = frontEl.current.getBoundingClientRect().height;
            const backHeight = backEl.current.getBoundingClientRect().height;
            setHeight(Math.max(frontHeight, backHeight, 100));
        }
    }

    useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options]);
    useEffect(() => {
        window.addEventListener('resize', setMaxHeight);
        return () => window.removeEventListener('reize', setMaxHeight);
    }, []);

    return (
        <div
            className={`card ${flip ? 'flip' : ''}`}
            style={{ height: height }}
            onClick={() => setFlip(!flip)}
        >
            <div className="front" ref={frontEl}>
                {flashcard.question}
                <div className="flashcard-options">
                    {flashcard.options.map(option => (
                        <div className="flashcard-option" key={option}>{option}</div>
                    ))}
                </div>
            </div>
            <div className="back" ref={backEl}>
                {flashcard.answer}
            </div>
        </div>
    )
}

export default Flashcard;
