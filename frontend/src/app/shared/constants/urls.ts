// const BASE_URL = 'https://trakresolve.onrender.com';
const BASE_URL = 'http://localhost:5200';
const API_VERSION = 1;

export const BUGS_URL = BASE_URL + `/api/v${API_VERSION}/bugs`;
export const BUGS_BY_SEARCH_URL = BUGS_URL + '/';

export const USER_LOGIN_URL = BASE_URL + `/api/v${API_VERSION}/users/login`;
