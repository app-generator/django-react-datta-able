import {
    META_AUTH_SUCCESS,
    META_AUTH_FAIL,
    META_ADS_ENABLE,
    META_ADS_ENABLE_FAIL,
    META_ADS_DISABLE,
    META_ADS_DISABLE_FAIL,
    META_ADS_START,
    CLOSE_MODAL
} from './actions';
import axios from '../utils/Api';

export const metaAuthenticateStart = (token) => async (dispatch) => {
    try {
        const res = await axios.get('meta_ads/enable', { headers: { Authorization: `${token}` } });
        dispatch({
            type: META_ADS_START,
            payload: { window_url: res.data.authorization_url }
        });
        window.location.replace(res.data.authorization_url);
    } catch (err) {}
};

export const metaAuthenticate = (token, code) => async (dispatch) => {
    try {
        const res = await axios.post('meta_ads/oauth', { code }, { headers: { Authorization: `${token}` } });
        dispatch({
            type: META_ADS_ENABLE,
            payload: res.data.accounts,
            ad_platform: res.data.ad_platform
        });
    } catch (err) {
        dispatch({
            type: META_ADS_ENABLE_FAIL
        });
    }
};

export const metaSubmitAds = (token, account_id, ad_platform) => async (dispatch) => {
    try {
        const res = await axios.post('home/ad-accounts', { account_id, ad_platform }, { headers: { Authorization: `${token}` } });
        dispatch({
            type: META_AUTH_SUCCESS,
            payload: { message: res.data.message, account_id: res.data.account_id }
        });
    } catch (err) {
        dispatch({
            type: META_AUTH_FAIL
        });
    }
};
export const metaDisableAds = (token) => async (dispatch) => {
    try {
        await axios.delete('meta_ads/disable', { headers: { Authorization: `${token}` } });
        dispatch({
            type: META_ADS_DISABLE
        });
    } catch (err) {
        dispatch({
            type: META_ADS_DISABLE_FAIL
        });
    }
};

