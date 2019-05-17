new(function () {
	      var ext = this;
	      $.getScript('https://apis.google.com/js/api.js', initExtension);
	      var sourceLang;
              var targetLang;
	      var langspeak;
	      var imgtype;
	      var translatedtext;
	      var videotype;
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
                               // "sampleRateHertz": number
                                         
                                  }
		}).then(function(r) {
			var enc = window.atob(r.result.audioContent);
			var uint8Array = new Uint8Array(enc.length);
			console.log(enc);
			for(var i = 0; i < enc.length; i++)
                      {
                           uint8Array[i] = enc.charCodeAt(i);
                         }
			var arrayBuffer = uint8Array.buffer;
			var blob = new Blob([arrayBuffer]);
		        var url = URL.createObjectURL(blob);
                        var audio = new Audio(url);
			audio.play();
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
		    		        "https://translation.googleapis.com/$discovery/rest?version=v2",
					"https://videointelligence.googleapis.com/$discovery/rest?version=v1"
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
			console.log(r.result.data.translations[0].translatedText);
			translatedtext = r.result.data.translations[0].translatedText;
		});
	};
		
	
        ext.getTranslatedText = function () {
		console.log(translatedtext);
		return translatedtext;
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
	 
	ext.videooutput = function () {
		var input = prompt("Enter the video url");
		gapi.client.videointelligence.videos.annotate(
			{
                         "inputUri":input,
                         "features": [
                                videotype
                              ]
                         }).then(function(response) {
                      console.log(response.result);
                           }, function(reason) {
                      console.log('Error: ' + reason.result.error.message);
                             });
                       };
	
	ext.getresult = function () {
		var id = prompt("Enter the name of process to get result");
		gapi.client.videointelligence.operations.get(
			{
				"name" : id
			}).then(function(response) {
                      console.log(response.result);
                           }, function(reason) {
                      console.log('Error: ' + reason.result.error.message);
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

	ext.v_labeldetect = function () {
		videotype = "LABEL_DETECTION"
	};
	

	ext.v_shotchange = function () {
		videotype = "SHOT_CHANGE_DETECTION"
	};
	
	ext.v_explicit = function () {
		videotype = "EXPLICIT_CONTENT_DETECTION"
	};
	
	ext.v_speechtranscript = function () {
		videotype = "SPEECH_TRANSCRIPTION"
	};
	
	ext.v_detecttext = function () {
		videotype = "TEXT_DETECTION"
	};
	
	ext.v_trackobject = function () {
		videotype = "OBJECT_TRACKING"
	};
        var descriptor = {
		blocks: [
			[' ', 'initialise', 'initGoogleServices'],

			['-'],
			['-'],
			['w', 'Say %s', 'speak', 'Hello Kids'],

			[' ', 'Get Image analysis', 'imganalyse'],
			[' ', 'Image face detection', 'facedetect'],
			[' ', 'Image Landmark Detection', 'landmarkdetect'],
			[' ', 'Image Logo Detection', 'logodetect'],
			[' ', 'Image Label Detection', 'labeldetect'],
			[' ', 'Image Text Detection', 'textdetect'],
			[' ', 'Image Safe search Detection', 'safedetect'],
			[' ', 'Image Web Detection', 'webdetect'],
			[' ', 'Image Properties', 'imgproperty'],
			
			['-'],
			['-'],
			
			[' ', 'Video Label Detection', 'v_labeldetect'],
			[' ', 'Video Shot change Detection', 'v_shotchange'],
			[' ', 'Video Explicit content detection', 'v_explicit'],
			[' ', 'Video Speech transcription', 'v_speechtranscript'],
			[' ', 'Video Text Detection', 'v_detecttext'],
			[' ', 'Video Object tracking', 'v_trackobject'],
			[' ', 'Start video Analysis', 'videooutput'],
			[' ', 'Get Video analysis result', 'getresult'],


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



