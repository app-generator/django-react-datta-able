// action - state management
import {
    ACCOUNT_INITIALIZE,
    LOGIN,
    LOGOUT,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_ADS_ENABLE,
    GOOGLE_ADS_START,
    GOOGLE_ADS_ENABLE_FAIL,
    GOOGLE_ADS_DISABLE
} from './actions';

export const initialState = {
    token: '',
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    ads_accounts: null,
    ad_platform: null,
    disable_google: false,
    disable_meta: false,
    disable_twiter: false,
    show_form: false,
    window_url: '',
    account_id: '',
    window_location: false,
    message:''
};

//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { isLoggedIn, user, token } = action.payload;
            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
                token,
                user
            };
        }
        case LOGIN: {
            const { user } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                user
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isLoggedIn: false,
                token: '',
                user: null
            };
        }
        case GOOGLE_ADS_START: {
            const { window_url } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                window_location:true,
                window_url
            };
        }
        case GOOGLE_ADS_ENABLE: {
            return {
                ...state,
                isLoggedIn: true,
                ads_accounts: action.payload,
                ad_platform: action.ad_platform,
                submitted: true,
                show_form: true,
                window_url: ''
            };
        }
        case GOOGLE_ADS_ENABLE_FAIL: {
            return {
                ...state,
                isLoggedIn: true,
                ads_accounts: null,
                window_location: false,
                window_url: ''
            };
        }
        case GOOGLE_AUTH_SUCCESS: {
            const { message, account_id } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                disable_google: true,
                account_id,
                show_form: false,
                message
            };
        }
        case GOOGLE_ADS_DISABLE: {
            return {
                ...state,
                isLoggedIn: true,
                disable_google: false,
                window_url: '',
                show_form: false,
                account_id: ''
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
