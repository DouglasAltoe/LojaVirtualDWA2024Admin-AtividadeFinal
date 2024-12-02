function parseErrors(data) {
    const errors = {};
    data.detail.forEach(error => {
        const fieldName = error.loc[error.loc.length - 1];
        const fullMessage = error.msg;
        const errorMessage = fullMessage.includes(',') 
            ? fullMessage.split(',').slice(1).join(',').trim() 
            : fullMessage;
        errors[fieldName] = errorMessage;
    });
    console.log(errors);
    return errors;
}

export default parseErrors;