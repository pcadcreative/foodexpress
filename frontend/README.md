# Food Ordering System - React Frontend

## 🎨 Features

- **User Authentication**: Signup and Login
- **Restaurant Browsing**: View restaurants by city
- **Menu Display**: Browse food items with prices
- **Shopping Cart**: Add, update, and remove items
- **Order Placement**: Enter delivery address and place orders
- **Order History**: View all past orders with status
- **Recommendations**: Personalized suggestions based on order history

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Backend services running (Order Service on port 3001, Recommendation Service on port 3002)

### Installation

```bash
cd frontend
npm install
```

### Running the App

```bash
npm start
```

The app will open at **http://localhost:3000**

## 📱 Pages

### Authentication
- `/login` - User login
- `/signup` - New user registration

### Main Pages (Requires Login)
- `/` - Home page with restaurants
- `/restaurant/:id` - Restaurant menu
- `/cart` - Shopping cart and checkout
- `/orders` - Order history

## 🔗 API Integration

The frontend connects to:
- **Order Service**: http://localhost:3001/api
- **Recommendation Service**: http://localhost:3002/api

## 🎨 Design

- Clean, modern UI with gradient accents
- Responsive design
- Intuitive navigation
- Real-time cart updates

## 📂 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Navbar.js
│   │   ├── Home.js
│   │   ├── Restaurant.js
│   │   ├── Cart.js
│   │   └── Orders.js
│   ├── api.js          # API service
│   ├── App.js          # Main app with routing
│   ├── App.css         # Global styles
│   └── index.js        # Entry point
└── package.json
```

## 🔐 Authentication Flow

1. User signs up or logs in
2. JWT token stored in localStorage
3. Token sent with every API request
4. Auto-logout on invalid/expired token

## 🛒 Shopping Flow

1. Browse restaurants
2. Select restaurant and view menu
3. Add items to cart
4. Review cart and update quantities
5. Enter delivery address
6. Place order
7. View order in history

## 💾 Local Storage

- `token` - JWT authentication token
- `userId` - User ID
- `userName` - User's name

## 🎯 Features Implemented

✅ User authentication (signup/login)  
✅ Protected routes  
✅ Restaurant browsing with city filter  
✅ Menu display with vegetarian badges  
✅ Cart management (add, update, remove)  
✅ Order placement with address  
✅ Order history with status tracking  
✅ Personalized recommendations  
✅ Responsive navbar  
✅ Error handling  

## 🐛 Troubleshooting

### Backend not responding
- Ensure Order Service is running on port 3001
- Ensure Recommendation Service is running on port 3002
- Check backend logs for errors

### CORS Issues
- Backend already configured with CORS enabled
- If issues persist, check browser console

### Authentication Issues
- Clear localStorage and login again
- Check if token is expired (7 days validity)

## 🚀 Production Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## 📝 Notes

- Warnings about `useEffect` dependencies are expected and don't affect functionality
- The app requires backend services to be running
- Images are placeholders (emojis)

## 🎨 Customization

### Change Colors
Edit color variables in component CSS files:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Success: `#10b981`
- Error: `#ef4444`

### Change API URLs
Edit `src/api.js`:
```javascript
const API_BASE_URL = 'your-api-url';
const REC_BASE_URL = 'your-rec-url';
```

## 📦 Dependencies

- react
- react-router-dom
- axios (for API calls)

## 🌐 Deployment

### Deploy to Netlify/Vercel

1. Build the app: `npm run build`
2. Deploy `build` folder
3. Set environment variables if needed
4. Update API URLs in `api.js` to point to production backend

---

## Available Scripts

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
