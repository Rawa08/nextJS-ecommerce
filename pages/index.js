
import {useContext, useState, useEffect} from 'react';
import {Store} from '../utils/Store';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, TextField } from '@mui/material';
import styles from '../styles/App.module.css';
import db from '../utils/db';
import Product from '../models/Product';



export default function Home({productsFromDb}) {

  const [products, setProducts] = useState(null);
  const [showBrands, setShowBrands] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [brandsArray, setBrandsArray] = useState('');
  const [categoryArray, setCategoryArray] = useState('');

  useEffect(() => {
    setProducts(productsFromDb);

    const brandsArray = []
    productsFromDb.map(prod => {
      if(!brandsArray.includes(prod.brand.toLowerCase())){
        brandsArray.push(prod.brand.toLowerCase())
        return;
      }
      return;
    })

    setBrandsArray(brandsArray)
    
    
    const categoryArray = []
    productsFromDb.map(prod => {
      if(!categoryArray.includes(prod.category.toLowerCase())){
        categoryArray.push(prod.category.toLowerCase())
        return;
      }
      return;
    })

    setCategoryArray(categoryArray)

  },[productsFromDb]);

  const {dispatch} = useContext(Store);
  
  const addToCart = product => (dispatch({type:'ADD_TO_CART', payload:{...product, quantity:1}}));
  

  const filterBrand = brand => {
    const filteredProd = productsFromDb.filter(prod => prod.brand.toLowerCase() === brand.toLowerCase());
    setProducts(filteredProd)
  };



  const filterList= (condition) => {
    switch (condition) {
      case 1:
        setShowCategory(false);
        setShowBrands(!showBrands);
        break;
      
      case 2:
        setShowBrands(false);
        setShowCategory(!showCategory);
        break;  
      default:
        setProducts(productsFromDb);
        setShowBrands(false);
        setShowCategory(false)
        break;
    }
  }

  const filterCategory = category => {
    const filteredCat = productsFromDb.filter(prod => prod.category.toLowerCase() === category.toLowerCase());
    setProducts(filteredCat)
  }


  const searchProduct = e => {
    const filtered =  productsFromDb.filter(product => product.title.toLowerCase().includes(e.target.value.toLowerCase()));
    setProducts(filtered)
  }
  return (
     <Layout title="My E-commerce">
       <Grid container spacing={1} className={styles.homeContainer}>
         <Grid item xs={12} md={3}>
         <TextField id="outlined-basic" label="Search" variant="outlined" fullWidth onChange={searchProduct} />
         <Button onClick={() => filterList(1)}>Brands</Button>
         <Button onClick={() => filterList(2)}>Category</Button>

         {showBrands && <Grid container spacing={1} padding={1}>{brandsArray.map((brand, i) => (
                  <Grid item xs={12} md ={12} key={i}>
                  <Button variant='contained' fullWidth onClick={() => filterBrand(brand)}>{brand}</Button>
                  </Grid>
                ))} </Grid>
         }

         {
           showCategory &&   <Grid container spacing={1} padding={1}>{categoryArray.map((cat, i) => (
            <Grid item xs={12} md ={12} key={i}>
             <Button variant='contained' onClick={() => filterCategory(cat)} fullWidth >{cat}</Button>
             </Grid>
           ))} 
           </Grid>
         }

          <Grid item padding={1}>
          <Button  variant='outlined' fullWidth onClick={() => filterList()} >Show All Products</Button>
          </Grid>

         </Grid>
         
         <Grid item xs={12} md={9}>
       <Grid container spacing={1}>
        { products ? products.map(product => (
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
        ):
          <Typography component='h4' variant='h4'>No products available</Typography>
        }
       </Grid>
       </Grid>
       </Grid>
     </Layout>
  )
}


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
        props: {productsFromDb: null}
      }
    }
  }
 
} 