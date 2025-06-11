import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});


export const fetchRegions = () => API.get('/regions');
export const fetchAuctions = (regionId) => API.get(`/auctions/${regionId}`);
export const fetchAuctionDetails = (auctionId) => API.get(`/auctions/${auctionId}/details`);
export const placeBid = (auctionId, bidData, token) =>
    API.post(`/auctions/${auctionId}`, bidData, {
        headers: { Authorization: `Bearer ${token}` },
    });
