const axios = require('axios');

axios.post('http://desktop-4cmgkes:8181/ws/foo?wsdl')
.then((response) => {
    console.log(response.data)
})
.catch((error) => {
    console.log(error.message)
});