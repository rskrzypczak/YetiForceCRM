/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 * Contributor(s): YetiForce.com
 ************************************************************************************/

jQuery.Class('Install_Index_Js', {
	fieldsCached: ['db_hostname', 'db_username', 'db_name', 'create_db',
		'db_root_username', 'currency_name', 'firstname', 'lastname', 'admin_email',
		'dateformat', 'timezone'
	],
	checkUsername: function (field, rules, i, options) {
		var logins = JSON.parse(jQuery('#not_allowed_logins').val());
		if (jQuery.inArray(field.val(), logins) !== -1) {
			return app.vtranslate('LBL_INVALID_USERNAME_ERROR');
		}
	},
}, {
	registerEventForStep1: function () {
		jQuery('.bt_install').on('click', function (e) {
			jQuery('input[name="mode"]').val('step2');
			jQuery('form[name="step1"]').submit();
		});
		jQuery('.bt_migrate').on('click', function (e) {
			jQuery('input[name="mode"]').val('mStep0');
			jQuery('form[name="step1"]').submit();
		});
	},
	registerEventForStep2: function () {
		let modalContainer = $('.js-license-modal');
		modalContainer.on('shown.bs.modal', function (e) {
			app.registerDataTables(modalContainer.find('.js-data-table'), {
				lengthMenu: [[10, 25, 50, -1], [10, 25, 50, app.vtranslate("JS_ALL")]]
			});
		});
	},
	registerEventForStep3: function () {
		$('#recheck').on('click', function () {
			window.location.reload();
		});
		let elements = jQuery('.js-wrong-status');
		$('.js-confirm').on('submit', function (e) {
			if (elements.length > 0) {
				e.preventDefault();
				app.showConfirmModal(app.vtranslate('LBL_PHP_WARNING')).done(function (data) {
					if (data) {
						elements = false;
						$('form[name="step3"]').submit();
						return;
					}
				});
			}
		});
	},
	checkPwdEvent: function () {
		var thisInstance = this;
		jQuery('input[name="password"]').on('blur', function () {
			thisInstance.checkPwd(jQuery(this).val());
		});
	},
	checkPwd: function (pass) {
		var error = false;

		if (pass.length < 8) {
			jQuery('#passwordError').html(app.vtranslate('LBL_PASS_TO_SHORT'));
			error = true;
		} else if (pass.length > 32) {
			jQuery('#passwordError').html(app.vtranslate('LBL_PASS_TO_LONG'));
			error = true;
		} else if (pass.search(/\d/) == -1) {
			jQuery('#passwordError').html(app.vtranslate('LBL_PASS_NO_NUM'));
			error = true;
		} else if (pass.search(/[A-Z]/) == -1) {
			jQuery('#passwordError').html(app.vtranslate('LBL_PASS_LACK_OF_CAPITAL_LETTERS'));
			error = true;
		} else if (pass.search(/[a-z]/) == -1) {
			jQuery('#passwordError').html(app.vtranslate('LBL_PASS_LACK_OF_LOWERCASE_LETTERS'));
			error = true;
		}

		return error;
	},
	registerEventForStep4: function () {
		var config = JSON.parse(localStorage.getItem('yetiforce_install'));
		Install_Index_Js.fieldsCached.forEach(function (field) {
			if (config && typeof config[field] !== 'undefined') {
				var formField = jQuery('[name="' + field + '"]');
				if ('SELECT' == jQuery(formField).prop('tagName')) {
					jQuery(formField).val(config[field]);
					jQuery(formField).select2('destroy');
					App.Fields.Picklist.showSelect2ElementView(jQuery(formField));
				} else if ('INPUT' == jQuery(formField).prop('tagName') && 'checkbox' == jQuery(formField).attr('type')) {
					if (true == config[field]) {
						jQuery(formField).prop('checked', true);
						jQuery('.config-table tr.d-none').removeClass('d-none');
					}
				} else {
					jQuery(formField).val(config[field]);
				}
			}
		});
		var thisInstance = this;
		jQuery('input[name="create_db"]').on('click', function () {
			var userName = jQuery('#root_user');
			var password = jQuery('#root_password');
			if (jQuery(this).is(':checked')) {
				userName.removeClass('d-none');
				password.removeClass('d-none');
			} else {
				userName.addClass('d-none');
				password.addClass('d-none');
			}
		});

		function clearPasswordError() {
			jQuery('#passwordError').html('');
		}

		function setPasswordError() {
			jQuery('#passwordError').html(app.vtranslate('LBL_PASS_REENTER_ERROR'));
		}

		jQuery('input[name="retype_password"]').on('blur', function (e) {
			var element = jQuery(e.currentTarget);
			var password = jQuery('input[name="password"]').val();
			if (password !== element.val()) {
				setPasswordError();
			}
		});

		jQuery('input[name="password"]').on('blur', function (e) {
			var retypePassword = jQuery('input[name="retype_password"]');
			if (retypePassword.val() != '' && retypePassword.val() !== jQuery(e.currentTarget).val()) {
				jQuery('#passwordError').html(app.vtranslate('LBL_PASS_REENTER_ERROR'));
			} else {
				clearPasswordError();
			}
		});

		jQuery('input[name="retype_password"]').on('keypress', function (e) {
			clearPasswordError();
		});

		jQuery('input[name="step5"]').on('click', function () {
			var error = false;
			var validateFieldNames = ['db_hostname', 'db_username', 'db_name', 'password', 'retype_password', 'lastname', 'admin_email'];
			for (var fieldName in validateFieldNames) {
				var field = jQuery('input[name="' + validateFieldNames[fieldName] + '"]');
				if (field.val() == '') {
					field.addClass('error').focus();
					error = true;
					break;
				} else {
					field.removeClass('error');
				}
			}

			var createDatabase = jQuery('input[name="create_db"]:checked');
			if (createDatabase.length > 0) {
				var dbRootUser = jQuery('input[name="db_root_username"]');
				if (dbRootUser.val() == '') {
					dbRootUser.addClass('error').focus();
					error = true;
				} else {
					dbRootUser.removeClass('error');
				}
			}
			var password = jQuery('#passwordError');
			if (password.html().trim())
				error = true;

			var emailField = jQuery('input[name="admin_email"]');
			var invalidEmailAddress = false;
			var regex = /^[_/a-zA-Z0-9*]+([!"#$%&'()*+,./:;<=>?\^_`{|}~-]?[a-zA-Z0-9/_/-])*@[a-zA-Z0-9]+([\_\-\.]?[a-zA-Z0-9]+)*\.([\-\_]?[a-zA-Z0-9])+(\.?[a-zA-Z0-9]+)?$/;
			if (!regex.test(emailField.val()) && emailField.val() != '') {
				invalidEmailAddress = true;
				emailField.addClass('error').focus();
				error = true;
			} else {
				emailField.removeClass('error');
			}

			var checkPwdError = false;
			checkPwdError = thisInstance.checkPwd(jQuery('input[name="password"]').val());

			if (checkPwdError) {
				error = true;
			}

			if (error) {
				var content;
				if (invalidEmailAddress) {
					content = '<div class="span12">' +
						'<div class="alert alert-error">' +
						'<button class="close" data-dismiss="alert" type="button">x</button>' +
						jQuery('[name="invalidEmailError"]').val() +
						'</div>' +
						'</div>';
				} else {
					if (checkPwdError) {
						content = '<div class="span12">' +
							'<div class="alert alert-error">' +
							'<button class="close" data-dismiss="alert" type="button">x</button>' +
							jQuery('[name="insufficientlyStrongPassword"]').val() +
							'</div>' +
							'</div>';
					} else {
						content = '<div class="span12">' +
							'<div class="alert alert-error">' +
							'<button class="close" data-dismiss="alert" type="button">x</button>' +
							app.vtranslate('LBL_MANDATORY_FIELDS_ERROR') +
							'</div>' +
							'</div>';
					}
				}
				jQuery('#errorMessage').html(content).show();
			} else {
				var config = {
					db_hostname: document.step4.db_hostname.value,
					db_username: document.step4.db_username.value,
					db_name: document.step4.db_name.value,
					create_db: jQuery('[name="create_db"]').prop('checked'),
					db_root_username: document.step4.db_root_username.value,
					currency_name: document.step4.currency_name.value,
					firstname: document.step4.firstname.value,
					lastname: document.step4.lastname.value,
					admin_email: document.step4.admin_email.value,
					dateformat: document.step4.dateformat.value,
					timezone: document.step4.timezone.value
				};
				window.localStorage.setItem('yetiforce_install', JSON.stringify(config));
				jQuery('form[name="step4"]').submit();
			}
		});
		this.checkPwdEvent();

	},
	registerEventForStep5: function () {
		jQuery('input[name="step6"]').on('click', function () {
			var error = jQuery('#errorMessage');
			if (error.length) {
				app.showAlert(app.vtranslate('LBL_RESOLVE_ERROR'));
				return false;
			} else {
				jQuery('#progressIndicator').removeClass('d-none');
				jQuery('form[name="step5"]').submit().hide();
			}
		});
	},
	registerEventForStep6: function () {
		jQuery('input[name="step7"]').on('click', function () {
			if ($('form[name="step6"]').validationEngine('validate')) {
				jQuery('#progressIndicator').show().removeClass('d-none');
				jQuery('form[name="step6"]').submit().parent().hide();
			}
		});
	},
	registerEventForMigration: function () {
		var step = jQuery('input[name="mode"]').val();
		if (step == 'mStep3') {
			jQuery('form').on('submit', function () {
				jQuery('#progressIndicator').show();
				jQuery('#mainContainer').hide();
			});
		}
	},
	changeLanguage: function (e) {
		jQuery('input[name="mode"]').val('step1');
		jQuery('form[name="step1"]').submit();
	},
	registerEvents: function () {
		jQuery('input[name="back"]').on('click', function () {
			var createDatabase = jQuery('input[name="create_db"]:checked');
			if (createDatabase.length > 0) {
				jQuery('input[name="create_db"]').removeAttr('checked');
			}
			window.history.back();
		});
		jQuery('form').validationEngine(app.validationEngineOptions);
		this.registerEventForStep1();
		this.registerEventForStep2();
		this.registerEventForStep3();
		this.registerEventForStep4();
		this.registerEventForStep5();
		this.registerEventForStep6();
		this.registerEventForMigration();
		$('select[name="lang"]').on('change', this.changeLanguage);
	}
});
jQuery(document).ready(function () {
	var install = new Install_Index_Js();
	install.registerEvents();
});
