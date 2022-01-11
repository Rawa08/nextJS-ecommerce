
import {  Button, List, ListItem, TextField, Typography } from "@mui/material";
import Layout from "../components/Layout";
import styles from '../styles/App.module.css';
import {useForm, Controller} from 'react-hook-form';

import Cookies from "js-cookie";
import { useContext, useEffect} from 'react';
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import CheckoutWizard from "../components/CheckoutWizard";

const Shipping = () => {
    const {state:{user, cart:{shippingAddress}}, dispatch} = useContext(Store);
   
    const {handleSubmit, control, formState:{errors}, setValue} = useForm();
    const router = useRouter();

    useEffect(() => {
        if(!user){
            router.push('/login?redirect=/shipping')
         }

         const {fullName, address, city, postalCode, country} = shippingAddress;

         setValue('fullName',fullName);
         setValue('address',address);
         setValue('city',city);
         setValue('postalCode', postalCode);
         setValue('country', country)
        
    }, [])

   


    const submitShipping =  (fields) => {
     
        const {fullName, address, city, postalCode, country} = fields;

            dispatch({type:'SAVE_SHIPPING_ADDRESS', payload: {fullName, address, city, postalCode, country}});
            Cookies.set('shippingAddress', JSON.stringify({fullName, address, city, postalCode, country}));
            router.push('/payment');
    }
    return (
        <Layout title="Shipping">
            <CheckoutWizard activeStep={1} />
            <form className={styles.form} onSubmit={handleSubmit(submitShipping)}>
                <Typography component='h3' variant='h3'>
                    Shipping
                </Typography>
                <List>
                    <ListItem>
                        <Controller name="fullName"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:3,
                        }}
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="fullName" label='Full Name' inputProps={{type:'text'}} 
                            error={Boolean(errors.fullName)}
                            helperText={errors.fullName ? errors.fullName.type === 'minLength' ? 'Name to short' : 'Full name is required':''} {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="address"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:6,
                        }}
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="address" label='Address' inputProps={{type:'text'}} 
                            error={Boolean(errors.address)}
                            helperText={errors.address ? errors.address.type === 'minLength' ? 'Address is to short' : 'Address is required':''} {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="postalCode"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:4,
                        }}
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="postalCode" label='Postal Code' inputProps={{type:'text'}} 
                            error={Boolean(errors.postalCode)}
                            helperText={errors.postalCode ? errors.postalCode.type === 'minLength' ? 'Postal Code is to short' : 'Postal Code is required':''} {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="city"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:2,
                        }}
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="city" label='City' inputProps={{type:'text'}} 
                            error={Boolean(errors.city)}
                            helperText={errors.city ? errors.city.type === 'minLength' ? 'City to short' : 'City is required':''} {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="country"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:3,
                        }}
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="country" label='Country' inputProps={{type:'text'}} 
                            error={Boolean(errors.country)}
                            helperText={errors.country ? errors.country.type === 'minLength' ? 'Country name to short' : 'Country name is required':''} {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='secondary' type='submit' fullWidth>Continue to Payment</Button>
                    </ListItem>
                 
                </List>
            </form>
        </Layout>
    )
}

export default Shipping
