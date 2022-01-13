import {useEffect, useContext, useState} from 'react';
import {Store} from '../utils/Store';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import styles from '../styles/App.module.css';
import { Typography, List, ListItem, FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';

const Payment = () => {

    const router = useRouter();
    const {state:{cart:{shippingAddress}}, dispatch} = useContext(Store);

    const [paymentMethod, setPaymentMethod] = useState('');
    
    useEffect(() => {
        
        if(!shippingAddress.address){
            router.push('/shipping')
        }else{
            setPaymentMethod(Cookies.get('paymentMethod') || '');
        }
    }, []);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const paymentSubmit = e => {
        closeSnackbar();
        e.preventDefault();
        if(!paymentMethod) {
            enqueueSnackbar('Please select payment method', { variant: 'error', autoHideDuration:1500 })
        } else {
            dispatch({type:"SAVE_PAYMENT_METHOD", payload: paymentMethod});
            Cookies.set('paymentMethod', paymentMethod);
            router.push('/placeorder');
        }

    }


    return (
        <Layout title="Payment">
            <CheckoutWizard activeStep={2}></CheckoutWizard>
            <form className={styles.form} onSubmit={e => paymentSubmit(e)}>
                <Typography component='h3' variant='h3'> Payment Method</Typography>
                <List>
                    <ListItem>
                        <FormControl component='fieldset'>
                            <RadioGroup aria-label='Payment Method' name='paymentMethod' value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} >
                                <FormControlLabel label='PayPal' value='PayPal' control={<Radio />}></FormControlLabel>
                               
                                <FormControlLabel label='Cash' value='Cash' control={<Radio />}></FormControlLabel>
                            </RadioGroup>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='secondary' type='submit' fullWidth>Continue</Button>
                    </ListItem>
                    <ListItem>
                        <Button variant='outlined' color='secondary' type='button' fullWidth onClick={() => router.push('/shipping')}>Back</Button>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}

export default Payment
