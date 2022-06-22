import type { LinksFunction, ActionFunction } from '@remix-run/node';
import stylesUrl from '~/styles/login.css';
import { Link, useSearchParams } from '@remix-run/react';

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return 'That username is too short.';
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 6) {
    return 'That password is not long enough';
  }
}

export const links: LinksFunction = () => {
  return [{ href: stylesUrl, rel: 'stylesheet' }];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  const fields = { username, password };

  return {};
};

export default function Login() {
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                defaultChecked
                value="login"
              />{' '}
              Login
            </label>
            <label>
              <input type="radio" name="loginType" value="register" /> Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input type="text" id="username-input" name="username" />
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input type="password" name="password" id="password-input" />
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
