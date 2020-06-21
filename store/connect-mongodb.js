this.client = new MongoClient(this.connStr, this.settings);
		return this.client.connect()
			.then(() => {
				logger.info(`Mongodb connected to ${this.connStr}`);
				this.db = client.db(this.options.dbName);
			});
