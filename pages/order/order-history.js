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
  Link,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
        <Grid item md={3} xs={12}>
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

        <Grid item md={9} xs={12}>
          <Card className={styles.section}>
            <List>
              <ListItem>
                <Typography component="h3" variant="h3">
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={styles.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                      <Table>
                          <TableHead>
                              <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>DATE</TableCell>
                                <TableCell>TOTAL</TableCell>
                                <TableCell>PAID</TableCell>
                                <TableCell>DELIVERD</TableCell>
                                <TableCell>ACTION</TableCell>
                              </TableRow>
                          </TableHead>

                          <TableBody>
                               {orders.map(order => (
                                   <TableRow key={order._id}>
                                       <TableCell>{order._id.substring(20, 24)}</TableCell>
                                        <TableCell>{order.createdAt}</TableCell>    
                                        <TableCell>{order.totalPrice}</TableCell>
                                        <TableCell>{order.isPaid? `Paid at ${order.paidAt}`: 'Not Paid'}</TableCell>    
                                        <TableCell>{order.isDelivered? `Deliverd at ${order.deliveredAt}`: 'Not delivered'}</TableCell>    
                                        <TableCell><NextLink href={`/order/${order._id}?redirect=/order-history`} passHref><Button variant='contained' color='secondary'>Details</Button></NextLink></TableCell>    
                                   </TableRow>
                               ))}
                          </TableBody>
                      </Table>
                  </TableContainer>
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
