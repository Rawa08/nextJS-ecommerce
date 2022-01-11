import { Link, Button, List, ListItem, TextField, Typography } from "@mui/material";
import Layout from "../components/Layout";
import styles from '../styles/App.module.css'
import getError from '../utils/formatError';
import Cookies from "js-cookie";
import axios from 'axios';
import {useForm, Controller} from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useContext} from 'react';
import { useRouter } from "next/router";
import NextLink from 'next/link';
import { Store } from "../utils/Store";

const Login = () => {
    const {handleSubmit, control, formState:{errors}} = useForm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const {state, dispatch} = useContext(Store);
    const {user} = state;

    const router = useRouter();
    const {redirect} = router.query;

    if(user){
        
        router.push(redirect || '/');
    };

    const submitLogin = async ({email, password}) => {
        closeSnackbar();
        try{
            const {data} = await axios.post(`/api/users/login`, {email, password});
            dispatch({type:'USER_LOGIN', payload: data});
            Cookies.set('user', JSON.stringify(data));
            router.push(redirect || '/');

        }catch(error){
            enqueueSnackbar(getError(error), { variant: 'error', autoHideDuration:2000 })
         
        }
    }
    return (
        <Layout title="Login">
            <form className={styles.form} onSubmit={handleSubmit(submitLogin)}>
                <Typography component='h3' variant='h3'>
                    Login
                </Typography>
                <List>
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
                    <Controller 
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:6
                        }}
                        render={({field}) => (
                            <TextField variant='outlined' fullWidth id="password" label='Password' inputProps={{type:'password'}}
                            error={Boolean(errors.password)}
                            helperText={errors.password ? errors.password.type === 'minLength' ? 'Password is to Short' : 'Password is required':''} {...field}></TextField>
                        )}>
                        
                        </Controller> 

                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='secondary' type='submit' fullWidth>Sign in</Button>
                    </ListItem>
                    <ListItem>
                     Don&apos;t have an account? &nbsp; <NextLink href={`/register?redirect=${redirect || '/'}`} passHref><Link>Get one here</Link></NextLink>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}

export default Login
