new(function () {

	var ext = this;

	$.getScript('https://ceyhunozgun.github.io/awsAIScratchExtension/aws-sdk-2.270.1.js', initExtension);

	var accessKeyId = '';
	var secretAccessKey = '';

	var polly;
        var Rekognition;
	var voice = 'Joanna';
	var language = 'English';
	var sourceLanguage = 'English';
	var targetLanguage = 'Spanish';

	var languages = {
		'Chinese': {
			pollyVoice: 'Lucia',
			translateCode: 'cmn',
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
	}

	function comparethem(bucketsource, bucketinput) {
		var comparams = {
			SimilarityThreshold: 20,
			SourceImage: {
				S3Object: {
					Bucket: bucketsource,
					Name: "IMG_20190118_174505.jpg"
				}
			},
			TargetImage: {
				S3Object: {
					Bucket: bucketinput,
					Name: "IMG_20181105_161625.jpg"
				}
			}
		};
		prompt("Hello")
		rekognition.compareFaces(comparams, function (err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log(data); // successful response
		});
	}

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

		initAWSServices(region);
	};
	ext.comparebucket = function () {
		bucketsource = "youcode"
		bucketinput = "youcode"
		speak("I am inside");
		comparethem(bucketsource, bucketinput);
	};

	// Polly services
	ext.setLanguage = function (lang) {
		language = lang;
		voice = languages[language].pollyVoice;
	};

	ext.speak = function (text, callback) {
		speak(text, voice, callback);
	};


	// Translate services
	ext.setSourceLanguage = function (lang) {
		sourceLanguage = lang;
	};

	ext.setTargetLanguage = function (lang) {
		targetLanguage = lang;
	};

	ext.translate = function (text, callback) {
		translateText(text, sourceLanguage, targetLanguage, function (txt) {
			translatedText = txt;
			callback();
		});
	};

	ext.getTranslatedText = function () {
		return translatedText;
	}

	ext._shutdown = function () {};

	ext._getStatus = function () {
		return {
			status: 2,
			msg: 'Ready'
		};
	};

	var descriptor = {
		blocks: [
			[' ', 'init AWS %s', 'initAWSServices', 'eu-west-1'],

			['-'],
			['-'],

			[' ', 'choose language %m.languages', 'setLanguage', 'English'],
			['w', 'say %s', 'speak', 'Hello from Amazon Web Services'],

			['-'],
			['-'],

			[' ', 'choose source language %m.sourceLanguages', 'setSourceLanguage', 'English'],
			[' ', 'choose target language %m.targetLanguages', 'setTargetLanguage', 'Spanish'],
			[' ', 'compare', 'comparebucket'],
			['w', 'translate %s', 'translate', 'Hello'],
			['r', 'translatedText', 'getTranslatedText']

		],
		menus: {
			languages: ['English', 'Spanish', 'Turkish', 'French', 'German', 'Italian'],
			sourceLanguages: ['English', 'Spanish', 'Turkish', 'French', 'German', 'Italian', 'Chinese'],
			targetLanguages: ['English', 'Spanish', 'Turkish', 'French', 'German', 'Italian', 'Chinese']
		},
	};

	ScratchExtensions.register('AWS AI Services', descriptor, ext);
})();

