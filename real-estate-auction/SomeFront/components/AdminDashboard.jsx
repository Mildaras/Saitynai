import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { checkAndRefreshToken } from '../utils/authUtils';

const AdminDashboard = () => {
    const [regions, setRegions] = useState([]);
    const [auctions, setAuctions] = useState({});
    const [bids, setBids] = useState({});
    const [newAuction, setNewAuction] = useState({ title: '', description: '', startingPrice: '', endDate: '', regionId: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newRegion, setNewRegion] = useState({ name: '', description: '' });


    useEffect(() => {
        const fetchRegions = async () => {
            try {
                setLoading(true);

                const accessToken = await checkAndRefreshToken();
                if (!accessToken) return;

                const regionsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/regions`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setRegions(regionsResponse.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching regions:', err.response?.data || err.message);
                setError('Failed to load regions.');
                setLoading(false);
            }
        };

        fetchRegions();
    }, []);

    const handleDelete = async (regionId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/regions/${regionId}`);
            setRegions((prevRegions) => prevRegions.filter((region) => region._id !== regionId));
        } catch (err) {
            console.error('Error deleting region:', err.response?.data || err.message);
        }
    };

    const handleEdit = async (regionId, updatedRegion) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/regions/${regionId}`, updatedRegion);
            setRegions((prevRegions) =>
                prevRegions.map((region) => (region._id === regionId ? response.data : region))
            );
        } catch (err) {
            console.error('Error editing region:', err.response?.data || err.message);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/regions`, newRegion);
            setRegions((prevRegions) => [...prevRegions, response.data]);
            setNewRegion({ name: '', description: '' }); // Reset form
        } catch (err) {
            console.error('Error creating region:', err.response?.data || err.message);
        }
    };

    const fetchAuctionsByRegion = async (regionId) => {
        try {
            const accessToken = await checkAndRefreshToken();
            if (!accessToken) return;

            const auctionsResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/auctions/${regionId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            setAuctions((prevAuctions) => ({
                ...prevAuctions,
                [regionId]: auctionsResponse.data,
            }));
        } catch (err) {
            console.error('Error fetching auctions:', err.response?.data || err.message);
        }
    };

    const fetchBidsForAuction = async (auctionId) => {
        try {
            const accessToken = await checkAndRefreshToken();
            if (!accessToken) return;

            const bidsResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/auctions/bids/${auctionId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            setBids((prevBids) => ({
                ...prevBids,
                [auctionId]: bidsResponse.data.sort((a, b) => b.amount - a.amount), // Descending order
            }));
        } catch (err) {
            console.error('Error fetching bids:', err.response?.data || err.message);
        }
    };

    const handleCreateAuction = async (e) => {
        e.preventDefault();

        if (!newAuction.regionId) {
            alert('Please select a region to create the auction.');
            return;
        }

        try {
            const accessToken = await checkAndRefreshToken();
            if (!accessToken) return;

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auctions/${newAuction.regionId}`,
                {
                    title: newAuction.title,
                    description: newAuction.description,
                    startingPrice: newAuction.startingPrice,
                    endDate: newAuction.endDate,
                },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            setAuctions((prevAuctions) => ({
                ...prevAuctions,
                [newAuction.regionId]: [...(prevAuctions[newAuction.regionId] || []), response.data],
            }));

            setNewAuction({ title: '', description: '', startingPrice: '', endDate: '', regionId: '' });
            alert('Auction created successfully!');
        } catch (err) {
            console.error('Error creating auction:', err.response?.data || err.message);
            alert('Failed to create auction. Please try again.');
        }
    };

    const handleEditAuction = async (auctionId, regionId, updatedAuction) => {
        try {
            const accessToken = await checkAndRefreshToken();
            if (!accessToken) return;

            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/auctions/${auctionId}`,
                updatedAuction,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            setAuctions((prevAuctions) => ({
                ...prevAuctions,
                [regionId]: prevAuctions[regionId].map((auction) =>
                    auction._id === auctionId ? response.data : auction
                ),
            }));

            alert('Auction updated successfully!');
        } catch (err) {
            console.error('Error editing auction:', err.response?.data || err.message);
            alert('Failed to edit auction. Please try again.');
        }
    };

    const handleDeleteAuction = async (auctionId, regionId) => {
        try {
            const accessToken = await checkAndRefreshToken();
            if (!accessToken) return;

            await axios.delete(`${process.env.REACT_APP_API_URL}/auctions/${auctionId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            setAuctions((prevAuctions) => ({
                ...prevAuctions,
                [regionId]: prevAuctions[regionId].filter((auction) => auction._id !== auctionId),
            }));

            alert('Auction deleted successfully!');
        } catch (err) {
            console.error('Error deleting auction:', err.response?.data || err.message);
            alert('Failed to delete auction. Please try again.');
        }
    };

    const handleDeleteBid = async (bidId, auctionId) => {
        try {
            const accessToken = await checkAndRefreshToken();
            if (!accessToken) return;

            await axios.delete(
                `${process.env.REACT_APP_API_URL}/auctions/${auctionId}/${bidId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            setBids((prevBids) => ({
                ...prevBids,
                [auctionId]: prevBids[auctionId].filter((bid) => bid._id !== bidId),
            }));

            alert('Bid deleted successfully!');
        } catch (err) {
            console.error('Error deleting bid:', err.response?.data || err.message);
            alert('Failed to delete bid. Please try again.');
        }
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            {/* Create New Auction Form */}
            <div className="create-auction">
                <h2>Create New Auction</h2>
                <form onSubmit={handleCreateAuction}>
                    <div>
                        <label>Title</label>
                        <input
                            type="text"
                            value={newAuction.title}
                            onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
                            placeholder="Enter auction title"
                            required
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <input
                            type="text"
                            value={newAuction.description}
                            onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
                            placeholder="Enter auction description"
                            required
                        />
                    </div>
                    <div>
                        <label>Starting Price</label>
                        <input
                            type="number"
                            value={newAuction.startingPrice}
                            onChange={(e) => setNewAuction({ ...newAuction, startingPrice: e.target.value })}
                            placeholder="Enter starting price"
                            required
                        />
                    </div>
                    <div>
                        <label>End Date</label>
                        <input
                            type="date"
                            value={newAuction.endDate}
                            onChange={(e) => setNewAuction({ ...newAuction, endDate: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Region</label>
                        <select
                            value={newAuction.regionId}
                            onChange={(e) => setNewAuction({ ...newAuction, regionId: e.target.value })}
                            required
                        >
                            <option value="">Select a Region</option>
                            {regions.map((region) => (
                                <option key={region._id} value={region._id}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Create Auction</button>
                </form>
            </div>

            {/* List of Regions and Auctions */}
            {regions.map((region) => (
                <div key={region._id} className="region">
                    <h2>{region.name}</h2>
                    <p>{region.description}</p>
                    <button
                        onClick={() => fetchAuctionsByRegion(region._id)}
                        className="btn-view-auctions"
                    >
                        View Auctions
                    </button>

                    {auctions[region._id] && (
                        <div className="auctions">
                            <h3>Auctions in {region.name}</h3>
                            <ul>
                                {auctions[region._id].map((auction) => (
                                    <li key={auction._id} className="auction-item">
                                        <p>Title: {auction.title}</p>
                                        <p>Description: {auction.description}</p>
                                        <p>Starting Price: ${auction.startingPrice}</p>
                                        <p>End Date: {new Date(auction.endDate).toLocaleDateString()}</p>

                                        <button
                                            onClick={() => fetchBidsForAuction(auction._id)}
                                            className="btn-view-bids"
                                        >
                                            View Bids
                                        </button>

                                        {/* List of Bids */}
                                        {bids[auction._id] && (
                                            <div className="bids">
                                                <h4>Bids for {auction.title}</h4>
                                                <ul>
                                                    {bids[auction._id].map((bid) => (
                                                        <li key={bid._id}>
                                                            <p>Bid Amount: ${bid.amount}</p>
                                                            <p>Placed By: {bid.userId?.username || 'Unknown User'}</p>
                                                            <button
                                                                onClick={() => handleDeleteBid(bid._id, auction._id)}
                                                                className="btn-delete-bid"
                                                            >
                                                                Delete Bid
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <button
                                            onClick={() =>
                                                handleEditAuction(auction._id, region._id, {
                                                    title: prompt('Enter new title:', auction.title),
                                                    description: prompt('Enter new description:', auction.description),
                                                    startingPrice: prompt(
                                                        'Enter new starting price:',
                                                        auction.startingPrice
                                                    ),
                                                    endDate: prompt('Enter new end date:', auction.endDate),
                                                })
                                            }
                                            className="btn-edit-auction"
                                        >
                                            Edit Auction
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAuction(auction._id, region._id)}
                                            className="btn-delete-auction"
                                        >
                                            Delete Auction
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}

            {/* Create New Region Form */}
            <div className="create-region">
                <h2>Create New Region</h2>
                <form onSubmit={handleCreate}>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            value={newRegion.name}
                            onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <input
                            type="text"
                            value={newRegion.description}
                            onChange={(e) => setNewRegion({ ...newRegion, description: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit">Create Region</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
