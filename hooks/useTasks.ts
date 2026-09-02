import { useState } from 'react';

export const useTasks = () => {
  const addTask = (task: any) => {
    console.log('Task saved locally:', task);
  };
  
  return { addTask };
};
