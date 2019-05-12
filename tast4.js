


// package to use stdin/out
function createDB() {
    readline.question(`please enter the desired name for your contact form's data base table`, (dbName) => {
        if(/^[a-zA-Z0-9]*$/.test(dbName)){
            addVars('table', dbName)
            var params = {
              AttributeDefinitions: [
                {
                    AttributeName: "id", 
                    AttributeType: "S"
                },
              ], 
              KeySchema: [
                {
                AttributeName: "id", 
                KeyType: "HASH"
              },
              ], 
              TableName: dbName,
              BillingMode: "PAY_PER_REQUEST",
            };
            dynamodb.createTable(params, function(err, data) {
              if(err){
                console.log(err, err.stack);
              }
              else  {
                console.log(data);
                console.log('Succesfully created the DB table.')
                formFields(dbName);
              }       
            });
        }
        else {
            console.log('table name invalid. Only alphanumeric characters. no spaces.');
            createDB();
        }
    });
      
  }
  createDB();