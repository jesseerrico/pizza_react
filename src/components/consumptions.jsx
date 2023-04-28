import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Consumptions = (props) => {

    class Consumption {
        constructor(personName, pizzaName, date) {
            this.personName = personName;
            this.pizzaName = pizzaName;
            this.date = date;
        }
    }

    const [consumptions, setConsumptions] = useState([]);
    const [chosenPerson, setChosenPerson] = useState("");

    const consumptionsUrl = "http://localhost:9292/delivery"

    const getConsumptions = () => {
        if(chosenPerson) {
            axios.get(consumptionsUrl)
            .then((response) => {
                // Ideally this filtering would happen on the backend, but in the interest of time I'm doing it here
                const relevantConsumptions = response.data.filter(cons => cons.person === chosenPerson)
                setConsumptions(relevantConsumptions);
            })
            .catch(error => {
                console.error("Error: " + error);
            })
        }
    }

    useEffect(() => {
        setChosenPerson(props.people[0]);
    }, [])

    const handleChange = (value) => {
        setChosenPerson(value);
        setConsumptions([])
    }

    return (
        <div className="lineItem">
            <h1>Consumptions</h1>
            <select value={chosenPerson} onChange={e => handleChange(e.target.value)}>
                <option>Choose a person to see consumptions</option>
                {props.people.map(person => <option value={person}>{person}</option>)}
            </select>
            <button onClick={getConsumptions}>Find person's pizza consumptions</button>
            {consumptions.map(cons => <div className='lineItem'>{chosenPerson} ate a {cons['meat-type']} pizza on {cons['date']}</div>)}
        </div>
    )
}

export default Consumptions;