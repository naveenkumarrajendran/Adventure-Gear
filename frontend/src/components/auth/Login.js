import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, verifyOTP } from '../api';
import { saveToken, saveUser } from '../services/authService';
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
    <Container className="login-container">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {message && (
          <Alert severity={isLoading ? 'info' : 'error'} sx={{ mb: 2 }}>
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
          <form onSubmit={handleVerifyOTP}>
            <TextField
              label="OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              Verify OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            {message === 'Phone number is required for MFA' && (
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                margin="normal"
              />
            )}
             <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  name="rememberMe"
                  color="primary"
                />
              }
              label="Remember me"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              Login
            </Button>
          </form>
          
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Button
            variant="text"
            onClick={() => navigate('/register')} 
            sx={{ padding: 0 }}
          >
            Register here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;