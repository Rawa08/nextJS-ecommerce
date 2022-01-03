import Document, {Html, Head, Main, NextScript} from "next/document";
import { ServerStyleSheets } from '@mui/styles'
import React from "react";


export default class MyDocument extends Document {
    render(){
        return (
            <Html lang='en'>
                <Head></Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
};

MyDocument.getInitialProps = async (context) => {
    const sheets = new ServerStyleSheets;

    const orginalRenderPage  = context.renderPage;

    context.renderPage = () => {
        return orginalRenderPage({
            enhanceApp : (App) => (props) => (sheets.collect(<App {...props} />)),
        });
    };

    const initialProps = await Document.getInitialProps(context);

    return {...initialProps, styles:[...React.Children.toArray(initialProps.styles), sheets.getStyleElement()]}
}