/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import PropTypes from 'prop-types';

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card Element not found');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
        amount: totalAmount * 100, // amount in cents
      });

      const { clientSecret } = response.data;

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        setError(`Payment failed: ${paymentResult.error.message}`);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          setSuccess(true);
        }
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setError('Error during payment. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {error && <div>{error}</div>}
      {success && <div>Payment succeeded!</div>}
    </form>
  );
};

CheckoutForm.propTypes = {
  totalAmount: PropTypes.number.isRequired,
};

export default CheckoutForm;





