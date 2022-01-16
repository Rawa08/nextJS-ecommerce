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


const Admin = () => {
  const {
    state: { user },
  } = useContext(Store);
  const router = useRouter();

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState([])
  
  console.log(orders)
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
                  <NextLink href={'/admin/orders'} passHref>
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
               
                    
                    
                     <Grid container spacing={1}  key={8}  justifyContent="center" alignItems="center" mt={2}>
                                   
                      
                    
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
