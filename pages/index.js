
import {useContext} from 'react';
import {Store} from '../utils/Store';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button} from '@mui/material';
import styles from '../styles/App.module.css';
import db from '../utils/db';
import Product from '../models/Product';



export default function Home({products}) {

  const {dispatch} = useContext(Store);

  const addToCart = product => (dispatch({type:'ADD_TO_CART', payload:{...product, quantity:1}}));

  return (
     <Layout title="My E-commerce">
       <Grid container spacing={1} className={styles.homeContainer}>
        {products.map(product => {
 
          return (
            <Grid item md={4} xs={12} key={product._id}> 
            <Card>
            <NextLink href={`/product/${product._id}`} passHref>
              <CardActionArea>
             
                <CardMedia component='img' image={product.image} title={product.title}  className={styles.productImage}></CardMedia>
                </CardActionArea>
                </NextLink>
              <CardContent>
                <Typography>{ product.title.length > 30 ? (product.title.slice(0,25) + '...'): product.title}</Typography>
              </CardContent>
           
                <CardActions>
                  <Typography>$ {product.price}</Typography>
                  {product.outOfStock ?<Button size='small' color="primary" disabled> Product is Out of Stock</Button> : <Button size='small' color="primary" onClick={()=>addToCart(product)}> Add to Bag</Button>}
                  
                </CardActions>
              
              
            </Card>
            </Grid>
          )
        })}
       </Grid>
     </Layout>
  )
}


export const getServerSideProps = async context => {
  await db.connectDb();
  const products = await Product.find({}).lean();
  await db.disconnectDb();
  return{
    props: {products: products.map(p => (db.convertDocToObject(p)))}
  }
} 