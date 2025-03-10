import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Container,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Twitter as TwitterIcon, 
  LinkedIn as LinkedInIcon, 
  YouTube as YouTubeIcon 
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#000', py: 6 }}> 
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="common.white" align="left"> 
              © 2025 Adventure gear shopping
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}> 
                <Typography variant="body2">Home</Typography>
              </Link>
              <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>
                <Typography variant="body2">About</Typography>
              </Link>
              <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}> 
                <Typography variant="body2">Contact</Typography>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer" color="inherit">
                <TwitterIcon />
              </IconButton>
              <IconButton href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" color="inherit">
                <LinkedInIcon />
              </IconButton>
              <IconButton href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" color="inherit">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;