import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/check_session", { credentials: 'include' })
            .then(r => {
                if (r.ok) {
                    if (r.status === 204) { setUser(null); }
                    else { r.json().then(setUser); }
                } else { setUser(null); }
            })
            .catch(error => { console.error("Session check failed:", error); setUser(null); })
            .finally(() => { setIsLoading(false); });
    }, []);

    if (isLoading) { return <h1>Loading Application...</h1>; }

    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};