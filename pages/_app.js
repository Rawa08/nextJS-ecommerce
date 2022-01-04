import '../styles/globals.css';
import {useEffect} from 'react'
import { Store } from '../utils/Store';


function MyApp({ Component, pageProps }) {


  //removing css for server side rendering.
  useEffect(()=>{
    const jssStyles = document.querySelector('#jss-server-side');

    if(jssStyles){
      jssStyles.parentElement.removeChild(jssStyles);
    }
  },[]);

  
  return <Component {...pageProps} />
}

export default MyApp
