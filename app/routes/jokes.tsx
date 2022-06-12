import { Outlet } from '@remix-run/react';

export default function JokesRoute() {
  return (
    <div>
      <h1>J🤣KES</h1>
      <hr />
      <Outlet />
    </div>
  );
}
