import "./Task.css";

const Task = ({ taskText, onClick }) => {
  return (
    <div>
      <div className="flex mb-4 items-center">
        <p className="w-full text-grey-darkest">{taskText}</p>
        <button className="flex-no-shrink p-2 ml-2 border-2 rounded text-red-500 border-red-500 hover:text-white hover:bg-red-600" onClick={onClick}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default Task;
