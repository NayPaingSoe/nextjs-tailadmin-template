'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { increment, decrement } from '@/store/features/counter/counterSlice';
import { Button } from '../ui/button';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Counter</h2>
      <div>
        <Button onClick={() => dispatch(increment())}>Increment</Button>
        <span>{count}</span>
        <Button onClick={() => dispatch(decrement())}>Decrement</Button>
      </div>
    </div>
  );
};

export default Counter;
