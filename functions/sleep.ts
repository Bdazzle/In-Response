
/*
reusable function to delay queries,
for use inside loop 
*/
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default sleep