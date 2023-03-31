import './eventtab.css'
import React, { useState, useEffect, useRef } from "react";
import BACKENDURL from '../../index';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import {CircularProgress, Typography} from '@mui/material';

const Artist = ({artist}) => {
    const isMountedRef = useRef(false);
    const [artistData, setArtistData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getArtistInfo = async(artist) => {
        const artists = await axios.get(BACKENDURL + '/artist/', {
            params: {
                keyword: artist
            }
        })
        .then(async function(response) {
            return await response.data;
        })
        return artists?.artists?.items;
    }

    const getAlbumImgs = async(artistID) => {
        const artists = await axios.get(BACKENDURL + '/artist/' + artistID)
        .then(async function(response) {
            console.log(response.data);
            return await response.data?.items;
        })
        return artists;
    }


    console.log(artistData)
    useEffect (()=>{
        const fetchData = async() => {

            const artist_details = await getArtistInfo(artist);
            console.log(artist_details);
            var artist_cards = [];
            for(var i in artist_details){
                
                var a = {};
                a.name = artist_details[i]?.name;
                a.popularity = artist_details[i]?.popularity;
                a.followers = artist_details[i]?.followers?.total;
                a.spotifyurl =  artist_details[i]?.external_urls?.spotify;
                a.img = artist_details[i]?.images[0]?.url;
                a.album = await getAlbumImgs(artist_details[i]?.id);
                a?.album?.map((item, index)=> {
                    console.log(item?.images[0]?.url);
                })
                artist_cards.push(a);
            }
            setArtistData(artist_cards);
        }

        isMountedRef.current = true
        if(isMountedRef.current){
            fetchData();
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    }, [])


    const CircleImage = (src) => {
        return (
          <div style={{ margin: "auto", borderRadius: '50%', overflow: 'hidden', width: '150px', height: '150px' }}>
            <img src={src} alt="" style={{ width: '100%', height: 'auto' }} />
          </div>
        );
    };

    return (
        <>
            {artistData && 
            <Carousel prevLabel="" nextLabel="" indicators={false}>
                {artistData?.map(({name, followers, popularity, img, album, spotifyurl}, index) => {
                    return (
                        <Carousel.Item key={index}>
                            <div className='artist align-items-center justify-content-center'>
                                <div className='mx-auto d-flex justify-content-between row'>
                                    <div className='col-lg-3'>
                                        {CircleImage(img)}
                                        <p className='head'>{name}</p>
                                    </div>
                                    <div className='col-lg-3'>
                                        <p className='head'>Popularity</p>
                                        <div style={{ margin: "auto", position: 'relative', width: 'fit-content' }}>
                                            <CircularProgress thickness={4.5} size={70} color="error" variant="determinate" value={popularity} />
                                            <Typography variant="body2" style={{ fontSize: "18px", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                                {popularity}
                                            </Typography>
                                        </div>
                                    
                                    </div>
                                    <div className='col-lg-3'>
                                        <p className='head'>Followers</p>
                                        <p>{followers}</p>
                                    </div>
                                    
                                    <div className='col-lg-3'>
                                        <p className='head'>Spotify Url</p>
                                        <a href={spotifyurl} target="_blank">spotify</a>
                                    </div>
                                </div>
                                <div>
                                    <p className='head'>Album featuring {name}</p>
                                    <div className='d-flex justify-content-between'>
                                        {album?.map((item, index)=> {
                                            return (
                                                <div className="p-3">
                                                    <img key={index} className='img-fluid' src={item?.images[1]?.url} alt=""/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item>
                    );
                })}
            </Carousel>}
            </>
    )
  
  
}

export default Artist;