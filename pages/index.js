
import NextLink from 'next/link';
import Layout from '../components/Layout';
import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button} from '@mui/material'
import {data} from '../utils/data';
import styles from '../styles/App.module.css';


export default function Home() {
  return (
     <Layout title="My E-commerce">
       <Grid container spacing={3}>
        {data.products.map(product => {
          product.image = `/images/${product.id}.jpg`;
          product.slug = product.id+product.title.slice(0,5);
          return (
            <Grid item md={4} key={product.id}> 
            <Card>
            <NextLink href={`/product/${product.slug}`} passHref>
              <CardActionArea>
                <CardMedia component='img' image={product.image} title={product.title}  className={styles.productImage}></CardMedia>
            
              <CardContent>
                <Typography>{product.title.slice(0,20)}</Typography>
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
