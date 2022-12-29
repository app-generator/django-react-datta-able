import {
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    GOOGLE_ADS_ENABLE,
    GOOGLE_ADS_ENABLE_FAIL,
    GOOGLE_ADS_DISABLE,
    GOOGLE_ADS_DISABLE_FAIL,
    GOOGLE_ADS_START,
    CLOSE_MODAL,
    META_AUTH_SUCCESS,
    META_AUTH_FAIL,
    META_ADS_ENABLE,
    META_ADS_ENABLE_FAIL,
    META_ADS_DISABLE,
    META_ADS_DISABLE_FAIL,
    META_ADS_START,
    GET_META_ACCOUNT_SUCCESS,
    GET_META_ACCOUNT_FAIL,
    GET_GOOGLE_ACCOUNT_FAIL,
    GET_GOOGLE_ACCOUNT_SUCCESS
} from './actions';
import axios from '../utils/Api';

export const closeModal = () => {
    return (dispatch) => {
        dispatch({ type: CLOSE_MODAL });
    };
};

export const googleAuthenticateStart = (token) => async (dispatch) => {
    try {
        const res = await axios.get('google_ads/enable', { headers: { Authorization: `${token}` } });
        dispatch({
            type: GOOGLE_ADS_START,
            payload: { window_url: res.data.authorization_url }
        });
        window.location.replace(res.data.authorization_url);
    } catch (err) {}
};

export const googleAuthenticate = (token, state, code) => async (dispatch) => {
    try {
        const res = await axios.post('google_ads/oauth', { state, code }, { headers: { Authorization: `${token}` } });
        dispatch({
            type: GOOGLE_ADS_ENABLE,
            payload: res.data.accounts,
            ad_platform: res.data.ad_platform
        });
    } catch (err) {
        dispatch({
            type: GOOGLE_ADS_ENABLE_FAIL
        });
    }
};

export const getAccountAdsGoogle = (token) => async (dispatch) => {
        
        try {
            const res = await axios.get(`home/ad-accounts/`, { headers: { Authorization: `${token}` } });
            console.log(res.data);
            dispatch({
                type: GET_GOOGLE_ACCOUNT_SUCCESS,
                payload: { message: res.data.message, account_id: res.data.account_id[0]?.account_id }
            });
        } catch (err) {
            dispatch({
                type: GET_GOOGLE_ACCOUNT_FAIL
            });
        }
};

export const getAccountAdsMeta = (token) => async (dispatch) => {
        try {
            const res = await axios.get(`home/ad-accounts/`, { headers: { Authorization: `${token}` } });
            dispatch({
                type: GET_META_ACCOUNT_SUCCESS,
                payload: { message: res.data.message, account_id: res.data.account_id[1]?.account_id }
            });
        } catch (err) {
            dispatch({
                type: GET_META_ACCOUNT_FAIL
            });
        }
};

export const googleDisableAds = (token) => async (dispatch) => {
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

export const SubmitAds = (token, account_id, ad_platform) => async (dispatch) => {
    try {
        const res = await axios.post('home/ad-accounts/', { account_id, ad_platform }, { headers: { Authorization: `${token}` } });
        dispatch({
            type: ad_platform === 'meta_ads' ? META_AUTH_SUCCESS : ad_platform === 'google_ads' ? GOOGLE_AUTH_SUCCESS : '',
            payload: { message: res.data.message, account_id: res.data.account_id }
        });
    } catch (err) {
        dispatch({
            type: ad_platform === 'meta_ads' ? META_AUTH_FAIL : ad_platform === 'google_ads' ? GOOGLE_AUTH_FAIL : ''
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
