import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import People from './components/people'
import Consumptions from './components/consumptions';

const App = () => {
  
const [people, setPeople] = useState([])
const peopleUrl = "http://localhost:9292/person"

// Putting people netcode here so it can be used across components

const getPeople = () => {
  axios.get(peopleUrl)
  .then((response) => {
     const peopleResponse = response.data;
     const newArray = [];
     peopleResponse.forEach(person => {
         newArray.push(person.name);
     });
     setPeople(newArray)
  })
  .catch(error => {
     console.error("Error: " + error);
  })
}

useEffect(() => {
  getPeople();
}, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Content will go here.
        </p>
      </header>
      <People people={people} peopleUrl={peopleUrl} getPeople={getPeople}/>
      <Consumptions people={people}/>
    </div>
  );
}

export default App;
