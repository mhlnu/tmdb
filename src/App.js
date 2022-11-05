import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Movies from "./components/Movies";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.scss";
import { Container, Row, Col } from "react-bootstrap";
import useData from "./api/data";

const App = () => {
    const [session, setSession] = useState({});
    const [api, setApi] = useState("b1ff62d6a06363c130993ddca3270028");
    const { data } = useData("all", "session", {}, 1, null, api);

    useEffect(() => {
        if (Object.keys(session).length < 1) {
            let ls = localStorage.getItem("tmdbSession");
            if (null === ls) {
                if (data.success) {
                    let newSession = { expires_at: data.expires_at, guest_session_id: data.guest_session_id };
                    setSession(newSession);
                    localStorage.setItem("tmdbSession", JSON.stringify(newSession));
                }
            } else {
                let obj = JSON.parse(ls);
                let now = new Date(new Date()).valueOf();
                let exp = new Date(obj.expires_at).valueOf();
                if (now < exp) {
                    setSession(obj);
                } else {
                    localStorage.removeItem("tmdbSession");
                    if (data.success) {
                        let newSession = { expires_at: data.expires_at, guest_session_id: data.guest_session_id };
                        setSession(newSession);
                        localStorage.setItem("tmdbSession", JSON.stringify(newSession));
                    }
                }
            }
        }
    }, [data]);

    return (
        <div className="App">
            <Layout changeApi={() => setApi} api={api}>
                <section className="siteContent">
                    <Container>
                        <Row>
                            <Col lg={12} md={12}>
                                <Movies session={session} api={api} />
                            </Col>
                        </Row>
                    </Container>
                </section>
            </Layout>
        </div>
    );
};
export default App;
