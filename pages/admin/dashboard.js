import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { Store } from '../../utils/Store';
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



const Admin = () => {
  const {
    state: { user },
  } = useContext(Store);
  const router = useRouter();

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState([])
  
 
  useEffect(() => {
    if (!user.isAdmin) {
      return router.push('/');
    }
    
    const fetchOrders = async () => {
        try{
            setLoading(true);

            const {data} = await axios.post('/api/admin/orders',{},{
                headers:{
                    authorization: `Bearer ${user.token}`,
                    
                  }
                });
                console.log(data[0])
                setOrders(data)
                
                setLoading(false)
               
                
        }
        catch(err) {
            console.log(err)
        }
    }
    fetchOrders()
    

  }, []);

  
  return (
    <Layout title="Admin Dashboard">
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={styles.section}>
              <List>
                  <NextLink href={'/admin/dashboard'} passHref>
                      <ListItem button selected component='a'>
                          <ListItemText primary='Orders'></ListItemText>
                      </ListItem>
                  </NextLink>
                  <NextLink href={'/admin/products'} passHref>
                      <ListItem button component='a'>
                          <ListItemText primary='Products'></ListItemText>
                      </ListItem>
                  </NextLink>
                  <NextLink href={'/admin/users'} passHref>
                      <ListItem button component='a'>
                          <ListItemText primary='Users'></ListItemText>
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
                  Orders
                </Typography>
              </ListItem>
              {loading ? <CircularProgress /> :
              <ListItem>
                  
                  {orders.length > 0 ? 
           <Grid container spacing={1}>
                 <Grid container spacing={1}  justifyContent="center" alignItems="center" mt={2} mb={2}>
                            <Grid item 	sx={{ display: { xs: 'none' , md: 'block'} }}  md={2}>Order Date</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2}>Payment</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2} >Delivered</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2} >Total</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2} >Country</Grid>
                            <Grid item sx={{ display: { xs: 'none' , md: 'block'} }} md={2} align='center'>ACTION</Grid>
                            </Grid>
                            <Divider sx={{width: '100%', bgcolor: 'background.paper', display: { xs: 'none' , md: 'block'}}} />
              { orders.map(order => (
                   <Grid container spacing={1} key={order._id} mt={1}>
                       <Grid item xs={12} md={2}><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2'>Order Date: &nbsp;</Typography>{new Date(order.createdAt).toLocaleDateString()}</Grid>
                       <Grid item xs={6} md={2}><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2'>Payment: &nbsp;</Typography>{order.isPaid ? new Date(order.paidAt).toLocaleDateString() : 'Not Paid'}</Grid>
                       <Grid item xs={6} md={2}><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2'>Delivered: &nbsp;</Typography>{order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : 'Not Delivered'}</Grid>
                       <Grid item xs={6} md={2}><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2'>Total: &nbsp;</Typography>$ {order.totalPrice}</Grid>
                       <Grid item xs={6} md={2}><Typography sx={{ display: { xs: 'inline' , md: 'none'} }} variant='subtitle2'>Country: &nbsp;</Typography>{order.shippingAddress.country}</Grid>
                       <Grid item xs={12} md={2} mb={3}>
                       <Divider textAlign="center"><NextLink href={`/order/${order._id}`} passHref><Button variant='contained' color='secondary' >Details</Button></NextLink></Divider></Grid>
                   </Grid>
                
                   ))}
                    
                   </Grid>   
                     
             
            : <Typography component='h5' variant='h5'>No orders have been submited</Typography>}
              </ListItem>
              }
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Admin), { ssr: false });
