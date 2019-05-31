new(function () {

var ext = this;
$.getScript('https://aswinkumar2019.github.io/microsoft.cognitiveservices.speech.sdk.bundle.js', initExtension);

var descriptor = {
		blocks: [
			[' ', 'initialise %s', 'initAzure'],

			['-'],
			['-'],

			[' ', 'choose language %m.languages', 'setLanguage', 'English'],
			['w', 'say %s', 'speak', 'Hello KIDS'],

			['-'],
			['-'],

			[' ', 'choose source language %m.sourceLanguages', 'setSourceLanguage', 'English'],
			[' ', 'choose target language %m.targetLanguages', 'setTargetLanguage', 'Chinese'],
			[' ', 'Choose Voice %m.voices', 'setvoice', 'Lucia'],
			[' ', 'Comparefaces', 'comparebucket'],
			[' ', 'Detect Faces', 'detectfaces'],
			[' ', 'DetectText', 'detectit'],
			['w', 'translate %s', 'translate', 'Hello'],
			['r', 'translatedText', 'getTranslatedText']

		],
		menus: {
			languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Chinese'],
		        voices: ['Lucia', 'Joanna', 'Penelope', 'Filiz', 'Lea', 'Vicki', 'Carla'],
			sourceLanguages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Chinese'],
			targetLanguages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Chinese']
		},
	};

	ScratchExtensions.register('Youcode Intelligence Solutions (Preparing KIDS for AI future)', descriptor, ext);
})();
