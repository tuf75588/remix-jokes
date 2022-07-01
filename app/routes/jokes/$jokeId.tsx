import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, Link, useParams, useCatch } from '@remix-run/react';
import { db } from '~/utils/db.server';
import type { Joke } from '@prisma/client';
import { getUserId, requireUserId } from '~/utils/session.server';
import { JokeDisplay } from '~/components/joke';
type LoaderData = {
  joke: Joke;
  isOwner: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { jokeId } = params;
  const userId = await getUserId(request);
  console.log(jokeId);
  const joke = await db.joke.findUnique({
    where: { id: jokeId },
  });
  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    });
  }
  const data: LoaderData = {
    joke,
    isOwner: userId === joke.jokesterId,
  };
  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const method = form.get('_method');

  if (method !== 'delete') {
    throw new Response(`the _method ${method} is not supported`, {
      status: 400,
    });
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) {
    throw new Response("Can't delete what does not exist.", {
      status: 404,
    });
  }
  // @ts-ignore
  if (joke.jokesterId !== userId) {
    throw new Response(`Nice try.  That's not your joke to delete`);
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect('/jokes');
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  return <JokeDisplay joke={data.joke} isOwner={data.isOwner} />;
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 400: {
      return <div className="error-container">What you're doing is not allowed.</div>;
    }
    case 404: {
      return <div className="error-container">Huh? What the heck is {params.jokeId}</div>;
    }
    case 401: {
      return <div className="error-container">Sorry but {params.jokeId} is not your joke.</div>;
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>;
}
