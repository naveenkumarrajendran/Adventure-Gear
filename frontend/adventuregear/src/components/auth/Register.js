// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Snackbar,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/system';
import '../styles/Register.css';
import { loginUser, registerUser } from '../api';
import profileDp from '../assets/profile.jpeg'; 


const StyledButton = styled(Button)({
  marginTop: '20px',
  padding: '12px 30px',
  fontSize: '16px',
  letterSpacing: '1px',
  borderRadius: 0,
  backgroundColor: '#000',
  color: '#FFD600',
  '&:hover': {
    backgroundColor: '#333',
    boxShadow: 'none',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: '#000',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    '& fieldset': {
      borderColor: '#000',
    },
    '&:hover fieldset': {
      borderColor: '#000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFD600', 
    },
  },
  marginBottom: '20px',
});

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name,
        email,
        password,
        role,
        address: 'MainSt', 
        phoneNumber,
      };

      await registerUser(userData);
      setMessage('Registration successful');
      setOpenSnackbar(true);

      // Automatically log in the user after registration
      const credentials = { email, password };
      const loginResponse = await loginUser(credentials);
      const user = loginResponse.user;

      if (user && user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
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

        <Typography variant="h4" gutterBottom textAlign="center" sx={{ color: '#000' }}>
          Register
        </Typography>

        {message && (
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            message={message}
          />
        )}

        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          <StyledTextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <StyledTextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <StyledTextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <StyledTextField
            label="Address"
            variant="outlined"
            fullWidth
            value="MainSt"
            onChange={() => {}}
            disabled
          />

          <StyledTextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px', borderRadius: 0 }}>
            <InputLabel id="role-label" sx={{ color: '#000' }}>
              Role
            </InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ borderRadius: 0, color: '#000' }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

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

          <StyledButton variant="contained" type="submit" fullWidth>
            Register
          </StyledButton>
        </form>
      </Box>
    </Container>
  );
}

export default Register;
