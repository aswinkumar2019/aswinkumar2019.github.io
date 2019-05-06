/* FIRST COMMIT */
	function updateGoogleSigninStatus(isSignedIn) {
		if (isSignedIn) {
			googleServicesAuthorized();
		}
	}


function googleServicesAuthorized() {
		gapi.client.load('speech', 'v1', function() {
			gapi.client.load('translate', 'v2', function () {
				setSpeechStatus('Loaded.');
			});
		});
	}

function initGoogleServices() {
		setSpeechStatus('Loading...');
		gapi.load('client:auth2', function () {
			gapi.client.init({
				var key = prompt("Enter the google api key");
				'apiKey': key,
				// Your API key will be automatically added to the Discovery Document URLs.
				'discoveryDocs': [
					"https://speech.googleapis.com/$discovery/rest?version=v1",
		    		"https://translation.googleapis.com/$discovery/rest?version=v2"
		    	],
				// clientId and scope are optional if auth is not required.
				'clientId': GOOGLE_CLIENT_ID,
				'scope': 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/cloud-translation',
			}).then(function() {
				gapi.auth2.getAuthInstance().isSignedIn.listen(updateGoogleSigninStatus);
				var authorized = gapi.auth2.getAuthInstance().isSignedIn.get();
				
				if (authorized)
					googleServicesAuthorized();
				else
					gapi.auth2.getAuthInstance().signIn();
			});
		});
	}

function translateText(text, sourceLang, targetLang, translationHandler) {
			translateTextGoogle(text, sourceLang, targetLang, translationHandler);
	}

function recognizeSpeech(audioData, recognizeInputLanguage, recognitionHandler) {
		console.log("recognizing speech ...");
		recognizeSpeechGoogle(arrayBufferToBase64(audioData), recognizeInputLanguage, recognitionHandler);
	}
	
	function recognizeSpeechGoogle(base64Audio, inputLang, recognitionHandler) {
		gapi.client.speech.speech.recognize({
			config: {
				'languageCode': inputLang,
				'maxAlternatives': 5 
			},
			audio: {
				'content': base64Audio
			}
		}).execute(function (r) {
			setSpeechStatus('');
			var text = null;
			if (r.result && r.result.results)
				text = extractBestSpeechResult(r.result.results);
			if (text)
				recognitionHandler(text);
		});
	}
