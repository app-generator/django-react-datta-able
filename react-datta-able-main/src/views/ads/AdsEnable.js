import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import {
    googleAuthenticateStart,
    googleAuthenticate,
    SubmitAds,
    googleDisableAds,
    closeModal,
    getAccountAdsGoogle,
    metaAuthenticateStart,
    metaAuthenticate,
    metaDisableAds,
    getAccountAdsMeta
} from '../../store/googleAction';

const AdsEnable = () => {
    const [formME, setFormME] = useState({});

    const dispatch = useDispatch();
    let location = useLocation();
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormME((prev) => ({ ...prev, [name]: value }));
    };

    const accounts = useSelector((state) => state.account);
    const { ads_accounts, ad_platform, disable_google, disable_meta, disable_twiter,
         token, show_form, message, account_id,Ads_account_id } = accounts;

    const handleClose = () => {
        dispatch(closeModal());
    };
    useEffect(() => {
    //     if (account_id.google || account_id.meta) {
    //     }
        dispatch(getAccountAdsMeta(token));
        dispatch(getAccountAdsGoogle(token));
    }, [account_id.google || account_id.meta]);

    useEffect(() => {
        const values = queryString.parse(location.search);
        const google_state = values.state ? values.state : null;
        const google_code = values.code ? values.code : null;
        const meta_code = values.code ? values.code : null;

        if (google_state && google_code) {
            dispatch(googleAuthenticate(token, google_state, google_code));
        }
        if (meta_code) {
            dispatch(metaAuthenticate(token, meta_code));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(SubmitAds(token, formME.account_id, ad_platform));
        handleClose();
        history.push('/app/ads-enable/accounts');
    };

    const continueWithGoogle = async () => {
        dispatch(googleAuthenticateStart(token));
    };
    const disableGoogle = () => {
        dispatch(googleDisableAds(token));
    };
    const continueWithMeta = async () => {
        dispatch(metaAuthenticateStart(token));
    };
    const disableMeta = () => {
        dispatch(metaDisableAds(token));
    };
    let all_ads = Array.isArray(ads_accounts);

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
                                    {disable_google & (message === 'success') ? (
                                        <>
                                            <Button
                                                onClick={() => disableGoogle()}
                                                aria-controls="basic-collapse"
                                                aria-expanded={show_form}
                                                variant="success"
                                            >
                                                Disable Google Ads
                                            </Button>
                                            <h5 className="col text-right">{Ads_account_id?Ads_account_id.google:account_id.google}</h5>
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
                                    {disable_twiter & (message === 'success') ? (
                                        <>
                                            <Button onClick={() => disableGoogle()} aria-controls="basic-collapse" variant="primary">
                                                Disable Twitter Ads
                                            </Button>
                                            <h5 className="col text-right">{accounts?.account_id.twitter}</h5>
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
                                    {disable_meta & (message === 'success') ? (
                                        <>
                                            <Button onClick={() => disableMeta()} aria-controls="basic-collapse" variant="success">
                                                Disable Meta Ads
                                            </Button>
                                            <h5 className="col text-right">{Ads_account_id?Ads_account_id.meta:account_id.meta}</h5>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => continueWithMeta()} aria-controls="basic-collapse" variant="primary">
                                                Enable Meta Ads
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Modal
                    show={show_form}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Ads Account Form</Form.Label>
                                <Form.Control as="select" name="account_id" onChange={handleChange} value={formME?.account_id || ''}>
                                    <option value={''} disabled>select account</option>
                                    {all_ads
                                        ? ads_accounts?.map((acc) => {
                                              return (
                                                  <option key={acc.account_name} value={acc.account_id}>
                                                      {acc.account_id}
                                                  </option>
                                              );
                                          })
                                        : [{ account_name: ads_accounts, account_id: ads_accounts }]?.map((acc) => {
                                              return (
                                                  <option key={acc.account_name} value={acc.account_id}>
                                                      {acc.account_id}
                                                  </option>
                                              );
                                          })}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="primary"
                            onClick={(e) => {
                                handleSubmit(e);
                            }}
                        >
                            Submit
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Row>
        </React.Fragment>
    );
};

export default AdsEnable;
