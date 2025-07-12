import { useState, useEffect, useRef } from "react";
import FlashcardList from "./components/FlashcardList";

import './app.css';

import axios from "axios";

export type FlashcardType = {
  id: number | string;
  question: string;
  answer: string;
  options: string[];
}

const App = () => {
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; }[]>([]);

  const categoryEl = useRef<HTMLSelectElement>(null);
  const amountEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories);
      })
  }, []);

  useEffect(() => {

  }, []);

  const decodeString = (str: string) => {
    const textArea = document.createElement('textarea') as HTMLTextAreaElement;
    textArea.innerHTML = str;
    return textArea.value;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const categoryValue = categoryEl.current?.value;
    const amountValue = amountEl.current?.value;

    if (!categoryValue || !amountValue) return;

    axios.get('https://opentdb.com/api.php', {
      params: {
        amount: amountValue,
        category: categoryValue
      }
    })
      .then(res => {
        setFlashcards(res.data.results.map((questionItem: any, index: number) => {
          const answer = decodeString(questionItem.correct_answer);
          const options = [
            ...questionItem.incorrect_answers.map((a: string) => decodeString(a)),
            answer
          ];

          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: answer,
            options: options.sort(() => Math.random() - .5)
          }
        }))
      })
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map(category => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number Of Questions</label>
          <input type="number" id="amount" min={1} step={1} defaultValue={10} ref={amountEl} />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  )
}

export default App
