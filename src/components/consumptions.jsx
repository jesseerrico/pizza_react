import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Consumptions = (props) => {

    const [consumptions, setConsumptions] = useState([]);
    const [chosenPerson, setChosenPerson] = useState("");
    const [pizzaType, setPizzaType] = useState("");
    const [date, setDate] = useState("");
    const [month, setMonth] = useState((new Date()).getMonth());
    const [streak, setStreak] = useState([]);

    const consumptionsUrl = "http://localhost:9292/delivery";
    const findStreaksUrl = "http://localhost:9292/delivery/find_streaks";

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

    // I stole this code from the Internet. No apologies.
    const isValidDate = (dateString) => {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        var dNum = d.getTime();
        if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0,10) === dateString;
      }

    function isNumeric(value) {
        return /^-?\d+$/.test(value);
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

    const handlePersonChange = (value) => {
        setChosenPerson(value);
        setConsumptions([])
    }

    const handleMonthChange = (value) => {
        setMonth(value);
    }

    const getMonthStats = () => {
        if(isNumeric(month) && parseInt(month) < 12) {
            axios.get(findStreaksUrl)
                .then(response => {
                    const data = response.data;
                    let longestStreak = [];
                    // Since the requirements for the API didn't call for streaks to be filtered by month, this must be handled client-side.
                    data.forEach(streak => {
                        // Only consider dates within each streak that are in the right month
                        const filteredStreak = streak.filter(date => parseInt(date.split('-')[1]) === parseInt(month));
                        // if(streak.some(date => parseInt(date.split('-')[1]) === parseInt(month))) {
                        //     if(streak.length > longestStreak.length) {
                        //         longestStreak = streak;
                        //     }
                        // }
                        if(filteredStreak.length > longestStreak.length) {
                            longestStreak = filteredStreak;
                        }
                    })
                    setStreak(longestStreak);
                })
                .catch(error => {
                    console.log("Error: " + error);
                })
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
            <h2>See month statistics</h2>
            <input type="text" id="month" value={month} onChange={e => handleMonthChange(e.target.value)} />
            <label for="month">Month to see stats for (defaults to this month)</label><br/>
            <button onClick={getMonthStats}>See monthly stats</button>
            {streak.length > 0 && (<div className='lineItem'>Longest streak: {streak.join(', ')}</div>)}
        </div>
    )
}

export default Consumptions;