import { useState } from "react";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import PageLayout from "../layout/PageLayout";
import FormLayout from "../layout/FormLayout";
import Card from "../components/Card";

export default function Registeration() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <PageLayout>
      <FormLayout>
        <h2 className="text-2xl font-semibold text-center text-blue-700">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        {isLogin ? <SignInForm key="signin" /> : <SignUpForm key="signup" />}
        <p className="text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline ml-1 font-bold rounded">
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </FormLayout>
    </PageLayout>
  );
}
