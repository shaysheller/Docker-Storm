import React, {useState, useEffect} from 'react';
import { renderMatches, useNavigate } from 'react-router-dom';

interface Props {
    setApiKey: (value: string) => void;
    setGrafUrl: (value: string) => void;
    grafUrl: string;
    apiKey: string;
  
  }

const InitialSetup = (props: Props) => {
  const[currentApi, setCurrentApi] = useState(props.apiKey);
  const[currentGrafUrl, setCurrentGrafUrl] = useState(props.grafUrl);
  const[validInput, setValidInput] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    if(props.apiKey && props.grafUrl) navigate('/app');
  }, []);




  // request to either create or edit the .env
  const handleSubmit = () => {
    if(!currentApi || !currentGrafUrl) {
      setValidInput(true);
      return;
    }

    const body = {
      apiKey: currentApi,
      grafUrl: currentGrafUrl
    };
    
    props.setApiKey(currentApi);
    props.setGrafUrl(currentGrafUrl);

    fetch('/user/env', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body),
    }).then(() => {
      navigate('/app');
    });
  };


  // render when there is no graf api key in the .env file
  const renderApiKey = () => {
    return (
      <div>
        Please enter your Grafana Api Key
        <input type='text' 
          placeholder='Grafana Api Key' 
          onChange={input => setCurrentApi(input.target.value)} 
          value={currentApi}/>
      </div>
    );
  };

  // render when there is no pg uri in .env file
  const renderGrafUrl = () => {
    return (
      <div>
        <strong>Please enter your Grafana URL.</strong> <br></br> 
        Please enter in the form of http://localhost:XXXX/
         or http://[IP ADDRESS]/ or http://[URL]/ . <br></br>
        Please do not add anything after the final / .  
      
        <input type='text' 
          placeholder='GRAFANA URL' 
          onChange={input => setCurrentGrafUrl(input.target.value)} 
          value={currentGrafUrl}/>
      </div>
    );
  };

  //   GRAFANA_API_KEY = 'eyJrIjoiQ05EQU9DT3FubG9ycHZnM1V5ZDhtQ0NkNE9valFWbW4iLCJuIjoiZG9ja2Vyc3Rvcm0iLCJpZCI6MX0='
  // GRAFANA_URL = 'http://localhost:3000/'

  return(
    <div>

      <form onSubmit={(e) => e.preventDefault()}>
        {!props.apiKey && renderApiKey()}
        {!props.grafUrl && renderGrafUrl()}
        <button onClick={handleSubmit}>SUBMIT</button>
        {validInput && <div>Please fill out field(s) before submitting</div>}
      </form>




    </div>
  );
};

export default InitialSetup;