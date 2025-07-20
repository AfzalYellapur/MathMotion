import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Landing() {
    const [userprompt,setuserprompt]=useState('');
    const navigate=useNavigate();
    
    const handleClick= ()=>{
        navigate('/workspace', { state: { prompt: userprompt } });

    }
  return (
    <>  
      <h1>MATHMOTION</h1>
      <h2>write your prompt to generate manimations</h2>
      <div className='flex flex-col'>
        <input
          type="text"
          placeholder="Enter prompt to generate manimations"
          className="mb-2 p-2 border border-gray-400 rounded" 
          value={userprompt}
          onChange={(e)=>setuserprompt(e.target.value)}/>
        <button
          onClick={()=>{handleClick()}}
          className="p-2 bg-blue-400 text-white rounded-2xl">
          generate
        </button>
      </div>
    </>
  )
}

export default Landing;