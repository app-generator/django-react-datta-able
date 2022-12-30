// action - state management
import {
    ACCOUNT_INITIALIZE,
    LOGIN,
    LOGOUT,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_ADS_ENABLE,
    GOOGLE_ADS_START,
    GOOGLE_ADS_ENABLE_FAIL,
    GOOGLE_ADS_DISABLE,
    META_AUTH_SUCCESS,
    META_ADS_ENABLE,
    META_ADS_START,
    META_ADS_ENABLE_FAIL,
    META_ADS_DISABLE,
    CLOSE_MODAL,
    GET_META_ACCOUNT_SUCCESS,
    GET_META_ACCOUNT_FAIL,
    GET_GOOGLE_ACCOUNT_FAIL,
    GET_GOOGLE_ACCOUNT_SUCCESS
} from './actions';

export const initialState = {
    token: '',
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    ad_platform: null,
    disable_google: false,
    disable_meta: false,
    disable_twiter: false,
    show_form: false,
    window_url: '',
    account_id: {
        meta: '',
        google: '',
        twitter: '',
        pinterest: ''
    },
    ads_accounts:"",
    // Ads_account_id: null,
    Ads_account_id: {
        meta: '',
        google: '',
        twitter: '',
        pinterest: ''
    },
    window_location: false,
    message: ''
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
        // google
        case GET_GOOGLE_ACCOUNT_SUCCESS: {
            let google_index;
            const { message, accounts } = action.payload;
            const google_ads_id = accounts?.map((ads,idx) =>{
                if(ads.ad_platform_data.account_platform === "google_ads" && message === 'success'){
                    google_index = idx
                        return ads
                }})
            return {
                ...state,
                message,
                disable_google:google_ads_id[google_index].ad_platform_data.show,
                Ads_account_id:{
                    ...state.Ads_account_id,
                    google: google_ads_id[google_index].account_id,
                },
            };
        }
        case GET_GOOGLE_ACCOUNT_FAIL: {
            return {
                ...state,
                disable_google: false,
                  Ads_account_id: {
                    ...state.Ads_account_id,
                    google: '',
                    // meta: google_ads_id[1]?.account_id
                }
            };
        }
        case GOOGLE_ADS_START: {
            const { window_url } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                window_location: true,
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
                account_id: {
                    ...state.account_id,
                    google: account_id
                },
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
                account_id: {
                    ...state.account_id,
                    google: ''
                }
            };
        }

        // META

        case GET_META_ACCOUNT_SUCCESS: {
           let meta_index;
            const { message, accounts } = action.payload;
            const meta_ads_id = accounts?.map((ads,idx) =>{
                if(ads.ad_platform_data.account_platform === "meta_ads" && message === 'success'){
                    meta_index = idx
                        return ads
                }
            })

            return {
                ...state,
                message,
                disable_meta:meta_ads_id[meta_index].ad_platform_data.show,
                Ads_account_id:{
                    ...state.Ads_account_id,
                    meta: meta_ads_id[meta_index].account_name,
                },
            };
        }
        case GET_META_ACCOUNT_FAIL: {
            return {
                ...state,
                disable_meta: false,
                account_id: {
                    ...state.account_id,
                    meta: ''
                }
            };
        }
        case META_ADS_START: {
            const { window_url } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                window_location: true,
                window_url
            };
        }
        case META_ADS_ENABLE: {
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
        case META_ADS_ENABLE_FAIL: {
            return {
                ...state,
                isLoggedIn: true,
                ads_accounts: null,
                window_location: false,
                window_url: ''
            };
        }
        case META_AUTH_SUCCESS: {
            const { message, account_id } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                disable_meta: true,
                account_id: {
                    ...state.account_id,
                    meta: account_id
                },
                show_form: false,
                message
            };
        }
        case META_ADS_DISABLE: {
            return {
                ...state,
                isLoggedIn: true,
                disable_meta: false,
                window_url: '',
                show_form: false,
                account_id: {
                    ...state.account_id,
                    meta: ''
                },
                Ads_account_id: {
                    ...state.Ads_account_id,
                    meta: ''
                }
            };
        }
        case CLOSE_MODAL: {
            return {
                ...state,
                show_form: false
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
