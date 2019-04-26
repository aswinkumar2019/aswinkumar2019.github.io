new(function () {

	var ext = this;

	$.getScript('https://ceyhunozgun.github.io/awsAIScratchExtension/aws-sdk-2.270.1.js', initExtension);

	var accessKeyId = '';
	var secretAccessKey = '';
        var bucketsource;
	var sourceimg;
	var inputimg;
	var polly;
        var Rekognition;
	var voice = 'Joanna';
	var language = 'English';
	var sourceLanguage = 'English';
	var targetLanguage = 'Spanish';

	var languages = {
		'Chinese': {
			pollyVoice: 'Lucia',
			translateCode: 'zh',
		},
		'English': {
			pollyVoice: 'Joanna',
			translateCode: 'en',
		},
		'Spanish': {
			pollyVoice: 'Penelope',
			translateCode: 'es',
		},
		'Turkish': {
			pollyVoice: 'Filiz',
			translateCode: 'tr',
		},
		'French': {
			pollyVoice: 'Lea',
			translateCode: 'fr',
		},
		'German': {
			pollyVoice: 'Vicki',
			translateCode: 'de',
		},
		'Italian': {
			pollyVoice: 'Carla',
			translateCode: 'it',
		}
	};

	var translatedText = '';
	var detectedText = '';

	function initAWS(region) {
		AWS.config.region = region;
		AWS.config.accessKeyId = accessKeyId;
		AWS.config.secretAccessKey = secretAccessKey;
	}

	function initPolly(region) {
		polly = new AWS.Polly({
			region: region
		});
	}

	function initTranslate(region) {
		translate = new AWS.Translate({
			region: region
		});
	}

        function initRekognition(region) {
		rekognition = new AWS.Rekognition({
			region: region
		});
	}
	function playAudioFromUrl(url, finishHandler) {
		var audio = new Audio(url);
		audio.onended = function () {
			if (finishHandler)
				finishHandler();
		}
		audio.play();
	}

	function speak(txt, voiceId, callback) {
		var params = {
			OutputFormat: 'mp3',
			Text: txt,
			VoiceId: voiceId,
		};

		polly.synthesizeSpeech(params, function (err, data) {
			if (err)
				console.log(err, err.stack);
			else {
				var uInt8Array = new Uint8Array(data.AudioStream);
				var arrayBuffer = uInt8Array.buffer;
				var blob = new Blob([arrayBuffer]);
				var url = URL.createObjectURL(blob);

				playAudioFromUrl(url, callback);
			}
		});
	};


	function translateText(text, sourceLang, targetLang, translationHandler) {
		var params = {
			Text: text,
			SourceLanguageCode: languages[sourceLang].translateCode,
			TargetLanguageCode: languages[targetLang].translateCode,
		};
		translate.translateText(params, function (err, data) {
			if (err)
				console.log(err, err.stack);
			else
				translationHandler(data.TranslatedText);
		});
	}

	function initExtension() {}

	function initAWSServices(region) {
		initAWS(region);
		initPolly(region);
		initTranslate(region);
		initRekognition(region);
	}

	// Initialization services

	ext.initAWSServices = function (region) {
		if (accessKeyId === '')
			accessKeyId = prompt("Enter the access ID")
		if (secretAccessKey === '')
			secretAccessKey = prompt("Enter the access key")
		bucketsource = prompt("Enter the bucket link")
		sourceimg = prompt("Enter image source link if there is any,else leave it blank")
		inputimg = prompt("Enter input image link if there is any,else leave it blank")

		initAWSServices(region);
	};
	
	ext.comparebucket = function () {
		var comparams = {
			SimilarityThreshold: 20,
			SourceImage: {
				S3Object: {
					Bucket: bucketsource,
					Name: sourceimg
				}
			},
			TargetImage: {
				S3Object: {
					Bucket: bucketsource,
					Name: inputimg
				}
			}
		};
		rekognition.compareFaces(comparams, function (err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log(data); // successful response
		});
	};

	ext.makecollection = function () {
		var name = prompt("Enter the name of collection");
		var collect = {
                CollectionId: name /* required */
       };
        rekognition.createCollection(collect, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
            });
	};
	// Polly services
	ext.setLanguage = function (lang) {
		language = lang;
		voice = languages[language].pollyVoice;
	};

	ext.speak = function (text, callback) {
		speak(text, voice, callback);
	};

        ext.ListCollections = function () {
		var listit = {
		};
        rekognition.listCollections(listit, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        /*
       data = {
       CollectionIds: [
       "myphotos"
       ]
       }
      */
       });
	};
	// Translate services
	
	ext.IndexFaces = function () {
		var name = prompt("Enter the name of collection");
		var category = prompt("Enter the category");
		var params = {
                    CollectionId: name, 
                    DetectionAttributes: [
                    ], 
                    ExternalImageId: category, 
                    Image: {
                    S3Object: {
                    Bucket: bucketsource, 
                    Name: sourceimg
                     }
                    }
                    };
         rekognition.indexFaces(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response
	 });
	};
       ext.DeleteCollections =function () {
		 var name = prompt("Enter the collection to delete");
		 var params = {
                 CollectionId: name
                 };
        rekognition.deleteCollection(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
          /*
          data = {
          StatusCode: 200
          }
          */
        });
	};
	
	ext.ListFaces = function () {
		var name = prompt("Enter the name of the collection");
	        var params = {
                CollectionId: name, 
                MaxResults: 20
            };
        rekognition.listFaces(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
	});
	};
	
	ext.setSourceLanguage = function (lang) {
		sourceLanguage = lang;
	};

	ext.setTargetLanguage = function (lang) {
		targetLanguage = lang;
	};

	ext._shutdown = function () {};

	ext._getStatus = function () {
		return {
			status: 2,
			msg: 'Ready'
		};
	};

	var descriptor = {
		blocks: [
			[' ', 'init AWS %s', 'initAWSServices', 'us-east-1'],

			['-'],
			['-'],

			[' ', 'choose language %m.languages', 'setLanguage', 'English'],
			['w', 'say %s', 'speak', 'Hello from Amazon Web Services'],

			['-'],
			['-'],

			[' ', 'choose source language %m.sourceLanguages', 'setSourceLanguage', 'English'],
			[' ', 'choose target language %m.targetLanguages', 'setTargetLanguage', 'Chinese'],
			[' ', 'Comparefaces', 'comparebucket'],
			[' ', 'CreateCollection', 'makecollection'],
			[' ', 'ListCollection', 'ListCollections'],
			[' ', 'DeleteCollection', 'DeleteCollections'],
			[' ', 'IndexFaces', 'IndexFaces'],
			[' ', 'ListFaces', 'ListFaces']
			],
		menus: {
			languages: ['English', 'Spanish', 'Turkish', 'French', 'German', 'Italian', 'Chinese'],
			sourceLanguages: ['English', 'Spanish', 'Turkish', 'French', 'German', 'Italian', 'Chinese'],
			targetLanguages: ['English', 'Spanish', 'Turkish', 'French', 'German', 'Italian', 'Chinese']
		},
	};

	ScratchExtensions.register('AWS AI Services', descriptor, ext);
	})();






