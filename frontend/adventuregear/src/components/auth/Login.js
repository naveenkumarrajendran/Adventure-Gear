// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, verifyOTP } from '../api';
import '../styles/Login.css';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import profileDp from '../assets/profile.jpeg'; 

// Authentication helper functions
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please fill in both fields.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password, phoneNumber });
      if (response.otpRequired) {
        setIsOtpRequired(true);
        setMessage('OTP sent to your phone. Please verify.');
      } else {
        saveToken(response.token);
        saveUser(response.user);
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      setMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage('Please enter the OTP.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await verifyOTP({ email, otp });
      if (!response.token) {
        throw new Error('Token missing in response');
      }
      saveToken(response.token);
      saveUser(response.user);
      if (rememberMe) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
      }
      setMessage('OTP verified successfully');
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setMessage('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          border: '2px solid #000', 
          borderRadius: 0, 
          boxShadow: 'none',
        }}
      >
        {/* Profile Display Picture */}
        <Box
          sx={{
            width: 100,
            height: 100,
            mb: 2,
            borderRadius: '50%', 
            overflow: 'hidden',
            border: '2px solid #FFD600', 
          }}
        >
          <img
            src={profileDp}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        <Typography variant="h4" gutterBottom sx={{ color: '#000' }}>
          Login
        </Typography>

        {message && (
          <Alert severity={isLoading ? 'info' : 'error'} sx={{ mb: 2, borderRadius: 0 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                {message}
              </Box>
            ) : (
              message
            )}
          </Alert>
        )}

        {isOtpRequired ? (
          <form onSubmit={handleVerifyOTP} style={{ width: '100%' }}>
            <TextField
              label="OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
              InputProps={{ sx: { borderRadius: 0 } }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 2,
                backgroundColor: '#000',
                color: '#FFD600',
                borderRadius: 0,
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Verify OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              InputProps={{ sx: { borderRadius: 0 } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              InputProps={{ sx: { borderRadius: 0 } }}
            />
            {message === 'Phone number is required for MFA' && (
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                margin="normal"
                InputProps={{ sx: { borderRadius: 0 } }}
              />
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  name="rememberMe"
                  color="primary"
                  sx={{ p: 0 }}
                />
              }
              label="Remember me"
              sx={{ m: 0, mt: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 2,
                backgroundColor: '#000',
                color: '#FFD600',
                borderRadius: 0,
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Login
            </Button>
          </form>
        )}

        <Typography variant="body2" sx={{ mt: 2, color: '#000' }}>
          Don't have an account?{' '}
          <Button
            variant="text"
            onClick={() => navigate('/register')}
            sx={{ p: 0, color: '#000', textTransform: 'none' }}
          >
            Register here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
