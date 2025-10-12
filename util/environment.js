//生产环境
const prod = {
   BASE_API: 'https://api.kull.fun',
   // BASE_API: 'https://api.jdccp.top',
   VERSION: '2.0.9',
}
const test = {
   BASE_API: '/prod-api',
   // BASE_API: 'http://192.168.2.201:8090',
   VERSION: '2.0.9',
}
//开发环境
const dev = {
  BASE_API: 'https://api.jdccp.fun',
  VERSION: '2.0.9',
}


/*
=================注意根据需要改变环境================
 */
var environment = process.env.NODE_ENV==="development"?dev:prod;
if(window.location.hostname.startsWith('192.168') || window.location.hostname.startsWith('8.222.175.50')){
  console.log('内网测试');
  environment = test;
}

export default {
  BASE_API: environment.BASE_API,
  VERSION: environment.VERSION,
}
