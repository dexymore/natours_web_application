/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

const stripe = Stripe('pk_test_51NWYL2LrhUrKqR7d20H2frkShIuiqcD5livtHdK0VK5HlzMyt8Sgjpkt1JIS4E1S4FiOuggb13EnUC0uhsSYshlM00k3CfIflf'); // add your stripe key here

export const bookTour = async tourId => {
//1) get checkout session from API
try{
const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
//2) create checkout form + charge credit card
await stripe.redirectToCheckout({
sessionId: session.data.session.id
});
} catch(err){}
};