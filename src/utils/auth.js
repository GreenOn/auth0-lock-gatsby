import { Auth0Lock } from "auth0-lock"
const CLIENT_ID = process.env.AUTH0_CLIENTID
const CLIENT_DOMAIN = process.env.AUTH0_DOMAIN
const REDIRECT_URL = process.env.AUTH0_CALLBACK
const LOGIN_ENDPOINT = process.env.AUTH0_LOGIN_ENDPOINT

const isBrowser = typeof window !== "undefined"
let params = {};
let domainArr
const options = {
  passwordlessMethod: "link",              // Sets Lock to use magic link
  auth: {
    responseType: 'token id_token',
    params: {
      access_type: 'offline',
    },
  },
  languageDictionary: {
      emailInputPlaceholder: "something@youremail.com",
      title: "Dynos.io",
      enterpriseLoginIntructions: "Login using your organization or school email",
      unrecoverableError: 'Your admin maynot have setup Single-Sign-on for your organization.<br /> <a href="https://test-login.dynos.io">Click here to redirect to our default login.</a><br /> Or <a href="mailto:support@dynos.io"> Contact us </a>for any additional support.',
  },
  allowAutocomplete: true,
  theme:{
      logo: 'https://s3.us-east-2.amazonaws.com/dynos-misc/logoFB.png',
      primaryColor: '#002fa7'
  },
  allowedConnections: params.domain ? domainArr : ['google-oauth2','email']
}
if (params.domain){
  params.domain.replace("#","")
  domainArr = params.domain.split(" ")
}
let lock = isBrowser ? new Auth0Lock( CLIENT_ID, CLIENT_DOMAIN, options ) : {}
lock.on('authenticated', async function(authResult) {
  createSessionCookie(authResult)
  await setGoogleAccessTokenToCookie(authResult.idToken)
  redirect()
});
lock.on('authorization_error', async function(err){
  if(params.domain){
    params.domain = null;
    lock = new Auth0Lock(CLIENT_ID, CLIENT_DOMAIN, options)
    lock.show();
  }
})
async function setGoogleAccessTokenToCookie(idToken) {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      query: `
          query { userIdentity }
        `,
    }),
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': idToken,
    },
  })

  const { data: { userIdentity: { identities = [] } } } = await response.json()
  const googleIdentity = identities.find(({ provider }) => provider === 'google-oauth2')

  if (googleIdentity && isBrowser) {
    const expirationDate = new Date()
    expirationDate.setTime(expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000)
    if(typeof document !== `undefined`)
        document.cookie = `accessToken=${googleIdentity.access_token};domain=${getDomain(window)};expires="${expirationDate}`;
  }
}
function getExpirationDate() {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 999); // expire before JWT expires in 7 days
  return expirationDate
}
function createSessionCookie(authResult) {
  if(typeof window !== `undefined`){
    var v = "dyn_session="+authResult.idToken+";domain="+getDomain(window)+";expires="+getExpirationDate().toGMTString();
    document.cookie = v;      
  }
}
function getDomain(w) {
  const url = w.location.origin
  if (url.includes('localhost')) return 'localhost'
	return  getUrl(url)
}
function getUrl(url) {
  const splitUrl = url.split('.')
  const sliceUrl = splitUrl.slice(-2)
  const joinUrl = sliceUrl.join('.')
  const finalUrl = `.${joinUrl}`
  return finalUrl
}
function redirect() {
  if(typeof document !== `undefined`){
      document.location.href = REDIRECT_URL;
  }
  }
export const login = () => {
  if (!isBrowser) {
    return 
  }
  lock.show();
}



