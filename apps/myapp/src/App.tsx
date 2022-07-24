import { createSignal, onCleanup, createEffect, batch, For } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';
import styles from './App.module.css';

type TodoItem = {
  title: string;
  done: boolean;
};

function createLocalStore<T extends object>(
  name: string,
  init: T
): [Store<T>, SetStoreFunction<T>] {
  const localState = localStorage.getItem(name);
  const [state, setState] = createStore<T>(
    localState ? JSON.parse(localState) : init
  );

  createEffect(() => localStorage.setItem(name, JSON.stringify(state)));

  return [state, setState];
}

function removeIndex<T>(array: readonly T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

function App() {
  const [count, setCount] = createSignal(0);
  const interval = setInterval(() => setCount((c) => c + 1), 1000);
  const [newTitle, setTitle] = createSignal('');
  const [todos, setTodos] = createLocalStore<TodoItem[]>('todos', []);

  const addTodo = (e: SubmitEvent) => {
    e.preventDefault();
    batch(() => {
      setTodos(todos.length, {
        title: newTitle(),
        done: false,
      });

      setTitle('');
    });
  };

  onCleanup(() => clearInterval(interval));

  return (
    <div class={styles.App}>
      <section>
        <h2>Counter</h2>
        <div>Count value is {count()}</div>
      </section>
      <section>
        <h2>Todos</h2>
        <form onSubmit={addTodo}>
          <input
            type="text"
            placeholder="Enter todo and click +"
            required
            value={newTitle()}
            onInput={(e) => setTitle(e.currentTarget.value)}
          />
          <button>+</button>
        </form>
        <For each={todos}>
          {(todo, i) => (
            <div>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={(e) => setTodos(i(), 'done', e.currentTarget.checked)}
              />
              <input
                type="text"
                value={todo.title}
                onChange={(e) => setTodos(i(), 'title', e.currentTarget.value)}
              />
              <button onClick={() => setTodos((t) => removeIndex(t, i()))}>
                x
              </button>
            </div>
          )}
        </For>
      </section>
    </div>
  );
}

export default App;
