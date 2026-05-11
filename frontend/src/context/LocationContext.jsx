import { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [userLocation, setUserLocationState] = useState(() => {
        return localStorage.getItem('userLocation') || '';
    });

    const normalizeCity = (city) => {
        if (!city) return '';
        const normalized = city.toLowerCase().replace(/\s/g, "");
        const cityMap = {
            bengaluru: "Bangalore",
            bangalore: "Bangalore",
            newdelhi: "Delhi",
            delhi: "Delhi",
            mumbai: "Mumbai",
            bombay: "Mumbai"
        };
        // Title case the original string if not in map
        return cityMap[normalized] || city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    };

    const setUserLocation = (city) => {
        const normalized = normalizeCity(city);
        setUserLocationState(normalized);
    };

    useEffect(() => {
        if (userLocation) {
            localStorage.setItem('userLocation', userLocation);
        } else {
            localStorage.removeItem('userLocation');
        }
    }, [userLocation]);

    return (
        <LocationContext.Provider value={{ userLocation, setUserLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export default LocationContext;
