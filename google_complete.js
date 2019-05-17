new(function () {
	      var ext = this;
	      $.getScript('https://apis.google.com/js/api.js', initExtension);
	      var sourceLang;
              var targetLang;
	      var langspeak;
	      var imgtype;
	      var translatetext;
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
	

	
	function initExtension() {}

        function playAudioFromUrl(url) {
		prompt("Inside playaudiofromurl block");
		var audio = new Audio(url);
		audio.play();
          };
	
	ext.speak = function (texttospeak) {
		var voicetype = prompt("Enter voice type,Values may be MALE,FEMALE,SSML_VOICE_GENDER_UNSPECIFIED,NEUTRAL");
		gapi.client.texttospeech.text.synthesize({
			 "input": {
                                 "text": texttospeak,
                                   },
                         "voice": {
                                "languageCode": langspeak,
                               // "name": string,
                                "ssmlGender": voicetype
                                  },
                         "audioConfig": {
                                "audioEncoding": "MP3",
                                "speakingRate": 1.0,
                                "pitch": 0.0,
                                "volumeGainDb": 0.0,
                               // "sampleRateHertz": number,
                                "effectsProfileId": [
                                              "medium-bluetooth-speaker-class-device"
                                             ]
                                  }
		}).then(function(r) {
			console.log(r.result.audioContent);
			var uInt8Array = new Uint8Array(r.result.audioContent.AudioStream);
			var arrayBuffer = uInt8Array.buffer;
			var blob = new Blob([arrayBuffer]);
		        var url = URL.createObjectURL(blob);
                        playAudioFromUrl(url);
                  });
	};
			
	ext.initGoogleServices = function () {
	        var key = prompt("Enter the google api key");
		gapi.load('client:auth2', function () {
			gapi.client.init({
				
				'apiKey': key,
				// Your API key will be automatically added to the Discovery Document URLs.
				'discoveryDocs': [
					"https://texttospeech.googleapis.com/$discovery/rest?version=v1",
					"https://vision.googleapis.com/$discovery/rest?version=v1",
		    		        "https://translation.googleapis.com/$discovery/rest?version=v2"
		    	]})
		});
	};

        ext.translate = function (text) {
		gapi.client.language.translations.translate({ 
			'q': text,
			'source': sourceLang,
			'target': targetLang,
			'format': 'text'
		}).then(function(r) {
			console.log(r);
			translatetext = r.result;
		});
	};
		
	
        ext.getTranslatedText = function () {
		return translatedText;
	};

	ext.imganalyse = function () {
		var uri = prompt("Enter the url where image is stored");
		gapi.client.vision.images.annotate({
                                       "requests": [
                                                 {
                                             "imageContext": {
                                                     "webDetectionParams": {
                                                       "includeGeoResults": true
                                                                     }
                                                           },
                                                 "image": {
                                                         "source": {
                                                               "imageUri": uri
                                                                    }
                                                             },
                                                "features": [
                                                     {
                                                   "type": imgtype
                            }
                       ]
                      }
                  ]
                                          }).then(function(r) {
			console.log(r);
                  });
	          };
	 
        ext.setlanguage = function(lang) {
		var speaklang = lang;
		langspeak = languages[speaklang].translateCode;
	};
			
	ext.setSourceLanguage = function (lang) {
		var sourceLanguage = lang;
		sourceLang = languages[sourceLanguage].translateCode;
		
		
	};

	ext.setTargetLanguage = function (lang) {
		var targetLanguage = lang;
		targetLang = languages[targetLanguage].translateCode;
	};
		
	ext.facedetect = function () {
		imgtype = "FACE_DETECTION"
	};
		
	ext.landmarkdetect = function () {
		imgtype = "LANDMARK_DETECTION"
	};
		
	ext.logodetect = function () {
		imgtype = "LOGO_DETECTION"
	};
		
	ext.labeldetect = function () {
		imgtype = "LABEL_DETECTION"
	};
		
	ext.textdetect = function () {
		imgtype = "TEXT_DETECTION"
	};
		
	ext.safedetect = function () {
		imgtype = "SAFE_SEARCH_DETECTION"
	};
		
		
	ext.webdetect = function () {
		imgtype = "WEB_DETECTION"
	};
		
	ext.imgproperty = function () {
		imgtype = "IMAGE_PROPERTIES"
	};

        var descriptor = {
		blocks: [
			[' ', 'initialise', 'initGoogleServices'],

			['-'],
			['-'],
			['w', 'initialise speak %s', 'speak', 'Hello Kids'],

			[' ', 'Say %s', 'speakresult', 'Hello Kids'],
			[' ', 'Get Image analysis', 'imganalyse'],
			[' ', 'face detection', 'facedetect'],
			[' ', 'Landmark Detection', 'landmarkdetect'],
			[' ', 'Logo Detection', 'logodetect'],
			[' ', 'Label Detection', 'labeldetect'],
			[' ', 'Text Detection', 'textdetect'],
			[' ', 'Safe search Detection', 'safedetect'],
			[' ', 'Web Detection', 'webdetect'],
			[' ', 'Image Properties', 'imgproperty'],
			
			['-'],
			['-'],

		        [' ', 'choose language %m.languages', 'setlanguage', 'English'],
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


