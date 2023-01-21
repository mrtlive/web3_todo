import React, { useState, useEffect } from "react";
import Task from "./Task";
import { TaskContractAddress } from "./config.js";
import { ethers } from "ethers";
import TaskAbi from "./utils/TaskContract.json";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(TaskContractAddress, TaskAbi.abi, signer);

        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      const goerliChainId = "0x5";

      if (chainId !== goerliChainId) {
        alert("Please change your network to goerli testnet !");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllTasks();
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(TaskContractAddress, TaskAbi.abi, signer);

        TaskContract.addTask(task.taskText, task.isDeleted)
          .then((response) => {
            setTasks([...tasks, task]);
            console.log("Completed Task");
          })
          .catch((err) => {
            console.log("Error occured while adding a new task");
          });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }

    setInput("");
  };

  const deleteTask = (key) => async () => {
    console.log(key);

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(TaskContractAddress, TaskAbi.abi, signer);

        let deleteTaskTx = await TaskContract.deleteTask(key, true);
        console.log(deleteTaskTx);
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
        getAllTasks();
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {currentAccount === "" ? (
        <div className="container mx-auto flex justify-center p-5">
          <button
            className="text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      ) : correctNetwork ? (
        <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
          <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
            <div className="mb-4">
              <h1 className=" text-gray-500 text-5xl text-center">Todo List</h1>
              <div className="flex mt-4">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                  placeholder="Add Todo"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  className="flex-no-shrink p-2 border-2 rounded font-bold bg-green-500 text-teal border-teal hover:text-white hover:bg-teal-500"
                  onClick={addTask}
                >
                  Add
                </button>
              </div>
            </div>
            {tasks.map((item) => (
              <Task key={item.id} taskText={item.taskText} onClick={deleteTask(item.id)} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>----------------------------------------</div>
          <div>Please connect to the goerli Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
    </>
  );
}

export default App;
