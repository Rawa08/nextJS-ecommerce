import { useRouter } from "next/router"
import { useContext, useEffect } from "react";
import {Store} from '../utils/Store';


const Shipping = () => {
    
    const router = useRouter();

    const {state,state:{user}} = useContext(Store);

    useEffect(() => {
        if(!user){
            router.push('/login?redirect=/shipping')
         }
        
    }, [user])

  

    return (
        <div>
            Shipping Screen
        </div>
    )
}

export default Shipping
