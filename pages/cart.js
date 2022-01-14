import { useContext } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import {
  Card,
  List,
  ListItem,
  Button,
  Typography,
  Link,
  Grid,
  Select,
  MenuItem,
} from '@mui/material';
import styles from '../styles/App.module.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Cart = () => {

  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const { cart: { cartItems },} = state;

  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { id, quantity } });

  const removeItem = (id) =>
    dispatch({ type: 'REMOVE_CART_ITEM', payload: { id } });
    
  const checkoutHandler = () => router.push('/shipping');


  return (
    <Layout title="Cart">
      <Typography component="h3" variant="h3" className={styles.h3}>
        Shopping Cart
      </Typography>

      {cartItems.length < 1 ? (
        <div className={styles.section}>
          You bag is empty!
          <NextLink href="/" passHref>
            <Link>
              <Typography>Back to products</Typography>
            </Link>
          </NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12} mt={4}>
          {cartItems.map(item => (
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              mt={5}
              key={item._id}
             
            >
              <Grid item md={1} xs={6}>
                {' '}
                <NextLink href={`/product/${item._id}`} passHref>
                  <Link >
                    <Image
                      src={item.image}
                      width={50}
                      height={50}
                      alt={item.title}
                      objectFit="contain"
                      layout="responsive"
                      priority="false"
                    ></Image>
                  </Link>
                </NextLink>
              </Grid>
              <Grid item md={6} xs={12}>
                {' '}
                <NextLink href={`/product/${item._id}`} passHref>
                  <Link>
                    <Typography>{item.title}</Typography>
                  </Link>
                </NextLink>
              </Grid>
              <Grid item md={1} xs={4}>
                {' '}
                <Select
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, e.target.value)}
                >
                  {[...Array(25).keys()].map((i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>{' '}
              </Grid>
              <Grid item md={2} xs={4}>
                {' '}
                $ {item.price}
              </Grid>
              <Grid item md={1} xs={4} align="right">
                {' '}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeItem(item._id)}
                >
                  X
                </Button>
              </Grid>
            </Grid>))}
          
          </Grid>
          <Grid item md={3} xs={12}>
              
            <Card>
              <List>
                <ListItem>
                  <Typography>
                    Subtotal: $
                    {Math.round(
                      cartItems.reduce(
                        (acc, curr) => acc + curr.quantity * curr.price,
                        0
                      ) * 100
                    ) / 100}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={checkoutHandler}
                  >
                    Checkout
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
