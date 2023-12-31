import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import * as NotesApi from "./network/notesApi";
import NotFoundPage from "./pages/NotFoundPage";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import styles from "./styles/App.module.css";

function App() {
	const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showSignInModal, setShowSignInModal] = useState(false);

	useEffect(() => {
		async function fetchAuthenticatedUser() {
			try {
				const user = await NotesApi.getAuthenticatedUser();
				setAuthenticatedUser(user);
			} catch (error) {
				console.error(error);
			}
		}
		fetchAuthenticatedUser();
	}, []);

	return (
		<BrowserRouter>
			<div>
				<NavBar
					authenticatedUser={authenticatedUser}
					onSignUpClicked={() => setShowSignUpModal(true)}
					onSignInClicked={() => setShowSignInModal(true)}
					onSignOutSuccessful={() => setAuthenticatedUser(null)}
				/>

				<Container className={styles.pageContainer}>
					<Routes>
						<Route
							path="/"
							element={<NotesPage authenticatedUser={authenticatedUser} />}
						/>

						<Route path="/privacy" element={<PrivacyPage />} />

						<Route path="/*" element={<NotFoundPage />} />
					</Routes>
				</Container>

				{showSignUpModal && (
					<SignUpModal
						onDismiss={() => setShowSignUpModal(false)}
						onSignUpSuccessful={(user) => {
							setAuthenticatedUser(user);
							setShowSignUpModal(false);
						}}
					/>
				)}

				{showSignInModal && (
					<SignInModal
						onDismiss={() => setShowSignInModal(false)}
						onSignInSuccessful={(user) => {
							setAuthenticatedUser(user);
							setShowSignInModal(false);
						}}
					/>
				)}
			</div>
		</BrowserRouter>
	);
}

export default App;
