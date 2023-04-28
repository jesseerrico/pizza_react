import React, {useState, useEffect} from 'react';
import axios from 'axios';

const People = () => {
    const [people, setPeople] = useState([])
    const [newName, setNewName] = useState("");
    const url = "http://localhost:9292/person"

    const addPerson = () => {
        axios.post(url, {
            name: newName
        })
        .then((response) => {
            if(response.status == 201) {
                // Get the people list again
                getPeople();
            }
        })
        .catch(error => {
            console.error("Error: " + error);
        })
    }

    const getPeople = () => {
        axios.get(url)
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
        <>
            Current people on file:
            <div className="lineItem">
                {people.map(person => <div className="lineItem">{person}</div>)}
            </div>
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} />
            <button onClick={addPerson}>Add Person</button>
        </>
    )
}

export default People;