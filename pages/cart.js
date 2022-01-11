import {useContext} from 'react';
import NextLink from 'next/link';
import Image from 'next/image'
import {Store} from '../utils/Store';
import Layout from '../components/Layout';
import {Card, List, ListItem, Button, Typography, Link, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem } from '@mui/material';
import styles from  '../styles/App.module.css';
import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';


const Cart = () => {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {cart: {cartItems}} = state;
    const updateQuantity = (id, quantity) => (dispatch({type:'UPDATE_ITEM_QUANTITY', payload:{id, quantity}})) 
    const removeItem = (id) => (dispatch({type:'REMOVE_CART_ITEM', payload:{id}})) 
    const checkoutHandler = () => router.push('/shipping')
    return (
        <Layout title="Cart">
            <Typography component='h3' variant='h3' className={styles.h3}>Shopping Cart</Typography>

            {cartItems.length < 1 ? 
                       <div className={styles.section}>
                           You bag is empty!
                       <NextLink href="/" passHref>
                           <Link><Typography>Back to products</Typography></Link>
                       </NextLink>
                   </div>   :
                  <Grid container spacing={1}>
                      <Grid item md={9} xs={12}>
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
                                          <TableCell align='right'>
                                              Action
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
                                                  <Select value={item.quantity} 
                                                  onChange={(e)=> updateQuantity(item._id, e.target.value)}>
                                                  {[...Array(25).keys()].map((i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                              {i + 1}
                            </MenuItem>
                          ))}
                                                  </Select> 
                                              </TableCell>
                                              <TableCell align='right'>{item.price}</TableCell>
                                              <TableCell align='right'><Button variant='contained' color='secondary' onClick={() => removeItem(item._id)}>X</Button></TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </TableContainer>
                      </Grid>
                      <Grid item md={3} xs={12}>
                          <Card>
                              <List>
                                  <ListItem>
                                      <Typography>Subtotal: ${Math.round(cartItems.reduce((acc, curr)=> acc + (curr.quantity * curr.price), 0) * 100)/100}</Typography>
                                  </ListItem>
                                  <ListItem>
                                      <Button variant='contained' color='secondary' fullWidth onClick={checkoutHandler}>Checkout</Button> 
                                  </ListItem>
                              </List>
                          </Card>
                      </Grid>
                  </Grid>
        }
        </Layout>
    )
}

export default dynamic(() => Promise.resolve(Cart), {ssr:false})
