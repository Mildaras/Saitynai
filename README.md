•	Projekto pavadinimas: Nekilnojamo turto aukcionas.

•	Funkciniai reikalavimai: 

## API Endpoints

### User Management

| Endpoint               | Description                                     | Access       |
|------------------------|-------------------------------------------------|--------------|
| `POST /users/register` | Registers a new user                            | Public       |
| `POST /users/login`    | Authenticates a user and returns a JWT          | Public       |
| `GET /users/profile`   | Retrieves the profile of the logged-in user     | Requires JWT |

### Region Management

| Endpoint                   | Description                                         | Access        |
|----------------------------|-----------------------------------------------------|---------------|
| `GET /regions`             | Lists all regions                                   | Public        |
| `POST /regions`            | Creates a new region                                | Admin only    |
| `PUT /regions/:regionId`   | Updates details of an existing region               | Admin only    |
| `DELETE /regions/:regionId`| Deletes a region                                    | Admin only    |

### Auction Management

| Endpoint                       | Description                                         | Access        |
|--------------------------------|-----------------------------------------------------|---------------|
| `GET /auctions`                | Lists all auctions                                  | Public        |
| `GET /auctions/:auctionId`     | Retrieves details of a specific auction             | Public        |
| `POST /auctions`               | Creates a new auction                               | Admin only    |
| `PUT /auctions/:auctionId`     | Updates an auction                                  | Admin only    |
| `DELETE /auctions/:auctionId`  | Deletes an auction                                  | Admin only    |

### Bid Management

| Endpoint                                 | Description                                        | Access             |
|------------------------------------------|----------------------------------------------------|--------------------|
| `POST /auctions/:auctionId/bids`         | Places a bid on an auction                         | Member only        |
| `GET /auctions/:auctionId/bids`          | Lists all bids for a specific auction              | Member/Admin       |
| `DELETE /auctions/:auctionId/bids/:bidId`| Cancels a bid if the auction is still open         | Member (owner)     |

---

### Notes

- **Public Access**: Available to all users without authentication.
- **Requires JWT**: Requires a valid JWT in the `Authorization` header.
- **Admin Only**: Requires the user to have an admin role.
- **Member Only**: Requires the user to have a member role, typically granted after registration.
- **Member (owner)**: Requires the user to have placed the bid they are attempting to cancel.

---
    
•	 Pasirinktų technologijų aprašymas:
1.	React.js – Dinamiškam UI, frontend.
2.	Node.js ir Express.js – API, backend.
3.	JWT (JSON Web Tokens) – patvirtinimui ir autentifikacijai.
4.	Cloud – nenusprendžiau.
5.  MonongoDB duomenu baze.
 

