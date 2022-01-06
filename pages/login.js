import { Link, Button, List, ListItem, TextField, Typography } from "@mui/material";
import Layout from "../components/Layout";
import styles from '../styles/App.module.css'
import NextLink from 'next/link';


const Login = () => {
    const submitLogin = null;
    return (
        <Layout title="Login">
            <form className={styles.form} onSubmit={e => submitLogin(e)}>
                <Typography component='h2' variant='h2'>
                    Login
                </Typography>
                <List>
                    <ListItem>
                        <TextField variant='outlined' fullWidth id="email" label='Email' inputProps={{type:'email'}}></TextField>
                    </ListItem>
                    <ListItem>
                    <TextField variant='outlined' fullWidth id="password" label='Password' inputProps={{type:'password'}}></TextField>
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
