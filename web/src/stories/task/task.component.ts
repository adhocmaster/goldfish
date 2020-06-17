import React from 'react';


interface TaskInterface {
    id: Number,
    title: string,
    state: string
}
export default function Task({ task: TaskInterface, onArchiveTask, onPinTask }) {
    return (
      <div className="list-item">
        <input type="text" value={title} readOnly={true} />
      </div>
    );
  }