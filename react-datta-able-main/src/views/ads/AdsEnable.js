import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Collapse } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation,useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { googleAuthenticateStart, googleAuthenticate, googleSubmitAds, googleDisableAds } from '../../store/googleAction';

const AdsEnable = () => {
    const [formME, setFormME] = useState({});
    const dispatch = useDispatch();
    let location = useLocation();
    const history =useHistory()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormME((prev) => ({ ...prev, [name]: value }));
    };

    const accounts = useSelector((state) => state.account);
    const { ads_accounts, ad_platform, disable_google, disable_meta, disable_twiter, token, show_form, message } = accounts;

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        console.log('State: ' + state);
        console.log('Code: ' + code);

        if (state && code) {
            dispatch(googleAuthenticate(token, state, code));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(googleSubmitAds(token, formME.account_id, ad_platform));
        history.push('/app/ads-enable/accounts');
    };

    const continueWithGoogle = async () => {
        dispatch(googleAuthenticateStart(token));
    };
    const disableGoogle = () => {
        dispatch(googleDisableAds(token));
        
    };

    return (
        <React.Fragment>
            <Row>
                <Col md={6} xl={4}>
                    <Card className="card-social">
                        <Card.Body className="border-bottom">
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fab fa-google-plus-g text-c-red f-36" />
                                </div>
                                <div className="col text-right">
                                    {disable_google & (message == 'success') ? (
                                        <>
                                            <Button
                                                onClick={() => disableGoogle()}
                                                aria-controls="basic-collapse"
                                                aria-expanded={show_form}
                                                variant="success"
                                            >
                                                Disable Google Ads
                                            </Button>
                                            <h5 className="col text-right">{accounts?.account_id}</h5>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={() => {
                                                    continueWithGoogle();
                                                }}
                                                aria-controls="basic-collapse"
                                                aria-expanded={show_form}
                                                variant="danger"
                                            >
                                                Enable Google Ads
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card className="card-social">
                        <Card.Body className="border-bottom">
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fab fa-twitter text-c-blue f-36" />
                                </div>
                                <div className="col text-right">
                                    {disable_twiter & (message == 'success') ? (
                                        <>
                                            <Button onClick={() => disableGoogle()} aria-controls="basic-collapse" variant="primary">
                                                Disable Twitter Ads
                                            </Button>
                                            <h5 className="col text-right">{accounts?.account_id}</h5>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => continueWithGoogle()} aria-controls="basic-collapse" variant="primary">
                                                Enable Twitter Ads
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="card-social">
                        <Card.Body className="border-bottom">
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fab fa-facebook-f text-primary f-36" />
                                </div>
                                <div className="col text-right">
                                    {disable_meta & (message == 'success') ? (
                                        <>
                                            <Button onClick={() => disableGoogle()} aria-controls="basic-collapse" variant="primary">
                                                Disable Meta Ads
                                            </Button>
                                            <h5 className="col text-right">{accounts?.account_id}</h5>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => continueWithGoogle()} aria-controls="basic-collapse" variant="primary">
                                                Enable Meta Ads
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Collapse in={show_form}>
                    <Col sm={12}>
                        <div id="basic-collapse">
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Ads Forms</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId="exampleForm.ControlSelect1">
                                                <Form.Label>Select Account</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="account_id"
                                                    onChange={handleChange}
                                                    value={formME?.account_id || ''}
                                                >
                                                    {ads_accounts?.map((acc) => {
                                                        return (
                                                            <option key={acc.account_name} value={acc.account_id}>
                                                                {acc.account_id}
                                                            </option>
                                                        );
                                                    })}
                                                </Form.Control>
                                            </Form.Group>
                                            <Button
                                                variant="primary"
                                                onClick={(e) => {
                                                    handleSubmit(e, formME);
                                                }}
                                            >
                                                Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Collapse>
            </Row>
        </React.Fragment>
    );
};

export default AdsEnable;
