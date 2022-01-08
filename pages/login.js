import { Link, Button, List, ListItem, TextField, Typography } from "@mui/material";
import Layout from "../components/Layout";
import styles from '../styles/App.module.css'

import Cookies from "js-cookie";
import axios from 'axios';

import { useContext, useState} from 'react';
import { useRouter } from "next/router";
import NextLink from 'next/link';
import { Store } from "../utils/Store";

const Login = () => {
    const {state, dispatch} = useContext(Store);
    const {user} = state;

    const router = useRouter();
    const {redirect} = router.query;

    if(user){
        
        router.push(redirect || '/');
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitLogin = async e => {
        e.preventDefault();

        if(email.length >0 && password.length > 0){

        try{
            const {data} = await axios.post(`/api/users/login`, {email, password});
            dispatch({type:'USER_LOGIN', payload: data});
            Cookies.set('user', JSON.stringify(data));
            router.push(redirect || '/');

        }catch(e){
           console.log(e.response.data ? e.response.data.message : e.message)
        }
        
        
    }else {
        alert('Provide Email and Password')
    }
    }
    return (
        <Layout title="Login">
            <form className={styles.form} onSubmit={e => submitLogin(e)}>
                <Typography component='h2' variant='h2'>
                    Login
                </Typography>
                <List>
                    <ListItem>
                        <TextField variant='outlined' fullWidth id="email" label='Email' inputProps={{type:'email'}} onChange={e => setEmail(e.target.value)}></TextField>
                    </ListItem>
                    <ListItem>
                    <TextField variant='outlined' fullWidth id="password" label='Password' inputProps={{type:'password'}} onChange={e => setPassword(e.target.value)}></TextField>
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' color='secondary' type='submit' fullWidth>Sign in</Button>
                    </ListItem>
                    <ListItem>
                     Don&apos;t have an account? &nbsp; <NextLink href="/register" passHref><Link>Get one here</Link></NextLink>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}

export default Login
