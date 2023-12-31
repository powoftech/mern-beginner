import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { User } from "../models/user";
import * as NotesApi from "../network/notesApi";
import { SignInInput } from "../network/notesApi";
import styleUtils from "../styles/utils.module.css";
import TextInputField from "./form/TextInputField";
import { useState } from "react";
import { UnauthorizedError } from "../errors/httpError";

interface SignInModalProps {
	onDismiss: () => void;
	onSignInSuccessful: (user: User) => void;
}

const SignInModal = ({ onDismiss, onSignInSuccessful }: SignInModalProps) => {
	const [errorText, setErrorText] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInInput>();

	async function onSubmit(signInBody: SignInInput) {
		try {
			const user = await NotesApi.signIn(signInBody);
			onSignInSuccessful(user);
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				setErrorText(error.message);
			} else {
				alert(error);
			}
			console.error(error);
		}
	}

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Sign In</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{errorText && <Alert variant="danger">{errorText}</Alert>}
				<Form id="signInForm" onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="username"
						label="Username"
						type="text"
						placeholder="Username"
						register={register}
						registerOptions={{ required: "Required" }}
						error={errors.username}
					/>
					<TextInputField
						name="password"
						label="Password"
						type="password"
						placeholder="Password"
						register={register}
						registerOptions={{ required: "Required" }}
						error={errors.password}
					/>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					type="submit"
					form="signInForm"
					disabled={isSubmitting}
					className={styleUtils.widthFull}
				>
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SignInModal;
