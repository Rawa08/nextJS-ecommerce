import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { getError } from '../../utils/formatError';
import Layout from '../../components/Layout';
import {
  Card,
  List,
  ListItem,
  Button,
  Typography,
  Grid,
 Divider,
  CircularProgress,
  ListItemText,
} from '@mui/material';
import styles from '../../styles/App.module.css';


const OrderHistory = () => {
  const {
    state: { user },
  } = useContext(Store);
  const router = useRouter();

const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [orders, setOrders] = useState([])



  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    const fetchOrder = async () => {
      try {

        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${user.token}` },
        });

        setOrders(data);
        
        setLoading(false);

      } catch (err) {
        setError(getError(err));
        setLoading(false);
      }
    };

    fetchOrder();
    
  }, []);

  
  return (
    <Layout title="Order History">
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={styles.section}>
              <List>
                  <NextLink href={'/user/profile'} passHref>
                      <ListItem button component='a'>
                          <ListItemText primary='User Profile'></ListItemText>
                      </ListItem>
                  </NextLink>
                  <NextLink href={'/order/order-history'} passHref>
                      <ListItem button selected component='a'>
                          <ListItemText primary='Order History'></ListItemText>
                      </ListItem>
                  </NextLink>
              </List>
          </Card>
        </Grid>

        <Grid item md={10} xs={12}>
          <Card className={styles.section}>
            <List>
              <ListItem>
                <Typography component="h5" variant="h5">
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={styles.error}>{error}</Typography>
                ) : (
                  
                     <Grid container spacing={1}  key={8}  justifyContent="center" alignItems="center" mt={2}>
                                     
                          <Grid container spacing={1}  justifyContent="center" alignItems="center" mt={2} mb={2}>
                            <Grid item 	sx={{ display: { xs: 'none' , md: 'block'} }}  md={2}>ID</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2}>TOTAL</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2} align='center'>DATE</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2} align='center'>PAID</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2} align='center'>DELIVERD</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2} align='center' >ACTION</Grid>
                            </Grid>
                            <Divider sx={{width: '100%', bgcolor: 'background.paper', display: { xs: 'none' , md: 'block'}}} />
                               {orders.map(order => (
                                   <Grid container spacing={1}  key={order._id}  justifyContent="center" alignItems="center" mt={3}>
                                    
                                       <Grid item xs={12} md={2}><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2'>ID: &nbsp;</Typography>{order._id.substring(18, 24)}</Grid>
                                        <Grid item xs={12} md={2} ><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2' align='right'>Price: &nbsp;</Typography> $ {order.totalPrice}</Grid>
                                        
                                        <Grid item xs={12} md={2} sx={{display: 'flex', flexDirection: { xs: 'row', md: 'column' } ,alignItems: { xs: 'flex-start', md: 'flex-end' }}}><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2'>Order Date: &nbsp;</Typography>{new Date(order.createdAt).toLocaleDateString()}</Grid>    
                                        <Grid item xs={12} md={2} sx={{display: 'flex', flexDirection: { xs: 'row', md: 'column' } ,alignItems: { xs: 'flex-start', md: 'flex-end' }}}><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2'>Paid: &nbsp;</Typography>{order.isPaid? new Date(order.paidAt).toLocaleDateString() : 'Not Paid'}</Grid>    
                                        <Grid item xs={12} md={2} sx={{display: 'flex', flexDirection: { xs: 'row', md: 'column' } ,alignItems: { xs: 'flex-start', md: 'flex-end' }}} ><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2'>Delivered: &nbsp;</Typography>{order.isDelivered?  new Date(order.deliveredAt).toLocaleDateString(): 'Not delivered'}</Grid>    
                                        <Grid item xs={12} md={2} mb={2} align='right' ><NextLink href={`/order/${order._id}?redirect=/order-history`} passHref><Button variant='contained' color='secondary'>Details</Button></NextLink></Grid>   
                                        <Divider sx={{width: '70%', bgcolor: 'background.paper', display: { xs: 'block' , md: 'none'}}} />
                                   </Grid>
                               ))}
                          </Grid>
             
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
