import {
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    GOOGLE_ADS_ENABLE,
    GOOGLE_ADS_ENABLE_FAIL,
    GOOGLE_ADS_DISABLE,
    GOOGLE_ADS_DISABLE_FAIL,
    GOOGLE_ADS_START,
    CLOSE_MODAL
} from './actions';
import axios from '../utils/Api';



export const closeModal = () => {
    return (dispatch) => {
        dispatch({ type: CLOSE_MODAL });
    };
};

export const googleAuthenticateStart =(token ) =>
    async (dispatch) => {
             try {
                 const res = await axios.get('google_ads/enable', { headers: { Authorization: `${token}` } });
                 dispatch({
                     type: GOOGLE_ADS_START,
                     payload: { window_url: res.data.authorization_url }
                 });
                 window.location.replace(res.data.authorization_url);
             } catch (err) {}
    };

export const googleAuthenticate =(token,state, code ) =>
    async (dispatch) => {
            try {
                const res = await axios.post('google_ads/oauth', { state, code }, { headers: { Authorization: `${token}` } });
                dispatch({
                    type:  GOOGLE_ADS_ENABLE,
                    payload: res.data.accounts,
                    ad_platform: res.data.ad_platform
                });
            } catch (err) {
                dispatch({
                    type: GOOGLE_ADS_ENABLE_FAIL
                });
            }
    };

export const googleAccountAds = (token, account_id) =>
async (dispatch) => {
        console.log(account_id)
            try {
                const res = await axios.get(`home/ad-accounts/${account_id}`, { headers: { Authorization: `${token}` } });
                dispatch({
                    // type: GOOGLE_AUTH_SUCCESS,
                    // payload: { message: res.data.message, account_id: res.data.account_id }
                });
            } catch (err) {
                dispatch({
                    type:  GOOGLE_AUTH_FAIL
                });
            }
    };
export const googleSubmitAds =(token,account_id, ad_platform ) =>
    async (dispatch) => {
            try {
                const res = await axios.post('home/ad-accounts', { account_id, ad_platform }, { headers: { Authorization: `${token}` } });
                dispatch({
                    type: GOOGLE_AUTH_SUCCESS,
                    payload: { message: res.data.message, account_id: res.data.account_id }
                });
            } catch (err) {
                dispatch({
                    type:  GOOGLE_AUTH_FAIL
                });
            }
    };
export const googleDisableAds =(token ) =>
    async (dispatch) => {
            try {
                 await axios.delete('google_ads/disable', { headers: { Authorization: `${token}` } });
                dispatch({
                    type: GOOGLE_ADS_DISABLE
                });
            } catch (err) {
                dispatch({
                    type: GOOGLE_ADS_DISABLE_FAIL
                });
            }
    };
