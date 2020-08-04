import axios from 'axios';

//guardado en una instancia porque diferente url para la autenticacion
//realtime database similar a Mongodb
const instance = axios.create ({
    baseURL: 'https://.firebaseio.com/' //url del firebase
});

export default instance;