import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import Image from 'next/image';
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
import { useSnackbar } from 'notistack';



const AdminProducts = ({productsFromDb}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state: { user }} = useContext(Store);
  const router = useRouter();

  const {handleSubmit, control,  setValue, formState:{errors}} = useForm();

  const [showCategory, setShowCategory] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState(null);
  const [brands, setBrands] = useState(null);
  const [category, setCategory] = useState(null);

 
  useEffect(() => {
    if (!user.isAdmin) {
      return router.push('/');
    }
    setProducts(productsFromDb);
    
    const brandsArray = []
    productsFromDb.map(prod => {
      if(!brandsArray.includes(prod.brand.toLowerCase())){
        brandsArray.push(prod.brand.toLowerCase())
        return;
      }
      return;
    })

    setBrands(brandsArray)
    
    
    const categoryArray = []
    productsFromDb.map(prod => {
      if(!categoryArray.includes(prod.category.toLowerCase())){
        categoryArray.push(prod.category.toLowerCase())
        return;
      }
      return;
    })

    setCategory(categoryArray)

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

const deleteProduct = () => {


  const action = key => (
    <React.Fragment>
        <Button  color='error' onClick={() => deleteProductConfirmed()}>
            Delete Product
        </Button>
        <Button className={styles.whiteColor} onClick={() => { closeSnackbar(key) }}>
            Cancel
        </Button>
    </React.Fragment>
  );
  enqueueSnackbar("Confirm Delete", {
    variant: 'warning',
    autoHideDuration: null,
    action,
  });

}
const deleteProductConfirmed = async () => {
  closeSnackbar();
  try{
    
    const {data} = await axios.delete("/api/admin/deleteProduct" ,{
      headers:{
        authorization: `Bearer ${user.token}`
      },data:{id:productId}
    });
    setShowEdit(false);
    enqueueSnackbar(data.message, { variant: 'success', autoHideDuration:2000 });

    const updateStateProducts = products.filter(prod => prod._id !== productId);

    setProducts(updateStateProducts);
  }catch(error){
    enqueueSnackbar(getError(error), { variant: 'error', autoHideDuration:4000 })
  }
}

const editProduct = (id) => {
  setAddProduct(false);
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

const filterBrand = brand => {
  const filteredProd = productsFromDb.filter(prod => prod.brand.toLowerCase() === brand.toLowerCase());
  setProducts(filteredProd)
}

const filterCategory = category => {
  const filteredCat = productsFromDb.filter(prod => prod.category.toLowerCase() === category.toLowerCase());
  setProducts(filteredCat)
}

const showOOS = () => {
  setProducts(prevArray => prevArray.filter(prod => prod.outOfStock))
}

const addProductForm = () => {
  setShowEdit(false);

  setValue('title', '')
  setValue('brand', '')
  setValue('category', '')
  setValue('description', '')
  setValue('image', '')
  setValue('price', null)
  setValue('popularity', null)
  setValue('oos', null)
  setAddProduct(true)
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
                            {!addProduct && <Grid item><Button onClick={addProductForm}>Add product</Button></Grid>}
                            <Grid item onClick={()=>setShowCategory(!showCategory)}><Button>Show by Category</Button></Grid>
                            <Grid item onClick={()=>setShowBrands(!showBrands)}><Button>Show by Brand</Button></Grid>
                            <Grid item onClick={showOOS}><Button>OOS Products</Button></Grid>
                            <Grid item onClick={() => setProducts(productsFromDb)}><Button>Show All</Button></Grid>
                            
                            
                          </Grid>
         
              </ListItem>
              
                
                {showCategory &&   <Grid container spacing={1} padding={1}>{category.map((cat, i) => (
                 <Grid item xs={cat.length > 13 ? 12 : 6} md ={2} key={i}>
                  <Button variant='contained' onClick={() => filterCategory(cat)} fullWidth >{cat}</Button>
                  </Grid>
                ))} 
                <Grid item xs={6} md ={2}>
                 <Button  variant='contained' fullWidth onClick={() => setProducts(productsFromDb)} >All</Button>
                 </Grid>
                </Grid>}


                {showBrands && <Grid container spacing={1} padding={1}>{brands.map((brand, i) => (
                  <Grid item xs={brand.length > 13 ? 12 : 6} md ={brand.length > 13 ? 4 : 2} key={i}>
                  <Button variant='contained' fullWidth onClick={() => filterBrand(brand)}>{brand}</Button>
                  </Grid>
                ))}  
                
                <Grid item xs={6} md ={2}>
                <Button  variant='contained' fullWidth onClick={() => setProducts(productsFromDb)}>All</Button>
                </Grid>
                </Grid>}
      
                
              
                  <ListItem>
                <Typography component="h5" variant="h5">
                  Products
                </Typography>
                </ListItem>
                {addProduct &&
                
                <form className={styles.form} onSubmit={handleSubmit(addNewProduct)}>
           
           <Grid container spacing={2} sx={{ marginTop:0, padding:2 }} >
           <Grid item xs={12} md ={6}>

                        <Controller name="title"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="title" label='Product Name' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </Grid>
                    <Grid item xs={12} md ={6}>
                        <Controller name="brand"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="brand" label='Brand' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                   </Grid>
                   <Grid item xs={12} md ={6}>
                        <Controller name="category"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="category" label='Category' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        </Grid>
                         <Grid item xs={12} md ={6}>
                        <Controller name="description"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="description" label='Product Description' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        </Grid>
                       
                        <Grid item xs={12} md ={12}>
                        <Controller name="image"
                        control={control}
                        defaultValue=""
                        rules={{
                          required:true,
                          pattern: /(^\/|^http)/
                      }}
                        render={({field})=>(
                            <TextField   variant='outlined' fullWidth id="image" label='Image' inputProps={{type:'text'}} 
                            error={Boolean(errors.image)}
                            helperText={errors.image && 'Image path have to be absolute (/imagefolder.. or http:// )'}
                            {...field}
                            ></TextField>
                        )}></Controller>
                   </Grid>
                   <Grid item xs={12} md={4}>
                   <Controller name="oos"
                        control={control}
                        defaultValue={false}
                        render={({field})=>(
                           <Typography >Out of stock: <Switch  id="oos" label='outOfStock' inputProps={{type:'checkbox'}} checked={field.value} {...field}
                           /></Typography> 
                        )}></Controller>
                          </Grid>
                          <Grid item xs={12} md={4}>
                        <Controller name="price"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField  variant='outlined' fullWidth id="price" label='Price' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <Controller name="popularity"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField   variant='outlined' fullWidth id="popularity" label='popularity' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        </Grid>
                   
                        <Grid item xs={6} md={6}>
                        <Button variant='contained' color='secondary' type='submit' fullWidth >Add</Button>
                        </Grid>
                        <Grid item xs={6} md={6}>
                        <Button variant='contained' color='error' type='submit' fullWidth onClick={() => setAddProduct(false)}>X</Button>
                   </Grid>
                 
                </Grid>
            </form>
                
                }
                  {showEdit && 

                 
                                <form className={styles.form} onSubmit={handleSubmit(submitUpdate)}>
           
           <Grid container spacing={2} sx={{ marginTop:0, padding:2 }} >
           <Grid item xs={12} md ={6}>
                        <Controller name="title"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined'  fullWidth id="title" label='Product Name' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </Grid>
                    <Grid item xs={12} md ={6}>
                        <Controller name="brand"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="brand" label='Brand' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        </Grid>
                    <Grid item xs={12} md ={6}>
                  
                        <Controller name="category"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="category" label='Category' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </Grid>
                    <Grid item xs={12} md ={6}>
                        <Controller name="description"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="description" label='Product Description' inputProps={{type:'text'}}  {...field}
                            ></TextField>
                        )}></Controller>
                    </Grid>
                    <Grid item xs={12} md ={12}>
                        <Controller name="image"
                        control={control}
                        defaultValue=""
                        rules={{
                          required:true,
                          pattern: /(^\/|^http)/
                      }}
                        render={({field})=>(
                            <TextField   variant='outlined' fullWidth id="image" label='Image' inputProps={{type:'text'}}
                            error={Boolean(errors.image)}
                            helperText={errors.image && 'Image path have to be absolute (/imagefolder.. or http:// )'}
                            {...field}
                            ></TextField>
                        )}></Controller>
                   </Grid>
                   <Grid item xs={12} md={4}>
                   <Controller name="oos"
                        control={control}
                        defaultValue={false}
                        render={({field})=>(
                           <Typography  >Out of stock: <Switch  id="oos" label='outOfStock' inputProps={{type:'checkbox'}} checked={field.value} {...field}
                           /></Typography> 
                        )}></Controller>
                        </Grid>
                        <Grid item xs={6} md={4}>
                        <Controller name="price"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField  variant='outlined' fullWidth id="price" label='Price' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        </Grid>
                                <Grid item xs={6} md={4}>
                        <Controller name="popularity"
                        control={control}
                        defaultValue=""
                        render={({field})=>(
                            <TextField  variant='outlined' fullWidth id="popularity" label='popularity' inputProps={{type:'number'}}  {...field}
                            ></TextField>
                        )}></Controller>
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <Button variant='contained' color='error' type='submit' fullWidth onClick={() => deleteProduct()}>REMOVE PRODUCT</Button>
                        </Grid>
                        <Grid item xs={6} md={4}>
                        <Button variant='contained' color='secondary' fullWidth type='submit'>UPDATE</Button>
                        </Grid>
                        <Grid item xs={6} md={4}>
                        <Button variant='contained' color='error' type='submit' fullWidth onClick={() => setShowEdit(false)}>CLOSE</Button>
                        </Grid>
                   
                 
                </Grid>
            </form>
                  }

                {products && products.map((product, i) => (
                  <Grid container spacing={3} key={i} sx={{ alignItems: 'center', marginTop:0 }} >
                  <Grid item xs={1} md ={0.5}>
                  <Typography margin={1}>{i+1}.</Typography>
                  </Grid>
                  <Grid item xs={2} md={1}>
                   <Image src={product.image} width={5} height={5}  alt={product.title} objectFit='contain' layout='responsive' priority='false' ></Image> 
                   </Grid>
                   <Grid item xs={6} md={7.5}>
                   <Typography  onClick={() => router.push(`/product/${product._id}`)}>{product.title}</Typography>
                  </Grid>
                   <Grid item xs={2} md={3}>
                  <Button onClick={() => editProduct(product._id)}>Edit</Button>
                  </Grid>
                </Grid>
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
