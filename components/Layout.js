import {useContext} from 'react';
import {Store} from '../utils/Store'
import NextLink from 'next/link';
import Head from 'next/head'
import styles from '../styles/App.module.css'
import { AppBar, Toolbar, Typography, Container, Link, Badge } from '@mui/material'


const Layout = ({title,description, children}) => {

    const {state, dispatch} = useContext(Store);
    const {cart} = state;
    console.log(cart)

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
                             <Badge color="secondary" badgeContent={cart.cartItems.length}>Cart</Badge>
                            </Link>
                        </NextLink>
                        <NextLink href="/cart" passHref>
                            <Link>Login</Link>
                        </NextLink>
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

export default Layout
