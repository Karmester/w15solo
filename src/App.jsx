import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [authUsername, setAuthUsername] = useState("");
	const [authPassword, setAuthPassword] = useState("");
	const [todo, setTodo] = useState("");
	const [page, setPage] = useState("reg");

	const signup = async () => {
		try {
			const response = await axios.post("http://localhost:4000/api/signup", {
				username,
				password,
			});
			setPassword("");
			setUsername("");
			setPage("log");
			alert("yay");
		} catch (e) {
			if (e.response.status === 400) {
				alert("missing credentials");
			} else if (e.response.status === 409) {
				alert("username taken");
			}
		}
	};

	const createTodo = async () => {
		try {
			const response = await axios.post(
				"http://localhost:4000/api/todo",
				{
					msg: todo,
				},
				{
					headers: {
						Authorization: authUsername + "&&&" + authPassword,
					},
				}
			);
			setTodo("");
			alert("todo created");
		} catch (e) {
			alert("error");
		}
	};

	const login = async () => {
		try {
			const response = await axios.post(
				"http://localhost:4000/api/login",
				{},
				{
					headers: {
						Authorization: authUsername + "&&&" + authPassword,
					},
				}
			);
			localStorage.setItem("user", authUsername);
			localStorage.setItem("password", authPassword);
			setPage("todo");
		} catch (e) {
			alert("wrong username or password");
		}
	};

	useEffect(() => {
		if (localStorage.getItem("user")) {
			setPage("todo");
			setAuthUsername(localStorage.getItem("user"));
			setAuthPassword(localStorage.getItem("password"));
		}
	}, []);

	return (
		<div className="App">
			{page == "reg" && (
				<div className="card">
					<h1>Registration</h1>
					<input
						type="text"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
					/>
					<input
						type="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
					<button onClick={(e) => signup()}>Sign up!</button>
					<button onClick={(e) => setPage("log")}>I already have a user</button>
				</div>
			)}
			{page == "todo" && (
				<div className="card">
					<h1>To-do's</h1>

					<input
						type="text"
						value={todo}
						placeholder="Todo"
						onChange={(e) => {
							setTodo(e.target.value);
						}}
					/>
					<button onClick={(e) => createTodo()} disabled={!todo}>
						Create todo
					</button>
					<button
						onClick={(e) => {
							setPage("log");
							setAuthUsername("");
							setAuthPassword("");
							localStorage.clear();
						}}
					>
						Log out
					</button>
				</div>
			)}
			{page == "log" && (
				<div className="card">
					<h1>Login</h1>
					<input
						type="text"
						value={authUsername}
						placeholder="Username"
						onChange={(e) => {
							setAuthUsername(e.target.value);
						}}
					/>
					<input
						type="password"
						value={authPassword}
						placeholder="Password"
						onChange={(e) => {
							setAuthPassword(e.target.value);
						}}
					/>
					<button onClick={(e) => setPage("reg")}>Back to registration</button>
					<button onClick={(e) => login()}>Login</button>
				</div>
			)}
		</div>
	);
}

export default App;
