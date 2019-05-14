new(function () {
	      var ext = this;
	      $.getScript('https://apis.google.com/js/api.js', initExtension);
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

	function initExtension() {}


	ext.initGoogleServices = function () {
	        var key = prompt("Enter the google api key");
		prompt("Set speech status");
		gapi.load('client:auth2', function () {
			gapi.client.init({
				
				'apiKey': key,
				// Your API key will be automatically added to the Discovery Document URLs.
				'discoveryDocs': [
					"https://speech.googleapis.com/$discovery/rest?version=v1",
		    		"https://translation.googleapis.com/$discovery/rest?version=v2"
		    	]})
		});
	};

        ext.translate = function (text) {
		prompt("Translation block entered");
		gapi.client.language.translations.translate({ 
			'q': text,
			'source': sourceLang,
			'target': targetLang,
			'format': 'text'
		}).then(function(r) {
			console.log(r);
		});
	};
		
	
        ext.getTranslatedText = function () {
		prompt("Return translated text block");
		return translatedText;
	};

	
	ext.setSourceLanguage = function (lang) {
		prompt("Set source language block");
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


