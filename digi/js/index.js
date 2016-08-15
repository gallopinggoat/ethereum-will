$('.toggle').on('click', function() {
  $('.container').stop().addClass('active');
});

$('.close').on('click', function() {
  $('.container').stop().removeClass('active');
});

$('#aliveButton').on('click', function(){
  console.log('alive clicked');
   checkin();
});

   var privateKey = new Buffer('fd735ce2edfb21443b011d9b97288c4c6dab6e51bc8e28dc81d14ad60fcd37bc', 'hex');
   var ownerAddress = '0x1c4119130d28D637985A49DCEeF20920144F5AfA';
   var recipientAddress = '0x060e6BB1e5d2E644E175A7d3792b9275d24D5e16';
   var httpClient = new HttpClient('testnet');;
   var transferTimer = null;
   var transferStarted = false;

   var assetContract = abiList[0];

//   showBalance();
//   assignAsset();

   function checkin() {
     var args = [];
     callFunction('updateStatus', assetContract.abi, ownerAddress, args, function(response, err) {
        if( response ) {
          $('#checkinMsg').text(JSON.stringify(response));
        }
     });
  }


  function errorHandler(errorMessage, errorDetail) {
    var errorText = errorMessage + ': ' + JSON.stringify(errorDetail);
    console.log(errorText);
    $("#error").text(errorText);
  }

  function getFunctionAbi (abi, functionName) {
    function matchesFunctionName(json) {
      return (json.name === functionName && json.type === 'function');
    }

    var funcJson = abi.filter(matchesFunctionName)[0];
    return (funcJson);
  }

   function callFunction(name, abi, fromAddr, args, handleResponse) {

     var types = [];
     var addr = assetContract.address;
     console.log('callFunction contract address:' + addr);

     var fn = getFunctionAbi(abi, name);
     if( !fn.constant && (!fromAddr || fromAddr.length == 0) )
     {
       $('#error').text('Sender Address is required. ');
       return;
     }

     var argValue;
     for(i=0; i<fn.inputs.length; i++)
     {
       types.push(fn.inputs[i].type);
     }
     try {
       var functionData = encodeFunctionData(name, types, args);
     } catch (err) {
       errorHandler('Invalid input for ' + name + ' ' +  types, err);
       return;
     }

     if( fn.constant)
     {
       httpClient.ethCall(
         addr,
         functionData,
         fromAddr,
         function(response) {
           handleResponse(response);
         },
         function(message, error) {
           errorHandler(message, error);
         });
     }
     else
     {
       getNonce(fromAddr, function(nonceValue){

         var nonce = nonceValue;
         getGasPrice(function(gasPrice, err){
           if( err ) {
             handleResponse( null, error);
           } else {
             var gasLimit = 500000;
             var amountToSend = 0;

             var txObject = {
               nonce: nonce,
               gasPrice: gasPrice,
               gasLimit: gasLimit,
               to: addr,
               value: amountToSend,
               data: functionData
             }

             console.log("txObject: " + JSON.stringify(txObject));
             var signedTx = sign(txObject);

             httpClient.sendRawTransaction(
               signedTx,
               function(response) {
                 handleResponse(response, null);
               },
               function(msg, error) {
                 handleResponse( null, error);
             });
           }
         });
       });
     }
   }

   function sign(txObject) {
      var tx = new EthTx(txObject);
      tx.sign(privateKey);
      var serializedTx = tx.serialize();
      return serializedTx;
   }

   function getNonce(accountAddress, callback) {
     httpClient.getNonce(
       accountAddress,
       function( nonce ) {
         if( callback ) {
           callback(nonce);
         }
       },
       function( msg, error ) {
         errorHandler(msg, error);
       }
     );
   }
   function getGasPrice(callback)
   {
     httpClient.getGasPrice( function(gasPrice) {
         callback(gasPrice);
       },
       function( msg, error ) {
          errorHandler(msg, error);
       });
   }
   function getAbiTypes( abi ) {

     function getTypes(json) {
       return json.type;
     }

     return abi.map(getTypes);

   }
   function encodeFunctionData (functionName, types, args) {
     var fullName = functionName + '(' + types.join() + ')';
     var signature = ethUtil.sha3(fullName, 256).toString("hex").slice(0, 8);
     var dataHex = signature + coder.encodeParams(types, args);
     dataHex = ethUtil.addHexPrefix(dataHex);

    return dataHex;
   }
