import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import * as browser from 'webextension-polyfill';
import * as $ from 'jquery';
import Config from '../scripts/Config';
import Translator from '../scripts/Translator';

// Extension configuration
const config = new Config();

function initPopups() {
	// popups for Storage setting input fields
	$('#host')
		.popover({
			title: Translator.getTranslationByKey('options_memfiredb_db_host_popup_title'),
			html: true,
			content: `${Translator.getTranslationByKey(
				'options_memfiredb_db_host_popup_content'
			)} <br /> <a href="https://memfiredb.com">memfiredb.com</a>`,
			placement: 'bottom',
		})
		.blur(function () {
			$(this).popover('hide');
		});

	$('#restUrl')
		.popover({
			title: Translator.getTranslationByKey('options_rest_url_popup_title'),
			html: true,
			content: Translator.getTranslationByKey('options_rest_url_popup_content'),
			placement: 'bottom',
		})
		.blur(function () {
			$(this).popover('hide');
		});
}

function initConfigSwitch() {
	// switch between configuration types
	$('select[name=storageType]').change(function () {
		let type = $(this).val();
		if (type === 'memfiredb') {
			$('.form-group.memfiredb').show();
			$('.form-group.rest').hide();
		} else if (type === 'rest') {
			$('.form-group.rest').show();
			$('.form-group.memfiredb').hide();
		} else {
			$('.form-group.rest').hide();
			$('.form-group.memfiredb').hide();
		}
	});
}

function initConfig() {
	// load previously synced data
	config.loadConfiguration().then(() => {
		$('#storageType').val(config.storageType);
		$('#host').val(config.host);
		$('#port').val(config.port);
		$('#dbname').val(config.dbname);
		$('#username').val(config.username);
		$('#passwd').val(config.passwd);
		$('#restUrl').val(config.restUrl);
		$('select[name=storageType]').change();
	});
}

function initFormSubmit() {
	// Sync storage settings
	$('form#storage_configuration').submit(() => {
		const storageType = $('#storageType').val();
		const newConfig = {
			storageType,

			host: '',
			port: '',
			dbname: '',
			username: '',
			passwd: '',

			sitemapDb: '',
			restUrl: '',
		};

		if (storageType === 'memfiredb') {
			newConfig.host = $('#host').val();
			newConfig.port = $('#port').val();
			newConfig.dbname = $('#dbname').val();
			newConfig.username = $('#username').val();
			newConfig.passwd = $('#passwd').val();
		} else if (storageType === 'rest') {
			newConfig.restUrl = $('#restUrl').val();
		}

		config
			.updateConfiguration(newConfig)
			.then(() => {
				$('.alert')
					.attr('id', 'success')
					.text(Translator.getTranslationByKey('options_successfully_updated'))
					.show();
				Translator.translatePage();
			})
			.catch(error => {
				console.error(error);
				$('.alert')
					.attr('id', 'error')
					.text(Translator.getTranslationByKey('options_error_updating'))
					.show();
			});

		return false;
	});
}

$(() => {
	initPopups();
	initConfigSwitch();
	initConfig();
	initFormSubmit();
	Translator.translatePage();
});
