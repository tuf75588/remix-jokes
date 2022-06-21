import { json, redirect } from '@remix-run/node';
import { db } from '~/utils/db.server';
import type { ActionFunction } from '@remix-run/node';

function validateName(name: string) {
  if (name.length < 3) {
    return 'That name is too short.';
  }
}

function validateContent(content: string) {
  if (content.length < 10) {
    return 'That joke is too short.';
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};
const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get('name');
  const content = form.get('content');

  if (typeof name !== 'string' || typeof content !== 'string') {
    return badRequest({ formError: 'Form not submitted correctly' });
  }
  const fieldErrors = {
    name: validateName(name),
    content: validateContent(content),
  };
  const fields = { name, content };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method='post'>
        <div>
          <label>
            Name: <input type='text' name='name' />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name='content' />
          </label>
        </div>
        <div>
          <button type='submit' className='button'>
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
