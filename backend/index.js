const express = require('express'); 
const axios = require('axios');
const Geohash = require('ngeohash');
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();    

var cors = require('cors')

app.use(cors()) // Use this after the variable declaration
          
const port = 5001;      
const ticketMasterApiKey = 'yjAHMBDybfi5pK84GUf4T9G9Q3dJq5Zs';



const clientId = '4971fd960aa44708a3a695c035b0b5c8',
  clientSecret = 'e9f090520b594ee4817ca6875b7aa0f0';

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
  });

const getArtistImages = async(artistID) => {
        await spotifyApi.clientCredentialsGrant().then(
        (data) => {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
        
            spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
        );
        const artist = await spotifyApi.getArtistAlbums(artistID, { limit: 3})
        .then((data) => {
            return data.body;
        }, function(err) {
            console.error(err);
        });
        return artist;
}


const getSpotifyArtist = async(keyword) => {

    await spotifyApi.clientCredentialsGrant().then(
    (data) => {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
    
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
    );
      
    const artist = await spotifyApi.searchArtists(keyword)
    .then(async(data) => {
        return data.body;
    }, function(err) {
        console.error(err);
    });
    return artist;
}

const autoComplete = async(keyword) =>{
    try {
        const suggestApi = "https://app.ticketmaster.com/discovery/v2/suggest";
        const suggestion = await axios.get(suggestApi, {
            params:{
                apikey: ticketMasterApiKey,
                keyword: keyword
            }
        })
        return suggestion;
    } catch(error){
        console.error(error);
    }
}

const getGeoPoint = (lat, long) => {
    return Geohash.encode(lat, long);
}

const getEvents = async(data) => {
    try{
        const eventApi = "https://app.ticketmaster.com/discovery/v2/events";
        const events = await axios.get(eventApi, {
            params:{
                apikey: ticketMasterApiKey,
                keyword: data.keyword,
                segmentID: data.segmentID,
                radius: data.radius,
                unit: "miles",
                geoPoint: data.geoPoint
            }
        })
        return events;
    } catch(error){
        console.error(error);
    }
}

const getEventDetails = async(event_id) => {
    try{
        const eventDetailApi = "https://app.ticketmaster.com/discovery/v2/events/" + event_id;
        const eventDetails = await axios.get(eventDetailApi, {
            params: {
                apikey: ticketMasterApiKey
            }
        })
        return eventDetails;
    }catch(error){
        console.log(error);
    }
}

const getVenueDetails = async(venue_name) =>{
    try{
        const venueDetailApi = "https://app.ticketmaster.com/discovery/v2/venues/";
        const venueDetails = await axios.get(venueDetailApi, {
            params: {
                apikey: ticketMasterApiKey,
                keyword: venue_name
            }
        })
        return venueDetails;
    }catch(error){
        console.log(error);
    }
}


app.get('/artist', async(req, res) => {
    const keyword = req.query.keyword;
    const artist = await getSpotifyArtist(keyword)
    .then(response => {
        return res.status(200).json(response);
    }).catch(error => {
        console.log(error)
        return res.status(404).end();
    }) 
})


app.get('/artist/:id', async(req, res) => {
    const artistID = req.params.id;
    const artist = await getArtistImages(artistID)
    .then(response => {
        return res.status(200).json(response);
    }).catch(error => {
        console.log(error)
        return res.status(404).end();
    }) 
})

app.get('/autocomplete', async (req, res) => {        
    const keyword = req.query.keyword;
    const suggestions = await autoComplete(keyword)
    .then(response => {
        if(response?.data){
            return res.status(200).json(response.data);
        }
    }).catch(error => {
        console.log(error)
        return res.status(404).end();
    })                                                        
});


app.get('/events', async(req, res)=>{
    const body = {};
    body['keyword'] = req.query.keyword;
    body['segmentId'] = req.query.segmentID;
    body['radius'] = req.query.radius;
    body['geoPoint'] = getGeoPoint(req.query.latitude, req.query.longitude);

    const events = await getEvents(body)
    .then(response => {
        if(response?.data){
            return res.status(200).json(response.data);
        }
    }).catch(error =>{
        console.log(error);
        return res.status(404).end();
    })
});


app.get('/event/:id', async(req, res)=>{
    const event_id = req.params.id;

    const event_details = await getEventDetails(event_id)
    .then(response => {
        if(response?.data){
            return res.status(200).json(response.data);
        }
    }).catch(error => {
        console.log(error);
        return res.status(404).end();
    })
});

app.get('/venue', async(req, res)=>{
    const venue_name = req.query.venue;

    const venue_details = await getVenueDetails(venue_name)
    .then(response => {
        if(response?.data){
            return res.status(200).json(response.data);
        }
    }).catch(error => {
        console.log(error);
        return res.status(404).end();
    })
});

app.get('/twitter', )

app.get('/facebook', )



app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});