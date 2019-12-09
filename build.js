var fs = require("fs");

function createFile(file, contents, callback) {
  if(fs.existsSync(file)){
    console.log(`file ${file} already exists`)
  }
  else {
    fs.writeFile(file, contents, (err) => {
      if (err) {
        if(callback && typeof callback === 'function') callback(new Error(err))
        else throw new Error(err);
      }
      else {
        console.log(`created the file ${file}`)
        if(callback && typeof callback === 'function') callback(null, 'Success')
        else return 'Success';
      }
    })
  }
}

function createDir(dir, callback){
  if (fs.existsSync(dir)){
    console.log(`directory ${dir} already exists`)
  }
  else {
    fs.mkdir(dir, (err) => {
      if (err) {
        if(callback && typeof callback === 'function') callback(new Error(err))
        else throw new Error(err);
      }
      else {
        if(callback && typeof callback === 'function') callback(null, 'Success')
        else return 'Success';
      }
    });
  }
}

function initBuild(){
  createFile('./.env', '', function(err, data){
    if(err) console.error(err)
    else console.log('created the .env file')
  });
  createFile('./.gitignore', '.env', function(err, data){
    if(err) console.error(err)
    else console.log('create the .gitignore file')
  })
  createFile('./settings.json', {}, function(err, data){
    if(err) console.error(err)
    else console.log('create the settings.json file')
  })
  createDir('./forms', function(err, data){
    if(err) console.error(err)
    else console.log('create the forms folder')
  })
}

initBuild();