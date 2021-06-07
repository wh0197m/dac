import * as browser from 'webextension-polyfill';

export default class Config {
	constructor() {
		this.host = '<use loadConfiguration()>';
		this.port = '<use loadConfiguration()>';
		this.dbname = '<use loadConfiguration()>';
		this.username = '<use loadConfiguration()>';
		this.passwd = '<use loadConfiguration()>';

		this.sitemapDb = '<use loadConfiguration()>';
		this.restUrl = '<use loadConfiguration()>';
		this.locale = '<use loadConfiguration()>';
		this.defaults = {
			storageType: 'local',
			// this is where sitemap documents are stored
			sitemapDb: 'scraper-sitemaps',

			host: '',
			port: '',
			dbname: '',
			username: '',
			passwd: '',

			dataDb: '',
			restUrl: '',
			locale: 'zh_CN',
		};
	}

	/**
	 * Loads configuration from chrome extension sync storage
	 */
	loadConfiguration(callback) {
		return new Promise(resolve => {
			browser.storage.sync
				.get(['host', 'port', 'dbname', 'username', 'passwd', 'storageType', 'restUrl', 'locale'])
				.then(
					function (items) {
						this.storageType = items.storageType || this.defaults.storageType;
						this.locale = items.locale || this.defaults.locale;
						this.sitemapDb = this.defaults.sitemapDb;
						this.host = this.defaults.host;
						this.port = this.defaults.port;
						this.dbname = this.defaults.dbname;
						this.username = this.defaults.username;
						this.passwd = this.defaults.passwd;
						this.restUrl = this.defaults.restUrl;

						if (this.storageType === 'memfiredb') {
							this.host = items.host || this.defaults.host;
							this.port = items.port || this.defaults.port;
							this.dbname = items.dbname || this.defaults.dbname;
							this.username = items.username || this.defaults.username;
							this.passwd = items.passwd || this.defaults.passwd;
						} else if (this.storageType === 'rest') {
							this.restUrl = items.restUrl || this.defaults.restUrl;
						}
						resolve();
					}.bind(this)
				);
		});
	}

	/**
	 * Saves configuration to chrome extension sync storage
	 * @param {type} items
	 * @returns {Promise<void>} Promise
	 */
	updateConfiguration(items) {
		return browser.storage.sync.set(items);
	}
}
