// const BASE_URL = 'https://trakresolve.onrender.com';
const API_VERSION = 1;
const BASE_URL = `http://localhost:5200/api/v${API_VERSION}`;

export const BUGS_URL = BASE_URL + `/bugs`;
export const BUGS_ID_URL = BUGS_URL + `/`;
export const BUGS_BY_SEARCH_URL = BUGS_URL + '/search/';

export const USER_LOGIN_URL = BASE_URL + `/users/login`;
export const USER_REGISTER_URL = BASE_URL + `/users/register`;
export const USER_MESSAGE_URL = BASE_URL + `/users/messages/`;
