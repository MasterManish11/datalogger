'use client'
import React, { useState } from 'react'

const GetApi = () => {
    const [data,setData] = useState([])
    const callApi = async (event) => {
        try {
          // Prevent the default form submission behavior
          event.preventDefault();
      
          // Define the API endpoint
          const apiUrl = "/api/gettrail";
      
          // Prepare the request options
          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
           
          };
      
          // Make the API request
          const response = await fetch(apiUrl, requestOptions);
      
          // Check if the request was successful (status code 2xx)
          if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
          }
      
          // Parse the JSON response
          const responseData = await response.json();
      
          // Update state with the response data
          setData(responseData);
      
        } catch (error) {
          // Handle errors, e.g., log them or show an error message to the user
          console.error("Error in showResult:", error);
        }
      };


  return (
    <div>
      <h1>api call</h1>
      <button onClick={callApi}>Call api</button>
       {
        data && data.map((d,i)=>
        <li key={i}>{d.kwhr}</li>
        )
       }     

    </div>
  )
}

export default GetApi
