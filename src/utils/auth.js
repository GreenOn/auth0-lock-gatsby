import { Auth0Lock, Auth0LockPasswordless } from "auth0-lock"

const isBrowser = typeof window !== "undefined"
let params = {}
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
      title: "My App",
      enterpriseLoginIntructions: "Login using your organization or school email",
      unrecoverableError: 'Your admin maynot have setup Single-Sign-on for your organization.<br /> <a href="https://test-login.dynos.io">Click here to redirect to our default login.</a><br /> Or <a href="mailto:support@dynos.io"> Contact us </a>for any additional support.',
  },
  allowAutocomplete: true,
  theme:{
      primaryColor: '#002fa7'
  },
  allowedConnections: params.domain ? domainArr : ['google-oauth2','email']
}
let lock = isBrowser ? new Auth0LockPasswordless( `NEfeuai07t5BIyCI4F2d3iTHOK4LJPW1`, `staging-dynosio.auth0.com`, options ) : {}
if(isBrowser) {
  lock.on('authenticated', function(authResult) {
    createSessionCookie(authResult)
    redirect()
  });
  lock.on('authorization_error', function(err){
      lock = new Auth0Lock(`NEfeuai07t5BIyCI4F2d3iTHOK4LJPW1`, `staging-dynosio.auth0.com`, options)
      lock.show();
  })
}
function createSessionCookie(authResult) {
  console.log("Creating session cookie.")
  var v = "dyn_session="+authResult.idToken+";domain="+getDomain(window)+";expires="+getExpirationDate().toGMTString();
  console.log(v)
  document.cookie = v;      
}

function redirect() {
  if(typeof document !== `undefined`){
      document.location.href = "http://localhost:8000";
  }
}

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

  if (googleIdentity) {
    const expirationDate = new Date()
    expirationDate.setTime(expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000)
    if(typeof window !== `undefined` && typeof document !== `undefined`)
        document.cookie = `accessToken=${googleIdentity.access_token};domain=${getDomain(window)};expires="${expirationDate}`;
  }
}

export const login = () => {
  if (!isBrowser) {
    return 
  }
  lock.show();
}



