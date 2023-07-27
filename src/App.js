import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import './styles.css';
import Login from './Login.js';
import feedbackApi from './services/feedbackAPI';
import lastProductsAPI from './services/lastProductsAPI';
import checkTokenValidity from './Token.js';

function App() {

  const initialToken = localStorage.getItem('token') || '';
  const [token, setToken] = useState(initialToken);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState([]);
  const [lastProducts, setLastProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [lastExpandedIndex, setLastExpandedIndex] = useState(-1);

  function logout() {
    // Remove token from state
    setToken('');

    // Remove token from localStorage (or sessionStorage)
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  async function handleSearch() {
    if (input === '') {
      setError('Select an ASIN');
      return;
    }

    // Validate token before search   
    const storedToken = localStorage.getItem('token');
    const isValidToken = await checkTokenValidity(storedToken);
    if (!isValidToken) {
      logout(); // Clear invalid token and logout
      setError('Session expired. Please log in again.');
      return; // Terminate handleSearch function
    }
    try {
      setLoading(true);
      setError('');

      // Simulating an API request with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const config = {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        },
        params: { asin: input }
      };

      // Mock API response data for testing
      const response = await feedbackApi.get('', config);
      const productsWithReviews = response.data.map((product) => ({
        ...product,
        reviewEntity: product.reviewEntity,
      }));

      if (productsWithReviews.length === 0) {
        setError('No feedback found for this product');
        return;
      }

      setProducts(productsWithReviews);

      setInput('');

      // Scroll to the feedback section
      window.location.href = '#feedbackSection';
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setError('Product with the given ASIN not found.');
      } else {
        setError('Search Error!');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setError('');

    async function fetchLastProducts() {
      try {
        // Simulating an API request with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock API response data for testing
        const response = await lastProductsAPI.get();
        setLastProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch last products:', error);
      }
    }

    (async () => {
      const storedToken = localStorage.getItem('token');
      const isValid = await checkTokenValidity(storedToken);
      if (!isValid) {
        logout(); // If the token is not valid, logout immediately.
      }
    })();

    fetchLastProducts();
  }, []);

  // Render the login page if token does not exist
  if (!token) {
    return <Login setToken={setToken} />;
  }

  const handleToggleCollapse = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const handleLastToggleCollapse = (index) => {
    setLastExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value.toUpperCase());
  };

  return (

    <div className="mainContainer">


      <div className="userContainer">
        <div className="userGreeting">
          <span className="welcomeText">Welcome back,</span>
          <span className="username">{localStorage.getItem('username')}</span>
        </div>
        <button className="logoutButton" onClick={logout}>Log Out</button>
      </div>


      {/* <button className="logoutButton" onClick={logout}>Logout</button> */}
      <section className="searchSection">
        <div className="container">
          <h1 className="title">Search Product by ASIN</h1>
          <div className="containerInput">
            <input
              type="text"
              placeholder="Ex: B07FKJB4GM"
              value={input}
              onChange={handleInputChange}
            />
            <button className="buttonSearch" onClick={handleSearch}>
              <FiSearch size={25} color="#FFF" />
            </button>
          </div>

          {loading && <div className="spinner"></div>}
          {error && <div className="error">{error}</div>}
        </div>
      </section>

      <section className="productSection" id="feedbackSection">
        <div className="container">
          {products.length > 0 && (
            <div>
              <h2 className="sectionTitle">Product Search Result</h2>
              <main className="main">
                <div className="product">
                  <h2 className="productTitle">{products[0].name}</h2>
                  <button
                    className="collapseButton"
                    onClick={() => handleToggleCollapse(0)}
                  >
                    <FiChevronDown
                      size={16}
                      className={expandedIndex === 0 ? 'rotateIcon' : ''}
                    />
                  </button>
                </div>
                <div>
                  <p className="price">{products[0].price}</p><br></br>
                  <p className="description align-left">
                    {products[0].description.split(' | ').map((item, index) => (
                      <span key={index}>
                        &#8226; {item}<br />
                      </span>
                    ))}
                  </p>
                </div>
                {expandedIndex === 0 && (
                  <div className="feedbackContainer">
                    {products.map((product, index) => (
                      <div className="feedback" key={index}>
                        <span className="customerName">
                          {product.reviewEntity.customerName}
                        </span>
                        <span className="feedbackText">
                          : {product.reviewEntity.feedBack}
                        </span>
                        <br />
                        <span className="feedbackDateAndReview">
                          {product.reviewEntity.feedBackDate}
                        </span>
                        <span className="feedbackRating">
                          {product.reviewEntity.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </main>
            </div>
          )}
        </div>
      </section>

      <section className="lastProductsSection">
        <div className="container">
          <h2 className="sectionTitle">Last Products</h2>
          {lastProducts.length > 0 ? (
            lastProducts.map((product, index) => (
              <main className="main" key={index}>
                <div className="product">
                  <h2 className="productTitle">{product.name}</h2>
                  <button
                    className="collapseButton"
                    onClick={() => handleLastToggleCollapse(index)}
                  >
                    <FiChevronDown
                      size={16}
                      className={
                        lastExpandedIndex === index ? 'rotateIcon' : ''
                      }
                    />
                  </button>
                </div>
                <div>
                  <p className="price">{product.price}</p><br></br>
                  <p className="description align-left">
                    {product.description.split(' | ').map((item, index) => (
                      <span key={index}>
                        &#8226; {item}<br />
                      </span>
                    ))}
                  </p>
                </div>
                {lastExpandedIndex === index && product.reviews && (
                  <div className="feedbackContainer">
                    {product.reviews.map((review, reviewIndex) => (
                      <div className="feedback" key={reviewIndex}>
                        <span className="customerName">{review.customerName}</span>
                        <span className="feedbackText">
                          : {review.feedBack}
                        </span>
                        <br />
                        <span className="feedbackDateAndReview">
                          {review.feedBackDate}
                        </span>
                        <span className="feedbackRating">{review.rating}</span>
                      </div>
                    ))}
                  </div>
                )}
              </main>
            ))
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
      </section>
      <footer>
        <p>Interested in learning more about UX? Check out our courses <a href="link-to-courses">here</a>.</p>
      </footer>
    </div>
  );
}

export default App;