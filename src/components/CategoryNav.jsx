import { NavLink, useLocation } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import '../styles/CategoryNav.css';

const CategoryNav = ({ categories = [], currentCategory }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  // Check if we should show scroll indicators
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollLeft(container.scrollLeft > 10);
      setShowScrollRight(
        container.scrollWidth > container.clientWidth + container.scrollLeft
      );
    };

    // Initial check
    handleScroll();

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 200; // Adjust this value as needed
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  // Get the current category name for mobile view
  const currentCategoryName = currentCategory 
    ? categories.find(cat => cat.id === currentCategory)?.name 
    : 'All Products';

  return (
    <div className="category-nav-container">
      <nav 
        className={`category-nav ${isScrolled ? 'scrolled' : ''}`}
        ref={scrollContainerRef}
      >
        <div className="category-list">
          {categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={cat.id === 'all' ? '/' : `/products/category/${cat.id}`}
              className={({ isActive }) => 
                `category-link ${isActive || currentCategory === cat.id ? 'active' : ''}`
              }
            >
              {cat.name}
              {typeof cat.count === 'number' && (
                <span className="category-count">
                  ({cat.count})
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
      
      {/* Scroll indicators */}
      {showScrollLeft && (
        <button 
          className="scroll-button scroll-left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <FiChevronRight className="icon" />
        </button>
      )}
      
      {showScrollRight && (
        <button 
          className="scroll-button scroll-right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <FiChevronRight className="icon" />
        </button>
      )}
      
      {/* Mobile category selector */}
      <div className="mobile-category-selector">
        <span className="current-category">{currentCategoryName}</span>
        <FiChevronRight className="dropdown-icon" />
        <select
          value={currentCategory || ''}
          onChange={(e) => {
            const path = e.target.value 
              ? `/products/category/${e.target.value}` 
              : '/products';
            window.location.href = path;
          }}
          className="category-select"
          aria-label="Select category"
        >
          <option value="">All Products</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategoryNav;
