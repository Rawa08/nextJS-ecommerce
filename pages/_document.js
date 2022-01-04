import Document, {Html, Head, Main, NextScript} from "next/document";
import { ServerStyleSheets } from '@mui/styles'
import React from "react";


export default class MyDocument extends Document {
    render(){
        return (
            <Html lang='en'>
                <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
                </Head>
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