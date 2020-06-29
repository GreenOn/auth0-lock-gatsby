import { Auth0Lock, Auth0LockPasswordless } from "auth0-lock"

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
let lock = isBrowser ? new Auth0LockPasswordless( `kcmqY88kyS2IYFquoscBgIIy4LRUh6me`, `dev-nseui4sk.us.auth0.com`, options ) : {}
if(isBrowser) {
  lock.on('authenticated', function(authResult) {
    redirect()
  });
  lock.on('authorization_error', function(err){
      lock = new Auth0Lock(`kcmqY88kyS2IYFquoscBgIIy4LRUh6me`, `dev-nseui4sk.us.auth0.com`, options)
      lock.show();
  })
}
function redirect() {
  if(typeof document !== `undefined`){
      document.location.href = "http://localhost:8000";
  }
}
export const login = () => {
  if (!isBrowser) {
    return 
  }
  lock.show();
}



