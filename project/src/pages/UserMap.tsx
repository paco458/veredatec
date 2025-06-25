// src/pages/UserMap.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
};

const defaultCenter = {
    lat: -34.6037,
    lng: -58.3816,
};

const UserMap: React.FC = () => {
    const [location, setLocation] = useState<google.maps.LatLngLiteral>(defaultCenter);

    const getUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocation(defaultCenter);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            () => {
                setLocation(defaultCenter);
            }
        );
    }, []);

    useEffect(() => {
        getUserLocation();
    }, [getUserLocation]);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={location}
                zoom={14}
                options={{ streetViewControl: false, mapTypeControl: false }}
            >
                <Marker position={location} />
            </GoogleMap>
        </LoadScript>
    );
};

export default UserMap;
