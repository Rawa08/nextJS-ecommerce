
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
 
          return (
            <Grid item md={4} key={product.id}> 
            <Card>
            <NextLink href={`/product/${product.id}`} passHref>
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
