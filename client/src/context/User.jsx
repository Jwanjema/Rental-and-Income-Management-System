import React, { createContext, useState } from 'react';
// useEffect is no longer needed since we aren't fetching the session

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // 1. Force the user object to a non-null value (logged-in state).
    const [user, setUser] = useState({ id: 999, username: 'temp_admin', currency: 'USD' });
    
    // 2. Force isLoading to false immediately.
    const [isLoading, setIsLoading] = useState(false);
    
    // The previous useEffect hook (which caused the errors) is removed.

    if (isLoading) {
        // This block will now never execute because isLoading is false.
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
        // The app is immediately given a non-null user and told it's done loading.
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};