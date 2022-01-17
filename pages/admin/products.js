import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useState } from 'react';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import {
  Card,
  List,
  ListItem,
  Button,
  Typography,
  Grid,
  ListItemText,
} from '@mui/material';
import styles from '../../styles/App.module.css';
import Product from '../../models/Product';
import db from '../../utils/db';



const AdminProducts = ({products}) => {
  const {
    state: { user },
  } = useContext(Store);
  const router = useRouter();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [showOOS, setShowOOS] = useState(false);
  

 
  useEffect(() => {
    if (!user.isAdmin) {
      return router.push('/');
    }
    
    // const fetchProducts = async () => {
    //     try{
    //         setLoading(true);

    //         const {data} = await axios.post('/api/admin/orders',{},{
    //             headers:{
    //                 authorization: `Bearer ${user.token}`,
                    
    //               }
    //             });
    //             console.log(data[0])
    //             setOrders(data)
                
    //             setLoading(false)
               
                
    //     }
    //     catch(err) {
    //         console.log(err)
    //     }
    // }
    // fetchProducts()
    

  }, []);

  
  return (
    <Layout title="Admin Products">
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={styles.section}>
              <List>
                  <NextLink href={'/admin/dashboard'} passHref>
                      <ListItem button  component='a'>
                          <ListItemText primary='Orders'></ListItemText>
                      </ListItem>
                  </NextLink>
                  <NextLink href={'/admin/products'} passHref>
                      <ListItem button selected component='a'>
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
                          <Grid container spacing={2}>
                            <Grid item><Button onClick={()=>setShowAddProduct(!showAddProduct)}>Add product</Button></Grid>
                            <Grid item onClick={()=>setShowCategory(!showCategory)}><Button>Show by Category</Button></Grid>
                            <Grid item onClick={()=>setShowBrands(!showBrands)}><Button>Show by Brand</Button></Grid>
                            <Grid item onClick={()=>setShowOOS(!showOOS)}><Button>Show stock status</Button></Grid>
                            
                          </Grid>
         
              </ListItem>
              
                {showAddProduct && <Typography><ListItem>Add product form</ListItem></Typography>}
                {showCategory && <Typography><ListItem>All Categories here</ListItem></Typography>}
                {showBrands && <Typography><ListItem>All Brands here</ListItem></Typography>}
                {showOOS && <Typography><ListItem>
                  <Button>Out of stock</Button>
                  <Button>In Stock</Button>
               
                  </ListItem></Typography>}
              
                  <ListItem>
                <Typography component="h5" variant="h5">
                  Products
                </Typography>
              </ListItem>
              
                {products && products.map(product => (
                  <ListItem key={product._id}>
                  <Typography >{product.title}</Typography>
                  </ListItem>
                ))}
              
              
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = async context => {
  try{
    await db.connectDb();
    const products = await Product.find({}).lean();
    await db.disconnectDb();
    return{
      props: {products: products.map(p => (db.convertDocToObject(p)))}
    }
  }
  catch(e){
    if(e){
      return{
        props: {products: null}
      }
    }
  }
 
} 

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
