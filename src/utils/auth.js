import { Auth0Lock, Auth0LockPasswordless } from "auth0-lock"
const CLIENT_ID = process.env.AUTH0_CLIENTID
const CLIENT_DOMAIN = process.env.AUTH0_DOMAIN
const REDIRECT_URL = process.env.AUTH0_CALLBACK

const isBrowser = typeof window !== "undefined"
const options = {
  passwordlessMethod: "link",              // Sets Lock to use magic link
  auth: {
    responseType: 'token id_token',
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
}
let lock = isBrowser ? new Auth0LockPasswordless( CLIENT_ID, CLIENT_DOMAIN, options ) : {}
if(isBrowser) {
  lock.on('authenticated', function(authResult) {
    redirect()
  });
  lock.on('authorization_error', function(err){
      lock = new Auth0Lock(CLIENT_ID, CLIENT_DOMAIN, options)
      lock.show();
  })
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



