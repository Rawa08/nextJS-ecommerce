import '../styles/globals.css';
import {useEffect} from 'react'
import { StoreProvider } from '../utils/Store';
import {SnackbarProvider} from 'notistack';

function MyApp({ Component, pageProps }) {


  //removing css for server side rendering.
  useEffect(()=>{
    const jssStyles = document.querySelector('#jss-server-side');

    if(jssStyles){
      jssStyles.parentElement.removeChild(jssStyles);
    }
  },[]);

  
return (<SnackbarProvider maxSnack={2} anchorOrigin={{vertical: 'top', horizontal: 'center'}} >
  <StoreProvider><Component {...pageProps} /></StoreProvider></SnackbarProvider>)
}

export default MyApp
