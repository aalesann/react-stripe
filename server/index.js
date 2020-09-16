const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();

// Secret key
const stripe = new Stripe("sk_test_HwMQAkW0RJwqK8AVQz6irSKG00851Z3dkp");

// Se habilita el orígen
app.use(cors({ origin: 'http://localhost:3000' }));

// Se habilita el servidor para entender json
app.use(express.json());

// Ruta de pago
app.post('/api/checkout', async (req, res) => {
    try {
        const { id, amount } = req.body;

        const payment = await stripe.paymentIntents.create({
            amount,
            currency: 'USD',
            description: 'Monitor',
            payment_method: id,
            confirm: true
        });

        console.log(payment)
        res.send({message:'Successful payment'});
    } catch (error) {
        res.json({ message: error.raw.message })
    }
});

// Corriendo el servidor
app.listen(3001, () => {
    console.log('Server on port ', 3001);
});