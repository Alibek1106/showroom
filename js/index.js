(function(window) {
	$(document).ready(function() {
		$('#button-login').on('click', loginHandler);
		$('#button-register').on('click', registerHandler);
		$('#button-billing').on('click', billingHandler);
		$('#button-billing-guest').on('click', billingGuestHandler);
		$('#button-logout').on('click', logoutHandler);
        $('#button-ok').on('click', closeWindow);
		$('#form-login').on('submit', loginHandler);
		$('#form-register').on('submit', registerHandler);

        if (!$.cookie('shown_cookie_info')) {
            var $cookieBanner = $('#use_cookie');
            setTimeout(() => { $cookieBanner.modal({backdrop: 'static'}); }, 2000);
        }

        $.cookie('shown_cookie_info', true, {
          expires: 180,
          path: '/'
        });
	});

	function billingHandler(e) {
		e.preventDefault();
		window.location = pageInfo.url;
	}

	function billingGuestHandler(e) {
		e.preventDefault();
		window.location = pageInfo.url + '?func=logon';
	}

	function logoutHandler(e) {
		e.preventDefault();
		$.ajax({
			'url': pageInfo.url,
			'async': true,
			'data': 'func=logon&out=json',
			'xhrFields': {
				'withCredentials': true
			},
			'crossDomain': true
		}).success(successLogout)
		.error(errorLogout);
	}

	function successLogout(resp) {
		success(resp, 'logout');
	}

	function errorLogout(resp) {
		error('logout', 'Ошибка сети. Попробуйте снова.');
	}

	function loginHandler(e) {
		e.preventDefault();
		var params = $('#form-login').serialize();
		$.ajax({
			'url': pageInfo.url,
			'async': true,
			'data': params,
			'xhrFields': {
				'withCredentials': true
			},
			'crossDomain': true
		}).success(successLogin)
		.error(errorLogin);
	}

	function successLogin(resp) {
		success(resp, 'login');
	}

	function errorLogin(resp) {
		error('login', 'Ошибка сети. Попробуйте снова.');
	}

	function success(resp, name) {
		//login
		if (name === 'login' && resp.doc.auth) {
			$('.b-modal__close').trigger('click');
			$('#form-' + name + ' .b-form__error').removeClass('b-form__error_is_active');
			$('body').trigger('storeBasketForceUpdate');
		//register
		} if (name === 'register' && resp.doc.ok) {
			$('.b-modal__close').trigger('click');
			if (resp.doc.ok.$) {
				$.ajax({
					'url': pageInfo.url,
					'async': true,
					'data': resp.doc.ok.$,
					'xhrFields': {
						'withCredentials': true
					},
					'crossDomain': true
				}).success(function() {
					$('body').trigger('storeBasketForceUpdate');
				})
				.error(function() {});
			}
		} else if (name === 'logout' && resp.doc.loginform) {
			window.location.reload();
			$('body').trigger('storeBasketForceUpdate');
		} else if (resp.doc.error) {
			var msg = resp.doc.error.msg.$;
			error(name, msg);
		}
	}

	function error(name, msg) {
		$('#form-' + name + ' .b-form__error')
		.addClass('b-form__error_is_active')
		.html(msg);
	}

	function registerHandler(e) {
		e.preventDefault();
		var params = $('#form-register').serialize();
		$.ajax({
			'url': pageInfo.url,
			'async': true,
			'data': params,
			'xhrFields': {
				'withCredentials': true
			},
			'crossDomain': true
		}).success(successRegister)
		.error(errorRegister);
	}

	function successRegister(resp) {
		success(resp, 'register');
	}

	function errorRegister() {
		error('register', 'Ошибка сети. Попробуйте снова.');
	}

    function closeWindow() {
        $('.b-modal__close').trigger('click');
    }

})(window);
