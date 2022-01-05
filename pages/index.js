
import NextLink from 'next/link';
import Layout from '../components/Layout';
import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button} from '@mui/material';
import styles from '../styles/App.module.css';

import db from '../utils/db';
import Product from '../models/Product';


export default function Home({products}) {
  return (
     <Layout title="My E-commerce">
       <Grid container spacing={3}>
        {products.map(product => {
 
          return (
            <Grid item md={4} key={product._id}> 
            <Card>
            <NextLink href={`/product/${product._id}`} passHref>
              <CardActionArea>
                <CardMedia component='img' image={product.image} title={product.title}  className={styles.productImage}></CardMedia>
            
              <CardContent>
                <Typography>{ product.title.length > 30 ? (product.title.slice(0,25) + '...'): product.title}</Typography>
              </CardContent>
           
                <CardActions>
                  <Typography>$ {product.price}</Typography>
                  <Button size='small' color="primary"> Add to Bag</Button>
                </CardActions>
              </CardActionArea>
              </NextLink>
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