const today = new Date();
const day = ('0' + today.getDate()).slice(-2);
const month = ('0' + (today.getMonth() + 1)).slice(-2);
const year = today.getFullYear();
export const filterer = `${year}-${month}-${day}T08:00:00.000Z`;
