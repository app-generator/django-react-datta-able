export const tokenConfig = () => {
  let datta_account = localStorage.getItem('datta-account');
    const datta_token = JSON.parse(datta_account);
    console.log(datta_token.token.replace("",));
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (datta_token) {
        config.headers['Authorization'] = `${datta_token.token}`;
    } else {
        delete config.headers['Authorization'];
    }
    return config;
};
