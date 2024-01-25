const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "localhost";
const port = 3000;

http.createServer((req, res) => {
	const { url, method } = req;
	switch (method) {
		case "GET":
			fs.readFile(
				path.join(__dirname, `data/${url}.json`),
				"utf8",
				(err, data) => {
					if (err) {
						res.writeHead(404);
						res.end("not found");
						return;
					}
					res.writeHead(200, {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
						'Access-Control-Max-Age': 2592000, // 30 days
					});
					setTimeout(() => {
						res.end(data);
					}, 1000);

				}
			);
			break;
		case "POST":
			if (url !== "/transfer") {
				res.writeHead(404);
				res.end("not found");
				return;
			}
			const chunks = [];

			req.on("data", (chunk) => {
				chunks.push(chunk);
			});

			req.on("end", () => {
				const body = Buffer.concat(chunks);
				if (body === null) {
					res.writeHead(400);
					res.end("bad request");
					return;
				}
				try {
					JSON.parse(body);
				} catch (error) {
					res.writeHead(400);
					res.end("bad request");
					return;
				}
				const transfer = JSON.parse(body);
				const mandatoryFields = ["from", "to", "amount"];
				const missingFields = mandatoryFields.filter(
					(field) => transfer[field] === undefined
				);
				if (missingFields.length > 0) {
					res.writeHead(422);
					res.end("some fields are missing");
					return;
				}

				transfer.date = new Date().toISOString();
				const fileAccount = JSON.parse(
					fs.readFileSync(path.join(__dirname, "data/accounts.json"), "utf8")
				);
				const fromAccount = fileAccount.accounts.find(
					(account) => account.accountNumber === transfer.from
				);
				const toAccount = fileAccount.accounts.find(
					(account) => account.accountNumber === transfer.to
				);
				if (
					fromAccount === undefined ||
					toAccount === undefined ||
					fromAccount.accountNumber === toAccount.accountNumber ||
					transfer.amount <= 0
				) {
					res.writeHead(400);
					res.end("bad request");
					return;
				}
				if (parseFloat(fromAccount.balance) < parseFloat(transfer.amount)) {
					const message = 'insufficient funds'
					res.writeHead(422, {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					});
					res.end(
						JSON.stringify({
							message
						})
					);
					return;
				}
				fileAccount.accounts.forEach((account) => {
					if (account.accountNumber === fromAccount.accountNumber) {
						account.balance -= parseFloat(transfer.amount);
					}
					if (account.accountNumber === toAccount.accountNumber) {
						account.balance += parseFloat(transfer.amount);
					}
				});

				fs.writeFileSync(
					path.join(__dirname, "data/accounts.json"),
					JSON.stringify(fileAccount),
					(err) => {
						if (err) {
							res.writeHead(500);
							res.end("internal server error");
							return;
						}
					}
				);

				fs.readFile(
					path.join(__dirname, "data/transactions.json"),
					"utf8",
					(err, data) => {
						if (err) {
							res.writeHead(500);
							res.end("internal server error");
							return;
						}
						const file = JSON.parse(data);
						file.transactions.push(transfer);
						file.transactions.forEach((element, index) => {
							element.id = index + 1;
						});
						fs.writeFile(
							path.join(__dirname, "data/transactions.json"),
							JSON.stringify(file),
							(err) => {
								if (err) {
									res.writeHead(500);
									res.end("internal server error");
									return;
								}
								res.writeHead(200, {
									"Content-Type": "application/json",
									"Access-Control-Allow-Origin": "*",
								});
								setTimeout(() => {
									res.end(
										JSON.stringify({
											message: 'ok'
										})
									);
								}, 1000);
							}
						);
					}
				);
			});
			break;
		default:
			res.writeHead(404);
			res.end("not found");
	}
}).listen(port, host, `server running at http://${host}:${port}`);
