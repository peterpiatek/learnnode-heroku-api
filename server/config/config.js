const env = process.env.NODE_ENV || 'development';
console.log('***ENV: ', env);

if(env === 'development' || env === 'test'){
  // calling require on json is parsing it on the fly to JS object
  const config = require('./config.json');

  const envConfig = config[env];
  
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  })
}

/* if(env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp'
} else if(env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest'
} */