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
  TextField,
  Switch
} from '@mui/material';
import styles from '../../styles/App.module.css';
import Product from '../../models/Product';
import db from '../../utils/db';
import {useForm, Controller} from 'react-hook-form';



const AdminProducts = ({products}) => {
  const {
    state: { user },
  } = useContext(Store);
  const router = useRouter();

  const {handleSubmit, control, formState:{errors}, setValue} = useForm();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [showOOS, setShowOOS] = useState(false);
  const [showEdit, setShowEdit] = useState(true);
  

 
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

const submitUpdate = (fields) => console.log(fields)

  
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
                  {showEdit && 

                 
                                <form className={styles.form} onSubmit={handleSubmit(submitUpdate)}>
           
                <List>
                    <ListItem>
                        <Controller name="Title"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="title" label='Product Name' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="Brand"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="brand" label='Brand' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="Category"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="category" label='Category' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="Description"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="description" label='Product Description' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="Image"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="image" label='Image' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                    <Controller name="created"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField sx={{width: '45%', margin: 'auto' }} variant='outlined' id="created"  inputProps={{type:'date'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        <Controller name="Price"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField sx={{width: '23%', margin: 'auto' }} variant='outlined' fullWidth id="price" label='Price' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        <Controller name="popularity"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField  sx={{width: '20%', margin: 'auto' }} variant='outlined' fullWidth id="popularity" label='popularity' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        <Controller name="oos"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <Switch  sx={{width: '10%', margin: 'auto' }} variant='outlined'  id="oos" label='outOfStock' inputProps={{type:'checkbox'}}  {...field}
                            ></Switch>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='secondary' type='submit' fullWidth>Continue to Payment</Button>
                    </ListItem>
                 
                </List>
            </form>
                  }
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
