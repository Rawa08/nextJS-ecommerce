
import { useContext, useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image'
import Layout from '../../components/Layout';
import {Link, Grid, List, ListItem, Typography, Card, Button,Select, MenuItem} from '@mui/material';
import styles from  '../../styles/App.module.css';
import {Store} from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';


const ProductScreen = ({product}) => {
    const [quantity, setQuantity] = useState(1);
    const {dispatch} = useContext(Store);

    if(!product) return(<div className={styles.section}>
        <Typography>Can&apos;t Find Product</Typography>
        <NextLink href="/" passHref>
            <Link><Typography>Back to products</Typography></Link>
        </NextLink>
    </div>);

    

    const addToCart = async () => {
       dispatch({type:'ADD_TO_CART', payload:{...product, quantity}})
    } 

    return (
       <Layout title={product.title} description={product.description}>
           <div className={styles.section}>
               <NextLink href="/" passHref>
                   <Link><Typography>Back to products</Typography></Link>
               </NextLink>
           </div>
        <Grid container spacing={1}>
            <Grid item md={5} xs={12}>
                <Image src={product.image} width={640} height={640}  alt={product.title} objectFit='contain' layout='responsive' priority='true' ></Image>
            </Grid>
            <Grid item md={4} xs={12}>
                <List>
                <ListItem><Typography component='h5' variant="h5">{product.title}</Typography></ListItem>
                    <ListItem><Typography>Category: {product.category}</Typography></ListItem>
                    <ListItem><Typography>Brand: Manufacturer unavailable</Typography></ListItem>
                    <ListItem><Typography>Rating: {product.rating.rate} Count:{product.rating.count}</Typography></ListItem>
                    <ListItem> <Typography>Description: {product.description}    </Typography></ListItem>
                </List>
            </Grid>
            <Grid item md={3} xs={12}>
                <Card>
                <List>
                    <ListItem>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography>Price</Typography>
                             </Grid>
                             <Grid item xs={6}>
                                $ {product.price}
                             </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' fullWidth className={styles.nativeColor} onClick={addToCart}>Add to Bag</Button>
                    </ListItem>
                    <ListItem>
                    <Select defaultValue={1} fullWidth onChange={(e) => setQuantity(e.target.value)}>
                          {[...Array(10).keys()].map((i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                              {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                    </ListItem>
                </List>
                </Card>
            </Grid>
        </Grid>
       </Layout>
    )
}

export default ProductScreen

export const getServerSideProps = async context => {
    
    await db.connectDb();
    try{
        const product = await Product.findById(context.query.slug).lean();
        return {
            props:{
              product: db.convertDocToObject(product)
            },
          };
    }catch(e){
        if(e){
            return{props:{}}
        }
    }
   

    
    await db.disconnectDb();
   
  }