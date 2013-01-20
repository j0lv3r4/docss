(function($){

	window.config = {
		theme: 'tomorrow_night',
		fontSize: '16px'
	};

	window.app = {

		init: function(){
			this.getElements();
			this.crossDomainConfig();
			this.codeEditorConfig();
			this.getLocalStorageData();
			this.getEvents();
		},

		getElements: function(){
			// crossdomain stuff
			proxyGuest = "http://blogly.co/docss/proxy.html",
        	windowProxy = "",

        	// code editor stuff
            editCSS = $('pre#edit-css'),
            editHTML = $('pre#edit-html'),

            // options stuff
            close = $('.close'),
            about = $('.about'),
            aboutBtn = $('.about-btn'),

            // functionally stuff
            none = $('.none'),
            bootstrap = $('.bootsrap'),
            normalize = $('.normalize'),
            all = $('.bootsrap, .normalize, .none');

		},

		crossDomainConfig: function(){
			// Config Porthole for Safe CrossDomain Comunication
			Porthole.trace("onload");

	        // Create a proxy window to send to and receive 
	        // messages from the iFrame
	        windowProxy = new Porthole.WindowProxy(proxyGuest, 'guestFrame');

	        // Register an event handler to receive messages;
	        windowProxy.addEventListener();
		},

		codeEditorConfig: function(){		

			// Configuration for ACE editor	
            editors = {};

	        editors['do-css'] = new ace.edit('edit-css');
	        editors['do-html'] = new ace.edit('edit-html');

	        // Get theme for CSS Editor
	        editors['do-css'].setTheme("ace/theme/" + config.theme );
	        editors['do-css'].getSession().setMode("ace/mode/css");

	        // Get theme for HTML Editor
	        editors['do-html'].setTheme("ace/theme/" + config.theme );
	        editors['do-html'].getSession().setMode("ace/mode/html");

	        docss = editors['do-css'];
            dohtml = editors['do-html'];

            // Set the Font-Size from config
            dohtml.setFontSize(config.fontSize);
            docss.setFontSize(config.fontSize);
		},

		getLocalStorageData: function(){
			cssMSG = "/* Do your CSS here! */";
            htmlMSG = "<!-- Do your HTML here! -->";

            // If the localStorage is empty then set the default msgs
            if (!localStorage.getItem('cssDB')) { localStorage.setItem('cssDB', cssMSG); }
            if (!localStorage.getItem('htmlDB')) { localStorage.setItem('htmlDB', htmlMSG); }

            // Save the data on a object
            getCSSData = localStorage.getItem('cssDB');
            getHTMLData = localStorage.getItem('htmlDB');

            // Send the data to the code editors
	        docss.setValue(getCSSData);
            dohtml.setValue(getHTMLData);

            // Set an option like overflow-x: break-word on the code editors
            dohtml.session.setUseWrapMode(true);
            docss.session.setUseWrapMode(true);

            // This send the data to the iframe from the code editors when load the page
            windowProxy.post({'html' : localStorage.getItem('htmlDB') });
            windowProxy.post({'css' : localStorage.getItem('cssDB') });
		},

		getEvents: function() {
			this.sendCode(editHTML, 'html');
			this.sendCode(editCSS, 'css');
			this.sendOption(bootstrap);
			this.sendOption(normalize);
			this.sendOption(none);
			this.showAbout(close);
			this.showAbout(aboutBtn);
			this.getOption();
		},

		// Send the data to the iframe from the code editor when you are typing 
		sendCode: function(from, lang) {
			from.keyup(function() {
				if (lang === 'html') {
					getcode = dohtml.getSession().getValue();
					windowProxy.post({'html' : getcode });
					localStorage.setItem('htmlDB', getcode);
				} else {
					getcode = docss.getSession().getValue();
					windowProxy.post({'css' : getcode });
					localStorage.setItem('cssDB', getcode);
				}
			});
		},

		// Send the helper option to the iframe
		sendOption: function(option){
			option.click(function(){
				if (option === bootstrap) {
					windowProxy.post({ 'bootstrap' : 'bootstrap' });
					console.log('Sending to iframe: bootstrap');
					localStorage.setItem('option', 'bootstrap');
				}

				if (option === normalize) {
					windowProxy.post({ 'normalize' : 'normalize' });
					console.log('Sending to iframe: normalize');
					localStorage.setItem('option', 'normalize');
				}

				if (option === none) {
					windowProxy.post({ 'none' : 'none' });
					console.log('Sending to iframe: none');
					localStorage.setItem('option', 'none');
				}

				all.removeClass('selected');
            	option.addClass('selected');
			});
		},

		// Show the About section
		showAbout: function(source){
			source.click(function(){
				if (source === close){
					about.fadeOut('slow');
				} else {
					about.fadeIn('slow');
				}
			});
		},

		// This save the option you chosed when you leave and come back to the page
		getOption: function(){
			d = none;

			// Save the data on a obj
			target = localStorage.getItem('option');

			// If is the first time you visit the page, set to none
			if (!target) { 
				console.log('getOption: target empty');
				d = none; }

			// I don't know how to use a var on the key so I had to do this
			if (target === 'bootstrap'){
				console.log('getOption: bootstrap');
				d = bootstrap;
				windowProxy.post({ 'bootstrap' : localStorage.getItem('option') });
			}

			if (target === 'normalize'){
				console.log('getOption: normalize');
				d = normalize;
				windowProxy.post({ 'normalize' : localStorage.getItem('option') });
			}

			else {
				console.log('getOption: none');
				windowProxy.post({ 'none' : localStorage.getItem('option') });
			}

			// Get the option and add the class to the btn
			all.removeClass('selected');	
			d.addClass('selected');
		}
	};

	app.init();

})(jQuery);