/**
 * Dashboard Page Component
 * Shows user balance with confetti animation
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, authAPI } from '../utils/api';
import Confetti from '../components/Confetti';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCheckBalance = async () => {
    setLoading(true);
    setError('');
    setBalance(null);
    setShowConfetti(false);

    try {
      const response = await userAPI.getBalance();
      
      if (response.success) {
        setBalance(response.balance);
        // Trigger confetti animation
        setShowConfetti(true);
        // Hide confetti after animation completes
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid, redirect to login
        navigate('/login', { state: { message: 'Session expired. Please login again.' } });
      } else {
        setError(err.response?.data?.message || 'Failed to fetch balance. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login', { state: { message: 'Logged out successfully.' } });
    } catch (err) {
      // Even if logout fails, redirect to login
      navigate('/login');
    }
  };

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      <Confetti active={showConfetti} />
      
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>🏦 KodbBank</h1>
          <h2>Your Dashboard</h2>
        </div>

        <div className="dashboard-content">
          {error && <div className="error-message">{error}</div>}

          <div className="balance-section">
            {balance !== null ? (
              <div className="balance-display">
                <p className="balance-label">Your balance is:</p>
                <p className="balance-amount">{formatBalance(balance)}</p>
              </div>
            ) : (
              <div className="balance-placeholder">
                <p>Click the button below to check your balance</p>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckBalance}
            className="check-balance-btn"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Check Balance'}
          </button>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
