import { TaskGraph } from './components/TaskGraph';
import { TaskSearch } from './components/TaskSearch';
import { useTaskStore } from './store/taskStore';

function App() {
  const { data, loading, error } = useTaskStore();

  return (
    <div className="flex flex-col gap-4 p-4">
      <TaskSearch />

      {loading && <div>Загрузка…</div>}
      {error && !loading && <div className="text-red-600">{error}</div>}

      {!loading && !error && data && <TaskGraph data={data} />}
    </div>
  );
}

export default App;
