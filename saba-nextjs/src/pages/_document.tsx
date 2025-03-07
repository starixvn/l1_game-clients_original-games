import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="vi">
                <Head>
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                    <meta httpEquiv="Pragma" content="no-cache" />
                    <meta httpEquiv="Expires" content="-1" />
                    <meta name="theme-color" content="transparent" />
                </Head>
                <body>
                    <div data-react="true">
                        <Main />
                    </div>

                    <NextScript />
                </body>
            </Html>
        );
    }
}
