export const baseUrl = 'http://localhost:3000';

//rooms
export const baseRoomUrl = baseUrl + '/room';

export const getRoomsUrl = (page = 1, limit = 10) =>
  baseRoomUrl + `/rooms?page=${page}&limit=${limit}`;
export const createRoomUrl = baseRoomUrl + '/create';
export const joinRoomUrl = baseRoomUrl + '/join';
export const reconnectToRoomUrl = baseRoomUrl + '/reconnect';
//auth
export const baseAuthUrl = baseUrl + '/auth';

export const registerUrl = baseAuthUrl + '/register';
export const loginUrl = baseAuthUrl + '/login';
export const refreshUrl = baseAuthUrl + '/refresh';

//user
export const baseUserUrl = baseUrl + '/user';
export const whoAmI = baseUserUrl + '/me';
