/* FIRST COMMIT */
new(function () {
	      var ext = this;
	      var sourceLang;
              var targetLang;
              var languages = {
		'Japanese': {
			translateCode: 'ja',
		},
		'Albanian': {
			translateCode: 'sq',
		},
		'Hindi': {
			translateCode: 'hi',
		},
		'Arabic': {
			translateCode: 'ar',
		},
		'German': {
			translateCode: 'de',
		},
		'Gujarati': {
			translateCode: 'gu',
		},
		'English': {
			translateCode: 'en',
		},
	        'Kannada': {
			translateCode: 'kn',
		},
	        'Korean': {
			translateCode: 'ko',
		},
		'Malayalam': {
			translateCode: 'ml',
		},
		'Punjabi': {
			translateCode: 'pa',
		},
		'Tamil': {
			translateCode: 'ta',
		},
	        'Spanish': {
			translateCode: 'es',
		},
};
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


function translateTextGoogle(text,translationHandler) {
		gapi.client.language.translations.translate({ 
			'q': text,
			'source': sourceLang,
			'target': targetLang,
			'format': 'text'
		}).execute(function(r) {
			console.log(r);
			if (r.data.translations.length > 0) {
				var translatedText = r.data.translations[0].translatedText;
				translationHandler(translatedText);
			}
		});
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


	ext.initGoogleServices = function () {
	        var key = prompt("Enter the google api key");
		setSpeechStatus('Loading...');
		gapi.load('client:auth2', function () {
			gapi.client.init({
				
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
	};

        ext.translate = function (text, translationHandler) {
		translateTextGoogle(text, translationHandler);
	};
		
	
        ext.getTranslatedText = function () {
		return translatedText;
	};

	
	ext.setSourceLanguage = function (lang) {
		sourceLanguage = lang;
		sourceLang = languages[sourceLanguage].translateCode;
		
		
	};

	ext.setTargetLanguage = function (lang) {
		targetLanguage = lang;
		targetLang = languages[targetLanguage].translateCode;
	};

        var descriptor = {
		blocks: [
			[' ', 'initialise', 'initGoogleServices'],

			['-'],
			['-'],

			[' ', 'choose language %m.languages', 'setLanguage', 'English'],
			['w', 'say %s', 'speak', 'Hello Kids'],

			['-'],
			['-'],

			[' ', 'choose source language %m.sourceLanguages', 'setSourceLanguage', 'English'],
			[' ', 'choose target language %m.targetLanguages', 'setTargetLanguage', 'Tamil'],
			['w', 'translate %s', 'translate', 'Hello'],
			['r', 'translatedText', 'getTranslatedText']

		],
		menus: {
			languages: ['English', 'Japanese', 'Albanian', 'Hindi', 'Arabic', 'German', 'Gujarati', 'Kannada', 'Korean', 'Malayalam', 'Punjabi', 'Tamil', 'Spanish'],
			sourceLanguages: ['English', 'Japanese', 'Albanian', 'Hindi', 'Arabic', 'German', 'Gujarati', 'Kannada', 'Korean', 'Malayalam', 'Punjabi', 'Tamil', 'Spanish'],
			targetLanguages: ['English', 'Japanese', 'Albanian', 'Hindi', 'Arabic', 'German', 'Gujarati', 'Kannada', 'Korean', 'Malayalam', 'Punjabi', 'Tamil', 'Spanish']
		},
	};

	ScratchExtensions.register('Youcode Intelligence Solutions (Preparing KIDS for AI future)', descriptor, ext);
	})();

