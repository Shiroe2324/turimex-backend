async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

function passwordManager() {
  return {
    hashPassword,
    verifyPassword,
  };
}

export default passwordManager;
