import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { CircularProgress, ListItem } from '@mui/material';
import styles from  '../styles/App.module.css';
import {getError} from '../utils/formatError';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import {Store} from '../utils/Store';




const PayPal = ({user, order}) => {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    const {dispatch} = useContext(Store);

    const loadPaypalScript = async () => {
        const {data: clientId} = await axios.get(`/api/keys/paypal`, {
            headers:{ authorization: `Bearer ${user.token}`},
        });

        paypalDispatch({type: 'resetOptions', value: {
            'client-id': clientId,
            currency: 'USD',

        }});
        paypalDispatch({type:'setLoadingStatus', value:'pending'})
    };
    
    useEffect(() => {
        loadPaypalScript();
    }, [])

    const createOrder = (data, actions) =>{
        return actions.order.create({
            purchase_units:[
                {
                    amount: {value: order.totalPrice},
                }
            ]
        }).then(payPalOrderId => { return payPalOrderId} )
    };

    const onPayPalError = err => enqueueSnackbar(getError(err), {variant:'error'});

    const onApprove =  (data, actions) =>{
        return actions.order.capture().then(async details => {
        
            try{
          
                
                const {data} = await axios.put(`/api/orders/${order._id}/pay`, details, {
                    headers:{ authorization: `Bearer ${user.token}`},
                });
                
                enqueueSnackbar('Order is paid', {variant:'success', autoHideDuration:2500});
                dispatch({type:'CART_CLEAR'});
                Cookies.remove('cartItems');
                
            }
            catch(err){
                console.log(err)
               
                enqueueSnackbar(getError(err), {variant:'error', autoHideDuration:3000});

            }
        })
    };


    return (
       <ListItem>
        {isPending ? <CircularProgress /> : <div className={styles.fullWidth}><PayPalButtons createOrder={createOrder}
        onApprove={onApprove} onError={onPayPalError}></PayPalButtons></div>}
      </ListItem>
    )
}

export default PayPal
