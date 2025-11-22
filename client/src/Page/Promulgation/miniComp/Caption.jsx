import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
export default function CaptionEl() {
  const [text,setText] = useState("")




  const handleInp = evnt=>{
    setText(evnt.target.value);
  }
  return(
      <div className="myCapDiv flex items-center flex-col p-1">
        <div className="flex items-center p-2 border-b-2 border-skin-ptext/30">
            <div className="navBar flex items-center justify-center gap-2">
              <button className='capBtn' title='Bold'><i className='bx bx-bold'></i></button>
              <button className='capBtn' title='Italic'><i className='bx bx-italic'></i></button>
              <button className='capBtn' title='Code'><i className='bx bx-code'></i></button>
              <button className='capBtn' title='Code Block'><i className='bx bx-code-block'></i></button>
              <button className='capBtn' title='Heading'><i className='bx bx-heading'></i></button>
              <button className='capBtn' title='Attach URL' ><i className='bx bx-link'></i></button>
            </div>
        </div>
        <div className="flex">
          <textarea name="" id="md-textarea"
            value={text}
            onChange={handleInp}
            placeholder='Write Your caption using markdown...'
            className='w-full min-h-44 outline-none p-3'
          />
        </div>
      </div>
  )
}