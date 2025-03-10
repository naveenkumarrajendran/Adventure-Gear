import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, MenuItem, Select, InputLabel, FormControl, Snackbar } from '@mui/material';
import { loginUser, registerUser } from '../api';
import { styled } from '@mui/system';
import '../styles/Register.css';  

const StyledButton = styled(Button)({
  marginTop: '20px',
  padding: '12px 30px',
  fontSize: '16px',
  letterSpacing: '1px',
  '&:hover': {
    backgroundColor: '#008CBA',  
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: '#00796b',  
  },
  '& .MuiInputBase-root': {
    '&:hover': {
      borderColor: '#00796b', 
    },
  },
  marginBottom: '20px',
});

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [phoneNumber,setPhoneNumber]=useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

      const credentials = {
        email,
        password,
      };

      const loginResponse = await loginUser(credentials);
      const user = loginResponse.user;

     


      if (user && user.role === 'admin') {
        navigate('/AdminDashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      setOpenSnackbar(true); 
    }
  };

  return (
    <Container maxWidth="sm" className="register-container">
      <Typography variant="h4" gutterBottom textAlign="center" color="primary">
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

      <form onSubmit={handleRegister}>
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

        <FormControl fullWidth variant="outlined">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <StyledButton variant="contained" type="submit" fullWidth>
          Register
        </StyledButton>
      </form>
    </Container>
  );
}

export default Register;
