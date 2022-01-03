import {useRouter} from 'next/router';
import {data} from '../../utils/data'

const ProductScreen = () => {

    const router = useRouter();
    const {slug} = router.query;
    const product = data.products.find(a => {
       if(a.id+a.title.slice(0,10).replace(/\s/g, "") === slug) return a
    })

    if(!product) return(<div>Product not found</div>)
    return (
        <div>
            <h1>{product.title}</h1>
        </div>
    )
}

export default ProductScreen
