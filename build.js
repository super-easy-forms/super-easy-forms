var fs = require("fs");

function createFile(file, contents, callback) {
  if(fs.existsSync(file)){
    let err = `file ${file} already exists`
    if(callback && typeof callback === 'function') callback(null, err)
    else return data;
  }
  else {
    fs.writeFile(file, contents, (err) => {
      if (err) {
        if(callback && typeof callback === 'function') callback(new Error(err))
        else throw new Error(err);
      }
      else {
        let data = `Created the ${file} file`
        if(callback && typeof callback === 'function') callback(null, data)
        else return data;
      }
    })
  }
}

function createDir(dir, callback){
  if (fs.existsSync(dir)){
    let err = (`directory ${dir} already exists`)
    if(callback && typeof callback === 'function') callback(null, err)
    else return err
  }
  else {
    fs.mkdir(dir, (err) => {
      if (err) {
        if(callback && typeof callback === 'function') callback(new Error(err))
        else throw new Error(err);
      }
      else {
        let data = `Created the ${dir} directory`
        if(callback && typeof callback === 'function') callback(null, data)
        else return data;
      }
    });
  }
}

function initBuild(){
  createFile('./.env', '', function(err, data){
    if(err) console.log(err)
    else {
      console.log(data)
      createFile('./.gitignore', '.env', function(err, data){
        if(err) console.log(err)
        else console.log(data)
      })
    }
  });
  createFile('./settings.json', '{}', function(err, data){
    if(err) console.log(err)
    else console.log(data)
  })
  createDir('./forms', function(err, data){
    if(err) console.log(err)
    else console.log(data)
  })
}

module.exports = {
  initBuild,
  createDir
}