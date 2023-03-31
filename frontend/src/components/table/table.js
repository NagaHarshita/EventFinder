import './table.css'
import React, { useState, useEffect, useRef } from "react";
import BACKENDURL from '../../index';
import axios from 'axios';
import Eventtab from '../eventtab/eventtab';

function Table(formData){
    const [eventsData, setEventsData] = useState([]);
    const [showTable, setShowTable] = useState(true);
    const [tabDetails, setTabDetails] = useState({});
    const isMountedRef = useRef(false);

    const segment = {
        "music": "KZFzniwnSyZfZ7v7nJ",
        "sports": "KZFzniwnSyZfZ7v7nE",
        "arts": "KZFzniwnSyZfZ7v7na",
        "film": "KZFzniwnSyZfZ7v7nn",
        "miscellaneous": "KZFzniwnSyZfZ7v7n1",
        "default": ""
    }

    const getTableData = async() => {
        const events = await axios.get(BACKENDURL + "/events", {
            params : {
                latitude: formData.latitude,
                longitude: formData.longitude, 
                radius: formData.distance,
                segmentId: segment[formData.category],
                keyword: formData.keyword,
                
        }}).then(async function(response) {
            return await response.data;
        })
        return events?._embedded?.events;
    }


    useEffect(()=>{
        isMountedRef.current = true;
        async function fetchData() {
            const events = await getTableData();
            const eventsArray = [];

            for(var i in events){
                const event = events[i];
                const details = {};
                details.date = event?.dates?.start?.localDate
                details.time = event?.dates?.start?.localTime;
                details.icon = event?.images?.[0]?.url;
                details.event_name = event?.name;
                details.genre = event?.classifications?.[0]?.segment?.name;
                details.venue = event?._embedded?.venues?.[0]?.name;
                details.id = event?.id;
                eventsArray.push(details);
            }
            setEventsData(eventsArray);
        }
       
        if(isMountedRef.current){
            fetchData();
        }
        
    }, [showTable])


    if (!isMountedRef.current) {
        return null;
    }
    const renderHeader = () => {
        const header = ['Date', 'Icon', 'Name', 'Genre', 'Venue'];
        return <tr>
        {header.map(key => <th key={key}>{key}</th>)}
        </tr>
    }

    const showEventInfo = (idx) => {
        console.log(idx)
        setShowTable(false);
        setTabDetails({
            event: eventsData[idx],
            venue: eventsData[idx].venue,
            artist: eventsData[idx].event_name
        });
    }  

    const handleBack = () => {
        setShowTable(true);
    }

    const renderEvents = () => {
        const events = eventsData;
        return events.map(({ date, time, icon, event_name, genre, venue, id }, index) => {
            return <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                        <td >{date} <br/> {time} </td>
                        <td ><img src={icon} style={{height: 80, width: 80}}/></td>
                        <td ><a onClick={() => showEventInfo(index)}>{event_name}</a></td>
                        <td >{genre}</td>
                        <td >{venue}</td>
                    </tr>
        })
    }



    return (
        <>
        {
            showTable 
            && (
                <div className='events'>   
                    { eventsData.length!==0 && 
                        <table>
                            <thead>
                                {renderHeader()}
                            </thead>
                            <tbody>
                                {renderEvents()}
                            </tbody>
                        </table>
                    }
                    {
                        eventsData.length===0 && 
                        <div className='empty-events'>No results available</div>
                    }
                </div>
            )
        }

        {
            !showTable && 
            <div className='Tabs'>
                <div className='float-left'>
                <button as="a" className='back' onClick={()=>{handleBack()}}>
                    <span className="material-symbols-outlined">arrow_back_ios</span>
                    Back
                </button>
                </div>
                <div>
                <Eventtab {...tabDetails}/>
                </div>
            </div>
        }
        </>
    );
}

export default Table;