import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import NewUserRegistration from './components/Layout/NewUserRegistration';

// Inject Tailwind CSS (or ensure it's imported in your main index.css/index.js)
// For demonstration, we'll keep the custom styles and script logic here for initial setup.

const App = () => {
  // State to manage the selected category (Traveller or Service Provider)
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Registration submitted for category:', selectedCategory);
    // Add form submission logic here
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header/Navbar */}
        <Header />

        {/* Main Scrollable Content */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
          <NewUserRegistration 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default App;