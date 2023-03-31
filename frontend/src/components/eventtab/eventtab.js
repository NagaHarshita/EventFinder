import './eventtab.css'
import React, { useState } from "react";
import { Tabs, Tab } from 'react-bootstrap';
import Event from './event';
import Artist from './artist';
import Venue from './venue';


function Eventtab(tabDetails){
    
    const {event, venue, artist} = tabDetails;
    const [activeKey, setActiveKey] = useState('event');
    const [favList, setFavList] = useState(JSON.parse(sessionStorage.getItem('Favorites'))===null ? {} :JSON.parse(sessionStorage.getItem('Favorites')));
    const [isFav, setIsFav] = useState(event?.id in favList);

    const setFavLocal = () =>{
        if(!isFav){
            var k = favList;
            k[event?.id] = event;
            setFavList(k);
            sessionStorage.setItem('Favorites', JSON.stringify(k));
            setIsFav(true);
            window.confirm('Event Added to Favorites!');
        }else{
            setIsFav(false);
            const k = {...favList};
            delete k[event?.id];
            setFavList(k);
            sessionStorage.setItem('Favorites', JSON.stringify(k));
        }
        
    }

    const handleTabSelect = (key) => {
        setActiveKey(key);
    }

    return (
       
        <div>
            <div className='container d-flex align-items-center justify-content-center'>
                <div><h3>{event?.event_name}</h3></div>

               <div className="heart-icon-container" onClick={setFavLocal}>
                    {isFav ? (
                        <span className="material-symbols-outlined heart-icon filled-heart">favorite</span>
                    ) : (
                        <span className="material-symbols-outlined heart-icon empty-heart">favorite</span>
                    )}
                </div>
            </div>
            <Tabs defaultActiveKey="event" activeKey={activeKey}  onSelect={handleTabSelect} id="my-tabs">
                <Tab eventKey='event' title='Events'>
                    <Event event_id={event?.id}/>
                </Tab>
                <Tab eventKey='artist' title='Artist/Teams'>
                    <Artist artist={artist}/>
                </Tab>
                <Tab eventKey='venue' title='Venue'>
                    <Venue venue={venue}/>
                </Tab>
            </Tabs>
        </div>
        
    );
}


export default Eventtab;