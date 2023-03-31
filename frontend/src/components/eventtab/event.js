import './eventtab.css'
import React, { useState, useEffect, useRef } from "react";
import BACKENDURL from '../../index';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';


const Event = ({event_id}) => {
    const [eventData, setEventData] = useState();
    const isMountedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);

    const getEventInfo = async() => {
        const event = await axios.get(BACKENDURL + '/event/' + event_id)
        .then(async function(response) {
            return await response.data;
        })
        return event;
    }


    function get_artist(attractions){
        var ans = "";
        for(var i = 0; i < attractions?.length; i++){
            if(attractions[i]?.name !== undefined && attractions[i]?.name !== "Undefined"){
                ans += attractions[i]?.name + '|' 
            }
        }
        if(ans!=="" && ans.slice(-1)==="|"){
            return ans.slice(0, -1);
        }
        return undefined;
    }
    
    function get_genre(genres){
        const genre_name = {};
        genre_name.subgenre = genres?.subGenre?.name;
        genre_name.genre = genres?.genre?.name;
        genre_name.segment = genres?.segment?.name;
        genre_name.subtype = genres?.subType?.name;
        genre_name.type = genres?.type?.name;
        
        var ans = "";
        for(var key in genre_name){
            if(genre_name[key]!==undefined && genre_name[key]!=="Undefined"){
                ans += genre_name[key] + " | ";
            }
        }
        if(ans.slice(-1)===" "){
            return ans.slice(0, -3);
        }
        return ans;
    }

    useEffect (()=>{
        const fetchData = async() => {
            
            const event = await getEventInfo(event_id);

            var card = {};
            card.name = event?.name;
            card.date = event?.dates?.start?.localDate + " " + event?.dates?.start?.localTime;
            card.artist = get_artist(event?._embedded?.attractions);
            card.venue = event?._embedded?.venues?.[0]?.name;
            card.genres = get_genre(event?.classifications?.[0]);
            card.price_range = event?.priceRanges?.[0]?.min + "-" + event?.priceRanges?.[0]?.max + " " + event?.priceRanges?.[0]?.currency;
            card.ticket_status = event?.dates?.status?.code;
            card.buy_ticket_at = event?.url;
            card.seat_map = event?.seatmap?.staticUrl;
            
            setEventData(card);
          
        }

        isMountedRef.current = true
        if(isMountedRef.current){
            fetchData();
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    }, [])

    const color = {
        'onsale': "success", 
        'rescheduled': '#e1ad01',
        'cancelled': "dark",
        'postponed': "orange",
        'offsale': "danger"
    }

    return(
        <>
        { eventData ?
            (
            <>
            <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-12 container text-center'>
                <div className='mx-3'>
                    <p className='head'>
                        Date
                    </p>
                    <p>{eventData?.date}</p>
                </div>

                <div className='mx-3'>
                    <p className='head'>
                        Artist/Team
                    </p>
                    <p>{eventData?.artist}</p>
                </div>

                <div className='mx-3'>
                    <p className='head'>
                        Venue
                    </p>
                    <p>{eventData?.venue}</p>
                </div>

                <div className='mx-3'>
                    <p className='head'>
                        Genre
                    </p>
                    <p>{eventData?.genres}</p>
                </div>
                <div className='mx-3'>
                    <p className='head'>
                        Price Range
                    </p>
                    <p>{eventData?.price_range}</p>
                </div>
                <div className='mx-3'>
                    <p className='head'>
                        Ticket Status
                    </p>
                    <Button variant={color[eventData?.ticket_status]}>{eventData?.ticket_status}</Button>
                </div>

                <div className='mx-3'>
                    <p className='head'>
                        Buy ticket at
                    </p>
                    <a href={eventData?.buy_ticket_at}>Ticketmaster</a>
                </div>
                </div>

                <div className='col-lg-6 col-md-6 col-sm-12'>
                    <img src={eventData?.seat_map} className='img-fluid'></img>
                </div>
                
            </div>


            <div>
                Share on:  
                <TwitterIcon fontSize="large" htmlColor="#1DA1F2" />
                <FacebookIcon fontSize="large" htmlColor="#1877F2" />
            </div>
            </>
            
            
            ) : (<></>)
        }
        </>
    )
}

export default Event;