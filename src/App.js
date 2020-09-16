import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios'
import 'bootswatch/dist/lux/bootstrap.min.css';

const stripePromise = loadStripe("pk_test_5ZVogOffJl7U1nve3RSN8wId00nSBik89H");

const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });
    setLoading(true);

    if (!error) {
      const { id } = paymentMethod;

      try {
        const { data } = await axios.post('http://localhost:3001/api/checkout', {
        id,
        amount: 1000 * 200        
      });
      console.log(data)
    } catch (error) {
      console.log(error)
    }
      setLoading(false);
      elements.getElement(CardElement).clear();

    }

  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card card-body"
    >
      <img src="https://d26lpennugtm8s.cloudfront.net/stores/062/220/products/786225-mla25393395945_022017-o-f98ac58a7b7b13c73315121940399663-1024-1024.jpg"
        alt="Monitor"
        className="img-fluid"
      />

      <h3 className="text-center mt-4 mb-1">Precio: $100</h3>

      <div className="form-group mt-2">
        <CardElement className="form-control" />
      </div>
      <button 
        className="btn btn-success" 
        disabled={!stripe}
      >
        { loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="sr-online"></span>
          </div>
        ) : "Comprar" }
      </button>
    </form>)
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
