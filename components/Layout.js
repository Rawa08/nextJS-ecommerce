import NextLink from 'next/link';
import Head from 'next/head'
import styles from '../styles/App.module.css'
import { AppBar, Toolbar, Typography, Container, Link } from '@mui/material'


const Layout = ({title,description, children}) => {

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
                            <Link>Cart</Link>
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
