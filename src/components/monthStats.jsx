import React, {useState} from 'react';
import axios from 'axios';

const MonthStats = () => {

    const [month, setMonth] = useState((new Date()).getMonth());
    const [streak, setStreak] = useState([]);
    const [highDate, setHighDate] = useState("");

    const findStreaksUrl = "http://localhost:9292/delivery/find_streaks";
    const monthHighUrl = "http://localhost:9292/delivery/month_high";

    const handleMonthChange = (value) => {
        setMonth(value);
        setStreak([]);
        setHighDate('');
    }
    
    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    const getMonthStats = () => {
        if(isNumeric(month) && parseInt(month) <= 12) {
            axios.get(findStreaksUrl)
                .then(response => {
                    const data = response.data;
                    let longestStreak = [];
                    // Since the requirements for the API didn't call for streaks to be filtered by month, this must be handled client-side.
                    data.forEach(streak => {
                        // Only consider dates within each streak that are in the right month
                        const filteredStreak = streak.filter(date => parseInt(date.split('-')[1]) === parseInt(month));
                        if(filteredStreak.length > longestStreak.length) {
                            longestStreak = filteredStreak;
                        }
                    })
                    setStreak(longestStreak);
                })
                .catch(error => {
                    console.log("Error: " + error);
                })

            axios.get(monthHighUrl + "/" + month)
                .then(response => {
                    const data = response.data;
                    if(data && data['pizzaPeakDay']) {
                        setHighDate(data['pizzaPeakDay']);
                    }
                })
                .catch(error => {
                    console.log("Error: " + error);
                })
        }
    }

    return (
        <>
            <h2>See month statistics</h2>
            <input type="text" id="month" value={month} onChange={e => handleMonthChange(e.target.value)} />
            <label for="month">Month to see stats for (defaults to this month)</label><br/>
            <button onClick={getMonthStats}>See monthly stats</button>
            {streak.length > 0 && (<div className='lineItem'>Longest streak: {streak.join(', ')}</div>)}
            {highDate && (<div className='lineItem'>Highest consumption date: {highDate}</div>)}
        </>
    )
}

export default MonthStats;