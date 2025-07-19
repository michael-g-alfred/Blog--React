import FaceSadIcon from "../icons/FaceSadIcon";
import PageLayout from "../layout/PageLayout";
import { Link } from "react-router";

export default function Notfound() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center gap-4 text-blue-700">
        <FaceSadIcon />
        <h3 className=" text-4xl font-bold">404 - Page Not Found</h3>
        <p className="text-md">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="px-6 py-2 rounded bg-blue-700 text-blue-50 hover:bg-blue-500 transition">
          Go Home
        </Link>
      </div>
    </PageLayout>
  );
}
