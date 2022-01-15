import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext} from 'react';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { getError } from '../../utils/formatError';
import Layout from '../../components/Layout';
import {
  Card,
  List,
  ListItem,
  Button,
  Typography,

  TextField
} from '@mui/material';
import styles from '../../styles/App.module.css';
import {useForm, Controller} from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const Profile = () => {
  const {
    state: { user }, dispatch
  } = useContext(Store);
  const router = useRouter();

console.log(router.query.token)

// useEffect(() => {
//     if (!user) {
//       return router.push('/login');
//     }
  
//   }, []);


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
    <Layout title="REST PASSWORD">
    
          <Card className={styles.restSection} sx={{ boxShadow: 3 }}>
            <List>
                
              <ListItem className={styles.flexCenter}>
                
                <Typography component="h5" variant="h5" >
                  RESET PASSWORD
                </Typography>
              </ListItem>
              
              
                <form className={styles.form} onSubmit={handleSubmit(submitRegister)}>
          
                <List>
                    
                    
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
                        <Button variant='contained' color='secondary' type='submit' fullWidth>Update Password</Button>
                    </ListItem>
                 
                  
                </List>
            </form>
              
            </List>
          </Card>
  
    </Layout>
  );
};


export default dynamic(() => Promise.resolve(Profile), { ssr: false });


// http://localhost:3000/user/passwordReset?token=32ed15a3e0b01c2c2dbeb312871b676b3dfe1f0703efaae1009871e5be5b90ae&id=61e347e4fd015b6237925a38