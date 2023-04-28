import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Consumptions = (props) => {

    const [consumptions, setConsumptions] = useState([]);
    const [chosenPerson, setChosenPerson] = useState("");
    const [pizzaType, setPizzaType] = useState("");
    const [date, setDate] = useState("");

    const consumptionsUrl = "http://localhost:9292/delivery";

    const getConsumptions = () => {
        if(chosenPerson) {
            axios.get(consumptionsUrl)
            .then((response) => {
                // Ideally this filtering would happen on the backend, but in the interest of time I'm doing it here
                const relevantConsumptions = response.data.filter(cons => cons.person === chosenPerson);
                setConsumptions(relevantConsumptions);
            })
            .catch(error => {
                console.error("Error: " + error);
            });
        }
    }

    const handlePersonChange = (value) => {
        setChosenPerson(value);
        setConsumptions([])
    }

    // I stole this code from the Internet. No apologies.
    const isValidDate = (dateString) => {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        var dNum = d.getTime();
        if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0,10) === dateString;
      }

    // Pizza type is kept as pure text input rather than dropdown so that users can input a new one like in the API call
    const addConsumption = () => {
        if(chosenPerson && pizzaType && pizzaType !== "" && date && isValidDate(date)) {
            axios.post(consumptionsUrl, {
                person_name: chosenPerson,
                pizza_name: pizzaType,
                date: date
            }).then((response) => {
                // Refetch consumptions to display the new one
                getConsumptions();
            }).catch(error => {
                console.error("Error: " + error);
            });
        } else {
            alert("Error! Make sure you have chosen a person and pizza type and entered a valid date.");
        }
    }

    return (
        <div className="lineItem">
            <h1>Consumptions</h1>
            <select value={chosenPerson} onChange={e => handlePersonChange(e.target.value)}>
                <option>Choose a person</option>
                {props.people.map(person => <option value={person}>{person}</option>)}
            </select>
            <button onClick={getConsumptions}>Find person's pizza consumptions</button>
            {consumptions.map(cons => <div className='lineItem'>{chosenPerson} ate a {cons['meat-type']} pizza on {cons['date']}</div>)}
            <h2>Add consumption</h2>
            <input type="text" id="pizzaInput" value={pizzaType} onChange={e => setPizzaType(e.target.value)} />
            <label for="pizzaInput">Pizza Type</label><br/>
            <input type="text" id="dateInput" value={date} onChange={e => setDate(e.target.value)} />
            <label for="dateInput">Date (yyyy-mm-dd)</label><br />
            <button onClick={addConsumption}>Add consumption of input-field pizza by dropdown person</button>
        </div>
    )
}

export default Consumptions;