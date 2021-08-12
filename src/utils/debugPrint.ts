
const DEBUG:boolean = true;


export const debugPrint = (message?: any, ...optionalParams: any[]) => DEBUG ? optionalParams.length > 0 ? console.log(message, optionalParams) : console.log(message) : null; 