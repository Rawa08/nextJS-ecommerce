import {useContext} from 'react';
import {Store} from '../utils/Store'
import NextLink from 'next/link';
import Head from 'next/head'
import dynamic from 'next/dynamic';
import styles from '../styles/App.module.css'
import { AppBar, Toolbar, Typography, Container, Link, Badge, Button } from '@mui/material'



const Layout = ({title,description, children}) => {

    const {state:{cart, user}} = useContext(Store);
    
    const cartCount = cart.cartItems.reduce((accumulator, item) => (accumulator + item.quantity),0);

    return (
        <div>
            <Head>
                <title>{title}</title>
                {description && <meta name="description" content={description} />}
            </Head>
            <AppBar position='static' className={styles.navBar}>
                <Toolbar>
                    <NextLink href="/" passHref><Link><Typography className={styles.brand}>My E-commerce</Typography>
                    </Link></NextLink>
                    
                    <div className={styles.grow}></div>
                    <div>
                        <NextLink href="/cart" passHref>
                            <Link>
                            {cartCount <1 ? 'Cart' :  <Badge color="secondary" badgeContent={cartCount}>Cart</Badge> }
                            </Link>
                        </NextLink>
                        
                            {user ?<a> {user.name} </a>:<NextLink href="/login" passHref><Link>Login</Link></NextLink>}
                        
                    </div>
                </Toolbar>
            </AppBar>
            <Container className={styles.main}>{children}</Container>
 
            <footer className={styles.footer}>
                <Typography>All rightsreservd. www.rawa.se</Typography>
            </footer>
        </div>
    )
}

export default dynamic(()=>Promise.resolve(Layout), {ssr:false});
