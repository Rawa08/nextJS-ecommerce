import {useContext, useEffect, useState} from 'react';
import NextLink from 'next/link';
import Image from 'next/image'
import Layout from '../../components/Layout';
import {Card, List, ListItem, Button, Typography, Link, Grid, TableContainer, 
    Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import styles from  '../../styles/App.module.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from 'axios';
import {getError} from '../../utils/formatError';
import {Store} from '../../utils/Store';
import PayPal from '../../components/PayPal';



const OrderDetail = ({params}) => {

    const orderId = params.id;
    const router = useRouter();
    const {redirect} = router.query;
    const {state:{user}} = useContext(Store);
    
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(true);

       
    const {shippingAddress, paymentMethod, orderItems, itemsPrice, shippingPrice, totalPrice, vatAmount} = order;

    useEffect(() => {
        if(!user){
            return router.push('/login');
        };

        const fetchOrder = async () => {

            try{
                setLoading(true);
                const {data} = await axios.get(`/api/orders/${orderId}`, {
                    headers:{
                        authorization: `Bearer ${user.token}`,
                        user:user._id
                        
                      }
                });
                setOrder(data);
                setLoading(false)
                setError(false)

            } catch(err){
            
                    setError(true)
                    setErrorMessage(getError(err));
                    setLoading(false);
            }
        };
        if(!order._id ||(order._id && order._id !== orderId)){
            fetchOrder();
        } else {
            
            
        }

        
    }, [order]);

  const goBack = () =>{
      if(redirect) {
          return router.push(redirect);
      }
      if(order.isPaid){
          return router.push('/');
      }
      else router.push('/placeorder')
  }
    
    return (
        <Layout title="Order Detail">
            <Typography component='h3' variant='h3' className={styles.h3}>Order: {orderId}</Typography>

                {loading ? (<CircularProgress />) : error ? <Typography className={styles.error}>{errorMessage}</Typography>:
            
                  <Grid container spacing={1}>
           
                      <Grid item md={9} xs={12}>

                      <Card className={styles.section}>
                              <List>
                                  <ListItem>
                                      <Typography component='h6' variant='h6'>Shipping Address</Typography>
                                  </ListItem>
                                  <ListItem>
                                      To: &nbsp;
                                  {shippingAddress.fullName} &nbsp; -  &nbsp;
                                  {shippingAddress.address}   &nbsp; - &nbsp;
                                  {shippingAddress.postalCode} &nbsp; -&nbsp;
                                  {shippingAddress.city}    &nbsp; -&nbsp;
                                  {shippingAddress.country} 
                                  </ListItem>    
                                  <ListItem>
                                      Status: {order.isDeliverd ? `Deliverd at ${order.deliverdAt}` : 'Not Deliverd'}
                                     
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
                                  
                                  <ListItem>
                                      Status: {order.isPaid? `Paid at ${order.paidAt}` : 'Not Paid'}
                                     
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
                                      {orderItems.map(item => (
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
                                      {!order.isPaid && order.paymentMethod === 'PayPal' && <PayPal user={user} order={order} />}  
                                      
                                  <ListItem>
                        <Button variant='outlined' color='secondary' type='button' fullWidth onClick={goBack}>Back</Button>
                    </ListItem>
                           
                              </List>
                          </Card>
                      </Grid>
                  </Grid>
            }
        </Layout>
    )
}



export const getServerSideProps = async ({params}) => {
    return { props: { params }};
}  

export default dynamic(() => Promise.resolve(OrderDetail), {ssr:false})
