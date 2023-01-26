import { type NextPage } from "next";
import Head from "next/head";
import { CheckIcon, StarIcon, TrashIcon } from "@heroicons/react/24/solid";

import { api } from "../utils/api";
import { useState } from "react";
import type { ShowFilterTypes } from "../server/api/routers/todos";

const Home: NextPage = () => {
  const ctx = api.useContext();
  const [value, setValue] = useState("");
  const [showFilter, setShowFilter] = useState<ShowFilterTypes>(undefined);

  const { mutate } = api.todos.add.useMutation({
    onSuccess: () => ctx.todos.getAllTodos.invalidate(),
  });

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (value) {
      mutate({ description: value });
      setValue("");
    }
  };

  return (
    <>
      <Head>
        <title>Todo Test</title>
        <meta name="description" content="Making a todo app with T3Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            CRIANDO <span className="text-[hsl(280,100%,70%)]">COISINHOS</span>
          </h1>

          <section className="">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-center gap-6">
                <input
                  name="todo"
                  type="text"
                  className="rounded-lg p-4"
                  placeholder="Eu preciso..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <button className="flex w-28 items-center justify-center rounded-lg bg-indigo-600 p-4 text-white transition hover:bg-indigo-500">
                  Adicionar
                </button>
              </div>
            </form>

            <div className="my-6 flex items-center justify-end gap-6">
              <button
                className={`flex w-28 items-center justify-center rounded-lg p-4 text-white transition ${
                  showFilter === "FAVORITED" ? "bg-yellow-500" : "bg-indigo-600"
                }`}
                onClick={() => setShowFilter("FAVORITED")}
              >
                Favoritos
              </button>
              <button
                className={`flex w-28 items-center justify-center rounded-lg p-4 text-white transition ${
                  showFilter === "COMPLETED" ? "bg-green-500" : "bg-indigo-600"
                }`}
                onClick={() => setShowFilter("COMPLETED")}
              >
                Completados
              </button>
              <button
                className={`flex w-28 items-center justify-center rounded-lg p-4 text-white transition ${
                  showFilter === undefined ? "bg-fuchsia-500" : "bg-indigo-600"
                }`}
                onClick={() => setShowFilter(undefined)}
              >
                Todos
              </button>
            </div>
          </section>

          <ShowTodos showFilter={showFilter} />
        </div>
      </main>
    </>
  );
};

export default Home;

type ShowTodosProps = {
  showFilter?: ShowFilterTypes;
};

const ShowTodos = ({ showFilter }: ShowTodosProps) => {
  const ctx = api.useContext();

  const { data, isLoading } = api.todos.getAllTodos.useQuery();

  const { mutate: mutateDelete } = api.todos.delete.useMutation({
    onSuccess: () => ctx.todos.getAllTodos.invalidate(),
  });

  const { mutate: mutateFavorite } = api.todos.favorite.useMutation({
    onSuccess: () => ctx.todos.getAllTodos.invalidate(),
  });

  const { mutate: mutateComplete } = api.todos.complete.useMutation({
    onSuccess: () => ctx.todos.getAllTodos.invalidate(),
  });

  const filteredData = data?.filter((todo) => {
    if (!showFilter) {
      return todo;
    }

    const filterMapping = {
      COMPLETED: todo.completed,
      FAVORITED: todo.favorite,
    };

    return filterMapping[showFilter];
  });

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-8/12">
      {isLoading && (
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          <span className="text-[hsl(280,100%,70%)]">CARREGANDO</span>
        </h1>
      )}
      {filteredData &&
        filteredData.map((todo) => (
          <div
            className="h12 flex w-full items-center justify-between rounded border-2 border-solid border-indigo-600 p-6 text-lg text-white"
            key={todo.id}
          >
            {todo.description}
            <div className="flex cursor-pointer gap-2">
              <CheckIcon
                className={`h-6 w-6 ${
                  todo.completed ? "fill-green-500" : "fill-white"
                } transition`}
                onClick={() => {
                  mutateComplete({ id: todo.id, completed: todo.completed });
                }}
              />
              <StarIcon
                className={`h-6 w-6 ${
                  todo.favorite ? "fill-yellow-500" : "fill-white"
                } transition`}
                onClick={() => {
                  mutateFavorite({ id: todo.id, favorite: todo.favorite });
                }}
              />
              <TrashIcon
                className="h-6 w-6"
                onClick={() => {
                  mutateDelete({ id: todo.id });
                }}
              />
            </div>
          </div>
        ))}
    </div>
  );
};
