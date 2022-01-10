import { Link, Button, List, ListItem, TextField, Typography } from "@mui/material";
import Layout from "../components/Layout";
import styles from '../styles/App.module.css'

import Cookies from "js-cookie";
import axios from 'axios';

import { useContext, useState} from 'react';
import { useRouter } from "next/router";
import NextLink from 'next/link';
import { Store } from "../utils/Store";

const Register = () => {
    const {state, dispatch} = useContext(Store);
    const {user} = state;

    const router = useRouter();
    const {redirect} = router.query;

    if(user){
        
        router.push(redirect || '/');
    };

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const submitRegister = async e => {
        e.preventDefault();

        if(password !== passwordConfirm){
            alert('Password don´t match!')
        }
        else {

        try{
            const {data} = await axios.post(`/api/users/login`, {email, password});
            dispatch({type:'USER_LOGIN', payload: data});
            Cookies.set('user', JSON.stringify(data));
            router.push(redirect || '/');

        }catch(e){
           console.log(e.response.data ? e.response.data.message : e.message)
        }
    }
    }
    return (
        <Layout title="Register">
            <form className={styles.form} onSubmit={e => submitRegister(e)}>
                <Typography component='h2' variant='h2'>
                    Register
                </Typography>
                <List>
                    <ListItem>
                        <TextField variant='outlined' fullWidth id="fullName" label='Full Name' inputProps={{type:'text'}} onChange={e => setFullName(e.target.value)}></TextField>
                    </ListItem>
                    <ListItem>
                        <TextField variant='outlined' fullWidth id="email" label='Email' inputProps={{type:'email'}} onChange={e => setEmail(e.target.value)}></TextField>
                    </ListItem>
                    <ListItem>
                    <TextField variant='outlined' fullWidth id="password" label='Password' inputProps={{type:'password'}} onChange={e => setPassword(e.target.value)}></TextField>
                    </ListItem>
                    <ListItem>
                    <TextField variant='outlined' fullWidth id="passwordConfirm" label='Password Confirmation' inputProps={{type:'password'}} onChange={e => setPasswordConfirm(e.target.value)}></TextField>
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
