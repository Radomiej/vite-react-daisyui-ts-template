import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { decrement, increment, incrementByAmount } from '../store/counterSlice';
import type { RootState } from '../../../app/store';

export function Counter() {
  const count = useAppSelector((state: RootState) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Licznik Redux</h2>
        <div className="flex items-center gap-4 my-4">
          <button 
            className="btn btn-primary"
            onClick={() => dispatch(decrement())}
            aria-label="Zmniejsz"
          >
            -
          </button>
          <span className="text-2xl font-bold">{count}</span>
          <button 
            className="btn btn-primary"
            onClick={() => dispatch(increment())}
            aria-label="Zwiększ"
          >
            +
          </button>
        </div>
        <div className="card-actions justify-end">
          <button 
            className="btn btn-secondary"
            onClick={() => dispatch(incrementByAmount(5))}
          >
            Dodaj 5
          </button>
        </div>
      </div>
    </div>
  );
}
