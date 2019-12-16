var fs = require("fs");
var FormConfig = require('./Config')
var {optionCallback, optionArgs, optionError} = require('./InternalModules')

const htmlInputTypes = ["textarea", "select", "button", "checkbox", "color", "date", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"];
 
module.exports = function CreateForm(formName, options, callback) {
	
	FormConfig.CheckForm(formName, function(err, data){
		if(err){
			optionError(err, callback)
		}
		else{
			callback = optionCallback(options, callback)
			let args = {"endpointUrl":"", "formFields":{}}
			optionArgs(formName, args, options, function(err, data){
				if(err) optionError(err, callback)
				else {
					options = data;
					writeForm(formName, options, callback)
				}
			})
		}
	})
}

function writeForm(formName, options, callback) {
	var formBody = ''
	let formFields = options["formFields"]
	try{
		Object.keys(formFields).map(function(key, index) {
			let field = formFields[key];
			let fieldHtml = "";
			if(!htmlInputTypes.includes(field["type"])){
				let err = `Error. invalid html type: ${field["type"]}`;
				throw new Error(err)
			}
			else if(field["type"] === "textarea"){
				fieldHtml = `<textarea type="text" class="form-control" id="${key}" name="${key}" placeholder="${field["label"]}" ${field["required"]? "required":null}></textarea>`; 
			}
			else if(field["type"] === "select"){
				let options = field["options"]
				let htmlOptions = `<option value="" selected="selected" disabled="disabled">Select a ${field["label"]}</option>`;
				Object.keys(options).map(function(key, index) {
					htmlOptions += `<option value=${key}>${options[key]}</option>`
				})
				fieldHtml = `<select class="form-control" id="${key}" name="${key}" ${field["required"]? "required":null}>${htmlOptions}</select>`
			}
			else{
				fieldHtml = `<input type="${field["type"]}" class="form-control" id="${key}" name="${key}" placeholder="${field["label"]}" ${field["required"]? "required":null}>`;
			}
			formBody += `
				<label for="${key}" class="small mb-0">${field["label"]}</label>
				${fieldHtml}
			`;
		});
		var fieldVars = '"id": "",';
		Object.keys(options["formFields"]).map(function(key, index) {
			fieldVars += `"${key}": $('#${key}').val(),`;
		});
		var jqVars= fieldVars.substring(0, (fieldVars.length -1));
		//console.log(jqVars);
		var htmlForm = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
				<meta name="A serverless contact form for your website in less than a minute." content="">
				<meta name="Torus" content="">
				<title>Super Easy From</title>
				<!-- Bootstrap core CSS -->
				<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
			</head>
			<body class="p-5 bg-light">
				<!-- CONTACT SECTION -->
				<section class="bg-white py-4">
					<div class="container">
						<div class="row">
								<div class="col-md-6">
									<h4 class="h2 pb-2">Contact Us</h4>
									<!-- FORM BY SUPER EASY FORMS -->
									<form id="super-easy-form" alt="Form by Super Easy Forms" class="pb-3" action="#">
										${formBody}  
										<h5 id="contact-status" class="text-secondary" style="display:none;">Thanks for Contacting Us</h5>
										<button class="btn btn-primary mt-3" type="submit" id="super-easy-btn">Send</button>
									</form>
									<small>made with <a href="http://supereasyforms.com">super easy forms</a> <small> <!-- it's bad etiquette to use free stuff without giving some cred to the creators :) -->
								</div>   
						</div>
					</div>         
				</section>
				<!--Javascript-->
				<script
					src="https://code.jquery.com/jquery-3.4.1.min.js"
					integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
					crossorigin="anonymous">
				</script>
				<script>
					$(function(){
						$('#super-easy-form').submit(function(e){
								e.preventDefault();
								var formdata = toJSONString(this);
								console.log(formdata);
								$.ajax({
										type: "POST",
										url: "${options["endpointUrl"]}",
										dataType: "json",
										contentType: "application/json",
										data: JSON.stringify( { ${jqVars} } ),
										beforeSend: function(data) {
												$('#super-easy-btn').prop('disabled', true);
												$('#super-easy-form :input').prop('disabled', true);
												$('#contact-status').html('Sending...').show();
										},
										success: function(data) {
												console.log(data);
												$('#contact-status').text("We'll get back to you soon").show();
												$('#super-easy-form :input').removeProp('disabled');
												$('#super-easy-btn').removeProp('disabled');
										},
										error: function(jqXHR, textStatus, errorThrown) {
												$('#contact-status').text('Error. Please try again soon.').show();
												$('#super-easy-form :input').removeProp('disabled');
												$('#super-easy-btn').removeProp('disabled');
										}
								});
						}); 				
						function toJSONString (form) {
							var obj = {};
							var elements = form.querySelectorAll("input, select, textarea");
							for(var i = 0; i < elements.length; ++i) {
								var element = elements[i];
								if(name) {
									obj[element.name] = element.value;
								}
							}
							return JSON.stringify(obj);
						}
					});
				</script>
			</body>
		</html>`;
		fs.writeFile(`forms/${formName}/${formName}.html`, htmlForm, function(err) {
			if(err) {
				callback(new Error(err))
			}
			else {
				//console.log('\x1b[32m', `Your form was succesfully saved in forms/${formName}`, '\x1b[0m');
				if(callback && typeof callback === 'function') callback(null, htmlForm);
				else return htmlForm;
			}
		});
	}
	catch(err) {
		optionError(err, callback)
	}
}