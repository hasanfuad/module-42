
// const text = '#2A2A2A';
// const regex = /#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/g;

const text = '+8801919191919';
const regex = /(\+88)?-?01[1-9]\d{8}/g;

const matched = text.match(regex);
const index = text.search(regex);
const replaced = text.replace(regex, 'phone');
const testing = regex.test(text);

console.log(matched, index, replaced, testing);