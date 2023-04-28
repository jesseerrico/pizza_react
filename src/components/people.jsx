import React, {useState} from 'react';
import axios from 'axios';

const People = (props) => {
    const [newName, setNewName] = useState("");

    const addPerson = () => {
        axios.post(props.peopleUrl, {
            name: newName
        })
        .then((response) => {
            if(response.status === 201) {
                // Get the people list again
                props.getPeople();
                setNewName("");
            }
        })
        .catch(error => {
            console.error("Error: " + error);
        })
      }

    return (
        <>
            <h1>People</h1>
            <div className="lineItem">
                {props.people.map(person => <div className="lineItem">{person}</div>)}
            </div>
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} />
            <button onClick={addPerson}>Add Person</button>
        </>
    )
}

export default People;