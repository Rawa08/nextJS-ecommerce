
import Layout from '../components/Layout';
import {Typography, Button} from '@mui/material';
import Link from 'next/link'




export default function NotFound() {

  return (
     <Layout title="My E-commerce - Page not found">
        
       <Typography align='center' mt={5} component='h1' variant='h4'>This page could not be found.</Typography>
       <Typography align='center'><Link href='/' passHref><Button>Home</Button></Link></Typography>
        
     </Layout>
  )
}
