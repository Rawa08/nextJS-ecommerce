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
import axios from 'axios';



const AdminProducts = ({productsFromDb}) => {
  const {
    state: { user },
  } = useContext(Store);
  const router = useRouter();

  const {handleSubmit, control, formState:{errors}, setValue} = useForm();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [showOOS, setShowOOS] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState(null);

 
  useEffect(() => {
    if (!user.isAdmin) {
      return router.push('/');
    }
    setProducts(productsFromDb)
  }, []);

const submitUpdate = async (fields) => {
  const {title, brand, category, description, image, price, popularity, oos} = fields;

  try{
    
    const {data} = await axios.put("/api/admin/updateProducts",{
      id:productId,
      title, brand, category, description,
      image, price, popularity, oos} ,{
      headers:{
        authorization: `Bearer ${user.token}`
      }
    });
    setShowEdit(false);

    const updateStateProducts = products.map(prod => {
      if(prod._id === productId){
        prod = data;
      }

      return prod;
    });

    setProducts(updateStateProducts);
  }catch(error){
    console.log(error)
  }
};

const addNewProduct = async (fields) => {
  const {title, brand, category, description, image, price, popularity, oos} = fields;

  try{
    
    const {data} = await axios.post("/api/admin/addnewproduct",{
      title, brand, category, description,
      image, price, popularity, oos} ,{
      headers:{
        authorization: `Bearer ${user.token}`
      }
    });
    setAddProduct(false);    
    setProducts((products) => [...products, data]);
  }catch(error){
    console.log(error)
  }
}
const deleteProduct = async () => {
  try{
    
    const {data} = await axios.delete("/api/admin/deleteProduct" ,{
      headers:{
        authorization: `Bearer ${user.token}`
      },data:{id:productId}
    });
    setShowEdit(false);

    const updateStateProducts = products.filter(prod => prod._id !== productId);

    setProducts(updateStateProducts);
  }catch(error){
    console.log(error)
  }
}

const editProduct = (id) => {
  const product = products.filter(p => (p._id === id))[0];
  setProductId(product._id)
  const {title, brand, category, description, image, price, popularity, outOfStock} = product;
  setValue('title', title)
  setValue('brand', brand)
  setValue('category', category)
  setValue('description', description)
  setValue('image', image)
  setValue('price', price)
  setValue('popularity', popularity)
  setValue('oos', outOfStock)

  setAddProduct(false)
  setShowEdit(true);
} 
  
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
                            {!addProduct && <Grid item><Button onClick={()=>setAddProduct(true)}>Add product</Button></Grid>}
                            <Grid item onClick={()=>setShowCategory(!showCategory)}><Button>Show by Category</Button></Grid>
                            <Grid item onClick={()=>setShowBrands(!showBrands)}><Button>Show by Brand</Button></Grid>
                            <Grid item onClick={()=>setShowOOS(!showOOS)}><Button>Show stock status</Button></Grid>
                            
                          </Grid>
         
              </ListItem>
              
                
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
                {addProduct &&
                
                <form className={styles.form} onSubmit={handleSubmit(addNewProduct)}>
           
                <List>
                    <ListItem>

                        <Controller name="title"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="title" label='Product Name' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="brand"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="brand" label='Brand' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="category"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="category" label='Category' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="description"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="description" label='Product Description' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem alignItems='center'>
                        <Controller name="image"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField  sx={{width: '50%', marginRight:'auto' }} variant='outlined' fullWidth id="image" label='Image' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                   
                   <Controller name="oos"
                        control={control}
                        defaultValue={false}
                        render={({field})=>(
                           <Typography sx={{width: '15%', margin:'auto' }}>Out of stock: <Switch  id="oos" label='outOfStock' inputProps={{type:'checkbox'}} checked={field.value} {...field}
                           /></Typography> 
                        )}></Controller>
                        <Controller name="price"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField sx={{width: '14%', margin:'auto' }} variant='outlined' fullWidth id="price" label='Price' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        <Controller name="popularity"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField  sx={{width: '14%', marginLeft:'auto' }} variant='outlined' fullWidth id="popularity" label='popularity' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='secondary' type='submit' sx={{width: '68%', margin: 'auto' }}>Add</Button>
                        <Button variant='contained' color='error' type='submit' sx={{width: '30%', margin: 'auto' }} onClick={() => setAddProduct(false)}>X</Button>
                    </ListItem>
                 
                </List>
            </form>
                
                }
                  {showEdit && 

                 
                                <form className={styles.form} onSubmit={handleSubmit(submitUpdate)}>
           
                <List>
                    <ListItem>

                        <Controller name="title"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="title" label='Product Name' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="brand"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="brand" label='Brand' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="category"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="category" label='Category' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller name="description"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="description" label='Product Description' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem alignItems='center'>
                        <Controller name="image"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField  sx={{width: '50%', marginRight:'auto' }} variant='outlined' fullWidth id="image" label='Image' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                   
                   <Controller name="oos"
                        control={control}
                        defaultValue={false}
                        render={({field})=>(
                           <Typography sx={{width: '15%', margin:'auto' }}>Out of stock: <Switch  id="oos" label='outOfStock' inputProps={{type:'checkbox'}} checked={field.value} {...field}
                           /></Typography> 
                        )}></Controller>
                        <Controller name="price"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField sx={{width: '14%', margin:'auto' }} variant='outlined' fullWidth id="price" label='Price' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        <Controller name="popularity"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField  sx={{width: '14%', marginLeft:'auto' }} variant='outlined' fullWidth id="popularity" label='popularity' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='secondary' type='submit' sx={{width: '50%', margin: 'auto' }}>UPDATE</Button>
                        <Button variant='contained' color='error' type='submit' sx={{width: '30%', margin: 'auto' }} onClick={() => deleteProduct()}>REMOVE PRODUCT</Button>
                        <Button variant='contained' color='error' type='submit' sx={{width: '18%', margin: 'auto' }} onClick={() => setShowEdit(false)}>CLOSE</Button>
                    </ListItem>
                 
                </List>
            </form>
                  }
                {products && products.map((product, i) => (
                  <ListItem key={product._id}>
                  <Typography>{i+1}. {product.title}</Typography>
                  <Button onClick={() => editProduct(product._id)}>Edit</Button>
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
      props: {productsFromDb: products.map(p => (db.convertDocToObject(p)))}
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
