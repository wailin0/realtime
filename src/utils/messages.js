const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt : new Date().getTime()
    }
}

const generateLocationMessage = (username, location) => {
    return {
        username,
        location : `https://maps.google.com/?q=${location.lat},${location.long}&z=8`,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}