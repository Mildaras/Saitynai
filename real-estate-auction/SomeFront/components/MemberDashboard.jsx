import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { checkAndRefreshToken } from '../utils/authUtils';

const MemberDashboard = () => {
    const [regions, setRegions] = useState([]);
    const [auctions, setAuctions] = useState({});
    const [bids, setBids] = useState({});
    const [newBid, setNewBid] = useState({ amount: '', auctionId: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                [auctionId]: bidsResponse.data,
            }));
        } catch (err) {
            console.error('Error fetching bids:', err.response?.data || err.message);
        }
    };

    const handlePlaceBid = async (e) => {
        e.preventDefault();

        if (!newBid.auctionId || !newBid.amount) {
            alert('Please select an auction and enter a bid amount.');
            return;
        }

        try {
            const accessToken = await checkAndRefreshToken();
            if (!accessToken) return;

            await axios.post(
                `${process.env.REACT_APP_API_URL}/auctions/bids/${newBid.auctionId}`,
                {
                    amount: newBid.amount,
                },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            alert('Bid placed successfully!');
            setNewBid({ amount: '', auctionId: '' });

            // Refresh bids for the auction
            fetchBidsForAuction(newBid.auctionId);
        } catch (err) {
            console.error('Error placing bid:', err.response?.data || err.message);
            alert('Failed to place bid. Please try again.');
        }
    };

    const handleCancelBid = async (bidId, auctionId) => {
        try {
            const accessToken = await checkAndRefreshToken();
            if (!accessToken) return;

            await axios.delete(
                `${process.env.REACT_APP_API_URL}/auctions/${auctionId}/${bidId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            // Update bids after cancellation
            setBids((prevBids) => ({
                ...prevBids,
                [auctionId]: prevBids[auctionId].filter((bid) => bid._id !== bidId),
            }));

            alert('Bid canceled successfully!');
        } catch (err) {
            console.error('Error canceling bid:', err.response?.data || err.message);
            alert('Failed to cancel bid. Please try again.');
        }
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="member-dashboard">
            <h1>Member Dashboard</h1>

            {/* List of Regions */}
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

                    {/* List of Auctions for the Region */}
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
                                                            <p>Placed By: {bid.userId?.username || 'You'}</p>
                                                            {bid.userId?._id === JSON.parse(localStorage.getItem('user'))?._id && (
                                                                <button
                                                                    onClick={() => handleCancelBid(bid._id, auction._id)}
                                                                    className="btn-cancel-bid"
                                                                >
                                                                    Cancel Bid 
                                                                </button>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Bid Form */}
                                        <form
                                            onSubmit={(e) => {
                                                setNewBid((prevBid) => ({ ...prevBid, auctionId: auction._id }));
                                                handlePlaceBid(e);
                                            }}
                                        >
                                            <input
                                                type="number"
                                                value={newBid.amount}
                                                onChange={(e) =>
                                                    setNewBid((prevBid) => ({ ...prevBid, amount: e.target.value }))
                                                }
                                                placeholder="Enter your bid"
                                                required
                                            />
                                            <button type="submit" className="btn-place-bid">
                                                Place Bid
                                            </button>
                                        </form>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MemberDashboard;
