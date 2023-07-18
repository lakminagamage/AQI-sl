import React from 'react'
import Paho from 'paho-mqtt';


const client = new Paho.Client(
  'hawkeyeinnovationsllc.ddns.net',
  Number(9001),
"Hawk-IoT-Client" + Math.random(1,1000000).toString()
);





client.connect( {
  
  // onSuccess: ()=> {
  //   //console.log('connected');
  // },
  userName: 'adam',
  password: 'Adamiowa21!',
  useSSL: false,
  reconnect: true,
  keepAliveInterval: 3600,
  

  onFailure: (err)=> {
    console.log('Failed to connect');
    alert('Something went Wrong. Please try again later')
    console.error(err);
  }

})

export {client}
