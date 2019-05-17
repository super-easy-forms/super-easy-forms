var fs = require("fs");
const open = require('open');
 
exports.script = function formGenerator(url) {
	let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  const fields = obj.formFields;
	
	var formBody = ''
	for(let f of fields) {
		formBody += `
			<label for="${f}" class="small mb-0">${f}</label>
			<input type="text" class="form-control" id="${f}" name="${f}" placeholder="${f}" required>
		`; 
	};
	var fieldVars = '"id": "",';
	for(let fv of fields) {
		fieldVars += `"${fv}": $('#${fv}').val(),`;  
	};
	var jqVars= fieldVars.substring(0, (fieldVars.length -1));

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
										url: "${url}",
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
							var name = element.name;
							var value = element.value;
							if(name) {
								obj[name] = value;
							}
								}
								return JSON.stringify(obj);
						}
					});
				</script>

			</body>

		</html>
		`;
	fs.writeFile("super-easy-form.html", htmlForm, function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log('\x1b[32m', 'Your form was succesfully saved as super-easy-form.html', '\x1b[0m');
			console.log('\x1b[32m', "Wasn't that Super Easy?", '\x1b[0m');
			open('super-easy-form.html');
		}
	});
}