import { useDebounce } from '@/hooks/useDebounce';
import { useTaskStore } from '@/store/taskStore';
import { useEffect, useState, type ChangeEvent } from 'react';

export const TaskSearch = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const fetchTasks = useTaskStore(s => s.fetchTasks);

  useEffect(() => {
    const id = Number(debouncedQuery);
    fetchTasks(id);
  }, [debouncedQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setQuery(onlyDigits);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Введите ID задачи"
        className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:border-gray-500"
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};
