import React from 'react'
import Paho from 'paho-mqtt';


const client = new Paho.Client(
  'b69a9028cdf14a568cc5abf9603dde1c.s1.eu.hivemq.cloud',
  Number(8884),
"AQI-client" + Math.random(1,1000000).toString()
);





client.connect( {
  
  onSuccess: ()=> {
    console.log('connected');
  },
  userName: 'aqi-app',
  password: 'aqi-uom23LK',
  useSSL: true,
  reconnect: true,
  keepAliveInterval: 60,
  

  onFailure: (err)=> {
    console.log('Failed to connect');
    alert('Something went Wrong. Please try again later')
    console.error(err);
  }

})

export {client}
