import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link, useParams } from '@remix-run/react';
import { db } from '~/utils/db.server';
import type {Joke} from '@prisma/client';

type LoaderData = {
  joke: Joke;
}

export const loader: LoaderFunction = async ({ params }) => {
  const { jokeId } = params;
  console.log(jokeId);
  const joke = await db.joke.findUnique({
    where: { id: jokeId },
  });
  if (!joke) throw new Error('joke not found!');
  const data: LoaderData = {joke};
  return json(data);
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
    </div>
  );
}
export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}