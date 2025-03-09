import React from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia 
} from '@mui/material';
import teammember from '../assests/teammember.jpg';

function AboutUs() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Our Story
      </Typography>
      <Typography variant="body1" >
        Founded in 2023 by a group of passionate adventurers, we at Adventure
        Gear Emporium believe that everyone deserves to experience the thrill of
        the outdoors. We started this company with a simple goal: to provide
        high-quality, reliable, and affordable gear to adventurers of all levels.
      </Typography>
      <Typography variant="body1">
        From seasoned mountaineers to weekend warriors, we cater to everyone
        who seeks adventure. Our team is composed of outdoor enthusiasts who
        understand the needs and challenges of exploring the wilderness. We
        personally test and curate every product we offer, ensuring that it
        meets our high standards for performance, durability, and safety.
      </Typography>

      <Typography variant="h4" component="h2" align="center" gutterBottom style={{ marginTop: '2rem' }}>
        Our Mission
      </Typography>
      <Typography variant="body1" >
        Our mission is to empower adventurers like you by providing the gear
        and resources you need to pursue your passions. We believe that
        exploring the outdoors is not just a hobby, but a way of life. It's
        about pushing your limits, discovering new horizons, and connecting
        with nature.
      </Typography>
      <Typography variant="body1" >
        We are committed to sustainability and ethical sourcing. We partner with
        brands that share our values and strive to minimize our environmental
        impact.
      </Typography>

      <Grid container spacing={3} style={{ marginTop: '2rem' }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="160"
              image={teammember}
              alt="Corporate Positioning"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Corporate Positioning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We will continue our focus on innovation, delivering top-quality gear, and strategically
                expanding our market presence. Exxel will remain at the forefront of the industry by
                adapting and aligning with the socioeconomic demands of today and the future.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="160"
              image={teammember}
              alt="Facilities & Capabilities"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Facilities & Capabilities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exxel maintains a global presence with
                international reach. While our Canadian
                headquarters are located in Ontario, our vast
                scope of operations extends to numerous
                continents. Our facilities and teams span the
                world.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="160"
              image={teammember}
              alt="Corporate Portfolio"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Corporate Portfolio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Excel Outdoors' diverse portfolio is built to last and
                evolve, mirroring the changing outdoor preferences.
                We maintain a strong and profitable offering in
                various sectors, including retail, product offerings in
                outdoor, action and travel.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h4" component="h2" align="center" gutterBottom style={{ marginTop: '2rem' }}>
        Our Team
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="180" 
              image={teammember}
              alt="Naveen"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Naveen
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Founder & CEO
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="180" 
              image={teammember}
              alt="Venkata Mahesh"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Venkata Mahesh
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Head of Product
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="180" 
              image={teammember}
              alt="Shrishika Ramaiah"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Shrishika Ramaiah
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Human Resources
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AboutUs;