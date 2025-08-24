import React, { lazy } from "react";

const Header = lazy(() => import("../partials/Header"));
const Footer = lazy(() => import("../partials/Footer"));

function Page404() {
    return (
        <>
            <Header />
            <main className="container text-center" style={{ padding: "4rem 0",}}>
                <img src="https://i.postimg.cc/cHzrRBBb/273479788-11280456.webp" style={{ maxWidth: "40%" }}/>
                <h1>404 - نتیجه یافت نشد</h1>
                <p>نتیجه مدنظر شما وجود ندارد</p>
            </main>
            <Footer />
        </>
    );
}

export default Page404;
