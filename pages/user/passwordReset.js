import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import React, { useEffect, useContext, useState} from 'react';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { getError } from '../../utils/formatError';
import Layout from '../../components/Layout';
import {Card, List, ListItem, Button, Typography, TextField } from '@mui/material';
import styles from '../../styles/App.module.css';
import {useForm, Controller} from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const Reset = () => {

  const { state: { user }, dispatch } = useContext(Store);
  
  const router = useRouter();
  
  const {token, id} = router.query
  const [validLink, setValidLink] = useState(false);

useEffect(() => {

    if (user) {
      return router.push('/user/profile');
    }

    if(token && id){
     
      setValidLink(true)
    }
    
 
  }, [token, id]);


const {handleSubmit, control, formState:{errors}, setValue} = useForm();
const { enqueueSnackbar, closeSnackbar } = useSnackbar();




const submitReset = async (fields) => {
    closeSnackbar();
    const {password, passwordConfirm} = fields;


    if(password && password !== passwordConfirm || passwordConfirm && password !== passwordConfirm){
        enqueueSnackbar("Password doesn't match", { variant: 'error', autoHideDuration:1500 })
        return;
    }

      try{
       
        const {data} = await axios.post(`/api/users/newPassword`, {password, token, id});
        router.push('/login?redirect=passwordChanged');
      
        }catch(error){
        enqueueSnackbar(getError(error), { variant: 'error', autoHideDuration:3000 })
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
              
              
          {validLink &&  <form className={styles.form} onSubmit={handleSubmit(submitReset)}>
          
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
            </form>}
              
            </List>
          </Card>
  
    </Layout>
  );
};


export default dynamic(() => Promise.resolve(Reset), { ssr: false });
