import React, { useEffect } from 'react';
import { useState } from 'react';

import './App.css';

import { MenuItem,FormControl,Select, Card } from '@material-ui/core';
import Infobox from './Infobox';
import Map from './Map.js';
import Table from './Table';
import {sortData, prettyPrintStat} from './util';

import "leaflet/dist/leaflet.css"; //map k lie
import numeral from "numeral";





const App=() =>{
  const [country,setCountry] = useState("worldwide")  
  const [countries,setCountries] = useState([])
  const[countryInfo,setCountryInfo]=useState({})
  const[tableData,setTableData]=useState([]);
  const [casesType, setCasesType] = useState("cases"); 
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 }); //latitude longitude dedie
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);

 

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")  // jb bhi page load hora hai tb yrh api call hokr world wide ka data show kra h 
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  },[]) // empty array shows ki ye code bs tb hi run hoga jn browser load hoga
 

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) =>response.json())
      .then((data) => {
        const countries =data.map((country) =>({
          name:country.country,
          value:country.countryInfo.iso2
        }));
        setCountries(countries);
        
        const sortedData= sortData(data);  //util file se return hora hai data sort hokr
        setMapCountries(data);
        setTableData(sortedData);   // table me insert krne k lie countries api se leli
      });
    };
    getCountriesData();
  },[]);

console.log(casesType);

  const onCountryChange = async(event) =>
  {
    const countryCode = event.target.value;
    setCountry(countryCode);


    
const url= 
countryCode==  'worldwide'?
"https://disease.sh/v3/covid-19/all" :

`https://disease.sh/v3/covid-19/countries/${countryCode}`;



 await fetch(url)
.then((response) => response.json())
.then((data)=> {
  setMapZoom(4);
  setCountry(countryCode); //jis country ka data chahiyr
  setCountryInfo(data); // uski info extract krli
  setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

 
  
  

});
  };

console.log("COUNTRY INFO >>>", countryInfo);






 
  return(
    <div className="app">
      <div className='app_left'>
      <div className='app_header'>
      <h1> COVID-19 TRACKER</h1>
      <FormControl className='app_dropdown'>
<Select variant="outlined" value={country}  onChange={onCountryChange}  >
 
<MenuItem value="worldwide">worldwide</MenuItem>

  {countries.map((country)=>(
    <MenuItem value={country.value}>{country.name}</MenuItem>

  ))}

</Select>
      </FormControl>

      </div>
     
     <div className='app_stats'>
    <Infobox title="coronavirus cases"  cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")} /> 

    <Infobox title="recovered"cases={countryInfo.todayRecovered} total={countryInfo.recovered}/> 
    <Infobox title="deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} /> 
    </div>
 
    <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
    </div>
    
<Card className='app_right'>
<h3>Live Cases By Country</h3>
<Table countries={tableData} />
<h3>Worldwide new {casesType}</h3>



</Card>
      
    </div>
  );

  };
export default App;
