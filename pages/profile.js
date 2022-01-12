import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext} from 'react';
import axios from 'axios';
import { Store } from '../utils/Store';
import { getError } from '../utils/formatError';
import Layout from '../components/Layout';
import {
  Card,
  List,
  ListItem,
  Button,
  Typography,
  Grid,
  ListItemText,
  TextField
} from '@mui/material';
import styles from '../styles/App.module.css';
import {useForm, Controller} from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const Profile = () => {
  const {
    state: { user }, dispatch
  } = useContext(Store);
  const router = useRouter();




useEffect(() => {
    if (!user) {
      return router.push('/login');
    }
    setValue('fullName', user.fullName);
    setValue('email', user.email);
  }, []);


const {handleSubmit, control, formState:{errors}, setValue} = useForm();
const { enqueueSnackbar, closeSnackbar } = useSnackbar();

const submitRegister = async (fields) => {
    closeSnackbar();
    const {fullName, email, password, passwordConfirm} = fields;

    if(password && password !== passwordConfirm || passwordConfirm && password !== passwordConfirm){
        enqueueSnackbar("Password doesn't match", { variant: 'error', autoHideDuration:1500 })
        return;
    }
    else {

    try{
        const {data} = await axios.put(`/api/users/profile`, {fullName,email, password}, {
            headers:{authorization: `Bearer ${user.token}`}
        });
        dispatch({type:'USER_LOGIN', payload: data});
        Cookies.set('user', JSON.stringify(data));
        enqueueSnackbar('Your Profile updated successfully',{ variant: 'success', autoHideDuration:1800 } )
      

    }catch(error){
        enqueueSnackbar(getError(error), { variant: 'error', autoHideDuration:3000 })
    }
}
}


  return (
    <Layout title="Profile">
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={styles.section}>
              <List>
                  <NextLink href={'/profile'} passHref>
                      <ListItem button selected component='a'>
                          <ListItemText primary='User Profile'></ListItemText>
                      </ListItem>
                  </NextLink>
                  <NextLink href={'/order-history'} passHref>
                      <ListItem button  component='a'>
                          <ListItemText primary='Order History'></ListItemText>
                      </ListItem>
                  </NextLink>
              </List>
          </Card>
        </Grid>

        <Grid item md={10} xs={12}>
          <Card className={styles.section}>
            <List>
                
              <ListItem>
                <Typography component="h3" variant="h3">
                  Profile
                </Typography>
              </ListItem>
              
              
                <form className={styles.form} onSubmit={handleSubmit(submitRegister)}>
          
                <List>
                    
                    <ListItem>
                        <Controller name="fullName"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:3,
                        }}
                        render={({field})=>(
                            <TextField variant='outlined' fullWidth id="fullName" label='Full Name' inputProps={{type:'text'}} 
                            error={Boolean(errors.fullName)}
                            helperText={errors.fullName ? errors.fullName.type === 'minLength' ? 'Name to short' : 'Full name is required':''} {...field}
                            ></TextField>
                        )}></Controller>
                        
                    </ListItem>
                    <ListItem>
                    <Controller 
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
                        }}
                        render={({field}) => (
                            <TextField variant='outlined' fullWidth id="email" label='Email' inputProps={{type:'email'}}
                            error={Boolean(errors.email)}
                            helperText={errors.email ? errors.email.type === 'pattern' ? 'Email is not valid' : 'Email is required':''} {...field}></TextField>
                        )}>
                        
                        </Controller>   
                    </ListItem>
                    <ListItem>
                        <Controller name="password" control={control} defaultValue="" rules={{
                            validate: (value) => (value === '' || value.length >5 || 'Password have to minimum 6 characters')
                        }}
                        render={({field}) => (<TextField variant='outlined' fullWidth id="password" label='Password' inputProps={{type:'password'}} error={Boolean(errors.password)}
                        helperText={errors.password ?  'Password is to short' :''} {...field}></TextField>)}></Controller>
                    
                    </ListItem>
                    <ListItem>
                        <Controller name="passwordConfirm" control={control} defaultValue="" rules={{
                            validate: (value) => (value === '' || value.length >5 || 'Password Confirmation have to minimum 6 characters')
                        }}
                        render={({field}) => (<TextField variant='outlined' fullWidth id="passwordConfirm" label='Password Confirmation' inputProps={{type:'password'}} error={Boolean(errors.passwordConfirm)}
                        helperText={errors.passwordConfirm ? 'Password Confirmation is to short' :''} {...field}></TextField>)}></Controller>
                    
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='secondary' type='submit' fullWidth>Update</Button>
                    </ListItem>
                 
                </List>
            </form>
              
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
