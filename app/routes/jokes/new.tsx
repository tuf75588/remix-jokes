import { redirect } from "@remix-run/node";


export async function action({request}: any) {
  const body = await request.formData();
  const inputName = body.get('name');
  const inputContent = body.get('content');
  console.log(inputName, inputContent);
  return redirect('/jokes')
}


export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
