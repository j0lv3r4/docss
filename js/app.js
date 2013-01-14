(function($){

	window.config = {
		theme: 'tomorrow_night',
		fontSize: '16px',
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
			Porthole.trace("onload");
	        // Create a proxy window to send to and receive 
	        // messages from the iFrame
	        windowProxy = new Porthole.WindowProxy(proxyGuest, 'guestFrame');

	        // Register an event handler to receive messages;
	        windowProxy.addEventListener();
		},

		codeEditorConfig: function(){			
            editors = {};

	        editors['do-css'] = new ace.edit('edit-css');
	        editors['do-html'] = new ace.edit('edit-html');

	        editors['do-css'].setTheme("ace/theme/" + config.theme );
	        editors['do-css'].getSession().setMode("ace/mode/css");

	        editors['do-html'].setTheme("ace/theme/" + config.theme );
	        editors['do-html'].getSession().setMode("ace/mode/html");

	        docss = editors['do-css'];
            dohtml = editors['do-html'];

            dohtml.setFontSize(config.fontSize);
            docss.setFontSize(config.fontSize);
		},

		getLocalStorageData: function(){
			cssMSG = "/* Do your CSS here! */";
            htmlMSG = "<!-- Do your HTML here! -->";

            if (!localStorage.getItem('cssDB')) { localStorage.setItem('cssDB', cssMSG); }
            if (!localStorage.getItem('htmlDB')) { localStorage.setItem('htmlDB', htmlMSG); }

            getCSSData = localStorage.getItem('cssDB');
            getHTMLData = localStorage.getItem('htmlDB');

	        docss.setValue(getCSSData);
            dohtml.setValue(getHTMLData);

            dohtml.session.setUseWrapMode(true);
            docss.session.setUseWrapMode(true);

            windowProxy.post({'html' : getHTMLData });
            windowProxy.post({'css' : getCSSData });
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

		sendOption: function(option){
			option.click(function(){
				if (option === bootstrap) {
					windowProxy.post({ 'bootstrap' : 'bootstrap' });
					localStorage.setItem('option', 'bootstrap');
				}

				if (option === normalize) {
					windowProxy.post({ 'normalize' : 'normalize' });
					localStorage.setItem('option', 'normalize');
				}

				if (option === none) {
					windowProxy.post({ 'none' : 'none' });
					localStorage.setItem('option', 'none');
				}

				all.removeClass('selected');
            	option.addClass('selected');
			})
		},

		showAbout: function(source){
			source.click(function(){
				if (source === close){
					about.fadeOut('slow');
				} else {
					about.fadeIn('slow');
				}
			});
		},

		getOption: function(){
			target = localStorage.getItem('option');

			if (target === 'bootstrap'){
				d = bootstrap;
				windowProxy.post({ 'bootstrap' : target });
			}

			if (target === 'normalize'){
				d = normalize;
				windowProxy.post({ 'normalize' : target });
			}

			if (target === 'none'){
				d = none;
				windowProxy.post({ 'none' : target });
			}

			all.removeClass('selected');	
			d.addClass('selected');
		}
	};

	app.init();

})(jQuery);