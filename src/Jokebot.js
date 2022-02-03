import React from 'react';
import { useState } from 'react';
import bot from './Images/bot.gif';




export default function Jokebot() {


    
    const all_voices = speechSynthesis.getVoices();
    const jokeSpeech = new SpeechSynthesisUtterance('No warning should arise');


    //Getting Voice Command from User
    const speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();
    speechRecognition.lang = 'hi-IN';
    recognition.continuous = true;
    recognition.onresult = function (event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (transcript.includes('tell me a joke')) {
            fetchJoke();
        }
    };



    //Starting the voice after the Whole content is leaded
    document.addEventListener('DOMContentLoaded', () => {
        recognition.start();

        //onPressing the Key
        document.onkeypress = function (event) {
            if (event.key === 'j' || event.key === 'J') {
                fetchJoke();
            }
        }
    });





    //Fectching the Data and Telling in Speech
    const [Joke, setJoke] = useState('');
    const fetchJoke = async () => {
        fetch("https://v2.jokeapi.dev/joke/Any", {
            "method": "GET",
        }).then(response => response.json())
            .then(response => {
                if (!response.error) {
                    setJoke(response.setup + ' ' + response.delivery);
                    tellJoke(response.setup + ' ' + response.delivery);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const tellJoke=(Joke)=>{
        jokeSpeech.text = Joke;
        speechSynthesis.speak(jokeSpeech);
    }





    //voiceChange occur
    const voiceChanges=(event)=>{
        speechSynthesis.cancel();
        jokeSpeech.voice=all_voices[event.currentTarget.value];
        jokeSpeech.text = Joke;
        speechSynthesis.speak(jokeSpeech);
    }


    return (
        <div className="App">
            <header className="App-header">
                <img src={bot} alt="logo" />
                <button onClick={fetchJoke}>Tell Me a Joke</button>
                <select onChange={voiceChanges}>
                    <option defaultValue={true}>Select a voice</option>
                    {all_voices.map((voice, idx) => {
                    return <option key={idx} name={voice.name} value={idx} >{voice.name}</option>
                    })}
                </select>
                {Joke !== '' ? <p>{Joke}</p> : ''}
            </header>
        </div>
    );
}
