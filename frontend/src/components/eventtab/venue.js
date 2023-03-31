import './eventtab.css'
import React, { useState, useEffect, useRef } from "react";
import BACKENDURL from '../../index';
import axios from 'axios';

const Venue = ({venue}) => {
    const isMountedRef = useRef(false);
    const [venueData, setVenueData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getVenueInfo = async(venue_name) => {
        const venue = await axios.get(BACKENDURL + '/venue/', {
            params: {
                venue: venue_name
            }
        })
        .then(async function(response) {
            return await response.data;
        })
        return venue?._embedded?.venues[0];
    }

    useEffect (()=>{
        const fetchData = async() => {

            const venue_details = await getVenueInfo(venue);
            var venue_card = {};
            venue_card.name = venue_details?.city?.name + ',' + venue_details?.state?.name ;
            venue_card.address = venue_details?.address?.line1;
            venue_card.phone = venue_details?.boxOfficeInfo?.phoneNumberDetail;
            venue_card.openhrs = venue_details?.boxOfficeInfo?.openHoursDetail;
            venue_card.generalrule = venue_details?.generalInfo?.generalRule;
            venue_card.childrule = venue_details?.generalInfo?.childRule;
            setVenueData(venue_card);
        }

        isMountedRef.current = true
        if(isMountedRef.current){
            fetchData();
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    }, [])
    return(
        <div className='d-flex flex-wrap'>
            <div className='flex-grow-1'>
                <div>
                    <p className='head'>Name</p>
                    <p>{venueData?.name}</p>
                </div>
                <div>
                    <p  className='head'>Address</p>
                    <p>{venueData?.address}</p>
                </div>
                <div>
                    <p  className='head'>Phone Number</p>
                    <p>{venueData?.phone}</p>
                </div>
            </div>
            <div className='w-50 flex-grow-0 flex-shrink-0'>
                <div>
                   <p  className='head'> Open Hours</p>
                   <p>{venueData?.openhrs}</p>
                </div>
                <div>
                    <p  className='head'>General Rule</p>
                    <p>{venueData?.generalrule}</p>
                </div>
                <div>
                    <p  className='head'>Child Rule</p>
                    <p>{venueData?.childrule}</p>
                </div>
            </div>
        </div>
    )
}

export default Venue;
