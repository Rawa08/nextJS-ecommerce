import { Link, Button, List, ListItem, TextField, Typography } from "@mui/material";
import Layout from "../components/Layout";
import styles from '../styles/App.module.css';
import {useForm, Controller} from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from "js-cookie";
import axios from 'axios';
import getError from '../utils/formatError';
import { useContext} from 'react';
import { useRouter } from "next/router";
import NextLink from 'next/link';
import { Store } from "../utils/Store";

const Register = () => {
   
    const {state:{user}, dispatch} = useContext(Store);
    

    const router = useRouter();
    const {redirect} = router.query;


    if(user){
        
        router.push(redirect || '/');
    };


    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const {handleSubmit, control, formState:{errors}} = useForm();


    const submitRegister = async (fields) => {
        closeSnackbar();
        const {fullName, email, password, passwordConfirm} = fields;

        if(password !== passwordConfirm){
            enqueueSnackbar("Password doesn't match", { variant: 'error', autoHideDuration:1500 })
            return;
        }
        else {

        try{
            const {data} = await axios.post(`/api/users/register`, {fullName,email, password});
            dispatch({type:'USER_LOGIN', payload: data});
            Cookies.set('user', JSON.stringify(data));
            router.push(redirect || '/');

        }catch(error){
            enqueueSnackbar(getError(error), { variant: 'error', autoHideDuration:3000 })
        }
    }
    }
    return (
        <Layout title="Register">
            <form className={styles.form} onSubmit={handleSubmit(submitRegister)}>
                <Typography component='h3' variant='h3'>
                    Register
                </Typography>
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
                        <Controller name="password" control={control} defaultValue="" rules={{required:true,minLength:6,}}
                        render={({field}) => (<TextField variant='outlined' fullWidth id="password" label='Password' inputProps={{type:'password'}} error={Boolean(errors.password)}
                        helperText={errors.password ? errors.password.type === 'minLength' ? 'Password to short' : 'Password is required':''} {...field}></TextField>)}></Controller>
                    
                    </ListItem>
                    <ListItem>
                        <Controller name="passwordConfirm" control={control} defaultValue="" rules={{required:true,minLength:6,}}
                        render={({field}) => (<TextField variant='outlined' fullWidth id="passwordConfirm" label='Password Confirmation' inputProps={{type:'password'}} error={Boolean(errors.passwordConfirm)}
                        helperText={errors.passwordConfirm ? errors.passwordConfirm.type === 'minLength' ? 'Password Confirmation is to short' : 'Password Confirmation is required':''} {...field}></TextField>)}></Controller>
                    
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='secondary' type='submit' fullWidth>Register</Button>
                    </ListItem>
                    <ListItem>
                     Have an account? &nbsp; <NextLink href={`/login?redirect=${redirect || '/'}`} passHref><Link>Login here!</Link></NextLink>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}

export default Register
