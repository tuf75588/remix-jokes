import type { LoaderFunction } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { json } from '@remix-run/node';
import type { Joke } from '@prisma/client';
import { Link, useLoaderData } from '@remix-run/react';

type LoaderData = {
  randomJoke: Joke;
};

export function ErrorBoundary() {
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomNumber,
  });
  const data: LoaderData = { randomJoke };

  return json(data);
};

export default function Jokes() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}

