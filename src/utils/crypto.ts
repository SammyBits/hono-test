import argon2 = require("argon2");
const MEMORYCOST = 2 ** 18; // 256 MB
const ITERATIONS = 5;
const PARALLELISM = 2;

export const hashPasswordAsync = (password: string): Promise<string> => {
	return argon2.hash(password, {
		type: argon2.argon2i,
		timeCost: ITERATIONS,
		memoryCost: MEMORYCOST,
		parallelism: PARALLELISM,
	});
};

export const verifyPasswordAsync = (
	password: string,
	hash: string,
): Promise<boolean> => {
	return argon2.verify(password, hash);
};
