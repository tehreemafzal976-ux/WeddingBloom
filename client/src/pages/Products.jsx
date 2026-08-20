import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import PublicFooter from "../components/layout/PublicFooter";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config/api";
import { FaSearch, FaStar, FaHeart, FaShoppingCart, FaFilter, FaRedo } from "react-icons/fa";
import "./Products.css";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortOption, setSortOption] = useState("newest");
  const [favoritesMap, setFavoritesMap] = useState({});

  const categoriesList = [
    "All",
    "Wedding Dresses",
    "Jewelry",
    "Makeup",
    "Mehndi",
    "Photography",
    "Decoration",
    "Catering",
    "Invitations",
    "Wedding Shoes",
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortOption]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/products?sort=${sortOption}`;
      if (selectedCategory && selectedCategory !== "All") {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    if (!requireAuth("Please sign up or log in first to add products to your cart.")) return;
    addToCart(product);
    alert(`Added "${product.name}" to your cart!`);
  };

  const handleToggleFavorite = (product) => {
    if (!requireAuth("Please sign up or log in first to save favorites.")) return;
    setFavoritesMap((prev) => ({ ...prev, [product.id]: !prev[product.id] }));
  };

  const handleViewDetails = (productId) => {
    if (!requireAuth("Please sign up or log in first to view full product details.")) return;
    navigate(`/products/${productId}`);
  };

  return (
    <div className="marketplace-page">
      <PublicNavbar />

      {/* HEADER BANNER */}
      <div className="marketplace-banner">
        <div className="banner-container">
          <h1>Wedding Products Marketplace</h1>
          <p>Explore exclusive bridal fashion, luxury jewelry, custom invitations, and wedding essentials.</p>

          {/* SEARCH BAR */}
          <form className="marketplace-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products by name, dress style, jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="marketplace-body">
        <div className="marketplace-container">
          {/* SIDEBAR FILTERS */}
          <aside className="filters-sidebar">
            <div className="filter-block">
              <h3><FaFilter /> Categories</h3>
              <ul className="category-filter-list">
                {categoriesList.map((cat) => (
                  <li key={cat}>
                    <button
                      className={selectedCategory === cat ? "active" : ""}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchParams(cat !== "All" ? { category: cat } : {});
                      }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-block">
              <h3>Sort By</h3>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-select">
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="products-main">
            <div className="results-header">
              <span>Showing {products.length} wedding products</span>
              {selectedCategory !== "All" && (
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setSearchParams({});
                  }}
                >
                  <FaRedo /> Clear Filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="loading-state">Loading products...</div>
            ) : products.length > 0 ? (
              <div className="products-marketplace-grid">
                {products.map((prod) => (
                  <div className="marketplace-product-card" key={prod.id}>
                    <div className="card-image-box">
                      <img src={prod.image} alt={prod.name} />
                      {prod.original_price && prod.original_price > prod.price && (
                        <span className="card-discount-tag">
                          {Math.round(((prod.original_price - prod.price) / prod.original_price) * 100)}% OFF
                        </span>
                      )}
                      <button
                        className={`card-fav-btn ${favoritesMap[prod.id] ? "active" : ""}`}
                        onClick={() => handleToggleFavorite(prod)}
                        title="Add to Favorites"
                      >
                        <FaHeart />
                      </button>
                    </div>

                    <div className="card-content">
                      <span className="card-cat">{prod.category}</span>
                      <h3 className="card-title">{prod.name}</h3>
                      <div className="card-rating">
                        <FaStar className="star" /> {prod.rating || 4.9}
                      </div>

                      <div className="card-price-row">
                        <span className="price-current">PKR {Number(prod.price).toLocaleString()}</span>
                        {prod.original_price && (
                          <span className="price-old">PKR {Number(prod.original_price).toLocaleString()}</span>
                        )}
                      </div>

                      <div className="card-actions">
                        <button className="cart-add-btn" onClick={() => handleAddToCart(prod)}>
                          <FaShoppingCart /> Add to Cart
                        </button>
                        <button className="details-btn" onClick={() => handleViewDetails(prod.id)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-products-state">
                <h3>No products found</h3>
                <p>Try searching for a different term or choosing another category.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default Products;
