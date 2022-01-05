import {useContext} from 'react';
import NextLink from 'next/link';
import Image from 'next/image'
import {Store} from '../utils/Store';
import Layout from '../components/Layout';
import {Button, Typography, Link, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem } from '@mui/material';
import styles from  '../styles/App.module.css';

const Cart = () => {

    const {state} = useContext(Store);
    const {cart: {cartItems}} = state;

    return (
        <Layout title="Cart">
            <Typography component='h3' variant='h3'>Shopping Cart</Typography>

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
                                                  <Select defaultValue={2}>
                                                          
                                                  </Select>
                                              </TableCell>
                                              <TableCell align='right'>{item.price}</TableCell>
                                              <TableCell align='right'><Button variant='contained' color='secondary'>X</Button></TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </TableContainer>
                      </Grid>
                      <Grid item md={3} xs={12}>
                          Actions
                      </Grid>
                  </Grid>
        }
        </Layout>
    )
}

export default Cart
