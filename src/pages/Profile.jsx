import PageLayout from "../layout/PageLayout";
import FormLayout from "../layout/FormLayout";
import UserForm from "../components/UserForm";

export default function Profile() {
  return (
    <PageLayout position="center">
      <FormLayout>
        <UserForm />
      </FormLayout>
    </PageLayout>
  );
}
