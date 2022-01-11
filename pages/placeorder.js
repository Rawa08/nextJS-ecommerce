import {useContext, useState, useEffect} from 'react';
import NextLink from 'next/link';
import Image from 'next/image'
import {Store} from '../utils/Store';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import {Card, List, ListItem, Button, Typography, Link, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import styles from  '../styles/App.module.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import axios from 'axios';
import {getError} from '../utils/formatError';


const Order = () => {
    const router = useRouter();
    const {state:{cart: {cartItems, shippingAddress, paymentMethod}, user}, dispatch} = useContext(Store);


    useEffect(() => {
        if(!paymentMethod){
            router.push('/payment')
         }
         
         if(cartItems.length <1){
            
            router.push('/')
         }
        
    }, []);
    
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const roundPrice = num => (Math.round(num * 100 + Number.EPSILON)/100);

    const itemsPrice = roundPrice(cartItems.reduce((acc, curr)=> acc + (curr.quantity * curr.price), 0));
    const vatAmount = roundPrice(itemsPrice * 0.2);
    const shippingPrice = itemsPrice > 0  ?  itemsPrice > 200 ? 0 : 4.9 : 0;
    const totalPrice = roundPrice((itemsPrice+shippingPrice)); 
    
    const submitOrder = async () => {
        closeSnackbar();


        try {
            
            setLoading(true);
            const {data} = await axios.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                vatAmount,
                shippingPrice,
                totalPrice
            },{
                headers:{
                    authorization: `Bearer ${user.token}`,
                    
                  }
            });
            

            dispatch({type:'CART_CLEAR'});
            Cookies.remove('cartItems');
            setLoading(false);
            router.push(`/order/${data._id}`)

        } catch (error) {
            
            setLoading(false);
           
            enqueueSnackbar(getError(error), { variant: 'error', autoHideDuration:3000 });
        }
    };


    return (
        <Layout title="Order">
            <CheckoutWizard activeStep={3}/>
            <Typography component='h3' variant='h3' className={styles.h3}>Order summary</Typography>

            
                  <Grid container spacing={1}>
           
                      <Grid item md={9} xs={12}>

                      <Card className={styles.section}>
                              <List>
                                  <ListItem>
                                      <Typography component='h6' variant='h6'>Shipping Address</Typography>
                                  </ListItem>
                                  <ListItem>
                                  {shippingAddress.fullName} &nbsp; -  &nbsp;
                                  {shippingAddress.address}   &nbsp; - &nbsp;
                                  {shippingAddress.postalCode} &nbsp; -&nbsp;
                                  {shippingAddress.city}    &nbsp; -&nbsp;
                                  {shippingAddress.country} 
                                  </ListItem>    
                                  
                                  
                                </List>
                        </Card>

                        <Card className={styles.section}>
                              <List>
                                  <ListItem>
                                      <Typography component='h6' variant='h6'>Payment Method</Typography>
                                  </ListItem>
                                  <ListItem>
                                 <Typography paragraph={true}> {paymentMethod}</Typography>
                                  </ListItem>    
                                  
                                  
                                </List>
                        </Card>


                          <Card className={styles.section}>
                              <List>
                                  <ListItem>
                                      <Typography component='h5' variant='h5'>Order Items</Typography>
                                  </ListItem>
                                  <ListItem>
                                  <TableContainer>
                              <Table>
                                  <TableHead>
                                      <TableRow>
                                          <TableCell>
                                              Image
                                          </TableCell>
                                          <TableCell>
                                              Name
                                          </TableCell>
                                          <TableCell align='right'>
                                              Quantity
                                          </TableCell>
                                          <TableCell align='right'>
                                              Price
                                          </TableCell>
                                       
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {cartItems.map(item => (
                                          <TableRow key={item._id}>
                                              <TableCell >
                                                  <NextLink href={`/product/${item._id}`} passHref>
                                                      <Link>
                                                      <Image src={item.image} width={50} height={50}  alt={item.title} objectFit='contain' layout='responsive' priority='false' ></Image>
                                                      </Link>
                                                  </NextLink>
                                              </TableCell>
                                              <TableCell>
                                              <NextLink href={`/product/${item._id}`} passHref>
                                                      <Link>
                                                      <Typography>{item.title}</Typography>
                                                      </Link>
                                                  </NextLink>
                                              </TableCell>
                                              <TableCell align='right'>
                                          {item.quantity}
                                              </TableCell>
                                              <TableCell align='right'>{item.price}</TableCell>
                                             
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </TableContainer>
                                  </ListItem>
                              </List>

                          </Card>
                      </Grid>
                      <Grid item md={3} xs={12}>
                          <Card className={styles.section}>
                              <List>
                                  <ListItem>
                                  <Typography component='h6' variant='h6'>Order summary:</Typography>
                                  </ListItem>
                                  <ListItem>
                                      <Grid container>
                                          <Grid item xs={6}>
                                          <Typography  align='left'> Items:</Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                          <Typography  align='right'> ${itemsPrice}</Typography>
                                          </Grid>
                                      </Grid>
                                  </ListItem>
                                  <ListItem>
                                      <Grid container>
                                          <Grid item xs={6}>
                                          <Typography  align='left'> VAT(included):</Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                          <Typography align='right'> ${vatAmount}</Typography>
                                          </Grid>
                                      </Grid>
                                  </ListItem>
                                  <ListItem>
                                      <Grid container>
                                          <Grid item xs={6}>
                                          <Typography  align='left'> Shipping Price:</Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                          <Typography  align='right'> ${shippingPrice}</Typography>
                                          </Grid>
                                      </Grid>
                                  </ListItem>
                                  <ListItem>
                                      <Grid container>
                                          <Grid item xs={6}>
                                          <Typography paragraph={true} align='left' variant='subtitle2'> Total:</Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                          <Typography paragraph={true} align='right' variant='subtitle2'> ${totalPrice}</Typography>
                                          </Grid>
                                      </Grid>
                                  </ListItem>
                           
                                  <ListItem>
                                      <Button variant='contained' color='secondary' fullWidth onClick={submitOrder} >Place Order</Button> 
                                  </ListItem>
                                  <ListItem>
                        <Button variant='outlined' color='secondary' type='button' fullWidth onClick={() => router.push('/payment')}>Back</Button>
                    </ListItem>
                                  {loading && <ListItem>
                                      <CircularProgress /></ListItem>}
                              </List>
                          </Card>
                      </Grid>
                  </Grid>
        
        </Layout>
    )
}

export default dynamic(() => Promise.resolve(Order), {ssr:false})
