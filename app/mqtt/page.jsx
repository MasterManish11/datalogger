'use client'
import React, { useState, useEffect } from 'react';
import mqtt from "precompiled-mqtt";

const MQTT = () => {
    const URL = "tcp://broker.mqtt.cool:1883";
    const [client, setClient] = React.useState(null);
    const [connectStatus, setConnectStatus] = React.useState(null);

  useEffect(() => {
    mqttConnect();
  }, []);


const mqttConnect = () => {
    const client = mqtt.connect(URL, {
      // clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
      connectTimeout: 5000,
      hostname: "tcp://broker.mqtt.cool:1883",
      port: 8000,
      path: "/mqtt",
    });
    setClient(client);
  };

useEffect(() => {
    if (client) {
      client.on("connect", () => {
        console.log("connected");
        setConnectStatus("Connected");
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        console.log("payload", payload);
      });
    }
  }, [client]);



  client.on("reconnect", () => {
    setConnectStatus("Reconnecting");
  });
client.subscribe(`ChannelName`, () => {                        // 'car', 'car/' , 'chatIst' ...
        
        client.on("message", (topic, message, packet) => {
          console.log("message:", JSON.parse(message));
          
        });
      });
  return (
    <div>
        <div>
      <h2>MQTT Data</h2>
      <p>Topic: {topic}</p>
      <p>Message: {message}</p>
    </div>
    </div>
  )
}

export default MQTT
