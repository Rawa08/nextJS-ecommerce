const getError = err => {
    if(err.response && err.response.data && err.response.data.message) return err.response.data.message;
    
    return err.message;
};

export default getError;