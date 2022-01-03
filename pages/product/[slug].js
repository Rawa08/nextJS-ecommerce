import {useRouter} from 'next/router';
import NextLink from 'next/link';
import Image from 'next/image'
import {data} from '../../utils/data'
import Layout from '../../components/Layout';
import {Link, Grid, List, ListItem, Typography, Card, Button,} from '@mui/material';
import styles from  '../../styles/App.module.css';


const ProductScreen = () => {

    const router = useRouter();
    const {slug} = router.query;
    const product = data.products.find(a => a.id == slug);


    if(!product) return(<div>Product not found</div>)
    return (
       <Layout title={product.title} description={product.description}>
           <div className={styles.section}>
               <NextLink href="/" passHref>
                   <Link><Typography>Back to products</Typography></Link>
               </NextLink>
           </div>
        <Grid container spacing={1}>
            <Grid item md={5} xs={12}>
                <Image src={product.image} width={640} height={640}  alt={product.title} objectFit='contain' layout='responsive' ></Image>
            </Grid>
            <Grid item md={4} xs={12}>
                <List>
                <ListItem><Typography component='h1'>{product.title}</Typography></ListItem>
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
                        <Button variant='contained' fullWidth className={styles.nativeColor}>Add to Bag</Button>
                    </ListItem>
                </List>
                </Card>
            </Grid>
        </Grid>
       </Layout>
    )
}

export default ProductScreen
