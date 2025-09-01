# CineCritic - Movie Review Platform Frontend

A modern, responsive movie review platform built with React, Tailwind CSS, and React Router.

## 🚀 Features

### Pages
- **Home**: Hero section with featured movies, stats, recent reviews, and call-to-action
- **Movie Listing**: Grid layout with search, filtering by genre, and sorting capabilities
- **Movie Details**: Comprehensive movie information with user reviews and rating system
- **Profile**: User dashboard with stats, recent reviews, watchlist, and favorites

### Components
- **Header**: Navigation bar with logo, menu, search bar, and mobile responsive design
- **Footer**: Contact information, social links, and site navigation

### Design Features
- Modern gradient backgrounds and card layouts
- Responsive design for mobile, tablet, and desktop
- Interactive elements with hover effects and animations
- Clean typography and consistent color scheme
- Star rating system for user reviews
- Search and filter functionality
- Modal forms for writing reviews

### Technical Features
- React Router for navigation between pages
- Component-based architecture
- Tailwind CSS for styling
- Custom CSS animations and effects
- Mobile-first responsive design
- SEO-friendly structure

## 🎨 Design System

### Colors
- Primary: Red (#EF4444)
- Secondary: Purple (#8B5CF6)
- Accent: Blue (#3B82F6)
- Neutral: Gray shades for text and backgrounds

### Typography
- Bold headings with gradient text effects
- Clean, readable body text
- Consistent font sizing and spacing

### Components
- Rounded corners and shadows for depth
- Hover effects and transitions
- Consistent button and form styling
- Card-based layouts

## 🛠️ Built With

- **React 19.1.1** - Frontend framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop computers (1024px+)
- Large screens (1200px+)

## 🎬 Sample Data

The application includes sample movie data and user reviews to demonstrate functionality. In a production environment, this would be replaced with actual API calls to your backend.

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) to view the application

## 📂 Project Structure

```
src/
├── components/
│   ├── Header.jsx       # Navigation header
│   └── Footer.jsx       # Site footer
├── pages/
│   ├── Home/
│   │   └── Home.jsx     # Landing page
│   ├── MovieListing/
│   │   └── MovieListing.jsx  # Movie grid with filters
│   ├── MovieDetails/
│   │   └── MovieDetails.jsx  # Individual movie page
│   └── Profile/
│       └── Profile.jsx  # User profile page
├── App.jsx              # Main app component with routing
├── main.jsx            # Application entry point
└── index.css           # Global styles and custom CSS
```

## 🔮 Future Enhancements

- User authentication and authorization
- Real-time notifications
- Advanced search with filters
- Social features (following users, sharing reviews)
- Movie recommendations based on user preferences
- Dark mode toggle
- PWA capabilities
- Backend integration with movie database APIs