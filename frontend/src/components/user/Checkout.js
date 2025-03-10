import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { TextField, Button, Typography, Box, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log("Stripe Publishable Key: ", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaperContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  maxWidth: 600,
  textAlign: 'center',
  borderRadius: 8,
  boxShadow: theme.shadows[5],
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const FormContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const CardElementContainer = styled(Box)(({ theme }) => ({
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: theme.spacing(1),
  minHeight: '40px',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));


const ProductPreviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: theme.shadows[5],
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  marginLeft: theme.spacing(2),
}));

const CheckoutForm = ({ totalPrice, orderId, userId, userEmail, product }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [billingDetails, setBillingDetails] = useState({
    cardName: '',
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: '',
  });
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/payment', { totalPrice });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      }
    };
    if (totalPrice) {
      createPaymentIntent();
    }
  }, [totalPrice]);

  const handleShippingChange = (event) => {
    const { name, value } = event.target;
    setShippingDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBillingChange = (event) => {
    const { name, value } = event.target;
    setBillingDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          name: billingDetails.cardName,
          address: {
            line1: billingDetails.billingAddress,
            city: billingDetails.billingCity,
            postal_code: billingDetails.billingPostalCode,
            country: billingDetails.billingCountry,
          },
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment successful:', paymentIntent);
      alert('Payment is successful - Your order is being processed.');

      try {
        await axios.post('http://localhost:5000/api/orders/updateStatus', {
          orderId: orderId,
          status: 'paid',
          paymentIntentId: paymentIntent.id,
          amountPaid: paymentIntent.amount_received / 100,
        });

        await axios.post('http://localhost:5000/api/payment/saveTransaction', {
          paymentIntentId: paymentIntent.id,
          amountPaid: paymentIntent.amount_received / 100,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          customerId: userId,
          paymentMethod: 'card',
        });

        const receiptResponse = await axios.post('http://localhost:5000/api/notifications/sendReceipt', {
          email: userEmail,
          paymentIntentId: paymentIntent.id,
          amountPaid: paymentIntent.amount_received / 100,
          orderId: orderId,
        });

        if (receiptResponse.data.success) {
          console.log('Receipt sent successfully!');
        } else {
          console.error('Failed to send receipt.');
        }
      } catch (err) {
        console.error('Error processing payment:', err);
        alert('There was an error processing your payment details.');
      }
    }
  };

 
  const productImage = product?.image || 'default-image-url'; 
  const productName = product?.name || 'Product Name';
  const productDescription = product?.description || 'No description available.';
  const productPrice = product?.price || 0;

  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      {/* Checkout Form */}
      <Grid item xs={12} md={6} container justifyContent="center">
        <PaperContainer>
          <Title variant="h4">Complete Your Payment</Title>
          <FormContainer onSubmit={handleSubmit}>
            {/* Shipping Details */}
            <Typography variant="h6">Shipping Details</Typography>
            <TextField
              label="Full Name"
              name="name"
              value={shippingDetails.name}
              onChange={handleShippingChange}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={shippingDetails.address}
              onChange={handleShippingChange}
              fullWidth
            />
            <TextField
              label="City"
              name="city"
              value={shippingDetails.city}
              onChange={handleShippingChange}
              fullWidth
            />
            <TextField
              label="Postal Code"
              name="postalCode"
              value={shippingDetails.postalCode}
              onChange={handleShippingChange}
              fullWidth
            />
            <TextField
              label="Country"
              name="country"
              value={shippingDetails.country}
              onChange={handleShippingChange}
              fullWidth
            />

            {/* Billing Details */}
            <Typography variant="h6" style={{ marginTop: '16px' }}>Billing Details</Typography>
            <TextField
              label="Cardholder Name"
              name="cardName"
              value={billingDetails.cardName}
              onChange={handleBillingChange}
              fullWidth
            />
            <TextField
              label="Billing Address"
              name="billingAddress"
              value={billingDetails.billingAddress}
              onChange={handleBillingChange}
              fullWidth
            />
            <TextField
              label="Billing City"
              name="billingCity"
              value={billingDetails.billingCity}
              onChange={handleBillingChange}
              fullWidth
            />
            <TextField
              label="Billing Postal Code"
              name="billingPostalCode"
              value={billingDetails.billingPostalCode}
              onChange={handleBillingChange}
              fullWidth
            />
            <TextField
              label="Billing Country"
              name="billingCountry"
              value={billingDetails.billingCountry}
              onChange={handleBillingChange}
              fullWidth
            />

            {/* Payment Information */}
            <Typography variant="h6" style={{ marginTop: '16px' }}>Payment Information</Typography>
            <Box>
              <CardNumberElement />
            </Box>
            <Box>
              <CardExpiryElement />
            </Box>
            <Box>
              <CardCvcElement />
            </Box>

            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            <SubmitButton type="submit" variant="contained" fullWidth disabled={!stripe}>
              Pay {totalPrice} CAD
            </SubmitButton>
          </FormContainer>
        </PaperContainer>
      </Grid>

      {/* Product Preview */}
      <Grid item xs={12} md={6}>
        <ProductPreviewContainer>
          <Typography variant="h5">Product Preview</Typography>
          <img src={productImage} alt={productName} style={{ width: '100%', height: 'auto', marginBottom: '16px' }} />
          <Typography variant="h6">{productName}</Typography>
          <Typography variant="body1">{productDescription}</Typography>
          <Typography variant="h6" style={{ marginTop: '16px' }}>
            Price: {productPrice} CAD
          </Typography>
        </ProductPreviewContainer>
      </Grid>
    </Grid>
  );
};

const Checkout = ({ totalPrice, orderId, userId, userEmail, product }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm
      totalPrice={totalPrice}
      orderId={orderId}
      userId={userId}
      userEmail={userEmail}
      product={product}
    />
  </Elements>
);

export default Checkout;
