const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  console.log("el token es:",token);

  return token;
};

export default cookieExtractor;
