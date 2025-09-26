import React, { createContext, useState, useEffect } from 'react';
import { checkSession } from '../api'; // Import the new helper function

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Use the API helper function to handle the full URL construction
        checkSession() 
        .then(data => {
            // If the backend returns user data, set it. Otherwise, set null.
            if (data && Object.keys(data).length > 0) {
                setUser(data);
            } else {
                setUser(null);
            }
        })
        .catch(error => {
            // On any error (including 401), ensure the user is null
            console.error("Session check failed:", error);
            setUser(null);
        })
        .finally(() => {
            // Stop loading state regardless of the result
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                fontSize: '24px' 
            }}>
                Loading Application...
            </div>
        );
    }

    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};