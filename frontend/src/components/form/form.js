import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './form.css'
import React, { useState, useRef } from "react";
import Table from '../table/table';
import axios from 'axios';
import BACKENDURL from '../..';


function SearchForm() {

    const [formData, setFormData] = useState({
        keyword: "",
        distance: 10,
        category: "default",
        location: "",
        latitude: "",
        longitude: ""
    });

    const formRef = useRef(null);
    const [isChecked, setIsChecked] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    
    const handleSubmit = async(e) =>{
        e.preventDefault();
        setShowTable(false);
        const form = formRef.current;
        if (form.checkValidity()) {
            if(isChecked){
                await autoDetectLocation();
            }else{
                await getGeoCode();
            }
            setShowTable(true);
        } else {
            form.reportValidity();
        }
    }
    
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        
        setFormData((prevProps => ({
            ...prevProps,
            [name]: value
        })))

        if(name==="keyword"){
            autoComplete();
        }
    }

    const handleClear = (e) =>{
        e.preventDefault();
        const form = formRef.current;
        form.reset();
        setFormData({
            keyword: "",
            distance: 10,
            category: "default",
            location: ""
        })
        setShowTable(false);
        setIsChecked(false);
    }

    const getGeoCode = async() => {
        const address = formData.location.replaceAll(' ', '+');
        const gcloud_key = "AIzaSyAwGCPLv4Ehw1bAwIqqwEDBzV1nTWwSVPY";
    
        const geo_code = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + gcloud_key)
        .then(async function(response){
            var geometry = await response.data['results']?.[0]['geometry'];
            var lat = geometry['location']['lat']
            var lng = geometry['location']['lng']
            setFormData((prevProps => ({
                ...prevProps,
                latitude: lat,
                longitude: lng
            })))
        });
        return geo_code;
    }

    const autoDetectLocation = async() => {
        const return_events = await axios.get("https://ipinfo.io/json?token=606f43405f4eb3")
        .then(async function(response) {
            var search_results = response.data;
            var lat = search_results['loc'].split(",")?.[0]
            var lng = search_results['loc'].split(",")?.[1]
            setFormData((prevProps => ({
                ...prevProps,
                latitude: lat,
                longitude: lng
            })))
        })
        return return_events;
    }

    const autoComplete = async() => {
        const suggestion = await axios.get(BACKENDURL + '/autocomplete', {
            params: {
                keyword: formData.keyword
            }
        }).then(async function(response){
            var venues = response.data?._embedded?.venues;
            var options = [];
            for(var i in venues){
                options.push(venues?.[i]?.name);
            }
            setSuggestions(options);
        })
        return suggestion;
    }

  return (
    <>
    <div className='custom-form'>
        <h1>Events Search</h1>
        <hr></hr>
        <Form ref={formRef}>
            <Form.Group className="mb-3" controlId="keyword">
                <Form.Label>Keyword <span className="required-asterisk">*</span></Form.Label>
                <Form.Control type="text" name="keyword" value={formData.keyword || ''} onChange={handleInputChange} list="suggestions" required/>
                <datalist id="suggestions">
                    {suggestions.map((option, index) => (
                        <option key={index} value={option} />
                    ))}
                </datalist>
            </Form.Group>

            <div className='row'>
                <Form.Group className="col-lg-6" controlId="distance">
                    <Form.Label>Distance</Form.Label>
                    <Form.Control type="number" name="distance" placeholder={10} defaultValue={formData.distance || 10} onChange={handleInputChange}/>
                </Form.Group>

                <Form.Group className="col-lg-6" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select aria-label="Default select example" name="category" value={formData.category || 'default'} onChange={handleInputChange}>
                    <option default value="default">Default</option>
                    <option value="music">Music</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts & Theatre</option>
                    <option value="film">Film</option>
                    <option value="mis">Miscelleneous</option>
                    </Form.Select>
                </Form.Group>
            </div>

            <Form.Group className="mb-3" controlId="location">
                <Form.Label>Location <span className="required-asterisk">*</span></Form.Label>
                <Form.Control type="text" name="location" value={formData.location || ''} disabled={isChecked} onChange={handleInputChange} required={true}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="checkbox">
                <Form.Check type="checkbox" label="Auto-detect your location" onChange={()=>{setIsChecked(!isChecked)}}/>
            </Form.Group>

            <div className='d-flex justify-content-center'>
                <Button variant="danger" type="submit" onClick={handleSubmit} className="mx-3 btn-md">
                    Submit
                </Button>
                <Button variant="primary" type="submit" onClick={handleClear} className="mx-3 btn-md">
                    Clear
                </Button>
            </div>
        </Form>

    </div>

    { showTable && <Table {...formData}/>}
    </>
  );
}

export default SearchForm;
