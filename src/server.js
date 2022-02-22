import express from "express";

export const app = express();


export const start = () => {
	try {
		app.listen(3000, () => {
			console.log(`API on localhost:3000/api`);
		})
	} catch(e) {
			console.error(e);
	}
}
