// src/components/UserSettings.js

import React, { useState, useEffect } from 'react';
import './usersettings.css';

function UserSettings() {
    const [user, setUser] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        points: 0,
    });

    // Fetch user details and points from your backend and update the state
    useEffect(() => {
        // Retrieve the token from your custom route
        fetch('http://localhost:8080/api/user/retrieve-token', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            const yourAuthToken = data.token;
    
            // Fetch user details and points from your backend and update the state
            fetch('http://localhost:8080/api/user/singleuser', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${yourAuthToken}`,
                },
            })
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user details:', error));
        })
        .catch(error => console.error('Error fetching token:', error));
    }, []);
    
        // const redeemPoints = () => {
        //     // Replace this with an API call to redeem points on the backend
        //     fetch('/api/user/redeem-points', {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': `Bearer ${yourAuthToken}`,
        //         },
        //         body: JSON.stringify({ pointsToRedeem: user.points }),
        //     })
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log('Points redeemed successfully:', data.message);
        //             // Update the user's points or perform other actions as needed
        //             setUser(prevUser => ({ ...prevUser, points: 0 }));
        //         })
        //         .catch(error => console.error('Error redeeming points:', error));
        // };

        return (
            <div className="user-settings">
                <h2>User Settings</h2>
                <div className="user-details">
                    <div className="detail">
                        <p>Username:</p>
                        <p>{user.username}</p>
                    </div>
                    <div className="detail">
                        <p>Email:</p>
                        <p>{user.email}</p>
                    </div>
                    <div className="detail">
                        <p>Phone Number:</p>
                        <p>{user.phoneNumber}</p>
                    </div>
                    <div className="detail">
                        <p>Your Points:</p>
                        <p>{user.points}</p>
                    </div>
                </div>
                <button >Redeem Points</button>
            </div>
        );
    }

export default UserSettings;

// onClick={redeemPoints}