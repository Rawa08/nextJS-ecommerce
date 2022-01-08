import Layout from "../components/Layout";
import { useRouter } from "next/router"
import { useContext, useEffect } from "react";
import {Store} from '../utils/Store';
import { Typography } from "@mui/material";


const Shipping = () => {
    
    const router = useRouter();

    const {state,state:{user}} = useContext(Store);

    useEffect(() => {
        if(!user){
            router.push('/login?redirect=/shipping')
         }
        
    }, [user])

  

    return (
        <Layout title="Shipping">
            <Typography component="h2" variant="h2">Shipping</Typography>
        </Layout>
    )
}

export default Shipping
