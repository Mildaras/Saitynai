import React, { useEffect, useState } from 'react'; // Ensure useState is imported
import { fetchRegions } from '../services/api';
import { Link } from 'react-router-dom';
import '../styles/main.css';

const RegionList = () => {
    const [regions, setRegions] = useState([]);
    useEffect(() => {
        const getRegions = async () => {
            try {
                const { data } = await fetchRegions();
                console.log('Regions fetched:', data);
                setRegions(data);
            } catch (error) {
                console.error('Error fetching regions:', error);
            }
        };
        getRegions();
    }, []);

    return (
        <div className="region-list">
            <h2>Regions</h2>
            <ul>
                {regions.map((region) => (
                    <li key={region._id} ><Link to={`/regions/${region._id}`}>{region.name}</Link></li>
                ))}
            </ul>
        </div>
    );
};

export default RegionList;
