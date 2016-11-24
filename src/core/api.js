// export const serverUrl = 'http://172.30.3.41:3000'; //cs
//export const serverUrl = 'http://169.254.38.194:3000';
export const serverUrl = 'http://172.30.115.222:3000';
//export const serverUrl = 'http://192.168.0.102:3000'; //iw
const apiUrl = `${serverUrl}/api`;
export const headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
export const authHeaders = (token) => ({...headers, 'Authorization': `Bearer ${token}`});
