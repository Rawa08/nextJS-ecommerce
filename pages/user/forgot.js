import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useState} from 'react';
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
  TextField,
  Link
} from '@mui/material';
import styles from '../../styles/App.module.css';
import {useForm, Controller} from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const Profile = () => {

  const { state: { user }} = useContext(Store);
  const router = useRouter();


useEffect(() => {
    if (user) {
      return router.push('/user/profile');
    }

  }, []);

const [success, setSuccess] = useState(false);

const {handleSubmit, control, formState:{errors}, setValue} = useForm();
const { enqueueSnackbar, closeSnackbar } = useSnackbar();

const submitRegister = async (fields) => {
    closeSnackbar();

    if(!fields.email){
        enqueueSnackbar("Provide your email!", { variant: 'error', autoHideDuration:1500 })
        return;
    }
    else {

    try{
        const {data} = await axios.post(`/api/users/forgot`, {email:fields.email});
        enqueueSnackbar(data.message, { variant: 'success', autoHideDuration:4000 })
        
        setSuccess(true);

    }catch(error){
      setSuccess(false)
        enqueueSnackbar(getError(error), { variant: 'error', autoHideDuration:4000 })
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
             
                
          
                <List>
                {success ? 
              <ListItem>
                   <Typography component="p" variant="p" >
                   Please check your email for password recovery link! &nbsp;
                 </Typography>
                 <NextLink href={'/'} passHref>
                      <Link>Back to Home</Link>
                  </NextLink>
                 </ListItem>
              :
                    <form className={styles.form} onSubmit={handleSubmit(submitRegister)}>
                  
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
                        <Button variant='contained' color='secondary' type='submit' fullWidth>Send New Password</Button>
                    </ListItem>
                 
                  
                    </form>
            }
                </List>
            </List>
          </Card>
  
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
